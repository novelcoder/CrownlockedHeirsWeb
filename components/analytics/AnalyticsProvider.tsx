"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  type AnalyticsConsent,
  disableGoogleAnalytics,
  enableGoogleAnalytics,
  readAnalyticsConsent,
  trackPageView,
  writeAnalyticsConsent,
} from "@/lib/analytics/client";

type ConsentState = AnalyticsConsent | "unset" | "loading";

type AnalyticsConsentContextValue = {
  available: boolean;
  consent: ConsentState;
  openSettings: () => void;
};

const AnalyticsConsentContext = createContext<AnalyticsConsentContextValue>({
  available: false,
  consent: "loading",
  openSettings: () => undefined,
});

function RouteAnalytics({ consent }: { consent: ConsentState }) {
  const pathname = usePathname();

  useEffect(() => {
    if (consent === "granted") trackPageView(pathname);
  }, [consent, pathname]);

  return null;
}

export function AnalyticsProvider({
  children,
  measurementId,
}: {
  children: ReactNode;
  measurementId: string | null;
}) {
  const [consent, setConsent] = useState<ConsentState>("loading");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const available = Boolean(measurementId);

  useEffect(() => {
    if (!measurementId) return;

    const timer = window.setTimeout(() => {
      const savedConsent = readAnalyticsConsent();
      if (savedConsent === "granted") enableGoogleAnalytics(measurementId);
      if (savedConsent === "denied") disableGoogleAnalytics(measurementId);
      setConsent(savedConsent ?? "unset");
    }, 0);

    return () => window.clearTimeout(timer);
  }, [measurementId]);

  const openSettings = useCallback(() => {
    if (measurementId) setSettingsOpen(true);
  }, [measurementId]);

  const choose = useCallback(
    (choice: AnalyticsConsent) => {
      if (!measurementId) return;

      writeAnalyticsConsent(choice);
      if (choice === "granted") enableGoogleAnalytics(measurementId);
      if (choice === "denied") disableGoogleAnalytics(measurementId);
      setConsent(choice);
      setSettingsOpen(false);
    },
    [measurementId],
  );

  const contextValue = useMemo(
    () => ({ available, consent, openSettings }),
    [available, consent, openSettings],
  );
  const panelOpen = available && (consent === "unset" || settingsOpen);

  return (
    <AnalyticsConsentContext.Provider value={contextValue}>
      {measurementId ? <RouteAnalytics consent={consent} /> : null}
      {children}

      {panelOpen ? (
        <aside
          aria-labelledby="analytics-consent-title"
          aria-live="polite"
          className="consent-panel"
          role="dialog"
        >
          <div className="consent-copy">
            <p className="consent-kicker">Privacy choice</p>
            <h2 id="analytics-consent-title">Optional analytics</h2>
            <p>
              Allow optional usage measurement to help improve this site, or
              decline with no effect on site functionality. Nothing is sent to
              Google Analytics unless you allow it.
            </p>
            <Link href="/privacy">Privacy &amp; Cookies</Link>
          </div>
          <div className="consent-actions">
            <button type="button" onClick={() => choose("denied")}>
              Decline
            </button>
            <button type="button" onClick={() => choose("granted")}>
              Allow analytics
            </button>
          </div>
          {consent !== "unset" ? (
            <button
              aria-label="Close cookie settings"
              className="consent-close"
              onClick={() => setSettingsOpen(false)}
              type="button"
            >
              ×
            </button>
          ) : null}
        </aside>
      ) : null}
    </AnalyticsConsentContext.Provider>
  );
}

export function useAnalyticsConsent() {
  return useContext(AnalyticsConsentContext);
}
