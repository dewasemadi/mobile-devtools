import {
  BUILTIN_TABS,
  DEFAULT_CONFIG_DEFAULTS,
  DEVTOOLS_CLASSNAMES,
  DevToolsStore,
  DevToolsTabId,
  exportBugReport,
  formatCount,
  THEME_MODES,
} from '../../core';
import { CLOSE_ICON, LOGO_ICON, MOON_ICON, SHARE_ICON, SUN_ICON } from '../icons';
import { ConsoleTabView } from './tabs/console-tab';
import { ElementsTabView } from './tabs/elements-tab';
import { NetworkTabView } from './tabs/network-tab';
import { StorageTabView } from './tabs/storage-tab';
import { SystemTabView } from './tabs/system-tab';

import { setupScrollLockGuard } from '../utils/scroll-lock';

export class DrawerView {
  private store: DevToolsStore;
  private overlayElement: HTMLElement;
  private drawerElement: HTMLElement;
  private tabContentContainer: HTMLElement;
  private unsubscribeStore: (() => void) | null = null;
  private originalBodyOverflow: string | null = null;
  private originalDocOverflow: string | null = null;
  private isBodyLocked = false;

  private consoleTab: ConsoleTabView;
  private elementsTab: ElementsTabView;
  private networkTab: NetworkTabView;
  private storageTab: StorageTabView;
  private systemTab: SystemTabView;

  // Swipe Dismiss & Tab Scroll State
  private dragOffsetY = 0;
  private isSwiping = false;
  private swipeStartY: number | null = null;
  private tabsScrollLeft = 0;

  constructor(store: DevToolsStore) {
    this.store = store;

    this.overlayElement = document.createElement('div');
    this.overlayElement.className = DEVTOOLS_CLASSNAMES.DRAWER_OVERLAY;

    this.drawerElement = document.createElement('div');
    this.drawerElement.className = DEVTOOLS_CLASSNAMES.DRAWER;

    this.tabContentContainer = document.createElement('div');
    this.tabContentContainer.style.flex = '1';
    this.tabContentContainer.style.display = 'flex';
    this.tabContentContainer.style.flexDirection = 'column';
    this.tabContentContainer.style.overflow = 'hidden';

    setupScrollLockGuard(this.tabContentContainer);

    this.consoleTab = new ConsoleTabView(store);
    this.elementsTab = new ElementsTabView(store);
    this.networkTab = new NetworkTabView(store);
    this.storageTab = new StorageTabView(store);
    this.systemTab = new SystemTabView(store);
  }

  public render(): { overlay: HTMLElement; drawer: HTMLElement } {
    this.setupOverlay();
    this.setupSwipeGesture();
    this.update();

    this.unsubscribeStore = this.store.subscribe(() => {
      this.update();
    });

    return { overlay: this.overlayElement, drawer: this.drawerElement };
  }

  private setupOverlay() {
    this.overlayElement.addEventListener('click', () => {
      this.handleClose();
    });

    this.overlayElement.addEventListener(
      'touchmove',
      (e: TouchEvent) => {
        if (e.cancelable) {
          e.preventDefault();
        }
        e.stopPropagation();
      },
      { passive: false }
    );
  }

  private handleClose() {
    this.dragOffsetY = 0;
    this.store.setIsOpen(false);
  }

  private lockBodyScroll() {
    if (this.isBodyLocked || typeof document === 'undefined') return;
    this.originalBodyOverflow = document.body.style.overflow;
    this.originalDocOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    this.isBodyLocked = true;
  }

  private unlockBodyScroll() {
    if (!this.isBodyLocked || typeof document === 'undefined') return;
    document.body.style.overflow = this.originalBodyOverflow || '';
    document.documentElement.style.overflow = this.originalDocOverflow || '';
    this.originalBodyOverflow = null;
    this.originalDocOverflow = null;
    this.isBodyLocked = false;
  }

  private attachSwipeListeners(element: HTMLElement) {
    element.addEventListener('pointerdown', (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest('.devtools-header-actions, button, a, input, select')) {
        return;
      }

      this.swipeStartY = e.clientY;
      this.isSwiping = true;
      try {
        element.setPointerCapture(e.pointerId);
      } catch {
        // Ignore
      }
    });

    element.addEventListener('pointermove', (e: PointerEvent) => {
      if (this.swipeStartY === null) return;
      const deltaY = e.clientY - this.swipeStartY;
      if (deltaY > 0) {
        this.dragOffsetY = deltaY;
        this.updateDrawerTransform();
      }
    });

