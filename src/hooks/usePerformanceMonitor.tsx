import { useEffect } from 'react';

export const usePerformanceMonitor = () => {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Monitor Core Web Vitals
    const reportWebVitals = () => {
      if ('PerformanceObserver' in window) {
        // Largest Contentful Paint (LCP)
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1] as any;
          console.log('[Performance] LCP:', lastEntry.renderTime || lastEntry.loadTime);
        });
        lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

        // First Input Delay (FID)
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            console.log('[Performance] FID:', entry.processingStart - entry.startTime);
          });
        });
        fidObserver.observe({ type: 'first-input', buffered: true });

        // Cumulative Layout Shift (CLS)
        let clsScore = 0;
        const clsObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            if (!entry.hadRecentInput) {
              clsScore += entry.value;
              console.log('[Performance] CLS:', clsScore);
            }
          });
        });
        clsObserver.observe({ type: 'layout-shift', buffered: true });
      }
    };

    // Report on page load
    if (document.readyState === 'complete') {
      reportWebVitals();
    } else {
      window.addEventListener('load', reportWebVitals);
    }

    return () => {
      window.removeEventListener('load', reportWebVitals);
    };
  }, []);
};
