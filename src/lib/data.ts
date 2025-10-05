import { db } from "./firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import type { MovieDoc, TvShowDoc } from "./models";

export async function fetchMovies(): Promise<(MovieDoc & { id: string })[]> {
  const ref = collection(db, "movies");
  const q = query(ref, orderBy("updatedAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
}

export async function fetchTvShows(): Promise<(TvShowDoc & { id: string })[]> {
  const ref = collection(db, "tv_shows");
  const q = query(ref, orderBy("updatedAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
}
