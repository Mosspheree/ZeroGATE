import type { VercelRequest, VercelResponse } from '@vercel/node';
import type { RiskAction } from '../../client/src/types';

interface EvaluateBody {
  ip?: string;
  ua?: string;
  email?: string;
  sessionCount?: number;
  previousDeviceFingerprint?: string;
  deviceFingerprint?: string;
  lastIp?: string;
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const body = req.body as EvaluateBody;
  if (body === null || typeof body !== 'object') {
    res.status(400).json({ error: 'Invalid body' });
    return;
  }

  const {
    ua,
    email,
    sessionCount = 0,
    previousDeviceFingerprint,
    deviceFingerprint,
    lastIp,
  } = body;

  // Server resolves the real client IP — ignore any client-supplied ip field
  const clientIp =
    (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ??
    req.socket?.remoteAddress ??
    '';

  let score = 95;
  const flags: string[] = [];

  // Internal / private IP range
  if (clientIp && (clientIp.startsWith('10.') || clientIp.startsWith('192.168.') || clientIp.startsWith('172.'))) {
    score -= 5;
    flags.push('INTERNAL_IP_RANGE');
  }

  // Legacy or headless browser
  if (ua) {
    if (ua.includes('MSIE') || ua.includes('Trident')) {
      score -= 25;
      flags.push('LEGACY_BROWSER');
    }
    if (ua.toLowerCase().includes('headless') || ua.toLowerCase().includes('phantomjs')) {
      score -= 40;
      flags.push('HEADLESS_BROWSER');
    }
  }

  // Off-hours access (midnight–5 AM UTC)
  const hourUtc = new Date().getUTCHours();
  if (hourUtc >= 0 && hourUtc < 5) {
    score -= 10;
    flags.push('OFF_HOURS_ACCESS');
  }

  // High login frequency (> 5 sessions signals automated/scripted access)
  if (sessionCount > 5) {
    score -= 20;
    flags.push('HIGH_LOGIN_FREQUENCY');
  }

  // Device fingerprint mismatch against last known device
  if (previousDeviceFingerprint && deviceFingerprint && previousDeviceFingerprint !== deviceFingerprint) {
    score -= 30;
    flags.push('DEVICE_FINGERPRINT_MISMATCH');
  }

  // IP change from last session
  if (lastIp && clientIp && lastIp !== clientIp && lastIp !== 'detected') {
    score -= 15;
    flags.push('IP_CHANGE_DETECTED');
  }

  // Trusted email domain boost
  const trustedDomain = process.env.TRUSTED_EMAIL_DOMAIN;
  if (trustedDomain && email && typeof email === 'string' && email.endsWith(`@${trustedDomain}`)) {
    score += 5;
  }

  const trustScore = Math.min(100, Math.max(0, score));

  let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';
  if (trustScore < 80) riskLevel = 'MEDIUM';
  if (trustScore < 50) riskLevel = 'HIGH';
  if (trustScore < 30) riskLevel = 'CRITICAL';

  // Enforcement — decided server-side
  let action: RiskAction = null;
  if (trustScore < 20) action = 'REVOKE';
  else if (trustScore < 40) action = 'STEP_UP';

  res.status(200).json({
    trustScore,
    riskLevel,
    flags,
    action,
    resolvedIp: clientIp,
    timestamp: new Date().toISOString(),
  });
}
