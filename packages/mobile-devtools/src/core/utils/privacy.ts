import { MASK_PLACEHOLDER } from '../constants';

/**
 * Recursively masks sensitive key values (e.g. passwords, auth tokens) in objects or primitive strings.
 * @param value Target payload or object.
 * @param keyName Optional property key name.
 * @param maskKeys Array of key substrings to mask (case-insensitive).
 * @returns Masked object payload or string "****** (Masked)".
 */
export function maskSensitiveValue(value: any, keyName = '', maskKeys: string[] = []): any {
  if (value === null || value === undefined) return value;
  if (!maskKeys || maskKeys.length === 0) return value;

  const keysLower = maskKeys.map((k) => k.toLowerCase());

  if (keyName) {
    const keyLower = keyName.toLowerCase();
    if (keysLower.some((k) => keyLower.includes(k))) {
      return MASK_PLACEHOLDER;
    }
  }

  if (typeof value === 'string') {
    return value;
  }

  if (typeof value === 'object' && value !== null) {
    if (Array.isArray(value)) {
      return value.map((item) => maskSensitiveValue(item, '', maskKeys));
    }
    const copy: Record<string, any> = {};
    for (const k of Object.keys(value)) {
      const kLower = k.toLowerCase();
      if (keysLower.some((maskKey) => kLower.includes(maskKey))) {
        copy[k] = MASK_PLACEHOLDER;
      } else {
        copy[k] = maskSensitiveValue(value[k], k, maskKeys);
      }
    }
    return copy;
  }

  return value;
}
