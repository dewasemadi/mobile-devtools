import { describe, it, expect, beforeEach } from 'vitest';
import { DevToolsStore } from '../../../../core';
import { NetworkTabView } from '../network-tab';

describe('NetworkTabView', () => {
  let store: DevToolsStore;
  let tabView: NetworkTabView;

  beforeEach(() => {
    store = new DevToolsStore();
    store.addNetworkRequest({
      id: 'req_1',
      url: 'https://api.example.com/users',
      method: 'GET',
      status: 200,
      startTime: Date.now(),
      duration: 150,
      responseBody: { users: [] },
    });

    tabView = new NetworkTabView(store);
  });

  it('should render network requests list and detail view', () => {
    const el = tabView.render();
    expect(el).toBeDefined();

    const text = el.textContent || '';
    expect(text).toContain('GET');
    expect(text).toContain('https://api.example.com/users');
    expect(text).toContain('200');
  });

  it('should hide the Frames tab for HTTP request detail view', () => {
    (tabView as any).selectedReq = store.getNetworkRequests()[0];
    const el = tabView.render();
    expect(el.textContent).not.toContain('Frames');
  });

  it('should show the Frames tab for WS / SSE request detail view', () => {
    store.addNetworkRequest({
      id: 'req_2',
      url: 'ws://api.example.com/stream',
      method: 'WS',
      type: 'websocket',
      status: 101,
      startTime: Date.now(),
      frames: [{ id: 'f1', type: 'received', data: 'hello', timestamp: Date.now() }],
    });
    (tabView as any).selectedReq = store.getNetworkRequests().find((r) => r.id === 'req_2');
    const el = tabView.render();
    expect(el.textContent).toContain('Frames (1)');
  });
});
