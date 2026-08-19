import { isBrowser } from './env';

/**
 * Generates a unique string ID using crypto.randomUUID() with a fallback.
 * @param prefix Optional prefix string (e.g. 'req', 'ws', 'log', 'f')
 */
export function generateId(prefix = 'id'): string {
  if (isBrowser && typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `${prefix}_${crypto.randomUUID().substring(0, 8)}`;
  }

  // Fallback for legacy environments
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 7)}`;
}
