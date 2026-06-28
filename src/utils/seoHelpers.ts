/**
 * SEO helper functions for better search engine optimization
 */

export const updateMetaTag = (name: string, content: string, property?: boolean) => {
  const attribute = property ? 'property' : 'name';
  let meta = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;
  
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute(attribute, name);
    document.head.appendChild(meta);
  }
  
  meta.content = content;
};

export const updateCanonical = (url: string) => {
  let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
  
  if (!link) {
    link = document.createElement('link');
    link.rel = 'canonical';
    document.head.appendChild(link);
  }
  
  link.href = url;
};

export const setPageTitle = (title: string) => {
  document.title = title;
  updateMetaTag('og:title', title, true);
  updateMetaTag('twitter:title', title);
};

export const setPageDescription = (description: string) => {
  updateMetaTag('description', description);
  updateMetaTag('og:description', description, true);
  updateMetaTag('twitter:description', description);
};

export const generateBreadcrumbSchema = (items: Array<{ name: string; url: string }>) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };
};
