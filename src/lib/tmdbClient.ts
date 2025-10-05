export async function fetchMovieFromTMDB(id: number) {
  const res = await fetch(`/api/tmdb/movie?id=${id}`);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`TMDB fetch failed: ${res.status} ${text}`);
  }
  return res.json() as Promise<{
    tmdbId: number;
    title: string;
    year?: number;
    overview?: string;
    topCast?: string[];
    imageUrl?: string;
  }>;
}

export async function searchMovies(query: string) {
  const res = await fetch(`/api/tmdb/search?type=movie&query=${encodeURIComponent(query)}`);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`TMDB search failed: ${res.status} ${text}`);
  }
  return res.json() as Promise<{
    results: Array<{
      tmdbId: number;
      title: string;
      year?: number;
      overview?: string;
      imageUrl?: string;
    }>;
  }>;
}

export async function fetchTvShowFromTMDB(id: number) {
  const res = await fetch(`/api/tmdb/tv?id=${id}`);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`TMDB TV fetch failed: ${res.status} ${text}`);
  }
  return res.json() as Promise<{
    tmdbId: number;
    title: string;
    description?: string;
    imageUrl?: string;
  }>;
}

export async function searchTvShows(query: string) {
  const res = await fetch(`/api/tmdb/search?type=tv&query=${encodeURIComponent(query)}`);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`TMDB TV search failed: ${res.status} ${text}`);
  }
  return res.json() as Promise<{
    results: Array<{
      tmdbId: number;
      title: string;
      overview?: string;
      imageUrl?: string;
    }>;
  }>;
}
