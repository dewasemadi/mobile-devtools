import {
  DevToolsStore,
  IndexedDBInfo,
  IndexedDBRecord,
  isBrowser,
  STORAGE_TYPES,
  StorageManager,
  StorageType,
} from '../../../core';
import { CHECK_ICON, CLOSE_ICON, PLUS_ICON, TRASH_ICON } from '../../icons';
import { setupScrollLockGuard } from '../../utils/scroll-lock';
import { renderJsonTree } from '../../components/json-tree';

export class StorageTabView {
  private container: HTMLElement;
  private listScrollContainer: HTMLElement | null = null;
  private clearBtn: HTMLButtonElement | null = null;
  private storageType: StorageType = STORAGE_TYPES.LOCAL_STORAGE;
  private searchValue = '';
  private isAddingNew = false;
  private editingKey: string | null = null;

  // IndexedDB State
  private indexedDBs: IndexedDBInfo[] = [];
  private selectedDBName: string | null = null;
  private selectedStoreName: string | null = null;
  private idbRecords: IndexedDBRecord[] = [];
  private isLoadingIDB = false;

  constructor(_store?: DevToolsStore) {
    this.container = document.createElement('div');
    this.container.className = 'devtools-tab-content';
  }

  public render(): HTMLElement {
    this.container.innerHTML = '';

    // Toolbar (2-Row Layout: Row 1 = Search + Add + Clear, Row 2 = Storage / DB Selectors)
    const toolbar = document.createElement('div');
    toolbar.className = 'devtools-toolbar';
    toolbar.style.display = 'flex';
    toolbar.style.flexDirection = 'column';
    toolbar.style.gap = '6px';

    const row1 = document.createElement('div');
    row1.style.display = 'flex';
    row1.style.alignItems = 'center';
    row1.style.gap = '6px';
    row1.style.width = '100%';

    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.className = 'devtools-search-input';
    searchInput.placeholder = 'Search key or value...';
    searchInput.value = this.searchValue;
    searchInput.style.flex = '1';
    searchInput.style.minWidth = '0';
    searchInput.addEventListener('input', (e) => {
      this.searchValue = (e.target as HTMLInputElement).value;
      this.updateList();
    });

    const addBtn = document.createElement('button');
    addBtn.className = 'devtools-btn devtools-btn-icon-only';
    addBtn.title = 'Add new key-value pair';
    addBtn.innerHTML = PLUS_ICON;
    addBtn.addEventListener('click', () => {
      this.isAddingNew = !this.isAddingNew;
      this.updateList();
    });

    this.clearBtn = document.createElement('button');
    this.clearBtn.className = 'devtools-btn devtools-btn-danger devtools-btn-icon-only';
    this.clearBtn.title = 'Clear Storage';
    this.clearBtn.innerHTML = TRASH_ICON;
    this.clearBtn.addEventListener('click', async () => {
      if (
        window.confirm(
          `Are you sure you want to clear all entries in ${this.storageType}? This action cannot be undone.`
        )
      ) {
        await this.clearCurrentStorage();
        this.updateList();
      }
    });

    row1.appendChild(searchInput);
    if (this.storageType !== STORAGE_TYPES.INDEXED_DB) {
      row1.appendChild(addBtn);
    }
    row1.appendChild(this.clearBtn);

    const row2 = document.createElement('div');
    row2.style.display = 'flex';
    row2.style.alignItems = 'center';
    row2.style.gap = '6px';
    row2.style.width = '100%';
    row2.style.overflowX = 'auto';
    setupScrollLockGuard(row2);

    const storageSelect = document.createElement('select');
    storageSelect.className = 'devtools-select';
    storageSelect.style.flex = '1';
    storageSelect.style.minWidth = '120px';
    storageSelect.innerHTML = `
      <option value="${STORAGE_TYPES.LOCAL_STORAGE}">localStorage</option>
      <option value="${STORAGE_TYPES.SESSION_STORAGE}">sessionStorage</option>
      <option value="${STORAGE_TYPES.COOKIE}">cookie</option>
      <option value="${STORAGE_TYPES.INDEXED_DB}">indexedDB</option>
    `;
    storageSelect.value = this.storageType;
    storageSelect.addEventListener('change', async (e) => {
      this.storageType = (e.target as HTMLSelectElement).value as any;
      this.isAddingNew = false;
      this.editingKey = null;

      if (this.storageType === STORAGE_TYPES.INDEXED_DB) {
        await this.loadIndexedDBs();
      } else {
        this.render();
      }
    });

    row2.appendChild(storageSelect);

    // If IndexedDB selected, add DB & Store selectors to toolbar row2
    if (this.storageType === STORAGE_TYPES.INDEXED_DB) {
      const dbSelect = document.createElement('select');
      dbSelect.className = 'devtools-select';
      dbSelect.style.flex = '1';
      dbSelect.style.minWidth = '110px';
      if (this.indexedDBs.length === 0) {
        dbSelect.innerHTML = '<option value="">No DBs</option>';
      } else {
        dbSelect.innerHTML = this.indexedDBs
          .map((db) => `<option value="${db.name}">${db.name} (v${db.version})</option>`)
          .join('');
        dbSelect.value = this.selectedDBName || '';
      }
      dbSelect.addEventListener('change', async (e) => {
        this.selectedDBName = (e.target as HTMLSelectElement).value;
        const dbInfo = this.indexedDBs.find((d) => d.name === this.selectedDBName);
        this.selectedStoreName = dbInfo?.storeNames[0] || null;
        await this.loadIDBRecords();
        this.render();
      });

      const storeSelect = document.createElement('select');
      storeSelect.className = 'devtools-select';
      storeSelect.style.flex = '1';
      storeSelect.style.minWidth = '110px';
      const currentDB = this.indexedDBs.find((d) => d.name === this.selectedDBName);
      if (!currentDB || currentDB.storeNames.length === 0) {
        storeSelect.innerHTML = '<option value="">No Stores</option>';
      } else {
        storeSelect.innerHTML = currentDB.storeNames
          .map((st) => `<option value="${st}">${st}</option>`)
          .join('');
        storeSelect.value = this.selectedStoreName || '';
      }
      storeSelect.addEventListener('change', async (e) => {
        this.selectedStoreName = (e.target as HTMLSelectElement).value;
        await this.loadIDBRecords();
      });

      row2.appendChild(dbSelect);
      row2.appendChild(storeSelect);
    }

    toolbar.appendChild(row1);
    toolbar.appendChild(row2);

    // List Container
    this.listScrollContainer = document.createElement('div');
    this.listScrollContainer.className = 'devtools-list-scroll';
    setupScrollLockGuard(this.listScrollContainer);

    this.container.appendChild(toolbar);
    this.container.appendChild(this.listScrollContainer);

    this.updateList();

    return this.container;
  }

