# Crownlocked Heirs

Responsive series website for Jamie McFarlane's *Crownlocked Heirs* LitRPG fantasy novels.

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

## Appwrite Sites deployment

Connect this repository from **Sites** in the Appwrite Console and use:

- Framework: Next.js
- Rendering: Server-side rendering (SSR)
- Install command: `npm install`
- Build command: `npm run build`
- Output directory: `.next`

Add all five variables from `.env.example` (including `CMS_API_KEY`) in the site's
environment settings — they're needed at build time too, since the homepage
prerenders statically. If Appwrite is unreachable or misconfigured, the homepage
falls back to its bundled four-book list rather than failing.
