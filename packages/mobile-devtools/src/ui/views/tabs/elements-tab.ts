import {
  DevToolsStore,
  ELEMENTS_SUB_TABS,
  ElementsManager,
  ElementsSubTab,
  isBrowser,
} from '../../../core';
import {
  CHEVRON_DOWN_ICON,
  CHEVRON_RIGHT_ICON,
  INSPECT_ICON,
  PLUS_ICON,
  REFRESH_ICON,
  TRASH_ICON,
} from '../../icons';
import { setupScrollLockGuard } from '../../utils/scroll-lock';
import { createSearchInput } from '../../components/search-input';

export class ElementsTabView {
  private store: DevToolsStore;
  private elementsManager: ElementsManager;
  private container: HTMLElement;
  private activeSubTab: ElementsSubTab = ELEMENTS_SUB_TABS.TREE;
  private searchValue = '';
  private expandedNodes = new Set<HTMLElement>();

  constructor(store: DevToolsStore) {
    this.store = store;
    this.elementsManager = new ElementsManager();
    this.container = document.createElement('div');
    this.container.className = 'devtools-tab-content';

    if (isBrowser) {
      if (document.documentElement) this.expandedNodes.add(document.documentElement);
      if (document.body) this.expandedNodes.add(document.body);
    }
  }

  public render(): HTMLElement {
    this.container.innerHTML = '';

    if (isBrowser) {
      if (document.documentElement && !this.expandedNodes.has(document.documentElement)) {
        this.expandedNodes.add(document.documentElement);
      }
      if (document.body && !this.expandedNodes.has(document.body)) {
        this.expandedNodes.add(document.body);
      }
    }

    const selectedEl = this.elementsManager.getSelectedElement();
    if (selectedEl && !this.expandedNodes.has(selectedEl)) {
      this.expandedNodes.add(selectedEl);
    }

    // --- Toolbar ---
    const toolbar = document.createElement('div');
    toolbar.className = 'devtools-toolbar';
    toolbar.style.flexDirection = 'column';
    toolbar.style.alignItems = 'stretch';
    toolbar.style.gap = '6px';

    const row1 = document.createElement('div');
    row1.style.display = 'flex';
    row1.style.alignItems = 'center';
    row1.style.gap = '6px';
    row1.style.width = '100%';

    // Inspect Button (Tap-to-Inspect Element Picker)
    const inspectBtn = document.createElement('button');
    const isPickerActive = this.elementsManager.isPickerActive();
    inspectBtn.className = `devtools-icon-btn ${isPickerActive ? 'active' : ''}`;
    inspectBtn.title = 'Inspect Element (Tap element on screen)';
    inspectBtn.innerHTML = INSPECT_ICON;

    inspectBtn.addEventListener('click', () => {
      if (this.elementsManager.isPickerActive()) {
        this.elementsManager.stopPicker();
        this.renderContent();
      } else {
        // Collapse DevTools drawer temporarily to let user tap element on page
        this.store.setIsOpen(false);
        this.elementsManager.startPicker((el) => {
          this.elementsManager.setSelectedElement(el);
          this.expandedNodes.add(el);
          this.store.setIsOpen(true);
        });
      }
    });

    // Reset / Refresh Target Body Button
    const refreshBtn = document.createElement('button');
    refreshBtn.className = 'devtools-icon-btn';
    refreshBtn.title = 'Reset selection to <body>';
    refreshBtn.innerHTML = REFRESH_ICON;
    refreshBtn.addEventListener('click', () => {
      if (isBrowser && document.body) {
        this.elementsManager.setSelectedElement(document.body);
        this.expandedNodes.add(document.body);
        this.renderContent();
      }
    });

    // Filter / Search Input
    const { container: searchWrapper } = createSearchInput({
      placeholder:
        this.activeSubTab === ELEMENTS_SUB_TABS.STYLES
          ? 'Filter CSS styles...'
          : 'Filter elements...',
      value: this.searchValue,
      ariaLabel: 'Filter elements or CSS styles',
      onInput: (val) => {
        this.searchValue = val;
        this.updateView();
      },
    });

    row1.appendChild(inspectBtn);
    row1.appendChild(refreshBtn);
    row1.appendChild(searchWrapper);

    // Sub-tab Segmented Controller (Full width in row 2)
    const subTabGroup = document.createElement('div');
    subTabGroup.style.display = 'flex';
    subTabGroup.style.gap = '2px';
    subTabGroup.style.backgroundColor = 'var(--dev-card-bg, #1e293b)';
    subTabGroup.style.padding = '3px';
    subTabGroup.style.borderRadius = '6px';
    subTabGroup.style.fontSize = '11px';
    subTabGroup.style.width = '100%';

    const subTabs: { id: ElementsSubTab; label: string }[] = [
      { id: ELEMENTS_SUB_TABS.TREE, label: 'DOM Tree' },
      { id: ELEMENTS_SUB_TABS.STYLES, label: 'Styles' },
      { id: ELEMENTS_SUB_TABS.ATTRIBUTES, label: 'Attrs' },
    ];

    subTabs.forEach((tab) => {
      const btn = document.createElement('button');
      btn.style.cssText = `
        flex: 1;
        border: none;
        background: ${this.activeSubTab === tab.id ? 'var(--dev-accent, #3b82f6)' : 'transparent'};
        color: ${this.activeSubTab === tab.id ? '#ffffff' : 'var(--dev-text-muted, #94a3b8)'};
        padding: 4px 8px;
        border-radius: 4px;
        font-weight: 600;
        cursor: pointer;
        text-align: center;
      `;
      btn.textContent = tab.label;
      btn.addEventListener('click', () => {
        this.activeSubTab = tab.id;
        this.renderContent();
      });
      subTabGroup.appendChild(btn);
    });

    toolbar.appendChild(row1);
    toolbar.appendChild(subTabGroup);

    // --- Breadcrumbs Path Bar ---
    const breadcrumbBar = document.createElement('div');
    breadcrumbBar.className = 'devtools-elements-breadcrumbs';
    this.renderBreadcrumbs(breadcrumbBar);

    // --- Main View Container ---
    const viewContainer = document.createElement('div');
    viewContainer.className = 'devtools-list-scroll devtools-elements-view';
    viewContainer.id = 'devtools-elements-content';
    setupScrollLockGuard(viewContainer);

    this.container.appendChild(toolbar);
    this.container.appendChild(breadcrumbBar);
    this.container.appendChild(viewContainer);

    this.updateView();
    return this.container;
  }

