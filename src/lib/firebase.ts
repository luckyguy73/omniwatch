import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD3zNflH3tO0BuVsdTzf-kjbbTFbUok3jg",
  authDomain: "omni-b9463.firebaseapp.com",
  projectId: "omni-b9463",
  storageBucket: "omni-b9463.firebasestorage.app",
  messagingSenderId: "420867882133",
  appId: "1:420867882133:web:4e4e7555f082740894ef9c"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

