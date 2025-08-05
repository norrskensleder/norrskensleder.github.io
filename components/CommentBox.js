import { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import { collection, addDoc, query, orderBy, onSnapshot } from "firebase/firestore";

export default function CommentBox({ slug }) {
  const [comments, setComments] = useState([]);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "comments", slug, "items"), orderBy("created", "asc"));
    const unsub = onSnapshot(q, (snap) => {
      setComments(snap.docs.map(doc => doc.data()));
      setLoading(false);
    });
    return () => unsub();
  }, [slug]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim() || !text.trim()) return;
    await addDoc(collection(db, "comments", slug, "items"), {
      name: name.trim(),
      text: text.trim(),
      created: Date.now(),
    });
    setText("");
  }

  return (
    <div style={{ margin: "2em 0", maxWidth: 600 }}>
      <h3>Comments</h3>
      <form onSubmit={handleSubmit} style={{ marginBottom: 16 }}>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Your name"
          style={{ marginRight: 8, padding: 4 }}
        />
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Your comment"
          style={{ width: 300, padding: 4 }}
        />
        <button type="submit" style={{ marginLeft: 8 }}>Post</button>
      </form>
      {loading ? <div>Loading...</div> : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {comments.map((c, i) => (
            <li key={i} style={{ marginBottom: 12, background: '#f5f5f5', padding: 8, borderRadius: 6 }}>
              <b>{c.name}</b>: {c.text}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
