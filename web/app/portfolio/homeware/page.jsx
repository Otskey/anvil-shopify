import HomewarePageClient from './HomewarePageClient';
import JsonLd from '../../components/JsonLd';
import { buildMetadata, breadcrumbJsonLd, itemListJsonLd } from '../../lib/seo';
import { meta, items } from '../../data/homeware';

export const metadata = buildMetadata({
  title: meta.title,
  description: meta.description,
  path: '/portfolio/homeware',
});

export default function Page() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([
        { name: 'Home', path: '/' },
        { name: 'Portfolio', path: '/portfolio/homeware' },
        { name: meta.title, path: '/portfolio/homeware' },
      ])} />
      <JsonLd data={itemListJsonLd({
        name: `${meta.title} — ANVIL`,
        path: '/portfolio/homeware',
        items,
      })} />
      <HomewarePageClient />
    </>
  );
}
