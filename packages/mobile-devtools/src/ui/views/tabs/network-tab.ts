import {
  copyToClipboard,
  DevToolsStore,
  FILTER_OPTIONS,
  formatCount,
  formatDuration,
  formatTimestamp,
  generateCurlCommand,
  generateFullRequestSummary,
  HTTP_METHODS,
  NETWORK_DETAIL_TABS,
  NETWORK_FRAME_TYPES,
  NETWORK_SORT_OPTIONS,
  NETWORK_THROTTLING,
  NETWORK_TYPES,
  NETWORK_VIEW_MODES,
  NetworkDetailTab,
  NetworkRequestEntry,
  NetworkSortOption,
  NetworkViewMode,
} from '../../../core';
import { renderJsonTree } from '../../components/json-tree';
import { ARROW_DOWN_ICON, ARROW_UP_ICON, BACK_ICON, CHECK_ICON, TRASH_ICON } from '../../icons';
import { highlightJsonSyntax } from '../../utils/json-highlighter';
import { setupScrollLockGuard } from '../../utils/scroll-lock';
import { createSearchInput } from '../../components/search-input';

export class NetworkTabView {
  private store: DevToolsStore;
  private container: HTMLElement;
  private listScrollContainer: HTMLElement | null = null;
  private clearBtn: HTMLButtonElement | null = null;
  private searchValue = '';
  private methodFilter: string = FILTER_OPTIONS.ALL_UPPER;
  private sortOption: NetworkSortOption = NETWORK_SORT_OPTIONS.TIME_DESC;
  private selectedReq: NetworkRequestEntry | null = null;
  private activeDetailTab: NetworkDetailTab = NETWORK_DETAIL_TABS.RESPONSE;
  private responseViewMode: NetworkViewMode = NETWORK_VIEW_MODES.PARSED;
  private payloadViewMode: NetworkViewMode = NETWORK_VIEW_MODES.PARSED;
  private detailScrollTop = 0;
  private detailScrollLeft = 0;
  private isDetailScrolledToBottom = true;
  private mainListScrollTop = 0;
  private subTabsScrollLeft = 0;

  constructor(store: DevToolsStore) {
    this.store = store;
    this.container = document.createElement('div');
    this.container.className = 'devtools-tab-content';
  }

