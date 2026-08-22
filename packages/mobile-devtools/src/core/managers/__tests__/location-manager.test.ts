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

  it('should notify subscribers on history pushState, replaceState, popstate, and hashchange', () => {
    const listener = vi.fn();
    const errorListener = vi.fn().mockImplementation(() => {
      throw new Error('Listener error');
    });

    const unsubscribe = LocationManager.subscribe(listener);
    const unsubscribeErr = LocationManager.subscribe(errorListener);

    // Call init again to verify idempotency check
    LocationManager.initLocationTracking();

    window.history.pushState({}, '', '/new-test-path');
    expect(listener).toHaveBeenCalled();

    window.history.replaceState({}, '', '/replaced-path');
    expect(listener).toHaveBeenCalledTimes(2);

    window.dispatchEvent(new Event('popstate'));
    expect(listener).toHaveBeenCalledTimes(3);

    window.dispatchEvent(new Event('hashchange'));
    expect(listener).toHaveBeenCalledTimes(4);

    unsubscribe();
    unsubscribeErr();

    window.history.pushState({}, '', '/after-unsubscribe');
    expect(listener).toHaveBeenCalledTimes(4);
  });

  it('should fallback gracefully when URLSearchParams fails', () => {
    const origURLSearchParams = globalThis.URLSearchParams;
    (globalThis as any).URLSearchParams = function () {
      throw new Error('Malformed URL params');
    };

    const details = LocationManager.getLocationDetails();
    expect(details.queryParams).toEqual({});

    globalThis.URLSearchParams = origURLSearchParams;
  });
});

