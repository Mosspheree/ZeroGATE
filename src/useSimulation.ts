/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { Session, TelemetryPoint, RiskLevel } from './types';

const INITIAL_SESSIONS: Session[] = [
  { id: '1', user: 'Alex Rivera', email: 'alex@mossphere.com', source: 'macOS / Chrome 124', ip: '192.168.1.1', trustScore: 98, status: 'ACTIVE', lastSeen: 'Just now', riskLevel: RiskLevel.LOW },
  { id: '2', user: 'Sarah Chen', email: 'sarah.c@dev.io', source: 'Ubuntu / Firefox 125', ip: '45.12.33.1', trustScore: 88, status: 'ACTIVE', lastSeen: '2m ago', riskLevel: RiskLevel.LOW },
  { id: '3', user: 'Marcus Thorne', email: 'marcus@corp-sec.com', source: 'Windows / Edge 123', ip: '12.88.2.3', trustScore: 42, status: 'STEP_UP_PENDING', lastSeen: '1m ago', riskLevel: RiskLevel.HIGH },
  { id: '4', user: 'Jordan Blake', email: 'j.blake@cloud.net', source: 'iPhone / Safari', ip: '92.11.22.44', trustScore: 92, status: 'ACTIVE', lastSeen: 'Just now', riskLevel: RiskLevel.LOW },
];

export function useSimulation() {
  const [sessions, setSessions] = useState<Session[]>(INITIAL_SESSIONS);
  const [telemetry, setTelemetry] = useState<TelemetryPoint[]>([]);
  const telemetryRef = useRef<TelemetryPoint[]>([]);

  // Telemetry generator
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
      
      const newPoint: TelemetryPoint = {
        time: timeStr,
        requests: Math.floor(Math.random() * 200) + 400,
        avgLatency: Math.floor(Math.random() * 10) + 38,
        riskEvents: Math.random() > 0.8 ? 1 : 0
      };

      telemetryRef.current = [...telemetryRef.current, newPoint].slice(-40);
      setTelemetry([...telemetryRef.current]);

      // Randomly update trust scores to simulate drift
      setSessions(prev => prev.map(s => {
        if (s.status === 'REVOKED') return s;
        
        // Random drift: +/- 1-2 points
        const drift = Math.floor(Math.random() * 5) - 2;
        let newScore = Math.min(100, Math.max(10, s.trustScore + drift));
        
        // Occasional risk spike
        if (Math.random() > 0.98) {
           newScore = Math.max(10, newScore - 40);
        }

        let newRisk = RiskLevel.LOW;
        if (newScore < 80) newRisk = RiskLevel.MEDIUM;
        if (newScore < 50) newRisk = RiskLevel.HIGH;
        if (newScore < 30) newRisk = RiskLevel.CRITICAL;

        let newStatus = s.status;
        if (newScore < 40 && s.status === 'ACTIVE') newStatus = 'STEP_UP_PENDING';
        if (newScore > 60 && s.status === 'STEP_UP_PENDING') newStatus = 'ACTIVE';

        return { ...s, trustScore: newScore, riskLevel: newRisk, status: newStatus };
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const revokeSession = (id: string) => {
    setSessions(prev => prev.map(s => s.id === id ? { ...s, status: 'REVOKED' as const, trustScore: 0, riskLevel: RiskLevel.CRITICAL } : s));
  };

  return { sessions, telemetry, revokeSession };
}
