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
    const detailsRes = await fetch(`${base}/tv/${id}?api_key=${apiKey}&language=en-US`, { next: { revalidate: 60 * 60 } });
    if (!detailsRes.ok) {
      const text = await detailsRes.text();
      return NextResponse.json({ error: `TMDB TV details fetch failed: ${detailsRes.status} ${text}` }, { status: 502 });
    }

    const details = await detailsRes.json();
    const imageUrl = typeof details?.poster_path === "string" && details.poster_path
      ? `https://image.tmdb.org/t/p/w500${details.poster_path}`
      : undefined;

    const payload = {
      tmdbId: details?.id ?? Number(id),
      title: details?.name ?? "Untitled",
      description: details?.overview ?? "",
      imageUrl,
    };

    return NextResponse.json(payload, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? "Unknown server error" }, { status: 500 });
  }
}
