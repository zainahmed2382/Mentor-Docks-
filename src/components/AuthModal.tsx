import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Mail, Lock, User, Sparkles, CheckCircle2, AlertCircle, Eye, EyeOff } from "lucide-react";
import { api, User as ApiUser } from "../lib/api";
import MentorMascot, { MascotState } from "./MentorMascot";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: ApiUser) => void;
  isScanPending?: boolean;
}

export default function AuthModal({ isOpen, onClose, onSuccess, isScanPending }: AuthModalProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [activeField, setActiveField] = useState<"name" | "email" | "password" | null>(null);

  const getMascotState = (): MascotState => {
    if (isLoading) return "scanning";
    if (successMessage) return "success";
    if (errorMessage) return "error";
    if (activeField === "password") return showPassword ? "show-password" : "password";
    if (activeField === "name") return "name";
    if (activeField === "email") return "email";
    return "idle";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setIsLoading(true);

    if (!email || !password) {
      setErrorMessage("Please fill in all required fields.");
      setIsLoading(false);
      return;
    }

    if (isSignUp && !name) {
      setErrorMessage("Please enter your name.");
      setIsLoading(false);
      return;
    }

    try {
      if (isSignUp) {
        const data = await api.signup(email, password, name);
        setSuccessMessage(`Account created successfully! Welcome, ${data.user.name}.`);
        setTimeout(() => {
          onSuccess(data.user);
          onClose();
        }, 1200);
      } else {
        const data = await api.login(email, password);
        setSuccessMessage(`Welcome back, ${data.user.name}!`);
        setTimeout(() => {
          onSuccess(data.user);
          onClose();
        }, 1200);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleMode = () => {
    setIsSignUp(!isSignUp);
    setErrorMessage("");
    setSuccessMessage("");
    setEmail("");
    setPassword("");
    setName("");
    setActiveField(null);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-gray-900/60 dark:bg-[#020205]/80 backdrop-blur-md"
            id="auth-modal-backdrop"
          ></motion.div>

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="bg-white dark:bg-[#131520] w-full max-w-md rounded-[32px] border border-gray-200/80 dark:border-slate-800 shadow-[0_30px_60px_rgba(0,0,0,0.12)] p-6 md:p-8 relative z-10 overflow-hidden"
            id="auth-modal-card"
          >
            {/* Soft Ambient Glows inside Modal */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-50 dark:bg-indigo-950/20 rounded-full blur-3xl pointer-events-none -z-10"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-50/50 dark:bg-teal-950/10 rounded-full blur-3xl pointer-events-none -z-10"></div>

            {/* Header */}
            <div className="flex justify-between items-start mb-6 gap-3">
              <div className="flex items-start gap-3.5">
                <div className="pt-1 shrink-0">
                  <MentorMascot state={getMascotState()} size="sm" />
                </div>
                <div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100/50 dark:border-indigo-900/40 text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-2">
                    <Sparkles className="h-3 w-3 animate-pulse" /> Mentor Intelligence
                  </span>
                  <h3 className="font-display text-2xl font-bold text-gray-900 dark:text-slate-100 tracking-tight">
                    {isSignUp ? "Create Account" : "Welcome Back"}
                  </h3>
                  <p className="font-sans text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {isSignUp
                      ? "Register to save audited portfolios & view global insights."
                      : "Log in to access your secure design scan history."}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="h-8 w-8 rounded-full border border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/40 hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-400 hover:text-gray-900 dark:hover:text-white flex items-center justify-center transition-all cursor-pointer shrink-0"
                id="auth-modal-close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Status Messages */}
            {isScanPending && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3.5 bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30 rounded-2xl flex items-start gap-2.5 text-indigo-700 dark:text-indigo-400 text-xs font-medium"
              >
                <Sparkles className="h-4 w-4 shrink-0 mt-0.5 text-indigo-600 dark:text-indigo-400 animate-pulse" />
                <div>
                  <span className="font-bold block">Scan Pending Registration</span>
                  <span>Log in or create a free account to run your real-time AI scan and save reports securely.</span>
                </div>
              </motion.div>
            )}

            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3.5 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 rounded-2xl flex items-start gap-2.5 text-red-700 dark:text-red-400 text-xs font-medium"
              >
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </motion.div>
            )}

            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3.5 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 rounded-2xl flex items-start gap-2.5 text-emerald-700 dark:text-emerald-400 text-xs font-medium"
              >
                <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
                <span>{successMessage}</span>
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {isSignUp && (
                <div className="flex flex-col gap-1.5">
                  <label className="font-sans font-semibold text-[11px] text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3.5 h-4 w-4 text-gray-400 dark:text-gray-500" />
                    <input
                      type="text"
                      placeholder="Jane Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      onFocus={() => setActiveField("name")}
                      onBlur={() => setActiveField(null)}
                      className="w-full bg-gray-50 dark:bg-slate-900 hover:bg-gray-100/50 dark:hover:bg-slate-800/50 focus:bg-white dark:focus:bg-[#0A0B10] border border-gray-200/80 dark:border-slate-800 focus:border-indigo-500 dark:focus:border-indigo-500 rounded-2xl py-3 pl-10 pr-4 text-sm text-gray-900 dark:text-slate-200 outline-none transition-all"
                      required={isSignUp}
                    />
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label className="font-sans font-semibold text-[11px] text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 h-4 w-4 text-gray-400 dark:text-gray-500" />
                  <input
                    type="email"
                    placeholder="you@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setActiveField("email")}
                    onBlur={() => setActiveField(null)}
                    className="w-full bg-gray-50 dark:bg-slate-900 hover:bg-gray-100/50 dark:hover:bg-slate-800/50 focus:bg-white dark:focus:bg-[#0A0B10] border border-gray-200/80 dark:border-slate-800 focus:border-indigo-500 dark:focus:border-indigo-500 rounded-2xl py-3 pl-10 pr-4 text-sm text-gray-900 dark:text-slate-200 outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-sans font-semibold text-[11px] text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 h-4 w-4 text-gray-400 dark:text-gray-500" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setActiveField("password")}
                    onBlur={() => setActiveField(null)}
                    className="w-full bg-gray-50 dark:bg-slate-900 hover:bg-gray-100/50 dark:hover:bg-slate-800/50 focus:bg-white dark:focus:bg-[#0A0B10] border border-gray-200/80 dark:border-slate-800 focus:border-indigo-500 dark:focus:border-indigo-500 rounded-2xl py-3 pl-10 pr-10 text-sm text-gray-900 dark:text-slate-200 outline-none transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 h-5 w-5 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-white flex items-center justify-center cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#1A1A1A] dark:bg-indigo-600 hover:bg-black dark:hover:bg-indigo-500 text-white font-sans font-bold text-sm py-3.5 rounded-2xl shadow-md active:scale-[0.98] transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:pointer-events-none mt-2 relative overflow-hidden flex items-center justify-center gap-2"
                id="auth-submit-btn"
              >
                {isLoading ? (
                  <>
                    <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    <span>Processing...</span>
                  </>
                ) : (
                  <span>{isSignUp ? "Create Expert Account" : "Access Account"}</span>
                )}
              </button>
            </form>

            {/* Toggle Footer */}
            <div className="mt-6 text-center">
              <button
                onClick={handleToggleMode}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-semibold cursor-pointer underline underline-offset-4"
                id="auth-toggle-mode"
              >
                {isSignUp
                  ? "Already have an account? Log in"
                  : "New to MENTOR DOCKS? Sign up free"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
