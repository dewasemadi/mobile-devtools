import { describe, it, expect, beforeEach } from 'vitest';
import { DevToolsStore } from '../../../core';
import { FloatingBadgeView } from '../floating-badge';

if (typeof globalThis.PointerEvent === 'undefined') {
  (globalThis as any).PointerEvent = class PointerEvent extends MouseEvent {
    pointerId: number;
    constructor(type: string, params: any = {}) {
      super(type, params);
      this.pointerId = params.pointerId || 1;
    }
  };
}

describe('FloatingBadgeView', () => {

  let store: DevToolsStore;
  let badgeView: FloatingBadgeView;

  beforeEach(() => {
    store = new DevToolsStore();
    badgeView = new FloatingBadgeView(store);
  });

  it('should render badge element and handle tap to open drawer', () => {
    const el = badgeView.render();
    expect(el).toBeDefined();
    expect(el.className).toContain('devtools-badge');

    expect(store.getIsOpen()).toBe(false);

    const downEvt = new PointerEvent('pointerdown', { clientX: 100, clientY: 100, pointerId: 1 });
    el.dispatchEvent(downEvt);

    const upEvt = new PointerEvent('pointerup', { clientX: 100, clientY: 100, pointerId: 1 });
    el.dispatchEvent(upEvt);

    expect(store.getIsOpen()).toBe(true);
  });

  it('should toggle drawer on Enter or Space keydown', () => {
    const el = badgeView.render();
    store.setIsOpen(false);

    el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    expect(store.getIsOpen()).toBe(true);

    el.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
    expect(store.getIsOpen()).toBe(false);
  });

  it('should handle dragging with autoSnapBadge set to true', () => {
    store.updateConfig({ autoSnapBadge: true });
    const el = badgeView.render();

    const pDown = new PointerEvent('pointerdown', { clientX: 50, clientY: 50, pointerId: 1 });
    const pMove = new PointerEvent('pointermove', { clientY: 150, clientX: 150, pointerId: 1 });
    const pUp = new PointerEvent('pointerup', { clientY: 150, clientX: 150, pointerId: 1 });

    el.dispatchEvent(pDown);
    el.dispatchEvent(pMove);
    el.dispatchEvent(pUp);

    expect(store.getBadgePosition()).toBeDefined();
  });

  it('should render error and warning count badges', () => {
    store.addLog({
      id: 'l1',
      level: 'error',
      args: ['Error msg'],
      timestamp: Date.now(),
      count: 1,
    });

    const el = badgeView.render();
    expect(el.textContent).toContain('1');

    store.addLog({
      id: 'l2',
      level: 'warn',
      args: ['Warn msg'],
      timestamp: Date.now(),
      count: 1,
    });
    badgeView.update();
    expect(el.textContent).toContain('1');
  });

  it('should render custom icon and custom title in badge', () => {
    store.updateConfig({
      title: 'App Badge',
      icon: 'https://example.com/badge-icon.png',
    });

    const el = badgeView.render();
    expect(el.textContent).toContain('App Badge');
    expect(el.querySelector('img[src="https://example.com/badge-icon.png"]')).not.toBeNull();
  });

  it('should hide badge element when showBadge is false', () => {
    store.updateConfig({ showBadge: false });
    const el = badgeView.render();
    expect(el.style.display).toBe('none');
  });

  it('should support custom renderBadge callback while preserving container drag listeners', () => {
    let renderCalled = false;
    let receivedUnread = -1;

    store.updateConfig({
      renderBadge: (container, props) => {
        renderCalled = true;
        receivedUnread = props.unreadErrors;
        container.innerHTML = '<span class="my-custom-badge">Custom Badge</span>';
      },
    });

    const el = badgeView.render();
    expect(renderCalled).toBe(true);
    expect(receivedUnread).toBe(0);
    expect(el.innerHTML).toContain('my-custom-badge');

    const downEvt = new PointerEvent('pointerdown', { clientX: 50, clientY: 50, pointerId: 1 });
    el.dispatchEvent(downEvt);

    const moveEvt = new PointerEvent('pointermove', { clientX: 100, clientY: 100, pointerId: 1 });
    el.dispatchEvent(moveEvt);

    expect(el.style.left).not.toBe('');
    expect(el.style.top).not.toBe('');
  });

  it('should clean up store subscription on destroy', () => {
    badgeView.render();
    badgeView.destroy();
  });
});

