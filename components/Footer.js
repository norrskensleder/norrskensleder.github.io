// Simple Footer component
import { Box, Typography } from '@mui/material';

export default function Footer() {
  return (
    <Box sx={{ mt: 8, py: 3, textAlign: 'center', bgcolor: 'background.paper' }}>
      <Typography variant="body2" color="text.secondary">
        © {new Date().getFullYear()} Experience Blog
      </Typography>
    </Box>
  );
}