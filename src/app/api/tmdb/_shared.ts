// Shared utilities for TMDB Next.js route handlers (server-side)
// Centralize common logic to follow DRY and consistent error handling.

export const TMDB_BASE = "https://api.themoviedb.org/3" as const;

export class HttpError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export function requireId(request: Request): string {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  if (!id) {
    throw new HttpError(400, "Missing required query param: id");
  }
  return id;
}

export function getApiKey(): string {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) {
    throw new HttpError(500, "TMDB_API_KEY is not set on the server");
  }
  return apiKey;
}

export function posterUrl(poster_path?: unknown, size: "w185" | "w500" = "w500"): string | undefined {
  if (typeof poster_path === "string" && poster_path.length > 0) {
    return `https://image.tmdb.org/t/p/${size}${poster_path}`;
  }
  return undefined;
}

export function topCastFromCredits(credits: any, limit = 3): string[] {
  return Array.isArray(credits?.cast)
    ? credits.cast
        .slice(0, limit)
        .map((c: any) => c?.name)
        .filter(Boolean)
    : [];
}

export function yearFromReleaseDate(date: unknown): number | undefined {
  if (typeof date === "string" && date.length >= 4) {
    const y = Number(date.slice(0, 4));
    return Number.isFinite(y) ? y : undefined;
  }
  return undefined;
}
