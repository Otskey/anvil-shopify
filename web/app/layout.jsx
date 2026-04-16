import './globals.css';
import {
  SITE_URL,
  SITE_NAME,
  BRAND_TAGLINE,
  DEFAULT_DESCRIPTION,
  DEFAULT_OG_IMAGE,
  ORG_JSONLD,
  LOCAL_BUSINESS_JSONLD,
  WEBSITE_JSONLD,
} from './lib/seo';
import JsonLd from './components/JsonLd';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — ${BRAND_TAGLINE}`,
    template: `%s — ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    'steel fabrication',
    'handcrafted homeware',
    'bespoke gates',
    'steel railings',
    'garden ornaments',
    'Cambridgeshire fabricator',
    'UK metalwork',
    'Anvil Design & Fabrication',
  ],
  authors: [{ name: 'Anvil Design & Fabrication', url: SITE_URL }],
  creator: 'Anvil Design & Fabrication',
  publisher: 'Anvil Design & Fabrication',
  category: 'Design & Fabrication',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — ${BRAND_TAGLINE}`,
    description: DEFAULT_DESCRIPTION,
    locale: 'en_GB',
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: `${SITE_NAME} — ${BRAND_TAGLINE}` }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} — ${BRAND_TAGLINE}`,
    description: DEFAULT_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon.png', type: 'image/png', sizes: '512x512' },
    ],
    apple: '/apple-icon.png',
  },
  manifest: '/site.webmanifest',
  formatDetection: { telephone: true, email: true, address: true },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#111111',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en-GB">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@1,700&family=Space+Mono:wght@400;700&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <JsonLd data={ORG_JSONLD} />
        <JsonLd data={LOCAL_BUSINESS_JSONLD} />
        <JsonLd data={WEBSITE_JSONLD} />
        {children}
      </body>
    </html>
  );
}