    const handlePointerUp = (e: PointerEvent) => {
      if (this.swipeStartY === null) return;
      try {
        element.releasePointerCapture(e.pointerId);
      } catch {
        // Ignore
      }
      this.swipeStartY = null;
      this.isSwiping = false;

      if (this.dragOffsetY > 100) {
        this.handleClose();
      } else {
        this.dragOffsetY = 0;
        this.updateDrawerTransform();
      }
    };

    element.addEventListener('pointerup', handlePointerUp);
    element.addEventListener('pointercancel', handlePointerUp);
  }

  private setupSwipeGesture() {
    const handleArea = document.createElement('div');
    handleArea.className = 'devtools-handle-area';
    handleArea.title = 'Hold and swipe down to hide DevTools';
    handleArea.innerHTML = '<div class="devtools-handle-bar"></div>';

    this.attachSwipeListeners(handleArea);
    this.drawerElement.appendChild(handleArea);
  }

  private updateDrawerTransform() {
    const isOpen = this.store.getIsOpen();
    if (isOpen) {
      this.drawerElement.style.transform = `translateY(${this.dragOffsetY}px)`;
      this.drawerElement.style.transition = this.isSwiping
        ? 'none'
        : 'transform 0.28s cubic-bezier(0.16, 1, 0.3, 1)';
    } else {
      this.drawerElement.style.transform = '';
      this.drawerElement.style.transition = '';
    }
  }

  public update() {
    const isOpen = this.store.getIsOpen();
    const activeTab = this.store.getActiveTab();
    const themeMode = this.store.getThemeMode();
    const unread = this.store.getUnreadCounts();
    const config = this.store.getConfig();

    // Custom styles from config.styles
    if (config.styles?.overlay) {
      Object.assign(this.overlayElement.style, config.styles.overlay);
    }
    if (config.styles?.drawer) {
      Object.assign(this.drawerElement.style, config.styles.drawer);
    }

    // Overlay Open State
    if (isOpen) {
      this.overlayElement.classList.add('open');
      this.drawerElement.classList.add('open');
      this.lockBodyScroll();
    } else {
      this.overlayElement.classList.remove('open');
      this.drawerElement.classList.remove('open');
      this.unlockBodyScroll();
    }
    this.updateDrawerTransform();

    // Rebuild Drawer Header & Tabs
    // Keep handle bar (first child)
    while (this.drawerElement.children.length > 1) {
      this.drawerElement.removeChild(this.drawerElement.lastChild!);
    }

    // Header Bar
    const header = document.createElement('div');
    header.className = 'devtools-header';

    const titleGroup = document.createElement('div');
    titleGroup.className = 'devtools-title-group';

    let iconHtml = '';
    if (config.icon) {
      if (
        typeof config.icon === 'string' &&
        (config.icon.startsWith('http') || config.icon.startsWith('data:'))
      ) {
        iconHtml = `<img src="${config.icon}" style="width:18px;height:18px;object-fit:contain;margin-right:4px;" alt="" />`;
      } else {
        iconHtml =
          typeof config.icon === 'string'
            ? `<span style="font-size:16px;margin-right:4px">${config.icon}</span>`
            : '';
      }
    } else {
      iconHtml = LOGO_ICON;
    }

    const pillTitle = config.title || DEFAULT_CONFIG_DEFAULTS.TITLE;
    const errorPill =
      unread.errors > 0
        ? `<span class="devtools-pill-badge error">${formatCount(unread.errors)} Errors</span>`
        : '';

    titleGroup.innerHTML = `
      ${iconHtml}
      <span class="devtools-pill-badge">${pillTitle}</span>
      ${errorPill}
    `;

    // Actions (Theme Toggle Button & Close Button)
    const headerActions = document.createElement('div');
    headerActions.className = 'devtools-header-actions';

    const themeToggleBtn = document.createElement('button');
    themeToggleBtn.className = 'devtools-icon-btn';
    themeToggleBtn.title = `Switch to ${themeMode === THEME_MODES.DARK ? 'Light' : 'Dark'} Mode`;
    themeToggleBtn.innerHTML = themeMode === THEME_MODES.DARK ? SUN_ICON : MOON_ICON;

    themeToggleBtn.addEventListener('click', () => {
      this.store.toggleThemeMode();
    });

    const closeBtn = document.createElement('button');
    closeBtn.className = 'devtools-icon-btn devtools-close-btn';
    closeBtn.title = 'Close DevTools Overlay';
    closeBtn.innerHTML = CLOSE_ICON;
    closeBtn.addEventListener('click', () => {
      this.handleClose();
    });

    const shareBtn = document.createElement('button');
    shareBtn.className = 'devtools-icon-btn';
    shareBtn.title = 'Export Bug Report (Share / Download Logs)';
    shareBtn.innerHTML = SHARE_ICON;

    shareBtn.addEventListener('click', async () => {
      shareBtn.style.opacity = '0.5';
      const res = await exportBugReport(this.store);
      shareBtn.style.opacity = '1';
      if (res.shared) {
        // Native Web Share sheet opened
      } else if (res.downloaded) {
        alert('Bug Report downloaded to text file!');
      } else if (res.copied) {
        alert('Bug Report copied to clipboard!');
      }
    });

    headerActions.appendChild(shareBtn);
    headerActions.appendChild(themeToggleBtn);
    headerActions.appendChild(closeBtn);
    header.appendChild(titleGroup);
    header.appendChild(headerActions);
    this.attachSwipeListeners(header);

    // Segmented Tabs Bar
    const prevTabsScrollLeft = this.tabsScrollLeft;
    const tabsBar = document.createElement('div');
    tabsBar.className = 'devtools-tabs-bar';
    setupScrollLockGuard(tabsBar);

    tabsBar.addEventListener('scroll', () => {
      this.tabsScrollLeft = tabsBar.scrollLeft;
    });

    const enabledTabs = config.enabledTabs || [
      BUILTIN_TABS.CONSOLE,
      BUILTIN_TABS.ELEMENTS,
      BUILTIN_TABS.NETWORK,
      BUILTIN_TABS.STORAGE,
      BUILTIN_TABS.SYSTEM,
    ];
    const customTabs = config.customTabs || [];

    enabledTabs.forEach((tabId: DevToolsTabId) => {
      const tabBtn = document.createElement('button');
      tabBtn.className = `devtools-tab-btn ${activeTab === tabId ? 'active' : ''}`;
      tabBtn.textContent = tabId.charAt(0).toUpperCase() + tabId.slice(1);
      tabBtn.addEventListener('click', () => {
        this.store.setActiveTab(tabId);
      });
      tabsBar.appendChild(tabBtn);
    });

    customTabs.forEach((ct) => {
      const tabBtn = document.createElement('button');
      tabBtn.className = `devtools-tab-btn ${activeTab === ct.id ? 'active' : ''}`;
      tabBtn.textContent = ct.title;
      tabBtn.addEventListener('click', () => {
        this.store.setActiveTab(ct.id as any);
      });
      tabsBar.appendChild(tabBtn);
    });

    // Mount Active Tab Content
    this.tabContentContainer.innerHTML = '';
    if (activeTab === BUILTIN_TABS.CONSOLE) {
      this.tabContentContainer.appendChild(this.consoleTab.render());
    } else if (activeTab === BUILTIN_TABS.ELEMENTS) {
      this.tabContentContainer.appendChild(this.elementsTab.render());
    } else if (activeTab === BUILTIN_TABS.NETWORK) {
      this.tabContentContainer.appendChild(this.networkTab.render());
    } else if (activeTab === BUILTIN_TABS.STORAGE) {
      this.tabContentContainer.appendChild(this.storageTab.render());
    } else if (activeTab === BUILTIN_TABS.SYSTEM) {
      this.tabContentContainer.appendChild(this.systemTab.render());
    } else {
      const customTab = customTabs.find((ct) => ct.id === activeTab);
      if (customTab && customTab.render) {
        const customContainer = document.createElement('div');
        customContainer.className = 'devtools-tab-content';
        customContainer.style.padding = '16px';
        customTab.render(customContainer);
        this.tabContentContainer.appendChild(customContainer);
      }
    }

    this.drawerElement.appendChild(header);
    this.drawerElement.appendChild(tabsBar);
    this.drawerElement.appendChild(this.tabContentContainer);

    requestAnimationFrame(() => {
      if (tabsBar) {
        tabsBar.scrollLeft = prevTabsScrollLeft;
      }
    });
  }

  public destroy() {
    this.unlockBodyScroll();
    if (this.unsubscribeStore) {
      this.unsubscribeStore();
      this.unsubscribeStore = null;
    }
  }
}
