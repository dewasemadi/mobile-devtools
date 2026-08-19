import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DevToolsStore, StorageManager } from '../../../../core';
import { StorageTabView } from '../storage-tab';

describe('StorageTabView', () => {
  let store: DevToolsStore;
  let tabView: StorageTabView;

  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    localStorage.setItem('user_theme', 'dark');
    localStorage.setItem('app_token', 'xyz_999');
    sessionStorage.setItem('auth_token', 'token_123');

    store = new DevToolsStore();
    tabView = new StorageTabView(store);

    vi.spyOn(StorageManager, 'getIndexedDBs').mockResolvedValue([
      { name: 'AppCacheDB', version: 1, storeNames: ['users', 'settings'] },
    ]);
  });

  it('should render storage items in table', () => {
    const el = tabView.render();
    expect(el).toBeDefined();

    const text = el.textContent || '';
    expect(text).toContain('user_theme');
    expect(text).toContain('dark');
  });

  it('should filter storage items by search input', () => {
    const el = tabView.render();
    const searchInput = el.querySelector('input.devtools-search-input') as HTMLInputElement;

    expect(searchInput).not.toBeNull();
    searchInput.value = 'app_token';
    searchInput.dispatchEvent(new Event('input'));

    const text = el.textContent || '';
    expect(text).toContain('app_token');
    expect(text).not.toContain('user_theme');
  });

  it('should switch between localStorage, sessionStorage, cookie, and indexedDB options', async () => {
    const el = tabView.render();
    const select = el.querySelector('select.devtools-select') as HTMLSelectElement;

    expect(select).not.toBeNull();
    select.value = 'sessionStorage';
    select.dispatchEvent(new Event('change'));

    const text = el.textContent || '';
    expect(text).toContain('auth_token');
    expect(text).toContain('token_123');

    select.value = 'indexedDB';
    select.dispatchEvent(new Event('change'));
    await new Promise((r) => setTimeout(r, 10));
    expect(select.value).toBe('indexedDB');

    // Verify DB selectors appear for indexedDB
    let selects = el.querySelectorAll('select.devtools-select');
    expect(selects.length).toBeGreaterThan(1);

    // Switch back to localStorage
    select.value = 'localStorage';
    select.dispatchEvent(new Event('change'));
    await new Promise((r) => setTimeout(r, 10));

    // Verify DB selectors are removed and only main storageSelect remains
    selects = el.querySelectorAll('select.devtools-select');
    expect(selects.length).toBe(1);
  });

  it('should handle empty indexedDB list cleanly without hanging or infinite loop', async () => {
    vi.spyOn(StorageManager, 'getIndexedDBs').mockResolvedValue([]);

    const el = tabView.render();
    const select = el.querySelector('select.devtools-select') as HTMLSelectElement;

    select.value = 'indexedDB';
    select.dispatchEvent(new Event('change'));
    await new Promise((r) => setTimeout(r, 20));

    const text = el.textContent || '';
    expect(text).toContain('No IndexedDB databases found');
  });
});
