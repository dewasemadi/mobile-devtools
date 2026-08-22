import { beforeEach, describe, expect, it } from 'vitest';
import { DevToolsStore } from '../../../../core/stores/devtools-store';
import { NetworkTabView } from '../network-tab';

describe('NetworkTabView Sorting', () => {
  let store: DevToolsStore;
  let tabView: NetworkTabView;

  beforeEach(() => {
    store = new DevToolsStore();
    tabView = new NetworkTabView(store);
  });

  it('should render network requests without error when sorting options change', () => {
    store.addNetworkRequest({
      id: 'req-1',
      url: 'https://api.example.com/b_fast',
      method: 'GET',
      status: 200,
      statusText: 'OK',
      type: 'fetch',
      startTime: 1000,
      endTime: 1050, // 50ms
    });

    store.addNetworkRequest({
      id: 'req-2',
      url: 'https://api.example.com/a_slow',
      method: 'POST',
      status: 500,
      statusText: 'Internal Error',
      type: 'fetch',
      startTime: 2000,
      endTime: 2800, // 800ms
    });

    store.addNetworkRequest({
      id: 'req-3',
      url: 'https://api.example.com/c_redirect',
      method: 'GET',
      status: 302,
      statusText: 'Found',
      type: 'fetch',
      startTime: 3000,
      endTime: 3100,
    });

    store.addNetworkRequest({
      id: 'req-4',
      url: 'https://api.example.com/d_notfound',
      method: 'GET',
      status: 404,
      statusText: 'Not Found',
      type: 'fetch',
      startTime: 4000,
      endTime: 4050,
    });

    store.addNetworkRequest({
      id: 'req-5',
      url: 'https://api.example.com/e_failed',
      method: 'GET',
      status: 0,
      statusText: 'Failed',
      type: 'fetch',
      startTime: 5000,
      endTime: 5010,
    });

    store.addNetworkRequest({
      id: 'req-6',
      url: 'https://api.example.com/f_info',
      method: 'GET',
      status: 101,
      statusText: 'Switching Protocols',
      type: 'fetch',
      startTime: 6000,
      endTime: 6010,
    });

    const element = tabView.render();
    expect(element).toBeTruthy();

    const selectEls = element.querySelectorAll('select');
    expect(selectEls.length).toBeGreaterThanOrEqual(2);

    const sortSelect = selectEls[1] as HTMLSelectElement;

    // Test 5xx status filter
    sortSelect.value = 'status-5xx';
    sortSelect.dispatchEvent(new Event('change'));
    let text = element.textContent || '';
    expect(text).toContain('a_slow');
    expect(text).not.toContain('b_fast');
    expect(text).not.toContain('c_redirect');

    // Test 2xx status filter
    sortSelect.value = 'status-2xx';
    sortSelect.dispatchEvent(new Event('change'));
    text = element.textContent || '';
    expect(text).toContain('b_fast');
    expect(text).not.toContain('a_slow');

    // Test 3xx status filter
    sortSelect.value = 'status-3xx';
    sortSelect.dispatchEvent(new Event('change'));
    text = element.textContent || '';
    expect(text).toContain('c_redirect');
    expect(text).not.toContain('b_fast');

    // Test 4xx status filter
    sortSelect.value = 'status-4xx';
    sortSelect.dispatchEvent(new Event('change'));
    text = element.textContent || '';
    expect(text).toContain('d_notfound');
    expect(text).not.toContain('c_redirect');

    // Test 1xx status filter
    sortSelect.value = 'status-1xx';
    sortSelect.dispatchEvent(new Event('change'));
    text = element.textContent || '';
    expect(text).toContain('f_info');
    expect(text).not.toContain('b_fast');

    // Test Network Error filter (status 0)
    sortSelect.value = 'status-err';
    sortSelect.dispatchEvent(new Event('change'));
    text = element.textContent || '';
    expect(text).toContain('e_failed');
    expect(text).not.toContain('b_fast');

    // Test Oldest time sort
    sortSelect.value = 'time-asc';
    sortSelect.dispatchEvent(new Event('change'));
    text = element.textContent || '';
    expect(text).toContain('b_fast');

    // Test Slowest duration sort
    sortSelect.value = 'duration-desc';
    sortSelect.dispatchEvent(new Event('change'));
    text = element.textContent || '';
    expect(text).toContain('a_slow');

    // Test Fastest duration sort
    sortSelect.value = 'duration-asc';
    sortSelect.dispatchEvent(new Event('change'));
    text = element.textContent || '';
    expect(text).toContain('e_failed');
  });
});

