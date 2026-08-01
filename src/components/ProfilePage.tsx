import React, { useState } from "react";
import { User, Mail, Calendar, Award, Shield, CheckCircle2, AlertCircle, Edit3, Save } from "lucide-react";
import { User as ApiUser } from "../lib/api";

interface ProfilePageProps {
  user: ApiUser | null;
  onUpdateUser: (updatedUser: ApiUser) => void;
  auditCount: number;
}

export default function ProfilePage({ user, onUpdateUser, auditCount }: ProfilePageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || "Mentor User");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSave = () => {
    if (user) {
      const updated = { ...user, name };
      onUpdateUser(updated);
      setSuccessMsg("Profile updated successfully!");
      setIsEditing(false);
      setTimeout(() => setSuccessMsg(""), 3000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="mb-10 text-center sm:text-left">
        <h1 className="font-display text-3xl font-extrabold text-gray-900 dark:text-[#E2E8F0] tracking-tight">
          User Profile
        </h1>
        <p className="font-sans text-sm text-gray-500 dark:text-gray-400 mt-1">
          Manage your account identity, personal details, and check your workspace compliance limits.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Avatar & Quick Info Card */}
        <div className="bg-white dark:bg-[#131520] rounded-[32px] border border-gray-200/80 dark:border-slate-800/80 p-6 shadow-sm flex flex-col items-center text-center">
          <div className="relative group mb-4">
            <div className="h-28 w-28 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold font-display shadow-lg shadow-indigo-500/10">
              {name.substring(0, 2).toUpperCase()}
            </div>
            <span className="absolute bottom-1 right-1 bg-emerald-500 text-white p-1.5 rounded-full border-2 border-white dark:border-[#131520] shadow-sm">
              <Shield className="h-4 w-4" />
            </span>
          </div>

          <h2 className="font-display text-xl font-bold text-gray-900 dark:text-slate-100">{name}</h2>
          <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2.5 py-1 rounded-full uppercase tracking-wider mt-2">
            Pro Developer
          </span>

          <div className="w-full border-t border-gray-100 dark:border-slate-800/60 my-6"></div>

          {/* User Metrics */}
          <div className="w-full grid grid-cols-2 gap-4">
            <div className="bg-gray-50/70 dark:bg-slate-900 rounded-2xl p-3 text-center border border-gray-100 dark:border-slate-800">
              <span className="block text-2xl font-bold font-display text-indigo-600 dark:text-indigo-400">{auditCount}</span>
              <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium uppercase tracking-wider">Audits Run</span>
            </div>
            <div className="bg-gray-50/70 dark:bg-slate-900 rounded-2xl p-3 text-center border border-gray-100 dark:border-slate-800">
              <span className="block text-2xl font-bold font-display text-emerald-600 dark:text-emerald-400">94%</span>
              <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium uppercase tracking-wider">Avg Score</span>
            </div>
          </div>

          {/* Verification Status */}
          <div className="mt-6 flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-sans text-xs bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 px-4 py-2 rounded-2xl w-full justify-center">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span className="font-semibold">Workspace Connected</span>
          </div>
        </div>

        {/* Right Column: Account Details Form */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {successMsg && (
            <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs px-4 py-3 rounded-2xl flex items-center gap-2 font-medium">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <div className="bg-white dark:bg-[#131520] rounded-[32px] border border-gray-200/80 dark:border-slate-800 p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-150 dark:border-slate-800">
              <h3 className="font-display text-lg font-bold text-gray-900 dark:text-slate-200">Personal Information</h3>
              <button
                onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1 cursor-pointer bg-indigo-50/80 dark:bg-indigo-950/30 hover:bg-indigo-50 px-3 py-1.5 rounded-full transition"
              >
                {isEditing ? (
                  <>
                    <Save className="h-3.5 w-3.5" />
                    <span>Save Changes</span>
                  </>
                ) : (
                  <>
                    <Edit3 className="h-3.5 w-3.5" />
                    <span>Edit Profile</span>
                  </>
                )}
              </button>
            </div>

            <div className="space-y-5">
              {/* Full Name input */}
              <div>
                <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
                    <User className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`w-full font-sans text-sm pl-11 pr-4 py-2.5 rounded-2xl border ${
                      isEditing
                        ? "border-indigo-300 dark:border-indigo-500/50 bg-white dark:bg-slate-900 text-[#1A1A1A] dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                        : "border-gray-200 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900 text-gray-600 dark:text-slate-300 cursor-not-allowed"
                    } transition-colors`}
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    type="email"
                    disabled
                    value={user?.email || "user@example.com"}
                    className="w-full font-sans text-sm pl-11 pr-4 py-2.5 rounded-2xl border border-gray-200 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                  />
                </div>
                <p className="mt-1.5 text-[10px] text-gray-400 dark:text-gray-500">
                  Email change requires verification link. Contact security administrator to modify.
                </p>
              </div>

              {/* Row: Member Since and Verification Tier */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
                    Member Since
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
                      <Calendar className="h-4 w-4" />
                    </div>
                    <input
                      type="text"
                      disabled
                      value="July 2026"
                      className="w-full font-sans text-sm pl-11 pr-4 py-2.5 rounded-2xl border border-gray-200 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
                    Audit Account Tier
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
                      <Award className="h-4 w-4" />
                    </div>
                    <input
                      type="text"
                      disabled
                      value="Standard Enterprise"
                      className="w-full font-sans text-sm pl-11 pr-4 py-2.5 rounded-2xl border border-gray-200 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Notice Board Card */}
          <div className="bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/30 rounded-[24px] p-5 flex gap-3 text-amber-800 dark:text-amber-300 text-xs leading-relaxed font-sans">
            <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block text-sm mb-0.5 text-amber-900 dark:text-amber-200">Identity Security Advisory</span>
              Your profile is registered with a sandbox Cloud environment. For commercial access to advanced high-frequency triggers or webhook callbacks, verify your company organization in security setup.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
