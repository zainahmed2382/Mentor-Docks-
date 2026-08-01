import type { AuditOptions, BuiltReport, RawAuditData } from "./types";
import { buildDetailedExplanation } from "./explanationBuilder";

let idCounter = 0;
function nextId(prefix: string): string {
  idCounter += 1;
  return `${prefix}_${Date.now()}_${idCounter}`;
}

function clamp(n: number, min = 0, max = 100): number {
  return Math.min(max, Math.max(min, Math.round(n)));
}

function severityFromScore(score: number | null | undefined): "critical" | "medium" | "minor" {
  if (score == null) return "medium";
  if (score < 0.5) return "critical";
  if (score < 0.75) return "medium";
  return "minor";
}

function mapPsiCategory(auditId: string): BuiltReport["problems"][0]["category"] {
  if (auditId.includes("seo") || auditId.includes("meta") || auditId.includes("canonical")) return "seo";
  if (auditId.includes("accessibility") || auditId.includes("aria") || auditId.includes("alt")) return "accessibility";
  if (auditId.includes("font") || auditId.includes("heading")) return "typography";
  if (auditId.includes("color") || auditId.includes("contrast")) return "color";
  if (auditId.includes("responsive") || auditId.includes("viewport")) return "responsive";
  if (auditId.includes("javascript") || auditId.includes("errors-in-console")) return "code";
  if (auditId.includes("performance") || auditId.includes("render") || auditId.includes("lcp") || auditId.includes("cls")) {
    return "performance";
  }
  return "ux";
}

