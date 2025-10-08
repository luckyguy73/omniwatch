import { User } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "./firebase";
import { fetchMovies, fetchTvShows } from "./data";
import type { MovieDoc, TvShowDoc } from "./models";

export interface UserData {
  movieIds: number[];
  tvShowIds: number[];
  theme: 'light' | 'dark' | 'system';
}

/**
 * Get user's data, creating document if it doesn't exist
 */
export async function getUserData(user: User): Promise<UserData> {
  const userRef = doc(db, 'users', user.uid);
  const userSnap = await getDoc(userRef);
  
  if (userSnap.exists()) {
    const data = userSnap.data();
    return {
      movieIds: data.movieIds || [],
      tvShowIds: data.tvShowIds || [],
      theme: data.theme || 'dark'
    };
  } else {
    // Create new user document with defaults
    const defaultData: UserData = {
      movieIds: [],
      tvShowIds: [],
      theme: 'dark'
    };
    await setDoc(userRef, defaultData);
    return defaultData;
  }
}

/**
 * Add movie ID to user's watchlist
 */
export async function addMovieToUser(user: User, tmdbId: number): Promise<void> {
  const userRef = doc(db, 'users', user.uid);
  await updateDoc(userRef, {
    movieIds: arrayUnion(tmdbId)
  });
}

/**
 * Remove movie ID from user's watchlist
 */
export async function removeMovieFromUser(user: User, tmdbId: number): Promise<void> {
  const userRef = doc(db, 'users', user.uid);
  await updateDoc(userRef, {
    movieIds: arrayRemove(tmdbId)
  });
}

/**
 * Add TV show ID to user's watchlist
 */
export async function addTvShowToUser(user: User, tmdbId: number): Promise<void> {
  const userRef = doc(db, 'users', user.uid);
  await updateDoc(userRef, {
    tvShowIds: arrayUnion(tmdbId)
  });
}

/**
 * Remove TV show ID from user's watchlist
 */
export async function removeTvShowFromUser(user: User, tmdbId: number): Promise<void> {
  const userRef = doc(db, 'users', user.uid);
  await updateDoc(userRef, {
    tvShowIds: arrayRemove(tmdbId)
  });
}

/**
 * Update user's theme preference
 */
export async function updateUserTheme(user: User, theme: 'light' | 'dark' | 'system'): Promise<void> {
  const userRef = doc(db, 'users', user.uid);
  await updateDoc(userRef, {
    theme: theme
  });
}

/**
 * Fetch user's movies (only movies they've added)
 */
export async function fetchUserMovies(user: User): Promise<(MovieDoc & { id: string })[]> {
  const userData = await getUserData(user);
  if (userData.movieIds.length === 0) return [];
  
  const allMovies = await fetchMovies();
  return allMovies.filter(movie => userData.movieIds.includes(movie.tmdbId));
}

/**
 * Fetch user's TV shows (only shows they've added)
 */
export async function fetchUserTvShows(user: User): Promise<(TvShowDoc & { id: string })[]> {
  const userData = await getUserData(user);
  if (userData.tvShowIds.length === 0) return [];
  
  const allTvShows = await fetchTvShows();
  return allTvShows.filter(show => userData.tvShowIds.includes(show.tmdbId));
}