import { describe, it, expect, beforeEach, vi } from 'vitest';
import { DevToolsStore } from '../devtools-store';

describe('DevToolsStore', () => {
  let store: DevToolsStore;

  beforeEach(() => {
    localStorage.clear();

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    store = new DevToolsStore();
  });

  it('should initialize with default config and state', () => {
    const config = store.getConfig();
    expect(config.enabled).toBe(true);
    expect(config.initialTab).toBe('console');

    expect(store.getIsOpen()).toBe(false);
    expect(store.getActiveTab()).toBe('console');
    expect(store.getLogs()).toEqual([]);
    expect(store.getNetworkRequests()).toEqual([]);
  });

  it('should allow toggling open/close state and reset unread counts when closed', () => {
    store.setIsOpen(true);
    expect(store.getIsOpen()).toBe(true);

    store.setIsOpen(false);
    expect(store.getIsOpen()).toBe(false);

    store.toggleOpen();
    expect(store.getIsOpen()).toBe(true);
  });

  it('should track unread error and warning counts when drawer is closed', () => {
    store.setIsOpen(false);

    store.addLog({ id: '1', level: 'error', args: ['Err 1'], timestamp: Date.now(), count: 1 });
    store.addLog({ id: '2', level: 'warn', args: ['Warn 1'], timestamp: Date.now(), count: 1 });
    store.addLog({ id: '3', level: 'log', args: ['Log 1'], timestamp: Date.now(), count: 1 });

    const counts = store.getUnreadCounts();
    expect(counts.errors).toBe(1);
    expect(counts.warnings).toBe(1);
    expect(counts.total).toBe(3);

    store.resetUnreadCounts();
    expect(store.getUnreadCounts().total).toBe(0);
  });

  it('should manage theme mode and toggling', () => {
    expect(store.getThemeMode()).toBe('dark');

    store.toggleThemeMode();
    expect(store.getThemeMode()).toBe('light');

    store.setThemeMode('auto');
    expect(store.getThemeMode()).toBe('auto');
    expect(store.getEffectiveThemeMode()).toBeDefined();
  });

  it('should preserve theme mode and position from localStorage even when updateConfig is called', () => {
    localStorage.setItem('__mobile_devtools_theme__', 'light');
    localStorage.setItem('__mobile_devtools_position__', JSON.stringify({ x: 50, y: 150 }));

    const savedStore = new DevToolsStore({ theme: { mode: 'dark' }, position: 'bottom-right' });
    expect(savedStore.getThemeMode()).toBe('light');
    expect(savedStore.getBadgePosition()).toEqual({ x: 50, y: 150 });

    savedStore.updateConfig({ theme: { mode: 'dark' }, position: 'bottom-right' });
    expect(savedStore.getThemeMode()).toBe('light');
    expect(savedStore.getBadgePosition()).toEqual({ x: 50, y: 150 });
  });

  it('should manage badge position and persistence', () => {
    const newPos = { x: 100, y: 200 };
    store.setBadgePosition(newPos);
    expect(store.getBadgePosition()).toEqual(newPos);

    const saved = localStorage.getItem('__mobile_devtools_position__');
    expect(saved).not.toBeNull();
    expect(saved).toContain('100');
  });

  it('should manage network throttling profiles', () => {
    expect(store.getNetworkThrottling()).toBe('online');

    store.setNetworkThrottling('slow-3g');
    expect(store.getNetworkThrottling()).toBe('slow-3g');
  });

  it('should retrieve privacy mask keys from config', () => {
    store.updateConfig({
      privacy: { mask: ['secret_token', 'password'] },
    });

    const maskKeys = store.getMaskKeys();
    expect(maskKeys).toEqual(['secret_token', 'password']);
  });

  it('should add log entries and respect maxLogLimit', () => {
    store.updateConfig({ interceptors: { maxLogLimit: 3 } });

    store.addLog({ id: '1', level: 'info', args: ['one'], timestamp: 1, count: 1 });
    store.addLog({ id: '2', level: 'warn', args: ['two'], timestamp: 2, count: 1 });
    store.addLog({ id: '3', level: 'error', args: ['three'], timestamp: 3, count: 1 });
    store.addLog({ id: '4', level: 'debug', args: ['four'], timestamp: 4, count: 1 });

    const logs = store.getLogs();
    expect(logs.length).toBe(3);
    expect(logs[0].id).toBe('2');
    expect(logs[2].id).toBe('4');
  });

  it('should collapse repeated log entries', () => {
    store.addLog({ id: '1', level: 'info', args: ['same message'], timestamp: 1, count: 1 });
    store.addLog({ id: '2', level: 'info', args: ['same message'], timestamp: 2, count: 1 });

    const logs = store.getLogs();
    expect(logs.length).toBe(1);
    expect(logs[0].count).toBe(2);
  });

  it('should clear logs and network requests', () => {
    store.addLog({ id: '1', level: 'info', args: ['hello'], timestamp: 1, count: 1 });
    store.clearLogs();
    expect(store.getLogs().length).toBe(0);

    store.addNetworkRequest({
      id: 'req_1',
      url: 'https://api.example.com',
      method: 'GET',
      status: 200,
      startTime: Date.now(),
    });
    expect(store.getNetworkRequests().length).toBe(1);

    store.clearNetworkRequests();
    expect(store.getNetworkRequests().length).toBe(0);
  });
});
