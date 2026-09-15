import Link from "next/link";
import { CookieSettingsButton } from "./CookieSettingsButton";

export function SiteFooter({ returnHref = "#top" }: { returnHref?: string }) {
  return (
    <footer>
      <div className="shell footer-inner">
        <p>
          <strong>Crownlocked Heirs</strong>
          <br />
          An interconnected LitRPG fantasy series by Jamie McFarlane.
        </p>
        <nav aria-label="Footer" className="footer-nav">
          <Link className="footer-link" href="/privacy">
            Privacy &amp; Cookies
          </Link>
          <CookieSettingsButton />
          <a className="footer-link" href={returnHref}>
            Return to the crown
          </a>
        </nav>
      </div>
    </footer>
  );
}
