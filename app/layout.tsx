import type { Metadata } from "next";
import { AnalyticsProvider } from "@/components/analytics/AnalyticsProvider";
import { validGoogleAnalyticsId } from "@/lib/analytics/config";
import "./globals.css";

export const metadata: Metadata = {
  title: "Crownlocked Heirs | Jamie McFarlane",
  description:
    "Enter Bjargfold in Crownlocked Heirs, an interconnected LitRPG progression-fantasy series by Jamie McFarlane.",
  icons: {
    icon: "/drakon-prince.jpg",
    shortcut: "/drakon-prince.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const googleAnalyticsId = validGoogleAnalyticsId(
    process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID,
  );

  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <AnalyticsProvider measurementId={googleAnalyticsId}>
          {children}
        </AnalyticsProvider>
      </body>
    </html>
  );
}
