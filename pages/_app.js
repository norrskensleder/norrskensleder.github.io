// Next.js custom _app.js to include Material UI theme provider
import * as React from 'react';
import Head from 'next/head';
import { ThemeProvider, CssBaseline, createTheme } from '@mui/material';

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
  },
});

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>norrskensleder</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <link rel="icon" href="/norrskensleder/favicon.ico" />
        <link rel="apple-touch-icon" href="/norrskensleder/apple-touch-icon.png" />
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  );
}
