import { NextResponse } from "next/server";
import { TMDB_BASE, getApiKey, posterUrl, requireId, topCastFromCredits, yearFromReleaseDate, HttpError } from "../_shared";

export async function GET(request: Request) {
  try {
    const id = requireId(request);
    const apiKey = getApiKey();

    const [detailsRes, creditsRes] = await Promise.all([
      fetch(`${TMDB_BASE}/movie/${id}?api_key=${apiKey}&language=en-US`, { next: { revalidate: 60 * 60 } }),
      fetch(`${TMDB_BASE}/movie/${id}/credits?api_key=${apiKey}&language=en-US`, { next: { revalidate: 60 * 60 } }),
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

    const payload = {
      tmdbId: details?.id ?? Number(id),
      title: details?.title ?? details?.name ?? "Untitled",
      year: yearFromReleaseDate(details?.release_date),
      overview: details?.overview ?? "",
      topCast: topCastFromCredits(credits, 3),
      imageUrl: posterUrl(details?.poster_path, "w500"),
    };

    return NextResponse.json(payload, { status: 200 });
  } catch (err: any) {
    if (err instanceof HttpError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    return NextResponse.json({ error: err?.message ?? "Unknown server error" }, { status: 500 });
  }
}
