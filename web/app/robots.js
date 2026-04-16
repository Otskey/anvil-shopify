import { SITE_URL } from './lib/seo';

export default function robots() {
  return {
    rules: [
      {
        userAgent: [
          'Googlebot',
          'Bingbot',
          'DuckDuckBot',
          'GPTBot',
          'ChatGPT-User',
          'OAI-SearchBot',
          'ClaudeBot',
          'Claude-Web',
          'PerplexityBot',
          'Perplexity-User',
          'Applebot',
          'Applebot-Extended',
          'CCBot',
          'Google-Extended',
        ],
        allow: '/',
      },
      { userAgent: '*', allow: '/' },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
