import { describe, expect, it } from 'vitest';
import { safeJsonParse } from '../json';

describe('safeJsonParse', () => {
  it('should correctly parse valid JSON strings', () => {
    expect(safeJsonParse('{"foo": "bar"}')).toEqual({ foo: 'bar' });
    expect(safeJsonParse('[1, 2, 3]')).toEqual([1, 2, 3]);
    expect(safeJsonParse('123')).toBe(123);
    expect(safeJsonParse('true')).toBe(true);
    expect(safeJsonParse('"hello"')).toBe('hello');
  });

  it('should return original string when JSON is invalid and no fallback is provided', () => {
    expect(safeJsonParse('invalid json')).toBe('invalid json');
    expect(safeJsonParse('{foo: bar}')).toBe('{foo: bar}');
  });

  it('should return fallback value when JSON parsing fails and fallback is provided', () => {
    expect(safeJsonParse('invalid json', null)).toBeNull();
    expect(safeJsonParse<{ a: number }, null>('invalid json', null)).toBeNull();
    expect(safeJsonParse('invalid json', { fallback: true })).toEqual({ fallback: true });
    expect(safeJsonParse('{foo: bar}', 'fallback-string')).toBe('fallback-string');
  });

  it('should return non-string inputs as-is', () => {
    const obj = { already: 'object' };
    expect(safeJsonParse(obj)).toBe(obj);

    const arr = [1, 2];
    expect(safeJsonParse(arr)).toBe(arr);

    expect(safeJsonParse(null)).toBeNull();
    expect(safeJsonParse(undefined)).toBeUndefined();
    expect(safeJsonParse(42)).toBe(42);
  });
});
