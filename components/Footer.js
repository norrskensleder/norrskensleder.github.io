// Enhanced Footer component with social links and better styling
import { Box, Typography, Container, Divider, IconButton, Tooltip, Link as MuiLink } from '@mui/material';
import {
  GitHub,
  Email,
  Favorite,
  Article as BlogIcon
} from '@mui/icons-material';
import { resetCookieConsent } from './CookieConsent';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  function handleResetConsent(e) {
    e.preventDefault();
    resetCookieConsent();
    window.location.reload();
  }

  return (
    <Box
      component="footer"
      sx={{
        mt: 8,
        py: 4,
        backgroundColor: 'grey.100',
        borderTop: '1px solid',
        borderColor: 'divider',
        textAlign: 'center'
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center' }}>
          {/* Brand and Description */}
          <Typography
            variant="h6"
            color="primary.main"
            gutterBottom
            sx={{ fontWeight: 'bold', mb: 1 }}
          >
            Norrskensleder
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 3, maxWidth: 500, mx: 'auto', lineHeight: 1.6 }}
          >
            Adventures, tech, and stories from a South Asian exploring Northern Europe.
            Sharing experiences of Nordic culture, drone photography, and travel discoveries.
          </Typography>

          {/* Social Links */}
          <Box sx={{ mb: 3 }}>
            <Tooltip title="Blog Posts">
              <IconButton
                color="primary"
                sx={{
                  mx: 1,
                  '&:hover': {
                    backgroundColor: 'primary.lighter',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                <BlogIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Contact">
              <IconButton
                color="primary"
                sx={{
                  mx: 1,
                  '&:hover': {
                    backgroundColor: 'primary.lighter',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                <Email />
              </IconButton>
            </Tooltip>
            <Tooltip title="GitHub">
              <IconButton
                color="primary"
                sx={{
                  mx: 1,
                  '&:hover': {
                    backgroundColor: 'primary.lighter',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                <GitHub />
              </IconButton>
            </Tooltip>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Copyright and Policy Links */}
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
            <Typography variant="body2" color="text.secondary">
              © {currentYear} Norrskensleder. Made with
            </Typography>
            <Favorite
              sx={{
                color: 'error.main',
                mx: 0.5,
                fontSize: 16,
                animation: 'heartbeat 2s ease-in-out infinite'
              }}
            />
            <Typography variant="body2" color="text.secondary">
              in Northern Europe
            </Typography>
          </Box>

          {/* Cookie and Privacy Policy Links */}
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            <MuiLink href="/privacy-policy" target="_blank" rel="noopener" underline="hover">Privacy Policy</MuiLink>
            &nbsp;|&nbsp;
            <MuiLink href="#" onClick={handleResetConsent} underline="hover">Change Cookie Settings</MuiLink>
          </Typography>

          {/* Additional Info */}
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mt: 1, display: 'block', fontStyle: 'italic' }}
          >
            Powered by Next.js & Material-UI
          </Typography>
        </Box>
      </Container>

      {/* CSS for heart animation */}
      <style jsx global>{`
        @keyframes heartbeat {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
      `}</style>
    </Box>
  );
}