# ADR-001: Selection of Firebase for Identity & Persistence

## Status
Accepted

## Context
ZeroGate requires a robust Identity Provider (IdP) and a real-time persistence layer to demonstrate Continuous Adaptive Authentication (CAA). We needed a solution that provides:
1. OIDC-compliant authentication.
2. Real-time data synchronization for the Control Plane (SOC).
3. Scalable document storage for session metadata.

## Decision
We chose **Firebase (GCP)** for the following reasons:
- **Instant OIDC:** Firebase Auth allows us to implement a real-time Google OIDC flow without managing a custom OIDC server (like Hydra or Keycloak) in the early prototype phase.
- **Real-time Engine:** Firestore's listener protocol (`onSnapshot`) is perfect for our "Live Session Fabric" dashboard, allowing it to reflect security events (like revocations) globally under 200ms.
- **Security Rules:** Firebase's domain-specific language for security allows us to enforce Zero Trust principles (Identity + Verfied Email) directly at the database edge.

## Consequences
- **Vendor Lock-in:** We are tied to GCP/Firebase for the persistence layer.
- **Latency:** DB operations are off-site, though we mitigate this with local-first optimistic updates in the SDK.
