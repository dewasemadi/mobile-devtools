import {
  BADGE_POSITIONS,
  BUILTIN_TABS,
  DEFAULT_CONFIG_DEFAULTS,
  LOG_LEVELS,
  NETWORK_THROTTLING,
  STORAGE_KEYS,
  THEME_MODES,
} from '../constants';
import { DevToolsConfig, DevToolsTabId, ThemeMode } from '../types/config';
import { LogEntry } from '../types/log';
import { NetworkRequestEntry, NetworkThrottlingProfile } from '../types/network';
import { DragPosition, getDefaultPosition } from '../utils/drag-helper';
import { isBrowser, isServer } from '../utils/env';

export type StoreListener = () => void;

export class DevToolsStore {
  private config: DevToolsConfig = {
    enabled: true,
    initialTab: BUILTIN_TABS.CONSOLE,
    enabledTabs: [
      BUILTIN_TABS.CONSOLE,
      BUILTIN_TABS.ELEMENTS,
      BUILTIN_TABS.NETWORK,
      BUILTIN_TABS.STORAGE,
      BUILTIN_TABS.SYSTEM,
    ],
    theme: {
      mode: THEME_MODES.DARK,
    },
    position: BADGE_POSITIONS.BOTTOM_RIGHT,
    autoSnapBadge: false,
    interceptors: {
      maxLogLimit: DEFAULT_CONFIG_DEFAULTS.MAX_LOG_LIMIT,
      maxNetworkLimit: DEFAULT_CONFIG_DEFAULTS.MAX_NETWORK_LIMIT,
      enableConsoleInterceptor: true,
      enableFetchInterceptor: true,
      enableXhrInterceptor: true,
    },
  };

  private isOpen = false;
  private activeTab: DevToolsTabId = BUILTIN_TABS.CONSOLE;
  private logs: LogEntry[] = [];
  private networkRequests: NetworkRequestEntry[] = [];
  private badgePosition: DragPosition = { x: 20, y: 300 };
  private themeMode: ThemeMode = THEME_MODES.DARK;
  private networkThrottling: NetworkThrottlingProfile = NETWORK_THROTTLING.ONLINE;
  private listeners: Set<StoreListener> = new Set();

  private unreadErrorCount = 0;
  private unreadWarningCount = 0;
  private unreadTotalCount = 0;

  constructor(initialConfig?: DevToolsConfig) {
    if (initialConfig) {
      this.updateConfig(initialConfig);
    }
    this.initSavedState();
  }

