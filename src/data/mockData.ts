import { WebsiteScan } from "../types";

export const initialHistory: WebsiteScan[] = [
  {
    id: "scan-example",
    url: "https://example.com",
    date: "Oct 24, 2024",
    score: 82,
    status: "completed",
    healthMessage: "Website health is good, but performance optimization is needed.",
    metrics: {
      codeQuality: 88,
      uiUx: 92,
      responsiveness: 95,
      typography: 85,
      colorTheme: 90,
      accessibility: 78,
      performance: 65,
      seo: 80,
    },
    problems: [
      {
        id: "ex-p1",
        title: "Unoptimized Images",
        severity: "critical",
        description: "Several images are missing WebP formats and are over 1MB, severely impacting load times.",
        category: "performance",
      },
      {
        id: "ex-p2",
        title: "Low Contrast Elements",
        severity: "medium",
        description: "Secondary text colors fail WCAG AAA contrast requirements against the dark background.",
        category: "accessibility",
      },
      {
        id: "ex-p3",
        title: "Broken Footer Links",
        severity: "minor",
        description: "Two links in the footer navigation return 404 errors.",
        category: "responsive",
      },
    ],
    recommendations: [
      {
        id: "ex-r1",
        title: "Implement Image Compression Pipeline",
        description: "Automatically convert uploads to WebP.",
        pointsAdded: 15,
        category: "performance",
      },
      {
        id: "ex-r2",
        title: "Adjust Secondary Text Opacity",
        description: "Increase opacity from 60% to 80% to meet WCAG standards.",
        pointsAdded: 5,
        category: "accessibility",
      },
    ],
  },
  {
    id: "scan-stripe",
    url: "https://stripe.com",
    date: "Oct 18, 2024",
    score: 96,
    status: "completed",
    healthMessage: "Outstanding craftsmanship! The visual hierarchy, responsiveness, and performance are near flawless.",
    metrics: {
      codeQuality: 98,
      uiUx: 97,
      responsiveness: 99,
      typography: 94,
      colorTheme: 96,
      accessibility: 91,
      performance: 95,
      seo: 95,
    },
    problems: [
      {
        id: "str-p1",
        title: "Heavy Font Files",
        severity: "minor",
        description: "The primary sans-serif display font imports could be optimized by self-hosting to save 120ms of rendering latency.",
        category: "typography",
      },
      {
        id: "str-p2",
        title: "Decorative Gradient Contrast",
        severity: "minor",
        description: "The decorative background grid mesh lines have slightly low contrast when intersecting subtext tags.",
        category: "color",
      },
    ],
    recommendations: [
      {
        id: "str-r1",
        title: "Optimize Font Preloading",
        description: "Preload and self-host the custom typography files to eliminate flash of unstyled text.",
        pointsAdded: 2,
        category: "typography",
      },
      {
        id: "str-r2",
        title: "Adjust Decorative Grids",
        description: "Increase background contrast margins to secure WCAG triple-A compliance on overlay text blocks.",
        pointsAdded: 2,
        category: "color",
      },
    ],
  },
  {
    id: "scan-portfolio",
    url: "https://myportfolio.dev",
    date: "Sep 30, 2024",
    score: 74,
    status: "completed",
    healthMessage: "Aesthetically pleasing visual identity, but accessibility contrast ratios and SEO tags are lacking.",
    metrics: {
      codeQuality: 80,
      uiUx: 70,
      responsiveness: 85,
      typography: 78,
      colorTheme: 82,
      accessibility: 65,
      performance: 70,
      seo: 62,
    },
    problems: [
      {
        id: "port-p1",
        title: "Missing Social Graph Index Tags",
        severity: "critical",
        description: "Missing OpenGraph description and standard meta tags, reducing overall social indexability and site SEO rankings.",
        category: "seo",
      },
      {
        id: "port-p2",
        title: "Unlabeled Social Buttons",
        severity: "medium",
        description: "Social links and touch-target action icons do not feature clear aria-label attributes, blocking screen reader navigation.",
        category: "accessibility",
      },
      {
        id: "port-p3",
        title: "Massive Portfolio Hero Art",
        severity: "medium",
        description: "The uncompressed background showcase image is 4.2MB, slowing mobile loading speeds by 2.4s.",
        category: "performance",
      },
    ],
    recommendations: [
      {
        id: "port-r1",
        title: "Inject Structured JSON-LD Schemas",
        description: "Integrate full OpenGraph metadata cards to enhance search crawler discoverability.",
        pointsAdded: 18,
        category: "seo",
      },
      {
        id: "port-r2",
        title: "Add Aria-Labels to Portfolios",
        description: "Provide screen readers with text equivalents on icon buttons to raise the accessibility rating.",
        pointsAdded: 10,
        category: "accessibility",
      },
    ],
  },
];

