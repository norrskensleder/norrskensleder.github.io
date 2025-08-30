// Enhanced dynamic blog article page with SEO and accessibility
import { Container, Typography, Box, Chip, Breadcrumbs, IconButton } from '@mui/material';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getPostData, getSortedPostsData } from '../lib/posts';
import React, { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Gallery from '../components/Gallery';
import LikeDislike from '../components/LikeDislike';
import CommentBox from '../components/CommentBox';
import SEO, { generateArticleSEO } from '../components/SEO';
import { AccessibleHeading, Landmark } from '../components/Accessibility';
import { Home, Tag, Share as ShareIcon, Facebook, Twitter, LinkedIn } from '@mui/icons-material';
import Link from 'next/link';
import Image from "next/image";
import Script from 'next/script';

export default function Post({ post }) {
  const seoProps = generateArticleSEO(post);

  return (
    <>
      <SEO {...seoProps} image={post.coverImage || '/norrskensleder/banner.webp'} />
      <Navbar />

      <Landmark role="main" id="main-content" aria-label="Blog post content">
        <Container maxWidth="md" sx={{ mt: 4 }}>
          {/* Breadcrumb navigation for accessibility */}
          <Breadcrumbs
            aria-label="Breadcrumb navigation"
            sx={{ mb: 3 }}
            separator="›"
          >
            <Link href="/">
              <span style={{ display: 'flex', alignItems: 'center', color: 'var(--mui-palette-primary-main)', textDecoration: 'none' }}>
                <Home style={{ marginRight: '4px', fontSize: 20 }} />
                Home
              </span>
            </Link>

            <Link href="/blog">
              <span style={{ color: 'var(--mui-palette-primary-main)', textDecoration: 'none' }}>
                Blog
              </span>
            </Link>

            <Typography color="text.primary">{post.title}</Typography>
          </Breadcrumbs>

          {/* Article header */}
          <Box component="header" sx={{ mb: 4 }}>
            <AccessibleHeading level={2} sx={{ mb: 2, fontSize: { xs: '1.5rem', sm: '2rem', md: '3.5rem' }, wordBreak: 'break-word' }}>
              {post.title}
            </AccessibleHeading>

            <Box sx={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: 2,
              mb: 2,
              justifyContent: 'space-between',
              width: '100%',
              maxWidth: '100%',
              minWidth: 0,
              overflow: 'hidden'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', minWidth: 0, maxWidth: '100%' }}>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  component="time"
                  dateTime={post.date}
                >
                  Published: {new Date(post.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </Typography>

                {post.readingTime && (
                  <Typography variant="subtitle2" color="text.secondary">
                    • {post.readingTime} min read
                  </Typography>
                )}
              </Box>

              {/* Social share icons */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 'auto', flexWrap: 'wrap', minWidth: 0, maxWidth: '100%' }}>
                <IconButton
                  component="a"
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent('https://norrskensleder.com/' + post.slug)}&text=${encodeURIComponent(post.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  size="small"
                  aria-label="Share on Twitter"
                  sx={{
                    '&:hover svg': { color: '#005cbf' }
                  }}
                >
                  <Twitter fontSize="small" />
                </IconButton>
                <IconButton
                  component="a"
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent('https://norrskensleder.com/' + post.slug)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  size="small"
                  aria-label="Share on Facebook"
                  sx={{
                    '&:hover svg': { color: '#005cbf' }
                  }}
                >
                  <Facebook fontSize="small" />
                </IconButton>
                <IconButton
                  component="a"
                  href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent('https://norrskensleder.com/' + post.slug)}&title=${encodeURIComponent(post.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  size="small"
                  aria-label="Share on LinkedIn"
                  sx={{
                    '&:hover svg': { color: '#005cbf' }
                  }}
                >
                  <LinkedIn fontSize="small" />
                </IconButton>
              </Box>
            </Box>

            {/* Tags */}
            {post.tags && (
              <Box sx={{ mb: 3 }} role="navigation" aria-label="Article tags">
                {post.tags.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    component={Link}
                    href={`/tag/${tag}`}
                    clickable
                    size="small"
                    icon={<Tag fontSize="small" />}
                    sx={{ mr: 1, mb: 1 }}
                    aria-label={`View all posts tagged with ${tag}`}
                  />
                ))}
              </Box>
            )}
          </Box>

          {/* Cover image with proper accessibility */}
          {post.coverImage && (
            <figure style={{ margin: '24px 0', textAlign: 'center', maxWidth: '100%', overflow: 'auto' }}>
              <Image
                src={post.coverImage}
                alt={post.imageAlt || `Cover image for "${post.title}"`}
                width={1200}
                height={630}  // common blog cover size
                priority
                style={{
                  maxWidth: '100%',
                  height: 'auto',
                  borderRadius: 8,
                  boxShadow: '0 2px 16px #00336622',
                  display: 'block',
                  minWidth: 0
                }}
              />
              {post.imageCaption && (
                <figcaption style={{
                  marginTop: 8,
                  fontSize: '0.875rem',
                  color: '#666',
                  fontStyle: 'italic'
                }}>
                  {post.imageCaption}
                </figcaption>
              )}
            </figure>
          )}

          {/* YouTube video with accessibility */}
          {post.youtube && (
            <Box sx={{ my: 3 }}>
              <iframe
                width="100%"
                height="530"
                src={post.youtube.replace('watch?v=', 'embed/')}
                title={`YouTube video: ${post.title}`}
                frameBorder="0"
                allowFullScreen
                aria-describedby="video-description"
              />
              <Typography
                id="video-description"
                variant="caption"
                sx={{ display: 'block', mt: 1, color: 'text.secondary' }}
              >
                Embedded video related to this article
              </Typography>
            </Box>
          )}

          {/* Article content */}
          <Box
            component="article"
            sx={{ mt: 3, mb: 4, width: '100%', maxWidth: '100%', overflowX: 'auto', minWidth: 0 }}
            aria-label="Article content"
          >
            <MarkdownWithGallery content={post.content} />
          </Box>

          {/* Reading progress indicator */}
          <Box sx={{ position: 'fixed', top: 0, left: 0, right: 0, height: 4, zIndex: 1000 }}>
            <ReadingProgress />
          </Box>

          {/* Article footer */}
          <Box component="footer" sx={{ mt: 6 }}>
            <LikeDislike slug={post.slug} />
            <CommentBox slug={post.slug} />
          </Box>
        </Container>
      </Landmark>

      <Footer />
    </>
  );
}

// Reading progress indicator component
function ReadingProgress() {
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      setProgress(Math.min(scrollPercent, 100));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Box
      sx={{
        width: `${progress}%`,
        height: '100%',
        background: 'linear-gradient(90deg, #005cbf 0%, #0070f3 100%)',
        transition: 'width 0.1s ease-out'
      }}
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Reading progress"
    />
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

// Helper to extract consecutive images from markdown AST
function groupImages(children) {
  const groups = [];
  let current = [];
  children.forEach((child, idx) => {
    if (child.type === 'element' && child.tagName === 'img') {
      current.push(child);
    } else {
      if (current.length > 1) {
        groups.push({ type: 'gallery', images: current.map(img => img.properties.src) });
        current = [];
      } else if (current.length === 1) {
        groups.push(current[0]);
        current = [];
      }
      groups.push(child);
    }
  });
  if (current.length > 1) {
    groups.push({ type: 'gallery', images: current.map(img => img.properties.src) });
  } else if (current.length === 1) {
    groups.push(current[0]);
  }
  return groups;
}

function MarkdownWithGallery({ content }) {
  // Split content by <!--gallery--> marker
  const blocks = content.split(/<!--gallery-->/g);
  const galleryImageRegex = /^!\[(.*)\]\((.*)\)$/;

  // Custom image renderer for non-gallery images
  const markdownImg = ({ src, alt }) => (
    <Image
      src={src}
      alt={alt}
      width={800}
      height={600}
      style={{
        maxWidth: '100%',
        height: 'auto',
        borderRadius: 8,
        boxShadow: '0 2px 16px #00336622',
        margin: '16px 0',
        minWidth: 0
      }}
    />
  );

  // Custom link renderer to embed YouTube videos
  const markdownLink = ({ href, children }) => {
    const ytMatch = href.match(/^https?:\/\/(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
    if (ytMatch) {
      const videoId = ytMatch[3];
      return (
        <iframe
          width="100%"
          height="513"
          src={`https://www.youtube.com/embed/${videoId}`}
          title="YouTube video"
          frameBorder="0"
          allowFullScreen
          style={{ display: 'block', margin: '24px 0' }}
        ></iframe>
      );
    }
    return <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>;
  };

  // Custom paragraph renderer to avoid <p><iframe/></p> nesting
  const markdownP = ({ node, children }) => {
    // If the only child is an iframe, return it directly (no <p> wrapper)
    if (
      Array.isArray(children) &&
      children.length === 1 &&
      children[0]?.type === 'iframe'
    ) {
      return children;
    }
    return <p>{children}</p>;
  };

  return (
    <>
      {blocks.map((block, idx) => {
        // Check if this block is a gallery (contains only images, at least 2)
        const lines = block.trim().split('\n').filter(Boolean);
        const images = lines
          .map(line => {
            const match = line.match(galleryImageRegex);
            return match ? { src: match[2], alt: match[1] } : null;
          })
          .filter(Boolean);
        // Only render as gallery if all lines are images and there are at least 2
        if (images.length >= 2 && images.length === lines.length && lines.length > 0) {
          return <Gallery key={idx} images={images} />;
        } else {
          // Otherwise, render as normal markdown with custom img, link, and p renderer
          return (
            <ReactMarkdown
              key={idx}
              remarkPlugins={[remarkGfm]}
              components={{ img: markdownImg, a: markdownLink, p: markdownP }}
            >
              {block}
            </ReactMarkdown>
          );
        }
      })}
    </>
  );
}
