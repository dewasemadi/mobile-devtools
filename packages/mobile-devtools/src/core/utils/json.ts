/**
 * Safely parses a JSON string. If parsing fails or input is not a string,
 * returns the provided fallback (or the original input if no fallback is supplied).
 */
export function safeJsonParse<T = any, F = T>(input: unknown, fallback?: F): T | F {
  if (typeof input !== 'string') {
    return (fallback !== undefined ? fallback : input) as T | F;
  }
  try {
    return JSON.parse(input) as T;
  } catch {
    return (fallback !== undefined ? fallback : input) as T | F;
  }
}
