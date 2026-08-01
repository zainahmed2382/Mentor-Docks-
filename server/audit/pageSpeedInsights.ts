import type { CoreWebVitals, LighthouseCategoryScores, PageSpeedResult, PsiAuditItem, ScanStrategy } from "./types";

const PSI_ENDPOINT = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed";

function scoreFromCategory(cat: { score?: number | null } | undefined): number {
  if (cat?.score == null) return 0;
  return Math.round(cat.score * 100);
}

function extractNumeric(audit: any): number | undefined {
  if (typeof audit?.numericValue === "number") return audit.numericValue;
  return undefined;
}

function mapAudits(lighthouseResult: any): { audits: PsiAuditItem[]; opportunities: PsiAuditItem[]; diagnostics: PsiAuditItem[] } {
  const auditsDict = lighthouseResult?.audits || {};
  const allAudits: PsiAuditItem[] = [];
  const opportunities: PsiAuditItem[] = [];
  const diagnostics: PsiAuditItem[] = [];

  for (const [id, audit] of Object.entries(auditsDict) as [string, any][]) {
    if (!audit?.title) continue;
    const score = typeof audit.score === "number" ? audit.score : null;
    if (score !== null && score >= 0.9) continue;
    if (audit.scoreDisplayMode === "notApplicable" || audit.scoreDisplayMode === "manual") continue;

    const item: PsiAuditItem = {
      id,
      title: audit.title,
      description: audit.description || "",
      score,
      displayValue: audit.displayValue,
      numericValue: extractNumeric(audit),
      category: audit.details?.type,
    };

    allAudits.push(item);

    if (audit.details?.type === "opportunity" || (audit.numericValue && audit.numericValue > 0 && score !== null && score < 0.9)) {
      opportunities.push(item);
    } else if (audit.details?.type === "table" || audit.scoreDisplayMode === "informative" || (score !== null && score < 0.9)) {
      diagnostics.push(item);
    }
  }

  allAudits.sort((a, b) => (a.score ?? 1) - (b.score ?? 1));
  opportunities.sort((a, b) => (a.score ?? 1) - (b.score ?? 1));
  diagnostics.sort((a, b) => (a.score ?? 1) - (b.score ?? 1));

  return {
    audits: allAudits.slice(0, 25),
    opportunities: opportunities.slice(0, 15),
    diagnostics: diagnostics.slice(0, 15),
  };
}

function extractCoreWebVitals(lighthouseResult: any): CoreWebVitals {
  const audits = lighthouseResult?.audits || {};
  return {
    lcpMs: extractNumeric(audits["largest-contentful-paint"]) ?? null,
    cls: extractNumeric(audits["cumulative-layout-shift"]) ?? null,
    inpMs: extractNumeric(audits["interaction-to-next-paint"]) ?? extractNumeric(audits["experimental-interaction-to-next-paint"]) ?? null,
    fcpMs: extractNumeric(audits["first-contentful-paint"]) ?? null,
    ttfbMs: extractNumeric(audits["server-response-time"]) ?? extractNumeric(audits["time-to-first-byte"]) ?? null,
    speedIndex: extractNumeric(audits["speed-index"]) ?? null,
  };
}

function extractCategories(lighthouseResult: any): LighthouseCategoryScores {
  const cats = lighthouseResult?.categories || {};
  return {
    performance: scoreFromCategory(cats.performance),
    accessibility: scoreFromCategory(cats.accessibility),
    seo: scoreFromCategory(cats.seo),
    bestPractices: scoreFromCategory(cats["best-practices"]),
  };
}

interface PsiCacheEntry {
  timestamp: number;
  data: PageSpeedResult;
}

const psiCache = new Map<string, PsiCacheEntry>();
const inFlightPsiMap = new Map<string, Promise<PageSpeedResult>>();
const PSI_CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes cache

const FALLBACK_PAGESPEED_API_KEY = "AIzaSyBo4BRKs4JhwUNnUyKC41nIO4omQiiXyNg";

