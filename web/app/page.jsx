import HomePageClient from './HomePageClient';
import JsonLd from './components/JsonLd';
import { absoluteUrl, SITE_URL, buildMetadata } from './lib/seo';
import { items as homewareItems } from './data/homeware';
import { items as objectsItems } from './data/objects';

export const metadata = buildMetadata({
  path: '/',
});

const searchActionJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  url: SITE_URL,
  potentialAction: {
    '@type': 'SearchAction',
    target: `${SITE_URL}/shop?q={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
};

const homeCollectionJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  url: absoluteUrl('/'),
  name: 'ANVIL — Design & Fabrication',
  description: 'Featured homeware and functional objects handcrafted in steel and wood by Anvil Design & Fabrication.',
  hasPart: [
    { '@type': 'WebPage', name: 'Homeware', url: absoluteUrl('/portfolio/homeware') },
    { '@type': 'WebPage', name: 'Objects', url: absoluteUrl('/portfolio/objects') },
    { '@type': 'WebPage', name: 'Contact', url: absoluteUrl('/contact') },
  ],
  mainEntity: {
    '@type': 'ItemList',
    numberOfItems: homewareItems.length + objectsItems.length,
    itemListElement: [
      ...homewareItems.slice(0, 3).map((it, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: it.title,
        image: absoluteUrl(it.src),
      })),
    ],
  },
};

export default function Page() {
  return (
    <>
      <JsonLd data={searchActionJsonLd} />
      <JsonLd data={homeCollectionJsonLd} />
      <HomePageClient />
    </>
  );
}
