// Comprehensive SEO component with meta tags, Open Graph, and structured data
import Head from 'next/head';
import { useRouter } from 'next/router';
import Script from 'next/script';

const SEO = ({
  title = 'Norrskensleder - Adventures in Northern Europe',
  description = 'Adventures, tech, and stories from a South Asian exploring Northern Europe. Discover Norway, Scandinavia, and Nordic culture through travel experiences and drone photography.',
  keywords = 'Sweden, Norway, Scandinavia, travel, adventure, Northern Europe, drone photography, Nordic culture, South Asian, blog, experiences, lifestyle, technology',
  author = 'Norrskensleder',
  image = '/norrskensleder/banner.jpg',
  article = false,
  publishedTime,
  modifiedTime,
  tags = [],
  lang = 'en',
  type = 'website',
  noindex = false,
  nofollow = false,
  canonical,
  structuredData
}) => {
  const router = useRouter();
  const baseUrl = 'https://norrskensleder.com';
  const fullUrl = canonical || `${baseUrl}${router.asPath}`;
  const fullImageUrl = image && image !== '/norrskensleder/banner.jpg' ? (image.startsWith('http') ? image : `${baseUrl}${image}`) : `${baseUrl}/norrskensleder/banner.jpg`;

  // Default structured data for the website
  const defaultStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Norrskensleder',
    description: description,
    url: baseUrl,
    image: fullImageUrl,
    author: {
      '@type': 'Person',
      name: author,
      url: baseUrl
    },
    publisher: {
      '@type': 'Organization',
      name: 'Norrskensleder',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/norrskensleder/logo.svg`
      }
    },
    inLanguage: lang,
    potentialAction: {
      '@type': 'ReadAction',
      target: fullUrl
    }
  };

  // Article structured data
  const articleStructuredData = article ? {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description: description,
    image: fullImageUrl,
    datePublished: publishedTime,
    dateModified: modifiedTime || publishedTime,
    author: {
      '@type': 'Person',
      name: author
    },
    publisher: {
      '@type': 'Organization',
      name: 'Norrskensleder',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/norrskensleder/logo.svg`
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': fullUrl
    },
    keywords: tags.join(', '),
    inLanguage: lang
  } : null;

  const finalStructuredData = structuredData || articleStructuredData || defaultStructuredData;

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <meta name="robots" content={`${noindex ? 'noindex' : 'index'},${nofollow ? 'nofollow' : 'follow'}`} />
      <meta name="googlebot" content={`${noindex ? 'noindex' : 'index'},${nofollow ? 'nofollow' : 'follow'}`} />

      {/* Language and Locale */}
      <meta httpEquiv="content-language" content={lang} />
      <meta name="language" content={lang} />

      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph Meta Tags */}
      <meta property="og:type" content={article ? 'article' : type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:site_name" content="Norrskensleder" />
      <meta property="og:locale" content={lang === 'en' ? 'en_US' : lang} />

      {/* Article specific Open Graph tags */}
      {article && (
        <>
          <meta property="article:author" content={author} />
          <meta property="article:section" content="Travel & Technology" />
          {publishedTime && <meta property="article:published_time" content={publishedTime} />}
          {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
          {tags.map(tag => (
            <meta key={tag} property="article:tag" content={tag} />
          ))}
        </>
      )}

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />
      <meta name="twitter:image:alt" content={title} />
      <meta name="twitter:site" content="@norrskensleder" />
      <meta name="twitter:creator" content="@norrskensleder" />

      {/* Additional SEO Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="theme-color" content="#005cbf" />
      <meta name="msapplication-TileColor" content="#005cbf" />
      <meta name="msapplication-navbutton-color" content="#005cbf" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

      {/* Geo Tags for Nordic content */}
      <meta name="geo.region" content="NO" />
      <meta name="geo.placename" content="Norway" />
      <meta name="ICBM" content="60.472024, 8.468946" />

      {/* Website Verification (add when available) */}
      {/* <meta name="google-site-verification" content="your-verification-code" /> */}
      {/* <meta name="msvalidate.01" content="your-bing-verification-code" /> */}

      {/* Favicons and Icons */}
      <link rel="icon" href="/norrskensleder/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/norrskensleder/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/norrskensleder/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/norrskensleder/favicon-16x16.png" />
      <link rel="manifest" href="/site.webmanifest" />

      {/* Structured Data (JSON-LD) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(finalStructuredData)
        }}
      />

      {/* Preconnect to external domains for performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://firestore.googleapis.com" />

      {/* DNS Prefetch for better performance */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//firestore.googleapis.com" />
      <link rel="dns-prefetch" href="//github.com" />

      {/* Alternative formats and feeds */}
      <link rel="alternate" type="application/rss+xml" title="Norrskensleder RSS Feed" href="/feed.xml" />
      <link rel="alternate" type="application/atom+xml" title="Norrskensleder Atom Feed" href="/atom.xml" />

      {/* Copyright and license information */}
      <meta name="copyright" content={`© ${new Date().getFullYear()} Norrskensleder`} />
      <meta name="rating" content="General" />
      <meta name="distribution" content="Global" />

      {/* Social Media Profile Links */}
      <link rel="me" href="https://github.com/norrskensleder" />

      {/* AdSense script */}
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3305345510108069"
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />
    </Head>
  );
};

// Helper function to generate article SEO props
export const generateArticleSEO = (post) => {
  const baseUrl = 'https://norrskensleder.com';

  return {
    title: `${post.title} | Norrskensleder`,
    description: post.excerpt || post.content?.slice(0, 160) || 'Read more about this adventure in Northern Europe.',
    keywords: post.tags?.join(', ') || 'Norway, travel, adventure',
    image: post.coverImage || '/norrskensleder/banner.jpg',
    article: true,
    publishedTime: post.date ? new Date(post.date).toISOString() : undefined,
    modifiedTime: post.modifiedDate ? new Date(post.modifiedDate).toISOString() : undefined,
    tags: post.tags || [],
    canonical: `${baseUrl}/${post.slug}`,
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.excerpt || post.content?.slice(0, 160),
      image: {
        '@type': 'ImageObject',
        url: post.coverImage ? `${baseUrl}${post.coverImage}` : `${baseUrl}/norrskensleder/banner.jpg`,
        width: 1200,
        height: 630
      },
      datePublished: post.date ? new Date(post.date).toISOString() : new Date().toISOString(),
      dateModified: post.modifiedDate ? new Date(post.modifiedDate).toISOString() : new Date(post.date || Date.now()).toISOString(),
      author: {
        '@type': 'Person',
        name: 'Norrskensleder',
        url: baseUrl
      },
      publisher: {
        '@type': 'Organization',
        name: 'Norrskensleder',
        logo: {
          '@type': 'ImageObject',
          url: `${baseUrl}/norrskensleder/logo.svg`,
          width: 200,
          height: 200
        }
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `${baseUrl}/${post.slug}`
      },
      keywords: post.tags?.join(', ') || 'Norway, travel, adventure',
      inLanguage: 'en-US',
      wordCount: post.content?.split(' ').length || 0,
      articleSection: 'Travel & Technology'
    }
  };
};

export default SEO;