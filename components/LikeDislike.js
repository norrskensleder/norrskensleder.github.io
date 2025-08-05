import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { doc, getDoc, setDoc, updateDoc, increment } from "firebase/firestore";

export default function LikeDislike({ slug }) {
  const [counts, setCounts] = useState({ like: 0, dislike: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCounts() {
      const ref = doc(db, "likes", slug);
      const snap = await getDoc(ref);
      if (snap.exists()) setCounts(snap.data());
      setLoading(false);
    }
    fetchCounts();
  }, [slug]);

  async function handleVote(type) {
    const ref = doc(db, "likes", slug);
    await setDoc(ref, { like: 0, dislike: 0 }, { merge: true });
    await updateDoc(ref, { [type]: increment(1) });
    const snap = await getDoc(ref);
    setCounts(snap.data());
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ margin: "2em 0", textAlign: "center" }}>
      <button onClick={() => handleVote("like")}>👍 {counts.like}</button>
      <button onClick={() => handleVote("dislike")} style={{ marginLeft: 16 }}>👎 {counts.dislike}</button>
    </div>
  );
}
