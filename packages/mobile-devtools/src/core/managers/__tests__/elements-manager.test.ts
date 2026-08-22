import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ElementsManager, STYLE_CATEGORIES } from '../elements-manager';

describe('ElementsManager', () => {
  let manager: ElementsManager;

  beforeEach(() => {
    manager = new ElementsManager();
  });

  afterEach(() => {
    manager.stopPicker();
  });

  it('should return document.body as default selected element', () => {
    const selected = manager.getSelectedElement();
    expect(selected).toBe(document.body);
  });

  it('should allow setting selected element', () => {
    const div = document.createElement('div');
    div.id = 'my-div';
    document.body.appendChild(div);

    manager.setSelectedElement(div);
    expect(manager.getSelectedElement()).toBe(div);

    document.body.removeChild(div);
  });

  it('should generate DOM node summary correctly', () => {
    const button = document.createElement('button');
    button.id = 'btn-submit';
    button.className = 'btn primary active';
    button.setAttribute('aria-label', 'Submit Form');
    button.textContent = 'Submit Data';
    document.body.appendChild(button);

    const summary = manager.getDomNodeSummary(button);
    expect(summary.tagName).toBe('button');
    expect(summary.id).toBe('btn-submit');
    expect(summary.classList).toEqual(['btn', 'primary', 'active']);
    expect(summary.hasText).toBe(true);
    expect(summary.textPreview).toContain('Submit Data');

    document.body.removeChild(button);
  });

  it('should get element ancestors hierarchy', () => {
    const parent = document.createElement('div');
    const child = document.createElement('span');
    parent.appendChild(child);
    document.body.appendChild(parent);

    const ancestors = manager.getElementAncestors(child);
    expect(ancestors.length).toBeGreaterThanOrEqual(3); // html, body, parent, child
    expect(ancestors).toContain(child);
    expect(ancestors).toContain(parent);

    document.body.removeChild(parent);
  });

  it('should compute box model metrics', () => {
    const box = document.createElement('div');
    box.style.margin = '10px';
    box.style.padding = '5px';
    document.body.appendChild(box);

    const metrics = manager.getBoxModel(box);
    expect(metrics).toBeDefined();
    expect(typeof metrics.marginTop).toBe('number');
    expect(typeof metrics.paddingTop).toBe('number');

    document.body.removeChild(box);
  });

  it('should inspect computed styles and grouped computed styles', () => {
    const el = document.createElement('div');
    el.style.display = 'flex';
    el.style.color = 'red';
    document.body.appendChild(el);

    const styles = manager.getComputedStyles(el);
    expect(styles.length).toBeGreaterThan(0);

    const filtered = manager.getComputedStyles(el, 'flex');
    expect(filtered.some((s) => s.property === 'display' || s.value.includes('flex'))).toBe(true);

    const grouped = manager.getGroupedComputedStyles(el);
    expect(grouped.length).toBeGreaterThan(0);

    document.body.removeChild(el);
  });

  it('should start and stop picker overlay without error', () => {
    let selectedEl: HTMLElement | null = null;
    manager.startPicker((el) => {
      selectedEl = el;
    });

    expect(manager.isPickerActive()).toBe(true);

    manager.stopPicker();
    expect(manager.isPickerActive()).toBe(false);
    expect(selectedEl).toBeNull();
  });

  it('should handle picker overlay touch and click events', () => {
    let selectedEl: HTMLElement | null = null;
    const targetDiv = document.createElement('div');
    targetDiv.id = 'target-element';
    document.body.appendChild(targetDiv);

    document.elementFromPoint = vi.fn().mockReturnValue(targetDiv);

    manager.startPicker((el) => {
      selectedEl = el;
    });

    // Simulate touch move over element
    const touchMove = new TouchEvent('touchmove', {
      bubbles: true,
      touches: [{ clientX: 10, clientY: 10 } as Touch],
    });
    document.dispatchEvent(touchMove);

    // Simulate click selection
    const clickEvt = new MouseEvent('click', {
      bubbles: true,
      clientX: 10,
      clientY: 10,
    });
    document.dispatchEvent(clickEvt);

    expect(manager.isPickerActive()).toBe(false);

    document.body.removeChild(targetDiv);
  });

  it('should expose STYLE_CATEGORIES definitions', () => {
    expect(STYLE_CATEGORIES.length).toBeGreaterThan(0);
    expect(STYLE_CATEGORIES[0].name).toBe('Layout & Position');
  });
});
