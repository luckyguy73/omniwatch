import { db } from "./firebase";
import { collection, doc, getDoc, setDoc, updateDoc, serverTimestamp, deleteDoc } from "firebase/firestore";

export type MovieDoc = {
  tmdbId: number;
  title: string;
  year?: number;
  overview?: string;
  topCast?: string[];
  imageUrl?: string;
  rating?: number;
  isFavorite?: boolean;
  createdAt?: any;
  updatedAt?: any;
};

export type TvShowDoc = {
  tmdbId: number;
  title: string;
  description?: string;
  imageUrl?: string;
  rating?: number;
  seasonNumber?: number;
  episodeNumber?: number;
  episodeTitle?: string;
  episodeDescription?: string;
  // Additional TV metadata from TMDB
  networks?: string[];
  status?: string;
  firstAirDate?: string;
  lastAirDate?: string;
  nextAirDate?: string;
  createdAt?: any;
  updatedAt?: any;
};

export function movieDocFromTMDB(data: any): MovieDoc {
  return {
    tmdbId: Number(data?.tmdbId ?? data?.id),
    title: String(data?.title ?? data?.name ?? "Untitled"),
    year: typeof data?.year === "number" ? data.year : (typeof data?.release_date === "string" && data.release_date.length >= 4 ? Number(data.release_date.slice(0, 4)) : undefined),
    overview: data?.overview ?? "",
    topCast: Array.isArray(data?.topCast) ? data.topCast : [],
    imageUrl: data?.imageUrl ?? (typeof data?.poster_path === "string" && data.poster_path ? `https://image.tmdb.org/t/p/w500${data.poster_path}` : undefined),
    rating: typeof data?.rating === 'number' ? data.rating : (typeof data?.vote_average === 'number' ? Number(data.vote_average) : undefined),
    isFavorite: Boolean(data?.isFavorite ?? false),
  };
}

export async function upsertMovie(docData: MovieDoc): Promise<void> {
  const ref = doc(collection(db, "movies"), String(docData.tmdbId));
  const now = serverTimestamp();
  const snapshot = await getDoc(ref);
  if (snapshot.exists()) {
    await updateDoc(ref, { ...docData, updatedAt: now });
  } else {
    await setDoc(ref, { ...docData, createdAt: now, updatedAt: now });
  }
}

export async function deleteMovie(tmdbId: number): Promise<void> {
  const ref = doc(collection(db, "movies"), String(tmdbId));
  await deleteDoc(ref);
}

export async function upsertTvShow(docData: TvShowDoc): Promise<void> {
  const ref = doc(collection(db, "tv_shows"), String(docData.tmdbId));
  const now = serverTimestamp();
  const snapshot = await getDoc(ref);
  if (snapshot.exists()) {
    await updateDoc(ref, { ...docData, updatedAt: now });
  } else {
    await setDoc(ref, { ...docData, createdAt: now, updatedAt: now });
  }
}


export async function deleteTvShow(tmdbId: number): Promise<void> {
  const ref = doc(collection(db, "tv_shows"), String(tmdbId));
  await deleteDoc(ref);
}
