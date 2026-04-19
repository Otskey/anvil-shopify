import ReviewsPageClient from './ReviewsPageClient';
import JsonLd from '../components/JsonLd';
import { buildMetadata, breadcrumbJsonLd } from '../lib/seo';
import { meta } from '../data/reviews';

export const metadata = buildMetadata({
  title: meta.title,
  description: meta.description,
  path: '/reviews',
});

export default function Page() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([
        { name: 'Home', path: '/' },
        { name: 'Reviews', path: '/reviews' },
      ])} />
      <ReviewsPageClient />
    </>
  );
}
