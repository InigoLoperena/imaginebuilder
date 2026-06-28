/**
 * Centralized error handling utilities
 */

export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const handleApiError = (error: any): string => {
  if (error instanceof AppError) {
    return error.message;
  }

  if (error?.response?.data?.message) {
    return error.response.data.message;
  }

  if (error?.message) {
    return error.message;
  }

  return 'An unexpected error occurred. Please try again.';
};

export const logError = (error: any, context?: string) => {
  if (import.meta.env.DEV) {
    console.error(`[Error${context ? ` - ${context}` : ''}]:`, error);
  }

  // In production, you might want to send this to an error tracking service
  // like Sentry, LogRocket, etc.
};

export const retryAsync = async <T>(
  fn: () => Promise<T>,
  retries = 3,
  delay = 1000
): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    if (retries === 0) {
      throw error;
    }
    await new Promise(resolve => setTimeout(resolve, delay));
    return retryAsync(fn, retries - 1, delay * 2);
  }
};
