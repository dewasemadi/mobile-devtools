import { StorageType } from '../constants';

export type { StorageType };

export interface StorageItem {
  key: string;
  value: string;
  type: StorageType;
}

export interface CookieItem {
  key: string;
  value: string;
  domain?: string;
  path?: string;
  expires?: string;
}

export interface IndexedDBInfo {
  name: string;
  version: number;
  storeNames: string[];
}

export interface IndexedDBRecord {
  key: any;
  value: any;
}
