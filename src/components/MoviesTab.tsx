import React, { useState, useEffect } from 'react';
import { searchMovies, fetchMovieFromTMDB } from "@/lib/tmdb/tmdbClient";
import { upsertMovie, deleteMovie } from "@/lib/firestore/models";

export default function MoviesTab({ theme, items = [], onDataChanged }: { theme: string; items?: any[]; onDataChanged?: () => void }) {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 5000);
  }

  useEffect(() => {
    const term = q.trim();
    setError(null);
    if (!term) {
      setResults([]);
      return;
    }
    const h = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await searchMovies(term);
        setResults((data.results || []).slice(0, 10));
      } catch (err: any) {
        setError(err?.message ?? "Search failed");
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(h);
  }, [q]);

  async function handleAdd(tmdbId: number) {
    try {
      const movie = await fetchMovieFromTMDB(tmdbId);
      await upsertMovie({ ...movie });
      showToast(`Added: ${movie.title}`);
      onDataChanged?.();
    } catch (err: any) {
      showToast(`Add failed: ${err?.message ?? "Unknown error"}`);
    }
  }

  async function handleRemove(item: any) {
    if (!item?.tmdbId) return;
    try {
      await deleteMovie(item.tmdbId);
      showToast(`Removed: ${item.title}`);
      onDataChanged?.();
    } catch (err: any) {
      showToast(`Remove failed: ${err?.message ?? "Unknown error"}`);
    }
  }

  return (
    <div className={theme === "dark" ? "bg-gray-900 rounded-lg shadow p-6" : "bg-white rounded-lg shadow p-6"}>
      <h2 className={`text-xl font-semibold mb-4 ${theme === "dark" ? "text-blue-200" : "text-gray-800"}`}>Your Movies</h2>

      {toast ? (
        <div className="fixed top-0 left-0 right-0 z-50 flex justify-center" role="status" aria-live="polite">
          <div className="mt-2 px-4 py-2 rounded border text-sm shadow bg-blue-600 text-white border-blue-500">
            {toast}
          </div>
        </div>
      ) : null}


      {/* Search */}
      <div className="mb-4 flex items-center">
        <div className="relative flex-1">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search movies to add..."
            className={
              `w-full pr-3 ${q.trim().length > 0 || results.length > 0 ? 'py-3 pl-9' : 'py-2 pl-9'} rounded border ` +
              (theme === "dark"
                ? "bg-gray-800 text-blue-100 border-gray-700 placeholder-gray-500"
                : "bg-white text-gray-800 border-gray-300 placeholder-gray-500")
            }
          />
          {q ? (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => { setQ(""); setResults([]); setError(null); }}
              className="absolute top-1/2 left-2 -translate-y-1/2 focus:outline-none cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={theme === 'dark' ? 'h-6 w-6 text-gray-400 hover:text-blue-200' : 'h-6 w-6 text-gray-300 hover:text-gray-900'}>
                <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm2.47 6.22a.75.75 0 0 0-1.06 0L12 9.88 10.59 8.47a.75.75 0 1 0-1.06 1.06L10.94 10.94 9.53 12.35a.75.75 0 1 0 1.06 1.06L12 12l1.41 1.41a.75.75 0 1 0 1.06-1.06L13.06 10.94l1.41-1.41a.75.75 0 0 0 0-1.06z" clipRule="evenodd" />
              </svg>
            </button>
          ) : null}
        </div>
        {loading ? (
          <div className={
            `ml-2 px-3 py-2 text-sm rounded border ` +
            (theme === "dark"
              ? "bg-gray-800 text-blue-200 border-gray-700"
              : "bg-gray-100 text-blue-700 border-gray-300")
          }>Searching...</div>
        ) : null}
      </div>
      {error ? (
        <div className={theme === "dark" ? "text-red-300 mb-2" : "text-red-600 mb-2"}>{error}</div>
      ) : null}
      {results.length > 0 ? (
        <div className="mb-6">
          <h3 className={theme === "dark" ? "text-blue-200 font-semibold mb-2" : "text-gray-800 font-semibold mb-2"}>Search Results</h3>
          <ul className="space-y-2">
            {results.map((r) => (
              <li key={r.tmdbId} className={theme === "dark" ? "bg-gray-800 rounded p-3" : "bg-gray-100 rounded p-3 text-gray-800"}>
                <div className="flex items-center gap-3">
                  {r.imageUrl ? <img src={r.imageUrl} alt="poster" className="w-10 h-14 object-cover rounded" /> : null}
                  <div className="flex-1">
                    <div className="font-medium">{r.title}{r.year ? ` (${r.year})` : ""}</div>
                    <div className="text-sm opacity-80 line-clamp-2">{r.overview}</div>
                  </div>
                  <button
                    type="button"
                    aria-label="Add"
                    onClick={() => handleAdd(r.tmdbId)}
                    className={
                      `px-3 py-1 rounded text-sm font-medium border bg-green-600 text-white border-green-600 hover:bg-green-700`
                    }
                  >+</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(items && items.length > 0 ? items : []).length === 0 ? (
          <div className={theme === "dark" ? "text-gray-400" : "text-gray-500"}>No movies found.</div>
        ) : (
          [...(items || [])]
            .sort((a, b) => String(a?.title ?? '').localeCompare(String(b?.title ?? ''), undefined, { sensitivity: 'base' }))
            .map(item => (
              <div key={item.id} className={theme === "dark" ? "bg-gray-800 rounded-lg p-4 shadow text-blue-100" : "bg-gray-100 rounded-lg p-4 shadow text-gray-800"}>
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={`${item.title} poster`} className="w-full h-auto rounded mb-2" />
                ) : null}
                <div className="flex items-center gap-2 mb-2">
                  {item.tmdbId ? (
                    <button
                      type="button"
                      aria-label="Remove"
                      onClick={() => handleRemove(item)}
                      className={
                        `w-6 h-6 flex items-center justify-center rounded-sm border text-white bg-red-600 border-white hover:bg-red-700`
                      }
                    >X</button>
                  ) : null}
                  <h3 className="text-lg font-bold">
                    {item.title}
                    {item.year ? ` (${item.year})` : ""}
                  </h3>
                </div>
                <p className="mb-2">{item.overview ?? item.body}</p>
                {Array.isArray(item.topCast) && item.topCast.length > 0 ? (
                  <p className="text-sm opacity-80">
                    <span className="font-semibold">Top cast:</span> {item.topCast.join(", ")}
                  </p>
                ) : null}
              </div>
            ))
        )}
      </div>
    </div>
  );
}