  private renderContent() {
    this.render();
  }

  private renderBreadcrumbs(bar: HTMLElement) {
    bar.innerHTML = '';
    const selectedEl = this.elementsManager.getSelectedElement();
    if (!selectedEl) return;

    const ancestors = this.elementsManager.getElementAncestors(selectedEl);
    ancestors.forEach((el, idx) => {
      const crumb = document.createElement('button');
      crumb.className = `devtools-breadcrumb-item ${el === selectedEl ? 'active' : ''}`;

      const tag = el.tagName.toLowerCase();
      const id = el.id ? `#${el.id}` : '';
      const cls = el.classList.length > 0 ? `.${el.classList[0]}` : '';

      crumb.textContent = `${tag}${id}${cls}`;
      crumb.addEventListener('click', () => {
        this.elementsManager.setSelectedElement(el);
        this.expandedNodes.add(el);
        this.renderContent();
      });

      bar.appendChild(crumb);
      if (idx < ancestors.length - 1) {
        const sep = document.createElement('span');
        sep.className = 'devtools-breadcrumb-sep';
        sep.textContent = '>';
        bar.appendChild(sep);
      }
    });
  }

  private updateView() {
    const viewContainer = this.container.querySelector('#devtools-elements-content') as HTMLElement;
    if (!viewContainer) return;

    viewContainer.innerHTML = '';
    const selectedEl = this.elementsManager.getSelectedElement();

    if (this.activeSubTab === ELEMENTS_SUB_TABS.TREE) {
      this.renderDomTree(viewContainer, selectedEl);
    } else if (this.activeSubTab === ELEMENTS_SUB_TABS.STYLES) {
      this.renderStylesView(viewContainer, selectedEl);
    } else if (this.activeSubTab === ELEMENTS_SUB_TABS.ATTRIBUTES) {
      this.renderAttributesView(viewContainer, selectedEl);
    }
  }

  // --- 1. DOM Tree View ---
  private renderDomTree(container: HTMLElement, targetEl: HTMLElement) {
    const rootEl = targetEl.parentElement || targetEl;
    const treeWrapper = document.createElement('div');
    treeWrapper.className = 'devtools-dom-tree';

    this.renderDomNode(treeWrapper, rootEl, 0, targetEl);
    container.appendChild(treeWrapper);
  }

