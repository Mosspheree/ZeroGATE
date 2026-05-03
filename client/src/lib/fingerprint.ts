export function getDeviceFingerprint(): string {
  const components = [
    navigator.userAgent,
    `${screen.width}x${screen.height}`,
    Intl.DateTimeFormat().resolvedOptions().timeZone,
    navigator.language,
    String(navigator.hardwareConcurrency ?? 0),
  ].join('|');

  let hash = 0;
  for (let i = 0; i < components.length; i++) {
    hash = Math.imul(31, hash) + components.charCodeAt(i) | 0;
  }
  return Math.abs(hash).toString(16);
}
