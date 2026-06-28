// Input validation utilities
export const sanitizeInput = (input: string | undefined | null): string => {
  if (!input) return '';
  return input.trim().slice(0, 1000); // Limit length to prevent issues
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateNumericInput = (value: number | string, min = 0, max = 1000000): boolean => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return !isNaN(num) && num >= min && num <= max;
};

export const validateCoordinates = (lat: number, lng: number): boolean => {
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
};

export const validateImageUrl = (url: string): boolean => {
  if (!url) return false;
  try {
    new URL(url);
    return url.match(/\.(jpg|jpeg|png|gif|webp)$/i) !== null;
  } catch {
    return false;
  }
};

export const debounce = <T extends (...args: any[]) => void>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};