  private doesNodeMatchSearch(el: HTMLElement, query: string): boolean {
    if (!query) return true;
    const q = query.toLowerCase();
    const tag = el.tagName.toLowerCase();
    if (tag.includes(q)) return true;
    if (el.id && el.id.toLowerCase().includes(q)) return true;
    if (typeof el.className === 'string' && el.className.toLowerCase().includes(q)) return true;
    if (el.textContent && el.textContent.toLowerCase().includes(q)) return true;
    for (let i = 0; i < el.attributes.length; i++) {
      const attr = el.attributes[i];
      if (attr.name.toLowerCase().includes(q) || attr.value.toLowerCase().includes(q)) return true;
    }
    return false;
  }

  private hasMatchingDescendant(el: HTMLElement, query: string): boolean {
    if (this.doesNodeMatchSearch(el, query)) return true;
    for (let i = 0; i < el.children.length; i++) {
      const child = el.children[i];
      if (child instanceof HTMLElement && this.hasMatchingDescendant(child, query)) {
        return true;
      }
    }
    return false;
  }

  private renderDomNode(
    parentContainer: HTMLElement,
    el: HTMLElement,
    depth: number,
    selectedEl: HTMLElement
  ) {
    const query = this.searchValue.trim();
    if (query && !this.hasMatchingDescendant(el, query)) {
      return;
    }

    const summary = this.elementsManager.getDomNodeSummary(el);
    const isSelected = el === selectedEl;
    const isExpanded = query ? true : this.expandedNodes.has(el);

    const nodeRow = document.createElement('div');
    nodeRow.className = `devtools-dom-node ${isSelected ? 'selected' : ''}`;
    nodeRow.style.paddingLeft = `${depth * 14 + 6}px`;

    const expander = document.createElement('span');
    expander.className = 'devtools-dom-expander';
    if (summary.childCount > 0) {
      expander.innerHTML = isExpanded ? CHEVRON_DOWN_ICON : CHEVRON_RIGHT_ICON;
      expander.addEventListener('click', (e) => {
        e.stopPropagation();
        if (isExpanded) {
          this.expandedNodes.delete(el);
        } else {
          this.expandedNodes.add(el);
        }
        this.updateView();
      });
    } else {
      expander.style.width = '14px';
      expander.style.display = 'inline-block';
    }

    const tagContent = document.createElement('span');
    tagContent.className = 'devtools-dom-tag-line';

    const attrsString = summary.attributes
      .filter((a) => a.name !== 'id' && a.name !== 'class')
      .map(
        (a) => `<span class="attr-name">${a.name}</span>="<span class="attr-val">${a.value}</span>"`
      )
      .join(' ');

    const classStr = summary.classList.length > 0 ? ` class="${summary.classList.join(' ')}"` : '';
    const idStr = summary.id ? ` id="${summary.id}"` : '';
    const extraAttrsStr = attrsString ? ` ${attrsString}` : '';

    if (summary.childCount === 0 && !summary.hasText) {
      tagContent.innerHTML = `&lt;<span class="tag-name">${summary.tagName}</span>${idStr}${classStr}${extraAttrsStr} /&gt;`;
    } else if (summary.hasText && summary.childCount === 0) {
      tagContent.innerHTML = `&lt;<span class="tag-name">${summary.tagName}</span>${idStr}${classStr}${extraAttrsStr}&gt;<span class="text-node">${summary.textPreview}</span>&lt;/<span class="tag-name">${summary.tagName}</span>&gt;`;
    } else {
      tagContent.innerHTML = `&lt;<span class="tag-name">${summary.tagName}</span>${idStr}${classStr}${extraAttrsStr}&gt; ${!isExpanded ? `... &lt;/<span class="tag-name">${summary.tagName}</span>&gt;` : ''}`;
    }

    nodeRow.appendChild(expander);
    nodeRow.appendChild(tagContent);

    nodeRow.addEventListener('click', () => {
      this.elementsManager.setSelectedElement(el);
      this.expandedNodes.add(el);
      this.renderContent();
    });

    parentContainer.appendChild(nodeRow);

    // Children
    if (isExpanded && summary.childCount > 0) {
      Array.from(el.children).forEach((child) => {
        if (child instanceof HTMLElement) {
          // Ignore DevTools overlay elements
          if (
            child.classList.contains('mobile-devtools-container') ||
            child.classList.contains('__mobile_devtools_picker_overlay__')
          ) {
            return;
          }
          this.renderDomNode(parentContainer, child, depth + 1, selectedEl);
        }
      });

      // Closing tag for expanded container
      const closingRow = document.createElement('div');
      closingRow.className = 'devtools-dom-node closing';
      closingRow.style.paddingLeft = `${depth * 14 + 20}px`;
      closingRow.innerHTML = `&lt;/<span class="tag-name">${summary.tagName}</span>&gt;`;
      parentContainer.appendChild(closingRow);
    }
  }

