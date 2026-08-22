import { describe, it, expect, beforeEach, vi } from 'vitest';
import { DevToolsStore } from '../../../core';
import { DrawerView } from '../drawer';

if (typeof globalThis.PointerEvent === 'undefined') {
  (globalThis as any).PointerEvent = class PointerEvent extends MouseEvent {
    pointerId: number;
    constructor(type: string, params: any = {}) {
      super(type, params);
      this.pointerId = params.pointerId || 1;
    }
  };
}

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

  it('should close drawer on overlay click or Escape key press', () => {
    const { overlay } = drawerView.render();
    store.setIsOpen(true);

    overlay.click();
    expect(store.getIsOpen()).toBe(false);

    store.setIsOpen(true);
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(store.getIsOpen()).toBe(false);
  });

  it('should toggle theme mode on theme button click', () => {
    const { drawer } = drawerView.render();
    const themeBtn = drawer.querySelector('button[title*="Switch to"]') as HTMLButtonElement;

    expect(themeBtn).not.toBeNull();
    const initialMode = store.getThemeMode();

    themeBtn.click();
    expect(store.getThemeMode()).not.toBe(initialMode);
  });

  it('should trigger bug report export on share button click', async () => {
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    const { drawer } = drawerView.render();
    const shareBtn = drawer.querySelector('button[title*="Export Bug Report"]') as HTMLButtonElement;

    expect(shareBtn).not.toBeNull();
    shareBtn.click();
    await new Promise((r) => setTimeout(r, 10));

    alertSpy.mockRestore();
  });

  it('should handle swipe down gesture to close drawer', () => {
    const { drawer } = drawerView.render();
    store.setIsOpen(true);

    const handleArea = drawer.querySelector('.devtools-handle-area') as HTMLElement;
    expect(handleArea).not.toBeNull();

    // Simulate pointer swipe down
    const pDown = new PointerEvent('pointerdown', { clientY: 50, pointerId: 1 });
    const pMove = new PointerEvent('pointermove', { clientY: 200, pointerId: 1 });
    const pUp = new PointerEvent('pointerup', { clientY: 200, pointerId: 1 });

    handleArea.dispatchEvent(pDown);
    handleArea.dispatchEvent(pMove);
    handleArea.dispatchEvent(pUp);

    expect(store.getIsOpen()).toBe(false);
  });

  it('should render custom icon and custom title in header', () => {
    store.updateConfig({
      title: 'Custom App',
      icon: 'https://example.com/icon.png',
    });

    const { drawer } = drawerView.render();
    expect(drawer.textContent).toContain('Custom App');
    expect(drawer.querySelector('img[src="https://example.com/icon.png"]')).not.toBeNull();
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

  it('should clean up on destroy', () => {
    drawerView.render();
    drawerView.destroy();
  });
});

