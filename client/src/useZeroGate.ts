import { useState, useEffect } from 'react';
import { Session, TelemetryPoint } from './types';
import { ZeroGateSDK } from './services/zerogate';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './lib/firebase';

export function useZeroGate() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [telemetry, setTelemetry] = useState<TelemetryPoint[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsLoading(false);
    });

    return () => unsubAuth();
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const isAdmin = currentUser?.email === import.meta.env.VITE_ADMIN_EMAIL;
    
    const unsubSessions = ZeroGateSDK.subscribeToSessions(
      (data) => setSessions(data),
      currentUser?.uid,
      isAdmin
    );

    const fetchTelemetry = async () => {
      const data = await ZeroGateSDK.getTelemetry();
      setTelemetry(data);
    };

    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 10000);

    return () => {
      unsubSessions();
      clearInterval(interval);
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
    revokeSession,
    createSession,
    currentUser,
    isLoading
  };
}
