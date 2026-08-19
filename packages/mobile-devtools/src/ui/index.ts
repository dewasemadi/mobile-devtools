import {
  ConsoleInterceptor,
  DEVTOOLS_CLASSNAMES,
  DevToolsConfig,
  DevToolsStore,
  isBrowser,
  NetworkInterceptor,
  ShadowHostManager,
  ShakeDetector,
  SSEInterceptor,
  WebSocketInterceptor,
} from '../core';
import { DrawerView } from './views/drawer';
import { FloatingBadgeView } from './views/floating-badge';
import { SHADOW_STYLES } from './styles/shadow-styles';
import { applyThemeVariables } from './utils/theme-helper';

declare const process: any;

export { SHADOW_STYLES, applyThemeVariables };
export * from './icons';

export class MobileDevToolsEngine {
  private store: DevToolsStore;
  private shadowHostManager: ShadowHostManager | null = null;
  private shadowContainer: HTMLElement | null = null;
  private consoleInterceptor: ConsoleInterceptor | null = null;
  private networkInterceptor: NetworkInterceptor | null = null;
  private wsInterceptor: WebSocketInterceptor | null = null;
  private sseInterceptor: SSEInterceptor | null = null;
  private shakeDetector: ShakeDetector | null = null;
  private badgeView: FloatingBadgeView | null = null;
  private drawerView: DrawerView | null = null;
  private unsubscribeStore: (() => void) | null = null;
  private isMounted = false;

  constructor(config?: DevToolsConfig) {
    this.store = new DevToolsStore(config);
  }

  public getStore(): DevToolsStore {
    return this.store;
  }

  public updateConfig(config: Partial<DevToolsConfig>) {
    this.store.updateConfig(config);
  }

  public mount(): { container: HTMLElement; store: DevToolsStore } {
    if (this.isMounted && this.shadowContainer) {
      return { container: this.shadowContainer, store: this.store };
    }

    const config = this.store.getConfig();
    const isEnvDev = typeof process !== 'undefined' && process.env?.NODE_ENV === 'development';
    const shouldRender = config.forceEnable ?? config.enabled ?? isEnvDev ?? true;

    if (!shouldRender) {
      const dummyContainer = isBrowser ? document.createElement('div') : ({} as HTMLElement);
      return { container: dummyContainer, store: this.store };
    }

    this.shadowHostManager = new ShadowHostManager();
    const { container } = this.shadowHostManager.mount(config.container);
    this.shadowHostManager.injectStyles(SHADOW_STYLES);
    this.shadowContainer = container;

    // Apply Theme
    this.syncTheme(container);

    // Subscribe store theme updates
    this.unsubscribeStore = this.store.subscribe(() => {
      if (this.shadowContainer) {
        this.syncTheme(this.shadowContainer);
      }
    });

    // Mount Interceptors
    const interceptorsConfig = config.interceptors;
    if (interceptorsConfig?.enableConsoleInterceptor !== false) {
      this.consoleInterceptor = new ConsoleInterceptor(this.store);
      this.consoleInterceptor.init();
    }

    if (
      interceptorsConfig?.enableFetchInterceptor !== false ||
      interceptorsConfig?.enableXhrInterceptor !== false
    ) {
      this.networkInterceptor = new NetworkInterceptor(this.store);
      this.networkInterceptor.init();
    }

    if (interceptorsConfig?.enableWebSocketInterceptor !== false) {
      this.wsInterceptor = new WebSocketInterceptor(this.store);
      this.wsInterceptor.init();
    }

    if (interceptorsConfig?.enableSSEInterceptor !== false) {
      this.sseInterceptor = new SSEInterceptor(this.store);
      this.sseInterceptor.init();
    }

    if (config.shakeToToggle) {
      this.shakeDetector = new ShakeDetector({
        threshold: config.shakeThreshold ?? 12,
        onShake: () => {
          this.store.toggleOpen();
        },
      });
      this.shakeDetector.start();
    }

    // Render Floating Badge & Drawer UI Elements into Shadow DOM Container
    this.badgeView = new FloatingBadgeView(this.store);
    const badgeElement = this.badgeView.render();

    this.drawerView = new DrawerView(this.store);
    const { overlay, drawer } = this.drawerView.render();

    container.appendChild(badgeElement);
    container.appendChild(overlay);
    container.appendChild(drawer);

    this.isMounted = true;
    return { container: this.shadowContainer, store: this.store };
  }

  private syncTheme(container: HTMLElement) {
    const config = this.store.getConfig();
    const effectiveMode = this.store.getEffectiveThemeMode();

    container.className = `${DEVTOOLS_CLASSNAMES.CONTAINER} theme-${effectiveMode}`;
    applyThemeVariables(container, config.theme, effectiveMode);
  }

  public destroy() {
    if (this.shakeDetector) {
      this.shakeDetector.stop();
      this.shakeDetector = null;
    }
    if (this.badgeView) {
      this.badgeView.destroy();
      this.badgeView = null;
    }
    if (this.drawerView) {
      this.drawerView.destroy();
      this.drawerView = null;
    }
    if (this.unsubscribeStore) {
      this.unsubscribeStore();
      this.unsubscribeStore = null;
    }
    if (this.consoleInterceptor) {
      this.consoleInterceptor.restore();
      this.consoleInterceptor = null;
    }
    if (this.networkInterceptor) {
      this.networkInterceptor.restore();
      this.networkInterceptor = null;
    }
    if (this.wsInterceptor) {
      this.wsInterceptor.restore();
      this.wsInterceptor = null;
    }
    if (this.sseInterceptor) {
      this.sseInterceptor.restore();
      this.sseInterceptor = null;
    }
    if (this.shadowHostManager) {
      this.shadowHostManager.unmount();
      this.shadowHostManager = null;
    }
    this.shadowContainer = null;
    this.isMounted = false;
  }
}
