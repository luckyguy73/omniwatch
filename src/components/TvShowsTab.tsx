import React, { useState } from 'react';
import { searchTvShows, fetchTvShowFromTMDB } from "../lib/tmdbClient";
import { upsertTvShow } from "../lib/models";

export default function TvShowsTab({ theme, items = [], onDataChanged }: { theme: string; items?: any[]; onDataChanged?: () => void }) {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const term = q.trim();
    if (!term) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const data = await searchTvShows(term);
      setResults(data.results || []);
    } catch (err: any) {
      setError(err?.message ?? "Search failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleAdd(tmdbId: number) {
    try {
      const show = await fetchTvShowFromTMDB(tmdbId);
      await upsertTvShow(show);
      showToast(`Added: ${show.title}`);
      onDataChanged?.();
    } catch (err: any) {
      showToast(`Add failed: ${err?.message ?? "Unknown error"}`);
    }
  }

  return (
    <div>
      <h2 className={`text-xl font-semibold mb-4 ${theme === "dark" ? "text-blue-200" : "text-gray-800"}`}>Your TV Shows</h2>

      {toast ? (
        <div className={
          `mb-4 px-3 py-2 rounded border text-sm ` +
          (theme === "dark"
            ? "bg-gray-800 text-blue-200 border-gray-700"
            : "bg-blue-50 text-blue-800 border-blue-200")
        } role="status" aria-live="polite">{toast}</div>
      ) : null}

      {/* Search */}
      <form onSubmit={handleSearch} className="mb-4 flex gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search TV shows to add..."
          className={
            `flex-1 px-3 py-2 rounded border ` +
            (theme === "dark"
              ? "bg-gray-800 text-blue-100 border-gray-700 placeholder-gray-500"
              : "bg-white text-gray-800 border-gray-300 placeholder-gray-500")
          }
        />
        <button
          type="submit"
          disabled={loading}
          className={
            `px-4 py-2 rounded font-medium border shadow ` +
            (theme === "dark"
              ? "bg-gray-800 text-blue-200 border-gray-700 hover:bg-gray-700 disabled:opacity-60"
              : "bg-gray-100 text-blue-700 border-gray-300 hover:bg-gray-200 disabled:opacity-60")
          }
        >{loading ? "Searching..." : "Search"}</button>
      </form>
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
                    <div className="font-medium">{r.title}</div>
                    <div className="text-sm opacity-80 line-clamp-2">{r.overview}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleAdd(r.tmdbId)}
                    className={
                      `px-3 py-1 rounded text-sm font-medium border ` +
                      (theme === "dark" ? "bg-gray-700 text-blue-200 border-gray-600 hover:bg-gray-600" : "bg-white text-blue-700 border-gray-300 hover:bg-gray-200")
                    }
                  >Add</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.length === 0 ? (
          <div className={theme === "dark" ? "text-gray-400" : "text-gray-500"}>No TV shows found.</div>
        ) : (
          items.map(item => (
            <div key={item.id} className={theme === "dark" ? "bg-gray-800 rounded-lg p-4 shadow text-blue-100" : "bg-gray-100 rounded-lg p-4 shadow text-gray-800"}>
              {item.imageUrl ? (
                <img src={item.imageUrl} alt={`${item.title} poster`} className="w-full h-auto rounded mb-2" />
              ) : null}
              <h3 className="text-lg font-bold mb-2">{item.title}</h3>
              <p className="mb-2">{item.description ?? item.body}</p>
              {(item.seasonNumber || item.episodeNumber || item.episodeTitle) ? (
                <p className="text-sm opacity-80">S{item.seasonNumber ?? "?"} • E{item.episodeNumber ?? "?"} {item.episodeTitle ? `– ${item.episodeTitle}` : ""}</p>
              ) : null}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
