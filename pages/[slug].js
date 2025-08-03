// Dynamic blog article page
import { Container, Typography, Box } from '@mui/material';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getPostData, getSortedPostsData } from '../lib/posts';
import Head from 'next/head';
import { marked } from 'marked';

export default function Post({ post }) {
  return (
    <>
      <Head>
        <title>{post.title} | Experience Blog</title>
      </Head>
      <Navbar />
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography variant="h3" gutterBottom>{post.title}</Typography>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>{post.date}</Typography>
        {post.coverImage && (
          <Box sx={{ my: 2, textAlign: 'center' }}>
            <img src={post.coverImage} alt={post.title} style={{ maxWidth: '100%', height: 'auto', borderRadius: 8, boxShadow: '0 2px 16px #00336622' }} />
          </Box>
        )}
        {post.youtube && (
          <Box sx={{ my: 2 }}>
            <iframe width="100%" height="400" src={post.youtube.replace('watch?v=', 'embed/')} title="YouTube video" frameBorder="0" allowFullScreen></iframe>
          </Box>
        )}
        <Box sx={{ mt: 2 }}>
          <div
            style={{ width: '100%' }}
            className="markdown-content"
            dangerouslySetInnerHTML={{ __html: marked(post.content) }}
          />
        </Box>
      </Container>
      <Footer />
    </>
  );
}

export async function getStaticPaths() {
  const posts = getSortedPostsData();
  const paths = posts.map((post) => ({ params: { slug: post.slug } }));
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const post = getPostData(params.slug);
  return { props: { post } };
}

// Add global style for markdown images
if (typeof window !== 'undefined') {
  const style = document.createElement('style');
  style.innerHTML = `.markdown-content img { max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 2px 16px #00336622; margin: 16px 0; }`;
  document.head.appendChild(style);
}
