// Home page with sections for top tags and latest articles
import { getSortedPostsData } from '../lib/posts';
import ArticleCard from '../components/ArticleCard';
import { Box, Typography, Container, Chip, Grid } from '@mui/material';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Script from 'next/script';

export async function getStaticProps() {
  const posts = getSortedPostsData();
  // Count tags
  const tagCount = {};
  posts.forEach(post => {
    (post.tags || []).forEach(tag => {
      tagCount[tag] = (tagCount[tag] || 0) + 1;
    });
  });
  // Get top 5 tags
  const topTags = Object.entries(tagCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([tag]) => tag);
  return { props: { posts, topTags } };
}

export default function Home({ posts, topTags }) {
  // Pick top 3 featured articles (most recent)
  const featured = posts.slice(0, 4);
  return (
    <>
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3305345510108069"
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />
      <Navbar />
      {/* Hero Section */}
      <Box sx={{
        width: '100%',
        minHeight: 340,
        background: `url(/norrskensleder/banner.jpg) center/cover no-repeat, linear-gradient(120deg, #005cbf 60%, #ffd700 100%)`,
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        textAlign: 'center',
        py: 8,
        mb: 4,
        position: 'relative',
      }}>
        <Typography
          variant="h2"
          sx={{
            fontWeight: 700,
            mb: 2,
            textShadow: '0 2px 16px #00336699',
            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem', lg: '3.5rem' },
            wordBreak: 'break-word',
            lineHeight: 1.15
          }}
        >
          Norrskensleder
        </Typography>
        <Typography
          variant="h5"
          sx={{
            maxWidth: 600,
            mx: 'auto',
            textShadow: '0 2px 8px #00336699',
            fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.5rem' },
            wordBreak: 'break-word',
            lineHeight: 1.3
          }}
        >
          Adventures, tech, and stories from a South Asian in Northern Europe.
        </Typography>
      </Box>
      <Container maxWidth="lg">
        {/* Tag Bar */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', mb: 4 }}>
          {topTags.map(tag => (
            <a
              key={tag}
              href={`/tag/${tag}`}
              style={{ textDecoration: 'none' }}
            >
              <Chip
                label={tag}
                color="primary"
                sx={{ mr: 1, mb: 1, fontSize: 18, px: 2, py: 1, borderRadius: 2 }}
              />
            </a>
          ))}
        </Box>
        {/* Featured Articles */}
        <Typography
          variant="h4"
          sx={{ mb: 3, fontWeight: 600, color: 'primary.main' }}
        >
          Featured
        </Typography>
        <Grid container columns={12} columnSpacing={4} rowSpacing={4} sx={{ mb: 6 }}>
          {featured.map((post) => (
            <Grid
              key={post.slug}
              sx={{
                gridColumn: { xs: 'span 12', md: 'span 6' },
                flexGrow: 0,
                maxWidth: { md: '48%' },
                flexBasis: { md: '48%' }
              }}
            >
              <Box
                sx={{
                  position: 'relative',
                  borderRadius: 4,
                  overflow: 'hidden',
                  boxShadow: 3,
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'scale(1.03)' }
                }}
              >
                {post.coverImage && (
                  <Box
                    component="img"
                    src={post.coverImage}
                    alt={post.title}
                    sx={{
                      width: '100%',
                      height: 320,
                      objectFit: 'cover',
                      filter: 'brightness(0.85)'
                    }}
                  />
                )}
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: '100%',
                    bgcolor: 'rgba(0,0,0,0.55)',
                    color: '#fff',
                    p: 2
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {post.title}
                  </Typography>
                  <Typography variant="body2">
                    {new Date(post.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%'
                  }}
                  component="a"
                  href={`/${post.slug}`}
                />
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* All Topics */}
        <Typography
          variant="h4"
          sx={{ mt: 6, mb: 3, fontWeight: 600, color: 'primary.main' }}
        >
          All Topics
        </Typography>
        {topTags.map(tag => (
          <Box key={tag} sx={{ mt: 5 }}>
            <Typography variant="h5" gutterBottom>
              {tag.charAt(0).toUpperCase() + tag.slice(1)}
            </Typography>
            <Grid container columns={12} columnSpacing={2}>
              {posts
                .filter(post => post.tags?.includes(tag))
                .slice(0, 3)
                .map(post => (
                  <Grid
                    key={post.slug}
                    sx={{
                      gridColumn: { xs: 'span 12', md: 'span 4', lg: 'span 4' },
                      flexBasis: { md: '32%', lg: '32%' },
                      maxWidth: { md: '32%', lg: '32%' }
                    }}
                  >
                    <ArticleCard post={post} />
                  </Grid>
                ))}
            </Grid>
          </Box>
        ))}

      </Container>
      <Footer />
    </>
  );
}