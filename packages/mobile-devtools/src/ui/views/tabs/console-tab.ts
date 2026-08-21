import {
  CONSOLE_SORT_OPTIONS,
  ConsoleSortOption,
  DevToolsStore,
  FILTER_OPTIONS,
  formatTimestamp,
  LOG_LEVELS,
} from '../../../core';
import { renderJsonTree } from '../../components/json-tree';
import { TRASH_ICON } from '../../icons';
import { setupScrollLockGuard } from '../../utils/scroll-lock';
import { createSearchInput } from '../../components/search-input';

export class ConsoleTabView {
  private store: DevToolsStore;
  private container: HTMLElement;
  private listScrollContainer: HTMLElement | null = null;
  private clearBtn: HTMLButtonElement | null = null;
  private searchValue = '';
  private levelFilter: string = FILTER_OPTIONS.ALL;
  private sortOption: ConsoleSortOption = CONSOLE_SORT_OPTIONS.TIME_DESC;
  private savedScrollTop = 0;
  private isScrolledToBottom = true;

  constructor(store: DevToolsStore) {
    this.store = store;
    this.container = document.createElement('div');
    this.container.className = 'devtools-tab-content';
  }

  public render(): HTMLElement {
    this.container.innerHTML = '';

    // Toolbar (2-Row Layout: Row 1 = Search + Clear, Row 2 = Level, Sort)
    const toolbar = document.createElement('div');
    toolbar.className = 'devtools-toolbar';
    toolbar.style.display = 'flex';
    toolbar.style.flexDirection = 'column';
    toolbar.style.gap = '6px';

    const row1 = document.createElement('div');
    row1.className = 'devtools-toolbar-row';

    const { container: searchWrapper } = createSearchInput({
      placeholder: 'Filter console logs...',
      value: this.searchValue,
      ariaLabel: 'Filter console logs',
      onInput: (val) => {
        this.searchValue = val;
        this.updateList();
      },
    });

    this.clearBtn = document.createElement('button');
    this.clearBtn.className = 'devtools-btn devtools-btn-danger devtools-btn-icon-only';
    this.clearBtn.title = 'Clear Console Logs';
    this.clearBtn.setAttribute('aria-label', 'Clear Console Logs');
    this.clearBtn.innerHTML = TRASH_ICON;
    this.clearBtn.addEventListener('click', () => {
      if (
        window.confirm(
          'Are you sure you want to clear all recorded console logs? This action cannot be undone.'
        )
      ) {
        this.store.clearLogs();
        this.render();
      }
    });

    row1.appendChild(searchWrapper);
    row1.appendChild(this.clearBtn);

    const row2 = document.createElement('div');
    row2.className = 'devtools-toolbar-row';
    row2.style.overflowX = 'auto';
    setupScrollLockGuard(row2);

    const levelSelect = document.createElement('select');
    levelSelect.className = 'devtools-select';
    levelSelect.style.flex = '1';
    levelSelect.style.minWidth = '75px';
    levelSelect.innerHTML = `
      <option value="${FILTER_OPTIONS.ALL}">ALL</option>
      <option value="${LOG_LEVELS.LOG}">LOG</option>
      <option value="${LOG_LEVELS.INFO}">INFO</option>
      <option value="${LOG_LEVELS.WARN}">WARN</option>
      <option value="${LOG_LEVELS.ERROR}">ERROR</option>
      <option value="${LOG_LEVELS.DEBUG}">DEBUG</option>
    `;
    levelSelect.value = this.levelFilter;
    levelSelect.addEventListener('change', (e) => {
      this.levelFilter = (e.target as HTMLSelectElement).value;
      this.updateList();
    });

    const sortSelect = document.createElement('select');
    sortSelect.className = 'devtools-select';
    sortSelect.style.flex = '1';
    sortSelect.style.minWidth = '85px';
    sortSelect.innerHTML = `
      <option value="${CONSOLE_SORT_OPTIONS.TIME_DESC}">Newest</option>
      <option value="${CONSOLE_SORT_OPTIONS.TIME_ASC}">Oldest</option>
      <option value="${CONSOLE_SORT_OPTIONS.LEVEL_DESC}">Errors</option>
      <option value="${CONSOLE_SORT_OPTIONS.COUNT_DESC}">Frequent</option>
    `;
    sortSelect.value = this.sortOption;
    sortSelect.addEventListener('change', (e) => {
      this.sortOption = (e.target as HTMLSelectElement).value as ConsoleSortOption;
      this.updateList();
    });

    row2.appendChild(levelSelect);
    row2.appendChild(sortSelect);

    toolbar.appendChild(row1);
    toolbar.appendChild(row2);

    // Scrollable List Container
    this.listScrollContainer = document.createElement('div');
    this.listScrollContainer.className = 'devtools-list-scroll';
    setupScrollLockGuard(this.listScrollContainer);
    this.listScrollContainer.addEventListener('scroll', () => {
      if (!this.listScrollContainer) return;
      const isAtBottom =
        this.listScrollContainer.scrollHeight -
          this.listScrollContainer.scrollTop -
          this.listScrollContainer.clientHeight <
        40;
      this.isScrolledToBottom = isAtBottom;
      this.savedScrollTop = this.listScrollContainer.scrollTop;
    });

    this.container.appendChild(toolbar);
    this.container.appendChild(this.listScrollContainer);

    this.updateList();
    return this.container;
  }

