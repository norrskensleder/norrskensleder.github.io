// About page
import { Container, Typography } from '@mui/material';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function About() {
  return (
    <>
      <Navbar />
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>About</Typography>
        <Typography>
          At Norrskensleder, we explore Northern Europe and the wider continent, uncovering breathtaking landscapes, rich cultures, and forward-looking innovations. Blending travel and technology, our stories and discoveries invite you to experience Europe in all its beauty, diversity, and creativity.
        </Typography>
      </Container>
      <Footer />
    </>
  );
}