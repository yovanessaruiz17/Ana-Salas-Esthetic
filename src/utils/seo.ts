import { FAQ, Review, Service, SiteSettings } from '../types';

export function generateLocalBusinessSchema(
  settings: SiteSettings,
  services: Service[] = [],
  reviews: Review[] = []
) {
  const approvedReviews = reviews.filter((r) => r.status === 'approved');
  const totalReviews = approvedReviews.length;
  const avgRating = totalReviews > 0
    ? (approvedReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1)
    : null;

  const schema: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'BeautySalon',
    name: settings.business_name || 'Ana María Salas Studio',
    image: settings.hero_image_url || settings.logo_url || undefined,
    description: settings.description,
    telephone: settings.phone,
    email: settings.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: settings.address,
      addressLocality: settings.city,
      addressRegion: settings.state,
      addressCountry: settings.country,
    },
    priceRange: '$$',
  };

  if (settings.google_maps_url) {
    schema.hasMap = settings.google_maps_url;
  }

  if (avgRating && totalReviews > 0) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: avgRating,
      reviewCount: totalReviews,
      bestRating: '5',
      worstRating: '1',
    };
  }

  if (services.length > 0) {
    schema.hasOfferCatalog = {
      '@type': 'OfferCatalog',
      name: 'Catálogo de Servicios de Belleza',
      itemListElement: services.slice(0, 10).map((s) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: s.name,
          description: s.short_description || s.description,
        },
        price: s.price,
        priceCurrency: 'COP',
      })),
    };
  }

  return JSON.stringify(schema);
}

export function generateFAQSchema(faqs: FAQ[]) {
  if (faqs.length === 0) return null;
  const activeFaqs = faqs.filter((f) => f.active);
  if (activeFaqs.length === 0) return null;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: activeFaqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return JSON.stringify(schema);
}

export function generateServiceSchema(service: Service, settings: SiteSettings) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.description || service.short_description,
    provider: {
      '@type': 'BeautySalon',
      name: settings.business_name,
      telephone: settings.phone,
    },
    offers: {
      '@type': 'Offer',
      price: service.price,
      priceCurrency: 'COP',
    },
  };

  return JSON.stringify(schema);
}
