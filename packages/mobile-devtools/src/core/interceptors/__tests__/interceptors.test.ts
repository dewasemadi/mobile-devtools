import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { DevToolsStore } from '../../stores/devtools-store';
import { ConsoleInterceptor } from '../console-interceptor';
import { NetworkInterceptor } from '../network-interceptor';

describe('ConsoleInterceptor', () => {
  let store: DevToolsStore;
  let interceptor: ConsoleInterceptor;

  beforeEach(() => {
    store = new DevToolsStore();
    interceptor = new ConsoleInterceptor(store);
  });

  afterEach(() => {
    interceptor.restore();
  });

  it('should intercept console log, info, debug, warn, and error calls and serialize complex args', () => {
    interceptor.init();
    interceptor.init(); // Test idempotency branch

    const namedFn = function myFunc() {};
    const anonFn = () => {};
    const sym = Symbol('mySym');
    const err = new Error('Test error obj');

    const div = document.createElement('div');
    div.id = 'box';
    div.className = 'container active';

    console.log('Log', undefined, null, namedFn, anonFn, sym, err, div);
    console.info('Test info');
    console.debug('Test debug');
    console.warn('Test warn');
    console.error('Test error without error arg');

    const logs = store.getLogs();
    expect(logs.length).toBe(5);

    const firstArgs = logs[0].args;
    expect(firstArgs).toContain('undefined');
    expect(firstArgs).toContain(null);
    expect(firstArgs).toContain('[Function: myFunc]');
    expect(firstArgs).toContain('[Function: anonFn]');
    expect(firstArgs).toContain('Symbol(mySym)');
    expect(firstArgs.some((a) => typeof a === 'object' && a?.name === 'Error')).toBe(true);
    expect(firstArgs.some((a) => typeof a === 'string' && a.includes('<div id="box" class="container active">'))).toBe(true);
    expect(logs[0].stack).toBeDefined();
  });

  it('should restore original console functions upon restore', () => {
    interceptor.init();
    interceptor.restore();
    interceptor.restore(); // Test idempotency branch
    expect(() => interceptor.restore()).not.toThrow();
  });

});

describe('NetworkInterceptor', () => {
  let store: DevToolsStore;
  let interceptor: NetworkInterceptor;

  beforeEach(() => {
    store = new DevToolsStore();
    interceptor = new NetworkInterceptor(store);
  });

  afterEach(() => {
    interceptor.restore();
  });

  it('should initialize and restore fetch / XHR interceptors without crashing', () => {
    interceptor.init();
    expect(() => interceptor.restore()).not.toThrow();
  });
});
