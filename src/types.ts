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

export interface Session {
  id: string;
  user: string;
  email: string;
  source: string;
  ip: string;
  trustScore: number;
  status: 'ACTIVE' | 'REVOKED' | 'STEP_UP_PENDING';
  lastSeen: string;
  riskLevel: RiskLevel;
}

export interface TelemetryPoint {
  time: string;
  requests: number;
  avgLatency: number;
  riskEvents: number;
}
