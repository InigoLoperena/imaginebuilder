import { useState, useEffect, useCallback, useRef } from 'react';

// Enhanced debounce hook with cancellation and immediate execution options
export const useDebounce = <T,>(
  value: T, 
  delay: number,
  options?: {
    leading?: boolean; // Execute immediately on first call
    maxWait?: number; // Maximum time to wait before forced execution
  }
): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const maxTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const lastCallTimeRef = useRef<number>();
  const leadingRef = useRef<boolean>(true);

  useEffect(() => {
    const now = Date.now();
    const { leading = false, maxWait } = options || {};

    // Handle leading edge execution
    if (leading && leadingRef.current) {
      setDebouncedValue(value);
      leadingRef.current = false;
      lastCallTimeRef.current = now;
      return;
    }

    // Clear existing timeouts
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (maxTimeoutRef.current) {
      clearTimeout(maxTimeoutRef.current);
    }

    // Set up main debounce timeout
    timeoutRef.current = setTimeout(() => {
      setDebouncedValue(value);
      leadingRef.current = true;
      lastCallTimeRef.current = undefined;
      if (maxTimeoutRef.current) {
        clearTimeout(maxTimeoutRef.current);
      }
    }, delay);

    // Set up max wait timeout if specified
    if (maxWait && lastCallTimeRef.current) {
      const timeElapsed = now - lastCallTimeRef.current;
      const remainingMaxTime = maxWait - timeElapsed;

      if (remainingMaxTime > 0) {
        maxTimeoutRef.current = setTimeout(() => {
          setDebouncedValue(value);
          leadingRef.current = true;
          lastCallTimeRef.current = undefined;
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
        }, remainingMaxTime);
      }
    } else if (maxWait) {
      lastCallTimeRef.current = now;
    }

    // Cleanup function
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (maxTimeoutRef.current) {
        clearTimeout(maxTimeoutRef.current);
      }
    };
  }, [value, delay, options?.leading, options?.maxWait]);

  return debouncedValue;
};

// Debounced callback hook for function calls
export const useDebouncedCallback = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
  deps: React.DependencyList = []
): T => {
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const debouncedCallback = useCallback((...args: Parameters<T>) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  }, [callback, delay, ...deps]) as T;

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedCallback;
};

// Rate-limited hook to prevent excessive API calls
export const useRateLimit = (limit: number = 10, windowMs: number = 60000) => {
  const callsRef = useRef<number[]>([]);

  const checkRateLimit = useCallback((): boolean => {
    const now = Date.now();
    const windowStart = now - windowMs;

    // Remove old calls outside the current window
    callsRef.current = callsRef.current.filter(time => time > windowStart);

    // Check if we're under the limit
    if (callsRef.current.length >= limit) {
      return false;
    }

    // Add current call
    callsRef.current.push(now);
    return true;
  }, [limit, windowMs]);

  return { checkRateLimit };
};