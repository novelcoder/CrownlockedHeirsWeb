import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  AnalyticsLink,
  AnalyticsView,
} from "@/components/analytics/AnalyticsEvents";
import { SiteFooter } from "@/components/SiteFooter";
import { destinationDomain, getBookBySlug, getSeriesBooks } from "@/lib/books";

export const revalidate = 300;

export async function generateStaticParams() {
  const books = await getSeriesBooks();
  return books.map((book) => ({ slug: book.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const book = await getBookBySlug(slug);
  if (!book) return { title: "Book not found | Crownlocked Heirs" };
  return {
    title: `${book.title} | Crownlocked Heirs`,
    description: book.tagline ?? book.cardDescription,
  };
}

function formatReleaseDate(releaseDate: string) {
  const date = new Date(releaseDate);
  if (Number.isNaN(date.getTime())) return undefined;
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function BookIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M3 4.5C3 3.67 3.67 3 4.5 3H10v14H4.5A1.5 1.5 0 0 1 3 15.5v-11Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path
        d="M17 4.5c0-.83-.67-1.5-1.5-1.5H10v14h5.5a1.5 1.5 0 0 0 1.5-1.5v-11Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HeadphonesIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M3 11v-1a7 7 0 0 1 14 0v1"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <rect
        x="2.5"
        y="11"
        width="4"
        height="6"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <rect
        x="13.5"
        y="11"
        width="4"
        height="6"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.4"
      />
    </svg>
  );
}

export default async function BookPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [book, books] = await Promise.all([
    getBookBySlug(slug),
    getSeriesBooks(),
  ]);
  if (!book) notFound();

  const index = books.findIndex((b) => b.slug === book.slug);
  const prevBook = index > 0 ? books[index - 1] : null;
  const nextBook = index >= 0 && index < books.length - 1 ? books[index + 1] : null;
  const releaseDateLabel = book.releaseDate
    ? formatReleaseDate(book.releaseDate)
    : undefined;

  return (
    <main className="legal-page" id="top">
      <header className="site-header shell">
        <Link className="presenter" href="/">
          JAMIE McFARLANE PRESENTS
        </Link>
      </header>

      <article className="book-detail shell">
        <div className="cover-stage">
          <span className="cover-aura" aria-hidden="true" />
          <div className="book-cover">
            {book.coverUrl ? (
              <img
                src={book.coverUrl}
                alt={book.coverAlt ?? `${book.title} book cover`}
              />
            ) : (
              <div
                className="book-cover-placeholder"
                role="img"
                aria-label={book.coverAlt ?? `${book.title} cover coming soon`}
              >
                Cover coming soon
              </div>
            )}
          </div>
        </div>

        <div className="book-detail-copy">
          <AnalyticsView
            eventName="view_item"
            parameters={{
              content_format: "book",
              items: [
                {
                  item_id: book.id,
                  item_name: book.title,
                  item_list_name: "Crownlocked Path",
                  index: book.order,
                },
              ],
              placement: "book_detail",
            }}
          />
          <p className="book-detail-back">
            <Link href="/#heirs">← Back to the Crownlocked Path</Link>
          </p>
          <p className="eyebrow">Crownlocked Heirs · Book {book.order}</p>
          <h1>{book.title}</h1>
          {book.statusLabel && (
            <p className="book-detail-status">{book.statusLabel}</p>
          )}
          {releaseDateLabel && (
            <p className="book-detail-meta">Published {releaseDateLabel}</p>
          )}
          {book.tagline && <p className="hero-lede">{book.tagline}</p>}

          {book.blurb && (
            <div className="book-detail-blurb">
              {book.blurb.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          )}

          <div className="hero-actions">
            {book.storeUrl && (
              <AnalyticsLink
                className="button button-primary"
                eventName="retailer_link_click"
                eventParameters={{
                  content_format: "book",
                  destination_domain: destinationDomain(book.storeUrl),
                  item_id: book.id,
                  item_name: book.title,
                  link_text: book.storeLabel ?? book.title,
                  list_name: "Crownlocked Path",
                  placement: "book_detail",
                }}
                href={book.storeUrl}
              >
                <BookIcon />
                {book.storeLabel ?? "Get the book"}
              </AnalyticsLink>
            )}
            {book.audibleUrl && (
              <AnalyticsLink
                className="button button-secondary"
                eventName="retailer_link_click"
                eventParameters={{
                  content_format: "book",
                  destination_domain: destinationDomain(book.audibleUrl),
                  item_id: book.id,
                  item_name: book.title,
                  link_text: "Listen on Audible",
                  list_name: "Crownlocked Path",
                  placement: "book_detail",
                }}
                href={book.audibleUrl}
              >
                <HeadphonesIcon />
                Listen on Audible
              </AnalyticsLink>
            )}
          </div>
          {!book.storeUrl && !book.audibleUrl && (
            <p className="book-detail-note">Coming soon.</p>
          )}
        </div>
      </article>

      <nav className="book-nav shell" aria-label="More books">
        {prevBook ? (
          <Link
            className="book-nav-link book-nav-prev"
            href={`/books/${prevBook.slug}`}
          >
            <span className="book-nav-label">← Previous</span>
            <span className="book-nav-title">{prevBook.title}</span>
          </Link>
        ) : (
          <span />
        )}
        {nextBook ? (
          <Link
            className="book-nav-link book-nav-next"
            href={`/books/${nextBook.slug}`}
          >
            <span className="book-nav-label">Next →</span>
            <span className="book-nav-title">{nextBook.title}</span>
          </Link>
        ) : (
          <span />
        )}
      </nav>

      <SiteFooter returnHref="/" />
    </main>
  );
}
