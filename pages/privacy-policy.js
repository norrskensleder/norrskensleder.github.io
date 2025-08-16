import fs from 'fs';
import path from 'path';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Container, Typography, Box } from '@mui/material';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export async function getStaticProps() {
  const filePath = path.join(process.cwd(), 'public/privacy-policy.md');
  const content = fs.readFileSync(filePath, 'utf8');
  return { props: { content } };
}

export default function PrivacyPolicy({ content }) {
  return (
    <>
      <Navbar />
      <Container maxWidth="md" sx={{ mt: 6, mb: 6 }}>
        <Box>
          <Typography variant="h3" sx={{ mb: 3, fontWeight: 700 }}>
            Privacy Policy
          </Typography>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </Box>
      </Container>
      <Footer />
    </>
  );
}
