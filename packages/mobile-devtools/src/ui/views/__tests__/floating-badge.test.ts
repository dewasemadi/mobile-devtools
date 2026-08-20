import { describe, it, expect, beforeEach } from 'vitest';
import { DevToolsStore } from '../../../core';
import { FloatingBadgeView } from '../floating-badge';

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

    const downEvt = new Event('pointerdown', { bubbles: true });
    (downEvt as any).clientX = 100;
    (downEvt as any).clientY = 100;
    el.dispatchEvent(downEvt);

    const upEvt = new Event('pointerup', { bubbles: true });
    (upEvt as any).clientX = 100;
    (upEvt as any).clientY = 100;
    el.dispatchEvent(upEvt);

    expect(store.getIsOpen()).toBe(true);
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

    // Verify pointer drag gestures still work on container
    const downEvt = new Event('pointerdown', { bubbles: true });
    (downEvt as any).clientX = 50;
    (downEvt as any).clientY = 50;
    el.dispatchEvent(downEvt);

    const moveEvt = new Event('pointermove', { bubbles: true });
    (moveEvt as any).clientX = 100;
    (moveEvt as any).clientY = 100;
    el.dispatchEvent(moveEvt);

    expect(el.style.left).not.toBe('');
    expect(el.style.top).not.toBe('');
  });
});
