import { db } from "./firebase";
import { collection, addDoc, getDocs, query, where, DocumentData } from "firebase/firestore";
import type { DashboardItem } from "../app/page";

export async function seedTestData() {
  // Write two test records
  await addDoc(collection(db, "dashboard_items"), {
    type: "tv_show",
    title: "Love Island",
    body: "A group of singles come together in a villa, looking for love and competing in challenges."
  });
  await addDoc(collection(db, "dashboard_items"), {
    type: "movie",
    title: "Friday the 13th",
    body: "A group of camp counselors are stalked by a mysterious killer at Camp Crystal Lake."
  });
}

function toDashboardItem(doc: DocumentData): DashboardItem {
  // Ensure all required fields are present
  return {
    id: doc.id,
    type: doc.data().type ?? "tv_show",
    title: doc.data().title ?? "Untitled",
    body: doc.data().body ?? "No description."
  };
}

export async function fetchDashboardItems(): Promise<DashboardItem[]> {
  // Fetch all dashboard items
  const snapshot = await getDocs(collection(db, "dashboard_items"));
  return snapshot.docs.map(doc => toDashboardItem(doc));
}

export async function fetchItemsByType(type: "tv_show" | "movie"): Promise<DashboardItem[]> {
  const q = query(collection(db, "dashboard_items"), where("type", "==", type));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => toDashboardItem(doc));
}
