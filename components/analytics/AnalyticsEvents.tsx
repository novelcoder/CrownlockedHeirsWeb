"use client";

import {
  type AnchorHTMLAttributes,
  type MouseEvent,
  useEffect,
  useRef,
} from "react";
import {
  type AnalyticsParameters,
  trackAnalyticsEvent,
} from "@/lib/analytics/client";
import { useAnalyticsConsent } from "./AnalyticsProvider";

export function AnalyticsView({
  eventName,
  parameters,
}: {
  eventName: string;
  parameters: AnalyticsParameters;
}) {
  const { consent } = useAnalyticsConsent();
  const sentForCurrentConsent = useRef(false);

  useEffect(() => {
    if (consent !== "granted") {
      sentForCurrentConsent.current = false;
      return;
    }

    if (sentForCurrentConsent.current) return;
    trackAnalyticsEvent(eventName, parameters);
    sentForCurrentConsent.current = true;
  }, [consent, eventName, parameters]);

  return null;
}

type AnalyticsLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  eventName: string;
  eventParameters: AnalyticsParameters;
};

export function AnalyticsLink({
  eventName,
  eventParameters,
  onClick,
  ...props
}: AnalyticsLinkProps) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    trackAnalyticsEvent(eventName, eventParameters);
    onClick?.(event);
  };

  return <a {...props} onClick={handleClick} />;
}
