import { useState, useCallback } from 'react';
import { toast } from 'sonner';

interface UseAsyncOperationOptions {
  successMessage?: string;
  errorMessage?: string;
  onSuccess?: () => void;
  onError?: (error: any) => void;
}

export const useAsyncOperation = <T,>(
  operation: () => Promise<T>,
  options: UseAsyncOperationOptions = {}
) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (): Promise<T | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await operation();
      
      if (options.successMessage) {
        toast.success(options.successMessage);
      }
      
      if (options.onSuccess) {
        options.onSuccess();
      }
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      
      if (options.errorMessage) {
        toast.error(options.errorMessage);
      } else {
        toast.error(errorMessage);
      }
      
      if (options.onError) {
        options.onError(err);
      }
      
      return null;
    } finally {
      setLoading(false);
    }
  }, [operation, options]);

  return { execute, loading, error };
};