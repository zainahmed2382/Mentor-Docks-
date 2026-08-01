import { WebsiteScan } from "../types";

const TOKEN_KEY = "mentor_auth_token";
const USER_KEY = "mentor_auth_user";
const API_BASE = ((import.meta as any).env?.VITE_API_URL as string) || (typeof window !== "undefined" ? window.location.origin : "");

interface JwtPayload {
  userId?: number;
  email?: string;
  name?: string;
  exp?: number;
}

function decodeJwtPayload(token: string): JwtPayload | null {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    return JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
  } catch {
    return null;
  }
}

export function isTokenExpired(token: string): boolean {
  const payload = decodeJwtPayload(token);
  if (!payload?.exp) return true;
  return Date.now() >= payload.exp * 1000;
}

function userFromJwt(token: string): User | null {
  const payload = decodeJwtPayload(token);
  if (!payload?.userId || !payload?.email) return null;
  return {
    id: payload.userId,
    email: payload.email,
    name: payload.name || payload.email.split("@")[0],
  };
}

// Safe JSON parser: avoids the "Unexpected token" crash when the server
// returns an HTML error page instead of JSON (e.g. backend not running).
async function safeJson(response: Response): Promise<any> {
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    const text = await response.text();
    // Provide a clear, readable error instead of a JSON parse crash
    if (response.status === 404) {
      throw new Error("API endpoint not found. Make sure the backend server is running.");
    }
    throw new Error(`Server error (${response.status}): ${text.slice(0, 120)}`);
  }
  return response.json();
}

export interface AnalyzeUrlOptions {
  scanMode?: "standard" | "deep";
  device?: "desktop" | "mobile";
  checks?: {
    domStructure?: boolean;
    contrastWcag?: boolean;
    performanceWebVitals?: boolean;
    securityHeaders?: boolean;
    seoOptimization?: boolean;
  };
}

export interface User {
  id: number;
  email: string;
  name: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  error?: string;
}

// Session helper functions
export const getToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
};

export const setSession = (token: string, user: User): void => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const clearSession = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const getStoredUser = (): User | null => {
  const token = getToken();
  if (!token || isTokenExpired(token)) {
    if (token) clearSession();
    return null;
  }

  try {
    const stored = localStorage.getItem(USER_KEY);
    if (stored) return JSON.parse(stored) as User;
  } catch {
    // Fall through to JWT claims
  }

  return userFromJwt(token);
};

const getHeaders = () => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  const token = getToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

export const api = {
  // Authentication
  async signup(email: string, password: string, name: string): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE}/api/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name }),
    });
    const data = await safeJson(response);
    if (!response.ok) {
      throw new Error(data.error || "Failed to sign up");
    }
    setSession(data.token, data.user);
    return data;
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await safeJson(response);
    if (!response.ok) {
      throw new Error(data.error || "Failed to log in");
    }
    setSession(data.token, data.user);
    return data;
  },

  async getMe(): Promise<{ user: User } | null> {
    const token = getToken();
    if (!token) return null;

    if (isTokenExpired(token)) {
      clearSession();
      return null;
    }

    try {
      const response = await fetch(`${API_BASE}/api/auth/me`, {
        method: "GET",
        headers: getHeaders(),
      });
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          clearSession();
        }
        return null;
      }
      const data = await safeJson(response);
      if (data?.user) {
        setSession(token, data.user);
      }
      return data;
    } catch {
      // Network or parse errors should not destroy a valid local session
      return getStoredUser() ? { user: getStoredUser()! } : null;
    }
  },

  logout(): void {
    clearSession();
  },

  // Projects
  async getProjects(): Promise<any[]> {
    const response = await fetch(`${API_BASE}/api/projects`, {
      method: "GET",
      headers: getHeaders(),
    });
    const data = await safeJson(response);
    if (!response.ok) {
      throw new Error(data?.error || "Failed to fetch projects");
    }
    return Array.isArray(data) ? data : [];
  },

  async saveProject(project: {
    name: string;
    url: string;
    score: number;
    lastScan: string;
    issues: number;
    category: string;
  }): Promise<any> {
    const response = await fetch(`${API_BASE}/api/projects`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(project),
    });
    const data = await safeJson(response);
    if (!response.ok) {
      throw new Error(data?.error || "Failed to save project");
    }
    return data;
  },

  // Scans
  async getScans(): Promise<WebsiteScan[]> {
    const response = await fetch(`${API_BASE}/api/scans`, {
      method: "GET",
      headers: getHeaders(),
    });
    const data = await safeJson(response);
    if (!response.ok) {
      throw new Error(data?.error || "Failed to fetch scans");
    }
    return Array.isArray(data) ? data : [];
  },

  async saveScan(scan: Omit<WebsiteScan, "id" | "status">): Promise<WebsiteScan> {
    const response = await fetch(`${API_BASE}/api/scans`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(scan),
    });
    const data = await safeJson(response);
    if (!response.ok) {
      throw new Error(data?.error || "Failed to save scan history");
    }
    return data;
  },

  async deleteScan(id: string): Promise<boolean> {
    const response = await fetch(`${API_BASE}/api/scans/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    return response.ok;
  },

  async analyzeUrl(url: string, options: AnalyzeUrlOptions = {}): Promise<WebsiteScan> {
    const response = await fetch(`${API_BASE}/api/scans/analyze`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({
        url,
        scanMode: options.scanMode,
        device: options.device,
        checks: options.checks,
      }),
    });
    const data = await safeJson(response);
    if (!response.ok) {
      throw new Error(data.error || "Failed to analyze website");
    }
    return data;
  },

  async getPageSpeed(url: string, strategy: "mobile" | "desktop" = "mobile"): Promise<any> {
    const response = await fetch(`${API_BASE}/api/pagespeed?url=${encodeURIComponent(url)}&strategy=${strategy}`, {
      method: "GET",
      headers: getHeaders(),
    });
    const data = await safeJson(response);
    if (!response.ok) {
      throw new Error(data.error || "Failed to fetch PageSpeed Insights");
    }
    return data;
  },
};
