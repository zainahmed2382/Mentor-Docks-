import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Bell,
  User,
  Sparkles,
  LogOut,
  Shield,
  Settings,
  LogIn,
  Key,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Globe,
  LayoutDashboard,
  CodeXml,
  History,
  FolderHeart,
  TrendingUp,
  Inbox
} from "lucide-react";
import { User as ApiUser } from "../lib/api";

interface SidebarProps {
  currentView: "analyze" | "dashboard" | "labs" | "history" | "projects" | "insights" | "about" | "contact" | "profile" | "settings" | "security" | "secrets";
  setCurrentView: (view: "analyze" | "dashboard" | "labs" | "history" | "projects" | "insights" | "about" | "contact" | "profile" | "settings" | "security" | "secrets") => void;
  user: ApiUser | null;
  onLogout: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onScanUrlClick: () => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export default function Sidebar({
  currentView,
  setCurrentView,
  user,
  onLogout,
  isDarkMode,
  onToggleDarkMode,
  onScanUrlClick,
  isCollapsed,
  setIsCollapsed,
}: SidebarProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Official clean circular brand logo
  const logoUrl = "/logo.png";

  const notifications = [
    { id: 1, text: "Audit completed successfully", time: "10m ago" },
    { id: 2, text: "Connected to Neon PostgreSQL DB", time: "2h ago" },
  ];

  const menuItems = [
    { id: "analyze", label: "Analyze URL", icon: Globe },
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "labs", label: "Technical Lab", icon: CodeXml },
    { id: "history", label: "Scan History", icon: History },
    { id: "projects", label: "Saved Projects", icon: FolderHeart },
    { id: "insights", label: "Insights", icon: TrendingUp },
  ];

