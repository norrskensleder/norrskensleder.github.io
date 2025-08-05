import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";



const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
export const db = getFirestore(app);
