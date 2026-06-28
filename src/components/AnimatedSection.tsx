import { useEffect, useRef, useState, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  animation?: 'fade-up' | 'fade-in' | 'scale-in' | 'slide-right' | 'slide-left';
  delay?: number;
}

export const AnimatedSection = ({ 
  children, 
  className,
  animation = 'fade-up',
  delay = 0
}: AnimatedSectionProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              setIsVisible(true);
            }, delay);
            observer.disconnect();
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [delay]);

  const animationClasses = {
    'fade-up': isVisible 
      ? 'opacity-100 translate-y-0' 
      : 'opacity-0 translate-y-10',
    'fade-in': isVisible 
      ? 'opacity-100' 
      : 'opacity-0',
    'scale-in': isVisible 
      ? 'opacity-100 scale-100' 
      : 'opacity-0 scale-95',
    'slide-right': isVisible 
      ? 'opacity-100 translate-x-0' 
      : 'opacity-0 -translate-x-10',
    'slide-left': isVisible 
      ? 'opacity-100 translate-x-0' 
      : 'opacity-0 translate-x-10',
  };

  return (
    <div
      ref={sectionRef}
      className={cn(
        'transition-all duration-700 ease-out',
        animationClasses[animation],
        className
      )}
    >
      {children}
    </div>
  );
};
