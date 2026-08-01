export interface ScoreMetrics {
  codeQuality: number;
  uiUx: number;
  responsiveness: number;
  typography: number;
  colorTheme: number;
  accessibility: number;
  performance: number;
  seo: number;
}

export interface ImpactDetails {
  userExperience: string;
  seoRankings: string;
  conversions: string;
}

export interface SolutionOption {
  title: string;
  description: string;
  isRecommended: boolean;
  whyRecommended?: string;
  codeSnippet?: string;
}

export interface DetailedAuditExplanation {
  friendlyTitle: string;
  simpleProblem: string; // 🔴 1. Problem (1 simple sentence)
  whyItHappened: string; // 🤔 2. Why is this happening?
  whyItMattersBullets: string[]; // ⚠️ 3. Why does it matter? (bullet points)
  howToFixSteps: string[]; // ✅ 4. How to fix it (beginner steps)
  bestRecommendation: string; // 💡 5. Best Recommendation
  expectedImprovementBullets: string[]; // 🚀 6. Expected Improvement (bullet points)
  priority: "Critical" | "High" | "Medium" | "Low"; // ⭐ 7. Priority
  difficulty: "Easy" | "Medium" | "Advanced"; // ⏱ 8. Difficulty
  timeRequired: string; // ⌛ 9. Estimated Fix Time
  whereIsIssue: string; // 📍 10. Where is the issue?
  readyToUseExample: string; // 📋 11. Ready-to-use Example

  // Optional extended fields
  whatItMeans?: string;
  whyItExists?: string;
  realImpact?: ImpactDetails;
  realWorldExample?: string;
  stepByStepSolution?: string[];
  solutions?: SolutionOption[];
  bestPractices?: string[];
  mistakesToAvoid?: string[];
  estimatedImprovement?: string;
  expectedPerformanceGain?: string;
  codeSnippet?: string;
}

export interface ProblemItem {
  id: string;
  title: string;
  severity: "critical" | "medium" | "minor";
  description: string;
  category: "code" | "ux" | "responsive" | "color" | "performance" | "accessibility" | "seo" | "typography";
  details?: DetailedAuditExplanation;
}

export interface RecommendationItem {
  id: string;
  title: string;
  description: string;
  pointsAdded: number;
  category: string;
}

export interface WebsiteScan {
  id: string;
  url: string;
  date: string;
  score: number;
  status: "completed" | "scanning" | "failed";
  healthMessage: string;
  metrics: ScoreMetrics;
  problems: ProblemItem[];
  recommendations: RecommendationItem[];
}

export const EMPTY_METRICS: ScoreMetrics = {
  codeQuality: 0,
  uiUx: 0,
  responsiveness: 0,
  typography: 0,
  colorTheme: 0,
  accessibility: 0,
  performance: 0,
  seo: 0,
};

export const PLACEHOLDER_SCAN: WebsiteScan = {
  id: "placeholder",
  url: "",
  date: "",
  score: 0,
  status: "scanning",
  healthMessage: "Run your first website scan to see results here.",
  metrics: { ...EMPTY_METRICS },
  problems: [],
  recommendations: [],
};
