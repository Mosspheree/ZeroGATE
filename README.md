# ZeroGate: Adaptive Identity & Security Dashboard

[![Auth: Firebase OIDC](https://img.shields.io/badge/Auth-Firebase_OIDC-orange)](https://firebase.google.com/)
[![Runtime: Node 22](https://img.shields.io/badge/Runtime-Node_22-green)](https://nodejs.org/)
[![Frontend: React](https://img.shields.io/badge/Frontend-React_19-blue)](https://react.dev/)

**ZeroGate** is a full-stack prototype of an adaptive identity security system inspired by zero-trust architectures.
It demonstrates how modern authentication, session tracking, and risk-based access decisions can be combined into a real-time security dashboard.

>  Note: Authentication and session management are implemented using Firebase.
> Risk scoring, telemetry streams, and incident events are simulated to demonstrate system design concepts.

---

## System Overview

ZeroGate explores a zero-trust identity model where authentication is not treated as a one-time event, but as a continuously evaluated session state.

The system is split into three main layers:

---

## 1. Identity Layer (Auth Plane)

Built using Firebase Authentication (OIDC-based flow).

* Google OAuth / Email login support
* Secure JWT-based session handling
* Firestore-based access rules (ABAC-style permissions)
* Protected routes enforced via authentication context

This layer handles all real user identity and session persistence.

---

## 2. Risk Simulation Engine (Backend Layer)

A Node.js service (`/server/server.ts`) simulates a risk evaluation pipeline.

It generates a dynamic risk score based on behavioral signals:

* GEO_VELOCITY → Detects unrealistic location changes
* CLIENT_FINGERPRINT → Simulated device consistency checks
* REPUTATION_CHECK → Mock IP reputation lookup
* BEHAVIORAL_PATTERNS → Simulated access timing anomalies

This module demonstrates how a real risk engine could integrate into an identity system.

---

## 3. Security Dashboard (Frontend Layer)

A React-based SOC-style interface that visualizes system state in real time.

Features:

* Active session monitoring dashboard
* Simulated global identity map
* Event stream visualization
* Session revocation UI (mocked behavior)

---

## Architecture

```
ZeroGate/
├── client/        # React dashboard UI
├── server/        # Node.js simulation API
├── firestore.rules
├── vite.config.ts
└── tsconfig.json
```

---

## Security & Design Notes

* Firebase Authentication handles real user login and session management
* Sensitive keys and environment files are excluded via `.gitignore`
* Express middleware includes standard security headers (helmet, cors)
* Risk scoring and telemetry are simulation-based for demonstration

---

## Getting Started

### Install dependencies

```bash
npm install
```

### Run development environment

```bash
npm run dev
```

### Build for production

```bash
npm run build
```

---

## Project Intent

This project demonstrates:

* Understanding of modern authentication systems (OIDC, JWT, Firebase)
* System design for zero-trust architectures
* Separation of identity, risk, and observability layers
* Full-stack integration in a security-focused application

---

## Architecture Decisions

* ADR-001: Firebase chosen for rapid authentication
* ADR-002: Separation of identity and risk logic for modular design
* ADR-003: Dashboard-first design for observability visualization

---

## Summary

ZeroGate is a full-stack prototype exploring adaptive authentication and real-time identity monitoring systems.

---
