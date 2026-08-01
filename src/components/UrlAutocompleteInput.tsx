import React, { useState, useRef, useEffect, useId } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Globe,
  Clock,
  Sparkles,
  Search,
  Zap,
  ArrowUpRight,
} from "lucide-react";
import { WebsiteScan } from "../types";

interface UrlAutocompleteInputProps {
  value: string;
  onChange: (value: string) => void;
  onStartScan: (url: string) => void;
  scanHistory: WebsiteScan[];
  onSelectScan?: (id: string) => void;
  placeholder?: string;
  id?: string;
  error?: string;
  className?: string;
}

// Utility helper to extract hostname for favicon lookup
const getCleanDomain = (rawUrl: string): string => {
  try {
    let formatted = rawUrl.trim();
    if (!/^https?:\/\//i.test(formatted)) {
      formatted = "https://" + formatted;
    }
    const parsed = new URL(formatted);
    return parsed.hostname;
  } catch {
    return rawUrl.replace(/^(https?:\/\/)?(www\.)?/, "").split("/")[0] || rawUrl;
  }
};

// Subcomponent for card favicons with fallback error handling
function CardFavicon({ domain }: { domain: string }) {
  const [hasError, setHasError] = useState(false);
  const cleanDomain = getCleanDomain(domain);
  const faviconUrl = `https://www.google.com/s2/favicons?domain=${encodeURIComponent(
    cleanDomain
  )}&sz=64`;

  if (hasError || !cleanDomain) {
    return (
      <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
        <Globe className="h-4 w-4" />
      </div>
    );
  }

  return (
    <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800/80 p-1.5 flex items-center justify-center shrink-0 overflow-hidden shadow-inner group-hover:border-indigo-500/40 transition-colors">
      <img
        src={faviconUrl}
        alt={`${cleanDomain} favicon`}
        className="w-full h-full object-contain rounded-md"
        onError={() => setHasError(true)}
      />
    </div>
  );
}

