// Global loading component with various loading states
import React, { useState, useEffect } from 'react';
import { 
  Box, 
  CircularProgress, 
  LinearProgress, 
  Typography, 
  Backdrop,
  Fade,
  Paper
} from '@mui/material';
import { Cloud, CloudOff } from '@mui/icons-material';

// Full-screen loading overlay
export const FullScreenLoader = ({ open, message = "Loading..." }) => (
  <Backdrop 
    sx={{ 
      color: '#fff', 
      zIndex: (theme) => theme.zIndex.drawer + 1,
      background: 'linear-gradient(135deg, rgba(0,92,191,0.9) 0%, rgba(0,112,243,0.9) 100%)'
    }} 
    open={open}
  >
    <Box sx={{ textAlign: 'center' }}>
      <CircularProgress 
        color="inherit" 
        size={60}
        thickness={4}
        sx={{ mb: 2 }}
      />
      <Typography variant="h6" sx={{ fontWeight: 500 }}>
        {message}
      </Typography>
    </Box>
  </Backdrop>
);

// Page transition loader
export const PageLoader = () => (
  <Box sx={{ 
    position: 'fixed', 
    top: 0, 
    left: 0, 
    right: 0, 
    zIndex: 9999 
  }}>
    <LinearProgress 
      sx={{ 
        height: 3,
        background: 'linear-gradient(90deg, #005cbf 0%, #0070f3 100%)'
      }} 
    />
  </Box>
);

// Content loading placeholder
export const ContentLoader = ({ 
  lines = 3, 
  width = "100%", 
  height = 200,
  message = "Loading content..."
}) => (
  <Paper sx={{ p: 3, textAlign: 'center', width, height, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
    <CircularProgress sx={{ mb: 2, mx: 'auto' }} />
    <Typography variant="body2" color="text.secondary">
      {message}
    </Typography>
  </Paper>
);

// Network status indicator
export const NetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [showStatus, setShowStatus] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowStatus(true);
      setTimeout(() => setShowStatus(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowStatus(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!showStatus) return null;

  return (
    <Fade in={showStatus}>
      <Paper
        sx={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          p: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          backgroundColor: isOnline ? 'success.main' : 'error.main',
          color: 'white',
          zIndex: 9999,
          borderRadius: 2
        }}
      >
        {isOnline ? <Cloud /> : <CloudOff />}
        <Typography variant="body2">
          {isOnline ? 'Back online' : 'No internet connection'}
        </Typography>
      </Paper>
    </Fade>
  );
};

// Loading context for global state management
export const LoadingContext = React.createContext({
  isLoading: false,
  setLoading: () => {},
  loadingMessage: '',
  setLoadingMessage: () => {}
});

export const LoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');

  const setLoading = (loading, message = 'Loading...') => {
    setIsLoading(loading);
    setLoadingMessage(message);
  };

  return (
    <LoadingContext.Provider value={{
      isLoading,
      setLoading,
      loadingMessage,
      setLoadingMessage
    }}>
      {children}
      <FullScreenLoader open={isLoading} message={loadingMessage} />
      <NetworkStatus />
    </LoadingContext.Provider>
  );
};

// Custom hook for using loading context
export const useLoading = () => {
  const context = React.useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};

// HOC for automatic loading states
export const withLoading = (WrappedComponent) => {
  return function WithLoadingComponent(props) {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      // Simulate component mounting delay
      const timer = setTimeout(() => setIsLoading(false), 100);
      return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
      return <ContentLoader />;
    }

    return <WrappedComponent {...props} />;
  };
};