  public render(): HTMLElement {
    this.container.innerHTML = '';

    if (this.selectedReq) {
      const freshReq =
        this.store.getNetworkRequests().find((r) => r.id === this.selectedReq!.id) ||
        this.selectedReq;
      this.selectedReq = freshReq;
      return this.renderDetailModal(freshReq);
    }

    // Toolbar (2-Row Layout: Row 1 = Search + Clear, Row 2 = Method, Sort, Throttling)
    const toolbar = document.createElement('div');
    toolbar.className = 'devtools-toolbar';
    toolbar.style.display = 'flex';
    toolbar.style.flexDirection = 'column';
    toolbar.style.gap = '6px';

    const row1 = document.createElement('div');
    row1.className = 'devtools-toolbar-row';

    const { container: searchWrapper } = createSearchInput({
      placeholder: 'Filter URL or Status...',
      value: this.searchValue,
      ariaLabel: 'Filter network requests by URL or Status',
      onInput: (val) => {
        this.searchValue = val;
        this.updateList();
      },
    });

    this.clearBtn = document.createElement('button');
    this.clearBtn.className = 'devtools-btn devtools-btn-danger devtools-btn-icon-only';
    this.clearBtn.title = 'Clear Network Requests';
    this.clearBtn.setAttribute('aria-label', 'Clear Network Requests');
    this.clearBtn.innerHTML = TRASH_ICON;
    this.clearBtn.addEventListener('click', () => {
      if (
        window.confirm(
          'Are you sure you want to clear all recorded network requests? This action cannot be undone.'
        )
      ) {
        this.store.clearNetworkRequests();
        this.selectedReq = null;
        this.render();
      }
    });

    row1.appendChild(searchWrapper);
    row1.appendChild(this.clearBtn);

    const row2 = document.createElement('div');
    row2.className = 'devtools-toolbar-row';
    row2.style.overflowX = 'auto';
    setupScrollLockGuard(row2);

    const methodSelect = document.createElement('select');
    methodSelect.className = 'devtools-select';
    methodSelect.style.flex = '1';
    methodSelect.style.minWidth = '70px';
    methodSelect.innerHTML = `
      <option value="ALL">ALL</option>
      <option value="${HTTP_METHODS.GET}">GET</option>
      <option value="${HTTP_METHODS.POST}">POST</option>
      <option value="${HTTP_METHODS.PUT}">PUT</option>
      <option value="${HTTP_METHODS.DELETE}">DELETE</option>
      <option value="WS">WS</option>
      <option value="SSE">SSE</option>
    `;
    methodSelect.value = this.methodFilter;
    methodSelect.addEventListener('change', (e) => {
      this.methodFilter = (e.target as HTMLSelectElement).value;
      this.updateList();
    });

    const sortSelect = document.createElement('select');
    sortSelect.className = 'devtools-select';
    sortSelect.style.flex = '1';
    sortSelect.style.minWidth = '85px';
    sortSelect.innerHTML = `
      <option value="${NETWORK_SORT_OPTIONS.TIME_DESC}">Newest</option>
      <option value="${NETWORK_SORT_OPTIONS.TIME_ASC}">Oldest</option>
      <option value="${NETWORK_SORT_OPTIONS.DURATION_DESC}">Slowest</option>
      <option value="${NETWORK_SORT_OPTIONS.DURATION_ASC}">Fastest</option>
      <option value="${NETWORK_SORT_OPTIONS.STATUS_2XX}">2xx Success</option>
      <option value="${NETWORK_SORT_OPTIONS.STATUS_3XX}">3xx Redirect</option>
      <option value="${NETWORK_SORT_OPTIONS.STATUS_4XX}">4xx Client Error</option>
      <option value="${NETWORK_SORT_OPTIONS.STATUS_5XX}">5xx Server Error</option>
      <option value="${NETWORK_SORT_OPTIONS.STATUS_1XX}">1xx Info</option>
      <option value="${NETWORK_SORT_OPTIONS.STATUS_ERR}">Network Error</option>
    `;
    sortSelect.value = this.sortOption;
    sortSelect.addEventListener('change', (e) => {
      this.sortOption = (e.target as HTMLSelectElement).value as NetworkSortOption;
      this.updateList();
    });

    const throttlingSelect = document.createElement('select');
    throttlingSelect.className = 'devtools-select';
    throttlingSelect.style.flex = '1';
    throttlingSelect.style.minWidth = '105px';
    throttlingSelect.title = 'Simulate Network Speed & Offline Mode';
    throttlingSelect.innerHTML = `
      <option value="${NETWORK_THROTTLING.ONLINE}">🌐 Online</option>
      <option value="${NETWORK_THROTTLING.FAST_3G}">⚡ Fast 3G</option>
      <option value="${NETWORK_THROTTLING.SLOW_3G}">🐢 Slow 3G</option>
      <option value="${NETWORK_THROTTLING.OFFLINE}">🚫 Offline</option>
    `;
    throttlingSelect.value = this.store.getNetworkThrottling();
    throttlingSelect.addEventListener('change', (e) => {
      const val = (e.target as HTMLSelectElement).value as any;
      this.store.setNetworkThrottling(val);
    });

    row2.appendChild(methodSelect);
    row2.appendChild(sortSelect);
    row2.appendChild(throttlingSelect);

    toolbar.appendChild(row1);
    toolbar.appendChild(row2);

    // Scrollable List Container
    this.listScrollContainer = document.createElement('div');
    this.listScrollContainer.className = 'devtools-list-scroll';
    setupScrollLockGuard(this.listScrollContainer);
    this.listScrollContainer.addEventListener('scroll', () => {
      if (this.listScrollContainer) {
        this.mainListScrollTop = this.listScrollContainer.scrollTop;
      }
    });

    this.container.appendChild(toolbar);
    this.container.appendChild(this.listScrollContainer);

    this.updateList();
    return this.container;
  }

