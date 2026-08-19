import { isServer } from '../utils/env';

export interface LocationDetails {
  href: string;
  origin: string;
  protocol: string;
  host: string;
  hostname: string;
  port: string;
  pathname: string;
  search: string;
  hash: string;
  queryParams: Record<string, string>;
}

export type LocationChangeListener = (details: LocationDetails) => void;

export class LocationManager {
  private static listeners: Set<LocationChangeListener> = new Set();
  private static isPatched = false;

  public static getLocationDetails(): LocationDetails {
    if (isServer || !window.location) {
      return {
        href: '',
        origin: '',
        protocol: '',
        host: '',
        hostname: '',
        port: '',
        pathname: '',
        search: '',
        hash: '',
        queryParams: {},
      };
    }

    const loc = window.location;
    const queryParams: Record<string, string> = {};

    try {
      const searchParams = new URLSearchParams(loc.search || '');
      searchParams.forEach((val, key) => {
        queryParams[key] = val;
      });
    } catch {
      // Fallback
    }

    return {
      href: loc.href || '',
      origin: loc.origin || '',
      protocol: loc.protocol || '',
      host: loc.host || '',
      hostname: loc.hostname || '',
      port: loc.port || '',
      pathname: loc.pathname || '',
      search: loc.search || '',
      hash: loc.hash || '',
      queryParams,
    };
  }

  public static initLocationTracking(): void {
    if (isServer || this.isPatched) return;
    this.isPatched = true;

    const notify = () => {
      const details = this.getLocationDetails();
      this.listeners.forEach((listener) => {
        try {
          listener(details);
        } catch {
          // Ignore listener error
        }
      });
    };

    window.addEventListener('popstate', notify);
    window.addEventListener('hashchange', notify);

    // Monkey-patch history.pushState and history.replaceState for SPA routing
    if (window.history) {
      const origPushState = window.history.pushState;
      const origReplaceState = window.history.replaceState;

      window.history.pushState = function (...args) {
        const result = origPushState.apply(this, args);
        notify();
        return result;
      };

      window.history.replaceState = function (...args) {
        const result = origReplaceState.apply(this, args);
        notify();
        return result;
      };
    }
  }

  public static subscribe(listener: LocationChangeListener): () => void {
    this.initLocationTracking();
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }
}
