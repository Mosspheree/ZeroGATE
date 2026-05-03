/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const DIFFERENTIATORS = [
  {
    capability: "Protocol Support",
    okta: "OIDC, SAML",
    azure: "OIDC, SAML",
    zerogate: "OIDC, SAML, FIDO2, DPoP",
    highlight: true,
  },
  {
    capability: "Adaptive Auth",
    okta: "Rule-based",
    azure: "Conditional Access",
    zerogate: "ML risk scoring, real-time",
    highlight: true,
  },
  {
    capability: "Token Binding",
    okta: "None",
    azure: "CAE (partial)",
    zerogate: "DPoP + PoP, full binding",
    highlight: true,
  },
  {
    capability: "Session Continuity",
    okta: "None",
    azure: "CAE signals",
    zerogate: "40+ real-time signals",
    highlight: true,
  },
  {
    capability: "Deployment Model",
    okta: "SaaS only",
    azure: "SaaS + hybrid",
    zerogate: "Self-hosted, multi-cloud",
    highlight: false,
  },
  {
    capability: "P99 Latency",
    okta: "~120 ms",
    azure: "~90 ms",
    zerogate: "< 50 ms target",
    highlight: true,
  },
];

export const SLOS = [
  { metric: "Token issuance P50", target: "< 25 ms", notes: "Auth Plane, co-located Redis" },
  { metric: "Token issuance P99", target: "< 50 ms", notes: "Measured at load balancer egress" },
  { metric: "Risk score computation P99", target: "< 10 ms", notes: "LightGBM inference, feature cache" },
  { metric: "SAML assertion validation", target: "< 30 ms", notes: "xmlsec1, cached metadata" },
  { metric: "System availability (SLA)", target: "99.99%", notes: "Active-active, 3 AZs" },
];

export const ROADMAP = [
  { phase: "Phase 0", duration: "2 weeks", deliverable: "Threat model, ADRs, repository scaffold", milestone: "Repo live" },
  { phase: "Phase 1", duration: "4 weeks", deliverable: "Core OIDC/OAuth 2.1 Auth Plane in Go", milestone: "End-to-end login" },
  { phase: "Phase 2", duration: "3 weeks", deliverable: "SAML 2.0 SP + IdP façade, FIDO2/WebAuthn", milestone: "Multi-protocol demo" },
  { phase: "Phase 3", duration: "4 weeks", deliverable: "Risk Engine v1: LightGBM baseline, Kafka", milestone: "Risk score in prod" },
  { phase: "Phase 4", duration: "3 weeks", deliverable: "GNN-based identity graph, Behavior SDK", milestone: "Performance SLOs met" },
];
