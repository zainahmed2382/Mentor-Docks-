import type { DetailedAuditExplanation } from "../../src/types";

export type ScanStrategy = "mobile" | "desktop";

export interface AuditOptions {
  deep?: boolean;
  strategy?: ScanStrategy;
  checks?: {
    domStructure?: boolean;
    contrastWcag?: boolean;
    performanceWebVitals?: boolean;
    securityHeaders?: boolean;
    seoOptimization?: boolean;
  };
}

export interface SecurityHeaderFindings {
  present: Record<string, string | null>;
  missing: string[];
  score: number;
}

export interface HtmlAnalysis {
  pageTitle: string;
  metaDescription: string;
  hasViewport: boolean;
  hasLang: boolean;
  hasCanonical: boolean;
  imageCount: number;
  imagesWithAlt: number;
  imagesWithEmptyAlt: number;
  semanticTagsCount: number;
  headings: { h1: number; h2: number; h3: number; total: number };
  ogTagsCount: number;
  scriptTagsCount: number;
  styleTagsCount: number;
  inlineStyleCount: number;
  linkTagsCount: number;
  isWordPress: boolean;
  isShopify: boolean;
  isReact: boolean;
  htmlSizeBytes: number;
  duplicateIds: string[];
  missingFormLabels: number;
  iframeCount: number;
}

export interface HttpCrawlResult {
  url: string;
  finalUrl: string;
  httpsSupported: boolean;
  isAccessible: boolean;
  statusCode: number;
  responseTimeMs: number;
  html: string;
  headers: Record<string, string>;
  security: SecurityHeaderFindings;
  htmlAnalysis: HtmlAnalysis | null;
  error?: string;
}

export interface CoreWebVitals {
  lcpMs: number | null;
  cls: number | null;
  inpMs: number | null;
  fcpMs: number | null;
  ttfbMs: number | null;
  speedIndex: number | null;
}

export interface LighthouseCategoryScores {
  performance: number;
  accessibility: number;
  seo: number;
  bestPractices: number;
}

export interface PsiAuditItem {
  id: string;
  title: string;
  description: string;
  score: number | null;
  displayValue?: string;
  numericValue?: number;
  category?: string;
}

export interface PageSpeedResult {
  strategy: ScanStrategy;
  categories: LighthouseCategoryScores;
  coreWebVitals: CoreWebVitals;
  audits: PsiAuditItem[];
  opportunities: PsiAuditItem[];
  diagnostics: PsiAuditItem[];
  fetchTime: string;
  lighthouseVersion: string;
  error?: string;
}

export interface BrowserAuditResult {
  javascriptErrors: string[];
  consoleErrors: string[];
  contrastFailures: Array<{ selector: string; ratio: number; required: number }>;
  mobileOverflow: boolean;
  desktopOverflow: boolean;
  lighthouse?: LighthouseCategoryScores;
  error?: string;
}

export interface RawAuditData {
  crawl: HttpCrawlResult;
  pageSpeed: PageSpeedResult | null;
  browser: BrowserAuditResult | null;
}

export interface BuiltReport {
  score: number;
  healthMessage: string;
  metrics: {
    codeQuality: number;
    uiUx: number;
    responsiveness: number;
    typography: number;
    colorTheme: number;
    accessibility: number;
    performance: number;
    seo: number;
  };
  problems: Array<{
    id: string;
    title: string;
    severity: "critical" | "medium" | "minor";
    description: string;
    category: "code" | "ux" | "responsive" | "color" | "performance" | "accessibility" | "seo" | "typography";
    details?: DetailedAuditExplanation;
  }>;
  recommendations: Array<{
    id: string;
    title: string;
    description: string;
    pointsAdded: number;
    category: string;
  }>;
}
