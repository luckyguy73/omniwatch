# Omni Dashboard

A responsive web app to track and manage Movies and TV Shows with a clean, fast UI. Built with Next.js App Router, React, Tailwind CSS, Firebase Firestore, and The Movie Database (TMDB) APIs.

• Framework: Next.js 15 (App Router) + React 19
• Styling: Tailwind CSS v4
• Data: Firebase Firestore (client SDK)
• External API: TMDB (server-side API routes)
• Tests: Vitest + Testing Library

## Features
- Two tabs: TV Shows and Movies
- Live, debounced search-as-you-type (300ms) with up to 10 suggestions
- Suggestions show title and year; add via a green “+” button
- Add and Remove items (Remove uses a consistent square red X button at the far-left of the title)
- Items sorted alphabetically by title (case-insensitive)
- In-app toast notifications (blue theme) that appear at the top and auto-dismiss after 5s
- Light/Dark theme toggle (dark is default)
- Mobile-friendly layout and accessible controls (aria-labels, keyboard-friendly)

## Project Structure
```
src/
  app/
    api/
      tmdb/
        _shared.ts            # server utilities for TMDB handlers
        movie/route.ts        # GET /api/tmdb/movie?id=...
        tv/route.ts           # GET /api/tmdb/tv?id=...
        search/route.ts       # GET /api/tmdb/search?type=movie|tv&query=...
    layout.tsx
    page.tsx                  # Dashboard (tabs, theme, data loading)
  components/
    MoviesTab.tsx
    TvShowsTab.tsx
    __tests__/                # Vitest + Testing Library tests
  lib/
    firestore/
      firebase.ts             # Firebase app init (client SDK)
      data.ts                 # fetchMovies/fetchTvShows (Firestore reads)
      models.ts               # upsert/delete helpers + types
    tmdb/
      tmdbClient.ts           # client helpers calling our Next.js API routes
    util/
      index.ts
```

## Environment Variables
The app uses both server-only and public env vars.

Server-only (do NOT prefix with NEXT_PUBLIC):
- TMDB_API_KEY

Public (exposed to the browser via NEXT_PUBLIC_):
- NEXT_PUBLIC_FIREBASE_API_KEY
- NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
- NEXT_PUBLIC_FIREBASE_PROJECT_ID
- NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
- NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
- NEXT_PUBLIC_FIREBASE_APP_ID

Note: Firebase web config values are intentionally public; your Firestore security relies on Firestore Rules, not secrecy of these values.

## Local Development
1. Install dependencies:
   - npm install
2. Set up a .env.local with the variables listed above.
3. Start the dev server:
   - npm run dev
4. Open http://localhost:3000

## Testing
- Run all tests:
  - npm test

## Deployment (Vercel)
- Import the repo into Vercel (Git integration).
- Set Environment Variables (Production and optionally Preview) using the list above.
- Deploy. Vercel will run `next build` and host the app. API routes run as serverless functions.
- To auto-deploy on push, ensure your project is connected to the Git repo and the Production Branch is set to `main` in Project Settings → Git.

## Notes & Gotchas
- TMDB_API_KEY is required by the server-side API routes; without it, search/details API endpoints will return errors at runtime.
- Unit tests stub network calls and do not require TMDB or Firebase.
- During tests, the dashboard avoids Firestore calls (NODE_ENV==='test').

## License
Private project (no explicit license). Adjust as needed.
