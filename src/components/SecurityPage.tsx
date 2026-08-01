import React, { useState } from "react";
import { Shield, Key, Eye, EyeOff, CheckCircle2, AlertTriangle, Monitor, Smartphone, Globe, Lock } from "lucide-react";

export default function SecurityPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState("");
  const [updateError, setUpdateError] = useState("");

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      setUpdateError("All fields are required.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setUpdateError("Passwords do not match.");
      return;
    }
    if (newPassword.length < 6) {
      setUpdateError("Password must be at least 6 characters.");
      return;
    }

    setUpdateError("");
    setUpdateSuccess("Your password has been changed successfully!");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setTimeout(() => setUpdateSuccess(""), 4000);
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="mb-10 text-center sm:text-left">
        <h1 className="font-display text-3xl font-extrabold text-gray-900 dark:text-[#E2E8F0] tracking-tight">
          Account Security
        </h1>
        <p className="font-sans text-sm text-gray-500 dark:text-gray-400 mt-1">
          Monitor your sign-in settings, configure advanced 2FA, and oversee active authentication sessions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column: Security status */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-[#131520] rounded-[24px] border border-gray-200/80 dark:border-slate-800 p-6 shadow-sm">
            <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider block mb-4">Security Overview</span>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="h-12 w-12 rounded-full bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <Shield className="h-6 w-6" />
              </div>
              <div>
                <span className="block font-sans text-sm font-bold text-gray-900 dark:text-slate-200">Score: Strong</span>
                <span className="block text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold uppercase tracking-wider">No Alerts Detected</span>
              </div>
            </div>

            <div className="space-y-3 font-sans text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center justify-between py-1.5 border-b border-gray-100 dark:border-slate-800">
                <span>SSO Integration</span>
                <span className="font-bold text-gray-900 dark:text-slate-200">Configured</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-gray-100 dark:border-slate-800">
                <span>API Access Status</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">Authorized</span>
              </div>
              <div className="flex items-center justify-between py-1.5">
                <span>Last Password Change</span>
                <span className="font-bold text-gray-900 dark:text-slate-200">14 days ago</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-tr from-rose-900 to-red-950 text-white rounded-[24px] p-6 shadow-md relative overflow-hidden">
            <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 opacity-10">
              <Lock className="h-32 w-32" />
            </div>
            <span className="text-[9px] font-bold tracking-widest text-rose-300 uppercase block mb-1">
              Critical Warning
            </span>
            <h4 className="font-display font-bold text-base mb-2">Automated Block Rules</h4>
            <p className="font-sans text-xs text-rose-200/85 leading-relaxed">
              If our system detects more than 5 failed login attempts from an untrusted geolocation IP, your secrets vault will be auto-encrypted.
            </p>
          </div>
        </div>

        {/* Right column: Update password and active sessions */}
        <div className="lg:col-span-2 space-y-6">
          {updateSuccess && (
            <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs px-4 py-3 rounded-2xl flex items-center gap-2 font-medium">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>{updateSuccess}</span>
            </div>
          )}

          {updateError && (
            <div className="bg-red-50 dark:bg-rose-950/20 border border-red-100 dark:border-rose-900/30 text-red-700 dark:text-rose-400 text-xs px-4 py-3 rounded-2xl flex items-center gap-2 font-medium">
              <AlertTriangle className="h-4 w-4 text-red-600 shrink-0" />
              <span>{updateError}</span>
            </div>
          )}

          {/* Form Card */}
          <div className="bg-white dark:bg-[#131520] rounded-[32px] border border-gray-200/80 dark:border-slate-800 p-8 shadow-sm">
            <h3 className="font-display text-lg font-bold text-gray-900 dark:text-slate-200 mb-6 flex items-center gap-2.5">
              <Key className="h-5 w-5 text-indigo-500" />
              <span>Change Account Password</span>
            </h3>

            <form onSubmit={handlePasswordUpdate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full font-sans text-sm px-4 py-2.5 rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-[#1A1A1A] dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
                    New Password
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="w-full font-sans text-sm px-4 py-2.5 rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-[#1A1A1A] dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    className="w-full font-sans text-sm px-4 py-2.5 rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-[#1A1A1A] dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-sans font-bold text-xs md:text-sm px-6 py-2.5 rounded-full shadow-sm hover:shadow-lg transition cursor-pointer"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>

          {/* 2-Factor Authentication Status Card */}
          <div className="bg-white dark:bg-[#131520] rounded-[32px] border border-gray-200/80 dark:border-slate-800 p-8 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <span className="block font-sans text-sm font-bold text-gray-900 dark:text-slate-200">Two-Factor Authenticator (2FA)</span>
                <p className="font-sans text-xs text-gray-400 dark:text-gray-500 max-w-md">
                  Secure your account settings by enforcing random token verification from Google Authenticator, Authy, or Duo Mobile.
                </p>
              </div>
              <button
                onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer outline-none shrink-0 ${
                  twoFactorEnabled ? "bg-indigo-600" : "bg-gray-200 dark:bg-slate-800"
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                    twoFactorEnabled ? "transform translate-x-5" : ""
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Session logs card */}
          <div className="bg-white dark:bg-[#131520] rounded-[32px] border border-gray-200/80 dark:border-slate-800 p-8 shadow-sm">
            <h3 className="font-display text-lg font-bold text-gray-900 dark:text-slate-200 mb-6">Active Session Logs</h3>
            
            <div className="space-y-4">
              {/* Session 1 */}
              <div className="flex items-center justify-between gap-4 py-3.5 px-4 bg-gray-50 dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center shrink-0">
                    <Monitor className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <span className="block font-sans text-xs md:text-sm font-semibold text-gray-900 dark:text-slate-200">Chrome (v124) — Linux OS</span>
                    <span className="block text-[10px] text-gray-400 dark:text-gray-500">Current Session • IP: 124.89.201.55 • Oregon, US</span>
                  </div>
                </div>
                <span className="text-[10px] bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 font-bold px-2.5 py-1 rounded-full border border-emerald-100 dark:border-emerald-900/30 shrink-0">
                  Active
                </span>
              </div>

              {/* Session 2 */}
              <div className="flex items-center justify-between gap-4 py-3.5 px-4 bg-gray-50 dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-gray-400 rounded-full flex items-center justify-center shrink-0">
                    <Smartphone className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <span className="block font-sans text-xs md:text-sm font-semibold text-gray-900 dark:text-slate-200">Mentor App — iOS Mobile</span>
                    <span className="block text-[10px] text-gray-400 dark:text-gray-500">Authorized 2 hours ago • New Delhi, IN</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setUpdateSuccess("Successfully revoked mobile session.");
                    setTimeout(() => setUpdateSuccess(""), 4000);
                  }}
                  className="text-[10px] bg-white dark:bg-slate-900 hover:bg-gray-200 dark:hover:bg-slate-800 text-gray-500 dark:text-gray-400 font-bold px-2.5 py-1 rounded-full border border-gray-200 dark:border-slate-800 shrink-0 transition cursor-pointer"
                >
                  Revoke
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
