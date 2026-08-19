import { beforeEach, describe, expect, it } from 'vitest';
import { DevToolsStore } from '../../../../core/stores/devtools-store';
import { ConsoleTabView } from '../console-tab';

describe('ConsoleTabView Sorting', () => {
  let store: DevToolsStore;
  let tabView: ConsoleTabView;

  beforeEach(() => {
    store = new DevToolsStore();
    tabView = new ConsoleTabView(store);
  });

  it('should render console logs and sorting controls cleanly', () => {
    store.addLog({
      id: 'log-1',
      level: 'log',
      args: ['hello world'],
      timestamp: 1000,
      count: 1,
    });

    store.addLog({
      id: 'log-2',
      level: 'error',
      args: ['something failed'],
      timestamp: 2000,
      count: 5,
    });

    const element = tabView.render();
    expect(element).toBeTruthy();

    const selectEls = element.querySelectorAll('select');
    expect(selectEls.length).toBeGreaterThanOrEqual(2);
  });
});
