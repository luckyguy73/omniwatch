import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const query = url.searchParams.get("query");
    const type = url.searchParams.get("type") || "movie"; // movie or tv (default movie)

    if (!query || query.trim().length === 0) {
      return NextResponse.json({ results: [] }, { status: 200 });
    }

    const apiKey = process.env.TMDB_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "TMDB_API_KEY is not set on the server" }, { status: 500 });
    }

    const base = "https://api.themoviedb.org/3";
    const path = type === "tv" ? "search/tv" : "search/movie";
    const res = await fetch(
      `${base}/${path}?api_key=${apiKey}&language=en-US&include_adult=false&query=${encodeURIComponent(query)}`,
      { next: { revalidate: 60 * 10 } }
    );

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({ error: `TMDB search failed: ${res.status} ${text}` }, { status: 502 });
    }

    const data = await res.json();
    const results = Array.isArray(data?.results)
      ? data.results.slice(0, 10).map((r: any) => ({
          tmdbId: r.id,
          title: r.title ?? r.name ?? "Untitled",
          year: (r.release_date || r.first_air_date) ? Number(String(r.release_date || r.first_air_date).slice(0, 4)) : undefined,
          overview: r.overview ?? "",
          imageUrl: r.poster_path ? `https://image.tmdb.org/t/p/w185${r.poster_path}` : undefined,
        }))
      : [];

    return NextResponse.json({ results }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? "Unknown server error" }, { status: 500 });
  }
}
