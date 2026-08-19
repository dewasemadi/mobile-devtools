/**
 * Prevents mobile browser overscroll bounce (rubber-banding) from bleeding through to host web page.
 * Supports both vertical and horizontal scrollable containers without blocking touch gestures.
 * @param el Target scrollable HTML element.
 */
export function setupScrollLockGuard(el: HTMLElement) {
  el.style.overscrollBehavior = 'contain';
  (el.style as any).webkitOverflowScrolling = 'touch';
  el.style.touchAction = 'pan-x pan-y';

  let startY = 0;
  let startX = 0;

  el.addEventListener(
    'touchstart',
    (e: TouchEvent) => {
      if (e.touches && e.touches.length > 0) {
        startY = e.touches[0].clientY;
        startX = e.touches[0].clientX;
      }

      const target = e.target as HTMLElement | null;
      if (target?.closest('input, textarea, select, [contenteditable="true"]')) {
        return;
      }

      // 1. Vertical bounce guard
      const top = el.scrollTop;
      const totalH = el.scrollHeight;
      const currentH = top + el.clientHeight;

      if (totalH > el.clientHeight) {
        if (top <= 0) {
          el.scrollTop = 1;
        } else if (currentH >= totalH) {
          el.scrollTop = totalH - el.clientHeight - 1;
        }
      }

      // 2. Horizontal bounce guard
      const left = el.scrollLeft;
      const totalW = el.scrollWidth;
      const currentW = left + el.clientWidth;

      if (totalW > el.clientWidth) {
        if (left <= 0) {
          el.scrollLeft = 1;
        } else if (currentW >= totalW) {
          el.scrollLeft = totalW - el.clientWidth - 1;
        }
      }
    },
    { passive: true }
  );

  el.addEventListener(
    'touchmove',
    (e: TouchEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest('input, textarea, select, [contenteditable="true"]')) {
        e.stopPropagation();
        return;
      }

      const isVerticallyScrollable = el.scrollHeight > el.clientHeight;
      const isHorizontallyScrollable = el.scrollWidth > el.clientWidth;

      if (e.touches && e.touches.length > 0) {
        const currentY = e.touches[0].clientY;
        const currentX = e.touches[0].clientX;
        const deltaY = currentY - startY;
        const deltaX = currentX - startX;

        const canScrollUp = el.scrollTop > 0;
        const canScrollDown = el.scrollTop + el.clientHeight < el.scrollHeight - 1;
        const canScrollLeft = el.scrollLeft > 0;
        const canScrollRight = el.scrollLeft + el.clientWidth < el.scrollWidth - 1;

        const isVerticalSwipe = Math.abs(deltaY) >= Math.abs(deltaX);

        let canScrollInDirection = false;
        if (isVerticalSwipe && isVerticallyScrollable) {
          if ((deltaY < 0 && canScrollDown) || (deltaY > 0 && canScrollUp)) {
            canScrollInDirection = true;
          }
        } else if (!isVerticalSwipe && isHorizontallyScrollable) {
          if ((deltaX < 0 && canScrollRight) || (deltaX > 0 && canScrollLeft)) {
            canScrollInDirection = true;
          }
        }

        if (!canScrollInDirection && e.cancelable) {
          e.preventDefault();
        }
      } else {
        if (!isVerticallyScrollable && !isHorizontallyScrollable) {
          if (e.cancelable) {
            e.preventDefault();
          }
        }
      }

      e.stopPropagation();
    },
    { passive: false }
  );
}
