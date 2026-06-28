import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  onLoad?: () => void;
}

export const OptimizedImage = ({ 
  src, 
  alt, 
  className, 
  priority = false,
  objectFit = 'cover',
  onLoad 
}: OptimizedImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (priority) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '50px',
        threshold: 0.01,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {!isLoaded && (
        <div 
          className="absolute inset-0 bg-muted animate-pulse" 
          aria-hidden="true"
        />
      )}
      <img
        ref={imgRef}
        src={isInView ? src : undefined}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        onLoad={handleLoad}
        className={cn(
          'w-full h-auto transition-opacity duration-500',
          isLoaded ? 'opacity-100' : 'opacity-0',
          `object-${objectFit}`
        )}
        style={{ contentVisibility: 'auto' }}
      />
    </div>
  );
};
