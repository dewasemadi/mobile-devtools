import { STORAGE_TYPES } from '../constants';
import {
  CookieItem,
  IndexedDBInfo,
  IndexedDBRecord,
  StorageItem,
  StorageType,
} from '../types/storage';
import { isServer } from '../utils/env';
import { parseCookies } from '../utils/formatters';

export class StorageManager {
  public static getLocalStorageItems(): StorageItem[] {
    const items: StorageItem[] = [];
    if (isServer || !window.localStorage) return items;

    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && !key.startsWith('__mobile_devtools')) {
          items.push({
            key,
            value: localStorage.getItem(key) || '',
            type: STORAGE_TYPES.LOCAL_STORAGE,
          });
        }
      }
    } catch {
      // Storage read error
    }
    return items;
  }

  public static getSessionStorageItems(): StorageItem[] {
    const items: StorageItem[] = [];
    if (isServer || !window.sessionStorage) return items;

    try {
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key) {
          items.push({
            key,
            value: sessionStorage.getItem(key) || '',
            type: STORAGE_TYPES.SESSION_STORAGE,
          });
        }
      }
    } catch {
      // Storage read error
    }
    return items;
  }

  public static getCookies(): CookieItem[] {
    const parsed = parseCookies();
    return Object.entries(parsed).map(([key, value]) => ({
      key,
      value,
    }));
  }

  public static setStorageItem(type: StorageType, key: string, value: string) {
    if (isServer) return;

    try {
      if (type === STORAGE_TYPES.LOCAL_STORAGE) {
        localStorage.setItem(key, value);
      } else if (type === STORAGE_TYPES.SESSION_STORAGE) {
        sessionStorage.setItem(key, value);
      } else if (type === STORAGE_TYPES.COOKIE) {
        document.cookie = `${encodeURIComponent(key)}=${encodeURIComponent(value)}; path=/`;
      }
    } catch (e) {
      console.error('[DevTools] Failed to set storage item:', e);
    }
  }

  public static removeStorageItem(type: StorageType, key: string) {
    if (isServer) return;

    try {
      if (type === STORAGE_TYPES.LOCAL_STORAGE) {
        localStorage.removeItem(key);
      } else if (type === STORAGE_TYPES.SESSION_STORAGE) {
        sessionStorage.removeItem(key);
      } else if (type === STORAGE_TYPES.COOKIE) {
        document.cookie = `${encodeURIComponent(key)}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
      }
    } catch (e) {
      console.error('[DevTools] Failed to remove storage item:', e);
    }
  }

  public static clearAllStorage(type: StorageType) {
    if (isServer) return;

    try {
      if (type === STORAGE_TYPES.LOCAL_STORAGE) {
        localStorage.clear();
      } else if (type === STORAGE_TYPES.SESSION_STORAGE) {
        sessionStorage.clear();
      } else if (type === STORAGE_TYPES.COOKIE) {
        const cookies = this.getCookies();
        cookies.forEach((c) => this.removeStorageItem(STORAGE_TYPES.COOKIE, c.key));
      }
    } catch (e) {
      console.error('[DevTools] Failed to clear storage:', e);
    }
  }

  // --- IndexedDB Management ---

  public static async getIndexedDBs(): Promise<IndexedDBInfo[]> {
    if (isServer || typeof window === 'undefined' || !window.indexedDB) return [];
    try {
      if (typeof indexedDB.databases === 'function') {
        const dbsPromise = indexedDB.databases();
        const dbs = await Promise.race([
          dbsPromise,
          new Promise<any[]>((resolve) => setTimeout(() => resolve([]), 200)),
        ]);
        const results: IndexedDBInfo[] = [];
        for (const db of dbs || []) {
          if (!db || !db.name) continue;
          const storeNames = await this.getIndexedDBStoreNames(db.name);
          results.push({
            name: db.name,
            version: db.version || 1,
            storeNames,
          });
        }
        return results;
      }
    } catch {
      // Fallback
    }
    return [];
  }

  public static getIndexedDBStoreNames(dbName: string): Promise<string[]> {
    return new Promise((resolve) => {
      if (isServer || typeof window === 'undefined' || !window.indexedDB) return resolve([]);
      const timer = setTimeout(() => resolve([]), 200);
      try {
        const req = indexedDB.open(dbName);
        req.onsuccess = () => {
          clearTimeout(timer);
          const db = req.result;
          const stores = Array.from(db.objectStoreNames);
          db.close();
          resolve(stores);
        };
        req.onerror = () => {
          clearTimeout(timer);
          resolve([]);
        };
      } catch {
        clearTimeout(timer);
        resolve([]);
      }
    });
  }

  public static getIndexedDBRecords(dbName: string, storeName: string): Promise<IndexedDBRecord[]> {
    return new Promise((resolve) => {
      if (isServer || typeof window === 'undefined' || !window.indexedDB) return resolve([]);
      const timer = setTimeout(() => resolve([]), 200);
      try {
        const req = indexedDB.open(dbName);
        req.onsuccess = () => {
          const db = req.result;
          if (!db.objectStoreNames.contains(storeName)) {
            clearTimeout(timer);
            db.close();
            return resolve([]);
          }
          const tx = db.transaction(storeName, 'readonly');
          const store = tx.objectStore(storeName);
          const records: IndexedDBRecord[] = [];

          const cursorReq = store.openCursor();
          cursorReq.onsuccess = (e: any) => {
            const cursor: IDBCursorWithValue = e.target.result;
            if (cursor) {
              records.push({
                key: cursor.key,
                value: cursor.value,
              });
              cursor.continue();
            } else {
              clearTimeout(timer);
              db.close();
              resolve(records);
            }
          };
          cursorReq.onerror = () => {
            clearTimeout(timer);
            db.close();
            resolve([]);
          };
        };
        req.onerror = () => {
          clearTimeout(timer);
          resolve([]);
        };
      } catch {
        clearTimeout(timer);
        resolve([]);
      }
    });
  }

  public static deleteIndexedDBRecord(
    dbName: string,
    storeName: string,
    key: IDBValidKey
  ): Promise<boolean> {
    return new Promise((resolve) => {
      if (isServer || typeof window === 'undefined' || !window.indexedDB) return resolve(false);
      const timer = setTimeout(() => resolve(false), 200);
      try {
        const req = indexedDB.open(dbName);
        req.onsuccess = () => {
          const db = req.result;
          if (!db.objectStoreNames.contains(storeName)) {
            clearTimeout(timer);
            db.close();
            return resolve(false);
          }
          const tx = db.transaction(storeName, 'readwrite');
          const store = tx.objectStore(storeName);
          const delReq = store.delete(key);
          delReq.onsuccess = () => {
            clearTimeout(timer);
            db.close();
            resolve(true);
          };
          delReq.onerror = () => {
            clearTimeout(timer);
            db.close();
            resolve(false);
          };
        };
        req.onerror = () => {
          clearTimeout(timer);
          resolve(false);
        };
      } catch {
        clearTimeout(timer);
        resolve(false);
      }
    });
  }

  public static clearIndexedDBStore(dbName: string, storeName: string): Promise<boolean> {
    return new Promise((resolve) => {
      if (isServer || typeof window === 'undefined' || !window.indexedDB) return resolve(false);
      const timer = setTimeout(() => resolve(false), 200);
      try {
        const req = indexedDB.open(dbName);
        req.onsuccess = () => {
          const db = req.result;
          if (!db.objectStoreNames.contains(storeName)) {
            clearTimeout(timer);
            db.close();
            return resolve(false);
          }
          const tx = db.transaction(storeName, 'readwrite');
          const store = tx.objectStore(storeName);
          const clearReq = store.clear();
          clearReq.onsuccess = () => {
            clearTimeout(timer);
            db.close();
            resolve(true);
          };
          clearReq.onerror = () => {
            clearTimeout(timer);
            db.close();
            resolve(false);
          };
        };
        req.onerror = () => {
          clearTimeout(timer);
          resolve(false);
        };
      } catch {
        clearTimeout(timer);
        resolve(false);
      }
    });
  }
}
