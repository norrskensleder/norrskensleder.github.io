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
  const [voting, setVoting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCounts() {
      try {
        const ref = doc(db, "likes", slug);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setCounts(snap.data());
        }
        setError(null);
      } catch (err) {
        console.error('Error fetching like counts:', err);
        setError('Failed to load like counts');
      } finally {
        setLoading(false);
      }
    }
    
    fetchCounts();
    
    // Check if user has voted today (with error handling for localStorage)
    try {
      setVoted(!!localStorage.getItem(getTodayKey(slug)));
    } catch (err) {
      console.warn('localStorage not available:', err);
      setVoted(false);
    }
  }, [slug]);

  async function handleVote(type) {
    if (voted || voting) return;
    
    setVoting(true);
    setError(null);
    
    try {
      const ref = doc(db, "likes", slug);
      await setDoc(ref, { like: 0, dislike: 0 }, { merge: true });
      await updateDoc(ref, { [type]: increment(1) });
      const snap = await getDoc(ref);
      setCounts(snap.data());
      
      // Save vote to localStorage with error handling
      try {
        localStorage.setItem(getTodayKey(slug), "1");
      } catch (err) {
        console.warn('Cannot save to localStorage:', err);
      }
      
      setVoted(true);
    } catch (err) {
      console.error('Error voting:', err);
      setError('Failed to record your vote. Please try again.');
    } finally {
      setVoting(false);
    }
  }

  if (loading) return (
    <div style={{ margin: "2em 0", textAlign: "center" }}>
      <div>Loading reactions...</div>
    </div>
  );

  return (
    <div style={{ margin: "2em 0", textAlign: "center" }}>
      {/* Error Message */}
      {error && (
        <div style={{ 
          padding: '8px 12px', 
          marginBottom: '12px', 
          backgroundColor: '#ffebee', 
          color: '#c62828', 
          borderRadius: '4px',
          border: '1px solid #ef5350',
          fontSize: '14px'
        }}>
          {error}
        </div>
      )}
      
      <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
        <button 
          onClick={() => handleVote("like")} 
          disabled={voted || voting}
          style={{
            padding: '8px 16px',
            border: 'none',
            borderRadius: '20px',
            backgroundColor: voted ? '#e0e0e0' : voting ? '#f0f0f0' : '#e8f5e8',
            color: voted ? '#666' : voting ? '#999' : '#2e7d32',
            cursor: (voted || voting) ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            transition: 'all 0.2s',
            opacity: voting ? 0.6 : 1
          }}
        >
          👍 {counts.like} {voting && '...'}
        </button>
        
        <button 
          onClick={() => handleVote("dislike")} 
          disabled={voted || voting}
          style={{
            padding: '8px 16px',
            border: 'none',
            borderRadius: '20px',
            backgroundColor: voted ? '#e0e0e0' : voting ? '#f0f0f0' : '#ffebee',
            color: voted ? '#666' : voting ? '#999' : '#c62828',
            cursor: (voted || voting) ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            transition: 'all 0.2s',
            opacity: voting ? 0.6 : 1
          }}
        >
          👎 {counts.dislike} {voting && '...'}
        </button>
      </div>
      
      {voted && (
        <div style={{ 
          marginTop: 12, 
          color: '#666',
          fontSize: '14px',
          fontStyle: 'italic'
        }}>
          Thanks for your feedback! You can vote again tomorrow.
        </div>
      )}
      
      {voting && (
        <div style={{ 
          marginTop: 8, 
          color: '#005cbf',
          fontSize: '14px'
        }}>
          Recording your vote...
        </div>
      )}
    </div>
  );
}
