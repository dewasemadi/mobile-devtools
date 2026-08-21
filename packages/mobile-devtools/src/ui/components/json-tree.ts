import { formatCount } from '../../core';
import { CHEVRON_DOWN_ICON, CHEVRON_RIGHT_ICON } from '../icons';

export function renderJsonTree(data: any, keyName?: string): HTMLElement {
  const container = document.createElement('div');
  container.className = 'devtools-json-container';

  if (data === null || typeof data !== 'object') {
    const row = document.createElement('div');
    row.className = 'devtools-json-row';

    if (keyName !== undefined) {
      const keySpan = document.createElement('span');
      keySpan.className = 'devtools-json-key';
      keySpan.textContent = `${keyName}: `;
      row.appendChild(keySpan);
    }

    const valSpan = document.createElement('span');
    if (data === null) {
      valSpan.className = 'devtools-json-null';
      valSpan.textContent = 'null';
    } else if (typeof data === 'boolean') {
      valSpan.className = 'devtools-json-boolean';
      valSpan.textContent = String(data);
    } else if (typeof data === 'number') {
      valSpan.className = 'devtools-json-number';
      valSpan.textContent = String(data);
    } else if (typeof data === 'string') {
      valSpan.className = 'devtools-json-string';
      valSpan.textContent = `"${data}"`;
    } else {
      valSpan.textContent = String(data);
    }
    row.appendChild(valSpan);
    container.appendChild(row);
    return container;
  }

  // Handle Object & Array
  const isArray = Array.isArray(data);
  const keys = Object.keys(data);
  const count = keys.length;

  const toggle = document.createElement('div');
  toggle.className = 'devtools-json-toggle';
  toggle.setAttribute('role', 'button');
  toggle.setAttribute('tabindex', '0');

  const arrow = document.createElement('span');
  arrow.className = 'devtools-json-arrow';
  arrow.innerHTML = CHEVRON_DOWN_ICON;

  const label = document.createElement('span');
  const typeText = isArray ? `Array(${formatCount(count)})` : `Object{${formatCount(count)}}`;

  if (keyName !== undefined) {
    label.className = 'devtools-json-label';
    label.innerHTML = `<span class="devtools-json-key">${keyName}</span> <span class="devtools-json-meta">${typeText}</span>`;
  } else {
    label.className = 'devtools-json-key';
    label.textContent = typeText;
  }

  toggle.appendChild(arrow);
  toggle.appendChild(label);

  const childrenContainer = document.createElement('div');
  childrenContainer.className = 'devtools-json-children';

  let isOpen = true;

  const toggleOpen = () => {
    isOpen = !isOpen;
    arrow.innerHTML = isOpen ? CHEVRON_DOWN_ICON : CHEVRON_RIGHT_ICON;
    childrenContainer.style.display = isOpen ? 'block' : 'none';
  };

  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleOpen();
  });

  toggle.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      e.stopPropagation();
      toggleOpen();
    }
  });

  keys.forEach((key) => {
    const childNode = renderJsonTree(data[key], key);
    childrenContainer.appendChild(childNode);
  });

  container.appendChild(toggle);
  container.appendChild(childrenContainer);
  return container;
}
