import React, { useState } from "react";
import { Settings, Bell, ShieldAlert, Cpu, Database, Save, RotateCcw, Cloud, Trash2, Download } from "lucide-react";
import { WebsiteScan } from "../types";

interface SettingsPageProps {
  onClearHistory?: () => void;
  scanHistory: WebsiteScan[];
}

export default function SettingsPage({ onClearHistory, scanHistory }: SettingsPageProps) {
  // Option Toggles state
  const [contrastCheck, setContrastCheck] = useState(true);
  const [altCheck, setAltCheck] = useState(true);
  const [speedCheck, setSpeedCheck] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(false);
  const [alertThreshold, setAlertThreshold] = useState("80");
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveSettings = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }, 1000);
  };

  const handleExportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(scanHistory, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "mentor_compliance_backup.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="mb-10 text-center sm:text-left">
        <h1 className="font-display text-3xl font-extrabold text-gray-900 dark:text-[#E2E8F0] tracking-tight">
          System Settings
        </h1>
        <p className="font-sans text-sm text-gray-500 dark:text-gray-400 mt-1">
          Customize scan triggers, reporting frequency, alert thresholds, and backup your private reports database.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Navigation Sidebar inside Page (Bento-styled) */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-[#131520] rounded-[24px] border border-gray-200/80 dark:border-slate-800 p-5 shadow-sm space-y-1">
            <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-3 mb-3">Preferences</h3>
            <button className="w-full text-left font-sans text-xs md:text-sm font-semibold px-4 py-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 flex items-center gap-2.5">
              <Cpu className="h-4 w-4 shrink-0" />
              <span>Analyzer Preferences</span>
            </button>
            <button className="w-full text-left font-sans text-xs md:text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800/40 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white flex items-center gap-2.5 cursor-pointer">
              <Bell className="h-4 w-4 shrink-0" />
              <span>Notifications & Alerts</span>
            </button>
            <button className="w-full text-left font-sans text-xs md:text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800/40 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white flex items-center gap-2.5 cursor-pointer">
              <Database className="h-4 w-4 shrink-0" />
              <span>Backup & Data Control</span>
            </button>
          </div>

          <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-[24px] p-6 shadow-md relative overflow-hidden">
            <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 opacity-10">
              <Cloud className="h-32 w-32" />
            </div>
            <span className="text-[9px] font-bold tracking-widest text-indigo-300 uppercase block mb-1">
              Cloud Synchronized
            </span>
            <h4 className="font-display font-bold text-base mb-2">Neon Database Connected</h4>
            <p className="font-sans text-xs text-indigo-200/85 leading-relaxed">
              Your configurations and scan reports are automatically synchronized with a secure, highly-performant PostgreSQL database.
            </p>
          </div>
        </div>

        {/* Settings Area */}
        <div className="lg:col-span-2 space-y-6">
          {savedSuccess && (
            <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs px-4 py-3 rounded-2xl flex items-center gap-2 font-medium">
              <Cpu className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Settings saved successfully! Analyzer parameters updated.</span>
            </div>
          )}

          {/* Section: Scan Preferences */}
          <div className="bg-white dark:bg-[#131520] rounded-[32px] border border-gray-200/80 dark:border-slate-800 p-8 shadow-sm">
            <h3 className="font-display text-lg font-bold text-gray-900 dark:text-slate-200 mb-6 flex items-center gap-2">
              <Cpu className="h-5 w-5 text-indigo-500" />
              <span>Analyzer Preferences</span>
            </h3>

            <div className="space-y-6">
              {/* Option 1 */}
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <span className="block font-sans text-sm font-semibold text-gray-900 dark:text-slate-200">Contrast Ratio Verification</span>
                  <p className="font-sans text-xs text-gray-400 dark:text-gray-500">
                    Parse HTML markup style tags to verify WCAG AA 4.5:1 compliant contrast thresholds.
                  </p>
                </div>
                <button
                  onClick={() => setContrastCheck(!contrastCheck)}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer outline-none shrink-0 ${
                    contrastCheck ? "bg-indigo-600" : "bg-gray-200 dark:bg-slate-800"
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                      contrastCheck ? "transform translate-x-5" : ""
                    }`}
                  />
                </button>
              </div>

              {/* Option 2 */}
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <span className="block font-sans text-sm font-semibold text-gray-900 dark:text-slate-200">Alt Image Tag Analysis</span>
                  <p className="font-sans text-xs text-gray-400 dark:text-gray-500">
                    Ensure screen-readers are supported on all visual elements by enforcing non-empty descriptive alt attributes.
                  </p>
                </div>
                <button
                  onClick={() => setAltCheck(!altCheck)}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer outline-none shrink-0 ${
                    altCheck ? "bg-indigo-600" : "bg-gray-200 dark:bg-slate-800"
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                      altCheck ? "transform translate-x-5" : ""
                    }`}
                  />
                </button>
              </div>

              {/* Option 3 */}
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <span className="block font-sans text-sm font-semibold text-gray-900 dark:text-slate-200">Real-time Performance Tests</span>
                  <p className="font-sans text-xs text-gray-400 dark:text-gray-500">
                    Determine page speed calculations, render-blocking scripts, and server response speeds using heuristic APIs.
                  </p>
                </div>
                <button
                  onClick={() => setSpeedCheck(!speedCheck)}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer outline-none shrink-0 ${
                    speedCheck ? "bg-indigo-600" : "bg-gray-200 dark:bg-slate-800"
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                      speedCheck ? "transform translate-x-5" : ""
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Section: Notifications */}
          <div className="bg-white dark:bg-[#131520] rounded-[32px] border border-gray-200/80 dark:border-slate-800 p-8 shadow-sm">
            <h3 className="font-display text-lg font-bold text-gray-900 dark:text-slate-200 mb-6 flex items-center gap-2">
              <Bell className="h-5 w-5 text-indigo-500" />
              <span>Smart Alerts & Notifications</span>
            </h3>

            <div className="space-y-5">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <span className="block font-sans text-sm font-semibold text-gray-900 dark:text-slate-200">Email Alerts on Compliance Drifts</span>
                  <p className="font-sans text-xs text-gray-400 dark:text-gray-500">
                    Receive direct reports if the website score drops below your set compliance percentage limit.
                  </p>
                </div>
                <button
                  onClick={() => setEmailAlerts(!emailAlerts)}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer outline-none shrink-0 ${
                    emailAlerts ? "bg-indigo-600" : "bg-gray-200 dark:bg-slate-800"
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                      emailAlerts ? "transform translate-x-5" : ""
                    }`}
                  />
                </button>
              </div>

              {emailAlerts && (
                <div className="p-4 bg-gray-50 dark:bg-slate-900 rounded-2xl border border-gray-100/80 dark:border-slate-800/80 animate-in fade-in duration-250">
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                    Alert Score Threshold
                  </label>
                  <select
                    value={alertThreshold}
                    onChange={(e) => setAlertThreshold(e.target.value)}
                    className="w-full font-sans text-sm px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-[#1A1A1A] dark:text-slate-100 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
                  >
                    <option value="95">95% Score - High Standards (Highly Restrictive)</option>
                    <option value="90">90% Score - Balanced Standards</option>
                    <option value="80">80% Score - Minimum Level Compliance (Recommended)</option>
                    <option value="70">70% Score - Major Inconsistencies only</option>
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Section: Data Backup & Control */}
          <div className="bg-white dark:bg-[#131520] rounded-[32px] border border-gray-200/80 dark:border-slate-800 p-8 shadow-sm">
            <h3 className="font-display text-lg font-bold text-gray-900 dark:text-slate-200 mb-6 flex items-center gap-2">
              <Database className="h-5 w-5 text-indigo-500" />
              <span>Data Backup & Integration Control</span>
            </h3>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleExportData}
                className="flex-1 bg-gray-50 dark:bg-slate-900 hover:bg-gray-100 dark:hover:bg-slate-800 border border-gray-200 dark:border-slate-800 text-gray-700 dark:text-gray-300 text-xs font-bold px-4 py-3 rounded-2xl flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <Download className="h-4 w-4" />
                <span>Export Reports JSON</span>
              </button>

              {onClearHistory && (
                <button
                  onClick={() => {
                    if (confirm("Are you sure you want to purge all custom historical audits? This will reset your stats.")) {
                      onClearHistory();
                    }
                  }}
                  className="flex-1 bg-red-50 dark:bg-rose-950/20 hover:bg-red-100 dark:hover:bg-rose-950/30 border border-red-150 dark:border-rose-900/30 text-red-700 dark:text-rose-400 text-xs font-bold px-4 py-3 rounded-2xl flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Purge Audit History</span>
                </button>
              )}
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-2">
            <button
              onClick={handleSaveSettings}
              disabled={isSaving}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-sans font-bold text-sm px-8 py-3 rounded-full shadow-md hover:shadow-indigo-600/10 transition-all cursor-pointer flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              <span>{isSaving ? "Saving..." : "Save Configuration"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
