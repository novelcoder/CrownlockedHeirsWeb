export const GOOGLE_ANALYTICS_ID_PATTERN = /^G-[A-Z0-9]{10}$/;

export function validGoogleAnalyticsId(
  value: string | null | undefined,
): string | null {
  const candidate = value?.trim();
  return candidate && GOOGLE_ANALYTICS_ID_PATTERN.test(candidate)
    ? candidate
    : null;
}
