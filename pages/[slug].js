// Dynamic blog article page
import { Container, Typography, Box } from '@mui/material';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getPostData, getSortedPostsData } from '../lib/posts';
import Head from 'next/head';
import React, { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Gallery from '../components/Gallery';

export default function Post({ post }) {
  return (
    <>
      <Head>
        <title>{post.title} | Norrskensleder</title>
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
          <MarkdownWithGallery content={post.content} />
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
    <img
      src={src}
      alt={alt}
      style={{ maxWidth: '100%', height: 'auto', borderRadius: 8, boxShadow: '0 2px 16px #00336622', margin: '16px 0' }}
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
          height="400"
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
