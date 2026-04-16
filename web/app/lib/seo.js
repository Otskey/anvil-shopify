export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://anvilfabrication.com').replace(/\/$/, '');
export const SITE_NAME = 'ANVIL';
export const BRAND_LEGAL_NAME = 'Anvil Design & Fabrication';
export const BRAND_TAGLINE = 'Design & Fabrication';
export const DEFAULT_DESCRIPTION = 'Handcrafted homeware and functional objects in steel and wood, designed and built by hand in Cambridgeshire, UK.';
export const DEFAULT_OG_IMAGE = '/opengraph-image.jpg';

const SOCIAL_LINKS = [
  'https://www.instagram.com/anvil_fabrication',
  'https://www.tiktok.com/@anvil_fabrication',
  'https://www.facebook.com/anvildesignandfabrication',
];

const POSTAL_ADDRESS = {
  '@type': 'PostalAddress',
  streetAddress: 'Unit 6-7 Hardwick Rd Ind. Est, Hardwick Rd, Great Gransden',
  addressLocality: 'Sandy',
  addressRegion: 'Cambridgeshire',
  postalCode: 'SG19 3BJ',
  addressCountry: 'GB',
};

export function absoluteUrl(path = '/') {
  if (!path) return SITE_URL;
  if (path.startsWith('http')) return path;
  return `${SITE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
}

export function buildMetadata({ title, description, path = '/', image = DEFAULT_OG_IMAGE } = {}) {
  const url = absoluteUrl(path);
  const desc = description || DEFAULT_DESCRIPTION;
  const ogImage = absoluteUrl(image);

  return {
    title,
    description: desc,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      url,
      siteName: SITE_NAME,
      title: title || `${SITE_NAME} — ${BRAND_TAGLINE}`,
      description: desc,
      locale: 'en_GB',
      images: [{ url: ogImage, width: 1200, height: 630, alt: `${SITE_NAME} — ${BRAND_TAGLINE}` }],
    },
    twitter: {
      card: 'summary_large_image',
      title: title || `${SITE_NAME} — ${BRAND_TAGLINE}`,
      description: desc,
      images: [ogImage],
    },
  };
}

export const ORG_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${SITE_URL}/#organization`,
  name: BRAND_LEGAL_NAME,
  alternateName: SITE_NAME,
  url: SITE_URL,
  logo: absoluteUrl('/icon.png'),
  email: 'lewisbond@anvilfabrication.com',
  telephone: '+44 7921 382430',
  address: POSTAL_ADDRESS,
  sameAs: SOCIAL_LINKS,
};

export const LOCAL_BUSINESS_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': `${SITE_URL}/#localbusiness`,
  name: BRAND_LEGAL_NAME,
  description: 'Steel fabrication workshop producing handcrafted homeware, functional objects, gates, railings and bespoke commissions.',
  url: SITE_URL,
  image: absoluteUrl(DEFAULT_OG_IMAGE),
  telephone: '+44 7921 382430',
  email: 'lewisbond@anvilfabrication.com',
  address: POSTAL_ADDRESS,
  areaServed: 'GB',
  priceRange: '££',
  openingHoursSpecification: [{
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    opens: '09:00',
    closes: '17:00',
  }],
  sameAs: SOCIAL_LINKS,
};

export const WEBSITE_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  url: SITE_URL,
  name: SITE_NAME,
  description: DEFAULT_DESCRIPTION,
  publisher: { '@id': `${SITE_URL}/#organization` },
  inLanguage: 'en-GB',
};

export function breadcrumbJsonLd(trail) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((node, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: node.name,
      item: absoluteUrl(node.path),
    })),
  };
}

export function itemListJsonLd({ name, path, items }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    url: absoluteUrl(path),
    numberOfItems: items.length,
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Product',
        name: it.title,
        image: absoluteUrl(it.src),
        description: it.alt,
        material: it.material,
        brand: { '@type': 'Brand', name: SITE_NAME },
        manufacturer: { '@id': `${SITE_URL}/#organization` },
      },
    })),
  };
}

export function contactPageJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    url: absoluteUrl('/contact'),
    name: 'Contact — ANVIL',
    description: 'Workshop enquiries and commissions for Anvil Design & Fabrication in Cambridgeshire, UK.',
    mainEntity: { '@id': `${SITE_URL}/#localbusiness` },
  };
}
