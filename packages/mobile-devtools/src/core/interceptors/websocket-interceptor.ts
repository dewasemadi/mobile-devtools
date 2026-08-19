import { HTTP_METHODS, NETWORK_FRAME_TYPES, NETWORK_TYPES } from '../constants';
import { DevToolsStore } from '../stores/devtools-store';
import { isBrowser } from '../utils/env';
import { generateId } from '../utils/id';

export class WebSocketInterceptor {
  private store: DevToolsStore;
  private originalWebSocket: typeof window.WebSocket | null = null;
  private isInitialized = false;

  constructor(store: DevToolsStore) {
    this.store = store;
  }

  public init() {
    if (!isBrowser || this.isInitialized || typeof window.WebSocket === 'undefined') return;

    this.originalWebSocket = window.WebSocket;
    const store = this.store;
    const OriginalWebSocket = this.originalWebSocket;

    function ProxyWebSocket(this: any, url: string | URL, protocols?: string | string[]) {
      const ws = new (OriginalWebSocket as any)(url, protocols);
      const id = generateId('ws');
      const startTime = Date.now();

      store.addNetworkRequest({
        id,
        url: String(url),
        method: HTTP_METHODS.WS,
        status: 101,
        statusText: 'Connecting',
        type: NETWORK_TYPES.WEBSOCKET,
        startTime,
        requestHeaders: protocols
          ? {
              'Sec-WebSocket-Protocol': Array.isArray(protocols)
                ? protocols.join(', ')
                : String(protocols),
            }
          : undefined,
        frames: [],
      });

      ws.addEventListener('open', () => {
        store.updateNetworkRequest(id, { statusText: 'Open', status: 101 });
      });

      ws.addEventListener('message', (event: MessageEvent) => {
        store.addNetworkFrame(id, {
          id: generateId('f'),
          type: NETWORK_FRAME_TYPES.RECEIVED,
          data: event.data,
          timestamp: Date.now(),
        });
      });

      ws.addEventListener('error', () => {
        store.updateNetworkRequest(id, { statusText: 'Error', errorState: 'error' });
      });

      ws.addEventListener('close', (event: CloseEvent) => {
        const endTime = Date.now();
        store.updateNetworkRequest(id, {
          statusText: `Closed (${event.code})`,
          endTime,
          duration: endTime - startTime,
        });
      });

      const originalSend = ws.send.bind(ws);
      ws.send = function (data: any) {
        store.addNetworkFrame(id, {
          id: generateId('f'),
          type: NETWORK_FRAME_TYPES.SENT,
          data: typeof data === 'object' ? JSON.stringify(data) : String(data),
          timestamp: Date.now(),
        });
        return originalSend(data);
      };

      return ws;
    }

    ProxyWebSocket.prototype = OriginalWebSocket.prototype;
    ProxyWebSocket.CONNECTING = OriginalWebSocket.CONNECTING;
    ProxyWebSocket.OPEN = OriginalWebSocket.OPEN;
    ProxyWebSocket.CLOSING = OriginalWebSocket.CLOSING;
    ProxyWebSocket.CLOSED = OriginalWebSocket.CLOSED;

    window.WebSocket = ProxyWebSocket as any;
    this.isInitialized = true;
  }

  public restore() {
    if (!isBrowser || !this.isInitialized || !this.originalWebSocket) return;
    window.WebSocket = this.originalWebSocket;
    this.originalWebSocket = null;
    this.isInitialized = false;
  }
}
