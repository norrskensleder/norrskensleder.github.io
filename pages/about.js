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
          I am a South Asian living in Northern Europe, sharing my adventures and tech explorations.
        </Typography>
      </Container>
      <Footer />
    </>
  );
}