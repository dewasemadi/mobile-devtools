import { HTTP_METHODS, NETWORK_FRAME_TYPES, NETWORK_TYPES } from '../constants';
import { DevToolsStore } from '../stores/devtools-store';
import { isBrowser } from '../utils/env';
import { generateId } from '../utils/id';

export class SSEInterceptor {
  private store: DevToolsStore;
  private originalEventSource: typeof window.EventSource | null = null;
  private isInitialized = false;

  constructor(store: DevToolsStore) {
    this.store = store;
  }

  public init() {
    if (!isBrowser || this.isInitialized || typeof window.EventSource === 'undefined') return;

    this.originalEventSource = window.EventSource;
    const store = this.store;
    const OriginalEventSource = this.originalEventSource;

    function ProxyEventSource(this: any, url: string | URL, eventSourceInitDict?: EventSourceInit) {
      const es = new (OriginalEventSource as any)(url, eventSourceInitDict);
      const id = generateId('sse');
      const startTime = Date.now();

      store.addNetworkRequest({
        id,
        url: String(url),
        method: HTTP_METHODS.SSE,
        status: 200,
        statusText: 'Connecting',
        type: NETWORK_TYPES.EVENTSOURCE,
        startTime,
        frames: [],
      });

      es.addEventListener('open', () => {
        store.updateNetworkRequest(id, { statusText: 'Open', status: 200 });
      });

      es.addEventListener('message', (event: MessageEvent) => {
        store.addNetworkFrame(id, {
          id: generateId('f'),
          type: NETWORK_FRAME_TYPES.RECEIVED,
          data: event.data,
          timestamp: Date.now(),
        });
      });

      const originalAddEventListener = es.addEventListener.bind(es);
      es.addEventListener = function (type: string, listener: any, options?: any) {
        if (type !== 'open' && type !== 'error' && type !== 'message') {
          originalAddEventListener(type, (event: MessageEvent) => {
            store.addNetworkFrame(id, {
              id: generateId('f'),
              type: NETWORK_FRAME_TYPES.RECEIVED,
              data: event?.data !== undefined ? event.data : String(event),
              timestamp: Date.now(),
            });
          });
        }
        return originalAddEventListener(type, listener, options);
      };

      es.addEventListener('error', () => {
        store.updateNetworkRequest(id, { statusText: 'Error', errorState: 'error' });
      });

      return es;
    }

    ProxyEventSource.prototype = OriginalEventSource.prototype;
    ProxyEventSource.CONNECTING = OriginalEventSource.CONNECTING;
    ProxyEventSource.OPEN = OriginalEventSource.OPEN;
    ProxyEventSource.CLOSED = OriginalEventSource.CLOSED;

    window.EventSource = ProxyEventSource as any;
    this.isInitialized = true;
  }

  public restore() {
    if (!isBrowser || !this.isInitialized || !this.originalEventSource) return;
    window.EventSource = this.originalEventSource;
    this.originalEventSource = null;
    this.isInitialized = false;
  }
}
