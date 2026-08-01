import type { AuditOptions, BrowserAuditResult, LighthouseCategoryScores } from "./types";

const CONTRAST_SCRIPT = `
(() => {
  function parseRgb(color) {
    const m = color.match(/rgba?\\((\\d+),\\s*(\\d+),\\s*(\\d+)/);
    if (!m) return null;
    return [+m[1], +m[2], +m[3]];
  }
  function luminance([r,g,b]) {
    const a = [r,g,b].map(v => {
      v /= 255;
      return v <= 0.03928 ? v/12.92 : Math.pow((v+0.055)/1.055, 2.4);
    });
    return 0.2126*a[0] + 0.7152*a[1] + 0.0722*a[2];
  }
  function contrast(c1, c2) {
    const L1 = luminance(c1);
    const L2 = luminance(c2);
    const lighter = Math.max(L1,L2);
    const darker = Math.min(L1,L2);
    return (lighter + 0.05) / (darker + 0.05);
  }
  const failures = [];
  const nodes = Array.from(document.querySelectorAll('body *')).slice(0, 120);
  for (const el of nodes) {
    const style = window.getComputedStyle(el);
    if (style.display === 'none' || style.visibility === 'hidden') continue;
    const text = (el.textContent || '').trim();
    if (!text || text.length > 80) continue;
    const fg = parseRgb(style.color);
    let bg = parseRgb(style.backgroundColor);
    if (!fg) continue;
    if (!bg || (bg[0]+bg[1]+bg[2] === 0)) {
      let p = el.parentElement;
      while (p) {
        const ps = window.getComputedStyle(p);
        bg = parseRgb(ps.backgroundColor);
        if (bg && (bg[0]+bg[1]+bg[2] !== 0)) break;
        p = p.parentElement;
      }
    }
    if (!bg) continue;
    const ratio = contrast(fg, bg);
    if (ratio < 4.5) {
      failures.push({ selector: el.tagName.toLowerCase(), ratio: Math.round(ratio*100)/100, required: 4.5 });
      if (failures.length >= 8) break;
    }
  }
  return failures;
})()
`;

function scoreFromLighthouseCategories(cats: any): LighthouseCategoryScores {
  const pick = (key: string) => Math.round((cats?.[key]?.score ?? 0) * 100);
  return {
    performance: pick("performance"),
    accessibility: pick("accessibility"),
    seo: pick("seo"),
    bestPractices: pick("best-practices"),
  };
}

export async function runBrowserAudit(url: string, options: AuditOptions = {}): Promise<BrowserAuditResult> {
  const checks = options.checks ?? {};
  const runContrast = checks.contrastWcag !== false;

  const javascriptErrors: string[] = [];
  const consoleErrors: string[] = [];

  try {
    // @ts-ignore
    const puppeteer = await import("puppeteer");
    // @ts-ignore
    const lighthouse = (await import("lighthouse")).default;

    const browser = await puppeteer.default.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
    });

    try {
      const page = await browser.newPage();
      const cdp = await page.createCDPSession();
      await cdp.send("Runtime.enable");
      await cdp.send("Log.enable");

      cdp.on("Runtime.exceptionThrown", (params: any) => {
        const text = params?.exceptionDetails?.text || params?.exceptionDetails?.exception?.description;
        if (text) javascriptErrors.push(String(text).slice(0, 300));
      });

      cdp.on("Log.entryAdded", (entry: any) => {
        if (entry?.entry?.level === "error") {
          consoleErrors.push(String(entry.entry.text || "").slice(0, 300));
        }
      });

      page.on("pageerror", (err: Error) => {
        javascriptErrors.push(err.message.slice(0, 300));
      });

      page.on("console", (msg) => {
        if (msg.type() === "error") {
          consoleErrors.push(msg.text().slice(0, 300));
        }
      });

      let lighthouseScores: LighthouseCategoryScores | undefined;
      // Skip local Lighthouse if PageSpeed Insights is active to avoid duplicate long runs
      if (options.checks?.performanceWebVitals === false) {
        try {
          const wsEndpoint = browser.wsEndpoint();
          const port = Number(new URL(wsEndpoint).port);
          const lhResult = await lighthouse(url, {
            port,
            output: "json",
            logLevel: "error",
            onlyCategories: ["performance", "accessibility", "seo", "best-practices"],
            formFactor: options.strategy === "desktop" ? "desktop" : "mobile",
            screenEmulation: {
              mobile: options.strategy !== "desktop",
              width: options.strategy === "desktop" ? 1350 : 412,
              height: options.strategy === "desktop" ? 940 : 823,
              deviceScaleFactor: 1,
              disabled: false,
            },
          });

          if (lhResult?.lhr?.categories) {
            lighthouseScores = scoreFromLighthouseCategories(lhResult.lhr.categories);
          }
        } catch (lhErr: any) {
          console.warn("[BrowserAudit] Lighthouse run failed:", lhErr?.message);
        }
      }

      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 8000 }).catch(() => null);

      let contrastFailures: BrowserAuditResult["contrastFailures"] = [];
      if (runContrast) {
        try {
          contrastFailures = (await page.evaluate(CONTRAST_SCRIPT)) as BrowserAuditResult["contrastFailures"];
        } catch {
          contrastFailures = [];
        }
      }

      const desktopOverflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth + 2;
      });

      await page.setViewport({ width: 390, height: 844 });
      const mobileOverflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth + 2;
      });

      return {
        javascriptErrors: [...new Set(javascriptErrors)].slice(0, 15),
        consoleErrors: [...new Set(consoleErrors)].slice(0, 15),
        contrastFailures,
        mobileOverflow,
        desktopOverflow,
        lighthouse: lighthouseScores,
      };
    } finally {
      await browser.close();
    }
  } catch (err: any) {
    return {
      javascriptErrors,
      consoleErrors,
      contrastFailures: [],
      mobileOverflow: false,
      desktopOverflow: false,
      error: err?.message || "Browser audit unavailable (Puppeteer/Lighthouse not installed or Chrome failed to launch)",
    };
  }
}
