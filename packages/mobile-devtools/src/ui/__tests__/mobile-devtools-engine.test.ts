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

  it('should return dummy container when enabled: false and forceEnable: false', () => {
    engine = new MobileDevToolsEngine({
      enabled: false,
      forceEnable: false,
    });

    const { container, store } = engine.mount();
    expect(container).toBeDefined();
    expect(store).toBeDefined();
  });

  it('should be idempotent when mount is called multiple times', () => {
    engine = new MobileDevToolsEngine({ enabled: true });
    const res1 = engine.mount();
    const res2 = engine.mount();

    expect(res1.container).toBe(res2.container);
  });

  it('should update config dynamically and initialize shake detector when shakeToToggle: true', () => {
    engine = new MobileDevToolsEngine({
      shakeToToggle: true,
      shakeThreshold: 15,
      interceptors: {
        enableConsoleInterceptor: true,
        enableFetchInterceptor: true,
        enableWebSocketInterceptor: true,
        enableSSEInterceptor: true,
      },
    });

    engine.updateConfig({ title: 'New App Title' });
    expect(engine.getStore().getConfig().title).toBe('New App Title');

    const { container } = engine.mount();
    expect(container).toBeDefined();

    engine.destroy();
  });
});

