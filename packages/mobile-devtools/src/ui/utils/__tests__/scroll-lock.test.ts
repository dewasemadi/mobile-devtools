import { describe, expect, it, vi } from 'vitest';
import { setupScrollLockGuard } from '../scroll-lock';

describe('scroll-lock', () => {
  it('should set initial inline CSS properties on target element', () => {
    const el = document.createElement('div');
    setupScrollLockGuard(el);

    expect(el.style.overscrollBehavior).toBe('contain');
    expect(el.style.touchAction).toBe('pan-x pan-y');
  });

  it('should adjust scrollTop to 1px on touchstart when scrollTop is 0 and vertically scrollable', () => {
    const el = document.createElement('div');
    Object.defineProperty(el, 'clientHeight', { value: 100, configurable: true });
    Object.defineProperty(el, 'scrollHeight', { value: 300, configurable: true });
    el.scrollTop = 0;

    setupScrollLockGuard(el);

    const touchEvent = new TouchEvent('touchstart', {
      bubbles: true,
      touches: [{ clientX: 50, clientY: 50 } as Touch],
    });
    el.dispatchEvent(touchEvent);

    expect(el.scrollTop).toBe(1);
  });

  it('should adjust scrollTop when at bottom boundary on touchstart', () => {
    const el = document.createElement('div');
    Object.defineProperty(el, 'clientHeight', { value: 100, configurable: true });
    Object.defineProperty(el, 'scrollHeight', { value: 300, configurable: true });
    el.scrollTop = 200; // top + clientHeight === scrollHeight (200 + 100 = 300)

    setupScrollLockGuard(el);

    const touchEvent = new TouchEvent('touchstart', {
      bubbles: true,
      touches: [{ clientX: 50, clientY: 50 } as Touch],
    });
    el.dispatchEvent(touchEvent);

    expect(el.scrollTop).toBe(199);
  });

  it('should adjust scrollLeft to 1px on touchstart when scrollLeft is 0 and horizontally scrollable', () => {
    const el = document.createElement('div');
    Object.defineProperty(el, 'clientWidth', { value: 100, configurable: true });
    Object.defineProperty(el, 'scrollWidth', { value: 300, configurable: true });
    el.scrollLeft = 0;

    setupScrollLockGuard(el);

    const touchEvent = new TouchEvent('touchstart', {
      bubbles: true,
      touches: [{ clientX: 50, clientY: 50 } as Touch],
    });
    el.dispatchEvent(touchEvent);

    expect(el.scrollLeft).toBe(1);
  });

  it('should adjust scrollLeft when at right boundary on touchstart', () => {
    const el = document.createElement('div');
    Object.defineProperty(el, 'clientWidth', { value: 100, configurable: true });
    Object.defineProperty(el, 'scrollWidth', { value: 300, configurable: true });
    el.scrollLeft = 200; // left + clientWidth === scrollWidth (200 + 100 = 300)

    setupScrollLockGuard(el);

    const touchEvent = new TouchEvent('touchstart', {
      bubbles: true,
      touches: [{ clientX: 50, clientY: 50 } as Touch],
    });
    el.dispatchEvent(touchEvent);

    expect(el.scrollLeft).toBe(199);
  });

  it('should bypass bounce adjustment when target is an input element', () => {
    const el = document.createElement('div');
    const input = document.createElement('input');
    el.appendChild(input);
    Object.defineProperty(el, 'clientHeight', { value: 100, configurable: true });
    Object.defineProperty(el, 'scrollHeight', { value: 300, configurable: true });
    el.scrollTop = 0;

    setupScrollLockGuard(el);

    const touchEvent = new TouchEvent('touchstart', {
      bubbles: true,
      touches: [{ clientX: 50, clientY: 50 } as Touch],
    });
    input.dispatchEvent(touchEvent);

    expect(el.scrollTop).toBe(0);
  });

  it('should handle touchmove swipe gestures and preventDefault when boundary reached', () => {
    const el = document.createElement('div');
    Object.defineProperty(el, 'clientHeight', { value: 100, configurable: true });
    Object.defineProperty(el, 'scrollHeight', { value: 300, configurable: true });
    el.scrollTop = 100;

    setupScrollLockGuard(el);

    // Initial touchstart
    const touchStart = new TouchEvent('touchstart', {
      bubbles: true,
      touches: [{ clientX: 50, clientY: 50 } as Touch],
    });
    el.dispatchEvent(touchStart);

    // Touchmove vertical swipe up (deltaY < 0)
    const touchMove = new TouchEvent('touchmove', {
      bubbles: true,
      cancelable: true,
      touches: [{ clientX: 50, clientY: 20 } as Touch],
    });
    const preventDefaultSpy = vi.spyOn(touchMove, 'preventDefault');

    el.dispatchEvent(touchMove);

    expect(preventDefaultSpy).not.toHaveBeenCalled();
  });

  it('should preventDefault on touchmove if input element inside container', () => {
    const el = document.createElement('div');
    const input = document.createElement('input');
    el.appendChild(input);

    setupScrollLockGuard(el);

    const touchMove = new TouchEvent('touchmove', { bubbles: true, cancelable: true });
    const stopPropagationSpy = vi.spyOn(touchMove, 'stopPropagation');

    input.dispatchEvent(touchMove);

    expect(stopPropagationSpy).toHaveBeenCalled();
  });
});

