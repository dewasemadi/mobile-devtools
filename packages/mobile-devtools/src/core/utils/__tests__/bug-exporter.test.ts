import { describe, it, expect, beforeEach } from 'vitest';
import { DevToolsStore } from '../../stores/devtools-store';
import { exportBugReport, generateBugReportText } from '../bug-exporter';

describe('bug-exporter', () => {
  let store: DevToolsStore;

  beforeEach(() => {
    store = new DevToolsStore();
    store.addLog({
      id: '1',
      level: 'error',
      args: ['Failed to fetch users'],
      timestamp: Date.now(),
      count: 1,
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
  });

  it('should generate formatted bug report text', () => {
    const text = generateBugReportText(store);
    expect(text).toContain('MOBILE DEVTOOLS BUG REPORT');
    expect(text).toContain('CONSOLE SUMMARY');
    expect(text).toContain('Failed to fetch users');
    expect(text).toContain('NETWORK SUMMARY');
    expect(text).toContain('GET https://api.example.com/data -> Status: 500');
  });

  it('should export bug report gracefully', async () => {
    const result = await exportBugReport(store);
    expect(result).toBeDefined();
    expect(typeof result.copied).toBe('boolean');
  });
});