  private initSavedState() {
    if (isServer) return;
    try {
      const savedPos = localStorage.getItem(STORAGE_KEYS.POSITION);
      if (savedPos) {
        const parsed = JSON.parse(savedPos);
        if (typeof parsed.x === 'number' && typeof parsed.y === 'number') {
          this.badgePosition = parsed;
        }
      }
      const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME) as ThemeMode;
      if (
        savedTheme === THEME_MODES.DARK ||
        savedTheme === THEME_MODES.LIGHT ||
        savedTheme === THEME_MODES.AUTO
      ) {
        this.themeMode = savedTheme;
      } else if (this.config.theme?.mode) {
        this.themeMode = this.config.theme.mode;
      }
    } catch {
      // fallback
    }
    if (!localStorage.getItem(STORAGE_KEYS.POSITION)) {
      this.badgePosition = getDefaultPosition(this.config.position);
    }
  }

  public updateConfig(newConfig: Partial<DevToolsConfig>) {
    this.config = {
      ...this.config,
      ...newConfig,
      interceptors: {
        ...this.config.interceptors,
        ...newConfig.interceptors,
      },
      privacy: {
        ...this.config.privacy,
        ...newConfig.privacy,
      },
      theme: {
        ...this.config.theme,
        ...newConfig.theme,
      },
    };
    if (newConfig.theme?.mode) {
      this.themeMode = newConfig.theme.mode;
    }
    if (newConfig.position) {
      this.badgePosition = getDefaultPosition(newConfig.position);
    }
    if (newConfig.initialTab) {
      this.activeTab = newConfig.initialTab;
    }
    if (newConfig.defaultOpen !== undefined) {
      this.isOpen = newConfig.defaultOpen;
    }
    this.notify();
  }

  public getMaskKeys(): string[] {
    return this.config.privacy?.mask || [];
  }

  public getConfig(): DevToolsConfig {
    return this.config;
  }

  public subscribe(listener: StoreListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((listener) => listener());
  }

  // --- Theme Mode ---
  public getThemeMode(): ThemeMode {
    return this.themeMode;
  }

  public getEffectiveThemeMode(): (typeof THEME_MODES)[keyof typeof THEME_MODES] {
    const mode = this.getThemeMode();
    if (mode === THEME_MODES.AUTO) {
      if (isBrowser && window.matchMedia('(prefers-color-scheme: light)').matches) {
        return THEME_MODES.LIGHT;
      }
      return THEME_MODES.DARK;
    }
    return mode;
  }

  public setThemeMode(mode: ThemeMode) {
    this.themeMode = mode;
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, mode);
    } catch {
      // Ignore
    }
    this.notify();
  }

  public toggleThemeMode() {
    const nextMode: ThemeMode =
      this.themeMode === THEME_MODES.DARK ? THEME_MODES.LIGHT : THEME_MODES.DARK;
    this.setThemeMode(nextMode);
  }

  // --- UI Controls ---
  public getIsOpen(): boolean {
    return this.isOpen;
  }

  public toggleOpen() {
    this.setIsOpen(!this.isOpen);
  }

  public setIsOpen(open: boolean) {
    if (this.isOpen !== open) {
      this.isOpen = open;
      if (!open) {
        this.resetUnreadCounts();
      }
      this.notify();
    }
  }

  public getActiveTab(): DevToolsTabId {
    return this.activeTab;
  }

  public setActiveTab(tab: DevToolsTabId) {
    this.activeTab = tab;
    this.notify();
  }

  public getBadgePosition(): DragPosition {
    return this.badgePosition;
  }

  public setBadgePosition(pos: DragPosition) {
    this.badgePosition = pos;
    try {
      localStorage.setItem(STORAGE_KEYS.POSITION, JSON.stringify(pos));
    } catch {
      // Ignore storage errors
    }
    this.notify();
  }

  // --- Logs ---
  public getLogs(): LogEntry[] {
    return this.logs;
  }

  public addLog(entry: LogEntry) {
    const max = this.config.interceptors?.maxLogLimit || 200;

    const last = this.logs[this.logs.length - 1];
    if (
      last &&
      last.level === entry.level &&
      JSON.stringify(last.args) === JSON.stringify(entry.args)
    ) {
      last.count += 1;
      last.timestamp = entry.timestamp;
    } else {
      this.logs.push(entry);
      if (this.logs.length > max) {
        this.logs.shift();
      }
    }

    if (!this.isOpen) {
      this.unreadTotalCount++;
      if (entry.level === LOG_LEVELS.ERROR) this.unreadErrorCount++;
      if (entry.level === LOG_LEVELS.WARN) this.unreadWarningCount++;
    }

    this.notify();
  }

  public clearLogs() {
    this.logs = [];
    this.notify();
  }

  // --- Network ---
  public getNetworkRequests(): NetworkRequestEntry[] {
    return this.networkRequests;
  }

  public addNetworkRequest(req: NetworkRequestEntry) {
    const max = this.config.interceptors?.maxNetworkLimit || 100;

    if (this.config.interceptors?.ignoreNetworkUrls) {
      const isIgnored = this.config.interceptors.ignoreNetworkUrls.some((pattern) => {
        if (typeof pattern === 'string') return req.url.includes(pattern);
        if (pattern instanceof RegExp) return pattern.test(req.url);
        return false;
      });
      if (isIgnored) return;
    }

    this.networkRequests.unshift(req);
    if (this.networkRequests.length > max) {
      this.networkRequests.pop();
    }

    if (!this.isOpen) {
      this.unreadTotalCount++;
      if (req.status >= 400 || req.errorState === 'error') {
        this.unreadErrorCount++;
      }
    }

    this.notify();
  }

  public updateNetworkRequest(id: string, updates: Partial<NetworkRequestEntry>) {
    const index = this.networkRequests.findIndex((r) => r.id === id);
    if (index !== -1 && this.networkRequests[index]) {
      const existing = this.networkRequests[index];
      const updated: NetworkRequestEntry = {
        ...existing,
        ...updates,
      };
      this.networkRequests[index] = updated;

      if (!this.isOpen && updates.status && updates.status >= 400) {
        this.unreadErrorCount++;
      }

      this.notify();
    }
  }

  public addNetworkFrame(id: string, frame: import('../types/network').NetworkFrameMessage) {
    const index = this.networkRequests.findIndex((r) => r.id === id);
    if (index !== -1 && this.networkRequests[index]) {
      const existing = this.networkRequests[index];
      const frames = [...(existing.frames || []), frame];
      if (frames.length > 200) frames.shift();
      this.networkRequests[index] = {
        ...existing,
        frames,
      };
      this.notify();
    }
  }

  public clearNetworkRequests() {
    this.networkRequests = [];
    this.notify();
  }

  // --- Network Throttling ---
  public getNetworkThrottling(): NetworkThrottlingProfile {
    return this.networkThrottling;
  }

  public setNetworkThrottling(profile: NetworkThrottlingProfile) {
    if (this.networkThrottling !== profile) {
      this.networkThrottling = profile;
      this.notify();
    }
  }

  // --- Unread Indicators ---
  public getUnreadCounts() {
    return {
      errors: this.unreadErrorCount,
      warnings: this.unreadWarningCount,
      total: this.unreadTotalCount,
    };
  }

  public resetUnreadCounts() {
    this.unreadErrorCount = 0;
    this.unreadWarningCount = 0;
    this.unreadTotalCount = 0;
    this.notify();
  }
}
