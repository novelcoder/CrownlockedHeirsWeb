"use client";

import { useAnalyticsConsent } from "./analytics/AnalyticsProvider";

export function CookieSettingsButton() {
  const { available, openSettings } = useAnalyticsConsent();
  if (!available) return null;

  return (
    <button className="footer-link" onClick={openSettings} type="button">
      Cookie settings
    </button>
  );
}
