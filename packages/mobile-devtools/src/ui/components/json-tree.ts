import { formatCount } from '../../core';
import { CHEVRON_DOWN_ICON, CHEVRON_RIGHT_ICON } from '../icons';

export function renderJsonTree(data: any, indentLevel = 0): HTMLElement {
  const container = document.createElement('div');
  container.className = 'devtools-json-container';
  if (indentLevel > 0) {
    container.style.paddingLeft = `${indentLevel * 12}px`;
  }

  if (data === null) {
    const span = document.createElement('span');
    span.className = 'devtools-json-null';
    span.textContent = 'null';
    container.appendChild(span);
    return container;
  }

  if (typeof data === 'boolean') {
    const span = document.createElement('span');
    span.className = 'devtools-json-boolean';
    span.textContent = String(data);
    container.appendChild(span);
    return container;
  }

  if (typeof data === 'number') {
    const span = document.createElement('span');
    span.className = 'devtools-json-number';
    span.textContent = String(data);
    container.appendChild(span);
    return container;
  }

  if (typeof data === 'string') {
    const span = document.createElement('span');
    span.className = 'devtools-json-string';
    span.textContent = `"${data}"`;
    container.appendChild(span);
    return container;
  }

  if (typeof data === 'object') {
    const isArray = Array.isArray(data);
    const keys = Object.keys(data);
    const count = keys.length;

    const toggle = document.createElement('div');
    toggle.className = 'devtools-json-toggle';

    const arrow = document.createElement('span');
    arrow.style.display = 'inline-flex';
    arrow.style.alignItems = 'center';
    arrow.style.marginRight = '4px';
    arrow.innerHTML = CHEVRON_DOWN_ICON;

    const label = document.createElement('span');
    label.className = 'devtools-json-key';
    label.textContent = isArray ? `Array(${formatCount(count)})` : `Object{${formatCount(count)}}`;

    toggle.appendChild(arrow);
    toggle.appendChild(label);

    const childrenContainer = document.createElement('div');
    childrenContainer.className = 'devtools-json-children';

    let isOpen = true;

    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      isOpen = !isOpen;
      arrow.innerHTML = isOpen ? CHEVRON_DOWN_ICON : CHEVRON_RIGHT_ICON;
      childrenContainer.style.display = isOpen ? 'block' : 'none';
    });

    keys.forEach((key) => {
      const row = document.createElement('div');
      row.style.display = 'flex';
      row.style.alignItems = 'flex-start';
      row.style.gap = '6px';
      row.style.marginTop = '2px';

      const keySpan = document.createElement('span');
      keySpan.className = 'devtools-json-key';
      keySpan.style.whiteSpace = 'nowrap';
      keySpan.style.flexShrink = '0';
      keySpan.textContent = isArray ? `[${key}]:` : `${key}:`;

      const valNode = renderJsonTree(data[key], 0);

      row.appendChild(keySpan);
      row.appendChild(valNode);
      childrenContainer.appendChild(row);
    });

    container.appendChild(toggle);
    container.appendChild(childrenContainer);
    return container;
  }

  const fallback = document.createElement('span');
  fallback.textContent = String(data);
  container.appendChild(fallback);
  return container;
}
