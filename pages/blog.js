// Blog listing page
import { Container, Typography } from '@mui/material';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getSortedPostsData } from '../lib/posts';
import ArticleCard from '../components/ArticleCard';
import ArticleCardHorizontal from '../components/ArticleCardHorizontal';

export async function getStaticProps() {
  const posts = getSortedPostsData();
  return { props: { posts } };
}

export default function Blog({ posts }) {
  return (
    <>
      <Navbar />
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>Blog</Typography>
        {posts.map((post) => (
          <ArticleCardHorizontal key={post.slug} post={post} />
        ))}
      </Container>
      <Footer />
    </>
  );
}