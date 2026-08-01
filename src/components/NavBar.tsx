import React, { useState } from "react";
import { Bell, User, Sparkles, LogOut, Shield, Settings, LogIn, Lock, Key, Sun, Moon } from "lucide-react";
import { User as ApiUser } from "../lib/api";

interface NavBarProps {
  currentView: "analyze" | "dashboard" | "labs" | "history" | "projects" | "insights" | "about" | "contact" | "profile" | "settings" | "security" | "secrets";
  setCurrentView: (view: "analyze" | "dashboard" | "labs" | "history" | "projects" | "insights" | "about" | "contact" | "profile" | "settings" | "security" | "secrets") => void;
  onScanUrlClick: () => void;
  user: ApiUser | null;
  onLoginClick: () => void;
  onLogout: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export default function NavBar({
  currentView,
  setCurrentView,
  onScanUrlClick,
  user,
  onLoginClick,
  onLogout,
  isDarkMode,
  onToggleDarkMode,
}: NavBarProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  // Official clean circular brand logo
  const logoUrl = "/logo.png";

  const notifications = [
    { id: 1, text: "Audit completed successfully", time: "10m ago", read: false },
    { id: 2, text: "Connected to Neon PostgreSQL DB", time: "2h ago", read: true },
    { id: 3, text: "Custom portfolio tracking is active", time: "1d ago", read: true },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 dark:bg-[#0A0B10]/80 backdrop-blur-xl border-b border-gray-200/60 dark:border-slate-800/60 shadow-sm transition-colors duration-300">
      <div className="flex justify-between items-center px-4 md:px-16 py-4 max-w-7xl mx-auto">
        {/* Brand Logo */}
        <button
          onClick={() => setCurrentView("analyze")}
          className="flex items-center gap-3 hover:opacity-90 transition-opacity focus:outline-none cursor-pointer group"
          id="nav-logo-btn"
        >
          <img
            alt="MENTOR DOCKS Logo"
            className="h-8 w-8 object-contain transition-transform group-hover:scale-110 drop-shadow-sm"
            src={logoUrl}
          />
          <span className="font-display text-lg md:text-xl font-bold text-[#1A1A1A] dark:text-[#E2E8F0] tracking-tight">
            MENTOR DOCKS
          </span>
        </button>

        {/* Desktop Nav Items */}
        <div className="hidden md:flex items-center gap-4 lg:gap-7">
          <button
            onClick={() => setCurrentView("analyze")}
            className={`font-sans font-semibold text-xs lg:text-sm tracking-wide transition-all duration-200 cursor-pointer ${
              currentView === "analyze"
                ? "text-[#1A1A1A] dark:text-[#E2E8F0] font-bold border-b-2 border-[#1A1A1A] dark:border-[#E2E8F0] pb-1 scale-105"
                : "text-gray-500 dark:text-gray-400 hover:text-[#1A1A1A] dark:hover:text-[#E2E8F0] hover:scale-105"
            }`}
          >
            Analyze
          </button>
          {user && (
            <>
              <button
                onClick={() => setCurrentView("dashboard")}
                className={`font-sans font-semibold text-xs lg:text-sm tracking-wide transition-all duration-200 cursor-pointer ${
                  currentView === "dashboard"
                    ? "text-[#1A1A1A] dark:text-[#E2E8F0] font-bold border-b-2 border-[#1A1A1A] dark:border-[#E2E8F0] pb-1 scale-105"
                    : "text-gray-500 dark:text-gray-400 hover:text-[#1A1A1A] dark:hover:text-[#E2E8F0] hover:scale-105"
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setCurrentView("labs")}
                className={`font-sans font-semibold text-xs lg:text-sm tracking-wide transition-all duration-200 cursor-pointer ${
                  currentView === "labs"
                    ? "text-[#1A1A1A] dark:text-[#E2E8F0] font-bold border-b-2 border-[#1A1A1A] dark:border-[#E2E8F0] pb-1 scale-105"
                    : "text-gray-500 dark:text-gray-400 hover:text-[#1A1A1A] dark:hover:text-[#E2E8F0] hover:scale-105"
                }`}
              >
                Technical Lab
              </button>
              <button
                onClick={() => setCurrentView("history")}
                className={`font-sans font-semibold text-xs lg:text-sm tracking-wide transition-all duration-200 cursor-pointer ${
                  currentView === "history"
                    ? "text-[#1A1A1A] dark:text-[#E2E8F0] font-bold border-b-2 border-[#1A1A1A] dark:border-[#E2E8F0] pb-1 scale-105"
                    : "text-gray-500 dark:text-gray-400 hover:text-[#1A1A1A] dark:hover:text-[#E2E8F0] hover:scale-105"
                }`}
              >
                History
              </button>
              <button
                onClick={() => setCurrentView("projects")}
                className={`font-sans font-semibold text-xs lg:text-sm tracking-wide transition-all duration-200 cursor-pointer ${
                  currentView === "projects"
                    ? "text-[#1A1A1A] dark:text-[#E2E8F0] font-bold border-b-2 border-[#1A1A1A] dark:border-[#E2E8F0] pb-1 scale-105"
                    : "text-gray-500 dark:text-gray-400 hover:text-[#1A1A1A] dark:hover:text-[#E2E8F0] hover:scale-105"
                }`}
              >
                Projects
              </button>
              <button
                onClick={() => setCurrentView("insights")}
                className={`font-sans font-semibold text-xs lg:text-sm tracking-wide transition-all duration-200 cursor-pointer ${
                  currentView === "insights"
                    ? "text-[#1A1A1A] dark:text-[#E2E8F0] font-bold border-b-2 border-[#1A1A1A] dark:border-[#E2E8F0] pb-1 scale-105"
                    : "text-gray-500 dark:text-gray-400 hover:text-[#1A1A1A] dark:hover:text-[#E2E8F0] hover:scale-105"
                }`}
              >
                Insights
              </button>
            </>
          )}
          {!user && (
            <>
              <button
                onClick={() => setCurrentView("about")}
                className={`font-sans font-semibold text-xs lg:text-sm tracking-wide transition-all duration-200 cursor-pointer ${
                  currentView === "about"
                    ? "text-[#1A1A1A] dark:text-[#E2E8F0] font-bold border-b-2 border-[#1A1A1A] dark:border-[#E2E8F0] pb-1 scale-105"
                    : "text-gray-500 dark:text-gray-400 hover:text-[#1A1A1A] dark:hover:text-[#E2E8F0] hover:scale-105"
                }`}
              >
                About
              </button>
              <button
                onClick={() => setCurrentView("contact")}
                className={`font-sans font-semibold text-xs lg:text-sm tracking-wide transition-all duration-200 cursor-pointer ${
                  currentView === "contact"
                    ? "text-[#1A1A1A] dark:text-[#E2E8F0] font-bold border-b-2 border-[#1A1A1A] dark:border-[#E2E8F0] pb-1 scale-105"
                    : "text-gray-500 dark:text-gray-400 hover:text-[#1A1A1A] dark:hover:text-[#E2E8F0] hover:scale-105"
                }`}
              >
                Contact
              </button>
            </>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle Button */}
          <button
            onClick={onToggleDarkMode}
            className="flex items-center justify-center h-9 w-9 rounded-full border border-gray-200 dark:border-slate-800 hover:border-gray-400 dark:hover:border-slate-600 text-gray-500 dark:text-gray-400 hover:text-[#1A1A1A] dark:hover:text-white bg-white dark:bg-[#131520] shadow-sm transition-all cursor-pointer"
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle Theme"
          >
            {isDarkMode ? <Sun className="h-4.5 w-4.5 text-amber-500" /> : <Moon className="h-4.5 w-4.5 text-indigo-500" />}
          </button>

          {/* Notifications Button */}
          {user && (
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowProfile(false);
                }}
                className="hidden md:flex items-center justify-center h-9 w-9 rounded-full border border-gray-200 dark:border-slate-800 hover:border-gray-400 dark:hover:border-slate-600 text-gray-500 dark:text-gray-400 hover:text-[#1A1A1A] dark:hover:text-white bg-white dark:bg-[#131520] shadow-sm transition-all cursor-pointer relative"
                id="notifications-btn"
              >
                <Bell className="h-4 w-4" />
                <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-indigo-500 border border-white dark:border-[#131520] animate-pulse"></span>
              </button>

              {/* Notifications Menu */}
              {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-[#131520] border border-gray-200 dark:border-slate-800 rounded-[24px] shadow-xl p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="flex justify-between items-center pb-2 border-b border-gray-100 dark:border-slate-800 mb-3">
                    <h4 className="font-sans font-semibold text-sm text-[#1A1A1A] dark:text-[#E2E8F0] flex items-center gap-2">
                      <Sparkles className="h-3.5 w-3.5 text-indigo-500" /> Notifications
                    </h4>
                    <span className="text-[10px] text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded-full font-bold uppercase">
                      1 New
                    </span>
                  </div>
                  <div className="flex flex-col gap-2.5">
                    {notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`p-2 rounded-lg transition-colors cursor-pointer text-left ${
                          notif.read 
                            ? "hover:bg-gray-50 dark:hover:bg-slate-800/40" 
                            : "bg-indigo-50/40 dark:bg-indigo-950/20 hover:bg-indigo-50/80 dark:hover:bg-indigo-950/40"
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <p className="font-sans text-xs text-[#1A1A1A] dark:text-[#E2E8F0] leading-tight pr-3 font-medium">
                            {notif.text}
                          </p>
                          {!notif.read && <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 shrink-0 mt-1"></span>}
                        </div>
                        <span className="text-[10px] text-gray-400 dark:text-gray-500 mt-1 block">{notif.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Account Profile / Auth Login Trigger */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => {
                  setShowProfile(!showProfile);
                  setShowNotifications(false);
                }}
                className="flex items-center justify-center gap-2 h-9 px-3 rounded-full border border-gray-200 dark:border-slate-800 hover:border-gray-400 dark:hover:border-slate-600 text-gray-700 dark:text-gray-300 hover:text-[#1A1A1A] dark:hover:text-white bg-white dark:bg-[#131520] shadow-sm transition-all cursor-pointer"
                id="profile-btn"
              >
                <div className="h-5 w-5 rounded-full bg-indigo-600 text-white font-bold text-[10px] flex items-center justify-center">
                  {user.name ? user.name.slice(0, 2).toUpperCase() : "US"}
                </div>
                <span className="font-sans text-xs font-semibold max-w-[80px] truncate hidden lg:inline">
                  {user.name}
                </span>
              </button>

              {/* Profile Menu */}
              {showProfile && (
                <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-[#131520] border border-gray-200 dark:border-slate-800 rounded-[24px] shadow-xl p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-2 py-1.5 border-b border-gray-100 dark:border-slate-800 mb-2 text-left">
                    <p className="font-sans font-semibold text-xs text-[#1A1A1A] dark:text-slate-200 truncate">{user.name}</p>
                    <p className="font-sans text-[11px] text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => {
                        setCurrentView("profile");
                        setShowProfile(false);
                      }}
                      className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-slate-800/40 transition-colors text-xs text-left w-full cursor-pointer"
                    >
                      <User className="h-3.5 w-3.5" /> Profile
                    </button>
                    <button
                      onClick={() => {
                        setCurrentView("security");
                        setShowProfile(false);
                      }}
                      className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-slate-800/40 transition-colors text-xs text-left w-full cursor-pointer"
                    >
                      <Shield className="h-3.5 w-3.5" /> Security
                    </button>
                    <button
                      onClick={() => {
                        setCurrentView("secrets");
                        setShowProfile(false);
                      }}
                      className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-slate-800/40 transition-colors text-xs text-left w-full cursor-pointer"
                    >
                      <Key className="h-3.5 w-3.5" /> Secrets
                    </button>
                    <button
                      onClick={() => {
                        setCurrentView("settings");
                        setShowProfile(false);
                      }}
                      className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-slate-800/40 transition-colors text-xs text-left w-full cursor-pointer"
                    >
                      <Settings className="h-3.5 w-3.5" /> Settings
                    </button>
                    <div className="h-px bg-gray-100 dark:bg-slate-800 my-1"></div>
                    <button
                      onClick={() => {
                        setShowProfile(false);
                        onLogout();
                      }}
                      className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors text-xs text-left w-full cursor-pointer"
                    >
                      <LogOut className="h-3.5 w-3.5" /> Log out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onLoginClick}
              className="flex items-center gap-1.5 h-9 px-4 rounded-full border border-gray-200 dark:border-slate-800 hover:border-gray-400 dark:hover:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-800/40 text-gray-600 dark:text-gray-300 hover:text-[#1A1A1A] dark:hover:text-white bg-white dark:bg-[#131520] shadow-sm transition-all cursor-pointer font-sans font-bold text-xs"
              id="nav-login-btn"
            >
              <LogIn className="h-3.5 w-3.5" />
              <span>Log In</span>
            </button>
          )}

          {/* Quick Scan Call to Action */}
          <button
            onClick={onScanUrlClick}
            className="bg-[#1A1A1A] text-white hover:bg-black dark:bg-indigo-600 dark:text-white dark:hover:bg-indigo-500 font-sans font-bold text-xs md:text-sm px-4 py-2 md:px-5 md:py-2.5 rounded-full hover:scale-105 active:scale-95 shadow-sm transition-all duration-200 cursor-pointer"
            id="nav-scan-url-btn"
          >
            Scan URL
          </button>
        </div>
      </div>
    </nav>
  );
}

