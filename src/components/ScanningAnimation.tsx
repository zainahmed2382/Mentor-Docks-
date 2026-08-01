import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Loader2, CheckCircle2, ShieldAlert, Laptop, Network, Search, FileCode2, Sparkles } from "lucide-react";

interface ScanningAnimationProps {
  url: string;
  scanPromise?: Promise<any> | null;
  onFinished: () => void;
}

export default function ScanningAnimation({ url, scanPromise, onFinished }: ScanningAnimationProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { text: "Resolving domain IP and initiating handshake...", icon: Network },
    { text: "Downloading DOM structure and external stylesheets...", icon: FileCode2 },
    { text: "Fetching official Google PageSpeed Insights & Core Web Vitals...", icon: Search },
    { text: "Auditing accessibility ARIA landmarks and responsive viewport...", icon: ShieldAlert },
    { text: "Evaluating security headers and HTTPS support...", icon: Laptop },
    { text: "Generating customized performance optimizations and audit report...", icon: Sparkles },
  ];

  useEffect(() => {
    let isMounted = true;

    if (scanPromise) {
      scanPromise
        .then(() => {
          if (isMounted) {
            setCurrentStep(steps.length);
            setTimeout(() => {
              if (isMounted) onFinished();
            }, 250);
          }
        })
        .catch(() => {
          if (isMounted) {
            onFinished();
          }
        });
    }

    // Smoothly step forward every 350ms while waiting
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 350);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [scanPromise, onFinished, steps.length]);

  return (
    <div className="fixed inset-0 bg-gray-100/85 dark:bg-slate-950/85 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="w-full max-w-2xl bg-white dark:bg-[#131520] border border-gray-200 dark:border-slate-800/80 rounded-[32px] p-6 md:p-8 shadow-[0_30px_60px_rgba(0,0,0,0.06)] dark:shadow-[0_30px_60px_rgba(0,0,0,0.4)] relative overflow-hidden"
      >
        {/* Subtle background blurs */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-indigo-50 dark:bg-indigo-950/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-cyan-50/80 dark:bg-cyan-950/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Scanner Radar Graphic */}
        <div className="relative flex flex-col items-center justify-center mb-8">
          <div className="relative h-28 w-28 rounded-full border border-gray-200 dark:border-slate-800 flex items-center justify-center bg-gray-50/80 dark:bg-slate-900/80 shadow-[0_4px_20px_rgba(0,0,0,0.02)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)]">
            {/* Spinning Rings */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
              className="absolute inset-2 border-2 border-dashed border-indigo-400/30 dark:border-indigo-400/20 rounded-full"
            ></motion.div>
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
              className="absolute inset-5 border border-dotted border-purple-400/20 rounded-full"
            ></motion.div>

            {/* Glowing Scan Bar */}
            <motion.div
              animate={{ y: [-36, 36, -36] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
              className="absolute left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-indigo-500 to-transparent shadow-[0_0_8px_rgba(79,70,229,0.3)] z-10"
            ></motion.div>

            <Laptop className="h-10 w-10 text-indigo-600 dark:text-indigo-400 z-0" />
          </div>

          <div className="text-center mt-4">
            <h3 className="font-display text-lg md:text-xl font-bold text-[#1A1A1A] dark:text-slate-100 tracking-tight">
              Mentor AI Auditing Engine
            </h3>
            <p className="font-mono text-xs text-gray-400 dark:text-gray-500 mt-1.5 break-all">
              Scanning: <span className="text-indigo-600 dark:text-indigo-400 font-bold">{url}</span>
            </p>
          </div>
        </div>

        {/* Dynamic Log Steps List */}
        <div className="bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800/60 rounded-[24px] p-4 md:p-6 font-sans">
          <div className="flex flex-col gap-3.5 max-h-[260px] overflow-y-auto">
            <AnimatePresence>
              {steps.map((step, idx) => {
                const StepIcon = step.icon;
                const isCompleted = idx < currentStep;
                const isActive = idx === currentStep;

                if (idx > currentStep) return null;

                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex items-center gap-3 py-1.5 border-b border-gray-100/80 dark:border-slate-800/40 last:border-0 ${
                      isCompleted ? "opacity-60" : "opacity-100"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                    ) : isActive ? (
                      <Loader2 className="h-4.5 w-4.5 text-indigo-600 dark:text-indigo-400 shrink-0 animate-spin" />
                    ) : (
                      <div className="h-4.5 w-4.5 rounded-full border border-gray-200 dark:border-slate-800 shrink-0"></div>
                    )}

                    <div className="p-1 rounded-[8px] bg-white dark:bg-[#131520] border border-gray-100 dark:border-slate-800/60 shadow-sm shrink-0">
                      <StepIcon
                        className={`h-3.5 w-3.5 ${
                          isCompleted ? "text-gray-400 dark:text-gray-500" : isActive ? "text-indigo-600 dark:text-indigo-400 animate-pulse" : "text-gray-300 dark:text-gray-700"
                        }`}
                      />
                    </div>

                    <span
                      className={`text-xs md:text-sm font-medium truncate ${
                        isActive ? "text-[#1A1A1A] dark:text-slate-100 font-bold" : isCompleted ? "text-gray-400 dark:text-gray-500 font-normal" : "text-gray-300 dark:text-gray-750"
                      }`}
                    >
                      {step.text}
                    </span>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* Status Loading Bar */}
        <div className="mt-6 flex flex-col gap-1.5">
          <div className="flex justify-between items-center text-[10px] uppercase tracking-widest font-bold text-gray-400 dark:text-gray-500 font-sans">
            <span>Audit Progress</span>
            <span>{Math.min(100, Math.round((currentStep / steps.length) * 100))}%</span>
          </div>
          <div className="h-1.5 w-full bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              animate={{ width: `${(currentStep / steps.length) * 100}%` }}
              transition={{ ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full"
            ></motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
