import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Bjargfold | Crownlocked Heirs",
  description:
    "An illustrated map of Bjargfold, the world where the Crownlocked Heirs make their stand.",
};

const BJARGFOLD_MAP_URL =
  "https://sfo.cloud.appwrite.io/v1/storage/buckets/6aabf091000da4dc7980/files/6aabf5f3001c02e607d3/view?project=6a0b4638002a71c2b8ec";

export default function BjargfoldPage() {
  return (
    <main className="legal-page" id="top">
      <header className="site-header shell">
        <Link className="presenter" href="/">
          JAMIE McFARLANE PRESENTS
        </Link>
      </header>

      <article className="legal-content shell">
        <p className="eyebrow">Beyond the safe world</p>
        <h1>Bjargfold</h1>
        <p className="legal-intro">
          For generations, the heirs of fallen kingdoms have lived hidden among
          humanity, unaware of the dangerous inheritances waiting for them.
          Then the headaches begin, game-like prompts appear, and ordinary
          lives become epic quests.
        </p>
        <p className="legal-intro">
          Dragons, magical loot, unlikely allies, hard-earned levels, and
          ruined fortresses await. Inheriting a crown is considerably easier
          than earning it.
        </p>

        <figure className="map-frame">
          <img
            src={BJARGFOLD_MAP_URL}
            alt="Hand-drawn map of Bjargfold, marking the mountain castle of Lasair Ghorm, the central region of Mestrjbod, a dotted southern way linking two villages, and other castles, villages, forests, and rivers across the land."
            width="1920"
            height="1080"
          />
        </figure>
      </article>

      <SiteFooter returnHref="/" />
    </main>
  );
}
