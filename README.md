# ZeroGate | Universal Adaptive SSO Platform

[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Protocol](https://img.shields.io/badge/Protocol-OIDC%202.1%20%7C%20SAML-blue)](https://openid.net/)
[![Security](https://img.shields.io/badge/Security-Zero%20Trust-indigo)](https://en.wikipedia.org/wiki/Zero_trust_security_model)

**ZeroGate** is a next-generation, high-fidelity security platform prototype engineered around **Continuous Adaptive Authentication (CAA)**. It demonstrates a future where identity is not a static state, but a dynamic trust score influenced by real-time behavioral and environmental telemetry.

---

## 🎮 Interactive Features

This repository contains a production-grade frontend implementation of the ZeroGate platform, featuring:

### 1. Control Plane (Admin Dashboard)
A high-density security operations center (SOC) view featuring:
- **Live Telemetry Stream:** Real-time throughput and request monitoring using `recharts`.
- **Global Topology Map:** SVG-based network visualization showing node health and traffic patterns across global regions.
- **Neural Trust Index:** A simulated risk engine that calculates session trust scores based on anomaly detection.
- **Session Fabric:** Interactive management of active identity sessions with one-click revocation.

### 2. Adaptive Trust Simulation (Live Demo)
A functional demonstration of the "End-User" experience:
- **Persona Toggling:** Ability to switch between a *Verified Corporate Subject* and an *Unknown Threat*.
- **Cryptographic Binding:** Visual demonstration of DPoP (RFC 9449) token issuance and device-level attestation.
- **Real-Time Rejection:** Witness the Neural Gateway instantly revoke access when the risk engine detects attacker-like fingerprints.

### 3. Technical Deep Dive
An on-page architectural overview including:
- **Protocol Insights:** Breakdown of short-lived Proof-of-Possession (PoP) tokens.
- **Performance Benchmarks:** Documented latency targets for token introspection and policy evaluation.
- **Code Schema:** Interactive code blocks showing internal DPoP proof structures.

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
