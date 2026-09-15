import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(path, import.meta.url), "utf8");

test("publishes canonical sitemap and robots metadata routes", async () => {
  const [site, sitemap, robots] = await Promise.all([
    read("../lib/site.ts"),
    read("../app/sitemap.ts"),
    read("../app/robots.ts"),
  ]);

  assert.match(site, /https:\/\/crownlockedheirs\.com/);
  assert.match(sitemap, /MetadataRoute\.Sitemap/);
  assert.match(sitemap, /`\$\{SITE_ORIGIN\}\//);
  assert.match(sitemap, /`\$\{SITE_ORIGIN\}\/privacy`/);
  assert.match(robots, /MetadataRoute\.Robots/);
  assert.match(robots, /userAgent: "\*"/);
  assert.match(robots, /allow: "\/"/);
  assert.match(robots, /`\$\{SITE_ORIGIN\}\/sitemap\.xml`/);
});
