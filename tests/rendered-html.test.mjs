import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

test("builds the Crownlocked Heirs homepage with its production assets", async () => {
  const [page, layout, appwriteLib, packageJson] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../lib/appwrite.ts", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  assert.match(layout, /Crownlocked Heirs \| Jamie McFarlane/);
  assert.match(page, /crownlocked-heirs-wordmark-transparent\.png/);
  assert.match(page, /Drakon Prince/);
  assert.match(page, /The Impossible Fellowship/);
  assert.match(appwriteLib, /TablesDB/);
  assert.match(appwriteLib, /CMS_API_KEY/);
  assert.match(packageJson, /"build": "next build"/);

  await access(new URL("../public/drakon-prince-book.png", import.meta.url));
  await access(new URL("../public/hero-bjargfold.jpg", import.meta.url));
});