export default function UrlAutocompleteInput({
  value,
  onChange,
  onStartScan,
  scanHistory,
  onSelectScan,
  placeholder = "https://yourwebsite.com or domain.com",
  id,
  error,
  className = "",
}: UrlAutocompleteInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [isScrolledTop, setIsScrolledTop] = useState(true);
  const [isScrolledBottom, setIsScrolledBottom] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const inputId = id || useId();

  // Filter history based on search query
  const query = value.trim().toLowerCase();
  const filteredHistory = scanHistory.filter((item) => {
    if (!query) return true;
    return (
      item.url.toLowerCase().includes(query) ||
      getCleanDomain(item.url).toLowerCase().includes(query)
    );
  });

  // Check scroll container overflow state for fade indicators
  const updateScrollFades = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const isAtTop = el.scrollTop <= 5;
    const isAtBottom = el.scrollHeight - el.scrollTop - el.clientHeight <= 5;
    setIsScrolledTop(isAtTop);
    setIsScrolledBottom(isAtBottom);
  };

  useEffect(() => {
    if (isOpen) {
      updateScrollFades();
    }
  }, [isOpen, filteredHistory.length]);

  // Handle Outside Clicks
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard navigation inside input
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        setIsOpen(true);
        return;
      }
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      const nextIndex = Math.min(selectedIndex + 1, filteredHistory.length - 1);
      setSelectedIndex(nextIndex);
      scrollIndexIntoView(nextIndex);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const prevIndex = Math.max(selectedIndex - 1, -1);
      setSelectedIndex(prevIndex);
      scrollIndexIntoView(prevIndex);
    } else if (e.key === "Escape") {
      setIsOpen(false);
      setSelectedIndex(-1);
    } else if (e.key === "Enter") {
      if (isOpen && selectedIndex >= 0 && filteredHistory[selectedIndex]) {
        e.preventDefault();
        handleSelectItem(filteredHistory[selectedIndex]);
      }
      // If selectedIndex is -1, standard form submission handles onStartScan
    }
  };

  const scrollIndexIntoView = (index: number) => {
    if (index < 0 || !scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const items = container.querySelectorAll("[data-card-item]");
    if (items[index]) {
      (items[index] as HTMLElement).scrollIntoView({
        block: "nearest",
        behavior: "smooth",
      });
    }
  };

  const handleSelectItem = (item: WebsiteScan) => {
    onChange(item.url);
    setIsOpen(false);
    setSelectedIndex(-1);
    if (onSelectScan) {
      onSelectScan(item.id);
    } else {
      onStartScan(item.url);
    }
  };

  const handleExecuteCurrentScan = () => {
    setIsOpen(false);
    setSelectedIndex(-1);
    if (value.trim()) {
      onStartScan(value.trim());
    }
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Input container wrapper */}
      <div className="flex-grow flex items-center bg-gray-50 dark:bg-slate-900/90 rounded-[24px] px-5 py-3.5 border border-gray-200 dark:border-slate-800 focus-within:bg-white dark:focus-within:bg-[#131520] focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all shadow-sm">
        <Globe className="text-gray-400 dark:text-slate-400 h-5 w-5 mr-3 shrink-0" />
        <input
          ref={inputRef}
          id={inputId}
          type="text"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setIsOpen(true);
            setSelectedIndex(-1);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          placeholder={placeholder}
          className="w-full bg-transparent border-none text-[#1A1A1A] dark:text-slate-100 font-mono text-sm focus:ring-0 focus:outline-none placeholder:text-gray-400 dark:placeholder:text-slate-500 p-0"
        />
        {value && (
          <button
            type="button"
            onClick={() => {
              onChange("");
              inputRef.current?.focus();
            }}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-slate-200 text-xs px-2 py-0.5 rounded-md hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {/* Floating SaaS Search Panel Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-full left-0 right-0 mt-2.5 z-50 bg-white dark:bg-[#131520] border border-gray-200 dark:border-slate-800/90 rounded-[20px] shadow-[0_20px_50px_rgba(0,0,0,0.15)] dark:shadow-[0_25px_60px_rgba(0,0,0,0.65)] overflow-hidden backdrop-blur-2xl"
          >
            {/* Top ambient color stripe matching Mentor Docks design system */}
            <div className="h-1 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-80" />

            {/* Header section */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-gray-50/80 dark:bg-slate-900/60 border-b border-gray-150 dark:border-slate-800/80 text-[10px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
                Previous Scanned Websites
              </span>
              <span className="font-mono text-[10px] text-gray-400 dark:text-slate-500 lowercase flex items-center gap-1">
                <kbd className="px-1 py-0.5 bg-gray-200 dark:bg-slate-800 rounded text-[9px]">↑↓</kbd> navigate
              </span>
            </div>

            {/* Main scroll container with custom scrollbar and top/bottom fade gradients */}
            <div className="relative">
              {/* Top fade gradient */}
              <div
                className={`pointer-events-none absolute top-0 left-0 right-0 h-5 bg-gradient-to-b from-white dark:from-[#131520] to-transparent z-10 transition-opacity duration-200 ${
                  isScrolledTop ? "opacity-0" : "opacity-100"
                }`}
              />

              {/* Scrollable List */}
              <div
                ref={scrollContainerRef}
                onScroll={updateScrollFades}
                className="max-h-[280px] overflow-y-auto custom-thin-scrollbar p-2 space-y-1.5"
              >
                {filteredHistory.length === 0 ? (
                  <div className="p-6 text-center text-gray-400 dark:text-slate-500">
                    <Search className="h-8 w-8 mx-auto mb-2 text-indigo-400/50 animate-pulse" />
                    <p className="text-xs font-semibold text-gray-600 dark:text-slate-300">
                      No past scans matching "{value}"
                    </p>
                    <p className="text-[10px] mt-1">
                      Press Enter to run a brand-new live frontend scan.
                    </p>
                  </div>
                ) : (
                  filteredHistory.map((item, index) => {
                    const isSelected = selectedIndex === index;
                    const cleanDomain = getCleanDomain(item.url);

                    return (
                      <div
                        key={item.id}
                        data-card-item
                        onClick={() => handleSelectItem(item)}
                        onMouseEnter={() => setSelectedIndex(index)}
                        className={`group relative p-3 rounded-2xl border transition-all duration-150 cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? "bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-500/60 shadow-sm translate-x-1"
                            : "bg-gray-50/40 dark:bg-slate-900/40 border-gray-150 dark:border-slate-800/60 hover:bg-indigo-50/40 dark:hover:bg-indigo-950/20 hover:border-indigo-500/30"
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <CardFavicon domain={item.url} />

                          <div className="text-left min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <p className="font-mono font-bold text-xs md:text-sm text-gray-900 dark:text-slate-100 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                {cleanDomain}
                              </p>
                              {item.url !== cleanDomain && (
                                <span className="text-[10px] text-gray-400 dark:text-slate-500 truncate hidden sm:inline">
                                  ({item.url})
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-3 mt-1 text-[10px] text-gray-500 dark:text-slate-400">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3 text-indigo-400" />
                                {new Date(item.date).toLocaleDateString(undefined, {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </span>
                              <span className="text-gray-300 dark:text-slate-700">•</span>
                              <span className="capitalize">{item.status}</span>
                            </div>
                          </div>
                        </div>

                        {/* Audit Score Badge */}
                        <div className="flex items-center gap-3 shrink-0 ml-3">
                          <div
                            className={`px-2.5 py-1 rounded-full font-display font-extrabold text-xs flex items-center gap-1.5 border shadow-2xs transition-transform group-hover:scale-105 ${
                              item.score >= 85
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                                : item.score >= 70
                                ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                                : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                item.score >= 85
                                  ? "bg-emerald-500"
                                  : item.score >= 70
                                  ? "bg-amber-500"
                                  : "bg-rose-500"
                              }`}
                            />
                            {item.score}%
                          </div>

                          <ArrowUpRight className="h-4 w-4 text-gray-400 dark:text-slate-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Bottom fade gradient */}
              <div
                className={`pointer-events-none absolute bottom-0 left-0 right-0 h-5 bg-gradient-to-t from-white dark:from-[#131520] to-transparent z-10 transition-opacity duration-200 ${
                  isScrolledBottom ? "opacity-0" : "opacity-100"
                }`}
              />
            </div>

            {/* Bottom "Scan New Website" Action Footer */}
            <div
              onClick={handleExecuteCurrentScan}
              className="p-3 bg-gray-50 dark:bg-slate-900/90 border-t border-gray-200 dark:border-slate-800 flex items-center justify-between cursor-pointer hover:bg-indigo-50/60 dark:hover:bg-indigo-950/40 transition-colors"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="p-1.5 rounded-lg bg-indigo-600 text-white shadow-sm shrink-0">
                  <Zap className="h-3.5 w-3.5 animate-pulse" />
                </div>
                <span className="text-xs font-bold text-gray-800 dark:text-slate-200 truncate">
                  {value.trim() ? (
                    <>
                      Scan <span className="font-mono text-indigo-600 dark:text-indigo-400">"{value.trim()}"</span>
                    </>
                  ) : (
                    "Scan New Website"
                  )}
                </span>
              </div>

              <span className="flex items-center gap-1 font-mono text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-md border border-indigo-500/20 shrink-0">
                <span>Press Enter</span>
                <span className="text-xs">↵</span>
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
