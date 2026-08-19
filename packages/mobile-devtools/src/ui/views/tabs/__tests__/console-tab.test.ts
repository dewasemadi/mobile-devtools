import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DevToolsStore } from '../../../../core';
import { ConsoleTabView } from '../console-tab';

describe('ConsoleTabView', () => {
  let store: DevToolsStore;
  let tabView: ConsoleTabView;

  beforeEach(() => {
    store = new DevToolsStore();
    tabView = new ConsoleTabView(store);
  });

  it('should render toolbar and log entries', () => {
    store.addLog({
      id: '1',
      level: 'log',
      args: ['User logged in'],
      timestamp: Date.now(),
      count: 1,
    });
    store.addLog({
      id: '2',
      level: 'error',
      args: ['Database error'],
      timestamp: Date.now(),
      count: 1,
    });

    const el = tabView.render();
    expect(el).toBeDefined();
    expect(el.querySelectorAll('.devtools-code-card').length).toBe(2);
  });

  it('should filter logs by level select dropdown', () => {
    store.addLog({
      id: '1',
      level: 'log',
      args: ['User logged in'],
      timestamp: Date.now(),
      count: 1,
    });
    store.addLog({
      id: '2',
      level: 'error',
      args: ['Database error'],
      timestamp: Date.now(),
      count: 1,
    });

    const el = tabView.render();
    const select = el.querySelector('select.devtools-select') as HTMLSelectElement;

    expect(select).not.toBeNull();
    select.value = 'error';
    select.dispatchEvent(new Event('change'));

    expect(el.querySelectorAll('.devtools-code-card').length).toBe(1);
    expect(el.textContent).toContain('Database error');
  });

  it('should filter logs by text search query', () => {
    store.addLog({
      id: '1',
      level: 'log',
      args: ['User logged in'],
      timestamp: Date.now(),
      count: 1,
    });
    store.addLog({
      id: '2',
      level: 'error',
      args: ['Database error'],
      timestamp: Date.now(),
      count: 1,
    });

    const el = tabView.render();
    const searchInput = el.querySelector('input.devtools-search-input') as HTMLInputElement;

    expect(searchInput).not.toBeNull();
    searchInput.value = 'Database';
    searchInput.dispatchEvent(new Event('input'));

    expect(el.querySelectorAll('.devtools-code-card').length).toBe(1);
    expect(el.textContent).toContain('Database error');
  });

  it('should clear logs when clear button is clicked', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    store.addLog({
      id: '1',
      level: 'warn',
      args: ['Warning message'],
      timestamp: Date.now(),
      count: 1,
    });

    const el = tabView.render();
    const clearBtn = el.querySelector('.devtools-btn-danger') as HTMLButtonElement;
    expect(clearBtn).not.toBeNull();

    clearBtn.click();
    expect(store.getLogs().length).toBe(0);
  });
});
