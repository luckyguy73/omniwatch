"use client";

import React, { useState, useEffect } from "react";
import TvShowsTab from "../components/TvShowsTab";
import MoviesTab from "../components/MoviesTab";
import { seedTestData, fetchItemsByType } from "../lib/firestoreTest";

// Define the dashboard item type
export type DashboardItem = {
  id: string;
  type: "tv_show" | "movie";
  title: string;
  body: string;
};

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("tv");
  const [theme, setTheme] = useState("light");
  const [tvShows, setTvShows] = useState<DashboardItem[]>([]);
  const [movies, setMovies] = useState<DashboardItem[]>([]);

  useEffect(() => {
    // Skip Firestore calls in test environment to keep unit tests fast and isolated
    if (process.env.NODE_ENV === 'test') {
      return;
    }

    async function loadData() {
      const tv = await fetchItemsByType("tv_show");
      const mv = await fetchItemsByType("movie");
      if (tv.length === 0 && mv.length === 0) {
        await seedTestData();
        setTimeout(loadData, 1000);
        return;
      }
      setTvShows(tv);
      setMovies(mv);
    }
    loadData()
      .then(() => console.log('Data loaded'))
      .catch(err => console.error('Error loading data:', err));
  }, []);

  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

  return (
    <div
      className={
        `min-h-screen p-8 transition-colors duration-300 ` +
        (theme === "dark"
          ? "bg-gradient-to-br from-gray-900 to-gray-800"
          : "bg-gradient-to-br from-blue-50 to-gray-100")
      }
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1
            className={
              `text-4xl font-bold ${theme === "dark" ? "text-blue-200" : "text-blue-700"}`
            }
          >
            Omni Dashboard
          </h1>
          <button
            onClick={toggleTheme}
            className={
              `w-10 h-10 flex items-center justify-center rounded-full transition-colors duration-200 font-medium border text-xl shadow ` +
              (theme === "dark"
                ? "bg-gray-700 text-blue-200 border-gray-600 hover:bg-gray-600"
                : "bg-gray-200 text-blue-700 border-gray-300 hover:bg-gray-300")
            }
            aria-label="Toggle light/dark mode"
          >
            {theme === "dark" ? "🌙" : "☀️"}
          </button>
        </div>
        <div className="flex gap-4 mb-8">
          <button
            className={`px-6 py-2 rounded-t-lg font-medium transition-colors duration-200 border-b-2 ` +
              (activeTab === "tv"
                ? theme === "dark"
                  ? "bg-gray-900 text-blue-200 border-blue-400 shadow"
                  : "bg-white text-blue-700 border-blue-600 shadow"
                : theme === "dark"
                  ? "bg-gray-700 text-gray-300 border-transparent"
                  : "bg-gray-200 text-gray-600 border-transparent")}
            onClick={() => setActiveTab("tv")}
          >
            TV Shows
          </button>
          <button
            className={`px-6 py-2 rounded-t-lg font-medium transition-colors duration-200 border-b-2 ` +
              (activeTab === "movies"
                ? theme === "dark"
                  ? "bg-gray-900 text-blue-200 border-blue-400 shadow"
                  : "bg-white text-blue-700 border-blue-600 shadow"
                : theme === "dark"
                  ? "bg-gray-700 text-gray-300 border-transparent"
                  : "bg-gray-200 text-gray-600 border-transparent")}
            onClick={() => setActiveTab("movies")}
          >
            Movies
          </button>
        </div>
        <div
          className={
            `rounded-b-lg shadow p-6 transition-colors duration-300 ` +
            (theme === "dark" ? "bg-gray-900" : "bg-white")
          }
        >
          {activeTab === "tv" ? <TvShowsTab theme={theme} items={tvShows} /> : <MoviesTab theme={theme} items={movies} />}
        </div>
      </div>
    </div>
  );
}
