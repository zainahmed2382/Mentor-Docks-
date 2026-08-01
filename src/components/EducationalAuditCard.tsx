import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ProblemItem } from "../types";
import {
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Code,
  Copy,
  Check,
  Flame,
  HelpCircle,
  Lightbulb,
  ShieldAlert,
  Sparkles,
  TrendingUp,
  XCircle,
  Zap,
  Users,
  Search,
  DollarSign
} from "lucide-react";

interface EducationalAuditCardProps {
  key?: React.Key;
  problem: ProblemItem;
  defaultExpanded?: boolean;
}

export default function EducationalAuditCard({ problem, defaultExpanded = false }: EducationalAuditCardProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [selectedSolutionIndex, setSelectedSolutionIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const details = problem.details;

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getSeverityStyle = (severity: "critical" | "medium" | "minor") => {
    switch (severity) {
      case "critical":
        return {
          bg: "bg-rose-50 dark:bg-rose-950/30",
          text: "text-rose-700 dark:text-rose-400",
          border: "border-rose-200/80 dark:border-rose-900/40",
          iconBg: "bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400",
        };
      case "medium":
        return {
          bg: "bg-amber-50 dark:bg-amber-950/30",
          text: "text-amber-700 dark:text-amber-400",
          border: "border-amber-200/80 dark:border-amber-900/40",
          iconBg: "bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400",
        };
      default:
        return {
          bg: "bg-sky-50 dark:bg-sky-950/30",
          text: "text-sky-700 dark:text-sky-400",
          border: "border-sky-200/80 dark:border-sky-900/40",
          iconBg: "bg-sky-100 dark:bg-sky-900/50 text-sky-600 dark:text-sky-400",
        };
    }
  };

  const getDifficultyColor = (diff?: "Easy" | "Medium" | "Advanced") => {
    switch (diff) {
      case "Easy":
        return "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/40";
      case "Medium":
        return "bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900/40";
      case "Advanced":
        return "bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-900/40";
      default:
        return "bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-slate-700";
    }
  };

  const sevStyle = getSeverityStyle(problem.severity);
  const friendlyTitle = details?.friendlyTitle || problem.title;
  const currentSolution = details?.solutions?.[selectedSolutionIndex];
  const activeSnippet = currentSolution?.codeSnippet || details?.codeSnippet;

  return (
    <div className={`bg-white dark:bg-[#131520] border transition-all duration-200 rounded-3xl overflow-hidden shadow-sm ${
      isExpanded ? "border-indigo-200 dark:border-indigo-900/60 shadow-md" : "border-gray-200/90 dark:border-slate-800/90 hover:border-gray-300 dark:hover:border-slate-700"
    }`}>
      {/* Main Header / Summary Card Bar */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-5 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 cursor-pointer select-none group"
      >
        <div className="flex items-start gap-4 min-w-0 flex-1">
          <div className={`p-3 rounded-2xl shrink-0 ${sevStyle.iconBg}`}>
            <AlertTriangle className="h-5 w-5" />
          </div>

          <div className="flex flex-col gap-1 min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${sevStyle.bg} ${sevStyle.text} ${sevStyle.border}`}>
                {problem.severity} severity
              </span>
              {details?.priority && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 flex items-center gap-1">
                  <Flame className="h-3 w-3 text-amber-500" />
                  {details.priority} Priority
                </span>
              )}
              {details?.difficulty && (
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getDifficultyColor(details.difficulty)}`}>
                  {details.difficulty} Fix
                </span>
              )}
              {details?.timeRequired && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gray-50 dark:bg-slate-900 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-slate-800 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {details.timeRequired}
                </span>
              )}
            </div>

            <h4 className="font-display font-bold text-base md:text-lg text-[#1A1A1A] dark:text-slate-100 leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mt-0.5">
              {friendlyTitle}
            </h4>

            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2 mt-0.5">
              {details?.whatItMeans || problem.description}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
          {details?.estimatedImprovement && (
            <div className="hidden sm:flex flex-col items-end px-3 py-1.5 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40">
              <span className="text-[9px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider flex items-center gap-1">
                <TrendingUp className="h-3 w-3" /> Gain
              </span>
              <span className="text-xs font-extrabold text-indigo-700 dark:text-indigo-300">
                {details.estimatedImprovement.split("&")[0]}
              </span>
            </div>
          )}

          <button
            type="button"
            className="p-2 rounded-xl bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 group-hover:bg-indigo-600 group-hover:text-white transition-all cursor-pointer"
            aria-label={isExpanded ? "Collapse issue details" : "Expand issue details"}
          >
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Expanded Educational AI Consultant Report */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="border-t border-gray-100 dark:border-slate-800/80 bg-gray-50/40 dark:bg-[#0E1017] p-5 md:p-8 flex flex-col gap-6"
          >
            {/* 1. What It Means & Why It Exists */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-[#131520] border border-gray-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col gap-2">
                <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider">
                  <BookOpen className="h-4 w-4" />
                  What This Issue Means
                </div>
                <p className="text-xs md:text-sm text-gray-700 dark:text-slate-300 leading-relaxed font-normal">
                  {details?.whatItMeans || problem.description}
                </p>
              </div>

              <div className="bg-white dark:bg-[#131520] border border-gray-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col gap-2">
                <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-xs uppercase tracking-wider">
                  <ShieldAlert className="h-4 w-4" />
                  Why It Exists On Your Site
                </div>
                <p className="text-xs md:text-sm text-gray-700 dark:text-slate-300 leading-relaxed font-normal">
                  {details?.whyItExists || problem.description}
                </p>
              </div>
            </div>

            {/* 2. Real World Analogy Box */}
            {details?.realWorldExample && (
              <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20 rounded-2xl p-4 md:p-5 flex items-start gap-3.5">
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5">
                  <Lightbulb className="h-5 w-5" />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider">
                    Non-Technical Real World Example
                  </span>
                  <p className="text-xs md:text-sm text-amber-950 dark:text-amber-200/90 leading-relaxed italic">
                    "{details.realWorldExample}"
                  </p>
                </div>
              </div>
            )}

            {/* 3. The 3-Pillar Real Impact (UX, SEO, Conversions) */}
            {details?.realImpact && (
              <div className="flex flex-col gap-3">
                <h5 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-indigo-500" /> Real-World Impact Breakdown
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                  <div className="bg-white dark:bg-[#131520] border border-purple-100 dark:border-purple-950/40 rounded-2xl p-4 flex flex-col gap-1.5">
                    <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold text-xs">
                      <Users className="h-4 w-4" />
                      User Experience
                    </div>
                    <p className="text-xs text-gray-600 dark:text-slate-400 leading-relaxed">
                      {details.realImpact.userExperience}
                    </p>
                  </div>

                  <div className="bg-white dark:bg-[#131520] border border-teal-100 dark:border-teal-950/40 rounded-2xl p-4 flex flex-col gap-1.5">
                    <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400 font-bold text-xs">
                      <Search className="h-4 w-4" />
                      SEO & Rankings
                    </div>
                    <p className="text-xs text-gray-600 dark:text-slate-400 leading-relaxed">
                      {details.realImpact.seoRankings}
                    </p>
                  </div>

                  <div className="bg-white dark:bg-[#131520] border border-emerald-100 dark:border-emerald-950/40 rounded-2xl p-4 flex flex-col gap-1.5">
                    <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                      <DollarSign className="h-4 w-4" />
                      Conversions
                    </div>
                    <p className="text-xs text-gray-600 dark:text-slate-400 leading-relaxed">
                      {details.realImpact.conversions}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 4. Step-by-Step Solution */}
            {details?.stepByStepSolution && details.stepByStepSolution.length > 0 && (
              <div className="bg-white dark:bg-[#131520] border border-gray-200/80 dark:border-slate-800 rounded-2xl p-5 md:p-6 shadow-sm flex flex-col gap-4">
                <h5 className="text-xs font-bold text-gray-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
                  <Zap className="h-4 w-4 text-amber-500" />
                  Step-by-Step Resolution Guide
                </h5>

                <div className="flex flex-col gap-3">
                  {details.stepByStepSolution.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-3.5 group">
                      <span className="h-6 w-6 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 text-xs font-extrabold flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <p className="text-xs md:text-sm text-gray-700 dark:text-slate-300 leading-relaxed font-medium pt-0.5">
                        {step}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. Multiple Solutions & Copy-Ready Code */}
            {details?.solutions && details.solutions.length > 0 && (
              <div className="bg-white dark:bg-[#131520] border border-indigo-100 dark:border-indigo-950/50 rounded-2xl p-5 md:p-6 shadow-sm flex flex-col gap-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h5 className="text-xs font-bold text-gray-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
                    <Code className="h-4 w-4 text-indigo-500" />
                    Implementation Methods ({details.solutions.length} Available)
                  </h5>

                  {/* Solution selector tabs */}
                  {details.solutions.length > 1 && (
                    <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-slate-900 p-1 rounded-xl">
                      {details.solutions.map((sol, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedSolutionIndex(index)}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            selectedSolutionIndex === index
                              ? "bg-indigo-600 text-white shadow-sm"
                              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                          }`}
                        >
                          Option {index + 1} {sol.isRecommended ? "⭐" : ""}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {currentSolution && (
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#1A1A1A] dark:text-slate-200">
                          {currentSolution.title}
                        </span>
                        {currentSolution.isRecommended && (
                          <span className="bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/40 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider">
                            Recommended Choice
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-gray-600 dark:text-slate-400 leading-relaxed">
                      {currentSolution.description}
                    </p>

                    {currentSolution.whyRecommended && (
                      <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold italic">
                        Why this option: {currentSolution.whyRecommended}
                      </p>
                    )}
                  </div>
                )}

                {/* Code Snippet Display with Copy Button */}
                {activeSnippet && (
                  <div className="relative mt-1 rounded-xl overflow-hidden bg-[#0A0B10] border border-slate-800">
                    <div className="flex items-center justify-between px-4 py-2 bg-slate-900/80 border-b border-slate-800 text-[11px] font-mono text-slate-400">
                      <span>Code Snippet / Configuration</span>
                      <button
                        onClick={() => handleCopyCode(activeSnippet)}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer text-xs font-sans font-medium"
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
                      <code>{activeSnippet}</code>
                    </pre>
                  </div>
                )}
              </div>
            )}

            {/* 6. Best Practices & Mistakes to Avoid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {details?.bestPractices && details.bestPractices.length > 0 && (
                <div className="bg-white dark:bg-[#131520] border border-emerald-100 dark:border-emerald-950/40 rounded-2xl p-5 shadow-sm flex flex-col gap-3">
                  <h5 className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4" /> Professional Best Practices
                  </h5>
                  <ul className="flex flex-col gap-2">
                    {details.bestPractices.map((bp, i) => (
                      <li key={i} className="text-xs text-gray-700 dark:text-slate-300 flex items-start gap-2">
                        <span className="text-emerald-500 font-bold shrink-0">•</span>
                        <span>{bp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {details?.mistakesToAvoid && details.mistakesToAvoid.length > 0 && (
                <div className="bg-white dark:bg-[#131520] border border-rose-100 dark:border-rose-950/40 rounded-2xl p-5 shadow-sm flex flex-col gap-3">
                  <h5 className="text-xs font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                    <XCircle className="h-4 w-4" /> Pitfalls & Mistakes to Avoid
                  </h5>
                  <ul className="flex flex-col gap-2">
                    {details.mistakesToAvoid.map((m, i) => (
                      <li key={i} className="text-xs text-gray-700 dark:text-slate-300 flex items-start gap-2">
                        <span className="text-rose-500 font-bold shrink-0">•</span>
                        <span>{m}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
