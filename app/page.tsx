import type { CSSProperties } from "react";
import Link from "next/link";
import {
  AnalyticsLink,
  AnalyticsView,
} from "@/components/analytics/AnalyticsEvents";
import { SiteFooter } from "@/components/SiteFooter";
import { getSeriesBooks } from "@/lib/books";

export const revalidate = 300;

// The 3D paperback render used for the hero. This is a hero-only asset, not
// the flat book_covers.cover_url (which now points to the flat ebook cover),
// so it's referenced directly from the CrownlockedHeirs storage bucket.
const HERO_COVER_URL =
  "https://sfo.cloud.appwrite.io/v1/storage/buckets/6aabf091000da4dc7980/files/6aabf50e000b893a97bf/view?project=6a0b4638002a71c2b8ec";

const embers = [
  [8, 5, 10, 0.8],
  [15, 10, 13, 1.1],
  [26, 2, 9, 0.65],
  [37, 7, 14, 0.9],
  [48, 13, 11, 0.7],
  [59, 4, 15, 1],
  [68, 11, 12, 0.75],
  [78, 1, 10, 1.15],
  [87, 8, 14, 0.85],
  [94, 3, 9, 0.7],
] as const;

export default async function Home() {
  const books = await getSeriesBooks();
  const featured = books[0];
  const ctaLabel = featured ? `Begin with ${featured.title}` : undefined;
  const analyticsItems = books.map((book) => ({
    item_id: book.id,
    item_name: book.title,
    item_list_name: "Crownlocked Path",
    index: book.order,
  }));

  return (
    <main>
      <section className="hero" id="top">
        <div className="atmosphere" aria-hidden="true">
          <span className="lightning lightning-one" />
          <span className="lightning lightning-two" />
          <span className="fortress" />
          <span className="embers">
            {embers.map(([left, delay, duration, scale], index) => (
              <i
                key={index}
                style={
                  {
                    "--left": `${left}%`,
                    "--delay": `-${delay}s`,
                    "--duration": `${duration}s`,
                    "--scale": scale,
                  } as CSSProperties
                }
              />
            ))}
          </span>
        </div>

        <header className="site-header shell">
          <p className="presenter">JAMIE McFARLANE PRESENTS</p>
        </header>

        <div className="hero-grid shell">
          <div className="hero-copy">
            <p className="eyebrow">A LitRPG fantasy series</p>
            <div className="series-wordmark">
              <img
                src="/crownlocked-heirs-wordmark-transparent.png"
                alt="Crownlocked Heirs"
                width="2138"
                height="736"
              />
            </div>
            <p className="hero-lede">
              Two hidden heirs. Two fallen kingdoms. One impossible
              fellowship—and a world waiting to be reclaimed.
            </p>
            {featured && ctaLabel && (
              <div className="hero-actions">
                <AnalyticsLink
                  className="button button-secondary"
                  eventName="series_cta_click"
                  eventParameters={{
                    content_format: "book",
                    item_id: featured.id,
                    item_name: featured.title,
                    link_text: ctaLabel,
                    placement: "hero",
                  }}
                  href={`/books/${featured.slug}`}
                >
                  {ctaLabel}
                </AnalyticsLink>
              </div>
            )}
          </div>

          <div className="cover-stage" id="featured">
            {featured ? (
              <>
                <AnalyticsView
                  eventName="view_item"
                  parameters={{
                    content_format: "book",
                    items: [analyticsItems[0]],
                    placement: "featured_cover",
                  }}
                />
                <span className="cover-aura" aria-hidden="true" />
                <div className="book-cover">
                  <img
                    src={HERO_COVER_URL}
                    alt={featured.coverAlt ?? `${featured.title} book cover`}
                  />
                </div>
              </>
            ) : (
              <div
                className="book-cover-placeholder"
                role="img"
                aria-label="Book details unavailable"
              >
                Book details unavailable
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="path-section" id="heirs">
        {books.length > 0 && (
          <AnalyticsView
            eventName="view_item_list"
            parameters={{
              content_format: "book",
              item_list_name: "Crownlocked Path",
              items: analyticsItems,
              placement: "series_path",
            }}
          />
        )}
        <div className="section-heading shell">
          <p className="eyebrow">Choose an inheritance</p>
          <h2>The Crownlocked Path</h2>
          <span className="ornament" aria-hidden="true">
            ◆
          </span>
        </div>

        {books.length > 0 ? (
          <div className="book-path shell">
            {books.map((book) => {
              const accessibleDescription = [
                book.tagline,
                book.cardDescription === book.tagline
                  ? undefined
                  : book.cardDescription,
              ]
                .filter(Boolean)
                .join(". ");
              const content = (
                <>
                  <span className="book-number">{book.order}</span>
                  <span className="book-details">
                    <strong>{book.title}</strong>
                    <span className="book-status">{book.statusLabel}</span>
                    {accessibleDescription && (
                      <small className="sr-only">{accessibleDescription}</small>
                    )}
                  </span>
                </>
              );

              return (
                <AnalyticsLink
                  className={`path-card path-card-${book.order}`}
                  eventName="select_item"
                  eventParameters={{
                    content_format: "book",
                    item_id: book.id,
                    item_name: book.title,
                    list_name: "Crownlocked Path",
                    placement: "series_path",
                  }}
                  href={`/books/${book.slug}`}
                  key={book.id}
                >
                  {content}
                </AnalyticsLink>
              );
            })}
            <article
              className="path-card path-card-4 path-card-placeholder"
              aria-label="A fourth book in the series, not yet announced"
            >
              <span className="book-number">4</span>
              <span className="book-details">
                <span className="book-status">Unannounced</span>
              </span>
            </article>
          </div>
        ) : (
          <p className="shell book-path-empty">
            Book details are temporarily unavailable. Please check back soon.
          </p>
        )}
      </section>

      <section className="world-section" id="bjargfold">
        <div className="world-grid shell">
          <div>
            <p className="eyebrow">Beyond the safe world</p>
            <h2>Bjargfold remembers its heirs.</h2>
          </div>
          <div className="world-copy">
            <p>
              For generations, the heirs of fallen kingdoms have lived hidden
              among humanity, unaware of the dangerous inheritances waiting for
              them. Then the headaches begin, game-like prompts appear, and
              ordinary lives become epic quests.
            </p>
            <p>
              Dragons, magical loot, unlikely allies, hard-earned levels, and
              ruined fortresses await. Inheriting a crown is considerably easier
              than earning it.
            </p>
          </div>
        </div>
        <div className="promise-grid shell" aria-label="Series features">
          <span>Level progression</span>
          <span>Fortress building</span>
          <span>Found family</span>
          <span>Adventure &amp; romance</span>
        </div>

        <p className="world-map-cta shell">
          <Link href="/bjargfold">Explore the map of Bjargfold →</Link>
        </p>
      </section>

      <SiteFooter />
    </main>
  );
}
