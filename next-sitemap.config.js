/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://norrskensleder.com',
  generateRobotsTxt: true,
  outDir: './out',
  additionalSitemaps: [
    'https://norrskensleder.com/sitemap-posts.xml',
  ],
};
