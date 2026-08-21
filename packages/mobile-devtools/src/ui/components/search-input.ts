import { CLOSE_ICON } from '../icons';

export interface SearchInputOptions {
  placeholder?: string;
  value?: string;
  ariaLabel?: string;
  className?: string;
  onInput?: (val: string) => void;
  onChange?: (val: string) => void;
  onClear?: () => void;
}

export interface SearchInputResult {
  container: HTMLElement;
  input: HTMLInputElement;
  clearBtn: HTMLButtonElement;
}

export function createSearchInput(options: SearchInputOptions): SearchInputResult {
  const container = document.createElement('div');
  container.className = 'devtools-search-wrapper';

  const input = document.createElement('input');
  input.type = 'text';
  input.className = `devtools-search-input ${options.className || ''}`.trim();
  input.placeholder = options.placeholder || 'Search...';
  input.value = options.value || '';
  if (options.ariaLabel) {
    input.setAttribute('aria-label', options.ariaLabel);
  }

  const clearBtn = document.createElement('button');
  clearBtn.type = 'button';
  clearBtn.className = 'devtools-search-clear';
  clearBtn.title = 'Clear search';
  clearBtn.setAttribute('aria-label', 'Clear search');
  clearBtn.innerHTML = CLOSE_ICON;
  clearBtn.style.display = input.value.trim() ? 'flex' : 'none';

  const updateClearBtn = () => {
    clearBtn.style.display = input.value.trim() ? 'flex' : 'none';
  };

  input.addEventListener('input', () => {
    updateClearBtn();
    options.onInput?.(input.value);
  });

  if (options.onChange) {
    input.addEventListener('change', () => {
      options.onChange?.(input.value);
    });
  }

  clearBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    input.value = '';
    updateClearBtn();
    input.focus();
    options.onInput?.('');
    options.onClear?.();
  });

  container.appendChild(input);
  container.appendChild(clearBtn);

  return { container, input, clearBtn };
}
