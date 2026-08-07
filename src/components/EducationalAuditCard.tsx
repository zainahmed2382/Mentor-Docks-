import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ProblemItem } from "../types";
import { AlertCircle, ChevronDown, ChevronUp, MapPin } from "lucide-react";

interface EducationalAuditCardProps {
  key?: React.Key;
  problem: ProblemItem;
  defaultExpanded?: boolean;
}

export default function EducationalAuditCard({ problem, defaultExpanded = true }: EducationalAuditCardProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const details = problem.details;

  // Friendly title in plain language
  const friendlyTitle = details?.friendlyTitle || problem.title;

  // 🔴 1. Problem (1-2 simple sentences)
  const simpleProblem = details?.simpleProblem || details?.whatItMeans || problem.description;

  // ✅ 2. How to Fix It
  const bestRecommendation =
    details?.bestRecommendation ||
    (details?.solutions && details.solutions.length > 0
      ? details.solutions.find((s) => s.isRecommended)?.description || details.solutions[0].description
      : "Apply standard web optimization practices.");

  const howToFixSteps: string[] =
    details?.howToFixSteps && details.howToFixSteps.length > 0
      ? details.howToFixSteps
      : details?.stepByStepSolution && details.stepByStepSolution.length > 0
      ? details.stepByStepSolution
      : [bestRecommendation];

  // Priority / Severity badge
  const priorityVal: "Critical" | "High" | "Medium" | "Low" =
    details?.priority || (problem.severity === "critical" ? "Critical" : problem.severity === "medium" ? "Medium" : "Low");

  // Location / Category
  const whereIsIssueVal = details?.whereIsIssue || problem.category || "Website Analysis";

  const getPriorityBadgeStyle = (p: "Critical" | "High" | "Medium" | "Low") => {
    switch (p) {
      case "Critical":
        return "bg-rose-500 text-white border-rose-600 shadow-rose-500/10";
      case "High":
        return "bg-amber-500 text-white border-amber-600 shadow-amber-500/10";
      case "Medium":
        return "bg-sky-500 text-white border-sky-600 shadow-sky-500/10";
      case "Low":
        return "bg-emerald-500 text-white border-emerald-600 shadow-emerald-500/10";
    }
  };

  return (
    <div
      className={`bg-white dark:bg-[#11131E] border transition-all duration-300 rounded-2xl overflow-hidden shadow-sm ${
        isExpanded
          ? "border-indigo-400 dark:border-indigo-700/80 shadow-md ring-2 ring-indigo-500/10"
          : "border-gray-200 dark:border-slate-800/90 hover:border-gray-300 dark:hover:border-slate-700"
      }`}
    >
      {/* Header Bar */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-5 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 cursor-pointer select-none group bg-white dark:bg-[#11131E]"
      >
        <div className="flex items-start gap-3.5 min-w-0 flex-1">
          <div
            className={`p-3 rounded-2xl shrink-0 mt-0.5 ${
              priorityVal === "Critical"
                ? "bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400"
                : priorityVal === "High"
                ? "bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400"
                : "bg-sky-100 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400"
            }`}
          >
            <AlertCircle className="h-5 w-5 md:h-6 md:w-6" />
          </div>

          <div className="flex flex-col gap-2 min-w-0 flex-1">
            {/* Badges */}
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <span
                className={`px-3 py-0.5 rounded-full text-[10px] md:text-[11px] font-extrabold uppercase tracking-wider border shadow-xs ${getPriorityBadgeStyle(
                  priorityVal
                )}`}
              >
                {priorityVal} Priority
              </span>

              <span className="px-3 py-0.5 rounded-full text-[10px] md:text-[11px] font-bold bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 border border-gray-200 dark:border-slate-700 flex items-center gap-1.5">
                <MapPin className="h-3 w-3 text-indigo-500" />
                {whereIsIssueVal}
              </span>
            </div>

            {/* Title */}
            <h4 className="font-sans font-bold text-base md:text-lg text-[#1A1A1A] dark:text-slate-100 leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              {friendlyTitle}
            </h4>
          </div>
        </div>

        {/* Expand/Collapse Toggle */}
        <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
          <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 group-hover:underline hidden sm:inline">
            {isExpanded ? "Hide Details" : "View Fix Guide"}
          </span>
          <div className="p-2.5 rounded-xl bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-xs">
            {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </div>
        </div>
      </div>

      {/* Expanded Sections: 🔴 Problem & ✅ How to Fix It */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="border-t border-gray-100 dark:border-slate-800/80 bg-slate-50/70 dark:bg-[#0B0D14] p-5 md:p-7 flex flex-col gap-5"
          >
            {/* 🔴 Section 1: Problem */}
            <div className="bg-white dark:bg-[#131520] border border-rose-200 dark:border-rose-900/40 rounded-2xl p-5 md:p-6 shadow-xs flex flex-col gap-2.5">
              <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-extrabold text-xs md:text-sm uppercase tracking-wide">
                <span className="text-base md:text-lg">🔴</span>
                <span>Problem</span>
              </div>
              <p className="text-sm md:text-base text-gray-900 dark:text-slate-100 font-medium leading-relaxed">
                "{simpleProblem}"
              </p>
            </div>

            {/* ✅ Section 2: How to Fix It */}
            <div className="bg-white dark:bg-[#131520] border border-emerald-200 dark:border-emerald-900/40 rounded-2xl p-5 md:p-6 shadow-xs flex flex-col gap-3.5">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-extrabold text-xs md:text-sm uppercase tracking-wide">
                <span className="text-base md:text-lg">✅</span>
                <span>How to Fix It</span>
              </div>

              {bestRecommendation && bestRecommendation !== simpleProblem && (
                <p className="text-xs md:text-sm text-gray-800 dark:text-slate-200 font-semibold leading-relaxed bg-emerald-50/50 dark:bg-emerald-950/20 p-3.5 rounded-xl border border-emerald-100 dark:border-emerald-900/30">
                  {bestRecommendation}
                </p>
              )}

              {howToFixSteps.length > 0 && (
                <div className="flex flex-col gap-2.5 pt-1">
                  {howToFixSteps.map((step, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-3 rounded-xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-100/80 dark:border-emerald-950/40"
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
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
