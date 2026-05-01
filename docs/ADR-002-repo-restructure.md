# ADR-002: Monorepo Plane Separation

## Status
Accepted

## Context
The initial prototype had a flat structure which confounded frontend concerns with backend logic. To represent the "Security Plane" architecture described in the product specs, we need physical separation.

## Decision
We moved the stack into a semi-monorepo structure:
- `/client`: React-based identity portal and telemetry dashboard.
- `/server`: Node.js Express risk evaluation engine & backend-for-frontend (BFF).
- `/docs`: Architecture Decision Records and design specifications.

## Consequences
- **Build Complexity:** Root `package.json` now acts as an orchestrator.
- **Improved Security:** Keeps backend-only logic (admin SDKs) physically separated from browser-bound code.
