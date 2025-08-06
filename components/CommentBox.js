import { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import { collection, addDoc, query, orderBy, onSnapshot } from "firebase/firestore";

export default function CommentBox({ slug }) {
  const [comments, setComments] = useState([]);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "comments", slug, "items"), orderBy("created", "asc"));
    const unsub = onSnapshot(q, 
      (snap) => {
        setComments(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('Error loading comments:', err);
        setError('Failed to load comments. Please check your internet connection and try again.');
        setLoading(false);
      }
    );
    return () => unsub();
  }, [slug]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim() || !text.trim()) return;
    
    setSubmitting(true);
    setError(null);
    setSuccess(false);
    
    try {
      await addDoc(collection(db, "comments", slug, "items"), {
        name: name.trim(),
        text: text.trim(),
        created: Date.now(),
      });
      setText("");
      setSuccess(true);
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Error posting comment:', err);
      setError('Failed to post comment. Please check your internet connection and try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div style={{ margin: "2em 0", maxWidth: 600 }}>
      <h3>Comments</h3>
      
      {/* Error Message */}
      {error && (
        <div style={{ 
          padding: '12px', 
          marginBottom: '16px', 
          backgroundColor: '#ffebee', 
          color: '#c62828', 
          borderRadius: '4px',
          border: '1px solid #ef5350'
        }}>
          {error}
        </div>
      )}
      
      {/* Success Message */}
      {success && (
        <div style={{ 
          padding: '12px', 
          marginBottom: '16px', 
          backgroundColor: '#e8f5e8', 
          color: '#2e7d32', 
          borderRadius: '4px',
          border: '1px solid #4caf50'
        }}>
          Comment posted successfully!
        </div>
      )}
      
      <form onSubmit={handleSubmit} style={{ marginBottom: 16 }}>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Your name"
          required
          disabled={submitting}
          style={{ 
            marginRight: 8, 
            padding: 8, 
            borderRadius: 4, 
            border: '1px solid #ccc',
            opacity: submitting ? 0.6 : 1
          }}
        />
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Your comment"
          required
          disabled={submitting}
          style={{ 
            width: 300, 
            padding: 8,
            borderRadius: 4, 
            border: '1px solid #ccc',
            opacity: submitting ? 0.6 : 1
          }}
        />
        <button 
          type="submit" 
          disabled={submitting || !name.trim() || !text.trim()}
          style={{ 
            marginLeft: 8,
            padding: '8px 16px',
            borderRadius: 4,
            border: 'none',
            backgroundColor: submitting ? '#ccc' : '#005cbf',
            color: 'white',
            cursor: submitting ? 'not-allowed' : 'pointer',
            opacity: submitting ? 0.6 : 1
          }}
        >
          {submitting ? 'Posting...' : 'Post'}
        </button>
      </form>
      
      {loading ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <div>Loading comments...</div>
        </div>
      ) : error && comments.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '20px',
          backgroundColor: '#f5f5f5',
          borderRadius: '4px',
          color: '#666'
        }}>
          Unable to load comments. Please refresh the page to try again.
        </div>
      ) : comments.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '20px',
          backgroundColor: '#f9f9f9',
          borderRadius: '4px',
          color: '#666'
        }}>
          No comments yet. Be the first to share your thoughts!
        </div>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {comments.map((c, i) => (
            <li key={c.id || i} style={{ 
              marginBottom: 12, 
              background: '#f5f5f5', 
              padding: 12, 
              borderRadius: 6,
              border: '1px solid #e0e0e0'
            }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: 4
              }}>
                <b style={{ color: '#005cbf' }}>{c.name}</b>
                {c.created && (
                  <span style={{ 
                    fontSize: '12px', 
                    color: '#666',
                    fontStyle: 'italic'
                  }}>
                    {new Date(c.created).toLocaleDateString()}
                  </span>
                )}
              </div>
              <div>{c.text}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
