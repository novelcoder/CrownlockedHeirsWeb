import type { Metadata } from "next";
import Link from "next/link";
import { CookieSettingsButton } from "@/components/CookieSettingsButton";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Privacy & Cookies | Crownlocked Heirs",
  description:
    "Privacy and cookie information for the Crownlocked Heirs website.",
};

export default function PrivacyPage() {
  return (
    <main className="legal-page" id="top">
      <header className="site-header shell">
        <Link className="presenter" href="/">
          JAMIE McFARLANE PRESENTS
        </Link>
      </header>

      <article className="legal-content shell">
        <p className="eyebrow">Your choice, clearly explained</p>
        <h1>Privacy &amp; Cookies</h1>
        <p className="legal-intro">
          Analytics on this site is optional. Declining analytics does not
          affect the site’s content, links, or functionality.
        </p>

        <section>
          <h2>Consent preference</h2>
          <p>
            If analytics is configured, this site asks before loading Google
            Analytics. Your choice is stored for six months in a first-party
            cookie named <code>crownlocked_analytics_consent</code>. It contains
            only <code>granted</code> or <code>denied</code> and uses
            <code> Path=/</code>, <code>SameSite=Lax</code>, and
            <code> Secure</code> when the site is served over HTTPS.
          </p>
        </section>

        <section>
          <h2>Google Analytics 4</h2>
          <p>
            If you select “Allow analytics,” the site loads Google Analytics 4
            and records page views, views of the featured book and series list,
            the “Begin with” action for the current featured book, and outbound
            retailer link clicks. Retailer clicks are interactions, not purchases.
          </p>
          <p>
            The event data can include the page path and title, referring page,
            book ID and title, list and placement labels, link text, content
            format, and a retailer’s destination domain. Query strings are not
            included in the page location sent by this implementation.
          </p>
          <p>
            Google Analytics also receives standard technical and usage data,
            including session activity, browser and device information, and an
            approximate location derived from the visitor’s IP address. This
            site does not send names, email addresses, free-form search text, or
            a user ID to Analytics.
          </p>
          <p>
            When allowed, GA4 can set first-party <code>_ga</code> and
            <code>_ga_*</code> cookies to distinguish visitors and retain
            session state. Google documents a default lifetime of up to two
            years, subject to browser limits. Advertising storage, advertising
            user data, and ad personalization remain denied. Google Signals and
            advertising-personalization signals are disabled.
          </p>
        </section>

        <section>
          <h2>Change your choice</h2>
          <p>
            You can reopen Cookie settings at any time. If you withdraw consent,
            Analytics is disabled and accessible first-party
            <code> _ga</code> and <code>_ga_*</code> cookies are removed.
          </p>
          <CookieSettingsButton />
        </section>
      </article>

      <SiteFooter returnHref="/" />
    </main>
  );
}
