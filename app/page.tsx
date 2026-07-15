import type { CSSProperties } from "react";

export const revalidate = 300;

type Book = {
  id: string;
  order: number;
  title: string;
  status: string;
  protagonist: string;
  promise: string;
  coverUrl?: string;
  coverAlt?: string;
  purchaseUrl?: string;
};

type AppwriteRow = Record<string, unknown>;

const fallbackBooks: Book[] = [
  {
    id: "drakon-prince",
    order: 1,
    title: "Drakon Prince",
    status: "Awakened",
    protagonist: "Theo Kieten · Dragon",
    promise: "Accept his birthright. Become prey.",
    coverUrl: "/drakon-prince.jpg",
    coverAlt: "Drakon Prince by Jamie McFarlane",
  },
  {
    id: "wizard-prince",
    order: 2,
    title: "Wizard Prince",
    status: "Awakened",
    protagonist: "A gamer · A hidden prince",
    promise: "The game was never only a game.",
  },
  {
    id: "the-impossible-fellowship",
    order: 3,
    title: "The Impossible Fellowship",
    status: "Gathering",
    protagonist: "The next crown stirs",
    promise: "Some quests were never meant to be survived alone.",
  },
  {
    id: "the-final-heir",
    order: 4,
    title: "The Final Heir",
    status: "Identity Locked",
    protagonist: "A Jonas Breivik novel",
    promise: "The last inheritance remains hidden.",
  },
];

const appwrite = {
  endpoint:
    process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT ??
    "https://sfo.cloud.appwrite.io/v1",
  projectId:
    process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID ??
    "project-sfo-6a0b4638002a71c2b8ec",
  databaseId:
    process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID ??
    "database-6a0b628900008b8506e3",
  booksTableId:
    process.env.NEXT_PUBLIC_APPWRITE_BOOKS_TABLE_ID ?? "table-books",
};

function firstString(row: AppwriteRow, keys: string[]) {
  for (const key of keys) {
    const value = row[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
}

function firstNumber(row: AppwriteRow, keys: string[]) {
  for (const key of keys) {
    const value = row[key];
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (typeof value === "string" && /^\d+$/.test(value)) return Number(value);
  }
}

function titleKey(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function rowBelongsToSeries(row: AppwriteRow, title: string) {
  const series = firstString(row, [
    "series_slug",
    "seriesSlug",
    "series_name",
    "seriesName",
  ]);

  return (
    !series ||
    titleKey(series) === "crownlocked-heirs" ||
    fallbackBooks.some((book) => titleKey(book.title) === titleKey(title))
  );
}

function mergeAppwriteRows(rows: AppwriteRow[]) {
  const books = fallbackBooks.map((book) => ({ ...book }));

  for (const row of rows) {
    const title = firstString(row, ["title", "name"]);
    if (!title || !rowBelongsToSeries(row, title)) continue;

    const order = firstNumber(row, ["series_order", "book_number", "order"]);
    const index = books.findIndex(
      (book) =>
        (order && book.order === order) || titleKey(book.title) === titleKey(title),
    );
    if (index < 0) continue;

    const existing = books[index];
    books[index] = {
      ...existing,
      id: firstString(row, ["$id", "id", "slug"]) ?? existing.id,
      title,
      status: firstString(row, ["status", "publication_status"]) ?? existing.status,
      protagonist:
        firstString(row, ["protagonist", "character_line", "subtitle"]) ??
        existing.protagonist,
      promise:
        firstString(row, ["tagline", "short_description", "teaser"]) ??
        existing.promise,
      coverUrl:
        firstString(row, ["cover_url", "coverUrl", "cover_image_url"]) ??
        existing.coverUrl,
      coverAlt:
        firstString(row, ["cover_alt", "coverAlt"]) ?? existing.coverAlt,
      purchaseUrl:
        firstString(row, ["purchase_url", "amazon_url", "retailer_url"]) ??
        existing.purchaseUrl,
    };
  }

  return books.sort((a, b) => a.order - b.order);
}

async function getBooks() {
  try {
    const url = `${appwrite.endpoint}/tablesdb/${appwrite.databaseId}/tables/${appwrite.booksTableId}/rows?total=false`;
    const response = await fetch(url, {
      headers: { "X-Appwrite-Project": appwrite.projectId },
      next: { revalidate: 300 },
    });
    if (!response.ok) return fallbackBooks;

    const payload = (await response.json()) as {
      rows?: AppwriteRow[];
      documents?: AppwriteRow[];
    };
    return mergeAppwriteRows(payload.rows ?? payload.documents ?? []);
  } catch {
    return fallbackBooks;
  }
}

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
  const books = await getBooks();
  const featured = books[0];

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
            <div className="hero-actions">
              <a className="button button-secondary" href="#featured">Begin with Drakon Prince</a>
            </div>
          </div>

          <div className="cover-stage" id="featured">
            <span className="cover-aura" aria-hidden="true" />
            <div className="book-cover">
              <img
                src="/drakon-prince-book.png"
                alt={featured.coverAlt ?? "Drakon Prince book cover"}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="path-section" id="heirs">
        <div className="section-heading shell">
          <p className="eyebrow">Choose an inheritance</p>
          <h2>The Crownlocked Path</h2>
          <span className="ornament" aria-hidden="true">◆</span>
        </div>

        <div className="book-path shell">
          {books.map((book) => {
            const content = (
              <>
                <span className="book-number">
                  {book.order}
                </span>
                <span className="book-details">
                  <strong>{book.title}</strong>
                  <span className="book-status">{book.status}</span>
                  <small className="sr-only">{book.protagonist}. {book.promise}</small>
                </span>
              </>
            );

            return book.purchaseUrl ? (
              <a className={`path-card path-card-${book.order}`} href={book.purchaseUrl} key={book.id}>
                {content}
              </a>
            ) : (
              <article className={`path-card path-card-${book.order}`} key={book.id}>
                {content}
              </article>
            );
          })}
        </div>
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
      </section>

      <footer id="about">
        <div className="shell footer-inner">
          <p><strong>Crownlocked Heirs</strong><br />An interconnected LitRPG fantasy series by Jamie McFarlane.</p>
          <a href="#top">Return to the crown</a>
        </div>
      </footer>
    </main>
  );
}
