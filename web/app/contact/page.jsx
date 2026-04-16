import ContactPageClient from './ContactPageClient';
import JsonLd from '../components/JsonLd';
import { buildMetadata, breadcrumbJsonLd, contactPageJsonLd } from '../lib/seo';

export const metadata = buildMetadata({
  title: 'Contact',
  description: 'Enquiries and commissions for Anvil Design & Fabrication — Cambridgeshire steel fabrication workshop. Bring a sketch, a photograph, or just an idea.',
  path: '/contact',
});

export default function Page() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([
        { name: 'Home', path: '/' },
        { name: 'Contact', path: '/contact' },
      ])} />
      <JsonLd data={contactPageJsonLd()} />
      <ContactPageClient />
    </>
  );
}
