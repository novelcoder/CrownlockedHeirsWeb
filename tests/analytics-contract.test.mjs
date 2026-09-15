import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(path, import.meta.url), "utf8");

test("keeps Google Analytics behind an explicit, persistent consent choice", async () => {
  const [client, provider, config, layout, privacy, envExample] =
    await Promise.all([
      read("../lib/analytics/client.ts"),
      read("../components/analytics/AnalyticsProvider.tsx"),
      read("../lib/analytics/config.ts"),
      read("../app/layout.tsx"),
      read("../app/privacy/page.tsx"),
      read("../.env.example"),
    ]);

  assert.match(envExample, /NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=/);
  assert.match(layout, /process\.env\.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID/);
  assert.match(config, /\^G-\[A-Z0-9\]\{10\}\$/);
  assert.match(provider, /choose\("denied"\)/);
  assert.match(provider, /choose\("granted"\)/);
  assert.match(provider, /choice === "granted"/);
  assert.match(client, /Expires=/);
  assert.match(client, /setMonth\(expires\.getMonth\(\) \+ 6\)/);
  assert.match(client, /Path=\//);
  assert.match(client, /SameSite=Lax/);
  assert.match(client, /location\.protocol === "https:" \? "; Secure"/);
  assert.match(privacy, /Declining analytics does not/);
});

test("keeps ad features denied and centralizes guarded measurement", async () => {
  const [client, provider, events, page] = await Promise.all([
    read("../lib/analytics/client.ts"),
    read("../components/analytics/AnalyticsProvider.tsx"),
    read("../components/analytics/AnalyticsEvents.tsx"),
    read("../app/page.tsx"),
  ]);

  assert.match(client, /ad_storage: "denied"/);
  assert.match(client, /ad_user_data: "denied"/);
  assert.match(client, /ad_personalization: "denied"/);
  assert.match(client, /allow_google_signals", false/);
  assert.match(client, /allow_ad_personalization_signals", false/);
  assert.match(client, /send_page_view: false/);
  assert.match(client, /name === "_ga" \|\| name\.startsWith\("_ga_"\)/);
  assert.match(provider, /consent === "granted"/);
  assert.doesNotMatch(provider, /gtag\(/);
  assert.doesNotMatch(events, /gtag\(/);
  assert.doesNotMatch(page, /gtag\(/);
  assert.match(page, /eventName="view_item"/);
  assert.match(page, /eventName="view_item_list"/);
  assert.match(page, /eventName="series_cta_click"/);
  assert.match(page, /eventName="retailer_link_click"/);
});

test("does not contain a hardcoded GA4 measurement ID", async () => {
  const files = await Promise.all([
    read("../app/layout.tsx"),
    read("../app/page.tsx"),
    read("../components/analytics/AnalyticsProvider.tsx"),
    read("../components/analytics/AnalyticsEvents.tsx"),
    read("../lib/analytics/client.ts"),
    read("../lib/analytics/config.ts"),
  ]);

  for (const source of files) {
    assert.doesNotMatch(source, /G-[A-Z0-9]{10}/);
  }
});
