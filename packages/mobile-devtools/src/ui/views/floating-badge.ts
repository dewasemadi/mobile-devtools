import {
  calculateSnapPosition,
  clampPositionToViewport,
  DevToolsStore,
  DragPosition,
  formatCount,
} from '../../core';

export class FloatingBadgeView {
  private store: DevToolsStore;
  private badgeElement: HTMLElement;
  private currentPos: DragPosition;
  private dragStartPos: {
    startX: number;
    startY: number;
    initialX: number;
    initialY: number;
  } | null = null;
  private hasMoved = false;
  private unsubscribeStore: (() => void) | null = null;

  constructor(store: DevToolsStore) {
    this.store = store;
    this.currentPos = clampPositionToViewport(store.getBadgePosition());
    this.badgeElement = document.createElement('div');
    this.badgeElement.className = 'devtools-badge';
  }

  public render(): HTMLElement {
    this.setupEventListeners();
    this.update();

    this.unsubscribeStore = this.store.subscribe(() => {
      this.update();
    });

    return this.badgeElement;
  }

  private getBadgeWidth(): number {
    const width = this.badgeElement.getBoundingClientRect().width;
    return width > 0 ? Math.ceil(width) : 125;
  }

  public update() {
    const pos = this.store.getBadgePosition();
    const width = this.getBadgeWidth();
    const clamped = clampPositionToViewport(pos, width, 38, 16);
    this.currentPos = clamped;

    const unread = this.store.getUnreadCounts();
    const config = this.store.getConfig();

    if (config.showBadge === false) {
      this.badgeElement.style.display = 'none';
      return;
    } else {
      this.badgeElement.style.display = 'flex';
    }

    const hasErrors = unread.errors > 0;
    const hasWarnings = unread.warnings > 0;
    const hasUnreadTotal = unread.total > 0;

    // Positioning & Borders
    this.badgeElement.style.left = `${clamped.x}px`;
    this.badgeElement.style.top = `${clamped.y}px`;

    let borderColor = 'var(--dev-border)';
    if (hasErrors) {
      borderColor = 'rgba(239, 68, 68, 0.4)';
    } else if (hasWarnings) {
      borderColor = 'rgba(245, 158, 11, 0.4)';
    }
    this.badgeElement.style.borderColor = borderColor;

    // Custom badge styling from config.styles?.badge
    const customBadgeStyles = config.styles?.badge;
    if (customBadgeStyles) {
      Object.assign(this.badgeElement.style, customBadgeStyles);
    }

    // HTML Content
    let dotHtml = '';
    if (config.icon) {
      if (
        typeof config.icon === 'string' &&
        (config.icon.startsWith('http') || config.icon.startsWith('data:'))
      ) {
        dotHtml = `<img src="${config.icon}" style="width:16px;height:16px;object-fit:contain;margin-right:2px;" alt="" />`;
      } else {
        dotHtml =
          typeof config.icon === 'string'
            ? `<span style="font-size:14px;margin-right:2px">${config.icon}</span>`
            : '';
      }
    } else {
      let statusClass = '';
      if (hasErrors) {
        statusClass = 'error';
      } else if (hasWarnings) {
        statusClass = 'warn';
      }
      dotHtml = `<span class="devtools-badge-dot ${statusClass}"></span>`;
    }

    const titleText = config.title || 'DevTools';

    let tagHtml = '';
    if (hasErrors) {
      tagHtml = `<span class="devtools-badge-count">${formatCount(unread.errors)}</span>`;
    } else if (hasWarnings) {
      tagHtml = `<span class="devtools-badge-tag">${formatCount(unread.warnings)}</span>`;
    } else if (hasUnreadTotal) {
      tagHtml = `<span class="devtools-badge-tag">${formatCount(unread.total)}</span>`;
    }

    this.badgeElement.innerHTML = `
      ${dotHtml}
      <span class="devtools-badge-label">${titleText}</span>
      ${tagHtml}
    `;
  }

  private setupEventListeners() {
    this.badgeElement.addEventListener('pointerdown', (e: PointerEvent) => {
      this.dragStartPos = {
        startX: e.clientX,
        startY: e.clientY,
        initialX: this.currentPos.x,
        initialY: this.currentPos.y,
      };
      this.hasMoved = false;
      try {
        this.badgeElement.setPointerCapture(e.pointerId);
      } catch {
        // Ignore
      }
    });

    this.badgeElement.addEventListener('pointermove', (e: PointerEvent) => {
      if (!this.dragStartPos) return;
      const deltaX = e.clientX - this.dragStartPos.startX;
      const deltaY = e.clientY - this.dragStartPos.startY;

      if (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3) {
        this.hasMoved = true;

        const newX = this.dragStartPos.initialX + deltaX;
        const newY = this.dragStartPos.initialY + deltaY;
        const width = this.getBadgeWidth();
        const clamped = clampPositionToViewport({ x: newX, y: newY }, width, 38, 16);

        this.currentPos = clamped;
        this.badgeElement.style.left = `${clamped.x}px`;
        this.badgeElement.style.top = `${clamped.y}px`;
      }
    });

    const handlePointerUp = (e: PointerEvent) => {
      if (!this.dragStartPos) return;
      try {
        this.badgeElement.releasePointerCapture(e.pointerId);
      } catch {
        // Ignore
      }

      this.dragStartPos = null;

      if (this.hasMoved) {
        const width = this.getBadgeWidth();
        let finalPos = this.currentPos;
        const config = this.store.getConfig();

        if (config.autoSnapBadge === true) {
          finalPos = calculateSnapPosition(
            this.currentPos,
            width,
            38,
            window.innerWidth,
            window.innerHeight,
            16
          );
        }

        const clamped = clampPositionToViewport(finalPos, width, 38, 16);
        this.store.setBadgePosition(clamped);
      } else {
        // Clean tap - toggle drawer
        this.store.toggleOpen();
      }
    };

    this.badgeElement.addEventListener('pointerup', handlePointerUp);
    this.badgeElement.addEventListener('pointercancel', handlePointerUp);
  }

  public destroy() {
    if (this.unsubscribeStore) {
      this.unsubscribeStore();
      this.unsubscribeStore = null;
    }
  }
}
