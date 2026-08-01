import React, { useState } from "react";
import { motion } from "motion/react";
import { WebsiteScan, ProblemItem, ScoreMetrics, PLACEHOLDER_SCAN } from "../types";
import {
  CodeXml,
  MonitorSmartphone,
  Type,
  Palette,
  Accessibility,
  Gauge,
  Globe,
  MousePointerClick,
  CheckCircle2,
  AlertTriangle,
  FileCode,
  ArrowRight,
  Sparkles,
  Zap,
  FileDown
} from "lucide-react";
import { downloadPdfReport } from "../lib/generatePdf";
import EducationalAuditCard from "./EducationalAuditCard";

interface DetailedAnalysisPageProps {
  activeScan: WebsiteScan | null;
}

type AnalyzerTab = "code" | "responsive" | "typography" | "color" | "accessibility" | "performance" | "seo" | "ux";

export default function DetailedAnalysisPage({ activeScan }: DetailedAnalysisPageProps) {
  const scan = activeScan ?? PLACEHOLDER_SCAN;
  const [activeTab, setActiveTab] = useState<AnalyzerTab>("ux");
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadPdf = async () => {
    setIsDownloading(true);
    try {
      await downloadPdfReport(scan);
    } catch (err) {
      console.error("Error downloading PDF report:", err);
    } finally {
      setIsDownloading(false);
    }
  };

  const analyzers = [
    { id: "ux", label: "UI/UX Heuristics", icon: MousePointerClick, scoreKey: "uiUx" as keyof ScoreMetrics, color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-50 dark:bg-purple-950/20" },
    { id: "code", label: "Code Quality", icon: CodeXml, scoreKey: "codeQuality" as keyof ScoreMetrics, color: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-50 dark:bg-indigo-950/20" },
    { id: "responsive", label: "Responsiveness", icon: MonitorSmartphone, scoreKey: "responsiveness" as keyof ScoreMetrics, color: "text-pink-600 dark:text-pink-400", bg: "bg-pink-50 dark:bg-pink-950/20" },
    { id: "typography", label: "Typography", icon: Type, scoreKey: "typography" as keyof ScoreMetrics, color: "text-sky-600 dark:text-sky-400", bg: "bg-sky-50 dark:bg-sky-950/20" },
    { id: "color", label: "Color Theme", icon: Palette, scoreKey: "colorTheme" as keyof ScoreMetrics, color: "text-amber-500 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-950/20" },
    { id: "accessibility", label: "Accessibility", icon: Accessibility, scoreKey: "accessibility" as keyof ScoreMetrics, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-950/20" },
    { id: "performance", label: "Performance", icon: Gauge, scoreKey: "performance" as keyof ScoreMetrics, color: "text-rose-600 dark:text-rose-400", bg: "bg-rose-50 dark:bg-rose-950/20" },
    { id: "seo", label: "SEO Indexing", icon: Globe, scoreKey: "seo" as keyof ScoreMetrics, color: "text-teal-600 dark:text-teal-400", bg: "bg-teal-50 dark:bg-teal-950/20" }
  ];

  const getAnalyzerAssertions = (tab: AnalyzerTab) => {
    switch (tab) {
      case "ux":
        return [
          { name: "Clear Call-to-Action (CTA) placements", status: true },
          { name: "Consistent section-by-section spacing", status: scan.metrics.uiUx > 80 },
          { name: "Logical reading hierarchy & visual anchors", status: true },
          { name: "Clean layout navigation & scrollable menus", status: true },
        ];
      case "code":
        return [
          { name: "Semantic HTML element layout (header, footer, nav)", status: scan.metrics.codeQuality > 80 },
          { name: "Absence of inline CSS elements", status: true },
          { name: "Console errors and script integrity", status: true },
          { name: "Correct tag matching and closure validations", status: true },
        ];
      case "responsive":
        return [
          { name: "Standard mobile viewport tag declaration", status: scan.metrics.responsiveness > 50 },
          { name: "Avoidance of horizontal overflow scrollbars", status: scan.metrics.responsiveness > 75 },
          { name: "Proportional media resizing (fluid layout grids)", status: true },
          { name: "Touch target action bounds size (min 44px)", status: true },
        ];
      case "typography":
        return [
          { name: "Unified typeface selection (max 3 fonts)", status: true },
          { name: "Rhythmic and proportional heading sizes (H1-H6)", status: true },
          { name: "Optimum text leading and tracking settings", status: true },
          { name: "Readability contrast thresholds on copy texts", status: scan.metrics.typography > 80 },
        ];
      case "color":
        return [
          { name: "Strict conformance to contrast limits (4.5:1 ratio)", status: scan.metrics.colorTheme > 80 },
          { name: "Balanced and clean brand color hierarchy", status: true },
          { name: "Visual highlighting on clickable links and inputs", status: true },
          { name: "Aesthetic color gradients and accent consistency", status: true },
        ];
      case "accessibility":
        return [
          { name: "Semantic HTML ARIA attributes and labels", status: scan.metrics.accessibility > 75 },
          { name: "Descriptive alternative tags on image elements", status: scan.metrics.accessibility > 70 },
          { name: "Logical keyboard tab-navigation alignments", status: true },
          { name: "Assigned screen reader readable alerts and status", status: true },
        ];
      case "performance":
        return [
          { name: "First Contentful Paint (FCP) below 1.5 seconds", status: scan.metrics.performance > 80 },
          { name: "Efficient asset payloads (raster WebP compression)", status: scan.metrics.performance > 70 },
          { name: "Consolidated stylesheets and scripts delivery", status: true },
          { name: "Edge CDN static elements caching enabled", status: scan.metrics.performance > 60 },
        ];
      case "seo":
        return [
          { name: "Standard document description and title headers", status: true },
          { name: "Social network meta assets index (OpenGraph tags)", status: scan.metrics.seo > 75 },
          { name: "Clean document index crawlable layouts", status: true },
          { name: "Robots.txt and Sitemap.xml availability indicators", status: true },
        ];
      default:
        return [];
    }
  };

  // Select active score
  const selectedAnalyzer = analyzers.find((a) => a.id === activeTab);
  const activeScore = selectedAnalyzer ? scan.metrics[selectedAnalyzer.scoreKey] : 0;

  // Filter problems for active category
  const activeProblems = scan.problems.filter((p) => {
    if (activeTab === "ux" && p.category === "ux") return true;
    if (activeTab === "code" && p.category === "code") return true;
    if (activeTab === "responsive" && p.category === "responsive") return true;
    if (activeTab === "typography" && p.category === "typography") return true;
    if (activeTab === "color" && p.category === "color") return true;
    if (activeTab === "accessibility" && p.category === "accessibility") return true;
    if (activeTab === "performance" && p.category === "performance") return true;
    if (activeTab === "seo" && p.category === "seo") return true;
    return false;
  });

  // Filter recommendations for active category
  const activeRecs = scan.recommendations.filter((r) => {
    return r.category?.toLowerCase() === activeTab || r.category?.toLowerCase().includes(activeTab);
  });

  const getSeverityBadge = (severity: "critical" | "medium" | "minor") => {
    switch (severity) {
      case "critical":
        return (
          <span className="bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 border border-rose-200/60 dark:border-rose-900/30 font-sans font-bold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            Critical
          </span>
        );
      case "medium":
        return (
          <span className="bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border border-amber-200/60 dark:border-amber-900/30 font-sans font-bold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            Medium
          </span>
        );
      case "minor":
        return (
          <span className="bg-sky-50 dark:bg-sky-950/30 text-sky-700 dark:text-sky-400 border border-sky-200/60 dark:border-sky-900/30 font-sans font-bold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            Minor
          </span>
        );
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-16 pt-10 pb-20 font-sans flex flex-col gap-8">
      {/* Page Header */}
      <div className="border-b border-gray-200/60 dark:border-slate-800/60 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-[#1A1A1A] dark:text-slate-100 tracking-tight flex items-center gap-2">
            <CodeXml className="h-7 w-7 text-indigo-600 dark:text-indigo-400" /> Technical Analyzer Lab
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium">
            Inspect individual reports and assertions from all 8 autonomous crawlers.
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="font-mono text-xs text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30 px-4 py-2 rounded-2xl font-bold self-start md:self-auto">
            Scanned Target: {scan.url}
          </div>
          <motion.button
            onClick={handleDownloadPdf}
            disabled={isDownloading}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-sans font-bold text-xs shadow-lg shadow-indigo-500/20 transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed self-start md:self-auto"
            id="download-pdf-btn"
          >
            {isDownloading ? (
              <>
                <span className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <FileDown className="h-3.5 w-3.5" />
                <span>Download PDF Report</span>
              </>
            )}
          </motion.button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Analyzer selection list */}
        <div className="lg:col-span-4 flex flex-col gap-2 bg-white dark:bg-[#131520] p-4 border border-gray-200/80 dark:border-slate-800 rounded-[32px] shadow-sm">
          <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest px-3 mb-2 block">
            Select Crawler Engine
          </span>
          {analyzers.map((analyzer) => {
            const Icon = analyzer.icon;
            const isSelected = activeTab === analyzer.id;
            const score = scan.metrics[analyzer.scoreKey];
            return (
              <button
                key={analyzer.id}
                onClick={() => setActiveTab(analyzer.id as AnalyzerTab)}
                className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all text-left cursor-pointer group ${
                  isSelected
                    ? "bg-indigo-600 border-indigo-600 text-white shadow-[0_8px_20px_rgba(79,70,229,0.15)]"
                    : "bg-white dark:bg-[#0A0B10]/40 hover:bg-gray-50 dark:hover:bg-slate-800/40 border-gray-200 dark:border-slate-800 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-slate-700"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`p-2 rounded-xl transition-colors shrink-0 ${
                      isSelected ? "bg-white/20 text-white" : `${analyzer.bg} ${analyzer.color}`
                    }`}
                  >
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                  <span className={`text-xs md:text-sm font-bold truncate ${isSelected ? "text-white" : "text-[#1A1A1A] dark:text-slate-200"}`}>
                    {analyzer.label}
                  </span>
                </div>
                <div className="flex items-center gap-1 shrink-0 ml-2">
                  <span className={`text-xs font-extrabold ${isSelected ? "text-white/90" : "text-indigo-600 dark:text-indigo-400"}`}>
                    {score}
                  </span>
                  <span className={`text-[9px] font-bold ${isSelected ? "text-white/60" : "text-gray-400 dark:text-gray-500"}`}>
                    /100
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Side: Detailed Dashboard for Selected Analyzer */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Active Header Card */}
          {selectedAnalyzer && (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-[#131520] border border-gray-200 dark:border-slate-800 rounded-[32px] p-6 md:p-8 shadow-sm relative overflow-hidden"
            >
              {/* Decorative Ambient Radial */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-indigo-50/40 dark:from-indigo-950/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>

              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-2xl ${selectedAnalyzer.bg} border border-gray-100 dark:border-slate-800/80`}>
                    <selectedAnalyzer.icon className={`h-6 w-6 ${selectedAnalyzer.color}`} />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-extrabold text-[#1A1A1A] dark:text-slate-100 tracking-tight">
                      {selectedAnalyzer.label} Audit
                    </h3>
                    <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">Heuristics assertion logs & scoring indexes</p>
                  </div>
                </div>

                {/* Score Circle representation */}
                <div className="bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl px-4 py-2 flex flex-col items-center shadow-sm shrink-0">
                  <span className="text-2xl font-display font-extrabold text-indigo-600 dark:text-indigo-400">{activeScore}</span>
                  <span className="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">SCORE</span>
                </div>
              </div>

              {/* Progress track */}
              <div className="mb-8">
                <div className="flex justify-between items-center text-xs text-gray-400 dark:text-gray-500 font-bold uppercase mb-1.5 font-sans">
                  <span>Audit Rating</span>
                  <span className={activeScore >= 85 ? "text-emerald-600 dark:text-emerald-400" : activeScore >= 70 ? "text-amber-500 dark:text-amber-400" : "text-rose-500 dark:text-rose-400"}>
                    {activeScore >= 85 ? "Excellent Standards" : activeScore >= 70 ? "Solid Baseline" : "High Risk Actions Required"}
                  </span>
                </div>
                <div className="h-2 w-full bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${
                      activeScore >= 85 ? "bg-emerald-500" : activeScore >= 70 ? "bg-amber-500" : "bg-rose-500"
                    }`}
                    style={{ width: `${activeScore}%` }}
                  ></div>
                </div>
              </div>

              {/* Grid of Assertions Checkpoints */}
              <div className="border-t border-gray-100 dark:border-slate-800 pt-6">
                <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">
                  Crawler Assertion Checklist
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {getAnalyzerAssertions(activeTab).map((assertion, index) => (
                    <div
                      key={index}
                      className="bg-gray-50/50 dark:bg-slate-900/40 border border-gray-100/80 dark:border-slate-800/80 rounded-2xl p-3 flex items-center justify-between gap-3 shadow-sm"
                    >
                      <span className="text-xs text-gray-700 dark:text-slate-300 font-semibold truncate leading-tight pr-1">
                        {assertion.name}
                      </span>
                      {assertion.status ? (
                        <span className="bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-900/30 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase shrink-0">
                          Passed
                        </span>
                      ) : (
                        <span className="bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400 border border-rose-200/50 dark:border-rose-900/30 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase shrink-0">
                          Failed
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Active Category Problems list */}
          <div className="bg-white dark:bg-[#131520] border border-gray-200 dark:border-slate-800 rounded-[32px] p-6 md:p-8 shadow-sm">
            <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4 border-b border-gray-100 dark:border-slate-800 pb-3 flex justify-between items-center">
              <span>Identified Issues</span>
              <span className="text-[10px] bg-gray-100 dark:bg-slate-900 text-[#1A1A1A] dark:text-slate-200 font-bold px-2 py-0.5 rounded-full">
                {activeProblems.length} Alert(s)
              </span>
            </h4>

            {activeProblems.length === 0 ? (
              <div className="p-8 text-center flex flex-col items-center justify-center">
                <div className="h-10 w-10 rounded-full bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500 dark:text-emerald-400 flex items-center justify-center mb-3">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <p className="text-sm font-bold text-gray-800 dark:text-slate-200">Zero flaws identified!</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">This analyzer reports pristine compliance standards.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {activeProblems.map((problem, index) => (
                  <EducationalAuditCard key={problem.id || index} problem={problem} defaultExpanded={index === 0} />
                ))}
              </div>
            )}
          </div>

          {/* Active Category Actionable recommendations */}
          <div className="bg-white dark:bg-[#131520] border border-indigo-100 dark:border-indigo-950/40 rounded-[32px] p-6 md:p-8 shadow-[0_8px_30px_rgba(79,70,229,0.02)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-50/60 dark:bg-indigo-950/10 rounded-full blur-3xl pointer-events-none"></div>

            <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4 border-b border-gray-100 dark:border-slate-800 pb-3 flex items-center gap-1.5 z-10 relative">
              <Sparkles className="h-4 w-4 text-indigo-500 dark:text-indigo-400" /> Actionable AI Fixes
            </h4>

            {activeRecs.length === 0 ? (
              <div className="p-8 text-center flex flex-col items-center justify-center">
                <div className="h-10 w-10 rounded-full bg-indigo-50 dark:bg-indigo-950/20 text-indigo-500 dark:text-indigo-400 flex items-center justify-center mb-3">
                  <Zap className="h-5 w-5 animate-pulse" />
                </div>
                <p className="text-sm font-bold text-gray-800 dark:text-slate-200">No fixes suggested</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  Compliance is already optimal; no structural modifications are necessary.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-4 z-10 relative">
                {activeRecs.map((rec, idx) => (
                  <div
                    key={idx}
                    className="bg-white dark:bg-slate-900 border border-gray-200/85 dark:border-slate-800 hover:border-indigo-250 dark:hover:border-indigo-500 rounded-2xl p-4 flex gap-4 items-center justify-between group transition-all duration-300 shadow-sm"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="p-2 bg-indigo-50 dark:bg-indigo-950/30 rounded-full border border-indigo-100 dark:border-indigo-900/40 shrink-0">
                        <Zap className="h-4.5 w-4.5 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <div className="min-w-0">
                        <h5 className="font-sans font-bold text-xs md:text-sm text-[#1A1A1A] dark:text-slate-200 leading-tight truncate">
                          {rec.title}
                        </h5>
                        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed truncate mt-1">{rec.description}</p>
                      </div>
                    </div>

                    <div className="text-right shrink-0 flex flex-col items-end">
                      <span className="font-display font-extrabold text-sm text-indigo-600 dark:text-indigo-400">+{rec.pointsAdded}</span>
                      <span className="text-[8px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-0.5">PTS</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
