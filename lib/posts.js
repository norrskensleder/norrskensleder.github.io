// Utility to read Markdown files and parse frontmatter
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'posts');

export function getSortedPostsData() {
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames.map((fileName) => {
    // Remove .md extension for slug
    const slug = fileName.endsWith('.md') ? fileName.slice(0, -3) : fileName;
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    return {
      slug,
      ...data,
      content,
    };
  });
  return allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostData(slug) {
  // Remove .md extension if present
  const cleanSlug = slug.endsWith('.md') ? slug.slice(0, -3) : slug;
  const fullPath = path.join(postsDirectory, `${cleanSlug}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);
  return {
    slug: cleanSlug,
    ...data,
    content,
  };
}
