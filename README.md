# ZeroGate | Universal Adaptive SSO Platform

[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Protocol](https://img.shields.io/badge/Protocol-OIDC%202.1%20%7C%20SAML-blue)](https://openid.net/)
[![Security](https://img.shields.io/badge/Security-Zero%20Trust-indigo)](https://en.wikipedia.org/wiki/Zero_trust_security_model)

**ZeroGate** is a next-generation, open-source Single Sign-On (SSO) platform engineered around **Continuous Adaptive Authentication (CAA)**. It eliminates the concept of implicit trust once identity is established, achieving a true Zero Trust posture through real-time ML risk-scoring and cryptographically bound sessions.

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
5.  **Admin Portal (React):** Real-time telemetry dashboard and policy editor with dry-run mode.

## 🛡️ Key Features

- **Passkey-First:** FIDO2/WebAuthn is the primary factor; passwords are recovery-only.
- **DPoP Alignment:** Protects against session hijacking by making stolen tokens unusable on attacker machines.
- **Behavioral Biometrics:** Analyzes keystroke dynamics and movement entropy to detect account takeovers.
- **Universal Protocol Bridge:** Provides a SAML 2.0 IdP facade for legacy apps while backing them with modern OIDC security.

## 📊 Performance Targets

| Metric | Target | Notes |
| :--- | :--- | :--- |
| Token Issuance P99 | < 50 ms | Measured at load balancer egress |
| Risk Score P99 | < 10 ms | LightGBM inference + feature cache |
| System Availability | 99.99% | Active-active across 3 Availability Zones |
| Sustained Throughput | 100k TPS | Horizontally scalable architecture |

## 🛠️ Development Setup

The project is built with a modern stack:
- **Frontend:** React 19, TypeScript, Tailwind CSS 4, Motion
- **Visuals:** Recharts for telemetry, Lucide for iconography
- **State:** Custom simulation hooks for real-time risk demonstration

### Installation

```bash
npm install
npm run dev
```

### Build

```bash
npm run build
```

## 📜 License

Distributed under the Apache 2.0 License. See `LICENSE` for more information.

---
*ZeroGate — Engineered for Continuous Trust.*
