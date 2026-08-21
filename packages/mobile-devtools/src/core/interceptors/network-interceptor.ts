import { NETWORK_STATUS, NETWORK_THROTTLING, NETWORK_TYPES } from '../constants';
import { DevToolsStore } from '../stores/devtools-store';
import { NetworkRequestEntry } from '../types/network';
import { isServer } from '../utils/env';
import { generateId } from '../utils/id';
import { safeJsonParse } from '../utils/json';
import { maskSensitiveValue } from '../utils/privacy';

export class NetworkInterceptor {
  private originalFetch: typeof window.fetch | null = null;
  private originalXhrOpen: typeof XMLHttpRequest.prototype.open | null = null;
  private originalXhrSend: typeof XMLHttpRequest.prototype.send | null = null;
  private originalXhrSetRequestHeader: typeof XMLHttpRequest.prototype.setRequestHeader | null =
    null;
  private isPatched = false;
  private store: DevToolsStore;

  constructor(store: DevToolsStore) {
    this.store = store;
  }

  public init() {
    if (this.isPatched || isServer) return;

    this.patchFetch();
    this.patchXHR();
    this.isPatched = true;
  }

  private patchFetch() {
    if (!window.fetch) return;

    this.originalFetch = window.fetch.bind(window);

    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const startTime = Date.now();
      const id = generateId('req');

      let url = '';
      if (typeof input === 'string') {
        url = input;
      } else if (input instanceof URL) {
        url = input.toString();
      } else {
        url = input.url;
      }

      let method = init?.method;
      if (!method) {
        method = input instanceof Request ? input.method : 'GET';
      }

      const reqHeaders: Record<string, string> = {};
      if (init?.headers) {
        if (init.headers instanceof Headers) {
          init.headers.forEach((val, key) => {
            reqHeaders[key] = val;
          });
        } else if (Array.isArray(init.headers)) {
          init.headers.forEach(([key, val]) => {
            reqHeaders[key] = val;
          });
        } else {
          Object.assign(reqHeaders, init.headers);
        }
      }

      const requestBody = safeJsonParse(init?.body);

      const maskKeys = this.store.getMaskKeys();
      const maskedReqHeaders = maskSensitiveValue(reqHeaders, '', maskKeys);
      const maskedReqBody = maskSensitiveValue(requestBody, '', maskKeys);

      const entry: NetworkRequestEntry = {
        id,
        url,
        method: method.toUpperCase(),
        status: 0,
        statusText: 'Pending',
        type: NETWORK_TYPES.FETCH,
        startTime,
        requestHeaders: maskedReqHeaders,
        requestBody: maskedReqBody,
        responseHeaders: {},
        responseBody: null,
        errorState: NETWORK_STATUS.PENDING,
      };

      this.store.addNetworkRequest(entry);

      const throttling = this.store.getNetworkThrottling();

      if (throttling === NETWORK_THROTTLING.OFFLINE) {
        const endTime = Date.now();
        const offlineErr = new TypeError('Failed to fetch (Simulated Offline Mode)');
        this.store.updateNetworkRequest(id, {
          status: 0,
          statusText: 'Offline (Simulated)',
          endTime,
          duration: 0,
          responseBody: 'Network offline (Simulated in DevTools)',
          errorState: 'error',
        });
        throw offlineErr;
      }

      if (throttling === NETWORK_THROTTLING.SLOW_3G) {
        await new Promise((resolve) => setTimeout(resolve, 500));
      } else if (throttling === NETWORK_THROTTLING.FAST_3G) {
        await new Promise((resolve) => setTimeout(resolve, 150));
      }

      try {
        const response = await this.originalFetch!(input, init);
        const endTime = Date.now();
        const duration = endTime - startTime;

        const resHeaders: Record<string, string> = {};
        response.headers.forEach((val, key) => {
          resHeaders[key] = val;
        });

        // Clone response to read body without consuming original stream
        let responseBody: any = null;
        try {
          const clone = response.clone();
          const contentType = response.headers.get('content-type') || '';
          if (contentType.includes('application/json')) {
            responseBody = await clone.json();
          } else {
            const text = await clone.text();
            responseBody = safeJsonParse(text, text.substring(0, 5000));
          }
        } catch {
          responseBody = '[Unable to parse response body]';
        }

        this.store.updateNetworkRequest(id, {
          status: response.status,
          statusText: response.statusText || (response.ok ? 'OK' : 'Error'),
          endTime,
          duration,
          responseHeaders: resHeaders,
          responseBody,
          errorState: response.ok ? 'success' : 'error',
        });

        return response;
      } catch (err: any) {
        const endTime = Date.now();
        this.store.updateNetworkRequest(id, {
          status: 0,
          statusText: err?.message || 'Network Failed',
          endTime,
          duration: endTime - startTime,
          responseBody: err?.message || 'Fetch Failed',
          errorState: 'error',
        });
        throw err;
      }
    };
  }

  private patchXHR() {
    if (!window.XMLHttpRequest) return;

    const self = this;
    const proto = XMLHttpRequest.prototype;

    this.originalXhrOpen = proto.open;
    this.originalXhrSend = proto.send;
    this.originalXhrSetRequestHeader = proto.setRequestHeader;

    proto.open = function (method: string, url: string | URL, ...rest: any[]) {
      (this as any).__devToolsId = generateId('xhr');
      (this as any).__devToolsMethod = method.toUpperCase();
      (this as any).__devToolsUrl = typeof url === 'string' ? url : url.toString();
      (this as any).__devToolsReqHeaders = {};
      (this as any).__devToolsStartTime = Date.now();

      return self.originalXhrOpen!.apply(this, [method, url, ...rest] as any);
    };

    proto.setRequestHeader = function (header: string, value: string) {
      if ((this as any).__devToolsReqHeaders) {
        (this as any).__devToolsReqHeaders[header] = value;
      }
      return self.originalXhrSetRequestHeader!.apply(this, [header, value]);
    };

    proto.send = function (body?: any) {
      const id = (this as any).__devToolsId;
      const startTime = (this as any).__devToolsStartTime || Date.now();
      const method = (this as any).__devToolsMethod || 'GET';
      const url = (this as any).__devToolsUrl || '';
      const reqHeaders = (this as any).__devToolsReqHeaders || {};

      const requestBody = safeJsonParse(body);

      if (id) {
        self.store.addNetworkRequest({
          id,
          url,
          method,
          status: 0,
          statusText: 'Pending',
          type: 'xhr',
          startTime,
          requestHeaders: reqHeaders,
          requestBody,
          responseHeaders: {},
          responseBody: null,
          errorState: 'pending',
        });

        this.addEventListener('readystatechange', function () {
          if (this.readyState === 4) {
            const endTime = Date.now();
            const duration = endTime - startTime;

            const rawHeaders = this.getAllResponseHeaders() || '';
            const resHeaders: Record<string, string> = {};
            rawHeaders.split('\r\n').forEach((line) => {
              const parts = line.split(': ');
              if (parts.length === 2 && parts[0]) {
                resHeaders[parts[0].toLowerCase()] = parts[1] || '';
              }
            });

            let responseBody: any = null;
            try {
              if (this.responseType === '' || this.responseType === 'text') {
                responseBody = safeJsonParse(this.responseText);
              } else if (this.responseType === 'json') {
                responseBody = this.response;
              } else {
                responseBody = `[Response Type: ${this.responseType}]`;
              }
            } catch {
              responseBody = '[Unable to parse response]';
            }

            self.store.updateNetworkRequest(id, {
              status: this.status,
              statusText:
                this.statusText || (this.status >= 200 && this.status < 300 ? 'OK' : 'Error'),
              endTime,
              duration,
              responseHeaders: resHeaders,
              responseBody,
              errorState: this.status >= 200 && this.status < 400 ? 'success' : 'error',
            });
          }
        });

        this.addEventListener('error', function () {
          const endTime = Date.now();
          self.store.updateNetworkRequest(id, {
            status: 0,
            statusText: 'XHR Error',
            endTime,
            duration: endTime - startTime,
            responseBody: 'XMLHttpRequest Failed',
            errorState: 'error',
          });
        });
      }

      return self.originalXhrSend!.apply(this, [body]);
    };
  }

  public restore() {
    if (!this.isPatched || isServer) return;

    if (this.originalFetch && window.fetch) {
      window.fetch = this.originalFetch;
    }

    if (window.XMLHttpRequest) {
      const proto = XMLHttpRequest.prototype;
      if (this.originalXhrOpen) proto.open = this.originalXhrOpen;
      if (this.originalXhrSend) proto.send = this.originalXhrSend;
      if (this.originalXhrSetRequestHeader)
        proto.setRequestHeader = this.originalXhrSetRequestHeader;
    }

    this.isPatched = false;
  }
}
