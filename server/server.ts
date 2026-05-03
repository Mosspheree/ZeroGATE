import express from "express";
import cors from "cors";
import helmet from "helmet";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { initializeApp } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let db: Firestore;

try {
  initializeApp({
    projectId: process.env.FIREBASE_PROJECT_ID,
  });
  db = getFirestore(process.env.FIREBASE_DATABASE_ID || "(default)");
} catch (error) {
  console.error("Firebase Admin initialization failed:", error);
}

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

  const allowedOrigin = process.env.APP_URL || `http://localhost:${PORT}`;
  app.use(cors({ origin: allowedOrigin }));
  app.use(helmet({
    contentSecurityPolicy: false,
  }));
  app.use(express.json({ limit: "10kb" }));

  // --- API Routes ---

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", engine: "ZeroGate Neural v1.0", timestamp: new Date().toISOString() });
  });

  app.post("/api/risk/evaluate", (req, res) => {
    const { ip, ua, email } = req.body;

    if (typeof ip !== "string" && ip !== undefined) {
      res.status(400).json({ error: "Invalid input" });
      return;
    }

    let score = 95;
    const flags: string[] = [];

    if (ip && (ip.startsWith("10.") || ip.startsWith("192."))) {
      score -= 5;
      flags.push("INTERNAL_IP_RANGE");
    }

    if (ua && (ua.includes("MSIE") || ua.includes("Trident"))) {
      score -= 20;
      flags.push("LEGACY_BROWSER");
    }

    const hour = new Date().getHours();
    if (hour < 5 || hour > 23) {
      score -= 10;
      flags.push("OFF_HOURS_ACCESS");
    }

    const trustedDomain = process.env.TRUSTED_EMAIL_DOMAIN;
    if (trustedDomain && email && typeof email === "string" && email.endsWith(`@${trustedDomain}`)) {
      score += 5;
    }

    const finalScore = Math.min(100, Math.max(0, score));

    let riskLevel = "LOW";
    if (finalScore < 80) riskLevel = "MEDIUM";
    if (finalScore < 50) riskLevel = "HIGH";
    if (finalScore < 30) riskLevel = "CRITICAL";

    res.json({
      trustScore: finalScore,
      riskLevel,
      flags,
      timestamp: new Date().toISOString()
    });
  });

  app.get("/api/telemetry", async (req, res) => {
    res.json([]);
  });

  // --- Vite Middleware ---

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
      root: path.join(process.cwd(), "client"),
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`ZeroGate Server running on http://localhost:${PORT}`);
  });
}

startServer();
