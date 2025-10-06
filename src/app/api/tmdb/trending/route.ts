import { NextResponse } from "next/server";
import { TMDB_BASE, getApiKey, HttpError } from "../_shared";

// GET /api/tmdb/trending?type=movie|tv&window=day|week
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const type = (url.searchParams.get("type") || "movie").toLowerCase();
    const windowParam = (url.searchParams.get("window") || "day").toLowerCase();

    const mediaType = type === "tv" ? "tv" : "movie"; // default movie
    const timeWindow = windowParam === "week" ? "week" : "day"; // default day

    const apiKey = getApiKey();

    const res = await fetch(
      `${TMDB_BASE}/trending/${mediaType}/${timeWindow}?api_key=${apiKey}`,
      { next: { revalidate: 60 * 10 } }
    );

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({ error: `TMDB trending fetch failed: ${res.status} ${text}` }, { status: 502 });
    }

    const data = await res.json();
    const results = Array.isArray(data?.results)
      ? data.results.slice(0, 20).map((r: any) => ({
          tmdbId: r.id,
          title: r.title ?? r.name ?? "Untitled",
          overview: r.overview ?? "",
          year: (r.release_date || r.first_air_date) ? Number(String(r.release_date || r.first_air_date).slice(0, 4)) : undefined,
          imageUrl: r.poster_path ? `https://image.tmdb.org/t/p/w185${r.poster_path}` : undefined,
          mediaType: r.media_type ?? mediaType,
          popularity: r.popularity,
          voteAverage: r.vote_average,
        }))
      : [];

    return NextResponse.json({ results }, { status: 200 });
  } catch (err: any) {
    if (err instanceof HttpError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    return NextResponse.json({ error: err?.message ?? "Unknown server error" }, { status: 500 });
  }
}
