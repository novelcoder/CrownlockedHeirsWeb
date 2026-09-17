import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

test("builds the Crownlocked Heirs homepage with its production assets", async () => {
  const [page, layout, privacy, footer, appwriteLib, packageJson] =
    await Promise.all([
      readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
      readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
      readFile(new URL("../app/privacy/page.tsx", import.meta.url), "utf8"),
      readFile(
        new URL("../components/SiteFooter.tsx", import.meta.url),
        "utf8",
      ),
      readFile(new URL("../lib/appwrite.ts", import.meta.url), "utf8"),
      readFile(new URL("../package.json", import.meta.url), "utf8"),
    ]);

  assert.match(layout, /Crownlocked Heirs \| Jamie McFarlane/);
  assert.match(page, /crownlocked-heirs-wordmark-transparent\.png/);
  assert.match(page, /crownlocked-heirs/);
  assert.match(page, /getSeriesBySlug/);
  assert.match(page, /listBookRowsBySeriesId/);
  assert.match(page, /storage\/buckets\/.*\/files\/.*\/view/);
  assert.doesNotMatch(page, /Drakon Prince/);
  assert.doesNotMatch(page, /The Impossible Fellowship/);
  assert.doesNotMatch(page, /The Final Heir/);
  assert.doesNotMatch(page, /fallbackBooks/);
  assert.match(privacy, /Privacy &amp; Cookies/);
  assert.doesNotMatch(privacy, /Drakon Prince/);
  assert.match(footer, /CookieSettingsButton/);
  assert.match(appwriteLib, /TablesDB/);
  assert.match(appwriteLib, /CMS_API_KEY/);
  assert.match(packageJson, /"build": "next build"/);

  await access(new URL("../public/hero-bjargfold.jpg", import.meta.url));
});
