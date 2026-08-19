import { describe, it, expect, beforeEach } from 'vitest';
import { DevToolsStore } from '../../../core';
import { DrawerView } from '../drawer';

describe('DrawerView', () => {
  let store: DevToolsStore;
  let drawerView: DrawerView;

  beforeEach(() => {
    store = new DevToolsStore();
    drawerView = new DrawerView(store);
  });

  it('should render overlay and drawer elements', () => {
    const { overlay, drawer } = drawerView.render();
    expect(overlay).toBeDefined();
    expect(drawer).toBeDefined();
    expect(overlay.className).toContain('devtools-drawer-overlay');
    expect(drawer.className).toContain('devtools-drawer');
  });

  it('should toggle open class when store isOpen changes', () => {
    const { drawer } = drawerView.render();

    store.setIsOpen(true);
    expect(drawer.classList.contains('open')).toBe(true);

    store.setIsOpen(false);
    expect(drawer.classList.contains('open')).toBe(false);
  });

  it('should render and activate customTabs', () => {
    const customRenderMock = (container: HTMLElement) => {
      container.innerHTML = '<div id="custom-tab-content">Custom Analytics Content</div>';
    };

    store.updateConfig({
      customTabs: [
        {
          id: 'custom_analytics',
          title: 'Analytics',
          render: customRenderMock,
        },
      ],
    });

    const { drawer } = drawerView.render();
    const customTabBtn = Array.from(drawer.querySelectorAll('.devtools-tab-btn')).find(
      (btn) => btn.textContent === 'Analytics'
    ) as HTMLButtonElement;

    expect(customTabBtn).not.toBeUndefined();

    customTabBtn.click();
    expect(store.getActiveTab()).toBe('custom_analytics');
    expect(drawer.querySelector('#custom-tab-content')?.textContent).toBe(
      'Custom Analytics Content'
    );
  });
});
