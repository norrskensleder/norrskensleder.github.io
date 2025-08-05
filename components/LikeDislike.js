import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { doc, getDoc, setDoc, updateDoc, increment } from "firebase/firestore";

function getTodayKey(slug) {
  const today = new Date().toISOString().slice(0, 10);
  return `voted_${slug}_${today}`;
}

export default function LikeDislike({ slug }) {
  const [counts, setCounts] = useState({ like: 0, dislike: 0 });
  const [loading, setLoading] = useState(true);
  const [voted, setVoted] = useState(false);

  useEffect(() => {
    async function fetchCounts() {
      const ref = doc(db, "likes", slug);
      const snap = await getDoc(ref);
      if (snap.exists()) setCounts(snap.data());
      setLoading(false);
    }
    fetchCounts();
    setVoted(!!localStorage.getItem(getTodayKey(slug)));
  }, [slug]);

  async function handleVote(type) {
    if (voted) return;
    const ref = doc(db, "likes", slug);
    await setDoc(ref, { like: 0, dislike: 0 }, { merge: true });
    await updateDoc(ref, { [type]: increment(1) });
    const snap = await getDoc(ref);
    setCounts(snap.data());
    localStorage.setItem(getTodayKey(slug), "1");
    setVoted(true);
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ margin: "2em 0", textAlign: "center" }}>
      <button onClick={() => handleVote("like")} disabled={voted}>👍 {counts.like}</button>
      <button onClick={() => handleVote("dislike")} disabled={voted} style={{ marginLeft: 16 }}>👎 {counts.dislike}</button>
      {voted && <div style={{ marginTop: 8, color: '#888' }}>You already voted today.</div>}
    </div>
  );
}
