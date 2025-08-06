// Sitemap generation utilities
import fs from 'fs';
import path from 'path';
import { getSortedPostsData } from './posts';

const baseUrl = 'https://norrskensleder.github.io';

// Static pages configuration
const staticPages = [
  {
    url: '/',
    changefreq: 'weekly',
    priority: '1.0',
    lastmod: new Date().toISOString()
  },
  {
    url: '/blog',
    changefreq: 'daily',
    priority: '0.9',
    lastmod: new Date().toISOString()
  },
  {
    url: '/about',
    changefreq: 'monthly',
    priority: '0.7',
    lastmod: new Date().toISOString()
  },
  {
    url: '/contact',
    changefreq: 'monthly',
    priority: '0.6',
    lastmod: new Date().toISOString()
  }
];

// Generate main sitemap
export function generateSitemap() {
  const posts = getSortedPostsData();
  
  // Get unique tags
  const tags = [...new Set(posts.flatMap(post => post.tags || []))];
  
  // Generate URLs for posts
  const postUrls = posts.map(post => ({
    url: `/${post.slug}`,
    changefreq: 'monthly',
    priority: '0.8',
    lastmod: post.modifiedDate || post.date || new Date().toISOString(),
    images: post.coverImage ? [
      {
        url: `${baseUrl}${post.coverImage}`,
        caption: post.title,
        title: post.title
      }
    ] : []
  }));

  // Generate URLs for tag pages
  const tagUrls = tags.map(tag => ({
    url: `/tag/${tag}`,
    changefreq: 'weekly',
    priority: '0.7',
    lastmod: new Date().toISOString()
  }));

  const allUrls = [...staticPages, ...postUrls, ...tagUrls];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${allUrls.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>${page.images?.map(image => `
    <image:image>
      <image:loc>${image.url}</image:loc>
      <image:caption>${image.caption}</image:caption>
      <image:title>${image.title}</image:title>
    </image:image>`).join('') || ''}
  </url>`).join('\n')}
</urlset>`;

  return sitemap;
}

// Generate posts-specific sitemap
export function generatePostsSitemap() {
  const posts = getSortedPostsData();
  
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${posts.map(post => `  <url>
    <loc>${baseUrl}/${post.slug}</loc>
    <lastmod>${post.modifiedDate || post.date || new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
    <news:news>
      <news:publication>
        <news:name>Norrskensleder</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${post.date || new Date().toISOString()}</news:publication_date>
      <news:title><![CDATA[${post.title}]]></news:title>
      <news:keywords>${(post.tags || []).join(', ')}</news:keywords>
    </news:news>${post.coverImage ? `
    <image:image>
      <image:loc>${baseUrl}${post.coverImage}</image:loc>
      <image:caption><![CDATA[${post.title}]]></image:caption>
      <image:title><![CDATA[${post.title}]]></image:title>
    </image:image>` : ''}
  </url>`).join('\n')}
</urlset>`;

  return sitemap;
}

// Generate sitemap index
export function generateSitemapIndex() {
  const lastmod = new Date().toISOString();
  
  const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${baseUrl}/sitemap.xml</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-posts.xml</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>
</sitemapindex>`;

  return sitemapIndex;
}

// RSS Feed generation
export function generateRSSFeed() {
  const posts = getSortedPostsData().slice(0, 20); // Latest 20 posts
  
  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/"
     xmlns:wfw="http://wellformedweb.org/CommentAPI/"
     xmlns:dc="http://purl.org/dc/elements/1.1/"
     xmlns:atom="http://www.w3.org/2005/Atom"
     xmlns:sy="http://purl.org/rss/1.0/modules/syndication/"
     xmlns:slash="http://purl.org/rss/1.0/modules/slash/">
  <channel>
    <title>Norrskensleder - Adventures in Northern Europe</title>
    <link>${baseUrl}</link>
    <description>Adventures, tech, and stories from a South Asian exploring Northern Europe. Discover Norway, Scandinavia, and Nordic culture through travel experiences and drone photography.</description>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <language>en-US</language>
    <sy:updatePeriod>weekly</sy:updatePeriod>
    <sy:updateFrequency>1</sy:updateFrequency>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml" />
    <image>
      <url>${baseUrl}/norrskensleder/logo.svg</url>
      <title>Norrskensleder</title>
      <link>${baseUrl}</link>
      <width>144</width>
      <height>144</height>
    </image>
${posts.map(post => `    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${baseUrl}/${post.slug}</link>
      <description><![CDATA[${post.excerpt || post.content?.slice(0, 300) || 'Read more about this adventure in Northern Europe.'}]]></description>
      <pubDate>${new Date(post.date || Date.now()).toUTCString()}</pubDate>
      <guid isPermaLink="true">${baseUrl}/${post.slug}</guid>
      <dc:creator><![CDATA[Norrskensleder]]></dc:creator>
      <category><![CDATA[Travel]]></category>
      <category><![CDATA[Technology]]></category>
      ${(post.tags || []).map(tag => `<category><![CDATA[${tag}]]></category>`).join('\n      ')}
      ${post.coverImage ? `<enclosure url="${baseUrl}${post.coverImage}" type="image/jpeg" />` : ''}
    </item>`).join('\n')}
  </channel>
</rss>`;

  return rss;
}

// Atom Feed generation
export function generateAtomFeed() {
  const posts = getSortedPostsData().slice(0, 20);
  
  const atom = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>Norrskensleder - Adventures in Northern Europe</title>
  <link href="${baseUrl}/atom.xml" rel="self" />
  <link href="${baseUrl}/" />
  <updated>${new Date().toISOString()}</updated>
  <id>${baseUrl}/</id>
  <subtitle>Adventures, tech, and stories from a South Asian exploring Northern Europe</subtitle>
  <author>
    <name>Norrskensleder</name>
    <uri>${baseUrl}</uri>
  </author>
  <rights>© ${new Date().getFullYear()} Norrskensleder</rights>
  <logo>${baseUrl}/norrskensleder/logo.svg</logo>
  <icon>${baseUrl}/norrskensleder/favicon.ico</icon>
${posts.map(post => `  <entry>
    <title><![CDATA[${post.title}]]></title>
    <link href="${baseUrl}/${post.slug}" />
    <updated>${new Date(post.modifiedDate || post.date || Date.now()).toISOString()}</updated>
    <published>${new Date(post.date || Date.now()).toISOString()}</published>
    <id>${baseUrl}/${post.slug}</id>
    <summary type="html"><![CDATA[${post.excerpt || post.content?.slice(0, 300) || 'Read more about this adventure in Northern Europe.'}]]></summary>
    <author>
      <name>Norrskensleder</name>
      <uri>${baseUrl}</uri>
    </author>
    ${(post.tags || []).map(tag => `<category term="${tag}" label="${tag}" />`).join('\n    ')}
  </entry>`).join('\n')}
</feed>`;

  return atom;
}

// Write sitemaps to public directory (for build process)
export function writeSitemaps() {
  const publicDir = path.join(process.cwd(), 'public');
  
  try {
    // Write main sitemap
    fs.writeFileSync(
      path.join(publicDir, 'sitemap.xml'),
      generateSitemap()
    );
    
    // Write posts sitemap
    fs.writeFileSync(
      path.join(publicDir, 'sitemap-posts.xml'),
      generatePostsSitemap()
    );
    
    // Write sitemap index
    fs.writeFileSync(
      path.join(publicDir, 'sitemap-index.xml'),
      generateSitemapIndex()
    );
    
    // Write RSS feed
    fs.writeFileSync(
      path.join(publicDir, 'feed.xml'),
      generateRSSFeed()
    );
    
    // Write Atom feed
    fs.writeFileSync(
      path.join(publicDir, 'atom.xml'),
      generateAtomFeed()
    );
    
    console.log('✅ Sitemaps and feeds generated successfully');
  } catch (error) {
    console.error('❌ Error generating sitemaps:', error);
  }
}