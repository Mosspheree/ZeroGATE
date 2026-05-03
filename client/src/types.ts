/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum RiskLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export type RiskAction = 'STEP_UP' | 'REVOKE' | null;

export interface Session {
  id: string;
  userId: string;
  user: string;
  email: string;
  source: string;
  ip: string;
  trustScore: number;
  status: 'ACTIVE' | 'REVOKED' | 'STEP_UP_PENDING';
  lastSeen: string;
  loginTimestamp: string;
  deviceFingerprint: string;
  riskLevel: RiskLevel;
}

export interface TelemetryPoint {
  time: string;
  requests: number;
  avgLatency: number;
  riskEvents: number;
}

export interface TelemetryEvent {
  id?: string;
  time: string;
  type: 'LOGIN' | 'REVOKE' | 'STEP_UP' | 'RISK_UPDATE';
  userId: string;
  sessionId: string;
  details: string;
  riskLevel: RiskLevel;
  trustScore: number;
}
