import express from "express";
import path from "path";
import dotenv from "dotenv";
import pg from "pg";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { runWebsiteAudit } from "./audit/index";
import { runPageSpeedInsights } from "./audit/pageSpeedInsights";

dotenv.config();

const app = express();
app.use(express.json());

// Debug middleware for API requests + ensure DB is ready before handlers run
app.use(async (req, res, next) => {
  if (req.url.startsWith("/api/")) {
    // Strip the `path` query parameter injected by Vercel rewrite `:path*` capture,
    // so logging, Express routing, and query handlers see the clean original URL
    // (e.g. "/api/auth/me?path=auth%2Fme" → "/api/auth/me").
    const originalUrl = req.originalUrl || req.url;
    const urlObj = new URL(originalUrl, "http://localhost");
    if (urlObj.searchParams.has("path")) {
      urlObj.searchParams.delete("path");
      const cleaned = urlObj.pathname + urlObj.search + urlObj.hash;
      req.url = cleaned;
      req.originalUrl = cleaned;
      if ((req as any)._parsedUrl) (req as any)._parsedUrl = null;
    }

    console.log(`[API] ${req.method} ${req.url}`);
    (req as any).dbReady = (pool && !poolPermanentlyDisabled) ? await ensureDatabase() : false;
  }
  next();
});

const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || "super_secret_jwt_sign_key_123456789";

// Initialize PostgreSQL Connection Pool
const { Pool } = pg;
let pool: any = null;
let dbReady = false;
let dbInitPromise: Promise<void> | null = null;
let poolPermanentlyDisabled = false;

function isAuthError(err: any): boolean {
  const code = err?.code;
  const msg = (err?.message || "").toLowerCase();
  return code === "28P01" ||
    msg.includes("password authentication") ||
    msg.includes("authentication failed") ||
    msg.includes("no pg_hba.conf entry");
}

function disablePoolPermanently(reason: string) {
  poolPermanentlyDisabled = true;
  if (pool) {
    try { pool.end().catch(() => {}); } catch (_) {}
  }
  pool = null;
  dbReady = false;
  dbInitPromise = null;
  console.warn(`[DB] ${reason} — permanently disabled. Running in in-memory mode.`);
}

function getDatabaseUrl(): string | undefined {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) return undefined;

  if (url.includes("neon.tech") && !url.includes("sslmode=")) {
    return `${url}${url.includes("?") ? "&" : "?"}sslmode=require`;
  }

  return url;
}

const databaseUrl = getDatabaseUrl();
if (databaseUrl) {
  try {
    pool = new Pool({
      connectionString: databaseUrl,
      ssl: {
        rejectUnauthorized: false
      },
      max: process.env.VERCEL ? 1 : 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    });
    console.log("PostgreSQL Pool initialized with DATABASE_URL.");

    pool.on("error", (err: any) => {
      console.error("[DB] Pool-level error:", err?.message || err);
      if (isAuthError(err)) {
        disablePoolPermanently("Authentication error detected on pool");
      }
    });

    (async () => {
      try {
        const client = await pool.connect();
        client.release();
        console.log("[DB] Initial connection probe succeeded.");
      } catch (err: any) {
        console.error("[DB] Initial connection probe failed:", err?.message || err);
        if (isAuthError(err)) {
          disablePoolPermanently("Authentication failed on initial probe");
        }
      }
    })();
  } catch (err) {
    console.error("Failed to initialize PostgreSQL pool:", err);
    pool = null;
  }
} else {
  console.warn("DATABASE_URL environment variable is missing. Running in in-memory mode.");
}

function isDbAvailable(req: any): boolean {
  return Boolean(pool && !poolPermanentlyDisabled && req.dbReady);
}

