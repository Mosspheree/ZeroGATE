# ZeroGate | Universal Adaptive SSO Platform

[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Protocol](https://img.shields.io/badge/Protocol-OIDC%202.1%20%7C%20SAML-blue)](https://openid.net/)
[![Security](https://img.shields.io/badge/Security-Zero%20Trust-indigo)](https://en.wikipedia.org/wiki/Zero_trust_security_model)

**ZeroGate** is a next-generation security platform engineered around **Continuous Adaptive Authentication (CAA)**. It eliminates the concept of implicit trust once identity is established, achieving a true Zero Trust posture through real-time ML-driven risk scoring and cryptographically bound sessions.

---

## ⚡ Key Technical Pillars

### 1. Zero-Trust Identity Plane
Integrated with **Firebase Identity Platform**, providing a robust OIDC compliant handshake. User identity is verified against a high-entropy neural trust index before session promotion.

### 2. Neural Risk Engine
A dedicated backend engine (`/server/server.ts`) that continuously evaluates 12+ behavioral signals including:
- **IP Reputation & Geo-Velocity:** Detecting impossible travel and proxy-based obfuscation.
- **Client Fingerprinting:** Validating system-level telemetry to detect T800-series threat entities.
- **Behavioral Context:** Analyzing session timing and access patterns.

### 3. Session Fabric (Real-time SOC)
A high-density Security Operations Center dashboard powered by **Firestore Real-time Sync** and **Recharts**.
- **Live Topology:** SVG-based visualization of global identity nodes.
- **Throughput Telemetry:** Millisecond-accurate request monitoring.
- **Instant Revocation:** Sub-200ms session termination across the entire fabric.

---

## 🏗️ Project Architecture

We follow a strictly decoupled **Security Plane Separation** model to ensure the integrity of the risk evaluation logic.

```bash
ZeroGate/
├── client/           # Identity Portal & SOC Dashboard (React 19 + Motion)
│   └── src/          # Frontend logic, components, and security services
├── server/           # Security Risk Engine & BFF (Node.js Express)
│   └── server.ts     # Risk heuristics and telemetry aggregation
├── docs/             # Architecture Decision Records (ADR)
│   ├── ADR-001-why-firebase.md
│   ├── ADR-002-repo-restructure.md
│   └── ADR-003-design-philosophy.md
├── firestore.rules   # Hardened ABAC Security Rules
├── index.html        # Main entry point (root-level for Vercel compatibility)
└── vite.config.ts    # Central build orchestration
```

---

## 📜 Architecture Decision Records (ADRs)

We document our high-level architectural shifts to maintain transparency in our engineering choices.

- **[ADR-001: Selection of Firebase](./docs/ADR-001-why-firebase.md)** - Utilizing Google Cloud for real-time identity persistence.
- **[ADR-002: Monorepo Plane Separation](./docs/ADR-002-repo-restructure.md)** - Physical directory split for security-critical logic.
- **[ADR-003: Design Philosophy](./docs/ADR-003-design-philosophy.md)** - Establishing the "Deep Technical" visual language.

---

## 🛠️ Stack & Standards

- **Frontend:** React 19, TypeScript, Tailwind CSS 4, Motion/React
- **Backend:** Node.js Express (ESM via tsx)
- **Database:** Google Cloud Firestore (Regional us-east1)
- **Auth:** Firebase Auth (OIDC / Google Provider)
- **Visuals:** Recharts, Lucide-React

---

## 🚀 Getting Started

### Installation
```bash
npm install
```

### Development Mode
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

---
*ZeroGate — Engineered for Continuous Trust.*
