// Enhanced Next.js _app.js with error boundaries, accessibility, and loading states
import * as React from 'react';
import Head from 'next/head';
import { ThemeProvider, CssBaseline, createTheme } from '@mui/material';
import ErrorBoundary from '../components/ErrorBoundary';
import { LoadingProvider } from '../components/GlobalLoading';
import { SkipToMain } from '../components/Accessibility';
import SEO from '../components/SEO';
import { useRouter } from 'next/router';
import ScriptLoader from '../components/ScriptLoader';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#005cbf' }, // Nordic blue (Sweden/Finland)
    secondary: { main: '#d72828' }, // Red (Denmark/Norway/Iceland)
    background: { default: '#f5f7fa' }, // Light gray/white
    info: { main: '#ffd700' }, // Yellow (Sweden)
    success: { main: '#009b3a' }, // Green (Nordic nature)
  },
  components: {
    MuiChip: {
      styleOverrides: {
        root: {
          cursor: 'pointer',
          transition: 'background 0.2s',
          '&:hover': {
            backgroundColor: '#ffd700', // Yellow on hover
            color: '#005cbf',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          transition: 'box-shadow 0.2s, transform 0.2s',
          '&:hover': {
            boxShadow: '0 8px 32px 0 rgba(0,92,191,0.15)',
            transform: 'translateY(-4px) scale(1.03)',
          },
        },
      },
    },
    // Accessibility improvements
    MuiButton: {
      styleOverrides: {
        root: {
          '&:focus-visible': {
            outline: '2px solid #005cbf',
            outlineOffset: '2px',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '&.Mui-focused fieldset': {
              borderWidth: '2px',
            },
          },
        },
      },
    },
  },
  // Accessibility theme overrides
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    // Ensure minimum font sizes for accessibility
    body2: {
      fontSize: '0.875rem',
      '@media (max-width:600px)': {
        fontSize: '0.9rem',
      },
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
});

export default function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const isArticlePage = router.pathname === '/[slug]';
  return (
    <ErrorBoundary>
      <LoadingProvider>
        {!isArticlePage && <SEO />}
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <SkipToMain />
          <ScriptLoader />

          {/* Accessibility styles */}
          <style jsx global>{`
            /* Focus styles for accessibility */
            *:focus-visible {
              outline: 2px solid #005cbf;
              outline-offset: 2px;
            }

            /* Reduced motion preferences */
            @media (prefers-reduced-motion: reduce) {
              *, *::before, *::after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
              }
            }

            /* High contrast mode support */
            @media (prefers-contrast: high) {
              .MuiButton-root {
                border: 2px solid currentColor;
              }
            }

            /* Print styles */
            @media print {
              .no-print {
                display: none !important;
              }

              body {
                background: white !important;
                color: black !important;
              }
            }

            /* Screen reader only utility class */
            .sr-only {
              position: absolute;
              width: 1px;
              height: 1px;
              padding: 0;
              margin: -1px;
              overflow: hidden;
              clip: rect(0, 0, 0, 0);
              white-space: nowrap;
              border: 0;
            }

            /* Skip to main content styles */
            .skip-to-main {
              position: absolute;
              top: -40px;
              left: 8px;
              background: #005cbf;
              color: white;
              padding: 8px 16px;
              text-decoration: none;
              border-radius: 4px;
              z-index: 9999;
              transition: top 0.3s ease;
            }

            .skip-to-main:focus {
              top: 8px;
            }
          `}</style>

          <Component {...pageProps} />
        </ThemeProvider>
      </LoadingProvider>
    </ErrorBoundary>
  );
}
