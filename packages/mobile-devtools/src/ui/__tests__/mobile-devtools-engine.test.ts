import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { MobileDevToolsEngine } from '../index';

describe('MobileDevToolsEngine Styles Injection', () => {
  let engine: MobileDevToolsEngine | null = null;

  afterEach(() => {
    if (engine) {
      engine.destroy();
      engine = null;
    }
  });

  it('should inject custom raw CSS styles string into shadow DOM root', () => {
    engine = new MobileDevToolsEngine({
      enabled: true,
      styles: '.devtools-badge { border-radius: 8px !important; }',
    });

    const { container } = engine.mount();
    expect(container).toBeDefined();

    const host = document.getElementById('mobile-devtools-root');
    expect(host).not.toBeNull();
    expect(host?.shadowRoot).toBeDefined();

    const styleTags = host?.shadowRoot?.querySelectorAll('style');
    expect(styleTags).toBeDefined();
    expect(styleTags!.length).toBeGreaterThanOrEqual(2);

    const injectedCss = Array.from(styleTags!).map((s) => s.textContent).join('\n');
    expect(injectedCss).toContain('.devtools-badge { border-radius: 8px !important; }');
  });
});
