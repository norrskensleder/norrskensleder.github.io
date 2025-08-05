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

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
export const db = getFirestore(app);
