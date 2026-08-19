import { describe, it, expect, vi, afterEach } from 'vitest';
import { SystemManager } from '../system-manager';

describe('SystemManager', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    delete (window as any).memory;
  });

  it('should collect system environment diagnostics', () => {
    const diagnostics = SystemManager.getDiagnostics();
    expect(diagnostics).toBeDefined();
    expect(diagnostics.userAgent).toBeDefined();
    expect(diagnostics.viewportSize).toBeDefined();
    expect(diagnostics.screenResolution).toBeDefined();
  });

  it('should parse various browser user agents correctly', () => {
    // Firefox
    vi.spyOn(navigator, 'userAgent', 'get').mockReturnValue(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:109.0) Gecko/20100101 Firefox/115.0'
    );
    let diag = SystemManager.getDiagnostics();
    expect(diag.browserName).toBe('Firefox');
    expect(diag.osName).toBe('macOS');

    // Edge
    vi.spyOn(navigator, 'userAgent', 'get').mockReturnValue(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36 Edg/114.0.1823.51'
    );
    diag = SystemManager.getDiagnostics();
    expect(diag.browserName).toBe('Edge');
    expect(diag.osName).toBe('Windows');

    // iPhone Safari
    vi.spyOn(navigator, 'userAgent', 'get').mockReturnValue(
      'Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1'
    );
    diag = SystemManager.getDiagnostics();
    expect(diag.browserName).toBe('Safari');
    expect(diag.osName).toBe('iOS');

    // Android Chrome
    vi.spyOn(navigator, 'userAgent', 'get').mockReturnValue(
      'Mozilla/5.0 (Linux; Android 13; SM-S901B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Mobile Safari/537.36'
    );
    diag = SystemManager.getDiagnostics();
    expect(diag.browserName).toBe('Chrome');
    expect(diag.osName).toBe('Android');

    // Linux
    vi.spyOn(navigator, 'userAgent', 'get').mockReturnValue(
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36'
    );
    diag = SystemManager.getDiagnostics();
    expect(diag.osName).toBe('Linux');
  });

  it('should collect JS Heap memory info if available', () => {
    (window as any).memory = {
      jsHeapSizeLimit: 2147483648,
      usedJSHeapSize: 52428800,
    };

    const diag = SystemManager.getDiagnostics();
    expect(diag.jsHeapSizeLimit).toBe('2048 MB');
    expect(diag.usedJsHeapSize).toBe('50 MB');
  });
});
