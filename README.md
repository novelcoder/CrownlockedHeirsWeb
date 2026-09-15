# Crownlocked Heirs

Responsive series website for Jamie McFarlane's _Crownlocked Heirs_ LitRPG fantasy novels.

The homepage is connected to the shared Appwrite books table and keeps a local four-book fallback so the experience remains complete while future titles are still being prepared.

Books are read server-side via `lib/appwrite.ts`, authenticated with a privileged
`CMS_API_KEY` (using the `node-appwrite` server SDK's TablesDB service) — not from
the browser. The key never reaches the client.

## Local preview

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env.local` and fill in `CMS_API_KEY` with an Appwrite API
key scoped to `databases.read` + `documents.read` (read-only, no write scopes).
Set `NEXT_PUBLIC_GOOGLE_ANALYTICS_ID` to a GA4 web stream ID in the form
`G-XXXXXXXXXX` to enable the consent controls. Leaving it blank or setting an
invalid value leaves the site fully functional without loading Analytics or
showing Cookie settings.

## Analytics and consent

The site uses a custom, first-party consent control and Google’s basic consent
model. The Google tag is not requested and no Analytics event is sent until the
visitor explicitly selects **Allow analytics**. The choice lasts six months and
can be changed from the persistent footer control.

Page views and retailer links are measured explicitly so their parameters stay
consistent. In the GA4 web stream’s Enhanced Measurement settings:

- Under **Page views**, turn off **Page changes based on browser history events**.
- Turn off **Outbound clicks**.

The first setting prevents GA4’s history listener from duplicating the app’s
manual route-change page views. The second prevents its generic `click` event
from duplicating the site’s `retailer_link_click` event. Other Enhanced
Measurement options can remain independently configured.

## Appwrite Sites deployment

Connect this repository from **Sites** in the Appwrite Console and use:

- Framework: Next.js
- Rendering: Server-side rendering (SSR)
- Install command: `npm install`
- Build command: `npm run build`
- Output directory: `.next`

Add the four CMS variables from `.env.example` (including `CMS_API_KEY`) in the
site's environment settings. Add `NEXT_PUBLIC_GOOGLE_ANALYTICS_ID` only when GA4
is configured. These values are needed at build time too, since the homepage
prerenders statically. If Appwrite is unreachable or misconfigured, the homepage
falls back to its bundled four-book list rather than failing.
