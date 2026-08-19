import { describe, it, expect } from 'vitest';
import { renderJsonTree } from '../json-tree';

describe('renderJsonTree', () => {
  it('should render null, boolean, number, string primitives', () => {
    expect(renderJsonTree(null).querySelector('.devtools-json-null')?.textContent).toBe('null');
    expect(renderJsonTree(true).querySelector('.devtools-json-boolean')?.textContent).toBe('true');
    expect(renderJsonTree(42).querySelector('.devtools-json-number')?.textContent).toBe('42');
    expect(renderJsonTree('hello').querySelector('.devtools-json-string')?.textContent).toBe(
      '"hello"'
    );
  });

  it('should render objects and arrays with toggleable children', () => {
    const data = {
      name: 'Alice',
      roles: ['admin', 'user'],
    };

    const tree = renderJsonTree(data);
    expect(tree.querySelector('.devtools-json-key')?.textContent).toBe('Object{2}');

    const toggle = tree.querySelector('.devtools-json-toggle') as HTMLElement;
    expect(toggle).not.toBeNull();
    toggle.click(); // Toggle close

    const children = tree.querySelector('.devtools-json-children') as HTMLElement;
    expect(children.style.display).toBe('none');
  });
});
