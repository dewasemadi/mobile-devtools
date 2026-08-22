import { describe, it, expect, beforeEach, vi } from 'vitest';
import { StorageManager } from '../storage-manager';

if (typeof globalThis.indexedDB === 'undefined') {
  (globalThis as any).indexedDB = {
    open: vi.fn(),
    databases: vi.fn(),
  };
}

describe('StorageManager', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });


  it('should manipulate localStorage entries and filter internal keys', () => {
    StorageManager.setStorageItem('localStorage', 'theme', 'dark');
    StorageManager.setStorageItem('localStorage', '__mobile_devtools_key', 'hidden');
    expect(localStorage.getItem('theme')).toBe('dark');

    const items = StorageManager.getLocalStorageItems();
    expect(items).toContainEqual({ key: 'theme', value: 'dark', type: 'localStorage' });
    expect(items.some((i) => i.key === '__mobile_devtools_key')).toBe(false);

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

  it('should manipulate cookie entries and clear cookies', () => {
    StorageManager.setStorageItem('cookie', 'test_cookie', 'cookie_val');
    StorageManager.setStorageItem('cookie', 'another_cookie', 'val2');
    const items = StorageManager.getCookies();
    const cookieItem = items.find((i) => i.key === 'test_cookie');
    expect(cookieItem).toBeDefined();
    expect(cookieItem?.value).toBe('cookie_val');

    StorageManager.removeStorageItem('cookie', 'test_cookie');
    let remainingItems = StorageManager.getCookies();
    expect(remainingItems.find((i) => i.key === 'test_cookie')).toBeUndefined();

    StorageManager.clearAllStorage('cookie');
    remainingItems = StorageManager.getCookies();
    expect(remainingItems.find((i) => i.key === 'another_cookie')).toBeUndefined();
  });

  it('should clear localStorage via clearAllStorage', () => {
    StorageManager.setStorageItem('localStorage', 'k1', 'v1');
    StorageManager.clearAllStorage('localStorage');
    expect(StorageManager.getLocalStorageItems().length).toBe(0);
  });

  it('should handle storage errors gracefully', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceeded');
    });

    StorageManager.setStorageItem('localStorage', 'fail', 'val');
    expect(consoleSpy).toHaveBeenCalled();

    spy.mockImplementation(() => {
      throw new Error('StorageBlocked');
    });
    StorageManager.removeStorageItem('localStorage', 'fail');
    StorageManager.clearAllStorage('localStorage');

    spy.mockRestore();
    consoleSpy.mockRestore();
  });

  it('should handle getIndexedDBs when indexedDB.databases is supported', async () => {
    const originalDatabases = indexedDB.databases;
    const originalOpen = indexedDB.open;

    indexedDB.databases = vi.fn().mockResolvedValue([
      { name: 'AppDB1', version: 1 },
      { name: 'AppDB2', version: 2 },
      null, // test null db check
    ]);

    const mockDB: any = {
      objectStoreNames: ['store1'],
      close: vi.fn(),
    };

    indexedDB.open = vi.fn().mockImplementation(() => {
      const req: any = {};
      setTimeout(() => {
        req.result = mockDB;
        req.onsuccess?.({ target: { result: mockDB } });
      }, 10);
      return req;
    });

    try {
      const dbs = await StorageManager.getIndexedDBs();
      expect(dbs.length).toBe(2);
      expect(dbs[0].name).toBe('AppDB1');
      expect(dbs[0].storeNames).toEqual(['store1']);
    } finally {
      indexedDB.databases = originalDatabases;
      indexedDB.open = originalOpen;
    }
  });

  it('should create, read, delete, and clear records from IndexedDB using mocked IDBFactory', async () => {
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

  it('should handle non-existent store and onerror events in IndexedDB operations', async () => {
    const mockDB: any = {
      objectStoreNames: {
        contains: () => false,
      },
      close: vi.fn(),
    };

    const originalOpen = indexedDB.open;

    // Test open success but store not contained
    indexedDB.open = vi.fn().mockImplementation(() => {
      const req: any = {};
      setTimeout(() => {
        req.result = mockDB;
        req.onsuccess?.({ target: { result: mockDB } });
      }, 0);
      return req;
    });

    try {
      const records = await StorageManager.getIndexedDBRecords('TestDB', 'missingStore');
      expect(records).toEqual([]);

      const delResult = await StorageManager.deleteIndexedDBRecord('TestDB', 'missingStore', 'key');
      expect(delResult).toBe(false);

      const clearResult = await StorageManager.clearIndexedDBStore('TestDB', 'missingStore');
      expect(clearResult).toBe(false);
    } finally {
      indexedDB.open = originalOpen;
    }
  });

  it('should handle req.onerror in IndexedDB operations', async () => {
    const originalOpen = indexedDB.open;

    indexedDB.open = vi.fn().mockImplementation(() => {
      const req: any = {};
      setTimeout(() => {
        req.onerror?.(new Event('error'));
      }, 0);
      return req;
    });

    try {
      const stores = await StorageManager.getIndexedDBStoreNames('ErrDB');
      expect(stores).toEqual([]);

      const records = await StorageManager.getIndexedDBRecords('ErrDB', 'store1');
      expect(records).toEqual([]);

      const delRes = await StorageManager.deleteIndexedDBRecord('ErrDB', 'store1', 'key1');
      expect(delRes).toBe(false);

      const clearRes = await StorageManager.clearIndexedDBStore('ErrDB', 'store1');
      expect(clearRes).toBe(false);
    } finally {
      indexedDB.open = originalOpen;
    }
  });

  it('should handle cursor error in getIndexedDBRecords', async () => {
    const mockDB: any = {
      objectStoreNames: { contains: () => true },
      transaction: () => ({
        objectStore: () => ({
          openCursor: () => {
            const req: any = {};
            setTimeout(() => req.onerror?.(new Event('error')), 0);
            return req;
          },
        }),
      }),
      close: vi.fn(),
    };

    const originalOpen = indexedDB.open;
    indexedDB.open = vi.fn().mockImplementation(() => {
      const req: any = {};
      setTimeout(() => {
        req.result = mockDB;
        req.onsuccess?.({ target: { result: mockDB } });
      }, 0);
      return req;
    });

    try {
      const records = await StorageManager.getIndexedDBRecords('TestDB', 'store1');
      expect(records).toEqual([]);
    } finally {
      indexedDB.open = originalOpen;
    }
  });

  it('should handle delete and clear request errors', async () => {
    const mockDB: any = {
      objectStoreNames: { contains: () => true },
      transaction: () => ({
        objectStore: () => ({
          delete: () => {
            const req: any = {};
            setTimeout(() => req.onerror?.(new Event('error')), 0);
            return req;
          },
          clear: () => {
            const req: any = {};
            setTimeout(() => req.onerror?.(new Event('error')), 0);
            return req;
          },
        }),
      }),
      close: vi.fn(),
    };

    const originalOpen = indexedDB.open;
    indexedDB.open = vi.fn().mockImplementation(() => {
      const req: any = {};
      setTimeout(() => {
        req.result = mockDB;
        req.onsuccess?.({ target: { result: mockDB } });
      }, 0);
      return req;
    });

    try {
      const delRes = await StorageManager.deleteIndexedDBRecord('TestDB', 'store1', 'k1');
      expect(delRes).toBe(false);

      const clearRes = await StorageManager.clearIndexedDBStore('TestDB', 'store1');
      expect(clearRes).toBe(false);
    } finally {
      indexedDB.open = originalOpen;
    }
  });
});