  public updateList() {
    if (!this.listScrollContainer) return;
    const prevScrollTop = this.savedScrollTop;
    const shouldScrollToBottom = this.isScrolledToBottom;
    this.listScrollContainer.innerHTML = '';

    const logs = this.store.getLogs();
    if (this.clearBtn) {
      this.clearBtn.disabled = logs.length === 0;
    }
    const filtered = logs.filter((log) => {
      const matchesSearch =
        !this.searchValue.trim() ||
        log.args.some((arg) => String(arg).toLowerCase().includes(this.searchValue.toLowerCase()));
      const matchesLevel =
        this.levelFilter === FILTER_OPTIONS.ALL || log.level === this.levelFilter;
      return matchesSearch && matchesLevel;
    });

    const levelPriority: Record<string, number> = {
      [LOG_LEVELS.ERROR]: 4,
      [LOG_LEVELS.WARN]: 3,
      [LOG_LEVELS.INFO]: 2,
      [LOG_LEVELS.LOG]: 1,
      [LOG_LEVELS.DEBUG]: 0,
    };

    const sorted = [...filtered].sort((a, b) => {
      if (this.sortOption === CONSOLE_SORT_OPTIONS.TIME_ASC) {
        return a.timestamp - b.timestamp;
      }
      if (this.sortOption === CONSOLE_SORT_OPTIONS.LEVEL_DESC) {
        const prioA = levelPriority[a.level] ?? 0;
        const prioB = levelPriority[b.level] ?? 0;
        if (prioA !== prioB) return prioB - prioA;
        return b.timestamp - a.timestamp;
      }
      if (this.sortOption === CONSOLE_SORT_OPTIONS.COUNT_DESC) {
        if ((b.count || 1) !== (a.count || 1)) return (b.count || 1) - (a.count || 1);
        return b.timestamp - a.timestamp;
      }
      return b.timestamp - a.timestamp;
    });

    if (sorted.length === 0) {
      const empty = document.createElement('div');
      empty.style.textAlign = 'center';
      empty.style.padding = '32px';
      empty.style.color = 'var(--dev-text-muted)';
      empty.style.fontSize = '12px';
      empty.textContent = 'No console logs recorded.';
      this.listScrollContainer.appendChild(empty);
      return;
    }

    sorted.forEach((log) => {
      const card = document.createElement('div');
      card.className = 'devtools-code-card';

      if (log.level === LOG_LEVELS.ERROR) {
        card.style.borderColor = 'var(--dev-error-border)';
        card.style.background = 'var(--dev-error-bg)';
      } else if (log.level === LOG_LEVELS.WARN) {
        card.style.borderColor = 'rgba(241, 161, 13, 0.4)';
        card.style.background = 'var(--dev-warn-bg)';
      }

      // Card Header
      const header = document.createElement('div');
      header.className = 'devtools-card-header';

      const filePath = document.createElement('div');
      filePath.className = 'devtools-file-path';

      let statusClass = 'success';
      if (log.level === LOG_LEVELS.ERROR) {
        statusClass = 'error';
      } else if (log.level === LOG_LEVELS.WARN) {
        statusClass = 'pending';
      }

      const levelPill = document.createElement('span');
      levelPill.className = `devtools-status-pill ${statusClass}`;
      levelPill.textContent = log.level.toUpperCase();

      const timeSpan = document.createElement('span');
      timeSpan.style.color = 'var(--dev-text-muted)';
      timeSpan.textContent = formatTimestamp(log.timestamp);

      filePath.appendChild(levelPill);
      filePath.appendChild(timeSpan);
      header.appendChild(filePath);

      // Log Payload Arguments
      const content = document.createElement('div');
      content.className = 'devtools-log-content';

      log.args.forEach((arg) => {
        const item = renderJsonTree(arg);
        content.appendChild(item);
      });

      card.appendChild(header);
      card.appendChild(content);
      this.listScrollContainer!.appendChild(card);
    });

    requestAnimationFrame(() => {
      if (this.listScrollContainer) {
        if (shouldScrollToBottom) {
          this.listScrollContainer.scrollTop = this.listScrollContainer.scrollHeight;
        } else {
          this.listScrollContainer.scrollTop = prevScrollTop;
        }
      }
    });
  }
}
