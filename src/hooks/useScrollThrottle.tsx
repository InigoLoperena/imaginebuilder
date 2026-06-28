import { useEffect, useState } from 'react';

/**
 * Custom hook to handle scroll events with throttling
 * @param threshold - Scroll position threshold to trigger callback
 * @param delay - Throttle delay in milliseconds (default: 100)
 */
export const useScrollThrottle = (threshold: number, delay: number = 100) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (timeoutId) {
            clearTimeout(timeoutId);
          }
          
          timeoutId = setTimeout(() => {
            setIsScrolled(window.scrollY > threshold);
          }, delay);
          
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [threshold, delay]);

  return isScrolled;
};
