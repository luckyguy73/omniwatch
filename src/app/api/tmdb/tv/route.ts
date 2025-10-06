import { NextResponse } from "next/server";
import { TMDB_BASE, getApiKey, posterUrl, requireId, HttpError } from "../_shared";

export async function GET(request: Request) {
  try {
    const id = requireId(request);
    const apiKey = getApiKey();

    const detailsRes = await fetch(`${TMDB_BASE}/tv/${id}?api_key=${apiKey}&language=en-US`, { next: { revalidate: 60 * 60 } });
    if (!detailsRes.ok) {
      const text = await detailsRes.text();
      return NextResponse.json({ error: `TMDB TV details fetch failed: ${detailsRes.status} ${text}` }, { status: 502 });
    }

    const details = await detailsRes.json();

    const payload = {
      tmdbId: details?.id ?? Number(id),
      title: details?.name ?? "Untitled",
      description: details?.overview ?? "",
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
