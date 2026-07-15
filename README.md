# Crownlocked Heirs

Responsive series website for Jamie McFarlane's *Crownlocked Heirs* LitRPG fantasy novels.

The homepage is connected to the shared Appwrite books table and keeps a local four-book fallback so the experience remains complete while future titles are still being prepared.

## Local preview

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env.local` when Appwrite values differ from the shared defaults.

## Appwrite Sites deployment

Connect this repository from **Sites** in the Appwrite Console and use:

- Framework: Next.js
- Rendering: Server-side rendering (SSR)
- Install command: `npm install`
- Build command: `npm run build`
- Output directory: `.next`

Add the four variables from `.env.example` in the site's environment settings.
The books table must allow public read access for published book metadata; the
homepage falls back to its bundled four-book list if Appwrite is unavailable.
