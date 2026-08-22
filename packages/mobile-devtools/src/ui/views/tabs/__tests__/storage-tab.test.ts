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
    vi.spyOn(StorageManager, 'getIndexedDBRecords').mockResolvedValue([
      { key: 'user_1', value: { name: 'Bob', role: 'admin' } },
      { key: 'user_2', value: '{"jsonKey":"jsonVal"}' },
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

  it('should handle adding a new key-value pair and saving/canceling', () => {
    const el = tabView.render();
    const addBtn = el.querySelector('button[title*="Add new"]') as HTMLButtonElement;
    expect(addBtn).not.toBeNull();

    // Toggle panel on
    addBtn.click();

    const inputs = Array.from(el.querySelectorAll('input.devtools-search-input')) as HTMLInputElement[];
    const keyInput = inputs.find((i) => i.placeholder === 'Key...');
    const valInput = inputs.find((i) => i.placeholder === 'Value...');
    const saveBtn = el.querySelector('button[title="Save"]') as HTMLButtonElement;

    if (keyInput && valInput && saveBtn) {
      keyInput.value = 'new_key';
      valInput.value = 'new_value';
      saveBtn.click();
    }

    expect(localStorage.getItem('new_key')).toBe('new_value');

    // Toggle on and cancel
    addBtn.click();
    const cancelBtn = el.querySelector('button[title="Cancel"]') as HTMLButtonElement;
    cancelBtn?.click();
  });

  it('should handle inline value editing (Enter, Escape, Blur)', () => {
    const el = tabView.render();
    const rows = Array.from(el.querySelectorAll('tbody tr'));
    expect(rows.length).toBeGreaterThan(0);

    const valTd = rows[0].querySelectorAll('td')[1] as HTMLTableCellElement;
    valTd.click(); // Enter editing mode

    const editInput = el.querySelector('tbody input') as HTMLInputElement;
    expect(editInput).not.toBeNull();

    editInput.value = 'edited_val';
    editInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

    expect(localStorage.getItem('app_token') === 'edited_val' || localStorage.getItem('user_theme') === 'edited_val').toBe(true);

    // Test Escape cancels without saving and stops propagation
    const newRows = Array.from(el.querySelectorAll('tbody tr'));
    const newValTd = newRows[0].querySelectorAll('td')[1] as HTMLTableCellElement;
    const originalVal = newValTd.textContent;
    newValTd.click();

    const escapeInput = el.querySelector('tbody input') as HTMLInputElement;
    escapeInput.value = 'should_not_be_saved';
    const escEvent = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true });
    const stopSpy = vi.spyOn(escEvent, 'stopPropagation');
    escapeInput.dispatchEvent(escEvent);

    expect(stopSpy).toHaveBeenCalled();
    expect(el.querySelector('tbody input')).toBeNull();
  });

  it('should handle delete item button with confirm', () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
    const el = tabView.render();
    const delBtn = el.querySelector('tbody button') as HTMLButtonElement;

    expect(delBtn).not.toBeNull();
    delBtn.click();

    expect(confirmSpy).toHaveBeenCalled();
    confirmSpy.mockRestore();
  });

  it('should handle clear all storage button with confirm', async () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
    const el = tabView.render();
    const clearBtn = el.querySelector('button[title="Clear Storage"]') as HTMLButtonElement;

    expect(clearBtn).not.toBeNull();
    clearBtn.click();

    expect(localStorage.length).toBe(0);
    confirmSpy.mockRestore();
  });

  it('should render IndexedDB records and allow deleting/clearing in IndexedDB mode', async () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
    vi.spyOn(StorageManager, 'deleteIndexedDBRecord').mockResolvedValue(true);
    vi.spyOn(StorageManager, 'clearIndexedDBStore').mockResolvedValue(true);

    const el = tabView.render();
    const select = el.querySelector('select.devtools-select') as HTMLSelectElement;
    select.value = 'indexedDB';
    select.dispatchEvent(new Event('change'));

    await new Promise((r) => setTimeout(r, 20));

    expect(el.textContent).toContain('Primary Key');
    expect(el.textContent).toContain('user_1');

    // Test delete IDB record
    const delBtn = el.querySelector('tbody button') as HTMLButtonElement;
    delBtn?.click();
    expect(confirmSpy).toHaveBeenCalled();

    // Test clear IDB store
    const clearBtn = el.querySelector('button[title="Clear Storage"]') as HTMLButtonElement;
    clearBtn?.click();

    confirmSpy.mockRestore();
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

