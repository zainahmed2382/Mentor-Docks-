import React from "react";
import { motion } from "motion/react";
import {
  Clock,
  PlusCircle,
  AlertTriangle,
  Compass,
  ArrowUpRight,
  TrendingUp,
  Image,
  Palette,
  Monitor,
  FileCode2,
  Sparkles,
} from "lucide-react";

// --- PROJECTS TAB ---
import { useState } from "react";

interface ProjectsPageProps {
  onScanClick: (url: string) => void;
  projects: any[];
  onSaveProject: (project: { name: string; url: string; category: string; score?: number; lastScan?: string; issues?: number }) => Promise<void>;
  user: any;
  onLoginClick: () => void;
}

export function ProjectsPage({ onScanClick, projects, onSaveProject, user, onLoginClick }: ProjectsPageProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [category, setCategory] = useState("Landing Page");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name || !url) {
      setError("Please fill in all fields.");
      return;
    }

    setIsSaving(true);
    try {
      // Normalize URL (make sure it starts with http or https)
      let formattedUrl = url.trim();
      if (!/^https?:\/\//i.test(formattedUrl)) {
        formattedUrl = "https://" + formattedUrl;
      }

      await onSaveProject({
        name: name.trim(),
        url: formattedUrl,
        category,
        score: Math.floor(Math.random() * 25) + 75, // initial dynamic mock audit score
        lastScan: "Just now",
        issues: Math.floor(Math.random() * 5)
      });

      // Reset
      setName("");
      setUrl("");
      setCategory("Landing Page");
      setShowAddForm(false);
    } catch (err: any) {
      setError(err.message || "Failed to save project.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-8 max-w-7xl mx-auto px-4 md:px-16 pt-10 pb-20 font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-200/60 dark:border-slate-800/60 pb-6">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-[#1A1A1A] dark:text-slate-100 tracking-tight">Saved Projects</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium">
            {user ? "Manage and audit your persistent web properties stored in Neon DB." : "Sign in to save and monitor your real web properties."}
          </p>
        </div>
        
        {user ? (
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2 bg-[#1A1A1A] dark:bg-indigo-600 hover:bg-black dark:hover:bg-indigo-500 text-white font-sans font-semibold text-xs md:text-sm px-5 py-2.5 rounded-full shadow-sm transition-all cursor-pointer"
          >
            <PlusCircle className="h-4 w-4" />
            {showAddForm ? "Cancel" : "Track New Website"}
          </button>
        ) : (
          <button
            onClick={onLoginClick}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-sans font-semibold text-xs md:text-sm px-5 py-2.5 rounded-full shadow-md transition-all cursor-pointer hover:scale-105 active:scale-95"
          >
            <PlusCircle className="h-4 w-4" /> Sign In to Track Websites
          </button>
        )}
      </div>

      {/* Add Project Form Drawer/Modal */}
      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-[#131520] rounded-[28px] border border-gray-200 dark:border-slate-800 p-6 md:p-8 shadow-lg max-w-2xl"
        >
          <h3 className="font-display text-lg font-bold text-gray-900 dark:text-slate-200 mb-2">Track a New Website</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">Enter your project's details to save it securely to your account.</p>

          {error && <div className="mb-4 text-xs font-semibold text-red-600 dark:text-rose-400 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 p-3 rounded-xl">{error}</div>}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5 col-span-1">
              <label className="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500">Project Name</label>
              <input
                type="text"
                placeholder="My Business Portal"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-gray-50 dark:bg-slate-900 hover:bg-gray-100/50 dark:hover:bg-slate-800/50 focus:bg-white dark:focus:bg-[#0A0B10] border border-gray-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm text-[#1A1A1A] dark:text-slate-200 outline-none transition-all focus:border-indigo-500"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5 col-span-1">
              <label className="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500">Website URL</label>
              <input
                type="text"
                placeholder="mybusiness.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full bg-gray-50 dark:bg-slate-900 hover:bg-gray-100/50 dark:hover:bg-slate-800/50 focus:bg-white dark:focus:bg-[#0A0B10] border border-gray-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm text-[#1A1A1A] dark:text-slate-200 outline-none transition-all focus:border-indigo-500"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500">Business Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-gray-50 dark:bg-slate-900 hover:bg-gray-100/50 dark:hover:bg-slate-800/50 focus:bg-white dark:focus:bg-[#0A0B10] border border-gray-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm text-[#1A1A1A] dark:text-slate-200 outline-none transition-all focus:border-indigo-500"
              >
                <option value="Landing Page" className="dark:bg-[#131520]">Landing Page</option>
                <option value="E-Commerce Fintech" className="dark:bg-[#131520]">E-Commerce Fintech</option>
                <option value="Productivity SaaS" className="dark:bg-[#131520]">Productivity SaaS</option>
                <option value="Personal Brand" className="dark:bg-[#131520]">Personal Brand</option>
                <option value="WebGL Arcade" className="dark:bg-[#131520]">WebGL/Media Platform</option>
                <option value="Corporate Core" className="dark:bg-[#131520]">Corporate / Enterprise</option>
                <option value="Other" className="dark:bg-[#131520]">Other</option>
              </select>
            </div>

            <div className="md:col-span-2 flex justify-end gap-3 mt-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-slate-800/50 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-5 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
              >
                {isSaving ? "Saving..." : "Save Website"}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {projects.length === 0 ? (
        <div className="bg-white dark:bg-[#131520] rounded-[32px] p-12 border border-gray-200 dark:border-slate-800 text-center flex flex-col items-center justify-center">
          <div className="h-12 w-12 rounded-full bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
            <Compass className="h-6 w-6" />
          </div>
          <h3 className="font-display text-lg font-bold text-gray-900 dark:text-slate-200">No tracked websites yet</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-sm">
            {user ? "Click 'Track New Website' above to save and monitor website scores in your cloud account." : "Sign in and start saving websites to your portfolio tracked list."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project, idx) => (
            <motion.div
              key={project.id || idx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              className="bg-white dark:bg-[#131520] rounded-[32px] p-6 border border-gray-200/80 dark:border-slate-800/80 hover:border-gray-300 dark:hover:border-slate-700 hover:shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-all duration-300 relative group overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-indigo-50/50 dark:from-indigo-950/10 to-transparent rounded-bl-full pointer-events-none"></div>

              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/30 px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                    {project.category}
                  </span>
                  <h3 className="font-display text-lg font-bold text-[#1A1A1A] dark:text-slate-100 mt-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate max-w-xs md:max-w-sm">
                    {project.name}
                  </h3>
                  <p className="font-mono text-xs text-gray-400 dark:text-gray-500 mt-1 truncate max-w-xs md:max-w-sm">{project.url}</p>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-display font-extrabold text-indigo-600 dark:text-indigo-400">{project.score}</div>
                  <div className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase">SCORE</div>
                </div>
              </div>

              <div className="h-px bg-gray-100 dark:bg-slate-800/80 my-4"></div>

              <div className="flex justify-between items-center text-xs">
                <div className="flex gap-4">
                  <span className="text-gray-500 dark:text-gray-400 font-medium flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-gray-400 dark:text-gray-500" /> {project.lastScan || "Never"}
                  </span>
                  <span className="text-rose-500 flex items-center gap-1 font-semibold">
                    <AlertTriangle className="h-3.5 w-3.5" /> {project.issues} Alerts
                  </span>
                </div>

                <button
                  onClick={() => onScanClick(project.url)}
                  className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center gap-1 cursor-pointer hover:underline"
                >
                  Run Audit <ArrowUpRight className="h-3 w-3" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

// --- INSIGHTS TAB ---
export function InsightsPage() {
  const commonBottlenecks = [
    {
      title: "Image Format Inefficiencies",
      rate: 70,
      icon: Image,
      color: "text-sky-600 dark:text-sky-400",
      bg: "bg-sky-50 dark:bg-sky-950/20",
      gradient: "from-sky-500 via-cyan-500 to-blue-500 dark:from-sky-400 dark:via-cyan-400 dark:to-blue-400",
      glow: "shadow-[0_0_10px_rgba(56,189,248,0.25)]"
    },
    {
      title: "WCAG Contrast Violations",
      rate: 65,
      icon: Palette,
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-50 dark:bg-purple-950/20",
      gradient: "from-purple-500 via-indigo-500 to-violet-500 dark:from-purple-400 dark:via-indigo-400 dark:to-violet-400",
      glow: "shadow-[0_0_10px_rgba(192,132,252,0.25)]"
    },
    {
      title: "Viewport Fluidity Bottlenecks",
      rate: 45,
      icon: Monitor,
      color: "text-pink-600 dark:text-pink-400",
      bg: "bg-pink-50 dark:bg-pink-950/20",
      gradient: "from-pink-500 via-rose-500 to-fuchsia-500 dark:from-pink-400 dark:via-rose-400 dark:to-fuchsia-400",
      glow: "shadow-[0_0_10px_rgba(244,114,182,0.25)]"
    },
    {
      title: "Redundant JS Script Execution",
      rate: 40,
      icon: FileCode2,
      color: "text-rose-600 dark:text-rose-400",
      bg: "bg-rose-50 dark:bg-rose-950/20",
      gradient: "from-rose-500 via-red-500 to-amber-500 dark:from-rose-400 dark:via-red-400 dark:to-amber-400",
      glow: "shadow-[0_0_10px_rgba(251,113,133,0.25)]"
    },
  ];

  return (
    <div className="w-full flex flex-col gap-8 max-w-7xl mx-auto px-4 md:px-16 pt-10 pb-20 font-sans">
      <div className="border-b border-gray-200/60 dark:border-slate-800/60 pb-6">
        <h1 className="font-display text-3xl font-extrabold text-[#1A1A1A] dark:text-slate-100 tracking-tight flex items-center gap-2">
          <TrendingUp className="h-7 w-7 text-indigo-600 dark:text-indigo-400" /> Global Design Insights
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium">Cross-project UX patterns, compliance metrics, and AI statistics.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Metric Summary Card */}
        <div className="bg-white dark:bg-[#131520] rounded-[32px] p-6 border border-gray-200/80 dark:border-slate-800/80 flex flex-col justify-between shadow-sm">
          <div>
            <h3 className="text-gray-400 dark:text-gray-500 text-xs font-bold uppercase tracking-widest">Average Audit Index</h3>
            <div className="text-4xl font-display font-extrabold text-indigo-600 dark:text-indigo-400 mt-2">77.5 / 100</div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 leading-relaxed font-medium">
              Based on deep audits of your saved properties, your web ecosystem sits at a{" "}
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">Good</span> health tier. Accessibility and Image Payloads
              remain the highest impact improvement vectors.
            </p>
          </div>
          <div className="h-1.5 w-full bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden mt-6">
            <div className="h-full bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full w-[77.5%]"></div>
          </div>
        </div>

        {/* Global Statistics Grid (2 Columns) */}
        <div className="lg:col-span-2 bg-white dark:bg-[#131520] rounded-[32px] p-6 border border-gray-200/80 dark:border-slate-800/80 shadow-sm flex flex-col gap-4">
          <h3 className="font-display text-base font-bold text-[#1A1A1A] dark:text-slate-200 flex items-center gap-2 mb-2">
            <Compass className="h-4 w-4 text-purple-600 dark:text-purple-400" /> Common Compliance Bottlenecks
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {commonBottlenecks.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="bg-gray-50/50 dark:bg-[#0A0B10]/40 border border-gray-100 dark:border-slate-800 rounded-[20px] p-4 flex gap-4 items-center">
                  <div className={`p-2.5 rounded-xl ${item.bg} border border-gray-100 dark:border-slate-800 shrink-0`}>
                    <Icon className={`h-5 w-5 ${item.color}`} />
                  </div>
                  <div className="flex-grow min-w-0">
                    <h4 className="text-xs md:text-sm font-bold text-[#1A1A1A] dark:text-slate-200 truncate leading-tight">{item.title}</h4>
                    <div className="flex items-center gap-3 mt-2.5">
                      <div className="h-2.5 flex-grow bg-gray-200/80 dark:bg-slate-800/90 rounded-full overflow-hidden p-0.5 border border-gray-200/40 dark:border-slate-700/50 shadow-inner">
                        <motion.div
                          initial={{ width: "0%" }}
                          animate={{ width: `${item.rate}%` }}
                          transition={{ duration: 1.2, ease: "easeOut", delay: 0.15 * idx }}
                          className={`h-full bg-gradient-to-r ${item.gradient} rounded-full ${item.glow}`}
                        />
                      </div>
                      <span className="text-xs font-mono font-bold text-gray-700 dark:text-slate-300 shrink-0">{item.rate}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recommended Design Checkpoints List */}
      <section className="bg-white dark:bg-[#131520] rounded-[32px] p-6 border border-gray-200/80 dark:border-slate-800/80 shadow-sm">
        <h3 className="font-display text-base font-bold text-[#1A1A1A] dark:text-slate-200 flex items-center gap-2 mb-4">
          <Sparkles className="h-4 w-4 text-indigo-600 dark:text-indigo-400" /> Best-Practice Implementation Checkpoints
        </h3>
        <div className="flex flex-col gap-3">
          <div className="bg-gray-50/50 dark:bg-[#0A0B10]/40 border border-gray-100 dark:border-slate-800/80 rounded-[20px] p-4 flex items-center justify-between hover:border-indigo-200 dark:hover:border-indigo-500 hover:bg-gray-50 dark:hover:bg-slate-800/30 transition-all">
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-sky-500"></span>
              <span className="text-xs md:text-sm text-[#1A1A1A] dark:text-slate-200 font-semibold">Deploy Next-Gen WebP/AVIF format pipelines</span>
            </div>
            <span className="text-[10px] bg-sky-50 dark:bg-sky-950/20 text-sky-700 dark:text-sky-400 border border-sky-100 dark:border-sky-900/30 font-bold px-2 py-0.5 rounded uppercase">High Priority</span>
          </div>
          <div className="bg-gray-50/50 dark:bg-[#0A0B10]/40 border border-gray-100 dark:border-slate-800/80 rounded-[20px] p-4 flex items-center justify-between hover:border-indigo-200 dark:hover:border-indigo-500 hover:bg-gray-50 dark:hover:bg-slate-800/30 transition-all">
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-purple-500"></span>
              <span className="text-xs md:text-sm text-[#1A1A1A] dark:text-slate-200 font-semibold">Verify 4.5:1 WCAG contrast compliance ratios on headers</span>
            </div>
            <span className="text-[10px] bg-purple-50 dark:bg-purple-950/20 text-purple-700 dark:text-purple-400 border border-purple-100 dark:border-purple-900/30 font-bold px-2 py-0.5 rounded uppercase">High Priority</span>
          </div>
          <div className="bg-gray-50/50 dark:bg-[#0A0B10]/40 border border-gray-100 dark:border-slate-800/80 rounded-[20px] p-4 flex items-center justify-between hover:border-indigo-200 dark:hover:border-indigo-500 hover:bg-gray-50 dark:hover:bg-slate-800/30 transition-all">
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-pink-500"></span>
              <span className="text-xs md:text-sm text-[#1A1A1A] dark:text-slate-200 font-semibold">Attach descriptive ARIA landmarks and link button tags</span>
            </div>
            <span className="text-[10px] bg-pink-50 dark:bg-pink-950/20 text-pink-700 dark:text-pink-400 border border-pink-100 dark:border-pink-900/30 font-bold px-2 py-0.5 rounded uppercase">Medium Priority</span>
          </div>
        </div>
      </section>
    </div>
  );
}
