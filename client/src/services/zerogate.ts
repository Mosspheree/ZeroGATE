import {
  collection,
  doc,
  setDoc,
  getDocs,
  query,
  where,
  onSnapshot,
  updateDoc,
  orderBy,
  limit,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { Session, RiskLevel, TelemetryPoint, TelemetryEvent, RiskAction } from '../types';
import { getDeviceFingerprint } from '../lib/fingerprint';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  LIST = 'list',
  WRITE = 'write',
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  console.error('Firestore Error:', {
    error: error instanceof Error ? error.message : String(error),
    operationType,
    path,
    userId: auth.currentUser?.uid,
  });
  throw new Error(error instanceof Error ? error.message : String(error));
}

async function writeEvent(event: Omit<TelemetryEvent, 'id'>) {
  try {
    await addDoc(collection(db, 'events'), {
      ...event,
      createdAt: serverTimestamp(),
    });
  } catch {
    // Events are best-effort — do not crash the auth flow
  }
}

export class ZeroGateSDK {
  static async evaluateRisk(payload: {
    email: string;
    ua: string;
    sessionCount: number;
    deviceFingerprint: string;
    previousDeviceFingerprint?: string;
    lastIp?: string;
  }) {
    const response = await fetch('/api/risk/evaluate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error('Risk evaluation request failed');
    return response.json() as Promise<{
      trustScore: number;
      riskLevel: string;
      flags: string[];
      action: RiskAction;
      resolvedIp: string;
      timestamp: string;
    }>;
  }

  static async registerSession(userId: string, email: string, displayName: string) {
    // Gather previous session context for cross-session signals
    let sessionCount = 0;
    let previousDeviceFingerprint: string | undefined;
    let lastIp: string | undefined;

    try {
      const prevSnap = await getDocs(
        query(collection(db, 'sessions'), where('userId', '==', userId))
      );
      sessionCount = prevSnap.size;
      if (!prevSnap.empty) {
        const sorted = prevSnap.docs
          .map(d => d.data() as Session)
          .sort((a, b) => new Date(b.lastSeen).getTime() - new Date(a.lastSeen).getTime());
        previousDeviceFingerprint = sorted[0]?.deviceFingerprint;
        lastIp = sorted[0]?.ip;
      }
    } catch {
      // Non-fatal — proceed with what we have
    }

    const deviceFingerprint = getDeviceFingerprint();
    const riskData = await this.evaluateRisk({
      email,
      ua: navigator.userAgent,
      sessionCount,
      deviceFingerprint,
      previousDeviceFingerprint,
      lastIp,
    });

    // Enforcement: server decided this session should be revoked
    if (riskData.action === 'REVOKE') {
      await writeEvent({
        time: riskData.timestamp,
        type: 'REVOKE',
        userId,
        sessionId: 'pre-session',
        details: `CRIT: Session blocked — ${riskData.flags.join(', ') || 'risk threshold exceeded'}`,
        riskLevel: RiskLevel.CRITICAL,
        trustScore: riskData.trustScore,
      });
      throw new Error('SESSION_REVOKED_BY_RISK_ENGINE');
    }

    const sessionId = `sess_${Math.random().toString(36).substring(2, 11)}`;
    const now = new Date().toISOString();
    const sessionData: Session = {
      id: sessionId,
      userId,
      user: displayName,
      email,
      source: navigator.userAgent,
      ip: riskData.resolvedIp,
      trustScore: riskData.trustScore,
      riskLevel: riskData.riskLevel as RiskLevel,
      status: riskData.action === 'STEP_UP' ? 'STEP_UP_PENDING' : 'ACTIVE',
      lastSeen: now,
      loginTimestamp: now,
      deviceFingerprint,
    };

    try {
      await setDoc(doc(db, 'sessions', sessionId), {
        ...sessionData,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `sessions/${sessionId}`);
    }

    const eventType = riskData.action === 'STEP_UP' ? 'STEP_UP' : 'LOGIN';
    const eventDetails =
      riskData.action === 'STEP_UP'
        ? `WARN: Step-up required — ${riskData.flags.join(', ')}`
        : `INFO: Login verified — trust ${riskData.trustScore}%`;

    await writeEvent({
      time: now,
      type: eventType,
      userId,
      sessionId,
      details: eventDetails,
      riskLevel: riskData.riskLevel as RiskLevel,
      trustScore: riskData.trustScore,
    });

    return sessionData;
  }

  static subscribeToSessions(callback: (sessions: Session[]) => void, userId?: string, isAdmin?: boolean) {
    let q;
    if (isAdmin) {
      q = query(collection(db, 'sessions'));
    } else if (userId) {
      q = query(collection(db, 'sessions'), where('userId', '==', userId));
    } else {
      callback([]);
      return () => {};
    }

    return onSnapshot(q, (snapshot) => {
      callback(snapshot.docs.map(d => d.data() as Session));
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'sessions');
    });
  }

  static async revokeSession(sessionId: string) {
    const now = new Date().toISOString();
    try {
      await updateDoc(doc(db, 'sessions', sessionId), {
        status: 'REVOKED',
        trustScore: 0,
        riskLevel: RiskLevel.CRITICAL,
        lastSeen: now,
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `sessions/${sessionId}`);
    }

    const userId = auth.currentUser?.uid ?? 'unknown';
    await writeEvent({
      time: now,
      type: 'REVOKE',
      userId,
      sessionId,
      details: 'CRIT: Forced session revocation via control plane',
      riskLevel: RiskLevel.CRITICAL,
      trustScore: 0,
    });
  }

  static subscribeToEvents(callback: (events: TelemetryEvent[]) => void) {
    const q = query(
      collection(db, 'events'),
      orderBy('time', 'desc'),
      limit(100)
    );

    return onSnapshot(q, (snapshot) => {
      const events = snapshot.docs.map(d => ({
        id: d.id,
        ...d.data(),
      })) as TelemetryEvent[];
      callback(events);
    }, () => {
      callback([]);
    });
  }

  static computeTelemetry(events: TelemetryEvent[]): TelemetryPoint[] {
    const bucketMs = 5 * 60 * 1000;
    const bucketCount = 20;
    const now = Date.now();

    return Array.from({ length: bucketCount }).map((_, i) => {
      const bucketEnd = now - (bucketCount - 1 - i) * bucketMs;
      const bucketStart = bucketEnd - bucketMs;

      const inBucket = events.filter(e => {
        const t = new Date(e.time).getTime();
        return t >= bucketStart && t < bucketEnd;
      });

      return {
        time: new Date(bucketEnd).toISOString(),
        requests: inBucket.filter(e => e.type === 'LOGIN').length,
        avgLatency: 38,
        riskEvents: inBucket.filter(e => e.type === 'REVOKE' || e.type === 'STEP_UP').length,
      };
    });
  }
}
