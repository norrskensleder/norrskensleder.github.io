// React Error Boundary component for graceful error handling
import React from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Paper, 
  Alert,
  Container,
  Stack
} from '@mui/material';
import { 
  ErrorOutline, 
  Refresh, 
  Home,
  BugReport
} from '@mui/icons-material';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      errorId: null
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { 
      hasError: true,
      errorId: Date.now().toString(36) + Math.random().toString(36).substr(2)
    };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details for debugging
    console.error('Error Boundary caught an error:', error, errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Report error to monitoring service in production
    if (process.env.NODE_ENV === 'production') {
      this.reportError(error, errorInfo);
    }
  }

  reportError = (error, errorInfo) => {
    // In production, send error to monitoring service
    const errorReport = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      errorId: this.state.errorId,
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString()
    };

    // Example: Send to error monitoring service
    // fetch('/api/error-report', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(errorReport)
    // });

    console.warn('Error reported:', errorReport);
  };

  handleRetry = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null,
      errorId: null
    });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      // Custom error UI
      const isDevelopment = process.env.NODE_ENV === 'development';
      
      return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
          <Paper 
            elevation={3}
            sx={{ 
              p: 4, 
              textAlign: 'center',
              borderRadius: 3,
              background: 'linear-gradient(135deg, #ffebee 0%, #fce4ec 100%)'
            }}
          >
            <ErrorOutline 
              sx={{ 
                fontSize: 64, 
                color: 'error.main', 
                mb: 2,
                animation: 'pulse 2s ease-in-out infinite'
              }} 
            />
            
            <Typography variant="h4" gutterBottom color="error.main" fontWeight="bold">
              Oops! Something went wrong
            </Typography>
            
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3, lineHeight: 1.6 }}>
              We're sorry, but something unexpected happened. Don't worry, our team has been notified 
              and we're working to fix this issue.
            </Typography>

            {this.state.errorId && (
              <Alert 
                severity="info" 
                sx={{ mb: 3, textAlign: 'left' }}
                icon={<BugReport />}
              >
                <Typography variant="body2">
                  <strong>Error ID:</strong> {this.state.errorId}
                  <br />
                  Please include this ID when reporting the issue.
                </Typography>
              </Alert>
            )}

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
              <Button
                variant="contained"
                startIcon={<Refresh />}
                onClick={this.handleRetry}
                sx={{ 
                  borderRadius: 2,
                  px: 3,
                  py: 1
                }}
              >
                Try Again
              </Button>
              
              <Button
                variant="outlined"
                startIcon={<Home />}
                onClick={this.handleGoHome}
                sx={{ 
                  borderRadius: 2,
                  px: 3,
                  py: 1
                }}
              >
                Go Home
              </Button>
            </Stack>

            {/* Development mode: Show error details */}
            {isDevelopment && this.state.error && (
              <Box sx={{ mt: 4, textAlign: 'left' }}>
                <Typography variant="h6" color="error.main" gutterBottom>
                  Development Error Details:
                </Typography>
                <Paper sx={{ p: 2, backgroundColor: 'grey.100', overflow: 'auto' }}>
                  <Typography variant="body2" component="pre" sx={{ fontSize: '0.8rem' }}>
                    {this.state.error.toString()}
                    {this.state.errorInfo.componentStack}
                  </Typography>
                </Paper>
              </Box>
            )}
          </Paper>

          {/* CSS for error icon animation */}
          <style jsx global>{`
            @keyframes pulse {
              0% { opacity: 1; }
              50% { opacity: 0.5; }
              100% { opacity: 1; }
            }
          `}</style>
        </Container>
      );
    }

    return this.props.children;
  }
}

// Higher-order component for wrapping components with error boundary
export const withErrorBoundary = (WrappedComponent, errorBoundaryProps = {}) => {
  const WithErrorBoundaryComponent = (props) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <WrappedComponent {...props} />
    </ErrorBoundary>
  );

  WithErrorBoundaryComponent.displayName = `withErrorBoundary(${WrappedComponent.displayName || WrappedComponent.name})`;
  
  return WithErrorBoundaryComponent;
};

export default ErrorBoundary;