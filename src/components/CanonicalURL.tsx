import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const BASE_URL = 'https://greenhunt.net';

export const CanonicalURL = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const canonicalUrl = `${BASE_URL}${pathname === '/' ? '/' : pathname.replace(/\/$/, '')}`;
    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;

    if (!link) {
      link = document.createElement('link');
      link.rel = 'canonical';
      document.head.appendChild(link);
    }

    link.href = canonicalUrl;
  }, [pathname]);

  return null;
};
