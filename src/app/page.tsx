"use client";

import { useAuth } from "@/lib/auth/AuthContext";
import { fetchUserMovies, fetchUserTvShows, getUserData, updateUserTheme } from "@/lib/firestore/userdata";
import { useEffect, useState } from "react";
import MoviesTab from "../components/MoviesTab";
import ProtectedRoute from "../components/ProtectedRoute";
import TvShowsTab from "../components/TvShowsTab";
import UserProfile from "../components/UserProfile";

// Define the dashboard item type
export type DashboardItem = {
  id: string;
  type: "tv_show" | "movie";
  title: string;
  body: string;
};

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("tv");
  const [theme, setTheme] = useState<'light' | 'dark'>("dark");
  const [tvShows, setTvShows] = useState<DashboardItem[]>([]);
  const [movies, setMovies] = useState<DashboardItem[]>([]);
  const { user } = useAuth();

  async function reload() {
    if (!user) return;
    
    const [tv, mv] = await Promise.all([
      fetchUserTvShows(user),
      fetchUserMovies(user),
    ]);
    // Casting to any to keep compatibility with current component prop types
    setTvShows(tv as any);
    setMovies(mv as any);
  }

  // Load user's theme preference
  useEffect(() => {
    if (!user) return;
    
    getUserData(user)
      .then(userData => setTheme(userData.theme === 'system' ? 'dark' : userData.theme))
      .catch(err => console.error('Error loading user theme:', err));
  }, [user]);

  useEffect(() => {
    // Skip Firestore calls in the test environment to keep unit tests fast and isolated
    if (process.env.NODE_ENV === 'test' || !user) {
      return;
    }
    reload()
      .then(() => console.log('Data loaded'))
      .catch(err => console.error('Error loading data:', err));
  }, [user]); // Re-run when user changes

  const toggleTheme = async () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    
    if (user) {
      try {
        await updateUserTheme(user, newTheme);
      } catch (err) {
        console.error('Error saving theme:', err);
      }
    }
  };

  return (
    <ProtectedRoute theme={theme}>
      <div
        className={
          `min-h-screen p-4 sm:p-6 md:p-8 transition-colors duration-300 ` +
          (theme === "dark"
            ? "bg-gradient-to-br from-gray-900 to-gray-800"
            : "bg-gradient-to-br from-blue-50 to-gray-100")
        }
      >
        <div className="max-w-4xl mx-auto">
          <div className="relative flex justify-center items-center mb-8">
            <h1
              className={
                `text-3xl sm:text-4xl font-bold ${theme === "dark" ? "text-blue-200" : "text-blue-700"}`
              }
            >
              OmniWatch
            </h1>
            <div className="absolute right-0 flex items-center gap-3">
              <UserProfile theme={theme} onThemeToggle={toggleTheme} />
            </div>
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
          {activeTab === "tv" ? <TvShowsTab theme={theme} items={tvShows} onDataChanged={reload} /> : <MoviesTab theme={theme} items={movies} onDataChanged={reload} />}
        </div>
      </div>
    </div>
    </ProtectedRoute>
  );
}