  public updateList() {
    if (!this.listScrollContainer) return;
    const prevScrollTop = this.mainListScrollTop;
    this.listScrollContainer.innerHTML = '';

    const requests = this.store.getNetworkRequests();
    if (this.clearBtn) {
      this.clearBtn.disabled = requests.length === 0;
    }
    const filtered = requests.filter((req) => {
      const matchesSearch =
        !this.searchValue.trim() ||
        req.url.toLowerCase().includes(this.searchValue.toLowerCase()) ||
        req.method.toLowerCase().includes(this.searchValue.toLowerCase()) ||
        String(req.status).includes(this.searchValue);

      const matchesMethod =
        this.methodFilter === FILTER_OPTIONS.ALL_UPPER ||
        req.method.toUpperCase() === this.methodFilter.toUpperCase();

      const matchesStatus = (() => {
        if (this.sortOption === NETWORK_SORT_OPTIONS.STATUS_2XX)
          return req.status >= 200 && req.status < 300;
        if (this.sortOption === NETWORK_SORT_OPTIONS.STATUS_3XX)
          return req.status >= 300 && req.status < 400;
        if (this.sortOption === NETWORK_SORT_OPTIONS.STATUS_4XX)
          return req.status >= 400 && req.status < 500;
        if (this.sortOption === NETWORK_SORT_OPTIONS.STATUS_5XX)
          return req.status >= 500 && req.status < 600;
        if (this.sortOption === NETWORK_SORT_OPTIONS.STATUS_1XX)
          return req.status >= 100 && req.status < 200;
        if (this.sortOption === NETWORK_SORT_OPTIONS.STATUS_ERR)
          return req.status === 0 || req.errorState === 'error';
        return true;
      })();

      return matchesSearch && matchesMethod && matchesStatus;
    });

    const sorted = [...filtered].sort((a, b) => {
      if (this.sortOption === NETWORK_SORT_OPTIONS.TIME_ASC) {
        return a.startTime - b.startTime;
      }
      if (this.sortOption === NETWORK_SORT_OPTIONS.DURATION_DESC) {
        const durA = (a.endTime || Date.now()) - a.startTime;
        const durB = (b.endTime || Date.now()) - b.startTime;
        return durB - durA;
      }
      if (this.sortOption === NETWORK_SORT_OPTIONS.DURATION_ASC) {
        const durA = (a.endTime || Date.now()) - a.startTime;
        const durB = (b.endTime || Date.now()) - b.startTime;
        return durA - durB;
      }
      return b.startTime - a.startTime;
    });

    if (sorted.length === 0) {
      const empty = document.createElement('div');
      empty.style.textAlign = 'center';
      empty.style.padding = '32px';
      empty.style.color = 'var(--dev-text-muted)';
      empty.style.fontSize = '12px';
      empty.textContent = 'No network requests recorded yet.';
      this.listScrollContainer.appendChild(empty);
      return;
    }

    sorted.forEach((req) => {
      const isError = req.status >= 400 || req.errorState === 'error';
      const isPending = req.status === 0 && !req.errorState;

      const row = document.createElement('div');
      row.className = 'devtools-network-row';
      row.addEventListener('click', () => {
        this.selectedReq = req;
        this.activeDetailTab = 'response';
        this.detailScrollTop = 0;
        this.isDetailScrolledToBottom = true;
        this.render();
      });

      const leftGroup = document.createElement('div');
      leftGroup.style.display = 'flex';
      leftGroup.style.alignItems = 'center';
      leftGroup.style.gap = '8px';
      leftGroup.style.overflow = 'hidden';
      leftGroup.style.flex = '1';

      const methodPill = document.createElement('span');
      methodPill.className = `devtools-method-pill ${req.method}`;
      methodPill.textContent = req.method;

      const urlInfo = document.createElement('div');
      urlInfo.style.overflow = 'hidden';

      const title = document.createElement('div');
      title.className = 'devtools-network-title';
      title.textContent = req.url.split('/').pop() || req.url;

      const fullUrl = document.createElement('div');
      fullUrl.className = 'devtools-network-url';
      fullUrl.textContent = req.url;

      urlInfo.appendChild(title);
      urlInfo.appendChild(fullUrl);
      leftGroup.appendChild(methodPill);
      leftGroup.appendChild(urlInfo);

      const rightGroup = document.createElement('div');
      rightGroup.style.display = 'flex';
      rightGroup.style.alignItems = 'center';
      rightGroup.style.gap = '10px';
      rightGroup.style.flexShrink = '0';

      let statusClass = 'success';
      if (isError) {
        statusClass = 'error';
      } else if (isPending) {
        statusClass = 'pending';
      }

      const statusPill = document.createElement('span');
      statusPill.className = `devtools-status-pill ${statusClass}`;
      statusPill.textContent = isPending ? 'Pending' : String(req.status || 'Failed');

      const duration = document.createElement('span');
      duration.style.fontSize = '11px';
      duration.style.color = 'var(--dev-text-muted)';
      duration.style.fontFamily = 'var(--dev-font-mono)';
      duration.textContent = formatDuration(req.duration);

      rightGroup.appendChild(statusPill);
      rightGroup.appendChild(duration);

      row.appendChild(leftGroup);
      row.appendChild(rightGroup);
      this.listScrollContainer!.appendChild(row);
    });

    requestAnimationFrame(() => {
      if (this.listScrollContainer) {
        this.listScrollContainer.scrollTop = prevScrollTop;
      }
    });
  }

