import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { DevToolsStore } from '../../stores/devtools-store';
import { exportBugReport, generateBugReportText } from '../bug-exporter';

describe('bug-exporter', () => {
  let store: DevToolsStore;
  let originalNavigator: any;

  beforeEach(() => {
    store = new DevToolsStore();
    originalNavigator = globalThis.navigator;
  });

  afterEach(() => {
    globalThis.navigator = originalNavigator;
  });

  it('should generate formatted bug report text with logs and network requests', () => {
    store.addLog({
      id: '1',
      level: 'error',
      args: ['Failed to fetch users', { details: 'timeout' }],
      timestamp: Date.now(),
      count: 1,
      stack: 'Error: Failed\n    at test.ts:10',
    });
    store.addNetworkRequest({
      id: 'net_1',
      url: 'https://api.example.com/data',
      method: 'GET',
      status: 500,
      startTime: Date.now(),
      duration: 250,
      responseBody: { error: 'Internal Server Error' },
    });
    store.addNetworkRequest({
      id: 'net_2',
      url: 'https://api.example.com/pending',
      method: 'POST',
      status: 200,
      startTime: Date.now(),
      responseBody: 'Text response',
    });

    const text = generateBugReportText(store);
    expect(text).toContain('MOBILE DEVTOOLS BUG REPORT');
    expect(text).toContain('CONSOLE SUMMARY');
    expect(text).toContain('Failed to fetch users');
    expect(text).toContain('Stack: Error: Failed');
    expect(text).toContain('NETWORK SUMMARY');
    expect(text).toContain('GET https://api.example.com/data -> Status: 500 (250ms)');
    expect(text).toContain('POST https://api.example.com/pending -> Status: 200 (pending)');
    expect(text).toContain('Response: Text response');
  });

  it('should handle empty logs and empty network requests', () => {
    const text = generateBugReportText(store);
    expect(text).toContain('(No console logs captured)');
    expect(text).toContain('(No network requests captured)');
  });

  it('should trigger Web Share API when navigator.share is available', async () => {
    const shareMock = vi.fn().mockResolvedValue(undefined);
    (globalThis as any).navigator = {
      ...originalNavigator,
      share: shareMock,
    };

    const result = await exportBugReport(store);
    expect(shareMock).toHaveBeenCalled();
    expect(result).toEqual({ shared: true, downloaded: false, copied: false });
  });

  it('should handle Web Share user cancellation (AbortError) cleanly', async () => {
    const abortError = new Error('User cancelled');
    abortError.name = 'AbortError';
    const shareMock = vi.fn().mockRejectedValue(abortError);
    (globalThis as any).navigator = {
      ...originalNavigator,
      share: shareMock,
    };

    const result = await exportBugReport(store);
    expect(result).toEqual({ shared: false, downloaded: false, copied: false });
  });

  it('should fallback to download and copy when Web Share throws standard error', async () => {
    const shareMock = vi.fn().mockRejectedValue(new Error('Share error'));
    (globalThis as any).navigator = {
      ...originalNavigator,
      share: shareMock,
    };

    if (!URL.createObjectURL) {
      URL.createObjectURL = () => 'blob:mock-url';
    }
    if (!URL.revokeObjectURL) {
      URL.revokeObjectURL = () => {};
    }

    const createObjectURLSpy = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:mock-url');
    const revokeObjectURLSpy = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});

    const result = await exportBugReport(store);
    expect(result.shared).toBe(false);
    expect(result.downloaded).toBe(true);

    createObjectURLSpy.mockRestore();
    revokeObjectURLSpy.mockRestore();
  });

});

