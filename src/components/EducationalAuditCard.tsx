import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ProblemItem } from "../types";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Code,
  Copy,
  Check,
  Lightbulb,
  Sparkles,
  TrendingUp,
  XCircle,
  Zap,
  MapPin,
  HelpCircle,
  ShieldAlert,
  Terminal,
  ArrowRight,
  FileCode2
} from "lucide-react";

interface EducationalAuditCardProps {
  key?: React.Key;
  problem: ProblemItem;
  defaultExpanded?: boolean;
}

export default function EducationalAuditCard({ problem, defaultExpanded = false }: EducationalAuditCardProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [copied, setCopied] = useState(false);
  const [showCodeSnippet, setShowCodeSnippet] = useState(false);

  const details = problem.details;

  // Extract or fallback the 11 key fields safely
  const friendlyTitle = details?.friendlyTitle || problem.title;
  
  // 1. 🔴 Problem
  const simpleProblem = details?.simpleProblem || details?.whatItMeans || problem.description;

  // 2. 🤔 Why is this happening?
  const whyItHappened = details?.whyItHappened || details?.whyItExists || problem.description;

  // 3. ⚠️ Why does it matter?
  const whyItMattersBullets: string[] = details?.whyItMattersBullets && details.whyItMattersBullets.length > 0
    ? details.whyItMattersBullets
    : details?.realImpact
    ? [
        `User Experience: ${details.realImpact.userExperience}`,
        `Google SEO: ${details.realImpact.seoRankings}`,
        `Conversions: ${details.realImpact.conversions}`,
      ]
    : [
        "Visitors wait longer or experience issues on your page.",
        "Some users leave before the page finishes loading.",
        "Google search engines may rank your website lower.",
        "Mobile phone users will have a worse experience.",
      ];

  // 4. ✅ How to fix it
  const howToFixSteps: string[] = details?.howToFixSteps && details.howToFixSteps.length > 0
    ? details.howToFixSteps
    : details?.stepByStepSolution && details.stepByStepSolution.length > 0
    ? details.stepByStepSolution
    : ["Review the issue on your website.", "Apply the recommended fix.", "Re-scan to verify performance improvement."];

  // 5. 💡 Best Recommendation
  const bestRecommendation = details?.bestRecommendation ||
    (details?.solutions && details.solutions.length > 0
      ? details.solutions.find(s => s.isRecommended)?.description || details.solutions[0].description
      : "Apply asset compression and standard web optimization practices.");

  // 6. 🚀 Expected Improvement
  const expectedImprovementBullets: string[] = details?.expectedImprovementBullets && details.expectedImprovementBullets.length > 0
    ? details.expectedImprovementBullets
    : [
        "Faster page loading speed",
        "Better Google search ranking eligibility",
        "Better overall user experience",
        "Higher audit health score",
      ];

  // 7. ⭐ Priority
  const priorityVal: "Critical" | "High" | "Medium" | "Low" =
    details?.priority || (problem.severity === "critical" ? "Critical" : problem.severity === "medium" ? "Medium" : "Low");

  // 8. ⏱ Difficulty
  const difficultyVal: "Easy" | "Medium" | "Advanced" = details?.difficulty || "Easy";

  // 9. ⌛ Estimated Fix Time
  const timeRequiredVal = details?.timeRequired || "10 minutes";

  // 10. 📍 Where is the issue?
  const whereIsIssueVal = details?.whereIsIssue || "Homepage & Media Assets";

  // 11. 📋 Ready-to-use Example
  const readyToUseExampleVal = details?.readyToUseExample || details?.codeSnippet || "Optimize assets and apply standard web settings for this item.";

  // Optional Code Snippet
  const codeSnippet = details?.codeSnippet;

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getPriorityBadgeStyle = (p: "Critical" | "High" | "Medium" | "Low") => {
    switch (p) {
      case "Critical":
        return "bg-rose-500 text-white border-rose-600 shadow-rose-500/20";
      case "High":
        return "bg-amber-500 text-white border-amber-600 shadow-amber-500/20";
      case "Medium":
        return "bg-sky-500 text-white border-sky-600 shadow-sky-500/20";
      case "Low":
        return "bg-emerald-500 text-white border-emerald-600 shadow-emerald-500/20";
    }
  };

  const getDifficultyBadgeStyle = (d: "Easy" | "Medium" | "Advanced") => {
    switch (d) {
      case "Easy":
        return "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800";
      case "Medium":
        return "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800";
      case "Advanced":
        return "bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800";
    }
  };

  return (
    <div
      className={`bg-white dark:bg-[#11131E] border transition-all duration-300 rounded-3xl overflow-hidden shadow-sm ${
        isExpanded
          ? "border-indigo-400 dark:border-indigo-700/80 shadow-lg ring-2 ring-indigo-500/10"
          : "border-gray-200 dark:border-slate-800/90 hover:border-gray-300 dark:hover:border-slate-700"
      }`}
    >
      {/* Main Header / Summary Card Bar */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-5 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 cursor-pointer select-none group bg-white dark:bg-[#11131E]"
      >
        <div className="flex items-start gap-4 min-w-0 flex-1">
          <div
            className={`p-3 rounded-2xl shrink-0 ${
              priorityVal === "Critical"
                ? "bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400"
                : priorityVal === "High"
                ? "bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400"
                : "bg-sky-100 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400"
            }`}
          >
            <AlertCircle className="h-6 w-6" />
          </div>

          <div className="flex flex-col gap-2 min-w-0 flex-1">
            {/* Header Badges */}
            <div className="flex items-center gap-2 flex-wrap text-xs">
              {/* ⭐ 7. Priority Badge */}
              <span
                className={`px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider shadow-xs border ${getPriorityBadgeStyle(
                  priorityVal
                )}`}
              >
                ⭐ Priority: {priorityVal}
              </span>

              {/* 📍 10. Where is the issue? */}
              <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 border border-gray-200 dark:border-slate-700 flex items-center gap-1.5">
                <MapPin className="h-3 w-3 text-indigo-500" />
                {whereIsIssueVal}
              </span>

              {/* ⏱ 8. Difficulty */}
              <span
                className={`px-3 py-1 rounded-full text-[11px] font-bold border ${getDifficultyBadgeStyle(
                  difficultyVal
                )}`}
              >
                ⏱ {difficultyVal}
              </span>

              {/* ⌛ 9. Estimated Time */}
              <span className="px-3 py-1 rounded-full text-[11px] font-medium bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-900/50 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                ⌛ {timeRequiredVal}
              </span>
            </div>

            {/* Title */}
            <h4 className="font-display font-bold text-base md:text-lg text-[#1A1A1A] dark:text-slate-100 leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              {friendlyTitle}
            </h4>

            {/* 🔴 1. Problem (One simple sentence summary) */}
            <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-normal flex items-start gap-1.5">
              <span className="text-rose-500 font-bold shrink-0">🔴</span>
              <span>{simpleProblem}</span>
            </p>
          </div>
        </div>

        {/* Expand / Collapse Button */}
        <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
          <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 group-hover:underline hidden sm:inline">
            {isExpanded ? "Hide Solution" : "View Simple Solution"}
          </span>
          <div className="p-2.5 rounded-xl bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-xs">
            {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </div>
        </div>
      </div>

      {/* Expanded Friendly Explanation Report */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="border-t border-gray-100 dark:border-slate-800/80 bg-slate-50/70 dark:bg-[#0B0D14] p-5 md:p-8 flex flex-col gap-6"
          >
            {/* 🔴 1. Problem Section (Simple Sentence) */}
            <div className="bg-white dark:bg-[#131520] border border-rose-200 dark:border-rose-900/40 rounded-2xl p-5 md:p-6 shadow-xs flex flex-col gap-2.5">
              <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-extrabold text-sm uppercase tracking-wide">
                <span className="text-lg">🔴</span>
                <span>Problem</span>
              </div>
              <p className="text-sm md:text-base text-gray-900 dark:text-slate-100 font-medium leading-relaxed">
                "{simpleProblem}"
              </p>
            </div>

            {/* 🤔 2. Why is this happening? */}
            <div className="bg-white dark:bg-[#131520] border border-indigo-100 dark:border-indigo-950/50 rounded-2xl p-5 md:p-6 shadow-xs flex flex-col gap-2.5">
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-extrabold text-sm uppercase tracking-wide">
                <span className="text-lg">🤔</span>
                <span>Why is this happening?</span>
              </div>
              <p className="text-xs md:text-sm text-gray-700 dark:text-slate-300 leading-relaxed font-normal">
                {whyItHappened}
              </p>
            </div>

            {/* ⚠️ 3. Why does it matter? */}
            <div className="bg-white dark:bg-[#131520] border border-amber-200/90 dark:border-amber-900/40 rounded-2xl p-5 md:p-6 shadow-xs flex flex-col gap-3">
              <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-extrabold text-sm uppercase tracking-wide">
                <span className="text-lg">⚠️</span>
                <span>Why does it matter?</span>
              </div>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {whyItMattersBullets.map((bullet, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-950/40 text-xs md:text-sm text-gray-800 dark:text-slate-200 leading-relaxed"
                  >
                    <span className="text-amber-500 font-bold shrink-0">•</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* ✅ 4. How to fix it */}
            <div className="bg-white dark:bg-[#131520] border border-emerald-200 dark:border-emerald-900/40 rounded-2xl p-5 md:p-6 shadow-xs flex flex-col gap-3.5">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-extrabold text-sm uppercase tracking-wide">
                <span className="text-lg">✅</span>
                <span>How to fix it</span>
              </div>
              <div className="flex flex-col gap-2.5">
                {howToFixSteps.map((step, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3 rounded-xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-950/40"
                  >
                    <span className="h-6 w-6 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                      {idx + 1}
                    </span>
                    <p className="text-xs md:text-sm text-gray-800 dark:text-slate-200 leading-relaxed font-medium pt-0.5">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* 💡 5. Best Recommendation */}
            <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 rounded-2xl p-5 md:p-6 flex items-start gap-4 shadow-xs">
              <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5">
                <Lightbulb className="h-6 w-6" />
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-extrabold text-amber-800 dark:text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                  <span>💡 Best Recommendation</span>
                </span>
                <p className="text-xs md:text-sm text-amber-950 dark:text-amber-100 leading-relaxed font-semibold">
                  "{bestRecommendation}"
                </p>
              </div>
            </div>

            {/* 🚀 6. Expected Improvement */}
            <div className="bg-white dark:bg-[#131520] border border-sky-200 dark:border-sky-900/40 rounded-2xl p-5 md:p-6 shadow-xs flex flex-col gap-3">
              <div className="flex items-center gap-2 text-sky-600 dark:text-sky-400 font-extrabold text-sm uppercase tracking-wide">
                <span className="text-lg">🚀</span>
                <span>Expected Improvement</span>
              </div>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {expectedImprovementBullets.map((imp, idx) => (
                  <li
                    key={idx}
                    className="flex items-center gap-2.5 p-3 rounded-xl bg-sky-50/50 dark:bg-sky-950/20 border border-sky-100 dark:border-sky-950/40 text-xs md:text-sm text-gray-800 dark:text-slate-200 font-medium"
                  >
                    <span className="text-sky-500 font-bold shrink-0">•</span>
                    <span>{imp}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Metadata Summary Cards Bar (7. Priority | 8. Difficulty | 9. Estimated Time | 10. Where is issue) */}
            <div className="bg-white dark:bg-[#131520] border border-gray-200 dark:border-slate-800 rounded-2xl p-4 md:p-5 grid grid-cols-2 md:grid-cols-4 gap-4 shadow-xs">
              {/* ⭐ 7. Priority */}
              <div className="flex flex-col gap-1">
                <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  ⭐ Priority
                </span>
                <div>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-extrabold uppercase border ${getPriorityBadgeStyle(
                      priorityVal
                    )}`}
                  >
                    {priorityVal}
                  </span>
                </div>
              </div>

              {/* ⏱ 8. Difficulty */}
              <div className="flex flex-col gap-1">
                <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  ⏱ Difficulty
                </span>
                <div>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${getDifficultyBadgeStyle(
                      difficultyVal
                    )}`}
                  >
                    {difficultyVal}
                  </span>
                </div>
              </div>

              {/* ⌛ 9. Estimated Fix Time */}
              <div className="flex flex-col gap-1">
                <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  ⌛ Estimated Fix Time
                </span>
                <span className="text-xs md:text-sm font-bold text-indigo-700 dark:text-indigo-300 flex items-center gap-1 pt-0.5">
                  <Clock className="h-3.5 w-3.5" />
                  {timeRequiredVal}
                </span>
              </div>

              {/* 📍 10. Where is the issue? */}
              <div className="flex flex-col gap-1">
                <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  📍 Where is the issue?
                </span>
                <span className="text-xs md:text-sm font-bold text-gray-800 dark:text-slate-200 flex items-center gap-1 pt-0.5 truncate">
                  <MapPin className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                  <span className="truncate">{whereIsIssueVal}</span>
                </span>
              </div>
            </div>

            {/* 📋 11. Ready-to-use Example */}
            <div className="bg-slate-900 text-white rounded-2xl p-5 md:p-6 shadow-md flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-indigo-300 font-extrabold text-sm uppercase tracking-wide">
                  <span className="text-lg">📋</span>
                  <span>Ready-to-use Example</span>
                </div>
                {codeSnippet && (
                  <button
                    onClick={() => setShowCodeSnippet(!showCodeSnippet)}
                    className="text-xs font-medium text-indigo-300 hover:text-white flex items-center gap-1 underline cursor-pointer"
                  >
                    <FileCode2 className="h-3.5 w-3.5" />
                    {showCodeSnippet ? "Hide Developer Code" : "Show Developer Code"}
                  </button>
                )}
              </div>

              <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-4 font-sans text-xs md:text-sm text-slate-100 leading-relaxed font-medium">
                👉 {readyToUseExampleVal}
              </div>

              {/* Collapsible Developer Code Snippet */}
              {codeSnippet && showCodeSnippet && (
                <div className="relative mt-2 rounded-xl overflow-hidden bg-[#0A0B10] border border-slate-800">
                  <div className="flex items-center justify-between px-4 py-2 bg-slate-800/90 border-b border-slate-700 text-[11px] font-mono text-slate-400">
                    <span className="flex items-center gap-1">
                      <Terminal className="h-3.5 w-3.5 text-indigo-400" /> Optional Developer Code
                    </span>
                    <button
                      onClick={() => handleCopyCode(codeSnippet)}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-700 hover:bg-slate-600 text-slate-100 transition-colors cursor-pointer text-xs font-sans font-medium"
                    >
                      {copied ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          <span>Copy Code</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="p-4 text-xs font-mono text-indigo-300 leading-relaxed overflow-x-auto whitespace-pre">
                    <code>{codeSnippet}</code>
                  </pre>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
