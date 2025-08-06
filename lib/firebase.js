import { initializeApp, getApps } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCPcfUYxD4RW3SI0LvsF_9NaSzCy98BahM",
  authDomain: "norrskensleder-blog.firebaseapp.com",
  projectId: "norrskensleder-blog",
  storageBucket: "norrskensleder-blog.firebasestorage.app",
  messagingSenderId: "380176904436",
  appId: "1:380176904436:web:ef9b7ff8ee2317be9caea1",
  measurementId: "G-F04L0DMFCB"
};

let app;
let db;

try {
  app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
  db = getFirestore(app);
  
  // Connect to Firestore emulator in development if available
  if (process.env.NODE_ENV === 'development' && !db._delegate._databaseId) {
    try {
      connectFirestoreEmulator(db, 'localhost', 8080);
    } catch (error) {
      // Emulator connection failed, continue with production Firebase
      console.log('Firestore emulator not available, using production Firebase');
    }
  }
} catch (error) {
  console.error('Failed to initialize Firebase:', error);
  // Create a mock db object to prevent app crashes
  db = null;
}

export { db };

// Firebase connection status checker
export function isFirebaseAvailable() {
  return db !== null;
}

// Firebase health check
export async function checkFirebaseConnection() {
  if (!db) {
    throw new Error('Firebase is not initialized');
  }
  
  try {
    // Simple read operation to test connection
    const { doc, getDoc } = await import('firebase/firestore');
    const testDoc = doc(db, '_health', 'check');
    await getDoc(testDoc);
    return true;
  } catch (error) {
    console.error('Firebase connection check failed:', error);
    throw error;
  }
}
