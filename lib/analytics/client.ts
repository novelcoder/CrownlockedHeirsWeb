"use client";

export const ANALYTICS_CONSENT_COOKIE = "crownlocked_analytics_consent";

export type AnalyticsConsent = "granted" | "denied";

type AnalyticsValue =
  | string
  | number
  | boolean
  | readonly Record<string, unknown>[];

export type AnalyticsParameters = Record<
  string,
  AnalyticsValue | null | undefined
>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const GOOGLE_TAG_SCRIPT_ID = "google-analytics-tag";
const DENIED_STORAGE = {
  ad_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
  analytics_storage: "denied",
} as const;

let analyticsEnabled = false;
let initializedMeasurementId: string | null = null;
let lastTrackedLocation: string | null = null;

function windowFlags() {
  return window as unknown as Record<string, unknown>;
}

function getGtag() {
  window.dataLayer ??= [];

  if (!window.gtag) {
    window.gtag = function () {
      window.dataLayer?.push(arguments);
    };
  }

  return window.gtag;
}

function secureCookieAttribute() {
  return window.location.protocol === "https:" ? "; Secure" : "";
}

function sanitizedPageUrl(value: string) {
  if (!value) return null;

  try {
    const url = new URL(value, window.location.origin);
    return `${url.origin}${url.pathname}`;
  } catch {
    return null;
  }
}

function analyticsCookieDomains() {
  const hostname = window.location.hostname;
  if (
    !hostname ||
    hostname === "localhost" ||
    /^\d+(?:\.\d+){3}$/.test(hostname)
  ) {
    return [];
  }

  const labels = hostname.split(".");
  const domains = new Set<string>([hostname]);

  for (let index = 1; index < labels.length - 1; index += 1) {
    domains.add(labels.slice(index).join("."));
  }

  return [...domains];
}

export function readAnalyticsConsent(): AnalyticsConsent | null {
  if (typeof document === "undefined") return null;

  const prefix = `${ANALYTICS_CONSENT_COOKIE}=`;
  const cookie = document.cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(prefix));

  const value = cookie?.slice(prefix.length);
  return value === "granted" || value === "denied" ? value : null;
}

export function writeAnalyticsConsent(value: AnalyticsConsent) {
  const expires = new Date();
  expires.setMonth(expires.getMonth() + 6);

  document.cookie =
    [
      `${ANALYTICS_CONSENT_COOKIE}=${value}`,
      `Expires=${expires.toUTCString()}`,
      "Path=/",
      "SameSite=Lax",
    ].join("; ") + secureCookieAttribute();
}

export function removeGoogleAnalyticsCookies() {
  if (typeof document === "undefined") return;

  const names = document.cookie
    .split(";")
    .map((part) => part.trim().split("=")[0])
    .filter((name) => name === "_ga" || name.startsWith("_ga_"));

  const expiration = `=; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Max-Age=0; Path=/; SameSite=Lax${secureCookieAttribute()}`;

  for (const name of new Set(names)) {
    document.cookie = `${name}${expiration}`;

    for (const domain of analyticsCookieDomains()) {
      document.cookie = `${name}${expiration}; Domain=${domain}`;
      document.cookie = `${name}${expiration}; Domain=.${domain}`;
    }
  }
}

export function enableGoogleAnalytics(measurementId: string) {
  if (typeof window === "undefined" || typeof document === "undefined") return;
  if (analyticsEnabled && initializedMeasurementId === measurementId) return;

  try {
    const gtag = getGtag();
    const isFirstInitialization = initializedMeasurementId !== measurementId;

    windowFlags()[`ga-disable-${measurementId}`] = false;

    if (isFirstInitialization) {
      gtag("consent", "default", DENIED_STORAGE);
    }

    gtag("set", "ads_data_redaction", true);
    gtag("set", "allow_google_signals", false);
    gtag("set", "allow_ad_personalization_signals", false);
    gtag("consent", "update", {
      ...DENIED_STORAGE,
      analytics_storage: "granted",
    });

    if (!document.getElementById(GOOGLE_TAG_SCRIPT_ID)) {
      const script = document.createElement("script");
      script.id = GOOGLE_TAG_SCRIPT_ID;
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
      document.head.appendChild(script);
    }

    if (isFirstInitialization) {
      gtag("js", new Date());
      gtag("config", measurementId, {
        allow_ad_personalization_signals: false,
        allow_google_signals: false,
        send_page_view: false,
      });
      initializedMeasurementId = measurementId;
    }

    analyticsEnabled = true;
  } catch {
    analyticsEnabled = false;
  }
}

export function disableGoogleAnalytics(measurementId: string) {
  if (typeof window === "undefined") return;

  try {
    analyticsEnabled = false;
    lastTrackedLocation = null;
    windowFlags()[`ga-disable-${measurementId}`] = true;

    window.gtag?.("consent", "update", DENIED_STORAGE);
    removeGoogleAnalyticsCookies();
  } catch {
    // Analytics must never interfere with the website.
  }
}

export function trackPageView(pathname: string) {
  if (!analyticsEnabled || typeof window === "undefined" || !window.gtag)
    return;

  try {
    const pageLocation =
      sanitizedPageUrl(pathname) ?? `${window.location.origin}/`;
    if (pageLocation === lastTrackedLocation) return;

    const pageReferrer =
      lastTrackedLocation ?? sanitizedPageUrl(document.referrer);
    window.gtag("event", "page_view", {
      page_location: pageLocation,
      page_title: document.title,
      ...(pageReferrer ? { page_referrer: pageReferrer } : {}),
    });
    lastTrackedLocation = pageLocation;
  } catch {
    // Analytics must never interfere with navigation.
  }
}

export function trackAnalyticsEvent(
  eventName: string,
  parameters: AnalyticsParameters = {},
) {
  if (!analyticsEnabled || typeof window === "undefined" || !window.gtag)
    return;

  try {
    window.gtag("event", eventName, parameters);
  } catch {
    // Analytics must never interfere with the visitor's action.
  }
}
