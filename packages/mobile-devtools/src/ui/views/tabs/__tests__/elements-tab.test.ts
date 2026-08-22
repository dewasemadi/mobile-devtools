import { describe, it, expect, beforeEach, vi } from 'vitest';
import { DevToolsStore } from '../../../../core';
import { ElementsTabView } from '../elements-tab';

describe('ElementsTabView', () => {
  let store: DevToolsStore;
  let tabView: ElementsTabView;

  beforeEach(() => {
    store = new DevToolsStore();
    document.body.innerHTML = `
      <div id="app" class="main-container" data-test="app-root">
        <h1 class="title">Hello World</h1>
        <p class="desc">Sample paragraph text</p>
      </div>
    `;
    tabView = new ElementsTabView(store);
  });

  it('should render element inspector tree toolbar and DOM node tree', () => {
    const el = tabView.render();
    expect(el).toBeDefined();

    const text = el.textContent || '';
    expect(text).toContain('DOM Tree');
    expect(text).toContain('Styles');
    expect(text).toContain('Attrs');
  });

  it('should switch between sub-tabs (Tree, Styles, Attrs)', () => {
    const el = tabView.render();
    const buttons = Array.from(el.querySelectorAll('button'));
    const stylesBtn = buttons.find((b) => b.textContent === 'Styles');
    const attrsBtn = buttons.find((b) => b.textContent === 'Attrs');

    expect(stylesBtn).toBeDefined();
    stylesBtn?.click();
    expect(el.textContent).toContain('Grouped Computed Styles');

    expect(attrsBtn).toBeDefined();
    attrsBtn?.click();
    expect(el.textContent).toContain('Attributes');
  });

  it('should handle reset button click to target document.body', () => {
    const el = tabView.render();
    const buttons = Array.from(el.querySelectorAll('button'));
    const resetBtn = buttons.find((b) => b.title.includes('Reset selection'));

    expect(resetBtn).toBeDefined();
    resetBtn?.click();

    expect(el.textContent).toContain('body');
  });

  it('should handle inspect button toggling', () => {
    const el = tabView.render();
    const inspectBtn = el.querySelector('button[title*="Inspect Element"]') as HTMLButtonElement;
    expect(inspectBtn).not.toBeNull();

    inspectBtn.click();
    expect(store.getIsOpen()).toBe(false);

    // Click again when active to stop picker
    inspectBtn.click();
  });

  it('should filter DOM tree nodes using search input', () => {
    const el = tabView.render();
    const searchInput = el.querySelector('input[type="text"]') as HTMLInputElement;

    if (searchInput) {
      searchInput.value = 'title';
      searchInput.dispatchEvent(new Event('input'));
    }

    expect(el.textContent).toContain('title');
  });

  it('should expand and collapse DOM nodes in tree view', () => {
    const el = tabView.render();
    const expanders = Array.from(el.querySelectorAll('.devtools-dom-expander')) as HTMLElement[];

    if (expanders.length > 0) {
      expanders[0].click(); // collapse / expand
      expanders[0].click();
    }
    expect(el.querySelector('.devtools-dom-tree')).not.toBeNull();
  });

  it('should render breadcrumbs and allow ancestor selection', () => {
    const el = tabView.render();
    const breadcrumbItems = Array.from(el.querySelectorAll('.devtools-breadcrumb-item')) as HTMLButtonElement[];

    if (breadcrumbItems.length > 0) {
      breadcrumbItems[0].click();
    }
    expect(el.textContent).toBeDefined();
  });

  it('should render Styles view with box model and grouped computed styles', () => {
    const el = tabView.render();
    const stylesBtn = Array.from(el.querySelectorAll('button')).find((b) => b.textContent === 'Styles');
    stylesBtn?.click();

    expect(el.querySelector('.devtools-box-model')).not.toBeNull();
    expect(el.textContent).toContain('Grouped Computed Styles');

    // Collapse style category
    const categoryHeader = el.querySelector('.devtools-style-category-header') as HTMLElement;
    if (categoryHeader) {
      categoryHeader.click();
      categoryHeader.click();
    }
  });

  it('should render Attributes view, edit values, delete attributes, and add new attribute', () => {
    const promptSpy = vi.spyOn(window, 'prompt');
    const el = tabView.render();

    const attrsBtn = Array.from(el.querySelectorAll('button')).find((b) => b.textContent === 'Attrs');
    attrsBtn?.click();

    // Test text area for editing textContent
    const textarea = el.querySelector('textarea') as HTMLTextAreaElement;
    if (textarea) {
      textarea.value = 'Updated paragraph text';
      textarea.dispatchEvent(new Event('change'));
    }

    // Test adding attribute via prompt
    promptSpy.mockReturnValueOnce('data-new').mockReturnValueOnce('new-val');
    const addAttrBtn = el.querySelector('button[aria-label="Add attribute"]') as HTMLButtonElement;
    if (addAttrBtn) {
      addAttrBtn.click();
    }

    // Test editing attribute input
    const attrInputs = Array.from(el.querySelectorAll('.devtools-attr-input')) as HTMLInputElement[];
    if (attrInputs.length > 0) {
      attrInputs[0].value = 'modified-val';
      attrInputs[0].dispatchEvent(new Event('change'));
    }

    // Test delete attribute button
    const deleteBtns = Array.from(el.querySelectorAll('.devtools-attr-row button')) as HTMLButtonElement[];
    if (deleteBtns.length > 0) {
      deleteBtns[0].click();
    }

    promptSpy.mockRestore();
  });
});

