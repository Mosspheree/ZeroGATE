# ZeroGate: Autonomous Security Orchestration

[![Security: CA Authenticated](https://img.shields.io/badge/Security-Continuous_Adaptive_Auth-red)](https://en.wikipedia.org/wiki/Adaptive_authentication)
[![Runtime: Node 22](https://img.shields.io/badge/Runtime-Node_22-green)](https://nodejs.org/)
[![Auth: Firebase OIDC](https://img.shields.io/badge/Auth-Firebase_OIDC-orange)](https://firebase.google.com/)

**ZeroGate** is a production-grade Security Services Edge (SSE) demonstration platform. It implements **Continuous Adaptive Authentication (CAA)** to move beyond the "static login" paradigm, instead evaluating session risk in millisecond intervals based on behavioral telemetry and machine-learned heuristics.

---

## 🛡️ Core Security Architecture

ZeroGate operates on a **Split-Plane Architecture** (ADR-002), physically separating the Identity Management layer from the Risk Intelligence engine.

### 1. The Identity Plane (Control Plane)
Leverages **Firebase Identity Platform** for high-entropy authentication.
- **Provider:** Google OIDC 2.1
- **Session Fabric:** Cryptographically signed JWTs with forced email verification.
- **Ruleset:** Hardened Attribute-Based Access Control (ABAC) via Firestore Security Rules.

### 2. The Risk Engine (Intelligence Plane)
A high-concurrency Node.js engine (`/server/server.ts`) that calculates a dynamic **Neural Trust Score (NTS)**.
- **Signal Analysis:**
  - `GEO_VELOCITY`: Detects impossible travel patterns between consecutive logins.
  - `CLIENT_FINGERPRINT`: Validates consistency in browser/OS telemetry.
  - `REPUTATION_MESH`: Cross-references IP ranges against internal risk databases.
  - `BEHAVIORAL_TIMING`: Identifies anomalous access windows (e.g., system-level access at 03:00 AM).

### 3. Real-Time SOC Dashboard (Observation Plane)
A React 19 interface providing global visibility into the identity mesh.
- **Live Topology:** Dynamic SVG representation of all active authenticated nodes.
- **Telemetry Stream:** Real-time throughput monitoring using Recharts.
- **Kill-Switch Orchestration:** Distributed session revocation with <200ms global propagation.

---

## 🏗️ Technical Specifications

### Project Structure
```text
ZeroGate/
├── client/           # Identity Portal & SOC Dashboard (React 19)
│   ├── src/          # Functional core: Hooks, Services, Components
│   └── index.html    # Entry point
├── server/           # Risk Intelligence & Backend For Frontend (BFF)
│   └── server.ts     # Express server & Risk Heuristics
├── firestore.rules   # Hardened security policies
├── tsconfig.json     # Strict-mode TypeScript configuration
└── vite.config.ts    # Advanced build pipeline
```

### Security Posture (CAA Implementation)
- **Credential Safety:** All sensitive configurations (`firebase-applet-config.json`, `.env`) are strictly excluded from version control via `.gitignore`.
- **DDoS Mitigation:** Integrated `helmet` and `cors` policies with customized CSP (Content Security Policy) headers.
- **Zero-Trust Logic:** No implicit trust. Every telemetry request (`/api/telemetry`) is independently verified against the Auth context.

---

## 🚀 Deployment & Operations

### Local Development
```bash
# Install dependencies
npm install

# Start the unified dev server (Express + Vite)
npm run dev
```

### Production Build
```bash
# Generate optimized static assets and server-side ready code
npm run build
```

---

## 📜 Architecture Decision Records (ADRs)

- **[ADR-001: Firebase Identity](./docs/ADR-001-why-firebase.md)** - Selection of Google Cloud for enterprise-grade auth.
- **[ADR-002: Plane Separation](./docs/ADR-002-repo-restructure.md)** - Reasoning for the physical decoupling of Risk vs Auth.
- **[ADR-003: Technical Vision](./docs/ADR-003-design-philosophy.md)** - Establishing the high-density "SOC-first" visual language.

---
*ZeroGate — Securing the Identity Perimeter.*
