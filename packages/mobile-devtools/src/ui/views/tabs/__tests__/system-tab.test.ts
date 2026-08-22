import { describe, it, expect, beforeEach, vi } from 'vitest';
import { DevToolsStore } from '../../../../core';
import { SystemTabView } from '../system-tab';

describe('SystemTabView', () => {
  let store: DevToolsStore;
  let tabView: SystemTabView;

  beforeEach(() => {
    store = new DevToolsStore();
    tabView = new SystemTabView(store);
  });

  it('should render system environment information table', () => {
    const el = tabView.render();
    expect(el).toBeDefined();

    const table = el.querySelector('.devtools-table');
    expect(table).not.toBeNull();
    expect(el.textContent).toContain('User Agent');
    expect(el.textContent).toContain('Screen Resolution');
  });

  it('should handle copy URL and copy system info buttons', async () => {
    const el = tabView.render();
    const copyBtns = Array.from(el.querySelectorAll('button[title*="Copy"]')) as HTMLButtonElement[];

    expect(copyBtns.length).toBeGreaterThanOrEqual(2);

    copyBtns[0].click(); // Copy URL
    copyBtns[1].click(); // Copy System Info
  });

  it('should render memory metrics when performance.memory is present', () => {
    const originalMemory = (performance as any).memory;
    (performance as any).memory = {
      usedJSHeapSize: 10485760,
      jsHeapSizeLimit: 104857600,
    };

    const el = tabView.render();
    expect(el.textContent).toContain('10MB / 100MB');

    (performance as any).memory = originalMemory;
  });
});