export async function runPageSpeedInsights(url: string, strategy: ScanStrategy = "mobile"): Promise<PageSpeedResult> {
  const apiKey = (process.env.PAGESPEED_API_KEY || process.env.GOOGLE_PAGESPEED_API_KEY || FALLBACK_PAGESPEED_API_KEY).trim();

  // Validate URL format before making fetch
  let targetUrl = url;
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      targetUrl = `https://${url}`;
    }
  } catch {
    targetUrl = `https://${url}`;
  }

  const cacheKey = `${targetUrl.toLowerCase()}::${strategy}`;
  const now = Date.now();

  const cached = psiCache.get(cacheKey);
  if (cached && now - cached.timestamp < PSI_CACHE_TTL_MS && !cached.data.error) {
    console.log(`[PageSpeed] Cache hit for ${targetUrl} (${strategy})`);
    return cached.data;
  }

  if (inFlightPsiMap.has(cacheKey)) {
    console.log(`[PageSpeed] Reusing in-flight request for ${targetUrl} (${strategy})`);
    return inFlightPsiMap.get(cacheKey)!;
  }

  const fetchPromise = (async (): Promise<PageSpeedResult> => {
    const params = new URLSearchParams({
      url: targetUrl,
      strategy,
      category: "PERFORMANCE",
    });
    params.append("category", "ACCESSIBILITY");
    params.append("category", "SEO");
    params.append("category", "BEST_PRACTICES");

    if (apiKey) {
      params.set("key", apiKey);
    } else {
      console.warn("[PageSpeed] PAGESPEED_API_KEY is not set. Making request using public Google API quota.");
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000);

    try {
      let response = await fetch(`${PSI_ENDPOINT}?${params.toString()}`, {
        signal: controller.signal,
        headers: { Accept: "application/json" },
      });

      if (!response.ok && (response.status === 400 || response.status === 403 || response.status === 429) && apiKey) {
        // Try without key in case key is restricted or invalid
        params.delete("key");
        response = await fetch(`${PSI_ENDPOINT}?${params.toString()}`, {
          signal: controller.signal,
          headers: { Accept: "application/json" },
        });
      }

      clearTimeout(timeoutId);

      if (!response.ok) {
        const text = await response.text();
        let errorMessage = `PageSpeed Insights API returned status ${response.status}`;
        if (response.status === 400) {
          errorMessage = `Invalid URL or target website unreachable by PageSpeed Insights (${targetUrl}).`;
        } else if (response.status === 429) {
          errorMessage = "PageSpeed Insights rate limit reached. Please set PAGESPEED_API_KEY or try again shortly.";
        } else if (response.status === 403) {
          errorMessage = "PageSpeed Insights API key invalid or unauthorized.";
        }

        console.info(`[PageSpeed] Request response status: ${errorMessage}`);

        return {
          strategy,
          categories: { performance: 0, accessibility: 0, seo: 0, bestPractices: 0 },
          coreWebVitals: { lcpMs: null, cls: null, inpMs: null, fcpMs: null, ttfbMs: null, speedIndex: null },
          audits: [],
          opportunities: [],
          diagnostics: [],
          fetchTime: new Date().toISOString(),
          lighthouseVersion: "",
          error: errorMessage,
        };
      }

      const data = await response.json();
      const lighthouseResult = data.lighthouseResult;

      const { audits, opportunities, diagnostics } = mapAudits(lighthouseResult);

      return {
        strategy,
        categories: extractCategories(lighthouseResult),
        coreWebVitals: extractCoreWebVitals(lighthouseResult),
        audits,
        opportunities,
        diagnostics,
        fetchTime: data.analysisUTCTimestamp || new Date().toISOString(),
        lighthouseVersion: lighthouseResult?.lighthouseVersion || "",
      };
    } catch (err: any) {
      clearTimeout(timeoutId);
      const isTimeout = err?.name === "AbortError";
      const errorMessage = isTimeout
        ? "PageSpeed Insights API request timed out (25s limit). Applied local browser engine analysis."
        : err?.message || "PageSpeed Insights fetch failed.";

      console.info(`[PageSpeed] Analysis status: ${errorMessage}`);

      return {
        strategy,
        categories: { performance: 0, accessibility: 0, seo: 0, bestPractices: 0 },
        coreWebVitals: { lcpMs: null, cls: null, inpMs: null, fcpMs: null, ttfbMs: null, speedIndex: null },
        audits: [],
        opportunities: [],
        diagnostics: [],
        fetchTime: new Date().toISOString(),
        lighthouseVersion: "",
        error: errorMessage,
      };
    }
  })();

  inFlightPsiMap.set(cacheKey, fetchPromise);

  try {
    const res = await fetchPromise;
    if (!res.error) {
      psiCache.set(cacheKey, { timestamp: Date.now(), data: res });
    }
    return res;
  } finally {
    inFlightPsiMap.delete(cacheKey);
  }
}

