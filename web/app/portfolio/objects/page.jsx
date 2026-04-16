import ObjectsPageClient from './ObjectsPageClient';
import JsonLd from '../../components/JsonLd';
import { buildMetadata, breadcrumbJsonLd, itemListJsonLd } from '../../lib/seo';
import { meta, items } from '../../data/objects';

export const metadata = buildMetadata({
  title: meta.title,
  description: meta.description,
  path: '/portfolio/objects',
});

export default function Page() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([
        { name: 'Home', path: '/' },
        { name: 'Portfolio', path: '/portfolio/objects' },
        { name: meta.title, path: '/portfolio/objects' },
      ])} />
      <JsonLd data={itemListJsonLd({
        name: `${meta.title} — ANVIL`,
        path: '/portfolio/objects',
        items,
      })} />
      <ObjectsPageClient />
    </>
  );
}
