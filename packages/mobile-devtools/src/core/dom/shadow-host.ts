import { isServer } from '../utils/env';

export class ShadowHostManager {
  private hostElement: HTMLElement | null = null;
  private shadowRootNode: ShadowRoot | null = null;
  private containerElement: HTMLDivElement | null = null;

  public mount(targetParent?: HTMLElement | null): {
    shadowRoot: ShadowRoot;
    container: HTMLDivElement;
  } {
    if (isServer) {
      throw new Error('[DevTools] Cannot mount ShadowHost in non-DOM environment');
    }

    if (!this.hostElement) {
      this.hostElement = document.createElement('mobile-devtools-root');
      this.hostElement.id = 'mobile-devtools-root';
      const isCustomContainer = Boolean(targetParent);
      this.hostElement.style.cssText = isCustomContainer
        ? 'position: absolute; inset: 0; width: 100%; height: 100%; z-index: 50; pointer-events: none;'
        : 'position: absolute; top: 0; left: 0; width: 0; height: 0; z-index: 2147483647; pointer-events: none;';

      const parent = targetParent || document.body;
      parent.appendChild(this.hostElement);
      this.shadowRootNode = this.hostElement.attachShadow({ mode: 'open' });

      this.containerElement = document.createElement('div');
      this.containerElement.className = 'mobile-devtools-container';
      this.containerElement.style.cssText =
        'pointer-events: none; height: 100%; width: 100%; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace;';

      this.shadowRootNode.appendChild(this.containerElement);
    }

    return {
      shadowRoot: this.shadowRootNode!,
      container: this.containerElement!,
    };
  }

  public injectStyles(css: string) {
    if (!this.shadowRootNode) return;
    const styleTag = document.createElement('style');
    styleTag.textContent = css;
    this.shadowRootNode.appendChild(styleTag);
  }

  public unmount() {
    if (this.hostElement && this.hostElement.parentNode) {
      this.hostElement.parentNode.removeChild(this.hostElement);
    }
    this.hostElement = null;
    this.shadowRootNode = null;
    this.containerElement = null;
  }
}
