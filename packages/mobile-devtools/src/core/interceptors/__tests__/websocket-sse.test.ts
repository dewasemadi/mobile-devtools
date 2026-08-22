import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DevToolsStore } from '../../stores/devtools-store';
import { SSEInterceptor } from '../sse-interceptor';
import { WebSocketInterceptor } from '../websocket-interceptor';

describe('WebSocket & SSE Interceptors', () => {
  let store: DevToolsStore;
  let wsInterceptor: WebSocketInterceptor;
  let sseInterceptor: SSEInterceptor;
  let originalWebSocket: any;
  let originalEventSource: any;

  beforeEach(() => {
    store = new DevToolsStore();
    wsInterceptor = new WebSocketInterceptor(store);
    sseInterceptor = new SSEInterceptor(store);
    originalWebSocket = globalThis.WebSocket;
    originalEventSource = globalThis.EventSource;
  });

  afterEach(() => {
    wsInterceptor.restore();
    sseInterceptor.restore();
    globalThis.WebSocket = originalWebSocket;
    globalThis.EventSource = originalEventSource;
  });

  it('should intercept WebSocket connections and frame messages (open, message, error, close)', () => {
    const mockWS = vi.fn().mockImplementation(function (this: any) {
      this.listeners = {} as Record<string, Function[]>;
      this.addEventListener = (event: string, cb: Function) => {
        if (!this.listeners[event]) this.listeners[event] = [];
        this.listeners[event].push(cb);
      };
      this.dispatchEvent = (event: string, payload: any) => {
        this.listeners[event]?.forEach((cb: Function) => cb(payload));
      };
      this.send = vi.fn();
    });
    (mockWS as any).CONNECTING = 0;
    (mockWS as any).OPEN = 1;
    (mockWS as any).CLOSING = 2;
    (mockWS as any).CLOSED = 3;

    (globalThis as any).WebSocket = mockWS;

    wsInterceptor.init();
    // Test idempotency
    wsInterceptor.init();

    const ws = new (window.WebSocket as any)('ws://example.com/socket', ['graphql-ws', 'chat']);
    let requests = store.getNetworkRequests();

    expect(requests.length).toBe(1);
    expect(requests[0]?.url).toBe('ws://example.com/socket');
    expect(requests[0]?.method).toBe('WS');
    expect(requests[0]?.requestHeaders?.['Sec-WebSocket-Protocol']).toBe('graphql-ws, chat');

    // Simulate open event
    ws.dispatchEvent('open', {});
    requests = store.getNetworkRequests();
    expect(requests[0]?.statusText).toBe('Open');

    // Simulate message event
    ws.dispatchEvent('message', { data: 'hello server' });
    expect(requests[0]?.frames?.length).toBe(1);
    expect(requests[0]?.frames?.[0]?.type).toBe('received');
    expect(requests[0]?.frames?.[0]?.data).toBe('hello server');

    // Simulate sending string and object data
    ws.send('ping');
    ws.send({ action: 'subscribe' });
    expect(requests[0]?.frames?.length).toBe(3);
    expect(requests[0]?.frames?.[1]?.type).toBe('sent');
    expect(requests[0]?.frames?.[2]?.data).toBe('{"action":"subscribe"}');

    // Simulate error event
    ws.dispatchEvent('error', {});
    requests = store.getNetworkRequests();
    expect(requests[0]?.errorState).toBe('error');

    // Simulate close event
    ws.dispatchEvent('close', { code: 1000 });
    requests = store.getNetworkRequests();
    expect(requests[0]?.statusText).toBe('Closed (1000)');

    // Restore
    wsInterceptor.restore();
    wsInterceptor.restore();
  });

  it('should intercept EventSource connections and events', () => {
    const mockES = vi.fn().mockImplementation(function (this: any) {
      this.listeners = {} as Record<string, Function[]>;
      this.addEventListener = (event: string, cb: Function) => {
        if (!this.listeners[event]) this.listeners[event] = [];
        this.listeners[event].push(cb);
      };
      this.dispatchEvent = (event: string, payload: any) => {
        this.listeners[event]?.forEach((cb: Function) => cb(payload));
      };
      this.close = vi.fn();
    });
    (mockES as any).CONNECTING = 0;
    (mockES as any).OPEN = 1;
    (mockES as any).CLOSED = 2;

    (globalThis as any).EventSource = mockES;

    sseInterceptor.init();
    sseInterceptor.init(); // idempotency check

    const es = new (window.EventSource as any)('http://example.com/sse', { withCredentials: true });
    let requests = store.getNetworkRequests();

    expect(requests.length).toBe(1);
    expect(requests[0]?.url).toBe('http://example.com/sse');
    expect(requests[0]?.method).toBe('SSE');

    // Open event
    es.dispatchEvent('open', {});
    requests = store.getNetworkRequests();
    expect(requests[0]?.statusText).toBe('Open');

    // Message event
    es.dispatchEvent('message', { data: 'event payload' });
    requests = store.getNetworkRequests();
    expect(requests[0]?.frames?.length).toBe(1);

    // Error event
    es.dispatchEvent('error', {});
    requests = store.getNetworkRequests();
    expect(requests[0]?.errorState).toBe('error');

    // Close
    es.close();

    sseInterceptor.restore();
    sseInterceptor.restore();
  });
});

