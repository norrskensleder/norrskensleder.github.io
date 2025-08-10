import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCPcfUYxD4RW3SI0LvsF_9NaSzCy98BahM",
  authDomain: "norrskensleder-blog.firebaseapp.com",
  projectId: "norrskensleder-blog",
  storageBucket: "norrskensleder-blog.firebasestorage.app",
  messagingSenderId: "380176904436",
  appId: "1:380176904436:web:ef9b7ff8ee2317be9caea1",
  measurementId: "G-F04L0DMFCB"
};

let db = null;

try {
  const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
  db = getFirestore(app);
} catch (error) {
  console.warn("Firebase failed to initialize, continuing without database:", error.message);
}

export { db };

// Helper: safe Firestore read
export async function safeGetDoc(pathArray) {
  if (!db) return null;
  try {
    const { doc, getDoc } = await import("firebase/firestore");
    const ref = doc(db, ...pathArray);
    const snapshot = await getDoc(ref);
    return snapshot.exists() ? snapshot.data() : null;
  } catch (error) {
    console.warn("Firestore request failed, skipping:", error.message);
    return null;
  }
}

// Optional: simple connection checker that never throws
export async function checkFirebaseConnection() {
  if (!db) return false;
  try {
    const { doc, getDoc } = await import("firebase/firestore");
    const testDoc = doc(db, "_health", "check");
    await getDoc(testDoc);
    return true;
  } catch (error) {
    console.warn("Firebase connection check failed:", error.message);
    return false;
  }
}
