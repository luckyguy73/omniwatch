/**
 * Legacy data functions for global collections
 * Note: These are kept for backward compatibility but new code should use userdata.ts
 * for user-specific collections
 */

import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "./firebase";
import type { MovieDoc, TvShowDoc } from "./models";

/**
 * @deprecated Use fetchUserMovies from userdata.ts instead for user-specific data
 */
export async function fetchMovies(): Promise<(MovieDoc & { id: string })[]> {
  const ref = collection(db, "movies");
  const q = query(ref, orderBy("updatedAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as MovieDoc) }));
}

/**
 * @deprecated Use fetchUserTvShows from userdata.ts instead for user-specific data
 */
export async function fetchTvShows(): Promise<(TvShowDoc & { id: string })[]> {
  const ref = collection(db, "tv_shows");
  const q = query(ref, orderBy("updatedAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as TvShowDoc) }));
}
