// Next.js config for static export and GitHub Pages compatibility
const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  output: 'export',
  assetPrefix: isProd ? '/web-blog/' : '',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};
