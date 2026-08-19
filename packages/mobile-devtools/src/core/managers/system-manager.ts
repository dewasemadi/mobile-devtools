import { SCREEN_ORIENTATIONS } from '../constants';
import { SystemDiagnostics } from '../types/system';
import { isBrowser, isServer } from '../utils/env';

export class SystemManager {
  public static getDiagnostics(): SystemDiagnostics {
    if (isServer) {
      return {
        userAgent: 'SSR',
        browserName: 'Unknown',
        browserVersion: '0',
        osName: 'Unknown',
        screenResolution: '0x0',
        viewportSize: '0x0',
        devicePixelRatio: 1,
        orientation: SCREEN_ORIENTATIONS.PORTRAIT,
        online: true,
      };
    }

    const ua = navigator.userAgent;
    const { name: browserName, version: browserVersion } = this.parseBrowser(ua);
    const osName = this.parseOS(ua);

    const screenRes = `${window.screen.width} x ${window.screen.height}`;
    const viewport = `${window.innerWidth} x ${window.innerHeight}`;
    const dpr = window.devicePixelRatio || 1;
    const orientation =
      window.innerWidth > window.innerHeight
        ? SCREEN_ORIENTATIONS.LANDSCAPE
        : SCREEN_ORIENTATIONS.PORTRAIT;

    const conn =
      (navigator as any).connection ||
      (navigator as any).mozConnection ||
      (navigator as any).webkitConnection;
    const connectionType = conn?.type || conn?.effectiveType || undefined;

    let jsHeapLimit: string | undefined;
    let usedJsHeap: string | undefined;
    const mem =
      (isBrowser && (window as any).memory) ||
      (typeof performance !== 'undefined' && (performance as any).memory);
    if (mem) {
      jsHeapLimit = `${Math.round(mem.jsHeapSizeLimit / 1024 / 1024)} MB`;
      usedJsHeap = `${Math.round(mem.usedJSHeapSize / 1024 / 1024)} MB`;
    }

    return {
      userAgent: ua,
      browserName,
      browserVersion,
      osName,
      screenResolution: screenRes,
      viewportSize: viewport,
      devicePixelRatio: dpr,
      orientation,
      online: navigator.onLine,
      connectionType,
      jsHeapSizeLimit: jsHeapLimit,
      usedJsHeapSize: usedJsHeap,
    };
  }

  private static parseBrowser(ua: string): { name: string; version: string } {
    let name = 'Browser';
    let version = '0';

    if (ua.includes('Firefox/')) {
      name = 'Firefox';
      version = ua.split('Firefox/')[1]?.split(' ')[0] || '0';
    } else if (ua.includes('Edg/')) {
      name = 'Edge';
      version = ua.split('Edg/')[1]?.split(' ')[0] || '0';
    } else if (ua.includes('Chrome/')) {
      name = 'Chrome';
      version = ua.split('Chrome/')[1]?.split(' ')[0] || '0';
    } else if (ua.includes('Safari/') && !ua.includes('Chrome')) {
      name = 'Safari';
      version = ua.split('Version/')[1]?.split(' ')[0] || '0';
    }

    return { name, version };
  }

  private static parseOS(ua: string): string {
    if (ua.includes('iPhone') || ua.includes('iPad')) return 'iOS';
    if (ua.includes('Android')) return 'Android';
    if (ua.includes('Macintosh')) return 'macOS';
    if (ua.includes('Windows')) return 'Windows';
    if (ua.includes('Linux')) return 'Linux';
    return 'Unknown OS';
  }
}