  private async loadIndexedDBs() {
    this.isLoadingIDB = true;
    this.updateList();

    try {
      this.indexedDBs = await StorageManager.getIndexedDBs();
      if (this.indexedDBs.length > 0) {
        if (!this.selectedDBName || !this.indexedDBs.some((d) => d.name === this.selectedDBName)) {
          this.selectedDBName = this.indexedDBs[0].name;
        }
        const currentDB = this.indexedDBs.find((d) => d.name === this.selectedDBName);
        if (currentDB && currentDB.storeNames.length > 0) {
          if (!this.selectedStoreName || !currentDB.storeNames.includes(this.selectedStoreName)) {
            this.selectedStoreName = currentDB.storeNames[0];
          }
        } else {
          this.selectedStoreName = null;
        }
      } else {
        this.selectedDBName = null;
        this.selectedStoreName = null;
      }
      await this.loadIDBRecords(false);
    } catch {
      this.indexedDBs = [];
      this.selectedDBName = null;
      this.selectedStoreName = null;
      this.idbRecords = [];
    } finally {
      this.isLoadingIDB = false;
      this.render();
    }
  }

  private async loadIDBRecords(triggerRender = true) {
    if (this.selectedDBName && this.selectedStoreName) {
      this.idbRecords = await StorageManager.getIndexedDBRecords(
        this.selectedDBName,
        this.selectedStoreName
      );
    } else {
      this.idbRecords = [];
    }
    this.isLoadingIDB = false;
    if (triggerRender) {
      this.updateList();
    }
  }

