import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Missing required query param: id" }, { status: 400 });
    }

    const apiKey = process.env.TMDB_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "TMDB_API_KEY is not set on the server" }, { status: 500 });
    }

    const base = "https://api.themoviedb.org/3";

    const [detailsRes, creditsRes] = await Promise.all([
      fetch(`${base}/movie/${id}?api_key=${apiKey}&language=en-US`, { next: { revalidate: 60 * 60 } }),
      fetch(`${base}/movie/${id}/credits?api_key=${apiKey}&language=en-US`, { next: { revalidate: 60 * 60 } }),
    ]);

    if (!detailsRes.ok) {
      const text = await detailsRes.text();
      return NextResponse.json({ error: `TMDB details fetch failed: ${detailsRes.status} ${text}` }, { status: 502 });
    }
    if (!creditsRes.ok) {
      const text = await creditsRes.text();
      return NextResponse.json({ error: `TMDB credits fetch failed: ${creditsRes.status} ${text}` }, { status: 502 });
    }

    const details = await detailsRes.json();
    const credits = await creditsRes.json();

    const topCast: string[] = Array.isArray(credits?.cast)
      ? credits.cast.slice(0, 3).map((c: any) => c?.name).filter(Boolean)
      : [];

    const year = typeof details?.release_date === "string" && details.release_date.length >= 4
      ? Number(details.release_date.slice(0, 4))
      : undefined;

    const imageUrl = typeof details?.poster_path === "string" && details.poster_path
      ? `https://image.tmdb.org/t/p/w500${details.poster_path}`
      : undefined;

    const payload = {
      tmdbId: details?.id ?? Number(id),
      title: details?.title ?? details?.name ?? "Untitled",
      year,
      overview: details?.overview ?? "",
      topCast,
      imageUrl,
    };

    return NextResponse.json(payload, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? "Unknown server error" }, { status: 500 });
  }
}
