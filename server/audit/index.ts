import { buildAuditReport } from "./buildReport";
import { crawlWebsite } from "./httpCrawl";
import { normalizeUrl } from "./normalizeUrl";
import { runPageSpeedInsights } from "./pageSpeedInsights";
import type { AuditOptions, BrowserAuditResult, PageSpeedResult, RawAuditData } from "./types";

export type { AuditOptions } from "./types";

interface AuditCacheEntry {
  timestamp: number;
  result: any;
}

const auditCache = new Map<string, AuditCacheEntry>();
const inFlightAuditMap = new Map<string, Promise<any>>();
const AUDIT_CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

export async function runWebsiteAudit(inputUrl: string, options: AuditOptions = {}) {
  const normalized = normalizeUrl(inputUrl);
  if (normalized.ok === false) {
    throw new Error(normalized.error);
  }

  const url = normalized.url;
  const strategy = options.strategy || "mobile";
  const deep = options.deep ?? false;
  const cacheKey = `${url.toLowerCase()}::${strategy}::${deep}`;
  const now = Date.now();

  const cached = auditCache.get(cacheKey);
  if (cached && now - cached.timestamp < AUDIT_CACHE_TTL_MS && !cached.result.auditMeta?.pageSpeedError) {
    console.log(`[Audit] Cache hit for audit ${url} (${strategy})`);
    return {
      ...cached.result,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    };
  }

  if (inFlightAuditMap.has(cacheKey)) {
    console.log(`[Audit] Joining in-flight scan for ${url} (${strategy})`);
    return inFlightAuditMap.get(cacheKey)!;
  }

  const auditPromise = (async () => {
    console.log(`[Audit] Starting parallel scan for ${url} (deep=${deep}, strategy=${strategy})`);

    // Launch all independent tasks in parallel immediately
    const crawlPromise = crawlWebsite(url, options);

    let pageSpeedPromise: Promise<PageSpeedResult | null> = Promise.resolve(null);
    if (options.checks?.performanceWebVitals !== false) {
      pageSpeedPromise = runPageSpeedInsights(url, strategy);
    }

    let browserPromise: Promise<BrowserAuditResult | null> = Promise.resolve(null);
    if (deep && !process.env.VERCEL) {
      browserPromise = import("./browserAudit")
        .then(({ runBrowserAudit }) => runBrowserAudit(url, { ...options, strategy }))
        .catch((err) => {
          console.warn("[Audit] Browser audit skipped:", err?.message);
          return null;
        });
    }

    const [crawl, pageSpeed, browser] = await Promise.all([crawlPromise, pageSpeedPromise, browserPromise]);

    const raw: RawAuditData = {
      crawl,
      pageSpeed,
      browser,
    };

    const report = buildAuditReport(raw, options);

    const result = {
      ...report,
      url,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      status: "completed" as const,
      auditMeta: {
        engine: deep && !process.env.VERCEL ? "lighthouse+puppeteer+psi+http" : "pagespeed+http",
        finalUrl: crawl.finalUrl,
        statusCode: crawl.statusCode,
        responseTimeMs: crawl.responseTimeMs,
        lighthouseVersion: raw.pageSpeed?.lighthouseVersion || null,
        pageSpeedError: raw.pageSpeed?.error || null,
        browserAuditError: raw.browser?.error || null,
      },
    };

    if (!result.auditMeta.pageSpeedError) {
      auditCache.set(cacheKey, { timestamp: Date.now(), result });
    }

    return result;
  })();

  inFlightAuditMap.set(cacheKey, auditPromise);

  try {
    const res = await auditPromise;
    return res;
  } finally {
    inFlightAuditMap.delete(cacheKey);
  }
}

