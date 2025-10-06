# OmniWatch

A responsive web app to track and manage Movies and TV Shows with a clean, fast UI. Built with Next.js App Router, React, Tailwind CSS, Firebase Firestore, and The Movie Database (TMDB) APIs.

• Framework: Next.js 15 (App Router) + React 19
• Styling: Tailwind CSS v4 (using Inter via next/font)
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
- Server-side TMDB API routes for movie/TV details, search, and trending

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

## TMDB capabilities (free tier)
TMDB provides rich metadata for movies and TV shows on its free tier. Highlights relevant to our app:

- TV details include:
  - networks: array of networks the show airs on (we expose this as `networks: string[]`)
  - status: e.g., "Returning Series", "Ended"
  - firstAirDate / lastAirDate (ISO date strings)
  - nextAirDate (ISO date string from `next_episode_to_air.air_date` when available)
  - Note: TMDB typically does not provide a reliable broadcast time-of-day; it mainly includes dates. If you need exact local airtimes by region, you'd need a different source (e.g., a TV guide provider). We are keeping the app on free sources and do not fetch airtimes.

- Trending endpoints: yes, TMDB exposes trending for movies and TV.
  - Server route we added: `GET /api/tmdb/trending?type=movie|tv&window=day|week`
  - Returns up to 20 items with: `tmdbId`, `title`, `overview`, `year`, `imageUrl`, `mediaType`, `popularity`, `voteAverage`.

### Client helpers
You can call these from the client (they hit our server routes):

- `fetchTrendingMovies(window?: 'day'|'week')`
- `fetchTrendingTvShows(window?: 'day'|'week')`
- Existing: `searchMovies`, `searchTvShows`, `fetchMovieFromTMDB`, `fetchTvShowFromTMDB` (now includes optional `networks`, `status`, and air date fields for TV).

### Example usage (client)
```ts
import { fetchTrendingMovies, fetchTrendingTvShows, fetchTvShowFromTMDB } from '@/lib/tmdb/tmdbClient';

const movies = await fetchTrendingMovies('day');
const tv = await fetchTrendingTvShows('week');
const show = await fetchTvShowFromTMDB(93405); // e.g., Yellowstone
console.log(show.networks, show.status, show.nextAirDate);
```

## License
Private project (no explicit license). Adjust as needed.


## Font family (Inter, Roboto, Montserrat)

This project uses Inter (via next/font) as the default sans-serif font. You can switch to another popular font with a tiny change in src/app/layout.tsx.

We now use generic CSS custom properties for font variables:
- --font-sans (for the primary sans-serif)
- --font-mono (for the monospaced family)

Steps:
- Replace the Inter import with your preferred font from next/font/google.
- Set the variable option to "--font-sans" for the primary font (and "--font-mono" if you change the mono font).

Examples:

Using Roboto:

import { Roboto, Geist_Mono } from "next/font/google";
const robotoSans = Roboto({ variable: "--font-sans", subsets: ["latin"], weight: ["300","400","500","700"] });
// ... use robotoSans.variable in the <body> className

Using Montserrat:

import { Montserrat, Geist_Mono } from "next/font/google";
const montserratSans = Montserrat({ variable: "--font-sans", subsets: ["latin"], weight: ["300","400","500","700"] });
// ... use montserratSans.variable in the <body> className

Note:
- The variable names are generic ("--font-sans" / "--font-mono") to avoid confusion and reflect the actual purpose, regardless of the specific font family you choose.
- If you also want to change the monospaced font, replace Geist_Mono with e.g. Roboto_Mono or JetBrains_Mono and use the variable name "--font-mono".
