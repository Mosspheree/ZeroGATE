import { useState, useEffect } from 'react';
import { Session, TelemetryPoint, TelemetryEvent } from './types';
import { ZeroGateSDK } from './services/zerogate';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './lib/firebase';

export function useZeroGate() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [telemetry, setTelemetry] = useState<TelemetryPoint[]>([]);
  const [events, setEvents] = useState<TelemetryEvent[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsLoading(false);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const isAdmin = currentUser?.email === import.meta.env.VITE_ADMIN_EMAIL;

    const unsubSessions = ZeroGateSDK.subscribeToSessions(
      setSessions,
      currentUser?.uid,
      isAdmin
    );

    const unsubEvents = ZeroGateSDK.subscribeToEvents((incoming) => {
      setEvents(incoming);
      setTelemetry(ZeroGateSDK.computeTelemetry(incoming));
    });

    return () => {
      unsubSessions();
      unsubEvents();
    };
  }, [currentUser, isLoading]);

  const revokeSession = async (id: string) => {
    await ZeroGateSDK.revokeSession(id);
  };

  const createSession = async () => {
    if (currentUser) {
      return await ZeroGateSDK.registerSession(
        currentUser.uid,
        currentUser.email || '',
        currentUser.displayName || 'Anonymous User'
      );
    }
  };

  return {
    sessions,
    telemetry,
    events,
    revokeSession,
    createSession,
    currentUser,
    isLoading,
  };
}
