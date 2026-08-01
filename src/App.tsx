import React, { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import NavBar from "./components/NavBar";
import Sidebar from "./components/Sidebar";
import LandingPage from "./components/LandingPage";
import DashboardPage from "./components/DashboardPage";
import ScanningAnimation from "./components/ScanningAnimation";
import AuthModal from "./components/AuthModal";
import MentorMascot from "./components/MentorMascot";
import { ProjectsPage, InsightsPage } from "./components/ExtraTabs";
import DetailedAnalysisPage from "./components/DetailedAnalysisPage";
import ScanHistoryPage from "./components/ScanHistoryPage";
import AboutPage from "./components/AboutPage";
import ContactPage from "./components/ContactPage";
import LockedView from "./components/LockedView";
import ProfilePage from "./components/ProfilePage";
import SettingsPage from "./components/SettingsPage";
import SecurityPage from "./components/SecurityPage";
import SecretsPage from "./components/SecretsPage";
import { WebsiteScan } from "./types";
import { api, User as ApiUser, getStoredUser, getToken, AnalyzeUrlOptions } from "./lib/api";
import { Heart, Globe, ShieldCheck } from "lucide-react";

export default function App() {
  const [currentView, setCurrentView] = useState<
    | "analyze"
    | "dashboard"
    | "labs"
    | "history"
    | "projects"
    | "insights"
    | "about"
    | "contact"
    | "profile"
    | "settings"
    | "security"
    | "secrets"
  >("analyze");
  const [user, setUser] = useState<ApiUser | null>(() => getStoredUser());
  const [isAuthLoading, setIsAuthLoading] = useState(() => Boolean(getToken()));
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [scanHistory, setScanHistory] = useState<WebsiteScan[]>([]);
  const [activeScan, setActiveScan] = useState<WebsiteScan | null>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [scannedUrl, setScannedUrl] = useState("");
  const [pendingScanUrl, setPendingScanUrl] = useState<string | null>(null);
  const scanPromiseRef = useRef<Promise<WebsiteScan> | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme");
      if (saved) return saved === "dark";
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  // Scroll to top on view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentView]);

  // Prevent logged-in users from accessing About and Contact views
  useEffect(() => {
    if (user && (currentView === "about" || currentView === "contact")) {
      setCurrentView("profile");
    }
  }, [user, currentView]);

  // Validate and refresh the stored session on startup
  useEffect(() => {
    const restoreSession = async () => {
      const token = getToken();
      if (!token) {
        setIsAuthLoading(false);
        return;
      }

      try {
        const session = await api.getMe();
        if (session?.user) {
          setUser(session.user);
        } else if (!getStoredUser()) {
          setUser(null);
        }
      } catch (err) {
        console.error("Error restoring session:", err);
      } finally {
        setIsAuthLoading(false);
      }
    };
    restoreSession();
  }, []);

  // Fetch custom data from DB whenever user auth changes
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const loadedScans = await api.getScans();
        const safeScans = Array.isArray(loadedScans) ? loadedScans.filter(Boolean) : [];
        if (safeScans.length > 0) {
          setScanHistory(safeScans);
          setActiveScan(safeScans[0]);
        } else {
          setScanHistory([]);
          setActiveScan(null);
        }
      } catch (err) {
        console.error("Failed to load scans from Neon DB:", err);
        setScanHistory([]);
        setActiveScan(null);
      }

      try {
        const loadedProjects = await api.getProjects();
        setProjects(Array.isArray(loadedProjects) ? loadedProjects.filter(Boolean) : []);
      } catch (err) {
        console.error("Failed to load projects from Neon DB:", err);
        setProjects([]);
      }
    };

    loadUserData();
  }, [user]);

  const handleStartScan = (url: string, options?: AnalyzeUrlOptions) => {
    setScanError(null);
    if (!user) {
      setPendingScanUrl(url);
      setIsAuthModalOpen(true);
    } else {
      setScannedUrl(url);
      scanPromiseRef.current = api.analyzeUrl(url, options);
      setIsScanning(true);
    }
  };

  const pendingScanOptionsRef = useRef<AnalyzeUrlOptions | undefined>(undefined);

  // Handle finishing a scan and saving to DB
  const handleFinishedScan = async () => {
    setIsScanning(false);

    try {
      const report = await (scanPromiseRef.current ?? Promise.reject(new Error("No scan in progress")));
      setScanHistory((prev) => {
        const filtered = prev.filter((s) => s.url.toLowerCase() !== report.url.toLowerCase());
        return [report, ...filtered];
      });
      setActiveScan(report);
      setCurrentView("dashboard");
    } catch (err: any) {
      console.error("Website audit failed:", err);
      setScanError(err?.message || "Website audit failed. Please verify the URL and try again.");
      setCurrentView("analyze");
    }
  };

  // Handle deleting a scan report
  const handleDeleteScan = async (id: string) => {
    try {
      await api.deleteScan(id);
      setScanHistory((prev) => prev.filter((s) => s.id !== id && String(s.id) !== String(id)));
      if (activeScan && (activeScan.id === id || String(activeScan.id) === String(id))) {
        const remaining = scanHistory.filter((s) => s.id !== id && String(s.id) !== String(id));
        if (remaining.length > 0) {
          setActiveScan(remaining[0]);
        }
      }
    } catch (err) {
      console.error("Failed to delete scan:", err);
    }
  };

  // Handle saving a tracked project website to Neon DB
  const handleSaveProject = async (newProj: any) => {
    try {
      const saved = await api.saveProject(newProj);
      setProjects((prev) => [saved, ...prev]);
    } catch (err) {
      console.error("Failed to track website:", err);
      throw err;
    }
  };

  // Switch to dashboard when choosing historical entries
  const handleSelectHistoryScan = (id: string) => {
    const scan = scanHistory.find((s) => s.id === id || String(s.id) === String(id));
    if (scan) {
      setActiveScan(scan);
      setCurrentView("dashboard");
    }
  };

  // Handle header quick action button
  const handleScanUrlClick = () => {
    // If they aren't on landing, bring them back to type it
    setCurrentView("analyze");
    setTimeout(() => {
      const inputEl = document.getElementById("landing-url-input");
      if (inputEl) {
        inputEl.focus();
        (inputEl as HTMLInputElement).select();
        // Smooth scroll
        inputEl.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 100);
  };

  // Official clean circular brand logo
  const logoUrl = "/logo.png";

  return (
    <div className="min-h-screen bg-[#F0F2F5] dark:bg-[#0A0B10] text-[#1A1A1A] dark:text-[#E2E8F0] font-sans relative overflow-x-hidden selection:bg-indigo-100 dark:selection:bg-indigo-950/40 selection:text-indigo-900 dark:selection:text-indigo-200 transition-colors duration-300">
      {/* Elegant Mesh Background for Bento Grid */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-70">
        <div className="absolute inset-0 bg-[#F0F2F5] dark:bg-[#0A0B10] transition-colors duration-300"></div>
        {/* Subtle modern pastel blur blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-indigo-200/30 dark:bg-indigo-950/15 blur-[130px] animate-pulse duration-[8000ms]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-teal-100/30 dark:bg-teal-950/15 blur-[130px] animate-pulse duration-[10000ms]"></div>
        <div className="absolute top-[40%] right-[20%] w-[35vw] h-[35vw] rounded-full bg-pink-100/30 dark:bg-pink-950/10 blur-[120px] animate-pulse duration-[12000ms]"></div>
      </div>

      {/* Grid Pattern overlay */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-mesh-grid opacity-50 dark:opacity-15"></div>

      {/* Navigation Bar or Left Sidebar depending on Login State */}
      {user ? (
        <Sidebar
          currentView={currentView}
          setCurrentView={setCurrentView}
          user={user}
          onLogout={() => {
            api.logout();
            setUser(null);
            setCurrentView("analyze");
          }}
          isDarkMode={isDarkMode}
          onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
          onScanUrlClick={handleScanUrlClick}
          isCollapsed={isSidebarCollapsed}
          setIsCollapsed={setIsSidebarCollapsed}
        />
      ) : (
        <NavBar
          currentView={currentView}
          setCurrentView={setCurrentView}
          onScanUrlClick={handleScanUrlClick}
          user={user}
          onLoginClick={() => setIsAuthModalOpen(true)}
          onLogout={() => {
            api.logout();
            setUser(null);
            setCurrentView("analyze");
          }}
          isDarkMode={isDarkMode}
          onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        />
      )}

      {/* Main Container */}
      <main
        className={`relative z-10 min-h-[calc(100vh-280px)] transition-all duration-300 ${
          user
            ? isSidebarCollapsed
              ? "md:pl-20 pt-20 md:pt-10"
              : "md:pl-64 pt-20 md:pt-10"
            : "pt-24"
        }`}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
          >
            {currentView === "analyze" && (
              <LandingPage
                onStartScan={handleStartScan}
                initialUrl={activeScan ? activeScan.url : "https://stripe.com"}
                user={user}
                scanHistory={scanHistory}
                onSelectScan={(id) => {
                  const selected = scanHistory.find((s) => s.id === id);
                  if (selected) {
                    setActiveScan(selected);
                    setCurrentView("dashboard");
                  }
                }}
              />
            )}

            {currentView === "dashboard" && (
              user ? (
                <DashboardPage
                  activeScan={activeScan}
                  scanHistory={scanHistory}
                  onSelectHistoryScan={handleSelectHistoryScan}
                  onNavigateToLabs={() => setCurrentView("labs")}
                  onNavigateToAnalyze={() => setCurrentView("analyze")}
                  onScanAgain={() => {
                    if (activeScan?.url) {
                      handleStartScan(activeScan.url);
                    } else {
                      setCurrentView("analyze");
                    }
                  }}
                />
              ) : (
                <LockedView viewName="dashboard" onLoginClick={() => setIsAuthModalOpen(true)} />
              )
            )}

            {currentView === "projects" && (
              user ? (
                <ProjectsPage
                  onScanClick={handleStartScan}
                  projects={projects}
                  onSaveProject={handleSaveProject}
                  user={user}
                  onLoginClick={() => setIsAuthModalOpen(true)}
                />
              ) : (
                <LockedView viewName="projects" onLoginClick={() => setIsAuthModalOpen(true)} />
              )
            )}

            {currentView === "insights" && (
              user ? (
                <InsightsPage />
              ) : (
                <LockedView viewName="insights" onLoginClick={() => setIsAuthModalOpen(true)} />
              )
            )}

            {currentView === "labs" && (
              user ? (
                <DetailedAnalysisPage activeScan={activeScan} />
              ) : (
                <LockedView viewName="labs" onLoginClick={() => setIsAuthModalOpen(true)} />
              )
            )}

            {currentView === "history" && (
              user ? (
                <ScanHistoryPage
                  scanHistory={scanHistory}
                  onSelectScan={handleSelectHistoryScan}
                  onDeleteScan={handleDeleteScan}
                  activeScanId={activeScan?.id}
                />
              ) : (
                <LockedView viewName="history" onLoginClick={() => setIsAuthModalOpen(true)} />
              )
            )}

            {currentView === "profile" && (
              user ? (
                <ProfilePage user={user} onUpdateUser={(updated) => setUser(updated)} auditCount={scanHistory.length} />
              ) : (
                <LockedView viewName="profile" onLoginClick={() => setIsAuthModalOpen(true)} />
              )
            )}

            {currentView === "settings" && (
              user ? (
                <SettingsPage onClearHistory={() => setScanHistory([])} scanHistory={scanHistory} />
              ) : (
                <LockedView viewName="settings" onLoginClick={() => setIsAuthModalOpen(true)} />
              )
            )}

            {currentView === "security" && (
              user ? (
                <SecurityPage />
              ) : (
                <LockedView viewName="security" onLoginClick={() => setIsAuthModalOpen(true)} />
              )
            )}

            {currentView === "secrets" && (
              user ? (
                <SecretsPage />
              ) : (
                <LockedView viewName="secrets" onLoginClick={() => setIsAuthModalOpen(true)} />
              )
            )}

            {currentView === "about" && (
              !user ? (
                <AboutPage />
              ) : (
                <ProfilePage user={user} onUpdateUser={(updated) => setUser(updated)} auditCount={scanHistory.length} />
              )
            )}

            {currentView === "contact" && (
              !user ? (
                <ContactPage />
              ) : (
                <ProfilePage user={user} onUpdateUser={(updated) => setUser(updated)} auditCount={scanHistory.length} />
              )
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Full-Screen Scanning Screen Loader Overlay */}
      <AnimatePresence>
        {isScanning && (
          <ScanningAnimation url={scannedUrl} scanPromise={scanPromiseRef.current} onFinished={handleFinishedScan} />
        )}
      </AnimatePresence>

      {/* User Login/Signup Dialog Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => {
          setIsAuthModalOpen(false);
          setPendingScanUrl(null);
        }}
        isScanPending={!!pendingScanUrl}
        onSuccess={(authenticatedUser) => {
          setUser(authenticatedUser);
          setIsAuthModalOpen(false);
          if (pendingScanUrl) {
            setScannedUrl(pendingScanUrl);
            setIsScanning(true);
            setPendingScanUrl(null);
          }
        }}
      />

      {/* Floating Mentor AI Companion Badge */}
      {!isAuthModalOpen && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            if (!user) {
              setIsAuthModalOpen(true);
            }
          }}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-3 py-2 rounded-full bg-slate-900/90 dark:bg-[#131520]/90 border border-slate-700/60 dark:border-indigo-500/30 shadow-[0_10px_30px_rgba(0,0,0,0.3)] backdrop-blur-md cursor-pointer group transition-all"
          id="floating-mascot-btn"
          title="Mentor AI Companion"
        >
          <MentorMascot state="idle" size="sm" className="w-8 h-8 shrink-0" />
          <span className="text-xs font-semibold text-slate-200 dark:text-slate-100 hidden sm:inline-block pr-1 group-hover:text-indigo-400 transition-colors">
            Mentor AI
          </span>
        </motion.button>
      )}

      {/* Footer component - only visible when logged out */}
      {!user && (
        <footer className="bg-white dark:bg-[#0A0B10] border-t border-gray-200/80 dark:border-slate-800/60 relative z-10 w-full mt-24 shadow-sm transition-all duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 px-6 md:px-16 py-16 max-w-7xl mx-auto">
            {/* Col 1: Logo & Tagline */}
            <div className="col-span-1 md:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-3 mb-6">
                <img
                  alt="MENTOR DOCKS Logo"
                  className="h-6 w-6 object-contain transition-transform hover:scale-105 drop-shadow-sm"
                  src={logoUrl}
                />
                <span className="font-display text-lg font-bold text-[#1A1A1A] dark:text-[#E2E8F0]">MENTOR DOCKS</span>
              </div>
              <p className="font-sans text-xs md:text-sm text-gray-500 dark:text-gray-400 leading-relaxed pr-4">
                © 2026 MENTOR DOCKS. Architecting the future of web excellence and accessibility.
              </p>
              <div className="flex items-center gap-3 mt-6 text-gray-800 dark:text-gray-300">
                <ShieldCheck className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                <span className="text-[11px] uppercase tracking-wider font-bold">Mentor Secure Audit</span>
              </div>
            </div>

            {/* Col 2: Product links */}
            <div>
              <h4 className="font-sans font-bold text-xs uppercase tracking-widest text-[#1A1A1A] dark:text-slate-300 mb-4">Product</h4>
              <ul className="flex flex-col gap-3 font-sans text-xs md:text-sm text-gray-600 dark:text-gray-400">
                <li>
                  <button onClick={() => setCurrentView("analyze")} className="hover:text-indigo-600 dark:hover:text-indigo-400 hover:underline text-left cursor-pointer">
                    Core Analyzer
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentView("dashboard")} className="hover:text-indigo-600 dark:hover:text-indigo-400 hover:underline text-left cursor-pointer">
                    Dashboard Stats
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentView("labs")} className="hover:text-indigo-600 dark:hover:text-indigo-400 hover:underline text-left cursor-pointer">
                    Technical Labs
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentView("projects")} className="hover:text-indigo-600 dark:hover:text-indigo-400 hover:underline text-left cursor-pointer">
                    Saved Portfolios
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 3: Resources links */}
            <div>
              <h4 className="font-sans font-bold text-xs uppercase tracking-widest text-[#1A1A1A] dark:text-slate-300 mb-4">Resources</h4>
              <ul className="flex flex-col gap-3 font-sans text-xs md:text-sm text-gray-600 dark:text-gray-400">
                <li>
                  <button onClick={() => setCurrentView("history")} className="hover:text-indigo-600 dark:hover:text-indigo-400 hover:underline text-left cursor-pointer">
                    Scan History
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentView("about")} className="hover:text-indigo-600 dark:hover:text-indigo-400 hover:underline text-left cursor-pointer">
                    About AI
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentView("contact")} className="hover:text-indigo-600 dark:hover:text-indigo-400 hover:underline text-left cursor-pointer">
                    Get in Touch
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 4: Legal info */}
            <div>
              <h4 className="font-sans font-bold text-xs uppercase tracking-widest text-[#1A1A1A] dark:text-slate-300 mb-4">Legal</h4>
              <ul className="flex flex-col gap-3 font-sans text-xs md:text-sm text-gray-600 dark:text-gray-400">
                <li>
                  <a href="#" className="hover:text-black dark:hover:text-white hover:underline">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-black dark:hover:text-white hover:underline">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-black dark:hover:text-white hover:underline">
                    SLA Agreements
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Made with love line */}
          <div className="border-t border-gray-200/60 dark:border-slate-800/60 py-6 px-6 md:px-16 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] text-gray-400 dark:text-gray-500">
            <div className="flex items-center gap-1.5">
              <span>Powered by</span>
              <Globe className="h-3 w-3 text-indigo-500" />
              <span>Mentor Artificial Intelligence</span>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}

