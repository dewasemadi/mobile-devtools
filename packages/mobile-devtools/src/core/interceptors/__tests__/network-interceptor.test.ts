import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { DevToolsStore } from '../../stores/devtools-store';
import { NetworkInterceptor } from '../network-interceptor';

describe('NetworkInterceptor Deep Branch Tests', () => {
  let store: DevToolsStore;
  let interceptor: NetworkInterceptor;
  let originalFetch: any;

  beforeEach(() => {
    store = new DevToolsStore();
    store.updateConfig({
      privacy: { mask: ['authorization', 'password', 'token'] },
    });
    interceptor = new NetworkInterceptor(store);
    originalFetch = window.fetch;
  });

  afterEach(() => {
    interceptor.restore();
    window.fetch = originalFetch;
  });

  it('should intercept fetch requests and log entry in store', async () => {
    const mockResponse = new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
    window.fetch = vi.fn().mockResolvedValue(mockResponse);

    interceptor.init();
    interceptor.init(); // Test idempotency branch

    await window.fetch('https://api.example.com/items', {
      method: 'POST',
      headers: { Authorization: 'Bearer testtoken' },
      body: JSON.stringify({ name: 'Laptop' }),
    });

    const requests = store.getNetworkRequests();
    expect(requests.length).toBe(1);

    const req = requests[0];
    expect(req.url).toBe('https://api.example.com/items');
    expect(req.method).toBe('POST');
    expect(req.status).toBe(200);
    expect(req.errorState).toBe('success');
    expect(req.requestHeaders?.Authorization).toBe('****** (Masked)');
  });

  it('should handle fetch with Request instance, URL instance, Headers instance, and Array headers', async () => {
    window.fetch = vi.fn().mockResolvedValue(
      new Response('Plain text result', {
        status: 200,
        headers: { 'Content-Type': 'text/plain' },
      })
    );

    interceptor.init();

    // 1. Request object input
    const reqObj = new Request('https://api.example.com/req-obj', { method: 'PUT' });
    await window.fetch(reqObj, { method: 'PUT' });

    // 2. URL object input + Headers instance
    const urlObj = new URL('https://api.example.com/url-obj');
    const headersObj = new Headers({ 'X-Custom-Headers-Class': 'val1' });
    await window.fetch(urlObj, { headers: headersObj });

    // 3. Array headers
    await window.fetch('https://api.example.com/array-headers', {
      headers: [['X-Array-Header', 'val2']],
    });

    const requests = store.getNetworkRequests();
    expect(requests.length).toBe(3);
    expect(requests[2].method).toBe('PUT');
    expect(requests[1].requestHeaders?.['x-custom-headers-class']).toBe('val1');
    expect(requests[0].requestHeaders?.['X-Array-Header']).toBe('val2');
  });


  it('should handle fetch failure / error status and response body clone error', async () => {
    window.fetch = vi.fn().mockRejectedValue(new Error('Failed to fetch'));

    interceptor.init();

    await expect(window.fetch('https://api.example.com/error')).rejects.toThrow('Failed to fetch');

    const requests = store.getNetworkRequests();
    expect(requests.length).toBe(1);
    expect(requests[0].errorState).toBe('error');
  });

  it('should simulate SLOW_3G and FAST_3G throttling', async () => {
    window.fetch = vi.fn().mockResolvedValue(new Response('ok', { status: 200 }));
    interceptor.init();

    store.setNetworkThrottling('slow-3g');
    const slowPromise = window.fetch('https://api.example.com/slow');

    store.setNetworkThrottling('fast-3g');
    const fastPromise = window.fetch('https://api.example.com/fast');

    await Promise.all([slowPromise, fastPromise]);

    const requests = store.getNetworkRequests();
    expect(requests.length).toBe(2);
  });

  it('should respect ignoreNetworkUrls config', async () => {
    store.updateConfig({
      interceptors: {
        ignoreNetworkUrls: ['analytics', /internal-ping/],
      },
    });

    window.fetch = vi.fn().mockResolvedValue(new Response('ok', { status: 200 }));

    interceptor.init();

    await window.fetch('https://api.example.com/analytics/event');
    await window.fetch('https://api.example.com/internal-ping');

    expect(store.getNetworkRequests().length).toBe(0);
  });

  it('should simulate offline network throttling', async () => {
    store.setNetworkThrottling('offline');
    window.fetch = vi.fn().mockResolvedValue(new Response('ok'));

    interceptor.init();

    await expect(window.fetch('https://api.example.com/data')).rejects.toThrow(
      'Simulated Offline Mode'
    );

    const req = store.getNetworkRequests()[0];
    expect(req.statusText).toContain('Offline');
  });

  it('should intercept XMLHttpRequest open with URL object, responseTypes, and readystatechange', () => {
    interceptor.init();

    const xhr = new XMLHttpRequest();
    const urlObj = new URL('https://api.example.com/xhr-endpoint');
    xhr.open('POST', urlObj);
    xhr.setRequestHeader('X-Custom-Header', 'test-val');

    Object.defineProperty(xhr, 'responseType', { value: 'json', writable: true });
    Object.defineProperty(xhr, 'response', { value: { status: 'ok' }, writable: true });
    Object.defineProperty(xhr, 'status', { value: 200, writable: true });
    Object.defineProperty(xhr, 'statusText', { value: '', writable: true });

    xhr.send(JSON.stringify({ payload: 'data' }));

    // Simulate readystatechange 4
    Object.defineProperty(xhr, 'readyState', { value: 4, writable: true });
    xhr.dispatchEvent(new Event('readystatechange'));

    const requests = store.getNetworkRequests();
    expect(requests.length).toBe(1);

    const req = requests[0];
    expect(req.type).toBe('xhr');
    expect(req.url).toBe('https://api.example.com/xhr-endpoint');
    expect(req.method).toBe('POST');
    expect(req.requestHeaders?.['X-Custom-Header']).toBe('test-val');
    expect(req.statusText).toBe('OK');
  });

  it('should handle XHR error events and blob responseType', () => {
    interceptor.init();

    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://api.example.com/xhr-error');
    Object.defineProperty(xhr, 'responseType', { value: 'blob', writable: true });
    Object.defineProperty(xhr, 'status', { value: 500, writable: true });

    xhr.send();

    // Trigger readyState 4 with non-text responseType
    Object.defineProperty(xhr, 'readyState', { value: 4, writable: true });
    xhr.dispatchEvent(new Event('readystatechange'));

    expect(store.getNetworkRequests()[0].responseBody).toContain('Response Type: blob');

    // Trigger error event
    xhr.dispatchEvent(new Event('error'));

    const requests = store.getNetworkRequests();
    expect(requests.length).toBe(1);
    expect(requests[0].errorState).toBe('error');
  });


});

