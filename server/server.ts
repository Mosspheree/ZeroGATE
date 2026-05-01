import express from "express";
import cors from "cors";
import helmet from "helmet";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { initializeApp, cert, getApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Firebase Admin
// In AI Studio, we can try to use the config file or environment variables
let db: FirebaseFirestore.Firestore;

try {
  const configPath = path.join(process.cwd(), "firebase-applet-config.json");
  const firebaseConfig = JSON.parse(fs.readFileSync(configPath, "utf-8"));
  
  initializeApp({
    projectId: firebaseConfig.projectId,
  });
  db = getFirestore();
} catch (error) {
  console.error("Firebase Admin initialization failed:", error);
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(helmet({
    contentSecurityPolicy: false, // Disable for development to allow Vite
  }));
  app.use(express.json());

  // --- API Routes ---

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", engine: "ZeroGate Neural v1.0", timestamp: new Date().toISOString() });
  });

  // Risk Evaluation Engine
  app.post("/api/risk/evaluate", (req, res) => {
    const { ip, ua, email, context } = req.body;
    
    // Simple Rule-Based Scorer
    let score = 95;
    const flags = [];

    // 1. IP Check (Simulation: certain ranges are 'risky')
    if (ip && (ip.startsWith("10.") || ip.startsWith("192."))) {
      score -= 5;
      flags.push("INTERNAL_IP_RANGE");
    }

    // 2. User Agent Check (Simulation: legacy browsers are riskier)
    if (ua && (ua.includes("MSIE") || ua.includes("Trident"))) {
      score -= 20;
      flags.push("LEGACY_BROWSER");
    }

    // 3. Time Check (Simulation: late night logins slightly riskier)
    const hour = new Date().getHours();
    if (hour < 5 || hour > 23) {
      score -= 10;
      flags.push("OFF_HOURS_ACCESS");
    }

    // 4. Identity Check
    if (email && email.endsWith("@mossphere.com")) {
      score += 5; // Trusted domain
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

  // Telemetry Collector for Recharts
  app.get("/api/telemetry", async (req, res) => {
    // In a real app, this would query a timeseries db or Firestore
    // For now, we'll return some synthesized data or query last 40 points from Firestore if they exist
    try {
      if (db) {
        const snapshot = await db.collection("telemetry").orderBy("timestamp", "desc").limit(40).get();
        const data = snapshot.docs.map(doc => doc.data()).reverse();
        if (data.length > 0) {
          return res.json(data);
        }
      }
    } catch (e) {
      console.error("Failed to fetch telemetry:", e);
    }
    
    // Mock fallback if DB empty
    res.json([]);
  });

  // --- Vite Middleware ---

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
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
