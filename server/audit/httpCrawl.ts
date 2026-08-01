import { analyzeHtml } from "./htmlAnalyzer";
import type { AuditOptions, HttpCrawlResult, SecurityHeaderFindings } from "./types";

const SECURITY_HEADERS = [
  "content-security-policy",
  "strict-transport-security",
  "x-content-type-options",
  "x-frame-options",
  "referrer-policy",
  "permissions-policy",
];

function evaluateSecurityHeaders(headers: Record<string, string>): SecurityHeaderFindings {
  const present: Record<string, string | null> = {};
  const missing: string[] = [];

  for (const name of SECURITY_HEADERS) {
    const value = headers[name] ?? headers[name.toLowerCase()];
    if (value) present[name] = value;
    else {
      present[name] = null;
      missing.push(name);
    }
  }

  const score = Math.round(((SECURITY_HEADERS.length - missing.length) / SECURITY_HEADERS.length) * 100);
  return { present, missing, score };
}

function normalizeHeaderRecord(raw: Headers): Record<string, string> {
  const out: Record<string, string> = {};
  raw.forEach((value, key) => {
    out[key.toLowerCase()] = value;
  });
  return out;
}

export async function crawlWebsite(url: string, options: AuditOptions = {}): Promise<HttpCrawlResult> {
  const checks = options.checks ?? {};
  const runSecurity = checks.securityHeaders !== false;

  const start = Date.now();
  let finalUrl = url;
  let statusCode = 0;
  let html = "";
  let headers: Record<string, string> = {};
  let error: string | undefined;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 MentorDocksAudit/1.0",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
      redirect: "follow",
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    statusCode = response.status;
    finalUrl = response.url;
    headers = normalizeHeaderRecord(response.headers);

    if (response.ok) {
      const contentType = response.headers.get("content-type") || "";
      if (contentType.includes("text/html") || contentType.includes("application/xhtml")) {
        html = await response.text();
      } else {
        error = `URL responded with non-HTML content type: ${contentType || "unknown"}`;
      }
    } else {
      error = `HTTP ${response.status} ${response.statusText}`;
    }
  } catch (err: any) {
    error = err?.name === "AbortError" ? "Request timed out after 15 seconds" : err?.message || "Failed to fetch URL";
  }

  const responseTimeMs = Date.now() - start;
  const security = runSecurity ? evaluateSecurityHeaders(headers) : { present: {}, missing: [], score: 100 };

  return {
    url,
    finalUrl,
    httpsSupported: finalUrl.toLowerCase().startsWith("https://"),
    isAccessible: statusCode >= 200 && statusCode < 400,
    statusCode,
    responseTimeMs,
    html,
    headers,
    security,
    htmlAnalysis: html ? analyzeHtml(html) : null,
    error,
  };
}