export function buildAuditReport(data: RawAuditData, options: AuditOptions = {}): BuiltReport {
  const checks = options.checks ?? {};
  const problems: BuiltReport["problems"] = [];
  const recommendations: BuiltReport["recommendations"] = [];

  const { crawl, pageSpeed, browser } = data;
  const html = crawl.htmlAnalysis;
  const targetUrl = crawl.finalUrl || crawl.url || "your website";

  if (!crawl.isAccessible) {
    const title = "Website unreachable";
    const desc = crawl.error || `The server returned HTTP ${crawl.statusCode}. Audits may be incomplete until the site is reachable.`;
    problems.push({
      id: nextId("p"),
      title,
      severity: "critical",
      description: desc,
      category: "performance",
      details: buildDetailedExplanation("unreachable", title, desc, "performance", "critical", { url: targetUrl, statusCode: crawl.statusCode }),
    });
  }

  if (!crawl.httpsSupported) {
    const title = "HTTPS not enforced";
    const desc = "The final URL is not served over HTTPS. Browsers and search engines penalize insecure origins.";
    problems.push({
      id: nextId("p"),
      title,
      severity: "critical",
      description: desc,
      category: "code",
      details: buildDetailedExplanation("https", title, desc, "code", "critical", { url: targetUrl }),
    });
    recommendations.push({
      id: nextId("r"),
      title: "Enable HTTPS redirects",
      description: "Issue a valid TLS certificate and redirect all HTTP traffic to HTTPS with HSTS.",
      pointsAdded: 12,
      category: "security",
    });
  }

  if (checks.securityHeaders !== false && crawl.security.missing.length > 0) {
    const missing = crawl.security.missing.join(", ");
    const title = "Missing security headers";
    const severity = crawl.security.missing.length >= 4 ? "critical" : "medium";
    const desc = `The response is missing recommended headers: ${missing}. These reduce XSS, clickjacking, and MIME-sniffing risk.`;
    problems.push({
      id: nextId("p"),
      title,
      severity,
      description: desc,
      category: "code",
      details: buildDetailedExplanation("security_headers", title, desc, "code", severity, { url: targetUrl, missingHeaders: crawl.security.missing }),
    });
    recommendations.push({
      id: nextId("r"),
      title: "Harden HTTP response headers",
      description: `Add ${missing} on your CDN or origin. Start with Content-Security-Policy, Strict-Transport-Security, and X-Content-Type-Options.`,
      pointsAdded: 10,
      category: "security",
    });
  }

  if (html) {
    if (!html.hasViewport) {
      const title = "Missing viewport meta tag";
      const desc = "No mobile viewport configuration was found, which breaks responsive layout on phones.";
      problems.push({
        id: nextId("p"),
        title,
        severity: "critical",
        description: desc,
        category: "responsive",
        details: buildDetailedExplanation("viewport", title, desc, "responsive", "critical", { url: targetUrl }),
      });
      recommendations.push({
        id: nextId("r"),
        title: "Add viewport meta tag",
        description: 'Insert `<meta name="viewport" content="width=device-width, initial-scale=1">` in the document head.',
        pointsAdded: 20,
        category: "responsive",
      });
    }

    const missingAlt = html.imageCount - html.imagesWithAlt - html.imagesWithEmptyAlt;
    if (missingAlt > 0) {
      const title = "Images missing alt text";
      const severity = missingAlt > 3 ? "critical" : "medium";
      const desc = `${missingAlt} of ${html.imageCount} images lack descriptive alt attributes, hurting screen reader accessibility.`;
      problems.push({
        id: nextId("p"),
        title,
        severity,
        description: desc,
        category: "accessibility",
        details: buildDetailedExplanation("alt_text", title, desc, "accessibility", severity, { url: targetUrl, missingAlt, totalImages: html.imageCount }),
      });
    }

    if (html.headings.h1 === 0) {
      const title = "Missing H1 heading";
      const desc = "No H1 element was detected. A single clear H1 improves SEO and document outline.";
      problems.push({
        id: nextId("p"),
        title,
        severity: "medium",
        description: desc,
        category: "seo",
        details: buildDetailedExplanation("h1_missing", title, desc, "seo", "medium", { url: targetUrl }),
      });
    } else if (html.headings.h1 > 1) {
      const title = "Multiple H1 headings";
      const desc = `Found ${html.headings.h1} H1 tags. Prefer one primary H1 per page for clarity.`;
      problems.push({
        id: nextId("p"),
        title,
        severity: "minor",
        description: desc,
        category: "typography",
        details: buildDetailedExplanation("h1_multiple", title, desc, "typography", "minor", { url: targetUrl }),
      });
    }

    if (checks.seoOptimization !== false) {
      if (!html.metaDescription) {
        const title = "Missing meta description";
        const desc = "No meta description tag was found, which limits control over search result snippets.";
        problems.push({
          id: nextId("p"),
          title,
          severity: "medium",
          description: desc,
          category: "seo",
          details: buildDetailedExplanation("meta_description", title, desc, "seo", "medium", { url: targetUrl }),
        });
      }
      if (html.ogTagsCount === 0) {
        const title = "Missing Open Graph tags";
        const desc = "Open Graph metadata was not detected, so social shares may show generic previews.";
        problems.push({
          id: nextId("p"),
          title,
          severity: "minor",
          description: desc,
          category: "seo",
          details: buildDetailedExplanation("og_tags", title, desc, "seo", "minor", { url: targetUrl }),
        });
      }
    }

    if (html.duplicateIds.length > 0) {
      const title = "Duplicate element IDs";
      const desc = `Duplicate IDs detected (${html.duplicateIds.slice(0, 3).join(", ")}). IDs must be unique for accessibility and scripting.`;
      problems.push({
        id: nextId("p"),
        title,
        severity: "medium",
        description: desc,
        category: "code",
        details: buildDetailedExplanation("duplicate_ids", title, desc, "code", "medium", { url: targetUrl, duplicateIds: html.duplicateIds }),
      });
    }

    if (html.missingFormLabels > 0) {
      const title = "Unlabeled form controls";
      const desc = `${html.missingFormLabels} form fields appear without associated labels or aria-label attributes.`;
      problems.push({
        id: nextId("p"),
        title,
        severity: "medium",
        description: desc,
        category: "accessibility",
        details: buildDetailedExplanation("missing_labels", title, desc, "accessibility", "medium", { url: targetUrl, missingLabels: html.missingFormLabels }),
      });
    }
  }

  if (checks.performanceWebVitals !== false && pageSpeed) {
    if (pageSpeed.error) {
      const title = "PageSpeed Insights unavailable";
      const desc = pageSpeed.error;
      problems.push({
        id: nextId("p"),
        title,
        severity: "medium",
        description: desc,
        category: "performance",
        details: buildDetailedExplanation("psi_error", title, desc, "performance", "medium", { url: targetUrl }),
      });
    } else {
      for (const audit of pageSpeed.audits.slice(0, 8)) {
        const severity = severityFromScore(audit.score);
        const desc = [audit.description, audit.displayValue].filter(Boolean).join(" — ").slice(0, 500);
        const cat = mapPsiCategory(audit.id);
        problems.push({
          id: nextId("p"),
          title: audit.title,
          severity,
          description: desc,
          category: cat,
          details: buildDetailedExplanation(audit.id, audit.title, desc, cat, severity, { url: targetUrl, displayValue: audit.displayValue, auditId: audit.id }),
        });
      }

      const { lcpMs, cls, inpMs } = pageSpeed.coreWebVitals;
      if (lcpMs != null && lcpMs > 2500) {
        const title = "Poor Largest Contentful Paint (LCP)";
        const severity = lcpMs > 4000 ? "critical" : "medium";
        const desc = `LCP measured at ${Math.round(lcpMs)}ms. Google recommends under 2.5s for good user experience.`;
        problems.push({
          id: nextId("p"),
          title,
          severity,
          description: desc,
          category: "performance",
          details: buildDetailedExplanation("lcp", title, desc, "performance", severity, { url: targetUrl, lcpMs }),
        });
      }
      if (cls != null && cls > 0.1) {
        const title = "Layout shift (CLS) above threshold";
        const severity = cls > 0.25 ? "critical" : "medium";
        const desc = `Cumulative Layout Shift is ${cls.toFixed(3)}. Target 0.1 or less.`;
        problems.push({
          id: nextId("p"),
          title,
          severity,
          description: desc,
          category: "performance",
          details: buildDetailedExplanation("cls", title, desc, "performance", severity, { url: targetUrl, cls }),
        });
      }
      if (inpMs != null && inpMs > 200) {
        const title = "Slow interaction response (INP)";
        const severity = inpMs > 500 ? "critical" : "medium";
        const desc = `Interaction to Next Paint is ${Math.round(inpMs)}ms. Good INP is at or below 200ms.`;
        problems.push({
          id: nextId("p"),
          title,
          severity,
          description: desc,
          category: "performance",
          details: buildDetailedExplanation("inp", title, desc, "performance", severity, { url: targetUrl, inpMs }),
        });
      }
    }
  }

  if (browser) {
    if (browser.javascriptErrors.length > 0) {
      const title = "JavaScript runtime errors";
      const desc = browser.javascriptErrors.slice(0, 3).join(" | ");
      problems.push({
        id: nextId("p"),
        title,
        severity: "critical",
        description: desc,
        category: "code",
        details: buildDetailedExplanation("js_errors", title, desc, "code", "critical", { url: targetUrl, jsErrors: browser.javascriptErrors }),
      });
    }
    if (browser.consoleErrors.length > 0) {
      const title = "Console errors detected";
      const desc = browser.consoleErrors.slice(0, 3).join(" | ");
      problems.push({
        id: nextId("p"),
        title,
        severity: "medium",
        description: desc,
        category: "code",
        details: buildDetailedExplanation("console_errors", title, desc, "code", "medium", { url: targetUrl, jsErrors: browser.consoleErrors }),
      });
    }
    if (browser.contrastFailures.length > 0) {
      const title = "Low color contrast";
      const desc = `${browser.contrastFailures.length} text samples failed WCAG AA contrast (4.5:1). Example ratio: ${browser.contrastFailures[0].ratio}:1.`;
      problems.push({
        id: nextId("p"),
        title,
        severity: "medium",
        description: desc,
        category: "color",
        details: buildDetailedExplanation("contrast", title, desc, "color", "medium", { url: targetUrl, contrastRatio: browser.contrastFailures[0].ratio, contrastFailuresCount: browser.contrastFailures.length }),
      });
      recommendations.push({
        id: nextId("r"),
        title: "Fix contrast ratios",
        description: "Increase text/background contrast to at least 4.5:1 for body copy and 3:1 for large text.",
        pointsAdded: 8,
        category: "accessibility",
      });
    }
    if (browser.mobileOverflow) {
      const title = "Horizontal overflow on mobile";
      const desc = "Content wider than the viewport was detected at mobile width, causing horizontal scrolling.";
      problems.push({
        id: nextId("p"),
        title,
        severity: "medium",
        description: desc,
        category: "responsive",
        details: buildDetailedExplanation("mobile_overflow", title, desc, "responsive", "medium", { url: targetUrl }),
      });
    }
  }

  if (crawl.responseTimeMs > 800) {
    const title = "Slow server response (TTFB)";
    const severity = crawl.responseTimeMs > 1500 ? "critical" : "medium";
    const desc = `Initial HTML response took ${crawl.responseTimeMs}ms from the audit runner.`;
    problems.push({
      id: nextId("p"),
      title,
      severity,
      description: desc,
      category: "performance",
      details: buildDetailedExplanation("ttfb", title, desc, "performance", severity, { url: targetUrl, responseTimeMs: crawl.responseTimeMs }),
    });
  }

  const psi = pageSpeed?.categories;
  const lhBrowser = browser?.lighthouse;

  const performance = clamp(
    psi?.performance ||
      lhBrowser?.performance ||
      (crawl.responseTimeMs < 400 ? 85 : crawl.responseTimeMs < 800 ? 70 : 55)
  );
  const accessibility = clamp(
    psi?.accessibility ||
      lhBrowser?.accessibility ||
      (html ? 55 + Math.round(((html.imagesWithAlt / Math.max(1, html.imageCount)) * 25) + (html.semanticTagsCount > 3 ? 10 : 0)) : 50)
  );
  const seo = clamp(
    psi?.seo ||
      lhBrowser?.seo ||
      (html
        ? 60 +
          (html.metaDescription ? 10 : 0) +
          (html.ogTagsCount > 0 ? 8 : 0) +
          (html.headings.h1 === 1 ? 8 : 0)
        : 50)
  );
  const codeQuality = clamp(
    (psi?.bestPractices || lhBrowser?.bestPractices || 70) -
      (html?.duplicateIds.length ? 8 : 0) -
      (browser?.javascriptErrors.length ? 15 : 0)
  );
  const responsiveness = clamp(
    (html?.hasViewport ? 88 : 42) - (browser?.mobileOverflow ? 18 : 0)
  );
  const typography = clamp(
    70 +
      (html && html.headings.h1 === 1 ? 12 : html && html.headings.h1 === 0 ? -15 : 0) +
      (html && html.headings.total >= 3 ? 8 : 0)
  );
  const colorTheme = clamp(
    78 - (browser?.contrastFailures.length ? browser.contrastFailures.length * 4 : 0)
  );
  const uiUx = clamp((responsiveness + typography + colorTheme) / 3);

  const metrics = {
    codeQuality,
    uiUx,
    responsiveness,
    typography,
    colorTheme,
    accessibility,
    performance,
    seo,
  };

  const score = clamp(
    (metrics.codeQuality +
      metrics.uiUx +
      metrics.responsiveness +
      metrics.typography +
      metrics.colorTheme +
      metrics.accessibility +
      metrics.performance +
      metrics.seo) /
      8
  );

  if (recommendations.length === 0) {
    recommendations.push({
      id: nextId("r"),
      title: "Maintain performance budgets",
      description: "Keep monitoring Core Web Vitals after each deploy using Lighthouse CI or PageSpeed Insights.",
      pointsAdded: 5,
      category: "performance",
    });
  }

  const healthMessage =
    score >= 90
      ? "Excellent audit results. Core Web Vitals, accessibility, and SEO signals are strong."
      : score >= 75
      ? "Solid foundation with room to improve performance, contrast, or metadata."
      : score >= 55
      ? "Several critical issues were detected. Address security headers, accessibility, and loading performance first."
      : "Major issues found. Fix HTTPS, viewport, JavaScript errors, and Core Web Vitals before launch.";

  return {
    score,
    healthMessage,
    metrics,
    problems: problems.slice(0, 20),
    recommendations: recommendations.slice(0, 12),
  };
}
