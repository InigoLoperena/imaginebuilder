/**
 * Utility functions for image optimization
 */

export const generateSrcSet = (imagePath: string, sizes: number[] = [320, 640, 960, 1280, 1920]) => {
  // For now, return the same image for all sizes
  // In production, you'd want to generate different sized versions
  return sizes.map(size => `${imagePath} ${size}w`).join(', ');
};

export const getOptimalImageSize = (containerWidth: number): number => {
  const devicePixelRatio = window.devicePixelRatio || 1;
  const targetWidth = containerWidth * devicePixelRatio;
  
  // Round up to nearest standard size
  const standardSizes = [320, 640, 960, 1280, 1920];
  return standardSizes.find(size => size >= targetWidth) || 1920;
};

export const preloadImage = (src: string, priority: 'high' | 'low' = 'low') => {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = src;
  if (priority === 'high') {
    link.setAttribute('fetchpriority', 'high');
  }
  document.head.appendChild(link);
};

export const lazyLoadImage = (
  img: HTMLImageElement,
  src: string,
  options = { threshold: 0.1, rootMargin: '50px' }
) => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          img.src = src;
          img.classList.add('loaded');
          observer.unobserve(img);
        }
      });
    },
    options
  );

  observer.observe(img);
  return () => observer.disconnect();
};
