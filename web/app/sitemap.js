import { SITE_URL } from './lib/seo';

export default function sitemap() {
  const now = new Date();

  const staticRoutes = [
    { path: '/', priority: 1.0, changeFrequency: 'monthly' },
    { path: '/portfolio/homeware', priority: 0.9, changeFrequency: 'monthly' },
    { path: '/portfolio/objects', priority: 0.9, changeFrequency: 'monthly' },
    { path: '/contact', priority: 0.7, changeFrequency: 'yearly' },
  ];

  // TODO: when individual product routes land (post-Shopify wire-up),
  // iterate `items` from app/data/*.js here and append per-product entries.

  return staticRoutes.map(({ path, priority, changeFrequency }) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }));
}
