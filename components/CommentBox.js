import { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import { collection, addDoc, query, orderBy, onSnapshot } from "firebase/firestore";
import {
  Box,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Paper,
  Alert,
  CircularProgress,
  Divider,
  Chip,
  Fade,
  Skeleton
} from '@mui/material';
import {
  Send,
  Comment,
  Person,
  CheckCircle,
  Error as ErrorIcon
} from '@mui/icons-material';

export default function CommentBox({ slug }) {
  const [comments, setComments] = useState([]);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!db) {
      setLoading(false);
      setComments([]);
      return;
    }
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
    if (!db) {
      setError('Commenting is disabled in development mode.');
      return;
    }
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
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Error posting comment:', err);
      setError('Failed to post comment. Please check your internet connection and try again.');
    } finally {
      setSubmitting(false);
    }
  }

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Box sx={{ mt: 4, maxWidth: 800, mx: 'auto' }}>
      {/* Header with Icon */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Comment sx={{ mr: 1, color: 'primary.main' }} />
        <Typography variant="h5" component="h3" color="primary.main">
          Comments ({comments.length})
        </Typography>
      </Box>

      {/* Success Message */}
      <Fade in={success}>
        <Alert
          severity="success"
          icon={<CheckCircle />}
          sx={{ mb: 2 }}
          onClose={() => setSuccess(false)}
        >
          Comment posted successfully!
        </Alert>
      </Fade>

      {/* Error Message */}
      {error && (
        <Alert
          severity="error"
          icon={<ErrorIcon />}
          sx={{ mb: 2 }}
          onClose={() => setError(null)}
        >
          {error}
        </Alert>
      )}

      {/* Comment Form */}
      <Paper
        elevation={2}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 3,
          backgroundColor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <Person sx={{ mr: 1 }} />
          Join the conversation
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Your name"
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            fullWidth
            disabled={submitting}
            sx={{ backgroundColor: 'background.default' }}
            InputProps={{
              startAdornment: <Person sx={{ mr: 1, color: 'text.secondary' }} />
            }}
          />

          <TextField
            label="Your comment"
            variant="outlined"
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
            multiline
            rows={3}
            fullWidth
            disabled={submitting}
            sx={{ backgroundColor: 'background.default' }}
            placeholder="Share your thoughts..."
          />

          <Button
            type="submit"
            variant="contained"
            disabled={submitting || !name.trim() || !text.trim()}
            startIcon={submitting ? <CircularProgress size={20} color="inherit" /> : <Send />}
            sx={{
              alignSelf: 'flex-end',
              borderRadius: 2,
              px: 3,
              py: 1
            }}
          >
            {submitting ? 'Posting...' : 'Post Comment'}
          </Button>
        </Box>
      </Paper>

      {/* Comments List */}
      {loading ? (
        <Box sx={{ mt: 2 }}>
          {[...Array(3)].map((_, i) => (
            <Paper key={i} sx={{ p: 2, mb: 2, borderRadius: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <Skeleton variant="circular" width={40} height={40} />
                <Box sx={{ flex: 1 }}>
                  <Skeleton variant="text" width="30%" height={20} />
                  <Skeleton variant="text" width="100%" height={16} />
                  <Skeleton variant="text" width="80%" height={16} />
                </Box>
              </Box>
            </Paper>
          ))}
        </Box>
      ) : error && comments.length === 0 ? (
        <Paper sx={{
          p: 4,
          textAlign: 'center',
          backgroundColor: 'error.lighter',
          borderRadius: 3
        }}>
          <ErrorIcon sx={{ fontSize: 48, color: 'error.main', mb: 2 }} />
          <Typography variant="h6" color="error.main" gutterBottom>
            Unable to load comments
          </Typography>
          <Typography color="text.secondary">
            Please refresh the page to try again.
          </Typography>
        </Paper>
      ) : comments.length === 0 ? (
        <Paper sx={{
          p: 4,
          textAlign: 'center',
          backgroundColor: 'grey.50',
          borderRadius: 3,
          border: '1px dashed',
          borderColor: 'grey.300'
        }}>
          <Comment sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No comments yet
          </Typography>
          <Typography color="text.secondary">
            Be the first to share your thoughts!
          </Typography>
        </Paper>
      ) : (
        <List sx={{
          backgroundColor: 'background.paper',
          borderRadius: 3,
          overflow: 'hidden',
          border: '1px solid',
          borderColor: 'divider'
        }}>
          {comments.map((comment, index) => (
            <Box key={comment.id || index}>
              <ListItem
                alignItems="flex-start"
                sx={{
                  py: 2,
                  '&:hover': {
                    backgroundColor: 'action.hover'
                  }
                }}
              >
                <ListItemAvatar>
                  <Avatar sx={{
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                    fontWeight: 'bold'
                  }}>
                    {getInitials(comment.name)}
                  </Avatar>
                </ListItemAvatar>

                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.5 }}>
                      <Typography component="span" variant="subtitle2" color="primary.main" fontWeight="bold">
                        {comment.name}
                      </Typography>
                      {comment.created && (
                        <Chip
                          label={formatDate(comment.created)}
                          size="small"
                          variant="outlined"
                          sx={{
                            height: 20,
                            fontSize: '0.75rem',
                            color: 'text.secondary',
                            borderColor: 'divider'
                          }}
                        />
                      )}
                    </Box>
                  }
                  secondary={
                    <Typography
                      component="div"
                      variant="body2"
                      color="text.primary"
                      sx={{
                        mt: 1,
                        lineHeight: 1.6,
                        wordBreak: 'break-word'
                      }}
                    >
                      {comment.text}
                    </Typography>
                  }
                />
              </ListItem>
              {index < comments.length - 1 && <Divider variant="inset" component="li" />}
            </Box>
          ))}
        </List>
      )}
    </Box>
  );
}