  private collapsedCategories = new Set<string>();

  // --- 2. Styles View (Interactive Box Model & Grouped Computed Styles) ---
  private renderStylesView(container: HTMLElement, el: HTMLElement) {
    const boxModel = this.elementsManager.getBoxModel(el);
    const fmtVal = (val: number) => (val === 0 ? '-' : String(val));

    // Interactive Box Model Visual
    const boxModelWrapper = document.createElement('div');
    boxModelWrapper.className = 'devtools-box-model';
    boxModelWrapper.innerHTML = `
      <div class="box-model-margin" title="Margin">
        <span class="box-label">margin</span>
        <span class="box-val top">${fmtVal(boxModel.marginTop)}</span>
        <span class="box-val right">${fmtVal(boxModel.marginRight)}</span>
        <span class="box-val bottom">${fmtVal(boxModel.marginBottom)}</span>
        <span class="box-val left">${fmtVal(boxModel.marginLeft)}</span>

        <div class="box-model-border" title="Border">
          <span class="box-label">border</span>
          <span class="box-val top">${fmtVal(boxModel.borderTop)}</span>
          <span class="box-val right">${fmtVal(boxModel.borderRight)}</span>
          <span class="box-val bottom">${fmtVal(boxModel.borderBottom)}</span>
          <span class="box-val left">${fmtVal(boxModel.borderLeft)}</span>

          <div class="box-model-padding" title="Padding">
            <span class="box-label">padding</span>
            <span class="box-val top">${fmtVal(boxModel.paddingTop)}</span>
            <span class="box-val right">${fmtVal(boxModel.paddingRight)}</span>
            <span class="box-val bottom">${fmtVal(boxModel.paddingBottom)}</span>
            <span class="box-val left">${fmtVal(boxModel.paddingLeft)}</span>

            <div class="box-model-content" title="Content Area">
              <span>${boxModel.width} × ${boxModel.height}</span>
            </div>
          </div>
        </div>
      </div>
    `;

    container.appendChild(boxModelWrapper);

    // Grouped Computed CSS Styles List
    const stylesTitleRow = document.createElement('div');
    stylesTitleRow.className = 'devtools-section-header';

    const stylesTitle = document.createElement('div');
    stylesTitle.className = 'devtools-section-title';
    stylesTitle.style.margin = '0';
    stylesTitle.textContent = 'Grouped Computed Styles';
    stylesTitleRow.appendChild(stylesTitle);
    container.appendChild(stylesTitleRow);

    const groupedStyles = this.elementsManager.getGroupedComputedStyles(el, this.searchValue);

    if (groupedStyles.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'devtools-empty';
      empty.textContent = 'No matching CSS properties found';
      container.appendChild(empty);
      return;
    }

    const groupsContainer = document.createElement('div');
    groupsContainer.className = 'devtools-styles-groups';

    groupedStyles.forEach(({ category, styles }) => {
      const isCollapsed = this.collapsedCategories.has(category);

      const groupHeader = document.createElement('div');
      groupHeader.className = 'devtools-style-category-header';
      groupHeader.innerHTML = `
        <span class="category-expander">${isCollapsed ? CHEVRON_RIGHT_ICON : CHEVRON_DOWN_ICON}</span>
        <span class="category-title">${category}</span>
        <span class="category-count">${styles.length}</span>
      `;

      groupHeader.addEventListener('click', () => {
        if (isCollapsed) {
          this.collapsedCategories.delete(category);
        } else {
          this.collapsedCategories.add(category);
        }
        this.updateView();
      });

      groupsContainer.appendChild(groupHeader);

      if (!isCollapsed) {
        const stylesTable = document.createElement('div');
        stylesTable.className = 'devtools-styles-list';

        styles.forEach(({ property, value }) => {
          const row = document.createElement('div');
          row.className = 'devtools-style-row';

          const propSpan = document.createElement('span');
          propSpan.className = 'style-prop';
          propSpan.textContent = property;

          const valSpan = document.createElement('span');
          valSpan.className = 'style-val';
          valSpan.textContent = value;

          // Color preview dot if value is color format
          if (value.startsWith('#') || value.startsWith('rgb') || value.startsWith('hsl')) {
            const swatch = document.createElement('span');
            swatch.className = 'color-swatch';
            swatch.style.backgroundColor = value;
            valSpan.prepend(swatch);
          }

          row.appendChild(propSpan);
          row.appendChild(document.createTextNode(': '));
          row.appendChild(valSpan);
          stylesTable.appendChild(row);
        });

        groupsContainer.appendChild(stylesTable);
      }
    });

    container.appendChild(groupsContainer);
  }

