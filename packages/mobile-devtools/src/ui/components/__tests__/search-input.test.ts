import { describe, it, expect, vi } from 'vitest';
import { createSearchInput } from '../search-input';

describe('createSearchInput', () => {
  it('should render search wrapper with input and clear button', () => {
    const { container, input, clearBtn } = createSearchInput({
      placeholder: 'Search items...',
      ariaLabel: 'Search items',
    });

    expect(container.className).toBe('devtools-search-wrapper');
    expect(input.placeholder).toBe('Search items...');
    expect(input.getAttribute('aria-label')).toBe('Search items');
    expect(clearBtn.style.display).toBe('none');
  });

  it('should show clear button when initial value is provided', () => {
    const { clearBtn } = createSearchInput({
      value: 'hello',
    });

    expect(clearBtn.style.display).toBe('flex');
  });

  it('should trigger onInput callback and update clear button visibility when typing', () => {
    const onInput = vi.fn();
    const { input, clearBtn } = createSearchInput({ onInput });

    input.value = 'test query';
    input.dispatchEvent(new Event('input'));

    expect(onInput).toHaveBeenCalledWith('test query');
    expect(clearBtn.style.display).toBe('flex');
  });

  it('should clear input, trigger callbacks, and focus when clear button is clicked', () => {
    const onInput = vi.fn();
    const onClear = vi.fn();

    const { input, clearBtn } = createSearchInput({
      value: 'query',
      onInput,
      onClear,
    });

    clearBtn.click();

    expect(input.value).toBe('');
    expect(clearBtn.style.display).toBe('none');
    expect(onInput).toHaveBeenCalledWith('');
    expect(onClear).toHaveBeenCalled();
  });
});
