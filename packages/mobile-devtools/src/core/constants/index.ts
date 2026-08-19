export const BUILTIN_TABS = {
  CONSOLE: 'console',
  ELEMENTS: 'elements',
  NETWORK: 'network',
  STORAGE: 'storage',
  SYSTEM: 'system',
} as const;

export type BuiltinTabId = (typeof BUILTIN_TABS)[keyof typeof BUILTIN_TABS];

export const ELEMENTS_SUB_TABS = {
  TREE: 'tree',
  STYLES: 'styles',
  ATTRIBUTES: 'attributes',
} as const;

export type ElementsSubTab = (typeof ELEMENTS_SUB_TABS)[keyof typeof ELEMENTS_SUB_TABS];

export const LOG_LEVELS = {
  LOG: 'log',
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error',
  DEBUG: 'debug',
} as const;

export const NETWORK_TYPES = {
  FETCH: 'fetch',
  XHR: 'xhr',
  WEBSOCKET: 'websocket',
  EVENTSOURCE: 'eventsource',
} as const;

export type NetworkRequestType = (typeof NETWORK_TYPES)[keyof typeof NETWORK_TYPES];

export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  PATCH: 'PATCH',
  HEAD: 'HEAD',
  OPTIONS: 'OPTIONS',
  WS: 'WS',
  SSE: 'SSE',
} as const;

export type HttpMethod = (typeof HTTP_METHODS)[keyof typeof HTTP_METHODS];

export const NETWORK_DETAIL_TABS = {
  RESPONSE: 'response',
  PAYLOAD: 'payload',
  HEADERS: 'headers',
  FRAMES: 'frames',
} as const;

export type NetworkDetailTab = (typeof NETWORK_DETAIL_TABS)[keyof typeof NETWORK_DETAIL_TABS];

export const NETWORK_VIEW_MODES = {
  PARSED: 'parsed',
  RAW: 'raw',
} as const;

export type NetworkViewMode = (typeof NETWORK_VIEW_MODES)[keyof typeof NETWORK_VIEW_MODES];

export const NETWORK_FRAME_TYPES = {
  SENT: 'sent',
  RECEIVED: 'received',
} as const;

export type NetworkFrameType = (typeof NETWORK_FRAME_TYPES)[keyof typeof NETWORK_FRAME_TYPES];

export const NETWORK_STATUS = {
  PENDING: 'pending',
  SUCCESS: 'success',
  ERROR: 'error',
} as const;

export type NetworkStatus = (typeof NETWORK_STATUS)[keyof typeof NETWORK_STATUS];

export const NETWORK_THROTTLING = {
  ONLINE: 'online',
  FAST_3G: 'fast-3g',
  SLOW_3G: 'slow-3g',
  OFFLINE: 'offline',
} as const;

export type NetworkThrottlingProfile = (typeof NETWORK_THROTTLING)[keyof typeof NETWORK_THROTTLING];

export const STORAGE_TYPES = {
  LOCAL_STORAGE: 'localStorage',
  SESSION_STORAGE: 'sessionStorage',
  COOKIE: 'cookie',
  INDEXED_DB: 'indexedDB',
} as const;

export type StorageType = (typeof STORAGE_TYPES)[keyof typeof STORAGE_TYPES];

export const FILTER_OPTIONS = {
  ALL: 'all',
  ALL_UPPER: 'ALL',
} as const;

export const BADGE_POSITIONS = {
  TOP_LEFT: 'top-left',
  TOP_RIGHT: 'top-right',
  BOTTOM_LEFT: 'bottom-left',
  BOTTOM_RIGHT: 'bottom-right',
  LEFT: 'left',
  RIGHT: 'right',
  TOP: 'top',
  BOTTOM: 'bottom',
} as const;

export type BadgePositionPreset = (typeof BADGE_POSITIONS)[keyof typeof BADGE_POSITIONS];

export const STORAGE_KEYS = {
  POSITION: '__mobile_devtools_position__',
  THEME: '__mobile_devtools_theme__',
} as const;

export const THEME_MODES = {
  DARK: 'dark',
  LIGHT: 'light',
  AUTO: 'auto',
} as const;

export type ThemeMode = (typeof THEME_MODES)[keyof typeof THEME_MODES];

export const DEVTOOLS_CLASSNAMES = {
  CONTAINER: 'mobile-devtools-container',
  PICKER_OVERLAY: 'mobile-devtools-picker-overlay',
  DRAWER_OVERLAY: 'devtools-drawer-overlay',
  DRAWER: 'devtools-drawer',
  HANDLE_AREA: 'devtools-handle-area',
  HANDLE_BAR: 'devtools-handle-bar',
  HEADER: 'devtools-header',
  BADGE: 'devtools-badge',
} as const;

export const SCREEN_ORIENTATIONS = {
  PORTRAIT: 'portrait',
  LANDSCAPE: 'landscape',
} as const;

export type ScreenOrientation = (typeof SCREEN_ORIENTATIONS)[keyof typeof SCREEN_ORIENTATIONS];

export const MASK_PLACEHOLDER = '****** (Masked)';

export const DEFAULT_CONFIG_DEFAULTS = {
  TITLE: 'Mobile DevTools',
  MAX_LOG_LIMIT: 200,
  MAX_NETWORK_LIMIT: 100,
  SHAKE_THRESHOLD: 12,
  SHAKE_COOLDOWN: 800,
} as const;

export const NETWORK_SORT_OPTIONS = {
  TIME_DESC: 'time-desc',
  TIME_ASC: 'time-asc',
  DURATION_DESC: 'duration-desc',
  DURATION_ASC: 'duration-asc',
  STATUS_2XX: 'status-2xx',
  STATUS_3XX: 'status-3xx',
  STATUS_4XX: 'status-4xx',
  STATUS_5XX: 'status-5xx',
  STATUS_1XX: 'status-1xx',
  STATUS_ERR: 'status-err',
} as const;

export type NetworkSortOption = (typeof NETWORK_SORT_OPTIONS)[keyof typeof NETWORK_SORT_OPTIONS];

export const CONSOLE_SORT_OPTIONS = {
  TIME_DESC: 'time-desc',
  TIME_ASC: 'time-asc',
  LEVEL_DESC: 'level-desc',
  COUNT_DESC: 'count-desc',
} as const;

export type ConsoleSortOption = (typeof CONSOLE_SORT_OPTIONS)[keyof typeof CONSOLE_SORT_OPTIONS];
