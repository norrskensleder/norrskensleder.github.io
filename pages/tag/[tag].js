import { Container, Typography, Box } from '@mui/material';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { getSortedPostsData } from '../../lib/posts';
import ArticleCard from '../../components/ArticleCard';

export default function TagPage({ tag, posts }) {
  return (
    <>
      <Navbar />
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>Articles tagged: {tag}</Typography>
        {posts.length === 0 && <Typography>No articles found for this tag.</Typography>}
        {posts.map((post) => (
          <ArticleCard key={post.slug} post={post} />
        ))}
      </Container>
      <Footer />
    </>
  );
}

export async function getStaticPaths() {
  const posts = getSortedPostsData();
  const tags = Array.from(new Set(posts.flatMap(post => post.tags || [])));
  const paths = tags.map(tag => ({ params: { tag } }));
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const posts = getSortedPostsData();
  const filtered = posts.filter(post => (post.tags || []).includes(params.tag));
  return { props: { tag: params.tag, posts: filtered } };
}
