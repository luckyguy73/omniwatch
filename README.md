# OmniWatc## Features
- **User Authentication**: Google Sign-In with Firebase Auth for personalized experience
- **Normalized Data Structure**: Efficient storage with no duplicate movie/TV data across users
- **User-specific Watchlists**: Personal ratings, notes, and watch status for each user
- **Data Deduplication**: Same movie stored once globally, referenced by multiple users
- Two tabs: TV Shows and Movies
- Live, debounced search-as-you-type (300ms) with up to 10 suggestions
- Suggestions show title and year; add via a green "+" button
- Add and Remove items (Remove uses a consistent square red X button at the far-left of the title)
- Items sorted alphabetically by title (case-insensitive)
- In-app toast notifications (blue theme) that appear at the top and auto-dismiss after 5s
- Light/Dark theme toggle (dark is default)
- Mobile-friendly layout and accessible controls (aria-labels, keyboard-friendly)
- Server-side TMDB API routes for movie/TV details, search, and trendingnsive web app to track and manage Movies and TV Shows with a clean, fast UI. Built with Next.js App Router, React, Tailwind CSS, Firebase Firestore, and The Movie Database (TMDB) APIs.

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
    layout.tsx                # Root layout with AuthProvider
    page.tsx                  # Dashboard (tabs, theme, data loading)
  components/
    GoogleSignIn.tsx          # Google authentication component
    UserProfile.tsx           # User profile dropdown with sign out
    ProtectedRoute.tsx        # Route wrapper requiring authentication
    MoviesTab.tsx
    TvShowsTab.tsx
    __tests__/                # Vitest + Testing Library tests
  lib/
    auth/
      AuthContext.tsx         # Firebase Auth context and hooks
    firestore/
      firebase.ts             # Firebase app init (client SDK with Auth)
      data.ts                 # fetchMovies/fetchTvShows (legacy global collections)
      userdata.ts             # Normalized user-specific CRUD operations with global deduplication
      models.ts               # upsert/delete helpers + types
    hooks/
      useUserData.ts          # Custom hooks for user data management
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

## Firebase Setup

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or use an existing one
3. Follow the setup wizard

### 2. Enable Authentication
1. In Firebase Console, navigate to **Authentication** → **Sign-in method**
2. Click on **Google** provider and enable it
3. Add your domain to **Authorized domains** (add `localhost` for development)
4. Save the configuration

### 3. Set up Firestore Database
1. In Firebase Console, go to **Firestore Database**
2. Click **Create database**
3. Choose **Start in test mode** for development (update security rules later)
4. Select a location for your database

### 4. Get Configuration
1. Go to **Project Settings** → **General** tab
2. Scroll to "Your apps" and click **Web app** (</>) icon
3. Register your app with a name
4. Copy the configuration values to your `.env.local` file

### 5. Security Rules (Important!)
Update your Firestore security rules to ensure user data isolation:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Legacy global collections (optional, for migration)
    match /movies/{document} {
      allow read, write: if request.auth != null;
    }
    match /tv_shows/{document} {
      allow read, write: if request.auth != null;
    }
  }
}
```

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
