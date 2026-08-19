import { describe, it, expect, beforeEach } from 'vitest';
import { StorageManager } from '../storage-manager';

describe('StorageManager', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it('should manipulate localStorage entries', () => {
    StorageManager.setStorageItem('localStorage', 'theme', 'dark');
    expect(localStorage.getItem('theme')).toBe('dark');

    const items = StorageManager.getLocalStorageItems();
    expect(items).toContainEqual({ key: 'theme', value: 'dark', type: 'localStorage' });

    StorageManager.removeStorageItem('localStorage', 'theme');
    expect(localStorage.getItem('theme')).toBeNull();
  });

  it('should manipulate sessionStorage entries', () => {
    StorageManager.setStorageItem('sessionStorage', 'token', 'abc123');
    expect(sessionStorage.getItem('token')).toBe('abc123');

    const items = StorageManager.getSessionStorageItems();
    expect(items).toContainEqual({ key: 'token', value: 'abc123', type: 'sessionStorage' });

    StorageManager.clearAllStorage('sessionStorage');
    expect(sessionStorage.getItem('token')).toBeNull();
  });

  it('should manipulate cookie entries', () => {
    StorageManager.setStorageItem('cookie', 'test_cookie', 'cookie_val');
    const items = StorageManager.getCookies();
    const cookieItem = items.find((i) => i.key === 'test_cookie');
    expect(cookieItem).toBeDefined();
    expect(cookieItem?.value).toBe('cookie_val');

    StorageManager.removeStorageItem('cookie', 'test_cookie');
    const remainingItems = StorageManager.getCookies();
    expect(remainingItems.find((i) => i.key === 'test_cookie')).toBeUndefined();
  });

  it('should safely handle getIndexedDBs in environments without IndexedDB', async () => {
    const dbs = await StorageManager.getIndexedDBs();
    expect(Array.isArray(dbs)).toBe(true);
  });

  it('should create, read, and delete records from IndexedDB using mocked IDBFactory', async () => {
    if (typeof indexedDB === 'undefined') return;

    const mockDB: any = {
      name: 'TestAppDB',
      version: 1,
      objectStoreNames: {
        contains: (name: string) => name === 'users',
        [Symbol.iterator]: function* () {
          yield 'users';
        },
      },
      transaction: () => ({
        objectStore: () => ({
          openCursor: () => {
            let called = false;
            const req: any = {};
            setTimeout(() => {
              if (!called && req.onsuccess) {
                called = true;
                req.onsuccess({
                  target: {
                    result: {
                      key: 'u1',
                      value: { id: 'u1', name: 'Alice' },
                      continue: () => {
                        req.onsuccess({ target: { result: null } });
                      },
                    },
                  },
                });
              }
            }, 0);
            return req;
          },
          delete: () => {
            const req: any = {};
            setTimeout(() => req.onsuccess && req.onsuccess(), 0);
            return req;
          },
          clear: () => {
            const req: any = {};
            setTimeout(() => req.onsuccess && req.onsuccess(), 0);
            return req;
          },
        }),
      }),
      close: () => {},
    };

    const originalOpen = indexedDB.open;
    indexedDB.open = () => {
      const req: any = {};
      setTimeout(() => {
        req.result = mockDB;
        if (req.onsuccess) req.onsuccess({ target: { result: mockDB } });
      }, 0);
      return req;
    };

    try {
      const stores = await StorageManager.getIndexedDBStoreNames('TestAppDB');
      expect(stores).toContain('users');

      const records = await StorageManager.getIndexedDBRecords('TestAppDB', 'users');
      expect(records.length).toBe(1);
      expect(records[0].key).toBe('u1');
      expect(records[0].value.name).toBe('Alice');

      const delOk = await StorageManager.deleteIndexedDBRecord('TestAppDB', 'users', 'u1');
      expect(delOk).toBe(true);

      const clearOk = await StorageManager.clearIndexedDBStore('TestAppDB', 'users');
      expect(clearOk).toBe(true);
    } finally {
      indexedDB.open = originalOpen;
    }
  });
});