  const accountItems = [
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security", icon: Shield },
    { id: "secrets", label: "Secrets", icon: Key },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const handleNavigate = (view: any) => {
    setCurrentView(view);
    setIsMobileOpen(false);
  };

  const sidebarContent = (isMobileView = false) => {
    const showLabels = isMobileView || !isCollapsed;

    return (
      <div className="flex flex-col h-full bg-white dark:bg-[#131520] border-r border-gray-200/80 dark:border-slate-800/80 transition-colors duration-300">
        {/* Brand Header */}
        <div className={`p-6 flex items-center justify-between ${showLabels ? "border-b border-gray-100 dark:border-slate-800/60" : ""}`}>
          <div className="flex items-center gap-3">
            <img
              alt="MENTOR DOCKS Logo"
              className="h-8 w-8 object-contain transition-transform group-hover:scale-105 drop-shadow-sm"
              src={logoUrl}
            />
            {showLabels && (
              <span className="font-display text-base font-extrabold text-[#1A1A1A] dark:text-[#E2E8F0] tracking-tight whitespace-nowrap">
                MENTOR DOCKS
              </span>
            )}
          </div>

          {/* Collapse/Expand toggle on desktop */}
          {!isMobileView && (
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden md:flex items-center justify-center h-7 w-7 rounded-lg border border-gray-150 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-500 dark:text-gray-400 cursor-pointer transition-colors"
              title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </button>
          )}

          {/* Close button on mobile side-drawer */}
          {isMobileView && (
            <button
              onClick={() => setIsMobileOpen(false)}
              className="h-8 w-8 flex items-center justify-center rounded-full bg-gray-50 dark:bg-slate-900 text-gray-500 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Quick URL Scan Button (only visible when expanded) */}
        {showLabels && (
          <div className="px-4 py-4">
            <button
              onClick={onScanUrlClick}
              className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer group"
            >
              <Globe className="h-4 w-4 group-hover:rotate-12 transition-transform" />
              <span>Scan Website URL</span>
            </button>
          </div>
        )}

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-7 scrollbar-thin">
          {/* Main Workspace section */}
          <div>
            {showLabels && (
              <span className="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest px-3 mb-2 block">
                Workspace
              </span>
            )}
            <ul className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => handleNavigate(item.id as any)}
                      className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                        isActive
                          ? "bg-indigo-600 text-white shadow-sm"
                          : "text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-slate-800/40"
                      } ${!showLabels ? "justify-center" : "justify-start"}`}
                      title={!showLabels ? item.label : undefined}
                    >
                      <Icon className="h-4.5 w-4.5 shrink-0" />
                      {showLabels && <span>{item.label}</span>}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Account Settings section */}
          <div>
            {showLabels && (
              <span className="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest px-3 mb-2 block">
                Account Security
              </span>
            )}
            <ul className="space-y-1">
              {accountItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => handleNavigate(item.id as any)}
                      className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                        isActive
                          ? "bg-indigo-600 text-white shadow-sm"
                          : "text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-slate-800/40"
                      } ${!showLabels ? "justify-center" : "justify-start"}`}
                      title={!showLabels ? item.label : undefined}
                    >
                      <Icon className="h-4.5 w-4.5 shrink-0" />
                      {showLabels && <span>{item.label}</span>}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Bottom Profile / Quick info */}
        <div className="p-4 border-t border-gray-100 dark:border-slate-800/60 bg-gray-50/50 dark:bg-slate-900/10 space-y-3">
          {/* User Display */}
          {user && (
            <div className={`flex items-center gap-3 ${!showLabels ? "justify-center" : ""}`}>
              <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-extrabold text-xs flex items-center justify-center shrink-0 shadow-md">
                {user.name ? user.name.slice(0, 2).toUpperCase() : "US"}
              </div>
              {showLabels && (
                <div className="min-w-0 flex-1">
                  <p className="font-sans font-bold text-xs text-[#1A1A1A] dark:text-slate-200 truncate">
                    {user.name}
                  </p>
                  <p className="font-sans text-[10px] text-gray-400 dark:text-gray-500 truncate leading-none">
                    {user.email}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Controls: Theme & Logout */}
          <div className={`flex items-center gap-2 ${!showLabels ? "flex-col items-center" : "justify-between"}`}>
            {/* Theme Toggle inside Sidebar */}
            <button
              onClick={onToggleDarkMode}
              className="flex items-center justify-center h-8 w-8 rounded-lg border border-gray-200 dark:border-slate-800 hover:border-gray-300 dark:hover:border-slate-700 text-gray-500 dark:text-gray-400 hover:text-[#1A1A1A] dark:hover:text-white bg-white dark:bg-[#131520] shadow-sm transition-colors cursor-pointer"
              title={isDarkMode ? "Light Mode" : "Dark Mode"}
            >
              {isDarkMode ? <Sun className="h-4 w-4 text-amber-500" /> : <Moon className="h-4 w-4 text-indigo-500" />}
            </button>

            {/* Logout button */}
            <button
              onClick={onLogout}
              className={`flex items-center justify-center h-8 rounded-lg border border-transparent text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all cursor-pointer ${
                showLabels ? "px-3 text-xs font-bold gap-1.5 flex-1" : "w-8"
              }`}
              title="Log Out"
            >
              <LogOut className="h-4 w-4 shrink-0" />
              {showLabels && <span>Log Out</span>}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* --- DESKTOP VIEW SIDEBAR --- */}
      <aside
        className={`hidden md:block fixed top-0 left-0 h-screen z-40 transition-all duration-300 ${
          isCollapsed ? "w-20" : "w-64"
        }`}
      >
        {sidebarContent(false)}
      </aside>

      {/* --- MOBILE COMPACT TOP HEADER --- */}
      <header className="md:hidden fixed top-0 left-0 w-full z-40 h-16 bg-white/90 dark:bg-[#0A0B10]/90 backdrop-blur-md border-b border-gray-200/60 dark:border-slate-800/60 px-4 flex items-center justify-between transition-colors duration-300">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileOpen(true)}
            className="p-2 -ml-2 text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white cursor-pointer"
            aria-label="Open navigation menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          
          <div className="flex items-center gap-2">
            <img
              alt="MENTOR DOCKS Logo"
              className="h-7 w-7 object-contain transition-transform drop-shadow-sm"
              src={logoUrl}
            />
            <span className="font-display text-sm font-extrabold text-[#1A1A1A] dark:text-[#E2E8F0]">
              MENTOR DOCKS
            </span>
          </div>
        </div>

        {/* Quick controls on mobile */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleDarkMode}
            className="p-2 text-gray-500 hover:text-black dark:hover:text-white cursor-pointer"
          >
            {isDarkMode ? <Sun className="h-4 w-4 text-amber-500" /> : <Moon className="h-4 w-4 text-indigo-500" />}
          </button>
          {user && (
            <button
              onClick={() => setCurrentView("profile")}
              className="h-8 w-8 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow"
            >
              {user.name ? user.name.slice(0, 2).toUpperCase() : "US"}
            </button>
          )}
        </div>
      </header>

      {/* --- MOBILE NAVIGATION DRAWER OVERLAY --- */}
      <AnimatePresence>
        {isMobileOpen && (
          <div className="md:hidden fixed inset-0 z-50 flex">
            {/* Dark blur backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="fixed inset-0 bg-gray-950/60 backdrop-blur-sm"
            ></motion.div>

            {/* Sidebar drawer body */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="relative w-72 max-w-[85vw] h-full z-10 flex flex-col shadow-2xl"
            >
              {sidebarContent(true)}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
