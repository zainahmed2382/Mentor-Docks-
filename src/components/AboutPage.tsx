import React from "react";
import { Info, Sparkles, Server, Zap, Compass, Database, Terminal, ShieldAlert } from "lucide-react";

export default function AboutPage() {
  const pipelineSteps = [
    {
      step: "01",
      title: "URL Resolution & Handshake",
      description: "Normalizes the web target and performs an automated, server-side HTTP handshake. Calculates page load latency (TTFB) and tests SSL configuration.",
      icon: Compass,
      color: "text-blue-500",
      bg: "bg-blue-50 dark:bg-blue-950/20"
    },
    {
      step: "02",
      title: "Live Structural Crawling",
      description: "Retrieves raw HTML and parses tag distributions. Crawls semantic headers, responsive viewport triggers, and meta properties directly.",
      icon: Terminal,
      color: "text-indigo-500",
      bg: "bg-indigo-50 dark:bg-indigo-950/20"
    },
    {
      step: "03",
      title: "8-Core Analysis Alignment",
      description: "Aggregates the retrieved structures into 8 specialized categories: Code Quality, UI/UX, Responsiveness, Typography, Color, Accessibility, Performance, and SEO.",
      icon: Zap,
      color: "text-pink-500",
      bg: "bg-pink-50 dark:bg-pink-950/20"
    },
    {
      step: "04",
      title: "Mentor AI Evaluation",
      description: "Streams aggregated signatures to Mentor AI server-side. Generates detailed diagnostics, severities, and exact suggested code corrections.",
      icon: Sparkles,
      color: "text-purple-500",
      bg: "bg-purple-50 dark:bg-purple-950/20"
    }
  ];

  const techStack = [
    { name: "Mentor AI Core", role: "Cognitive AI Core Analyzer", desc: "Performs high-performance context mapping and code repair suggestions.", icon: Sparkles, color: "text-purple-600 dark:text-purple-400" },
    { name: "Node.js / Express", role: "Server Orchestration & Crawl", desc: "Executes parallel HTTP handshakes and HTML tag regex parsing.", icon: Server, color: "text-green-600 dark:text-green-400" },
    { name: "Neon Serverless Postgres", role: "Durable History Logging", desc: "Stores users records, metrics arrays, and issues tables.", icon: Database, color: "text-teal-600 dark:text-teal-400" },
    { name: "React 19 & Tailwind", role: "Interactive Client Client", desc: "Renders responsive bento structures with smooth motion effects.", icon: Zap, color: "text-cyan-500 dark:text-cyan-400" }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-16 pt-10 pb-20 font-sans flex flex-col gap-10">
      {/* Page Header */}
      <div className="border-b border-gray-200/60 dark:border-slate-800/60 pb-6">
        <h1 className="font-display text-3xl font-extrabold text-[#1A1A1A] dark:text-[#E2E8F0] tracking-tight flex items-center gap-2">
          <Info className="h-7 w-7 text-indigo-600 dark:text-indigo-400" /> About Mentor Docks
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium">
          Understand the internal crawling, scraping, and AI analysis pipeline powering your website audits.
        </p>
      </div>

      {/* Main Pitch Banner */}
      <div className="bg-gradient-to-br from-indigo-900 to-[#10101C] rounded-[40px] p-8 md:p-12 text-white relative overflow-hidden shadow-xl">
        {/* Ambient Gradients */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-10 -left-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-2xl relative z-10 flex flex-col gap-4">
          <div className="flex items-center gap-2 bg-white/10 border border-white/10 px-3.5 py-1.5 rounded-full w-fit">
            <Sparkles className="h-3.5 w-3.5 text-indigo-300" />
            <span className="text-[10px] font-sans font-bold tracking-wider uppercase text-indigo-200">
              Technology Overview
            </span>
          </div>

          <h2 className="font-display text-2xl md:text-4xl font-extrabold tracking-tight leading-tight">
            Comprehensive audits built from real publicly accessible live URLs.
          </h2>
          <p className="text-xs md:text-sm text-indigo-200 leading-relaxed font-semibold">
            Unlike standard site crawlers that require complex access keys, Git repository setups, or manual template uploads, Mentor Docks acts just like a real user. By executing HTTP requests, analyzing DOM metadata on the fly, and utilizing the server-side Mentor AI model, it delivers detailed UI repair layouts in seconds.
          </p>
        </div>
      </div>

      {/* Grid: Pipeline Steps */}
      <div className="flex flex-col gap-6">
        <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest border-b border-gray-100 dark:border-slate-800 pb-3">
          Core Audit Pipeline
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pipelineSteps.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div
                key={idx}
                className="bg-white dark:bg-[#131520] border border-gray-200 dark:border-slate-800 hover:border-indigo-100 dark:hover:border-indigo-500 rounded-3xl p-6 shadow-sm flex flex-col gap-4 transition-all hover:shadow-[0_12px_24px_rgba(79,70,229,0.03)]"
              >
                <div className="flex justify-between items-center">
                  <div className={`p-2.5 rounded-2xl ${p.bg} ${p.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="font-mono text-xl font-extrabold text-indigo-200 dark:text-indigo-900/60">{p.step}</span>
                </div>

                <div>
                  <h4 className="font-sans font-extrabold text-sm text-[#1A1A1A] dark:text-slate-200 tracking-tight">{p.title}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 leading-relaxed">{p.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tech Stack Bento Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Card: Tech Intro */}
        <div className="lg:col-span-4 bg-gray-50 dark:bg-[#131520] border border-gray-200 dark:border-slate-800 p-6 md:p-8 rounded-[32px] shadow-sm flex flex-col gap-4">
          <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Architectural Pillars</h3>
          <h4 className="font-display text-xl font-extrabold text-[#1A1A1A] dark:text-slate-200 tracking-tight leading-snug">
            Engineered for speed, durability, and privacy.
          </h4>
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
            All AI processing and website crawler functions are handled securely in our sandbox environments server-side. No private API keys or user records are exposed to browsers.
          </p>

          <div className="mt-2 bg-white dark:bg-slate-900 border border-gray-200/80 dark:border-slate-800/80 p-4 rounded-2xl flex gap-3 items-start shadow-sm">
            <div className="p-1.5 bg-rose-50 dark:bg-rose-950/20 text-rose-500 rounded-lg shrink-0 mt-0.5">
              <ShieldAlert className="h-4 w-4" />
            </div>
            <div>
              <h5 className="text-xs font-bold text-gray-800 dark:text-slate-200">Secure Sandboxing</h5>
              <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5 leading-normal">
                External crawler queries are parsed inside clean isolated containers with absolute respect for robots.txt policies.
              </p>
            </div>
          </div>
        </div>

        {/* Right Card: Tech Stack Rows */}
        <div className="lg:col-span-8 bg-white dark:bg-[#131520] border border-gray-200 dark:border-slate-800 p-6 md:p-8 rounded-[32px] shadow-sm">
          <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest border-b border-gray-100 dark:border-slate-800 pb-3 mb-6">
            The Technology Stack
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {techStack.map((tech, idx) => {
              const Icon = tech.icon;
              return (
                <div key={idx} className="flex gap-4 items-start p-4 hover:bg-gray-50 dark:hover:bg-slate-800/20 rounded-2xl transition-all">
                  <div className={`p-2.5 rounded-2xl bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 ${tech.color} shrink-0`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h5 className="font-sans font-extrabold text-sm text-[#1A1A1A] dark:text-slate-200 leading-tight">{tech.name}</h5>
                    <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold uppercase mt-1 block">{tech.role}</span>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-normal">{tech.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