async function initDatabase() {
  if (!pool || poolPermanentlyDisabled) return;

  const client = await pool.connect();
  try {
    console.log("Connected to PostgreSQL database. Checking tables...");

    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        url VARCHAR(255) NOT NULL,
        score INTEGER NOT NULL,
        last_scan VARCHAR(100) NOT NULL,
        issues INTEGER NOT NULL,
        category VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS scans (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        url VARCHAR(255) NOT NULL,
        score INTEGER NOT NULL,
        health_message TEXT NOT NULL,
        problems JSONB NOT NULL,
        recommendations JSONB NOT NULL,
        metrics JSONB NOT NULL,
        date VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    dbReady = true;
    console.log("Database tables verified/created successfully.");
  } finally {
    client.release();
  }
}

async function ensureDatabase(): Promise<boolean> {
  if (!pool || poolPermanentlyDisabled) return false;
  if (dbReady) return true;

  if (!dbInitPromise) {
    dbInitPromise = initDatabase().catch((err) => {
      dbInitPromise = null;
      dbReady = false;
      console.error("Error during database schema initialization:", err);
      if (isAuthError(err)) {
        disablePoolPermanently("Authentication failed during schema init");
      }
      throw err;
    });
  }

  try {
    await dbInitPromise;
    return dbReady;
  } catch {
    return false;
  }
}

// In-memory fallback stores for when user is anonymous (not logged in) or DB is unavailable
const anonymousProjects: any[] = [];

const anonymousScans: any[] = [];

// In-memory user store — used as a full auth fallback when DATABASE_URL is not set
const inMemoryUsers: Array<{ id: number; email: string; password: string; name: string }> = [];
let inMemoryUserIdCounter = 1;

// Authentication Middleware
function authenticateToken(req: any, res: any, next: any) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ error: "Invalid or expired token" });
    }
    req.user = user;
    next();
  });
}

// Optional Auth Middleware (Doesn't fail if no token, just adds user context)
function optionalAuthenticateToken(req: any, res: any, next: any) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    req.user = null;
    return next();
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      req.user = null;
    } else {
      req.user = user;
    }
    next();
  });
}

// --- AUTHENTICATION ENDPOINTS ---

// Signup Endpoint
app.post("/api/auth/signup", async (req: any, res: any) => {
  const { email, password, name } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    if (isDbAvailable(req)) {
      // Check if user already exists
      const userCheck = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
      if (userCheck.rows.length > 0) {
        return res.status(400).json({ error: "Email is already registered" });
      }

      const result = await pool.query(
        "INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING id, email, name",
        [email, hashedPassword, name || ""]
      );

      const user = result.rows[0];
      const displayName = user.name || user.email.split("@")[0];
      const token = jwt.sign({ userId: user.id, email: user.email, name: displayName }, JWT_SECRET, { expiresIn: "7d" });

      return res.status(201).json({
        token,
        user: { id: user.id, email: user.email, name: displayName }
      });
    } else {
      // --- In-memory fallback auth (no database) ---
      const existing = inMemoryUsers.find((u) => u.email === email);
      if (existing) {
        return res.status(400).json({ error: "Email is already registered" });
      }
      const newUser = { id: inMemoryUserIdCounter++, email, password: hashedPassword, name: name || email.split("@")[0] };
      inMemoryUsers.push(newUser);
      const token = jwt.sign({ userId: newUser.id, email: newUser.email, name: newUser.name }, JWT_SECRET, { expiresIn: "7d" });
      console.log(`[In-Memory Auth] New user registered: ${email}`);
      return res.status(201).json({
        token,
        user: { id: newUser.id, email: newUser.email, name: newUser.name }
      });
    }
  } catch (err: any) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Internal server error during registration" });
  }
});

// Login Endpoint
app.post("/api/auth/login", async (req: any, res: any) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    if (isDbAvailable(req)) {
      const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
      if (result.rows.length === 0) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      const user = result.rows[0];
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      const token = jwt.sign({ userId: user.id, email: user.email, name: user.name || user.email.split("@")[0] }, JWT_SECRET, { expiresIn: "7d" });

      return res.json({
        token,
        user: { id: user.id, email: user.email, name: user.name || user.email.split("@")[0] }
      });
    } else {
      // --- In-memory fallback auth (no database) ---
      const user = inMemoryUsers.find((u) => u.email === email);
      if (!user) {
        return res.status(401).json({ error: "Invalid email or password" });
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: "Invalid email or password" });
      }
      const token = jwt.sign({ userId: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: "7d" });
      console.log(`[In-Memory Auth] User logged in: ${email}`);
      return res.json({
        token,
        user: { id: user.id, email: user.email, name: user.name }
      });
    }
  } catch (err: any) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Internal server error during login" });
  }
});

