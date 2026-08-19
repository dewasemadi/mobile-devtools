import { describe, expect, it, vi } from 'vitest';
import { LocationManager } from '../location-manager';

describe('LocationManager', () => {
  it('should return location details from window.location', () => {
    const details = LocationManager.getLocationDetails();
    expect(details).toBeDefined();
    expect(details.href).toBeDefined();
    expect(details.pathname).toBeDefined();
    expect(details.queryParams).toBeDefined();
  });

  it('should parse query parameters correctly', () => {
    const origLoc = window.location;
    delete (window as any).location;
    (window as any).location = new URL(
      'https://staging.myapp.com/checkout?order_id=12345&source=app#payment'
    );

    const details = LocationManager.getLocationDetails();
    expect(details.href).toBe(
      'https://staging.myapp.com/checkout?order_id=12345&source=app#payment'
    );
    expect(details.pathname).toBe('/checkout');
    expect(details.search).toBe('?order_id=12345&source=app');
    expect(details.hash).toBe('#payment');
    expect(details.queryParams).toEqual({
      order_id: '12345',
      source: 'app',
    });

    (window as any).location = origLoc;
  });

  it('should notify subscribers on history pushState and popstate', () => {
    const listener = vi.fn();
    const unsubscribe = LocationManager.subscribe(listener);

    window.history.pushState({}, '', '/new-test-path');
    expect(listener).toHaveBeenCalled();

    unsubscribe();
  });
});
