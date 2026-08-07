import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { WebsiteScan } from "../types";

function getScoreColor(score: number): string {
  if (score >= 85) return "#10b981"; // emerald
  if (score >= 70) return "#f59e0b"; // amber
  return "#ef4444"; // rose
}

function getScoreLabel(score: number): string {
  if (score >= 85) return "Excellent";
  if (score >= 70) return "Good";
  if (score >= 50) return "Needs Work";
  return "Critical";
}

function getSeverityColor(severity: "critical" | "medium" | "minor"): string {
  switch (severity) {
    case "critical": return "#ef4444";
    case "medium": return "#f59e0b";
    case "minor": return "#3b82f6";
  }
}

function getSeverityBg(severity: "critical" | "medium" | "minor"): string {
  switch (severity) {
    case "critical": return "rgba(239, 68, 68, 0.1)";
    case "medium": return "rgba(245, 158, 11, 0.1)";
    case "minor": return "rgba(59, 130, 246, 0.1)";
  }
}

async function getLogoBase64(): Promise<string | null> {
  try {
    const response = await fetch("/logo.png");
    if (!response.ok) return null;
    const blob = await response.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

export async function downloadPdfReport(scan: WebsiteScan): Promise<void> {
  const metrics = scan.metrics;
  const metricEntries = [
    { label: "UI / UX Heuristics",  score: metrics.uiUx },
    { label: "Code Quality",         score: metrics.codeQuality },
    { label: "Responsiveness",       score: metrics.responsiveness },
    { label: "Typography",           score: metrics.typography },
    { label: "Color Theme",          score: metrics.colorTheme },
    { label: "Accessibility",        score: metrics.accessibility },
    { label: "Performance",          score: metrics.performance },
    { label: "SEO Indexing",         score: metrics.seo },
  ];

  const overallColor = getScoreColor(scan.score);
  const generatedDate = new Date().toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });

  const criticalCount = scan.problems.filter(p => p.severity === "critical").length;
  const mediumCount   = scan.problems.filter(p => p.severity === "medium").length;
  const minorCount    = scan.problems.filter(p => p.severity === "minor").length;

  const logoBase64 = await getLogoBase64();

  // Create an off-screen iframe container
  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.left = "-9999px";
  iframe.style.top = "-9999px";
  iframe.style.width = "794px";
  iframe.style.height = "1123px";
  iframe.style.border = "none";
  iframe.style.visibility = "hidden";
  iframe.style.pointerEvents = "none";
  document.body.appendChild(iframe);

  const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
  if (!iframeDoc) {
    if (iframe.parentNode) iframe.parentNode.removeChild(iframe);
    throw new Error("Unable to access iframe document");
  }

  const logoHtml = logoBase64
    ? `<img src="${logoBase64}" alt="Mentor Docks" style="height:32px;width:32px;object-fit:contain;" />`
    : `<div style="width:32px;height:32px;border-radius:10px;background:linear-gradient(135deg,#6366f1,#8b5cf6);display:flex;align-items:center;justify-content:center;box-shadow:0 0 12px rgba(99,102,241,0.5);">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
       </div>`;

  const metricsRows = metricEntries.map(({ label, score }) => {
    const scoreColor = getScoreColor(score);
    return `
      <div style="margin-bottom:12px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
          <span style="font-size:11px;font-weight:600;color:#e2e8f0;">${label}</span>
          <span style="font-size:12px;font-weight:800;color:${scoreColor};">${score}<span style="font-size:10px;font-weight:500;color:#64748b;">/100</span></span>
        </div>
        <div style="background:rgba(255,255,255,0.06);border-radius:99px;height:6px;width:100%;overflow:hidden;">
          <div style="background:linear-gradient(90deg, ${scoreColor}cc, ${scoreColor});height:100%;width:${score}%;border-radius:99px;"></div>
        </div>
      </div>
    `;
  }).join("");

  // Build the complete HTML document inside iframe
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Space+Grotesk:wght@600;700;800&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    
    body {
      margin: 0;
      padding: 0;
      background: #06070a;
      color: #f8fafc;
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
      -webkit-font-smoothing: antialiased;
    }

    .pdf-page {
      width: 794px;
      height: 1123px;
      background: #0a0b10;
      color: #f8fafc;
      padding: 36px 40px;
      box-sizing: border-box;
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    /* Ambient background glow */
    .pdf-page::before {
      content: '';
      position: absolute;
      top: -100px; right: -100px;
      width: 400px; height: 400px;
      background: radial-gradient(circle, rgba(99, 102, 241, 0.12) 0%, rgba(139, 92, 246, 0.04) 50%, transparent 70%);
      border-radius: 50%;
      pointer-events: none;
    }
    .pdf-page::after {
      content: '';
      position: absolute;
      bottom: -100px; left: -100px;
      width: 350px; height: 350px;
      background: radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 70%);
      border-radius: 50%;
      pointer-events: none;
    }

    .page-main {
      position: relative;
      z-index: 1;
      flex: 1;
    }

    /* Header Cover Card */
    .cover-card {
      background: linear-gradient(135deg, rgba(19, 21, 33, 0.95) 0%, rgba(26, 29, 46, 0.95) 100%);
      border: 1px solid rgba(99, 102, 241, 0.3);
      border-radius: 20px;
      padding: 24px 28px;
      margin-bottom: 20px;
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.4);
    }
    .cover-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 18px;
    }
    .brand-group {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .brand-title {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 18px;
      font-weight: 800;
      color: #ffffff;
      letter-spacing: -0.02em;
    }
    .brand-sub {
      font-size: 9px;
      font-weight: 700;
      color: #818cf8;
      text-transform: uppercase;
      letter-spacing: 0.12em;
    }

    .score-badge-card {
      background: rgba(10, 11, 16, 0.8);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 16px;
      padding: 10px 20px;
      text-align: center;
      min-width: 100px;
    }
    .score-num {
      font-size: 34px;
      font-weight: 900;
      line-height: 1;
      color: ${overallColor};
    }
    .score-denom {
      font-size: 11px;
      font-weight: 600;
      color: #64748b;
    }
    .score-pill {
      display: inline-block;
      margin-top: 4px;
      padding: 2px 8px;
      border-radius: 99px;
      font-size: 9px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      background: ${overallColor}20;
      color: ${overallColor};
      border: 1px solid ${overallColor}40;
    }

    .report-heading {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 22px;
      font-weight: 800;
      color: #ffffff;
      margin-bottom: 6px;
      letter-spacing: -0.01em;
    }
    .url-chip {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: rgba(99, 102, 241, 0.12);
      border: 1px solid rgba(99, 102, 241, 0.25);
      border-radius: 8px;
      padding: 5px 12px;
      font-family: monospace;
      font-size: 12px;
      font-weight: 600;
      color: #a5b4fc;
      margin-bottom: 14px;
    }

    .meta-row {
      display: flex;
      gap: 16px;
    }
    .meta-item {
      font-size: 10px;
      color: #94a3b8;
    }
    .meta-item strong {
      color: #f1f5f9;
    }

    /* Compact Top Header for page 2+ */
    .page-header-compact {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 14px;
      margin-bottom: 20px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      position: relative;
      z-index: 1;
    }
    .page-header-compact .brand {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .page-header-compact .title {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 13px;
      font-weight: 700;
      color: #e2e8f0;
    }
    .page-header-compact .url {
      font-family: monospace;
      font-size: 10px;
      color: #818cf8;
    }

    /* Section Cards */
    .section-card {
      background: rgba(18, 20, 31, 0.85);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 16px;
      padding: 18px 22px;
      margin-bottom: 18px;
    }

    .section-title {
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: #94a3b8;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    /* Executive Assessment Box */
    .health-box {
      background: linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(99, 102, 241, 0.06) 100%);
      border: 1px solid rgba(139, 92, 246, 0.3);
      border-radius: 16px;
      padding: 16px 20px;
      margin-bottom: 20px;
    }
    .health-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #c084fc;
      margin-bottom: 6px;
    }
    .health-text {
      font-size: 12px;
      line-height: 1.6;
      color: #e2e8f0;
      font-weight: 500;
    }

    /* Severity Counters Row */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 14px;
      margin-bottom: 20px;
    }
    .stat-card {
      border-radius: 14px;
      padding: 14px 16px;
      text-align: center;
      position: relative;
      overflow: hidden;
    }
    .stat-card.critical {
      background: rgba(239, 68, 68, 0.08);
      border: 1px solid rgba(239, 68, 68, 0.25);
    }
    .stat-card.medium {
      background: rgba(245, 158, 11, 0.08);
      border: 1px solid rgba(245, 158, 11, 0.25);
    }
    .stat-card.minor {
      background: rgba(59, 130, 246, 0.08);
      border: 1px solid rgba(59, 130, 246, 0.25);
    }

    .stat-num {
      font-size: 30px;
      font-weight: 900;
      line-height: 1;
      margin-bottom: 4px;
    }
    .stat-card.critical .stat-num { color: #f87171; }
    .stat-card.medium .stat-num { color: #fbbf24; }
    .stat-card.minor .stat-num { color: #60a5fa; }

    .stat-lbl {
      font-size: 9.5px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }
    .stat-card.critical .stat-lbl { color: #fca5a5; }
    .stat-card.medium .stat-lbl { color: #fde68a; }
    .stat-card.minor .stat-lbl { color: #bfdbfe; }

    /* Metrics Grid */
    .metrics-2col {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0 28px;
    }

    /* Issue Card */
    .issue-card {
      background: rgba(18, 20, 31, 0.9);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 14px;
      padding: 14px 18px;
      margin-bottom: 12px;
      position: relative;
    }
    .issue-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 12px;
      margin-bottom: 6px;
    }
    .issue-title {
      font-size: 13px;
      font-weight: 700;
      color: #f1f5f9;
      flex: 1;
      line-height: 1.35;
    }
    .issue-sev {
      font-size: 9px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      padding: 3px 8px;
      border-radius: 99px;
      white-space: nowrap;
    }
    .issue-desc {
      font-size: 11px;
      line-height: 1.5;
      color: #94a3b8;
    }

    /* Recommendation Card */
    .rec-card {
      background: rgba(18, 20, 31, 0.9);
      border: 1px solid rgba(99, 102, 241, 0.25);
      border-radius: 14px;
      padding: 14px 18px;
      margin-bottom: 12px;
    }
    .rec-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 12px;
      margin-bottom: 6px;
    }
    .rec-title {
      font-size: 13px;
      font-weight: 700;
      color: #f1f5f9;
      flex: 1;
      line-height: 1.35;
    }
    .rec-points {
      background: linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(139, 92, 246, 0.2));
      border: 1px solid rgba(99, 102, 241, 0.4);
      color: #a5b4fc;
      font-size: 11px;
      font-weight: 800;
      padding: 3px 10px;
      border-radius: 99px;
      white-space: nowrap;
    }
    .rec-desc {
      font-size: 11px;
      line-height: 1.5;
      color: #94a3b8;
    }

    /* Page Footer */
    .pdf-footer {
      position: relative;
      z-index: 1;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      padding-top: 14px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 10px;
      color: #64748b;
    }
    .pdf-footer strong {
      color: #818cf8;
    }
  </style>
</head>
<body>
  <div id="pdf-container"></div>
</body>
</html>
  `;

  iframeDoc.open();
  iframeDoc.write(htmlContent);
  iframeDoc.close();

  // Wait for Google fonts to render inside iframe
  try {
    if (iframe.contentWindow?.document.fonts && iframe.contentWindow.document.fonts.ready) {
      await iframe.contentWindow.document.fonts.ready;
    }
    await new Promise((resolve) => setTimeout(resolve, 200));

    const container = iframeDoc.getElementById("pdf-container");
    if (!container) throw new Error("Target container missing");

    // Dynamic Pagination Builder
    const pages: HTMLElement[] = [];

    // --- BUILD PAGE 1 (Cover + Health Summary + Severity Counters + Score Metrics) ---
    const page1 = iframeDoc.createElement("div");
    page1.className = "pdf-page";
    page1.innerHTML = `
      <div class="page-main">
        <!-- COVER CARD -->
        <div class="cover-card">
          <div class="cover-top">
            <div class="brand-group">
              ${logoHtml}
              <div>
                <div class="brand-title">MENTOR DOCKS</div>
                <div class="brand-sub">AI Design Intelligence Audit</div>
              </div>
            </div>
            <div class="score-badge-card">
              <div class="score-num">${scan.score}</div>
              <div class="score-denom">/100</div>
              <div class="score-pill">${getScoreLabel(scan.score)}</div>
            </div>
          </div>

          <div class="report-heading">Website Audit Report</div>
          <div class="url-chip">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><path d="M2 12h20"/></svg>
            ${scan.url}
          </div>

          <div class="meta-row">
            <div class="meta-item">Generated: <strong>${generatedDate}</strong></div>
            <div class="meta-item">Scan Date: <strong>${scan.date}</strong></div>
            <div class="meta-item">Status: <strong style="color:#34d399;">✓ Completed</strong></div>
          </div>
        </div>

        <!-- AI ASSESSMENT SUMMARY -->
        <div class="health-box">
          <div class="health-title">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3z"/></svg>
            AI Executive Assessment
          </div>
          <div class="health-text">${scan.healthMessage}</div>
        </div>

        <!-- SEVERITY STATS ROW -->
        <div class="stats-grid">
          <div class="stat-card critical">
            <div class="stat-num">${criticalCount}</div>
            <div class="stat-lbl">Critical Issues</div>
          </div>
          <div class="stat-card medium">
            <div class="stat-num">${mediumCount}</div>
            <div class="stat-lbl">Medium Issues</div>
          </div>
          <div class="stat-card minor">
            <div class="stat-num">${minorCount}</div>
            <div class="stat-lbl">Minor Issues</div>
          </div>
        </div>

        <!-- SCORE METRICS GRID -->
        <div class="section-card">
          <div class="section-title">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
            Score Metrics Overview — 8 AI Crawlers
          </div>
          <div class="metrics-2col">
            ${metricsRows}
          </div>
        </div>
      </div>

      <div class="pdf-footer">
        <span>Generated by <strong>Mentor Docks AI Studio</strong></span>
        <span>Target: <strong>${scan.url}</strong></span>
        <span class="page-num-placeholder">Page 1</span>
      </div>
    `;
    container.appendChild(page1);
    pages.push(page1);

    // --- BUILD PAGE 2+ FOR ISSUES & RECOMMENDATIONS IF PRESENT ---
    const hasProblems = scan.problems.length > 0;
    const hasRecs = scan.recommendations.length > 0;

    if (hasProblems || hasRecs) {
      let currentPage: HTMLElement | null = null;
      let currentContentArea: HTMLElement | null = null;

      const createNewPage = (): { page: HTMLElement; content: HTMLElement } => {
        const page = iframeDoc.createElement("div");
        page.className = "pdf-page";
        page.innerHTML = `
          <div class="page-main">
            <div class="page-header-compact">
              <div class="brand">
                ${logoHtml}
                <div class="title">MENTOR DOCKS — Audit Findings</div>
              </div>
              <div class="url">${scan.url}</div>
            </div>
            <div class="dynamic-content-area"></div>
          </div>
          <div class="pdf-footer">
            <span>Generated by <strong>Mentor Docks AI Studio</strong></span>
            <span>Target: <strong>${scan.url}</strong></span>
            <span class="page-num-placeholder">Page</span>
          </div>
        `;
        container.appendChild(page);
        pages.push(page);
        const content = page.querySelector(".dynamic-content-area") as HTMLElement;
        return { page, content };
      };

      // Start Page 2
      const firstSubPage = createNewPage();
      currentPage = firstSubPage.page;
      currentContentArea = firstSubPage.content;

      const MAX_PAGE_HEIGHT = 880; // Max allowed height inside dynamic-content-area before spilling to next page

      // Helper to append section header
      const appendSectionHeader = (title: string, iconSvg: string) => {
        const headerEl = iframeDoc.createElement("div");
        headerEl.className = "section-title";
        headerEl.style.fontSize = "12px";
        headerEl.style.marginTop = "8px";
        headerEl.style.marginBottom = "14px";
        headerEl.style.paddingBottom = "6px";
        headerEl.style.borderBottom = "1px solid rgba(255,255,255,0.08)";
        headerEl.innerHTML = `${iconSvg} <span>${title}</span>`;
        currentContentArea!.appendChild(headerEl);
      };

      // Render Identified Issues
      if (hasProblems) {
        appendSectionHeader(
          `Identified Issues (${scan.problems.length})`,
          `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`
        );

        for (const p of scan.problems) {
          const sevColor = getSeverityColor(p.severity);
          const sevBg = getSeverityBg(p.severity);
          const titleText = p.details?.friendlyTitle || p.title;
          const problemText = p.details?.simpleProblem || p.description;
          const fixText = p.details?.bestRecommendation || (p.details?.howToFixSteps?.length ? p.details.howToFixSteps.join(". ") : "Apply standard web optimizations.");
          const locationText = p.details?.whereIsIssue || p.category;
          const priorityVal = p.details?.priority || p.severity;

          const card = iframeDoc.createElement("div");
          card.className = "issue-card";
          card.style.borderLeft = `4px solid ${sevColor}`;
          card.innerHTML = `
            <div class="issue-header">
              <div class="issue-title">${titleText}</div>
              <div style="display:flex;gap:6px;align-items:center;">
                <div class="issue-sev" style="background:${sevBg};color:${sevColor};border:1px solid ${sevColor}40;">📍 ${locationText}</div>
                <div class="issue-sev" style="background:${sevBg};color:${sevColor};border:1px solid ${sevColor}40;">⭐ ${priorityVal}</div>
              </div>
            </div>
            <div class="issue-desc" style="margin-top:6px;font-size:12px;color:#1e293b;"><strong>🔴 Problem:</strong> ${problemText}</div>
            <div class="issue-fix" style="margin-top:6px;font-size:11px;color:#15803d;background:#f0fdf4;padding:8px 10px;border-radius:6px;border:1px solid #bbf7d0;"><strong>✅ How to Fix It:</strong> ${fixText}</div>
          `;

          currentContentArea!.appendChild(card);

          // If content height exceeds limit, move card to a new page
          if (currentContentArea!.offsetHeight > MAX_PAGE_HEIGHT) {
            currentContentArea!.removeChild(card);
            const nextSub = createNewPage();
            currentPage = nextSub.page;
            currentContentArea = nextSub.content;
            currentContentArea.appendChild(card);
          }
        }
      }

      // Render AI Recommendations
      if (hasRecs) {
        // Check space for Recommendations Header
        if (currentContentArea!.offsetHeight > MAX_PAGE_HEIGHT - 120) {
          const nextSub = createNewPage();
          currentPage = nextSub.page;
          currentContentArea = nextSub.content;
        }

        appendSectionHeader(
          `AI-Powered Recommendations (${scan.recommendations.length})`,
          `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#818cf8" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`
        );

        for (const r of scan.recommendations) {
          const card = iframeDoc.createElement("div");
          card.className = "rec-card";
          card.innerHTML = `
            <div class="rec-header">
              <div class="rec-title">${r.title}</div>
              <div class="rec-points">+${r.pointsAdded} pts</div>
            </div>
            <div class="rec-desc">${r.description}</div>
          `;

          currentContentArea!.appendChild(card);

          if (currentContentArea!.offsetHeight > MAX_PAGE_HEIGHT) {
            currentContentArea!.removeChild(card);
            const nextSub = createNewPage();
            currentPage = nextSub.page;
            currentContentArea = nextSub.content;
            currentContentArea.appendChild(card);
          }
        }
      }
    }

    // --- UPDATE FOOTER PAGE NUMBERS (e.g. Page 1 of 3) ---
    const totalPages = pages.length;
    pages.forEach((p, idx) => {
      const pageNumEl = p.querySelector(".page-num-placeholder");
      if (pageNumEl) {
        pageNumEl.textContent = `Page ${idx + 1} of ${totalPages}`;
      }
    });

    // --- RENDER PAGES TO CANVAS & CONVERT TO A4 PDF ---
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4"
    });

    for (let i = 0; i < totalPages; i++) {
      if (i > 0) pdf.addPage();
      const pageEl = pages[i];

      const canvas = await html2canvas(pageEl, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#0a0b10",
        windowWidth: 794,
        windowHeight: 1123
      });

      const imgData = canvas.toDataURL("image/png");
      pdf.addImage(imgData, "PNG", 0, 0, 210, 297);
    }

    const sanitizedUrl = scan.url.replace(/^https?:\/\//, "").replace(/[^a-zA-Z0-9.-]/g, "_");
    const filename = `Mentor_Docks_Audit_Report_${sanitizedUrl}.pdf`;
    pdf.save(filename);

  } finally {
    if (iframe.parentNode) {
      iframe.parentNode.removeChild(iframe);
    }
  }
}