  private getItems(): { key: string; value: string }[] {
    if (!isBrowser) return [];
    const items: { key: string; value: string }[] = [];

    try {
      if (this.storageType === STORAGE_TYPES.LOCAL_STORAGE) {
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key) {
            items.push({ key, value: localStorage.getItem(key) || '' });
          }
        }
      } else if (this.storageType === STORAGE_TYPES.SESSION_STORAGE) {
        for (let i = 0; i < sessionStorage.length; i++) {
          const key = sessionStorage.key(i);
          if (key) {
            items.push({ key, value: sessionStorage.getItem(key) || '' });
          }
        }
      } else if (this.storageType === STORAGE_TYPES.COOKIE) {
        const cookies = document.cookie ? document.cookie.split('; ') : [];
        cookies.forEach((c) => {
          const [key, ...val] = c.split('=');
          if (key) {
            items.push({ key: decodeURIComponent(key), value: decodeURIComponent(val.join('=')) });
          }
        });
      }
    } catch {
      // Ignore security errors
    }

    return items;
  }

  private setItem(key: string, value: string) {
    if (!isBrowser || !key.trim()) return;
    try {
      if (this.storageType === STORAGE_TYPES.LOCAL_STORAGE) {
        localStorage.setItem(key.trim(), value);
      } else if (this.storageType === STORAGE_TYPES.SESSION_STORAGE) {
        sessionStorage.setItem(key.trim(), value);
      } else if (this.storageType === STORAGE_TYPES.COOKIE) {
        document.cookie = `${encodeURIComponent(key.trim())}=${encodeURIComponent(value)}; path=/;`;
      }
    } catch {
      // Ignore
    }
    this.updateList();
  }

  private async clearCurrentStorage() {
    if (!isBrowser) return;
    try {
      if (this.storageType === STORAGE_TYPES.LOCAL_STORAGE) {
        localStorage.clear();
      } else if (this.storageType === STORAGE_TYPES.SESSION_STORAGE) {
        sessionStorage.clear();
      } else if (this.storageType === STORAGE_TYPES.COOKIE) {
        const cookies = document.cookie ? document.cookie.split('; ') : [];
        cookies.forEach((c) => {
          const key = c.split('=')[0];
          if (key) {
            document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
          }
        });
      } else if (
        this.storageType === STORAGE_TYPES.INDEXED_DB &&
        this.selectedDBName &&
        this.selectedStoreName
      ) {
        await StorageManager.clearIndexedDBStore(this.selectedDBName, this.selectedStoreName);
        await this.loadIDBRecords();
      }
    } catch {
      // Ignore
    }
  }

  private async deleteItem(key: any) {
    if (!isBrowser) return;
    try {
      if (this.storageType === STORAGE_TYPES.LOCAL_STORAGE) {
        localStorage.removeItem(key);
      } else if (this.storageType === STORAGE_TYPES.SESSION_STORAGE) {
        sessionStorage.removeItem(key);
      } else if (this.storageType === STORAGE_TYPES.COOKIE) {
        document.cookie = `${encodeURIComponent(key)}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      } else if (
        this.storageType === STORAGE_TYPES.INDEXED_DB &&
        this.selectedDBName &&
        this.selectedStoreName
      ) {
        await StorageManager.deleteIndexedDBRecord(
          this.selectedDBName,
          this.selectedStoreName,
          key
        );
        await this.loadIDBRecords();
      }
    } catch {
      // Ignore
    }
    this.updateList();
  }

  public updateList() {
    if (!this.listScrollContainer) return;
    this.listScrollContainer.innerHTML = '';

    if (this.storageType === STORAGE_TYPES.INDEXED_DB) {
      this.renderIndexedDBList();
      return;
    }

    // Add New Item Panel for KV storage
    if (this.isAddingNew) {
      const addPanel = document.createElement('div');
      addPanel.style.display = 'flex';
      addPanel.style.gap = '6px';
      addPanel.style.marginBottom = '12px';

      const keyInput = document.createElement('input');
      keyInput.type = 'text';
      keyInput.placeholder = 'Key...';
      keyInput.className = 'devtools-search-input';
      keyInput.style.width = '30%';
      keyInput.style.flex = 'none';

      const valInput = document.createElement('input');
      valInput.type = 'text';
      valInput.placeholder = 'Value...';
      valInput.className = 'devtools-search-input';
      valInput.style.flex = '1';

      const saveBtn = document.createElement('button');
      saveBtn.className = 'devtools-btn devtools-btn-icon-only';
      saveBtn.title = 'Save';
      saveBtn.innerHTML = CHECK_ICON;
      saveBtn.addEventListener('click', () => {
        if (keyInput.value.trim()) {
          this.setItem(keyInput.value, valInput.value);
          this.isAddingNew = false;
          this.updateList();
        }
      });

      const cancelBtn = document.createElement('button');
      cancelBtn.className = 'devtools-btn devtools-btn-danger devtools-btn-icon-only';
      cancelBtn.title = 'Cancel';
      cancelBtn.innerHTML = CLOSE_ICON;
      cancelBtn.addEventListener('click', () => {
        this.isAddingNew = false;
        this.updateList();
      });

      addPanel.appendChild(keyInput);
      addPanel.appendChild(valInput);
      addPanel.appendChild(saveBtn);
      addPanel.appendChild(cancelBtn);
      this.listScrollContainer.appendChild(addPanel);
    }

    const items = this.getItems();
    if (this.clearBtn) {
      this.clearBtn.disabled = items.length === 0;
    }

    const filtered = items.filter(
      (item) =>
        !this.searchValue.trim() ||
        item.key.toLowerCase().includes(this.searchValue.toLowerCase()) ||
        item.value.toLowerCase().includes(this.searchValue.toLowerCase())
    );

    if (filtered.length === 0 && !this.isAddingNew) {
      const empty = document.createElement('div');
      empty.style.textAlign = 'center';
      empty.style.padding = '32px';
      empty.style.color = 'var(--dev-text-muted)';
      empty.style.fontSize = '12px';
      empty.textContent = `No items found in ${this.storageType}.`;
      this.listScrollContainer.appendChild(empty);
      return;
    }

    const table = document.createElement('table');
    table.className = 'devtools-table';

    const thead = document.createElement('thead');
    thead.innerHTML = `
      <tr>
        <th style="width:30%">Key</th>
        <th>Value (Click to edit)</th>
        <th style="width:40px;text-align:center">Action</th>
      </tr>
    `;

    const tbody = document.createElement('tbody');
    filtered.forEach((item) => {
      const tr = document.createElement('tr');

      const tdKey = document.createElement('td');
      tdKey.style.fontWeight = '600';
      tdKey.style.color = 'var(--dev-text-bright)';
      tdKey.textContent = item.key;

      const tdVal = document.createElement('td');
      tdVal.style.color = 'var(--dev-text-muted)';
      tdVal.style.wordBreak = 'break-all';
      tdVal.style.cursor = 'pointer';
      tdVal.title = 'Click to edit value';

      if (this.editingKey === item.key) {
        const editInput = document.createElement('input');
        editInput.type = 'text';
        editInput.className = 'devtools-search-input';
        editInput.style.width = '100%';
        editInput.value = item.value;
        editInput.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            this.setItem(item.key, editInput.value);
            this.editingKey = null;
            this.updateList();
          } else if (e.key === 'Escape') {
            this.editingKey = null;
            this.updateList();
          }
        });
        editInput.addEventListener('blur', () => {
          this.setItem(item.key, editInput.value);
          this.editingKey = null;
          this.updateList();
        });

        tdVal.appendChild(editInput);
        setTimeout(() => editInput.focus(), 0);
      } else {
        tdVal.textContent = item.value;
        tdVal.addEventListener('click', () => {
          this.editingKey = item.key;
          this.updateList();
        });
      }

      const tdAct = document.createElement('td');
      tdAct.style.textAlign = 'center';

      const delBtn = document.createElement('button');
      delBtn.className = 'devtools-btn devtools-btn-danger devtools-btn-icon-only';
      delBtn.title = 'Delete Item';
      delBtn.innerHTML = CLOSE_ICON;
      delBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (
          window.confirm(`Are you sure you want to delete "${item.key}" from ${this.storageType}?`)
        ) {
          this.deleteItem(item.key);
        }
      });

      tdAct.appendChild(delBtn);
      tr.appendChild(tdKey);
      tr.appendChild(tdVal);
      tr.appendChild(tdAct);
      tbody.appendChild(tr);
    });

    table.appendChild(thead);
    table.appendChild(tbody);
    this.listScrollContainer.appendChild(table);
  }

  private renderIndexedDBList() {
    if (!this.listScrollContainer) return;

    if (this.isLoadingIDB) {
      const loading = document.createElement('div');
      loading.style.textAlign = 'center';
      loading.style.padding = '32px';
      loading.style.color = 'var(--dev-text-muted)';
      loading.style.fontSize = '12px';
      loading.textContent = 'Loading IndexedDB databases...';
      this.listScrollContainer.appendChild(loading);
      return;
    }

    if (this.indexedDBs.length === 0) {
      const empty = document.createElement('div');
      empty.style.textAlign = 'center';
      empty.style.padding = '32px';
      empty.style.color = 'var(--dev-text-muted)';
      empty.style.fontSize = '12px';
      empty.textContent = 'No IndexedDB databases found in this origin.';
      this.listScrollContainer.appendChild(empty);
      return;
    }

    if (this.clearBtn) {
      this.clearBtn.disabled = this.idbRecords.length === 0;
    }

    const filtered = this.idbRecords.filter((rec) => {
      if (!this.searchValue.trim()) return true;
      const q = this.searchValue.toLowerCase();
      const kStr = typeof rec.key === 'object' ? JSON.stringify(rec.key) : String(rec.key);
      const vStr = typeof rec.value === 'object' ? JSON.stringify(rec.value) : String(rec.value);
      return kStr.toLowerCase().includes(q) || vStr.toLowerCase().includes(q);
    });

    if (filtered.length === 0) {
      const empty = document.createElement('div');
      empty.style.textAlign = 'center';
      empty.style.padding = '32px';
      empty.style.color = 'var(--dev-text-muted)';
      empty.style.fontSize = '12px';
      empty.textContent = `No records found in ${this.selectedDBName} / ${this.selectedStoreName}.`;
      this.listScrollContainer.appendChild(empty);
      return;
    }

    const table = document.createElement('table');
    table.className = 'devtools-table';

    const thead = document.createElement('thead');
    thead.innerHTML = `
      <tr>
        <th style="width:25%">Primary Key</th>
        <th>Value Payload</th>
        <th style="width:40px;text-align:center">Action</th>
      </tr>
    `;

    const tbody = document.createElement('tbody');
    filtered.forEach((rec) => {
      const tr = document.createElement('tr');

      const tdKey = document.createElement('td');
      tdKey.style.fontWeight = '600';
      tdKey.style.color = 'var(--dev-text-bright)';
      tdKey.style.fontFamily = 'var(--dev-font-mono)';
      tdKey.style.fontSize = '11px';
      tdKey.textContent = typeof rec.key === 'object' ? JSON.stringify(rec.key) : String(rec.key);

      const tdVal = document.createElement('td');
      tdVal.style.color = 'var(--dev-text-muted)';
      tdVal.style.wordBreak = 'break-all';

      if (typeof rec.value === 'object' && rec.value !== null) {
        tdVal.appendChild(renderJsonTree(rec.value));
      } else if (typeof rec.value === 'string') {
        try {
          const parsed = JSON.parse(rec.value);
          if (typeof parsed === 'object' && parsed !== null) {
            tdVal.appendChild(renderJsonTree(parsed));
          } else {
            tdVal.textContent = rec.value;
          }
        } catch {
          tdVal.textContent = rec.value;
        }
      } else {
        tdVal.textContent = String(rec.value);
      }

      const tdAct = document.createElement('td');
      tdAct.style.textAlign = 'center';

      const delBtn = document.createElement('button');
      delBtn.className = 'devtools-btn devtools-btn-danger devtools-btn-icon-only';
      delBtn.title = 'Delete Record';
      delBtn.innerHTML = CLOSE_ICON;
      delBtn.addEventListener('click', async (e) => {
        e.stopPropagation();
        if (window.confirm(`Are you sure you want to delete entry key "${rec.key}"?`)) {
          await this.deleteItem(rec.key);
        }
      });

      tdAct.appendChild(delBtn);
      tr.appendChild(tdKey);
      tr.appendChild(tdVal);
      tr.appendChild(tdAct);
      tbody.appendChild(tr);
    });

    table.appendChild(thead);
    table.appendChild(tbody);
    this.listScrollContainer.appendChild(table);
  }
}
