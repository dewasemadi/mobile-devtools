import { describe, it, expect, beforeEach, vi } from 'vitest';
import { DevToolsStore } from '../../../../core';
import { NetworkTabView } from '../network-tab';

describe('NetworkTabView', () => {
  let store: DevToolsStore;
  let tabView: NetworkTabView;

  beforeEach(() => {
    store = new DevToolsStore();
    store.addNetworkRequest({
      id: 'req_1',
      url: 'https://api.example.com/users?page=1',
      method: 'GET',
      type: 'fetch',
      status: 200,
      startTime: Date.now(),
      duration: 150,
      requestHeaders: { Authorization: 'Bearer token123' },
      requestBody: { query: 'test' },
      responseBody: { users: [{ id: 1, name: 'Alice' }] },
    });
    store.addNetworkRequest({
      id: 'req_2',
      url: 'ws://api.example.com/stream',
      method: 'WS',
      type: 'websocket',
      status: 101,
      startTime: Date.now(),
      frames: [{ id: 'f1', type: 'received', data: 'hello', timestamp: Date.now() }],
    });

    tabView = new NetworkTabView(store);
  });

  it('should render network requests list and toolbar elements', () => {
    const el = tabView.render();
    expect(el).toBeDefined();

    const text = el.textContent || '';
    expect(text).toContain('GET');
    expect(text).toContain('users?page=1');
    expect(text).toContain('200');
  });

  it('should filter requests by method (WS) and search value', () => {
    const el = tabView.render();
    const selects = Array.from(el.querySelectorAll('select.devtools-select')) as HTMLSelectElement[];
    const methodSelect = selects[0];

    expect(methodSelect).toBeDefined();
    methodSelect.value = 'WS';
    methodSelect.dispatchEvent(new Event('change'));

    expect(el.textContent).toContain('ws://api.example.com/stream');
    expect(el.textContent).not.toContain('https://api.example.com/users');

    // Filter search
    const searchInput = el.querySelector('input.devtools-search-input') as HTMLInputElement;
    if (searchInput) {
      searchInput.value = 'nonexistent';
      searchInput.dispatchEvent(new Event('input'));
    }
    expect(el.textContent).toContain('No network requests');
  });

  it('should clear network requests list when clear button is clicked', () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
    const el = tabView.render();
    const clearBtn = el.querySelector('button[title="Clear Network Requests"]') as HTMLButtonElement;
    expect(clearBtn).not.toBeNull();

    clearBtn.click();
    expect(store.getNetworkRequests().length).toBe(0);
    confirmSpy.mockRestore();
  });

  it('should open request detail panel when request row is clicked and allow closing it', () => {
    const el = tabView.render();
    const rows = Array.from(el.querySelectorAll('.devtools-network-row')) as HTMLElement[];
    const req1Row = rows.find((r) => r.textContent?.includes('users')) || rows[0];

    expect(req1Row).not.toBeNull();
    req1Row.click();

    expect(el.textContent).toContain('Headers');
    expect(el.textContent).toContain('Response');

    // Test detail sub-tabs (Payload, Response)
    const subTabs = Array.from(el.querySelectorAll('button'));
    const payloadBtn = subTabs.find((b) => b.textContent === 'Payload');
    const responseBtn = subTabs.find((b) => b.textContent === 'Response');

    payloadBtn?.click();
    expect(el.textContent).toContain('query');

    responseBtn?.click();
    expect(el.textContent).toContain('Alice');

    // Back button
    const backBtn = el.querySelector('button[title*="Back"]') as HTMLButtonElement;
    backBtn?.click();
    expect(el.textContent).not.toContain('Headers');
  });


  it('should support Copy cURL and Copy Response in detail view', async () => {
    const el = tabView.render();
    const requestRow = el.querySelector('.devtools-network-row') as HTMLElement;
    requestRow.click();

    const copyCurlBtn = Array.from(el.querySelectorAll('button')).find((b) => b.textContent === 'cURL') as HTMLButtonElement;
    const copySummaryBtn = Array.from(el.querySelectorAll('button')).find((b) => b.textContent === 'Summary') as HTMLButtonElement;

    expect(copyCurlBtn).toBeDefined();
    expect(copySummaryBtn).toBeDefined();

    copyCurlBtn?.click();
    copySummaryBtn?.click();
  });

  it('should show the Frames tab for WS / SSE request detail view', () => {
    (tabView as any).selectedReq = store.getNetworkRequests().find((r) => r.id === 'req_2');
    const el = tabView.render();
    expect(el.textContent).toContain('Frames (1)');
  });
});


