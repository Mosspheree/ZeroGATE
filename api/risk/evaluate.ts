import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { ip, ua, email } = req.body ?? {};

  if ((ip !== undefined && typeof ip !== 'string') ||
      (ua !== undefined && typeof ua !== 'string') ||
      (email !== undefined && typeof email !== 'string')) {
    res.status(400).json({ error: 'Invalid input' });
    return;
  }

  let score = 95;
  const flags: string[] = [];

  if (ip && (ip.startsWith('10.') || ip.startsWith('192.'))) {
    score -= 5;
    flags.push('INTERNAL_IP_RANGE');
  }

  if (ua && (ua.includes('MSIE') || ua.includes('Trident'))) {
    score -= 20;
    flags.push('LEGACY_BROWSER');
  }

  const hour = new Date().getHours();
  if (hour < 5 || hour > 23) {
    score -= 10;
    flags.push('OFF_HOURS_ACCESS');
  }

  const trustedDomain = process.env.TRUSTED_EMAIL_DOMAIN;
  if (trustedDomain && email && email.endsWith(`@${trustedDomain}`)) {
    score += 5;
  }

  const finalScore = Math.min(100, Math.max(0, score));

  let riskLevel = 'LOW';
  if (finalScore < 80) riskLevel = 'MEDIUM';
  if (finalScore < 50) riskLevel = 'HIGH';
  if (finalScore < 30) riskLevel = 'CRITICAL';

  res.status(200).json({
    trustScore: finalScore,
    riskLevel,
    flags,
    timestamp: new Date().toISOString(),
  });
}
