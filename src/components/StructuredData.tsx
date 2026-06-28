import { useLanguage } from '@/hooks/useLanguage';

export const StructuredData = () => {
  const { language } = useLanguage();

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "GreenHunt",
    "applicationCategory": "LifestyleApplication",
    "operatingSystem": "iOS, Android",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "description": language === 'en' 
      ? "Easiest and most fun way to do Stooping in your city. Find or share free discarded stuff. Avoid stuff from becoming waste taking photos and earn rewards"
      : "La forma más fácil y divertida de hacer Stooping en tu ciudad. Encuentra o comparte cosas gratis descartadas. Evita que se conviertan en basura y gana recompensas",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "1250"
    },
    "featureList": [
      "Hunt abandoned furniture and treasures",
      "Share coordinates for money",
      "Explore circular markets",
      "Create thrift store profiles",
      "Waste management integration"
    ]
  };

  const organizationData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "GreenHunt",
    "url": "https://greenhunt.net",
    "logo": "https://greenhunt.net/lovable-uploads/greenhunt-logo-new.svg",
    "sameAs": [
      "https://www.linkedin.com/company/greenhunt",
      "https://www.instagram.com/greenhuntstoopingapp/",
      "https://x.com/StoopingApp",
      "https://www.youtube.com/@GreenHuntStoopingApp",
      "https://www.tiktok.com/@greenhuntstoopingapp"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "email": "hello@greenhunt.net",
      "contactType": "customer service"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationData) }}
      />
    </>
  );
};
