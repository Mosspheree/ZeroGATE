# ZeroGate

[![Auth: Firebase OIDC](https://img.shields.io/badge/Auth-Firebase_OIDC-orange)](https://firebase.google.com/)
[![Runtime: Node 22](https://img.shields.io/badge/Runtime-Node_22-green)](https://nodejs.org/)
[![Deploy: Vercel](https://img.shields.io/badge/Deploy-Vercel-black)](https://vercel.com/)

A full-stack security dashboard implementing **Continuous Adaptive Authentication (CAA)**. Users authenticate via Google (Firebase), sessions are persisted in Firestore, and every login is evaluated by a server-side rule-based risk engine that can step up or revoke sessions in real time.

---

## Architecture

```
client/           React 19 + Vite — identity portal & SOC dashboard
  src/
    components/   Dashboard, charts, modals
    lib/          Firebase client, device fingerprinting
    services/     ZeroGate SDK — Firestore reads/writes, risk API calls
    useZeroGate   React hook — session + event subscriptions
server/           Express dev server (local only)
api/              Vercel serverless functions (production)
  risk/evaluate   Rule-based risk engine
```

### Data Flow

```
Browser → Google OAuth → Firebase Auth
       → /api/risk/evaluate (server resolves real IP)
       → risk score + enforcement action returned
       → session written to Firestore (or blocked)
       → event written to Firestore events collection
       → dashboard subscribes via Firestore onSnapshot
```

---

## Authentication

Firebase Authentication with Google OIDC. Sessions are stored in the `sessions` Firestore collection with:

- `userId`, `email`, `user` — identity
- `loginTimestamp`, `lastSeen` — timing
- `ip` — resolved server-side by the risk API
- `deviceFingerprint` — hash of UA, screen resolution, timezone, language
- `trustScore`, `riskLevel`, `status` — risk state

---

## Risk Engine

All risk computation runs server-side at `api/risk/evaluate.ts`. The client never computes or overrides risk values.

**Signals evaluated per login:**

| Signal | Score Impact |
|---|---|
| Legacy / headless browser | −25 to −40 |
| Off-hours access (00:00–05:00 UTC) | −10 |
| Internal / private IP range | −5 |
| High login frequency (> 5 sessions) | −20 |
| Device fingerprint mismatch | −30 |
| IP change from last session | −15 |
| Trusted email domain | +5 |

**Enforcement (server-decided):**

- `trustScore < 40` → `STEP_UP` — session created as `STEP_UP_PENDING`, access restricted
- `trustScore < 20` → `REVOKE` — session blocked before creation, event logged

---

## Real-Time Events

Every login, step-up, and revocation writes an event to the `events` Firestore collection. The SOC dashboard subscribes to this collection via `onSnapshot` — no polling, no mock data.

The telemetry chart aggregates events into 5-minute buckets to show login volume and risk intercepts over time.

---

## Local Development

```bash
npm install
cp .env.example .env   # fill in your Firebase credentials
npm run dev            # starts Express + Vite on http://localhost:3000
```

---

## Environment Variables

See `.env.example` for the full list. Required variables:

| Variable | Where |
|---|---|
| `VITE_FIREBASE_*` | Firebase Console → Project Settings → Your Apps |
| `VITE_ADMIN_EMAIL` | Email address that gets admin dashboard access |
| `FIREBASE_PROJECT_ID` | Firebase project ID (server-side) |
| `TRUSTED_EMAIL_DOMAIN` | Optional — email domain that receives a trust boost |

---

## Deployment

Deployed on Vercel as a static Vite build with serverless API functions under `api/`. Push to `main` triggers an automatic production deploy.

**After deploying a new domain, add it to Firebase Console → Authentication → Settings → Authorized domains.**

---

## Firestore Collections

| Collection | Purpose |
|---|---|
| `sessions` | One document per login session |
| `events` | Append-only event log (login, revoke, step-up) |
