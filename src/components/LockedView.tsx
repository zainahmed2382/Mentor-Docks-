import React from "react";
import { Lock, ArrowRight, ShieldCheck, Database, History, HelpCircle, BarChart3 } from "lucide-react";

interface LockedViewProps {
  viewName: "labs" | "history" | "projects" | "insights" | "dashboard" | "profile" | "settings" | "security" | "secrets";
  onLoginClick: () => void;
}

export default function LockedView({ viewName, onLoginClick }: LockedViewProps) {
  const getContent = () => {
    switch (viewName) {
      case "dashboard":
        return {
          title: "Dashboard Statistics",
          description: "Explore comprehensive visual analytics, circular compliance scores, dynamic performance indicators, and historical benchmarks.",
          icon: <BarChart3 className="h-10 w-10 text-indigo-500 animate-pulse" />,
        };
      case "labs":
        return {
          title: "Technical Lab Audits",
          description: "Unlock advanced accessibility compliance checks, detailed contrast ratio maps, comprehensive HTML tag hierarchies, and deep speed analysis powered by AI.",
          icon: <ShieldCheck className="h-10 w-10 text-indigo-500 animate-pulse" />,
        };
      case "history":
        return {
          title: "Complete Scan History",
          description: "Keep a reliable persistent cloud log of all your analyzed websites, compare historical reports over time, and keep track of regression issues.",
          icon: <History className="h-10 w-10 text-indigo-500 animate-pulse" />,
        };
      case "projects":
        return {
          title: "Saved Portfolios",
          description: "Add, monitor, and configure multi-page website tracking portfolios with automated weekly reporting, direct PDF exports, and team alerts.",
          icon: <Database className="h-10 w-10 text-indigo-500 animate-pulse" />,
        };
      case "insights":
        return {
          title: "Global Compliance Insights",
          description: "Gain access to web-wide design trend graphs, standard deviation statistics of security scoring, and custom industrial benchmarks.",
          icon: <Lock className="h-10 w-10 text-indigo-500 animate-pulse" />,
        };
      default:
        return {
          title: "Cloud Feature Locked",
          description: "Access to this advanced suite of tools requires an active account to securely store your preferences and private data.",
          icon: <Lock className="h-10 w-10 text-indigo-500 animate-pulse" />,
        };
    }
  };

  const content = getContent();

  return (
    <div className="max-w-xl mx-auto my-16 p-8 md:p-12 bg-white/95 dark:bg-[#131520]/95 backdrop-blur-md rounded-[32px] border border-gray-150/80 dark:border-slate-800 shadow-xl flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-300">
      <div className="h-20 w-20 rounded-full bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center mb-6 shadow-inner relative">
        <div className="absolute inset-0 rounded-full bg-indigo-100/40 dark:bg-indigo-900/10 animate-ping scale-75"></div>
        {content.icon}
      </div>

      <span className="text-[10px] text-indigo-600 dark:text-indigo-400 bg-indigo-50/70 dark:bg-indigo-950/50 border border-indigo-100/60 dark:border-indigo-900/40 font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3">
        Cloud Account Required
      </span>

      <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-slate-100 mb-4 tracking-tight">
        {content.title}
      </h2>

      <p className="font-sans text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-sm mb-8">
        {content.description}
      </p>

      <div className="w-full flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={onLoginClick}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-sans font-bold text-sm px-6 py-3 rounded-full shadow-lg hover:shadow-indigo-600/20 active:scale-95 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
        >
          <span>Sign In or Register</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-8 pt-6 border-t border-gray-100 dark:border-slate-800 w-full flex justify-center items-center gap-1.5 text-gray-400 dark:text-gray-500 font-sans text-xs">
        <HelpCircle className="h-3.5 w-3.5" />
        <span>Your data is stored in a secure Neon PostgreSQL instance.</span>
      </div>
    </div>
  );
}
