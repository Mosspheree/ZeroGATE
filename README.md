# ZeroGate | Universal Adaptive SSO Platform

[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Protocol](https://img.shields.io/badge/Protocol-OIDC%202.1%20%7C%20SAML-blue)](https://openid.net/)
[![Security](https://img.shields.io/badge/Security-Zero%20Trust-indigo)](https://en.wikipedia.org/wiki/Zero_trust_security_model)

**ZeroGate** is a next-generation, high-fidelity security platform prototype engineered around **Continuous Adaptive Authentication (CAA)**. It demonstrates a future where identity is not a static state, but a dynamic trust score influenced by real-time behavioral and environmental telemetry.

---

## 🚀 Production-Grade Features

ZeroGate has evolved from a simulation to a functional prototype:

### 1. Real Auth Flow (Firebase Integration)
- **OIDC Identity Provider:** Powered by Firebase Authentication.
- **Biometric Handshake:** Authenticated users trigger a cryptographic session binding process.
- **Session Persistence:** Active sessions are stored securely in Firestore with real-time sync.

### 2. Neural Risk Engine (Express API)
- **Heuristic Scoring:** A backend API (`/api/risk/evaluate`) analyzes request headers, IP reputation, and behavioral context.
- **Dynamic Policy Rejection:** The "Attacker" persona is now caught by a server-side rule engine, not just a frontend toggle.

### 3. Session Fabric (Firestore)
- **Live State Management:** The SOC dashboard reflects real data from the Firestore database.
- **Unified Revocation:** One-click revocation update propagates through the persistence layer instantly.

### 4. ZeroGate SDK (`zerogate-js`)
- **Developer First:** A consolidated client-side SDK (`src/services/zerogate.ts`) encapsulates complex auth and risk logic.
- **Zero-Config Telemetry:** Automatic collection of performance and security metrics.

---

## 🏗️ Architecture

- **Frontend:** React 19 / Vite / Tailwind 4
- **Backend:** Node.js Express (on `tsx`)
- **Database:** Google Cloud Firestore
- **Auth:** Firebase Identity Platform

---

## 🚀 Core Philosophy

Traditional SSO solutions (Okta, Auth0, Azure AD) treat authentication as a point-in-time binary: you are either authenticated or you are not. ZeroGate challenges this by continuously evaluating user trust signals throughout the entire session lifecycle.

- **Authenticate once, verify always:** Every API call carries a short-lived Proof-of-Possession (PoP) token.
- **Hardware-Bound Identity:** Implements DPoP (RFC 9449) to bind access tokens to the client's ephemeral key pair.
- **Explainable AI Risk Engine:** Uses LightGBM with SHAP attribution to provide clear audit trails for why a trust score changed.

## 🏗️ Technical Architecture

ZeroGate is decomposed into five independently deployable planes:

1.  **Auth Plane (Go):** Stateless OIDC/OAuth 2.1 + SAML 2.0 broker. Optimized for minimal GC latency.
2.  **Risk Engine (Python):** Online ML service consuming Kafka telemetry to output 0-100 trust scores.
3.  **Policy Engine (OPA):** Rego-based authorization layer evaluating ABAC policies against real-time scores.
4.  **Session Fabric (Redis):** Distributed session graph supporting real-time revocation via CAEP/SSE.
5.  **Admin Portal (React):** Real-time telemetry dashboard and policy editor built with React 19 and Motion.

## 📊 Performance Targets

| Metric | Target | Notes |
| :--- | :--- | :--- |
| Token Issuance P99 | < 50 ms | Measured at load balancer egress |
| Risk Score P99 | < 10 ms | LightGBM inference + feature cache |
| System Availability | 99.99% | Active-active across 3 Availability Zones |
| Sustained Throughput | 100k TPS | Horizontally scalable architecture |

## 🏗️ Project Structure

The project follows a **Security Plane Separation** architecture (ADR-002), physically decoupling identity management from backend risk evaluation.

```bash
ZeroGate/
├── client/           # Identity Portal & SOC Dashboard (React 19)
│   ├── src/          # Frontend logic and components
│   └── index.html    # Client entry point
├── server/           # Risk Engine & BFF (Node.js Express)
│   └── server.ts     # API logic and middleware
├── docs/             # Architecture Decision Records (ADRs)
│   ├── ADR-001-why-firebase.md
│   ├── ADR-002-repo-restructure.md
│   └── ADR-003-design-philosophy.md
├── firebase-applet-config.json # App configuration (GITIGNORE'D)
├── firestore.rules   # Hardened security rules
└── package.json      # Workspace orchestration
```

---

## 📜 Architecture Decision Records (ADRs)

We document major architectural shifts to maintain transparency and "Senior-level" decision tracking.

- **[ADR-001: Selection of Firebase for Identity](./docs/ADR-001-why-firebase.md)** - Why we chose Firebase over custom OIDC for the prototype phase.
- **[ADR-002: Monorepo Plane Separation](./docs/ADR-002-repo-restructure.md)** - The rationale behind the physical directory split between client and server.
- **[ADR-003: Design Philosophy](./docs/ADR-003-design-philosophy.md)** - Establishing the "Deep Technical" visual language of the platform.

---

## 🛡️ Security Posture

- **Hardened Rules:** Firestore security rules enforce `request.auth.uid` level isolation.
- **Credential Safety:** `firebase-applet-config.json` is strictly added to `.gitignore` to prevent secret leakage.
- **Server-Side Risk:** Risk scoring is performed on the server (`/api/risk/evaluate`) to prevent client-side evaluation tampering.
- **JWT Binding:** Demonstrated usage of DPoP (Demonstrating Proof-of-Possession) concepts within the authenticated session management.

---

## 🛠️ Development Setup

Built with a specialized high-performance frontend stack:
- **Framework:** React 19 + TypeScript
- **Styling:** Tailwind CSS 4 (Utility-first with custom CSS variables)
- **Animation:** `motion/react` (Framer Motion) for layout transitions and live SVG path animations
- **Visualization:** `recharts` for time-series throughput data
- **Icons:** `lucide-react`

### Quick Start

```bash
npm install
npm run dev
```

---
*ZeroGate — Engineered for Continuous Trust.*
