import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { doc, getDoc, setDoc, updateDoc, increment } from "firebase/firestore";
import { 
  Box, 
  Button, 
  Typography, 
  Paper, 
  Alert, 
  CircularProgress,
  Fade,
  Chip,
  ButtonGroup,
  Skeleton
} from '@mui/material';
import { 
  ThumbUp, 
  ThumbDown, 
  ThumbUpOutlined, 
  ThumbDownOutlined,
  Error as ErrorIcon,
  CheckCircle
} from '@mui/icons-material';

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
        setError('Failed to load reactions');
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
    <Box sx={{ my: 4, textAlign: 'center' }}>
      <Paper sx={{ p: 3, borderRadius: 3, maxWidth: 400, mx: 'auto' }}>
        <Skeleton variant="text" width="40%" height={24} sx={{ mx: 'auto', mb: 2 }} />
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Skeleton variant="rectangular" width={100} height={40} sx={{ borderRadius: 2 }} />
          <Skeleton variant="rectangular" width={100} height={40} sx={{ borderRadius: 2 }} />
        </Box>
      </Paper>
    </Box>
  );

  return (
    <Box sx={{ my: 4, textAlign: 'center' }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 3, 
          borderRadius: 3, 
          maxWidth: 400, 
          mx: 'auto',
          backgroundColor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Typography variant="h6" gutterBottom sx={{ mb: 2, color: 'text.primary' }}>
          Was this helpful?
        </Typography>
        
        {/* Error Message */}
        {error && (
          <Fade in={!!error}>
            <Alert 
              severity="error" 
              icon={<ErrorIcon />}
              sx={{ mb: 2 }}
              onClose={() => setError(null)}
            >
              {error}
            </Alert>
          </Fade>
        )}
        
        {/* Voting Buttons */}
        <ButtonGroup 
          variant="contained" 
          size="large"
          sx={{ 
            mb: 2,
            boxShadow: 'none',
            '& .MuiButton-root': {
              borderRadius: '24px',
              px: 3,
              py: 1.5,
              minWidth: 120,
              fontWeight: 'bold'
            },
            '& .MuiButton-root:first-of-type': {
              borderTopRightRadius: 0,
              borderBottomRightRadius: 0,
              borderRight: '1px solid rgba(255,255,255,0.3)'
            },
            '& .MuiButton-root:last-of-type': {
              borderTopLeftRadius: 0,
              borderBottomLeftRadius: 0
            }
          }}
        >
          <Button
            onClick={() => handleVote("like")}
            disabled={voted || voting}
            startIcon={voting ? <CircularProgress size={20} color="inherit" /> : 
                     voted ? <ThumbUp /> : <ThumbUpOutlined />}
            sx={{
              backgroundColor: voted ? 'success.light' : 'success.main',
              color: 'success.contrastText',
              '&:hover': {
                backgroundColor: voted ? 'success.light' : 'success.dark'
              },
              '&:disabled': {
                backgroundColor: voted ? 'success.light' : 'action.disabledBackground',
                color: voted ? 'success.contrastText' : 'action.disabled'
              }
            }}
          >
            {counts.like || 0}
          </Button>
          
          <Button
            onClick={() => handleVote("dislike")}
            disabled={voted || voting}
            startIcon={voting ? <CircularProgress size={20} color="inherit" /> : 
                     voted ? <ThumbDown /> : <ThumbDownOutlined />}
            sx={{
              backgroundColor: voted ? 'error.light' : 'error.main',
              color: 'error.contrastText',
              '&:hover': {
                backgroundColor: voted ? 'error.light' : 'error.dark'
              },
              '&:disabled': {
                backgroundColor: voted ? 'error.light' : 'action.disabledBackground',
                color: voted ? 'error.contrastText' : 'action.disabled'
              }
            }}
          >
            {counts.dislike || 0}
          </Button>
        </ButtonGroup>
        
        {/* Status Messages */}
        {voted && (
          <Fade in={voted}>
            <Box>
              <Chip 
                icon={<CheckCircle />}
                label="Thanks for your feedback!"
                color="primary"
                variant="outlined"
                sx={{ mb: 1 }}
              />
              <Typography variant="body2" color="text.secondary">
                You can vote again tomorrow
              </Typography>
            </Box>
          </Fade>
        )}
        
        {voting && !voted && (
          <Typography variant="body2" color="primary.main" sx={{ fontStyle: 'italic' }}>
            Recording your feedback...
          </Typography>
        )}
        
        {/* Vote Count Summary */}
        {(counts.like > 0 || counts.dislike > 0) && (
          <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
            <Typography variant="caption" color="text.secondary">
              {counts.like + counts.dislike} total votes
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
}
