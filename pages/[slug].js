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
  // Split content into lines and group consecutive image lines
  const lines = content.split('\n');
  const groups = [];
  let currentImages = [];
  let currentText = [];

  // Regex to match markdown images: ![alt](src)
  const imageRegex = /^!\[(.*)\]\((.*)\)$/;

  function flushText() {
    if (currentText.length > 0) {
      groups.push({ type: 'text', text: currentText.join('\n') });
      currentText = [];
    }
  }

  lines.forEach(line => {
    const match = line.match(imageRegex);
    if (match) {
      flushText();
      currentImages.push({ src: match[2], alt: match[1] });
    } else {
      if (currentImages.length > 0) {
        groups.push({ type: 'gallery', images: currentImages });
        currentImages = [];
      }
      currentText.push(line);
    }
  });
  if (currentImages.length > 0) {
    groups.push({ type: 'gallery', images: currentImages });
  }
  flushText();

  return (
    <>
      {groups.map((group, idx) => {
        if (group.type === 'gallery') {
          return <Gallery key={idx} images={group.images} />;
        } else {
          return (
            <ReactMarkdown
              key={idx}
              remarkPlugins={[remarkGfm]}
              components={{
                img({ node, ...props }) {
                  return <img style={{ maxWidth: '100%', borderRadius: 8, boxShadow: '0 2px 16px #00336622', margin: '16px 0' }} {...props} />;
                },
              }}
            >
              {group.text}
            </ReactMarkdown>
          );
        }
      })}
    </>
  );
}
