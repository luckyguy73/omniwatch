export async function fetchMovieFromTMDB(id: number) {
  const res = await fetch(`/api/tmdb/movie?id=${id}`);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`TMDB fetch failed: ${res.status} ${text}`);
  }
  return (await res.json()) as {
    tmdbId: number;
    title: string;
    year?: number;
    overview?: string;
    topCast?: string[];
    imageUrl?: string;
    rating?: number;
  };
}

export async function searchMovies(query: string) {
  const res = await fetch(`/api/tmdb/search?type=movie&query=${encodeURIComponent(query)}`);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`TMDB search failed: ${res.status} ${text}`);
  }
  return (await res.json()) as {
    results: Array<{
      tmdbId: number;
      title: string;
      year?: number;
      overview?: string;
      imageUrl?: string;
    }>;
  };
}

export async function fetchTvShowFromTMDB(id: number) {
  const res = await fetch(`/api/tmdb/tv?id=${id}`);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`TMDB TV fetch failed: ${res.status} ${text}`);
  }
  return (await res.json()) as {
    tmdbId: number;
    title: string;
    description?: string;
    imageUrl?: string;
    rating?: number;
    networks?: string[];
    status?: string;
    firstAirDate?: string;
    lastAirDate?: string;
    nextAirDate?: string;
  };
}

export async function searchTvShows(query: string) {
  const res = await fetch(`/api/tmdb/search?type=tv&query=${encodeURIComponent(query)}`);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`TMDB TV search failed: ${res.status} ${text}`);
  }
  return (await res.json()) as {
    results: Array<{
      tmdbId: number;
      title: string;
      overview?: string;
      imageUrl?: string;
    }>;
  };
}

export async function fetchTrendingMovies(window: 'day' | 'week' = 'day') {
  const res = await fetch(`/api/tmdb/trending?type=movie&window=${window}`);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`TMDB trending movies failed: ${res.status} ${text}`);
  }
  return (await res.json()) as {
    results: Array<{
      tmdbId: number;
      title: string;
      overview?: string;
      year?: number;
      imageUrl?: string;
      mediaType?: string;
      popularity?: number;
      voteAverage?: number;
    }>;
  };
}

export async function fetchTrendingTvShows(window: 'day' | 'week' = 'day') {
  const res = await fetch(`/api/tmdb/trending?type=tv&window=${window}`);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`TMDB trending TV failed: ${res.status} ${text}`);
  }
  return (await res.json()) as {
    results: Array<{
      tmdbId: number;
      title: string;
      overview?: string;
      year?: number;
      imageUrl?: string;
      mediaType?: string;
      popularity?: number;
      voteAverage?: number;
    }>; 
  };
}
