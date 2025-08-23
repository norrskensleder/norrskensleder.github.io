const fs = require('fs');
const path = require('path');

const domain = 'https://norrskensleder.com';
const postsDir = path.join(process.cwd(), 'posts');
const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'));

const urls = files.map(file => {
  const slug = file.replace(/\.md$/, '');
  const filePath = path.join(postsDir, file);
  const stats = fs.statSync(filePath);
  const lastmod = stats.mtime.toISOString(); // ISO format

  return `<url>
    <loc>${domain}/${slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
});

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;

fs.writeFileSync(path.join(process.cwd(), 'out/sitemap-posts.xml'), sitemap);
console.log('✅ sitemap-posts.xml with <lastmod> generated');