// Get Current User Info
app.get("/api/auth/me", authenticateToken, async (req: any, res: any) => {
  try {
    if (isDbAvailable(req)) {
      const result = await pool.query("SELECT id, email, name FROM users WHERE id = $1", [req.user.userId]);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }
      const user = result.rows[0];
      return res.json({ user: { id: user.id, email: user.email, name: user.name || user.email.split("@")[0] } });
    } else {
      // --- In-memory fallback ---
      const user = inMemoryUsers.find((u) => u.id === req.user.userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      return res.json({ user: { id: user.id, email: user.email, name: user.name } });
    }
  } catch (err: any) {
    console.error("Me endpoint error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// --- PROJECTS ENDPOINTS ---

// GET user's saved projects
app.get("/api/projects", optionalAuthenticateToken, async (req: any, res: any) => {
  try {
    if (req.user && isDbAvailable(req)) {
      const result = await pool.query(
        "SELECT id, name, url, score, last_scan as \"lastScan\", issues, category FROM projects WHERE user_id = $1 ORDER BY created_at DESC",
        [req.user.userId]
      );
      return res.json(result.rows);
    } else {
      // Return default mock/anonymous projects
      return res.json(anonymousProjects);
    }
  } catch (err: any) {
    console.error("Error fetching projects:", err);
    res.status(500).json({ error: "Failed to fetch projects" });
  }
});

// POST save a new project
app.post("/api/projects", optionalAuthenticateToken, async (req: any, res: any) => {
  const { name, url, score, lastScan, issues, category } = req.body;

  if (!name || !url) {
    return res.status(400).json({ error: "Name and URL are required" });
  }

  try {
    if (req.user && isDbAvailable(req)) {
      const result = await pool.query(
        "INSERT INTO projects (user_id, name, url, score, last_scan, issues, category) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, name, url, score, last_scan as \"lastScan\", issues, category",
        [req.user.userId, name, url, score || 80, lastScan || "Just now", issues || 0, category || "Other"]
      );
      return res.status(201).json(result.rows[0]);
    } else {
      // Add to in-memory store for anonymous user
      const newProj = {
        id: "p_" + Date.now(),
        name,
        url,
        score: score || 80,
        lastScan: lastScan || "Just now",
        issues: issues || 0,
        category: category || "Other"
      };
      anonymousProjects.unshift(newProj);
      return res.status(201).json(newProj);
    }
  } catch (err: any) {
    console.error("Error saving project:", err);
    res.status(500).json({ error: "Failed to save project" });
  }
});

// --- SCANS ENDPOINTS ---

// GET saved scan history
app.get("/api/scans", optionalAuthenticateToken, async (req: any, res: any) => {
  try {
    if (req.user && isDbAvailable(req)) {
      const result = await pool.query(
        "SELECT id, url, score, health_message as \"healthMessage\", problems, recommendations, metrics, date FROM scans WHERE user_id = $1 ORDER BY created_at DESC",
        [req.user.userId]
      );
      return res.json(result.rows);
    } else {
      return res.json(anonymousScans);
    }
  } catch (err: any) {
    console.error("Error fetching scans:", err);
    res.status(500).json({ error: "Failed to fetch scans" });
  }
});

// POST save a scan report
app.post("/api/scans", optionalAuthenticateToken, async (req: any, res: any) => {
  const { url, score, healthMessage, problems, recommendations, metrics, date } = req.body;

  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  try {
    if (req.user && isDbAvailable(req)) {
      const result = await pool.query(
        "INSERT INTO scans (user_id, url, score, health_message, problems, recommendations, metrics, date) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id, url, score, health_message as \"healthMessage\", problems, recommendations, metrics, date",
        [
          req.user.userId,
          url,
          score,
          healthMessage,
          JSON.stringify(problems || []),
          JSON.stringify(recommendations || []),
          JSON.stringify(metrics || {}),
          date || new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
        ]
      );
      return res.status(201).json(result.rows[0]);
    } else {
      const newScan = {
        id: "scan_" + Date.now(),
        url,
        score,
        healthMessage,
        problems: problems || [],
        recommendations: recommendations || [],
        metrics: metrics || {},
        date: date || new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
      };
      anonymousScans.unshift(newScan);
      return res.status(201).json(newScan);
    }
  } catch (err: any) {
    console.error("Error saving scan:", err);
    res.status(500).json({ error: "Failed to save scan" });
  }
});

// DELETE a scan report
app.delete("/api/scans/:id", optionalAuthenticateToken, async (req: any, res: any) => {
  const { id } = req.params;
  try {
    if (req.user && isDbAvailable(req)) {
      await pool.query("DELETE FROM scans WHERE id = $1 AND user_id = $2", [id, req.user.userId]);
      return res.status(200).json({ message: "Scan deleted successfully" });
    } else {
      // Find and remove from anonymous list
      const index = anonymousScans.findIndex(s => s.id === id || String(s.id) === String(id));
      if (index !== -1) {
        anonymousScans.splice(index, 1);
      }
      return res.status(200).json({ message: "Scan deleted successfully" });
    }
  } catch (err: any) {
    console.error("Error deleting scan:", err);
    res.status(500).json({ error: "Failed to delete scan" });
  }
});

// --- DIRECT PAGESPEED INSIGHTS ENDPOINT ---
app.get("/api/pagespeed", optionalAuthenticateToken, async (req: any, res: any) => {
  const url = (req.query.url as string) || "";
  const strategy = (req.query.strategy as string) === "desktop" ? "desktop" : "mobile";

  if (!url) {
    return res.status(400).json({ error: "URL query parameter is required" });
  }

  try {
    const psiResult = await runPageSpeedInsights(url, strategy);
    return res.json(psiResult);
  } catch (err: any) {
    console.error("PageSpeed Insights endpoint failed:", err);
    return res.status(502).json({ error: err?.message || "PageSpeed Insights call failed" });
  }
});

app.post("/api/pagespeed", optionalAuthenticateToken, async (req: any, res: any) => {
  const { url, strategy } = req.body || {};

  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  try {
    const psiResult = await runPageSpeedInsights(url, strategy === "desktop" ? "desktop" : "mobile");
    return res.json(psiResult);
  } catch (err: any) {
    console.error("PageSpeed Insights endpoint failed:", err);
    return res.status(502).json({ error: err?.message || "PageSpeed Insights call failed" });
  }
});

// --- URL SCANNER (Lighthouse / PSI / Puppeteer / CDP) ---
app.post("/api/scans/analyze", optionalAuthenticateToken, async (req: any, res: any) => {
  const { url, scanMode, device, checks } = req.body || {};

  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  const deep = scanMode !== "standard";
  const strategy = device === "desktop" ? "desktop" : "mobile";

  try {
    const finalReport = await runWebsiteAudit(url, {
      deep,
      strategy,
      checks: checks || {
        domStructure: true,
        contrastWcag: true,
        performanceWebVitals: true,
        securityHeaders: true,
        seoOptimization: true,
      },
    });

    const { auditMeta, status, ...persisted } = finalReport as any;

    try {
      if (req.user && isDbAvailable(req)) {
        const dbResult = await pool.query(
          "INSERT INTO scans (user_id, url, score, health_message, problems, recommendations, metrics, date) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id, url, score, health_message as \"healthMessage\", problems, recommendations, metrics, date",
          [
            req.user.userId,
            persisted.url,
            persisted.score,
            persisted.healthMessage,
            JSON.stringify(persisted.problems),
            JSON.stringify(persisted.recommendations),
            JSON.stringify(persisted.metrics),
            persisted.date,
          ]
        );
        return res.status(200).json({ ...dbResult.rows[0], status: "completed", auditMeta });
      }

      const payload = {
        ...persisted,
        id: "scan_" + Date.now(),
        status: "completed" as const,
        auditMeta,
      };
      anonymousScans.unshift(payload);
      return res.status(200).json(payload);
    } catch (saveErr: any) {
      console.error("Failed to save analyzed scan:", saveErr);
      return res.status(200).json({
        ...persisted,
        id: "scan_temp_" + Date.now(),
        status: "completed",
        auditMeta,
      });
    }
  } catch (err: any) {
    console.error("Website audit failed:", err);
    return res.status(502).json({
      error: err?.message || "Website audit failed. Check the URL and try again.",
    });
  }
});

// Vite Middleware & Startup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req: any, res: any) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

if (!process.env.VERCEL) {
  startServer();
}

export default app;