export function generateProceduralScan(url: string): WebsiteScan {
  let cleanUrl = url.trim();
  if (!cleanUrl.startsWith("http://") && !cleanUrl.startsWith("https://")) {
    cleanUrl = `https://${cleanUrl}`;
  }

  // Simple clean domain string for naming
  let domain = cleanUrl.replace("https://", "").replace("http://", "").split("/")[0];

  // Hash the URL to get semi-deterministic results
  let hash = 0;
  for (let i = 0; i < domain.length; i++) {
    hash = domain.charCodeAt(i) + ((hash << 5) - hash);
  }
  hash = Math.abs(hash);

  // Generate metrics
  const codeQuality = 75 + (hash % 21); // 75-95
  const uiUx = 70 + ((hash >> 1) % 26); // 70-95
  const responsiveness = 78 + ((hash >> 2) % 21); // 78-98
  const typography = 72 + ((hash >> 3) % 24); // 72-95
  const colorTheme = 75 + ((hash >> 4) % 22); // 75-96
  const accessibility = 62 + ((hash >> 5) % 31); // 62-92
  const performance = 55 + ((hash >> 6) % 39); // 55-93
  const seo = 65 + ((hash >> 7) % 31); // 65-95

  const avg = Math.round(
    (codeQuality + uiUx + responsiveness + typography + colorTheme + accessibility + performance + seo) / 8
  );

  const healthMessage =
    avg >= 92
      ? "Outstanding design standards! This website is highly optimized with top-tier accessibility and responsive mechanics."
      : avg >= 80
      ? `Website health is solid, but performance and accessibility optimization is recommended.`
      : "Substantial layout, script weight, and color accessibility limitations found.";

  const problems = [];
  const recommendations = [];

  // Add 1-3 specific issues
  if (performance < 75) {
    problems.push({
      id: `p-perf-${hash}`,
      title: "Bloated Resource Payloads",
      severity: performance < 65 ? "critical" : "medium" as const,
      description: `Unoptimized landing page assets on ${domain} delay time-to-interactive, increasing bounce rates on mobile networks.`,
      category: "performance" as const,
    });
    recommendations.push({
      id: `r-perf-${hash}`,
      title: "Establish Visual Compression Pipeline",
      description: "Compress large raster items and deploy AVIF/WebP placeholders.",
      pointsAdded: 15,
      category: "performance",
    });
  }

  if (accessibility < 78) {
    problems.push({
      id: `p-access-${hash}`,
      title: "Contrast Discrepancies",
      severity: accessibility < 68 ? "critical" : "medium" as const,
      description: "Multiple text overlays fail the standard WCAG AA contrast ratio guidelines, reducing reading clarity.",
      category: "accessibility" as const,
    });
    recommendations.push({
      id: `r-access-${hash}`,
      title: "Improve Font contrast levels",
      description: "Raise secondary and subtext font color saturation values to achieve 4.5:1 ratio.",
      pointsAdded: 8,
      category: "accessibility",
    });
  }

  if (uiUx < 82) {
    problems.push({
      id: `p-ux-${hash}`,
      title: "Cognitive Layout Complexity",
      severity: "minor" as const,
      description: "Dense information blocks and inconsistent spacing create a complex visual hierarchy.",
      category: "ux" as const,
    });
    recommendations.push({
      id: `r-ux-${hash}`,
      title: "Increase Section Margins",
      description: "Introduce generous negative spaces and bento container layouts to establish logical visual priority.",
      pointsAdded: 5,
      category: "ux",
    });
  }

  // Ensure we always have at least one problem/recommendation
  if (problems.length === 0) {
    problems.push({
      id: `p-minor-${hash}`,
      title: "Redundant CSS Declarations",
      severity: "minor" as const,
      description: "Some duplicate style variables found, slightly expanding stylesheet bundle sizes.",
      category: "code" as const,
    });
    recommendations.push({
      id: `r-minor-${hash}`,
      title: "Tree-Shake Styling Bundles",
      description: "Clean up unused style variables and classes from final client distribution bundles.",
      pointsAdded: 3,
      category: "code",
    });
  }

  return {
    id: `scan-${hash}`,
    url: cleanUrl,
    date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    score: avg,
    status: "completed",
    healthMessage,
    metrics: {
      codeQuality,
      uiUx,
      responsiveness,
      typography,
      colorTheme,
      accessibility,
      performance,
      seo,
    },
    problems,
    recommendations,
  };
}
