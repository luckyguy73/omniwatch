import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY as string,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN as string,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID as string,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET as string,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID as string,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID as string,
};

// Initialize Firebase (avoid re-initialization in development HMR)
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Export Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);

// Configure Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
  // Reduce popup-related warnings
  display: 'popup'
});
