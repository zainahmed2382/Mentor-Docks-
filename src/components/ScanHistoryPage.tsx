import React from "react";
import { WebsiteScan } from "../types";
import { History, TrendingUp, Search, Trash2, ChevronRight, AlertTriangle, ShieldCheck } from "lucide-react";

interface ScanHistoryPageProps {
  scanHistory: WebsiteScan[];
  onSelectScan: (id: string) => void;
  onDeleteScan?: (id: string) => void;
  activeScanId: string | null;
}

export default function ScanHistoryPage({
  scanHistory,
  onSelectScan,
  onDeleteScan,
  activeScanId,
}: ScanHistoryPageProps) {
  const [searchQuery, setSearchQuery] = React.useState("");

  const filteredScans = scanHistory.filter((scan) => {
    return (
      scan.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scan.score.toString().includes(searchQuery)
    );
  });

  return (
    <div className="w-full flex flex-col gap-8 max-w-7xl mx-auto px-4 md:px-16 pt-10 pb-20 font-sans">
      {/* Header */}
      <div className="border-b border-gray-200/60 dark:border-slate-800/60 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-[#1A1A1A] dark:text-slate-100 tracking-tight flex items-center gap-2">
            <History className="h-7 w-7 text-indigo-600 dark:text-indigo-400" /> Complete Scan History
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium">
            Browse and retrieve previous technical audits and visual assertions.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30 px-4 py-2 rounded-2xl">
          <TrendingUp className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          <span className="font-mono text-xs text-indigo-600 dark:text-indigo-400 font-bold">
            Average Score: {scanHistory.length > 0 ? Math.round(scanHistory.reduce((acc, s) => acc + s.score, 0) / scanHistory.length) : 0}%
          </span>
        </div>
      </div>

      {/* Statistics Mini Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-[#131520] rounded-2xl border border-gray-200/80 dark:border-slate-800/80 p-5 shadow-sm">
          <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Total Audits</p>
          <p className="text-2xl font-display font-extrabold text-[#1A1A1A] dark:text-slate-100 mt-1">{scanHistory.length}</p>
        </div>
        <div className="bg-white dark:bg-[#131520] rounded-2xl border border-gray-200/80 dark:border-slate-800/80 p-5 shadow-sm">
          <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">High Compliance (80+)</p>
          <p className="text-2xl font-display font-extrabold text-[#1A1A1A] dark:text-slate-100 mt-1">
            {scanHistory.filter((s) => s.score >= 80).length}
          </p>
        </div>
        <div className="bg-white dark:bg-[#131520] rounded-2xl border border-gray-200/80 dark:border-slate-800/80 p-5 shadow-sm">
          <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Alerts Open</p>
          <p className="text-2xl font-display font-extrabold text-[#1A1A1A] dark:text-slate-100 mt-1">
            {scanHistory.reduce((acc, s) => acc + s.problems.length, 0)}
          </p>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="space-y-4">
        {/* Search */}
        <div className="w-full bg-white dark:bg-[#131520] border border-gray-200 dark:border-slate-800 rounded-2xl px-4 py-3 flex items-center gap-3 shadow-sm max-w-md focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 focus-within:dark:ring-indigo-950/40 transition-all">
          <Search className="h-4.5 w-4.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search scans by URL or score..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent outline-none text-xs md:text-sm text-[#1A1A1A] dark:text-slate-200"
          />
        </div>

        {filteredScans.length === 0 ? (
          <div className="bg-white dark:bg-[#131520] rounded-[32px] border border-gray-200/80 dark:border-slate-800/80 p-16 text-center shadow-sm">
            <History className="h-12 w-12 text-gray-300 dark:text-slate-700 mx-auto mb-4" />
            <h3 className="font-display text-base font-bold text-[#1A1A1A] dark:text-slate-300">No audits found</h3>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 max-w-xs mx-auto">
              We couldn't find any scans matching your criteria. Start a new scan in the main panel.
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-[#131520] rounded-[32px] border border-gray-200/80 dark:border-slate-800/80 overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/40">
                  <th className="py-4.5 px-6 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Website Target</th>
                  <th className="py-4.5 px-6 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Audit Score</th>
                  <th className="py-4.5 px-6 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Rating</th>
                  <th className="py-4.5 px-6 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider hidden md:table-cell">Health Status</th>
                  <th className="py-4.5 px-6 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredScans.map((scan) => {
                  const isActive = scan.id === activeScanId;
                  return (
                    <tr
                      key={scan.id}
                      onClick={() => onSelectScan(scan.id)}
                      className={`border-b border-gray-100/80 dark:border-slate-800/60 hover:bg-gray-50/60 dark:hover:bg-slate-800/20 last:border-0 transition-all cursor-pointer ${
                        isActive ? "bg-indigo-50/20 dark:bg-indigo-950/20" : ""
                      }`}
                    >
                      {/* URL */}
                      <td className="py-5 px-6 min-w-0 max-w-[180px] sm:max-w-xs">
                        <div className="font-sans font-bold text-sm text-[#1A1A1A] dark:text-slate-200 truncate pr-4">
                          {scan.url}
                        </div>
                        <div className="text-[10px] text-gray-400 dark:text-gray-500 mt-1 font-semibold">
                          {new Date(scan.date).toLocaleString()}
                        </div>
                      </td>

                      {/* Score Badge */}
                      <td className="py-5 px-6">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-extrabold text-indigo-600 dark:text-indigo-400">
                            {scan.score}
                          </span>
                          <span className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider">/100</span>
                        </div>
                      </td>

                      {/* Rating Label */}
                      <td className="py-5 px-6">
                        {scan.score >= 85 ? (
                          <span className="inline-flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100/50 dark:border-emerald-900/40 text-emerald-700 dark:text-emerald-400 font-bold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                            <ShieldCheck className="h-3 w-3" /> Excellent
                          </span>
                        ) : scan.score >= 70 ? (
                          <span className="inline-flex items-center gap-1 bg-amber-50 dark:bg-amber-950/30 border border-amber-100/50 dark:border-amber-900/40 text-amber-700 dark:text-amber-400 font-bold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                            <AlertTriangle className="h-3 w-3" /> Good
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-rose-50 dark:bg-rose-950/30 border border-rose-100/50 dark:border-rose-900/40 text-rose-700 dark:text-rose-400 font-bold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                            <AlertTriangle className="h-3 w-3 animate-pulse" /> Critical
                          </span>
                        )}
                      </td>

                      {/* Health Message */}
                      <td className="py-5 px-6 hidden md:table-cell">
                        <p className="text-xs text-gray-400 dark:text-gray-500 leading-normal truncate max-w-xs md:max-w-sm font-semibold">
                          {scan.healthMessage}
                        </p>
                      </td>

                      {/* Select Actions */}
                      <td className="py-5 px-6 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2.5">
                          {onDeleteScan && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (confirm(`Delete the audit record for ${scan.url}?`)) {
                                  onDeleteScan(scan.id);
                                }
                              }}
                              className="p-1.5 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-gray-400 dark:text-gray-500 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg border border-transparent hover:border-rose-100 dark:hover:border-rose-900/40 transition-all cursor-pointer"
                              title="Delete Scan"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            onClick={() => onSelectScan(scan.id)}
                            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-gray-100 dark:bg-slate-800 hover:bg-indigo-600 dark:hover:bg-indigo-600 text-[#1A1A1A] dark:text-slate-200 hover:text-white dark:hover:text-white border border-transparent transition-all cursor-pointer flex items-center gap-1 shadow-sm"
                          >
                            <span>Open</span>
                            <ChevronRight className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
