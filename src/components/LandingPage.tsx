import React, { useState } from "react";
import { motion } from "motion/react";
import {
  Link,
  CheckCircle2,
  CodeXml,
  MousePointerClick,
  MonitorSmartphone,
  Palette,
  Gauge,
  Accessibility,
  Sparkles,
  Globe,
  Settings2,
  Cpu,
  Laptop,
  Smartphone,
  Shield,
  Clock,
  ChevronRight,
  TrendingUp,
  Award,
  Zap,
} from "lucide-react";
import { WebsiteScan } from "../types";
import { User as ApiUser } from "../lib/api";
import UrlAutocompleteInput from "./UrlAutocompleteInput";

interface LandingPageProps {
  onStartScan: (url: string) => void;
  initialUrl?: string;
  user?: ApiUser | null;
  scanHistory?: WebsiteScan[];
  onSelectScan?: (id: string) => void;
}

export default function LandingPage({
  onStartScan,
  initialUrl = "",
  user = null,
  scanHistory = [],
  onSelectScan,
}: LandingPageProps) {
  const [url, setUrl] = useState(initialUrl);
  const [error, setError] = useState("");

  // Interactive configurations for logged-in users
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const [scanMode, setScanMode] = useState<"standard" | "deep">("deep");
  const [enabledChecks, setEnabledChecks] = useState({
    domStructure: true,
    contrastWcag: true,
    performanceWebVitals: true,
    securityHeaders: true,
    seoOptimization: true,
  });

  const toggleCheck = (key: keyof typeof enabledChecks) => {
    setEnabledChecks((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      setError("Please enter a website URL first.");
      return;
    }
    let urlToScan = url.trim();
    if (!urlToScan.includes(".") || urlToScan.length < 4) {
      setError("Please enter a valid website domain or URL (e.g., example.com).");
      return;
    }
    setError("");
    onStartScan(urlToScan);
  };

  const featureVectors = [
    {
      title: "Code Analysis",
      description:
        "Deep DOM traversal and structural integrity checks. Identifies deprecated tags, unoptimized scripts, and complex CSS selector chains slowing down render times.",
      icon: CodeXml,
      color: "text-indigo-600",
      bgColor: "from-indigo-100",
      isLarge: true,
    },
    {
      title: "UI/UX Scoring",
      description:
        "Evaluates interactive elements, hit areas, and cognitive load based on established heuristic guidelines.",
      icon: MousePointerClick,
      color: "text-purple-600",
      bgColor: "from-purple-100",
      isLarge: false,
    },
    {
      title: "Responsive",
      description:
        "Simulates rendering across 50+ viewport configurations to ensure pixel-perfect fluid resizing.",
      icon: MonitorSmartphone,
      color: "text-pink-600",
      bgColor: "from-pink-100",
      isLarge: false,
    },
    {
      title: "Color & Typography",
      description:
        "Analyzes contrast ratios, brand consistency, font loading strategies, and hierarchical rhythm to ensure a cohesive and readable visual identity.",
      icon: Palette,
      color: "text-sky-600",
      bgColor: "from-sky-100",
      isLarge: true,
    },
    {
      title: "Performance",
      description: "Core Web Vitals tracking, asset optimization recommendations, and server response time (TTFB) analysis.",
      icon: Gauge,
      color: "text-rose-600",
      bgColor: "from-rose-100",
      isLarge: false,
    },
    {
      title: "Accessibility",
      description: "WCAG 2.2 AA compliance checks, ARIA attribute validation, and simulated desktop screen readers.",
      icon: Accessibility,
      color: "text-emerald-600",
      bgColor: "from-emerald-100",
      isLarge: false,
    },
    {
      title: "AI Insights",
      description: "Generative suggestions for copy improvements, layout restructuring, and high conversion rate designs.",
      icon: Sparkles,
      color: "text-amber-600",
      bgColor: "from-amber-100",
      isLarge: false,
    },
  ];

  // LOGGED IN WORKSPACE VIEW
  if (user) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 md:px-16 pt-6 pb-24 font-sans">
        {/* Welcome Banner */}
        <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-150 dark:border-slate-800/60 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-indigo-100 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 font-bold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1">
                <Sparkles className="h-3 w-3" /> Mentor Workspace
              </span>
            </div>
            <h1 className="font-display text-3xl font-extrabold text-[#1A1A1A] dark:text-slate-100 mt-2 tracking-tight">
              Mentor AI Workspace
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-1">
              Configure parameters and launch simulated frontend audits on live websites.
            </p>
          </div>

          {/* Quick Engine Status Indicator */}
          <div className="flex items-center gap-3 bg-white dark:bg-[#131520] border border-gray-200 dark:border-slate-800 rounded-2xl px-4 py-2.5 shadow-sm">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <div className="text-left leading-none">
              <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">AI Engine</p>
              <p className="text-xs font-bold text-gray-700 dark:text-slate-200 mt-0.5">Mentor AI</p>
            </div>
          </div>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Configure & Start Scan (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white dark:bg-[#131520] rounded-[32px] border border-gray-200/80 dark:border-slate-800/80 p-6 md:p-8 shadow-sm">
              <div className="flex items-center gap-2.5 mb-6">
                <div className="p-2 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 rounded-xl border border-indigo-100 dark:border-indigo-900/40">
                  <Settings2 className="h-4.5 w-4.5" />
                </div>
                <h3 className="font-display text-lg font-bold text-[#1A1A1A] dark:text-slate-100 tracking-tight">
                  Configure Audit Parameters
                </h3>
              </div>

              {/* URL Submission Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2 block">
                    Target Website URL
                  </label>
                  <UrlAutocompleteInput
                    value={url}
                    onChange={(val) => {
                      setUrl(val);
                      setError("");
                    }}
                    onStartScan={onStartScan}
                    scanHistory={scanHistory}
                    onSelectScan={onSelectScan}
                    placeholder="e.g., https://stripe.com or customdomain.org"
                  />
                  {error && <p className="text-rose-500 text-xs font-semibold mt-2 pl-2">{error}</p>}
                </div>

                {/* Grid for Scan Mode and Emulation */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Scan Engine / Depth */}
                  <div>
                    <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2.5 block">
                      Audit Preset
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setScanMode("standard")}
                        className={`p-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer flex flex-col gap-1.5 ${
                          scanMode === "standard"
                            ? "bg-indigo-50/50 dark:bg-indigo-950/30 border-indigo-500 text-indigo-600 dark:text-indigo-400"
                            : "bg-transparent border-gray-200 dark:border-slate-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800/40"
                        }`}
                      >
                        <Zap className="h-4.5 w-4.5" />
                        <span className="block">Quick Scan</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setScanMode("deep")}
                        className={`p-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer flex flex-col gap-1.5 ${
                          scanMode === "deep"
                            ? "bg-indigo-50/50 dark:bg-indigo-950/30 border-indigo-500 text-indigo-600 dark:text-indigo-400"
                            : "bg-transparent border-gray-200 dark:border-slate-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800/40"
                        }`}
                      >
                        <Cpu className="h-4.5 w-4.5" />
                        <span className="block">AI Deep Audit</span>
                      </button>
                    </div>
                  </div>

                  {/* Device Emulation */}
                  <div>
                    <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2.5 block">
                      Device Emulation
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setDevice("desktop")}
                        className={`p-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer flex flex-col gap-1.5 ${
                          device === "desktop"
                            ? "bg-indigo-50/50 dark:bg-indigo-950/30 border-indigo-500 text-indigo-600 dark:text-indigo-400"
                            : "bg-transparent border-gray-200 dark:border-slate-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800/40"
                        }`}
                      >
                        <Laptop className="h-4.5 w-4.5" />
                        <span className="block">Desktop View</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setDevice("mobile")}
                        className={`p-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer flex flex-col gap-1.5 ${
                          device === "mobile"
                            ? "bg-indigo-50/50 dark:bg-indigo-950/30 border-indigo-500 text-indigo-600 dark:text-indigo-400"
                            : "bg-transparent border-gray-200 dark:border-slate-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800/40"
                        }`}
                      >
                        <Smartphone className="h-4.5 w-4.5" />
                        <span className="block">Mobile View</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Detailed Analysis Vectors Checklist */}
                <div>
                  <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3.5 block">
                    Enable Specific Audits
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {/* Checkbox item */}
                    <div
                      onClick={() => toggleCheck("domStructure")}
                      className="flex items-center gap-3 p-3.5 rounded-2xl border border-gray-150 dark:border-slate-850 bg-gray-50/30 dark:bg-slate-900/20 cursor-pointer hover:border-gray-300 dark:hover:border-slate-700 transition-all"
                    >
                      <input
                        type="checkbox"
                        checked={enabledChecks.domStructure}
                        readOnly
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer h-4 w-4"
                      />
                      <div className="text-left">
                        <p className="text-xs font-bold text-gray-700 dark:text-slate-200">DOM Traversal Check</p>
                        <p className="text-[10px] text-gray-400 dark:text-gray-500 leading-none mt-1">CSS selectors & semantic HTML</p>
                      </div>
                    </div>

                    <div
                      onClick={() => toggleCheck("contrastWcag")}
                      className="flex items-center gap-3 p-3.5 rounded-2xl border border-gray-150 dark:border-slate-850 bg-gray-50/30 dark:bg-slate-900/20 cursor-pointer hover:border-gray-300 dark:hover:border-slate-700 transition-all"
                    >
                      <input
                        type="checkbox"
                        checked={enabledChecks.contrastWcag}
                        readOnly
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer h-4 w-4"
                      />
                      <div className="text-left">
                        <p className="text-xs font-bold text-gray-700 dark:text-slate-200">Color & contrast ratios</p>
                        <p className="text-[10px] text-gray-400 dark:text-gray-500 leading-none mt-1">WCAG 2.2 AA validation metrics</p>
                      </div>
                    </div>

                    <div
                      onClick={() => toggleCheck("performanceWebVitals")}
                      className="flex items-center gap-3 p-3.5 rounded-2xl border border-gray-150 dark:border-slate-850 bg-gray-50/30 dark:bg-slate-900/20 cursor-pointer hover:border-gray-300 dark:hover:border-slate-700 transition-all"
                    >
                      <input
                        type="checkbox"
                        checked={enabledChecks.performanceWebVitals}
                        readOnly
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer h-4 w-4"
                      />
                      <div className="text-left">
                        <p className="text-xs font-bold text-gray-700 dark:text-slate-200">Core Web Vitals</p>
                        <p className="text-[10px] text-gray-400 dark:text-gray-500 leading-none mt-1">FCP, LCP, CLS simulations</p>
                      </div>
                    </div>

                    <div
                      onClick={() => toggleCheck("securityHeaders")}
                      className="flex items-center gap-3 p-3.5 rounded-2xl border border-gray-150 dark:border-slate-850 bg-gray-50/30 dark:bg-slate-900/20 cursor-pointer hover:border-gray-300 dark:hover:border-slate-700 transition-all"
                    >
                      <input
                        type="checkbox"
                        checked={enabledChecks.securityHeaders}
                        readOnly
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer h-4 w-4"
                      />
                      <div className="text-left">
                        <p className="text-xs font-bold text-gray-700 dark:text-slate-200">Security Check</p>
                        <p className="text-[10px] text-gray-400 dark:text-gray-500 leading-none mt-1">SSL cert and HTTP response headers</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submition Action Button */}
                <button
                  type="submit"
                  className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Globe className="h-4.5 w-4.5 animate-pulse" />
                  <span>Execute Frontend Site Audit</span>
                </button>
              </form>
            </div>
          </div>

          {/* RIGHT: Stats Hub & Recent Scans (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Quick stats panel */}
            <div className="bg-white dark:bg-[#131520] rounded-[32px] border border-gray-200/80 dark:border-slate-800/80 p-6 shadow-sm">
              <h3 className="font-display text-sm font-bold text-[#1A1A1A] dark:text-slate-100 tracking-tight flex items-center gap-1.5 mb-4">
                <TrendingUp className="h-4 w-4 text-indigo-600 dark:text-indigo-400" /> Account Statistics
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50/50 dark:bg-slate-900/30 rounded-2xl p-4 border border-gray-150 dark:border-slate-800/50 text-left">
                  <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Scans run</p>
                  <p className="text-xl font-display font-black text-indigo-600 dark:text-indigo-400 mt-1">{scanHistory.length}</p>
                </div>
                <div className="bg-gray-50/50 dark:bg-slate-900/30 rounded-2xl p-4 border border-gray-150 dark:border-slate-800/50 text-left">
                  <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Avg Compliance</p>
                  <p className="text-xl font-display font-black text-indigo-600 dark:text-indigo-400 mt-1">
                    {scanHistory.length > 0 ? Math.round(scanHistory.reduce((acc, s) => acc + s.score, 0) / scanHistory.length) : 0}%
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Access List: Recent scans */}
            <div className="bg-white dark:bg-[#131520] rounded-[32px] border border-gray-200/80 dark:border-slate-800/80 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4.5">
                <h3 className="font-display text-sm font-bold text-[#1A1A1A] dark:text-slate-100 tracking-tight flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-indigo-600 dark:text-indigo-400" /> Recent Audits
                </h3>
              </div>

              {scanHistory.length === 0 ? (
                <div className="text-center py-8 text-gray-400 dark:text-gray-500">
                  <p className="text-xs font-semibold">No recent scans found.</p>
                  <p className="text-[10px] mt-1">Submit a URL to begin.</p>
                </div>
              ) : (
                <div className="space-y-3.5">
                  {scanHistory.slice(0, 4).map((scan) => (
                    <div
                      key={scan.id}
                      onClick={() => onSelectScan?.(scan.id)}
                      className="group p-3 rounded-2xl border border-gray-150 dark:border-slate-850/60 hover:border-indigo-400 dark:hover:border-indigo-600 hover:bg-gray-50/40 dark:hover:bg-slate-900/40 cursor-pointer transition-all flex items-center justify-between"
                    >
                      <div className="text-left min-w-0 flex-1">
                        <p className="font-sans font-bold text-xs text-[#1A1A1A] dark:text-slate-200 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {scan.url}
                        </p>
                        <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">
                          {new Date(scan.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 ml-3">
                        <span className={`text-xs font-black text-right ${
                          scan.score >= 85
                            ? "text-emerald-600 dark:text-emerald-400"
                            : scan.score >= 70
                            ? "text-amber-600 dark:text-amber-400"
                            : "text-rose-600 dark:text-rose-400"
                        }`}>
                          {scan.score}%
                        </span>
                        <ChevronRight className="h-3.5 w-3.5 text-gray-400 group-hover:translate-x-0.5 transition-transform" />
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

  // DEFAULT (LOGGED OUT) PUBLIC LANDING VIEW
  return (
    <div className="relative w-full overflow-hidden flex flex-col justify-center items-center">
      {/* Hero Section */}
      <section className="min-h-[75vh] flex flex-col justify-center items-center px-4 md:px-16 text-center max-w-4xl mx-auto w-full pt-16 md:pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="font-display text-4xl md:text-5xl font-extrabold text-[#1A1A1A] dark:text-[#E2E8F0] max-w-4xl mx-auto mb-6 leading-tight tracking-tight">
            Analyze Your Website Like an{" "}
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              AI Design Expert
            </span>
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="font-sans text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed font-medium"
        >
          Unleash the power of artificial intelligence to instantly audit your code, UX, and performance. Elevate your
          digital presence with actionable insights.
        </motion.p>

        {/* Search / Scan Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="w-full max-w-3xl"
        >
          <form
            onSubmit={handleSubmit}
            className="w-full bg-white dark:bg-[#131520] border border-gray-200 dark:border-slate-800 rounded-[32px] p-2 flex flex-col md:flex-row gap-2.5 shadow-[0_12px_40px_rgba(0,0,0,0.05)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.4)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] hover:border-gray-300 dark:hover:border-slate-700 transition-all duration-300"
          >
            <div className="flex-grow">
              <UrlAutocompleteInput
                id="landing-url-input"
                value={url}
                onChange={(val) => {
                  setUrl(val);
                  setError("");
                }}
                onStartScan={onStartScan}
                scanHistory={scanHistory}
                onSelectScan={onSelectScan}
                placeholder="https://yourwebsite.com or domain.com"
              />
            </div>
            <button
              type="submit"
              className="bg-[#1A1A1A] dark:bg-indigo-600 text-white hover:bg-black dark:hover:bg-indigo-500 font-sans font-bold text-sm px-8 py-4 rounded-[24px] hover:scale-[1.02] active:scale-98 transition-transform duration-200 whitespace-nowrap cursor-pointer shadow-sm shrink-0"
            >
              Scan Website
            </button>
          </form>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-500 text-xs md:text-sm mt-3 font-semibold text-left pl-5"
            >
              {error}
            </motion.p>
          )}
        </motion.div>

        {/* Feature Checkmarks */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-8 flex flex-wrap justify-center items-center gap-6 text-gray-500 dark:text-gray-400 font-sans text-xs md:text-sm font-medium"
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="text-emerald-500 h-4 w-4 shrink-0" />
            <span>No credit card required</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="text-emerald-500 h-4 w-4 shrink-0" />
            <span>Instant detailed report</span>
          </div>
        </motion.div>
      </section>

      {/* Comprehensive Analysis Vectors Bento Grid */}
      <section className="py-16 px-4 md:px-16 max-w-7xl mx-auto w-full">
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-display text-2xl md:text-3xl font-extrabold text-[#1A1A1A] dark:text-[#E2E8F0] mb-12 text-center tracking-tight"
        >
          Comprehensive Analysis Vectors
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featureVectors.map((vector, index) => {
            const Icon = vector.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08, duration: 0.5 }}
                className={`group relative overflow-hidden bg-white/95 dark:bg-[#131520]/95 backdrop-blur-md border border-gray-200/80 dark:border-slate-800/80 hover:border-gray-300 dark:hover:border-slate-700 rounded-[32px] p-6 md:p-8 transition-all duration-300 shadow-[0_8px_30px_rgb(0,0,0,0.02)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] cursor-default ${
                  vector.isLarge ? "md:col-span-2" : ""
                }`}
              >
                {/* Visual Ambient Glow in top right */}
                <div
                  className={`absolute top-0 right-0 w-48 h-48 bg-gradient-to-br ${vector.bgColor} to-transparent rounded-full blur-3xl opacity-10 group-hover:opacity-30 transition-opacity duration-300 pointer-events-none`}
                ></div>

                <div className={`p-3 rounded-[16px] bg-gray-50 dark:bg-slate-900 border border-gray-100/80 dark:border-slate-800/80 w-fit mb-5 group-hover:scale-110 transition-transform`}>
                  <Icon className={`h-6 w-6 md:h-7 md:w-7 ${vector.color}`} />
                </div>

                <h3 className="font-display text-lg md:text-xl font-bold mb-3 text-[#1A1A1A] dark:text-slate-200 tracking-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {vector.title}
                </h3>
                <p className={`font-sans text-gray-500 dark:text-gray-400 text-xs md:text-sm leading-relaxed ${vector.isLarge ? "max-w-xl" : ""}`}>
                  {vector.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