  private renderDetailModal(req: NetworkRequestEntry): HTMLElement {
    this.container.innerHTML = '';

    const modal = document.createElement('div');
    modal.className = 'devtools-detail-modal';

    // Modal Header Bar
    const header = document.createElement('div');
    header.style.padding = '10px 14px';
    header.style.borderBottom = '1px solid var(--dev-border)';
    header.style.display = 'flex';
    header.style.alignItems = 'center';
    header.style.justifyContent = 'space-between';
    header.style.background = 'var(--dev-bg)';

    const titleGroup = document.createElement('div');
    titleGroup.style.display = 'flex';
    titleGroup.style.alignItems = 'center';
    titleGroup.style.gap = '8px';
    titleGroup.style.overflow = 'hidden';

    const backBtn = document.createElement('button');
    backBtn.className = 'devtools-btn sm devtools-btn-icon-only';
    backBtn.style.width = '32px';
    backBtn.style.height = '32px';
    backBtn.style.minWidth = '32px';
    backBtn.style.minHeight = '32px';
    backBtn.style.padding = '0';
    backBtn.style.display = 'inline-flex';
    backBtn.style.alignItems = 'center';
    backBtn.style.justifyContent = 'center';
    backBtn.style.flexShrink = '0';
    backBtn.title = 'Back to request list';
    backBtn.innerHTML = BACK_ICON;
    backBtn.addEventListener('click', () => {
      this.selectedReq = null;
      this.render();
    });

    const methodPill = document.createElement('span');
    methodPill.className = `devtools-method-pill ${req.method}`;
    methodPill.textContent = req.method;

    const urlText = document.createElement('span');
    urlText.style.fontSize = '13px';
    urlText.style.fontWeight = '700';
    urlText.style.overflow = 'hidden';
    urlText.style.textOverflow = 'ellipsis';
    urlText.style.color = 'var(--dev-text-bright)';
    urlText.textContent = req.url.split('/').pop() || req.url;

    titleGroup.appendChild(backBtn);
    titleGroup.appendChild(methodPill);
    titleGroup.appendChild(urlText);

    const headerActionGroup = document.createElement('div');
    headerActionGroup.style.display = 'flex';
    headerActionGroup.style.alignItems = 'center';
    headerActionGroup.style.gap = '6px';

    const copyCurlBtn = document.createElement('button');
    copyCurlBtn.className = 'devtools-btn sm';
    copyCurlBtn.textContent = 'cURL';
    copyCurlBtn.addEventListener('click', async () => {
      const curl = generateCurlCommand(req);
      const ok = await copyToClipboard(curl);
      copyCurlBtn.innerHTML = ok
        ? `<span style="display:inline-flex;align-items:center;gap:4px">${CHECK_ICON} Copied</span>`
        : 'Failed';
      setTimeout(() => {
        copyCurlBtn.textContent = 'cURL';
      }, 2000);
    });

    const copyFullReqBtn = document.createElement('button');
    copyFullReqBtn.className = 'devtools-btn sm';
    copyFullReqBtn.textContent = 'Summary';
    copyFullReqBtn.title = 'Copy full HTTP request details & response summary';
    copyFullReqBtn.addEventListener('click', async () => {
      const text = generateFullRequestSummary(req);
      const ok = await copyToClipboard(text);
      copyFullReqBtn.innerHTML = ok
        ? `<span style="display:inline-flex;align-items:center;gap:4px">${CHECK_ICON} Copied</span>`
        : 'Failed';
      setTimeout(() => {
        copyFullReqBtn.textContent = 'Summary';
      }, 2000);
    });

    headerActionGroup.appendChild(copyCurlBtn);
    headerActionGroup.appendChild(copyFullReqBtn);

    header.appendChild(titleGroup);
    header.appendChild(headerActionGroup);

    // Meta Info Subheader
    const metaBar = document.createElement('div');
    metaBar.style.padding = '8px 14px';
    metaBar.style.background = 'var(--dev-card-bg)';
    metaBar.style.fontSize = '11px';
    metaBar.style.borderBottom = '1px solid var(--dev-border)';
    metaBar.style.fontFamily = 'var(--dev-font-mono)';
    metaBar.innerHTML = `
      <div><strong style="color:var(--dev-text-muted)">URL:</strong> <span style="color:var(--dev-text-bright);word-break:break-all">${req.url}</span></div>
      <div style="margin-top:4px;">
        <strong style="color:var(--dev-text-muted)">Status:</strong> <span style="color:var(--dev-text-bright)">${req.status} (${req.statusText})</span> | 
        <strong style="color:var(--dev-text-muted)">Duration:</strong> <span style="color:var(--dev-text-bright)">${formatDuration(req.duration)}</span> | 
        <strong style="color:var(--dev-text-muted)">Time:</strong> <span style="color:var(--dev-text-bright)">${formatTimestamp(req.startTime)}</span>
      </div>
    `;

    // Tabs Bar (Response / Payload / Headers) + Parsed/Raw inline
    const isWsOrSse =
      req.type === NETWORK_TYPES.WEBSOCKET ||
      req.type === NETWORK_TYPES.EVENTSOURCE ||
      req.method === HTTP_METHODS.WS ||
      req.method === HTTP_METHODS.SSE;

    if (!isWsOrSse && this.activeDetailTab === NETWORK_DETAIL_TABS.FRAMES) {
      this.activeDetailTab = NETWORK_DETAIL_TABS.RESPONSE;
    }

    const prevSubTabsScrollLeft = this.subTabsScrollLeft;
    const tabsBar = document.createElement('div');
    tabsBar.className = 'devtools-tabs-bar';
    tabsBar.style.display = 'flex';
    tabsBar.style.alignItems = 'center';
    tabsBar.style.justifyContent = 'flex-start';
    tabsBar.style.gap = '6px';
    setupScrollLockGuard(tabsBar);

    tabsBar.addEventListener('scroll', () => {
      this.subTabsScrollLeft = tabsBar.scrollLeft;
    });

    const respBtn = document.createElement('button');
    respBtn.className = `devtools-tab-btn ${this.activeDetailTab === NETWORK_DETAIL_TABS.RESPONSE ? 'active' : ''}`;
    respBtn.textContent = 'Response';
    respBtn.addEventListener('click', () => {
      this.activeDetailTab = NETWORK_DETAIL_TABS.RESPONSE;
      this.render();
    });

    const payloadBtn = document.createElement('button');
    payloadBtn.className = `devtools-tab-btn ${this.activeDetailTab === NETWORK_DETAIL_TABS.PAYLOAD ? 'active' : ''}`;
    payloadBtn.textContent = 'Payload';
    payloadBtn.addEventListener('click', () => {
      this.activeDetailTab = NETWORK_DETAIL_TABS.PAYLOAD;
      this.render();
    });

    const headersBtn = document.createElement('button');
    headersBtn.className = `devtools-tab-btn ${this.activeDetailTab === NETWORK_DETAIL_TABS.HEADERS ? 'active' : ''}`;
    headersBtn.textContent = 'Headers';
    headersBtn.addEventListener('click', () => {
      this.activeDetailTab = NETWORK_DETAIL_TABS.HEADERS;
      this.render();
    });

    tabsBar.appendChild(respBtn);
    tabsBar.appendChild(payloadBtn);
    tabsBar.appendChild(headersBtn);

    if (isWsOrSse) {
      const framesBtn = document.createElement('button');
      framesBtn.className = `devtools-tab-btn ${this.activeDetailTab === NETWORK_DETAIL_TABS.FRAMES ? 'active' : ''}`;
      framesBtn.textContent = `Frames (${formatCount(req.frames?.length || 0)})`;
      framesBtn.addEventListener('click', () => {
        this.activeDetailTab = NETWORK_DETAIL_TABS.FRAMES;
        this.render();
      });
      tabsBar.appendChild(framesBtn);
    }

    // Left-aligned Parsed / Raw segmented control & Summary button inline
    if (
      this.activeDetailTab === NETWORK_DETAIL_TABS.RESPONSE ||
      this.activeDetailTab === NETWORK_DETAIL_TABS.PAYLOAD
    ) {
      const currentMode =
        this.activeDetailTab === NETWORK_DETAIL_TABS.RESPONSE
          ? this.responseViewMode
          : this.payloadViewMode;

      const segmentedControl = document.createElement('div');
      segmentedControl.className = 'devtools-segmented-control';
      segmentedControl.style.marginLeft = 'auto';

      const parsedBtn = document.createElement('button');
      parsedBtn.className = `devtools-segmented-btn ${currentMode === NETWORK_VIEW_MODES.PARSED ? 'active' : ''}`;
      parsedBtn.textContent = 'Parsed';
      parsedBtn.addEventListener('click', () => {
        if (this.activeDetailTab === NETWORK_DETAIL_TABS.RESPONSE)
          this.responseViewMode = NETWORK_VIEW_MODES.PARSED;
        else this.payloadViewMode = NETWORK_VIEW_MODES.PARSED;
        this.render();
      });

      const rawBtn = document.createElement('button');
      rawBtn.className = `devtools-segmented-btn ${currentMode === NETWORK_VIEW_MODES.RAW ? 'active' : ''}`;
      rawBtn.textContent = 'Raw';
      rawBtn.addEventListener('click', () => {
        if (this.activeDetailTab === NETWORK_DETAIL_TABS.RESPONSE)
          this.responseViewMode = NETWORK_VIEW_MODES.RAW;
        else this.payloadViewMode = NETWORK_VIEW_MODES.RAW;
        this.render();
      });

      segmentedControl.appendChild(parsedBtn);
      segmentedControl.appendChild(rawBtn);

      tabsBar.appendChild(segmentedControl);
    }

    // Detail Body View Container
    const bodyContainer = document.createElement('div');
    bodyContainer.style.flex = '1';
    bodyContainer.style.display = 'flex';
    bodyContainer.style.flexDirection = 'column';
    bodyContainer.style.overflow = 'hidden';

    // Body Content Scroll
    const bodyScroll = document.createElement('div');
    bodyScroll.className = 'devtools-list-scroll';
    bodyScroll.style.padding = '14px';
    setupScrollLockGuard(bodyScroll);

    bodyScroll.addEventListener('scroll', () => {
      const isAtBottom =
        bodyScroll.scrollHeight - bodyScroll.scrollTop - bodyScroll.clientHeight < 40;
      this.isDetailScrolledToBottom = isAtBottom;
      this.detailScrollTop = bodyScroll.scrollTop;
    });

    if (this.activeDetailTab === NETWORK_DETAIL_TABS.RESPONSE) {
      if (!req.responseBody) {
        bodyScroll.innerHTML =
          '<div style="color:var(--dev-text-muted)">No response body available.</div>';
      } else if (this.responseViewMode === NETWORK_VIEW_MODES.PARSED) {
        bodyScroll.appendChild(renderJsonTree(req.responseBody));
      } else {
        const rawPre = document.createElement('pre');
        rawPre.style.margin = '0';
        rawPre.style.fontFamily = 'var(--dev-font-mono)';
        rawPre.style.fontSize = '12px';
        rawPre.style.color = 'var(--dev-text-bright)';
        rawPre.style.whiteSpace = 'pre-wrap';
        rawPre.style.wordBreak = 'break-all';
        rawPre.innerHTML = highlightJsonSyntax(req.responseBody);
        bodyScroll.appendChild(rawPre);
      }
    } else if (this.activeDetailTab === NETWORK_DETAIL_TABS.PAYLOAD) {
      if (!req.requestBody) {
        bodyScroll.innerHTML =
          '<div style="color:var(--dev-text-muted)">No request body payload.</div>';
      } else if (this.payloadViewMode === NETWORK_VIEW_MODES.PARSED) {
        bodyScroll.appendChild(renderJsonTree(req.requestBody));
      } else {
        const rawPre = document.createElement('pre');
        rawPre.style.margin = '0';
        rawPre.style.fontFamily = 'var(--dev-font-mono)';
        rawPre.style.fontSize = '12px';
        rawPre.style.color = 'var(--dev-text-bright)';
        rawPre.style.whiteSpace = 'pre-wrap';
        rawPre.style.wordBreak = 'break-all';
        rawPre.innerHTML = highlightJsonSyntax(req.requestBody);
        bodyScroll.appendChild(rawPre);
      }
    } else if (this.activeDetailTab === NETWORK_DETAIL_TABS.HEADERS) {
      const headersWrap = document.createElement('div');

      const reqH4 = document.createElement('h4');
      reqH4.style.color = 'var(--dev-text-bright)';
      reqH4.style.marginBottom = '8px';
      reqH4.style.fontSize = '13px';
      reqH4.textContent = 'Request Headers';

      const reqTable = document.createElement('table');
      reqTable.className = 'devtools-table';
      reqTable.style.marginBottom = '20px';
      reqTable.style.tableLayout = 'fixed';
      reqTable.style.width = '100%';

      const reqTbody = document.createElement('tbody');
      Object.entries(req.requestHeaders || {}).forEach(([k, v]) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td style="color:var(--dev-text-muted);font-weight:600;width:35%;word-break:break-word">${k}</td><td style="color:var(--dev-text-bright);word-break:break-all">${v}</td>`;
        reqTbody.appendChild(tr);
      });
      reqTable.appendChild(reqTbody);

      const resH4 = document.createElement('h4');
      resH4.style.color = 'var(--dev-text-bright)';
      resH4.style.marginBottom = '8px';
      resH4.style.fontSize = '13px';
      resH4.textContent = 'Response Headers';

      const resTable = document.createElement('table');
      resTable.className = 'devtools-table';
      resTable.style.tableLayout = 'fixed';
      resTable.style.width = '100%';

      const resTbody = document.createElement('tbody');
      Object.entries(req.responseHeaders || {}).forEach(([k, v]) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td style="color:var(--dev-text-muted);font-weight:600;width:35%;word-break:break-word">${k}</td><td style="color:var(--dev-text-bright);word-break:break-all">${v}</td>`;
        resTbody.appendChild(tr);
      });
      resTable.appendChild(resTbody);

      headersWrap.appendChild(reqH4);
      headersWrap.appendChild(reqTable);
      headersWrap.appendChild(resH4);
      headersWrap.appendChild(resTable);
      bodyScroll.appendChild(headersWrap);
    } else if (this.activeDetailTab === NETWORK_DETAIL_TABS.FRAMES) {
      const frames = req.frames || [];
      if (frames.length === 0) {
        bodyScroll.innerHTML =
          '<div style="color:var(--dev-text-muted)">No WebSocket/SSE frame messages recorded.</div>';
      } else {
        const frameWrap = document.createElement('div');
        frameWrap.style.display = 'flex';
        frameWrap.style.flexDirection = 'column';
        frameWrap.style.gap = '8px';

        frames.forEach((frame) => {
          const item = document.createElement('div');
          item.style.padding = '8px 10px';
          item.style.borderRadius = '6px';
          item.style.background = 'var(--dev-card-bg)';
          item.style.border = '1px solid var(--dev-border)';
          item.style.fontSize = '12px';
          item.style.fontFamily = 'var(--dev-font-mono)';

          const header = document.createElement('div');
          header.style.display = 'flex';
          header.style.justifyContent = 'space-between';
          header.style.alignItems = 'center';
          header.style.marginBottom = '4px';

          const badge = document.createElement('span');
          badge.style.padding = '2px 6px';
          badge.style.borderRadius = '4px';
          badge.style.fontSize = '10px';
          badge.style.fontWeight = '700';
          if (frame.type === NETWORK_FRAME_TYPES.SENT) {
            badge.style.background = 'rgba(16, 185, 129, 0.15)';
            badge.style.color = 'var(--dev-success)';
            badge.innerHTML = `<span style="display:inline-flex;align-items:center;gap:3px">${ARROW_UP_ICON} Sent</span>`;
          } else {
            badge.style.background = 'rgba(59, 130, 246, 0.15)';
            badge.style.color = 'var(--dev-accent)';
            badge.innerHTML = `<span style="display:inline-flex;align-items:center;gap:3px">${ARROW_DOWN_ICON} Received</span>`;
          }

          const time = document.createElement('span');
          time.style.color = 'var(--dev-text-muted)';
          time.style.fontSize = '11px';
          time.textContent = formatTimestamp(frame.timestamp);

          header.appendChild(badge);
          header.appendChild(time);

          const dataEl = document.createElement('div');
          dataEl.style.color = 'var(--dev-text-bright)';
          dataEl.style.wordBreak = 'break-all';
          dataEl.style.whiteSpace = 'pre-wrap';
          if (typeof frame.data === 'object' && frame.data !== null) {
            dataEl.appendChild(renderJsonTree(frame.data));
          } else {
            dataEl.textContent = String(frame.data);
          }

          item.appendChild(header);
          item.appendChild(dataEl);
          frameWrap.appendChild(item);
        });

        bodyScroll.appendChild(frameWrap);
      }
    }

    bodyContainer.appendChild(bodyScroll);

    modal.appendChild(header);
    modal.appendChild(metaBar);
    modal.appendChild(tabsBar);
    modal.appendChild(bodyContainer);

    this.container.appendChild(modal);

    requestAnimationFrame(() => {
      if (tabsBar) {
        tabsBar.scrollLeft = prevSubTabsScrollLeft;
      }
      if (bodyScroll) {
        bodyScroll.scrollLeft = this.detailScrollLeft;
      }
      if (this.isDetailScrolledToBottom && this.activeDetailTab === 'frames') {
        bodyScroll.scrollTop = bodyScroll.scrollHeight;
      } else {
        bodyScroll.scrollTop = this.detailScrollTop;
      }
    });

    return this.container;
  }
}