  // --- 3. Attributes View & Live Editor ---
  private renderAttributesView(container: HTMLElement, el: HTMLElement) {
    const summary = this.elementsManager.getDomNodeSummary(el);

    const titleRow = document.createElement('div');
    titleRow.className = 'devtools-section-header';

    const title = document.createElement('div');
    title.className = 'devtools-section-title';
    title.style.margin = '0';
    title.textContent = `Attributes (<${summary.tagName}>)`;

    const addAttrBtn = document.createElement('button');
    addAttrBtn.className = 'devtools-btn devtools-btn-icon-only';
    addAttrBtn.title = 'Add attribute';
    addAttrBtn.setAttribute('aria-label', 'Add attribute');
    addAttrBtn.innerHTML = PLUS_ICON;
    addAttrBtn.addEventListener('click', () => {
      const name = prompt('Attribute name (e.g. class, style, data-test):');
      if (name) {
        const val = prompt(`Value for attribute "${name}":`) || '';
        el.setAttribute(name, val);
        this.renderContent();
      }
    });

    titleRow.appendChild(title);
    titleRow.appendChild(addAttrBtn);
    container.appendChild(titleRow);

    const attrsList = document.createElement('div');
    attrsList.className = 'devtools-attrs-list';

    let attributes = summary.attributes;
    if (this.searchValue.trim()) {
      const q = this.searchValue.trim().toLowerCase();
      attributes = attributes.filter(
        (a) => a.name.toLowerCase().includes(q) || a.value.toLowerCase().includes(q)
      );
    }

    if (attributes.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'devtools-empty';
      empty.textContent = this.searchValue.trim()
        ? `No attributes matching "${this.searchValue}"`
        : 'No attributes on this element';
      attrsList.appendChild(empty);
    } else {
      attributes.forEach(({ name, value }) => {
        const row = document.createElement('div');
        row.className = 'devtools-attr-row';

        const nameSpan = document.createElement('span');
        nameSpan.className = 'attr-key';
        nameSpan.textContent = name;

        const valInput = document.createElement('input');
        valInput.type = 'text';
        valInput.className = 'devtools-attr-input';
        valInput.value = value;
        valInput.addEventListener('change', () => {
          el.setAttribute(name, valInput.value);
        });

        const delBtn = document.createElement('button');
        delBtn.className = 'devtools-btn devtools-btn-danger devtools-btn-icon-only';
        delBtn.style.padding = '2px 4px';
        delBtn.innerHTML = TRASH_ICON;
        delBtn.addEventListener('click', () => {
          el.removeAttribute(name);
          this.renderContent();
        });

        row.appendChild(nameSpan);
        row.appendChild(document.createTextNode(' = '));
        row.appendChild(valInput);
        row.appendChild(delBtn);
        attrsList.appendChild(row);
      });
    }

    container.appendChild(attrsList);

    // Live Text Content Editor section
    const textSectionTitle = document.createElement('div');
    textSectionTitle.className = 'devtools-section-title';
    textSectionTitle.style.marginTop = '16px';
    textSectionTitle.textContent = 'Text Content';
    container.appendChild(textSectionTitle);

    const textInput = document.createElement('textarea');
    textInput.className = 'devtools-search-input';
    textInput.style.width = '100%';
    textInput.style.height = '60px';
    textInput.style.resize = 'vertical';
    textInput.style.fontFamily = 'monospace';
    textInput.value = el.textContent || '';
    textInput.addEventListener('change', () => {
      el.textContent = textInput.value;
    });

    container.appendChild(textInput);
  }
}
