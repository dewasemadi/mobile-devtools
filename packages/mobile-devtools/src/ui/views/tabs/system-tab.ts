import { copyToClipboard, DevToolsStore, isBrowser } from '../../../core';
import { CHECK_ICON } from '../../icons';
import { setupScrollLockGuard } from '../../utils/scroll-lock';

export class SystemTabView {
  private container: HTMLElement;

  constructor(_store?: DevToolsStore) {
    this.container = document.createElement('div');
    this.container.className = 'devtools-tab-content';
  }

  public render(): HTMLElement {
    this.container.innerHTML = '';
    this.container.style.padding = '14px';
    setupScrollLockGuard(this.container);

    if (!isBrowser) {
      this.container.innerHTML =
        '<div style="color:var(--dev-text-muted)">System info not available in SSR.</div>';
      return this.container;
    }

    const ua = navigator.userAgent;
    const screenWidth = window.screen.width;
    const screenHeight = window.screen.height;
    const innerWidth = window.innerWidth;
    const innerHeight = window.innerHeight;
    const dpr = window.devicePixelRatio || 1;
    const lang = navigator.language;
    const touchSupport = 'ontouchstart' in window || navigator.maxTouchPoints > 0 ? 'Yes' : 'No';

    const memInfo = (performance as any)?.memory;
    const memory = memInfo
      ? `${Math.round(memInfo.usedJSHeapSize / 1048576)}MB / ${Math.round(
          memInfo.jsHeapSizeLimit / 1048576
        )}MB`
      : 'N/A';

    const topBar = document.createElement('div');
    topBar.style.display = 'flex';
    topBar.style.justifyContent = 'space-between';
    topBar.style.alignItems = 'center';
    topBar.style.marginBottom = '14px';

    const h3 = document.createElement('h3');
    h3.style.fontSize = '13px';
    h3.style.fontWeight = '700';
    h3.style.color = 'var(--dev-text-bright)';
    h3.textContent = 'System & Environment Info';

    const copyBtn = document.createElement('button');
    copyBtn.className = 'devtools-btn';
    copyBtn.textContent = 'Copy Info';
    copyBtn.addEventListener('click', async () => {
      const info = `User Agent: ${ua}\nScreen: ${screenWidth}x${screenHeight}\nViewport: ${innerWidth}x${innerHeight}\nDPR: ${dpr}\nTouch Support: ${touchSupport}\nLanguage: ${lang}\nMemory: ${memory}`;
      const ok = await copyToClipboard(info);
      copyBtn.innerHTML = ok
        ? `<span style="display:inline-flex;align-items:center;gap:4px">${CHECK_ICON} Copied</span>`
        : 'Failed';
      setTimeout(() => {
        copyBtn.textContent = 'Copy Info';
      }, 2000);
    });

    topBar.appendChild(h3);
    topBar.appendChild(copyBtn);

    // UserAgent Box
    const uaBox = document.createElement('div');
    uaBox.className = 'devtools-user-agent-box';
    uaBox.style.marginBottom = '16px';
    uaBox.innerHTML = `<strong style="color:var(--dev-text-muted)">User Agent:</strong><br/>${ua}`;

    // Specs Table
    const table = document.createElement('table');
    table.className = 'devtools-table';
    table.innerHTML = `
      <tbody>
        <tr>
          <td style="color:var(--dev-text-muted);font-weight:600;width:40%">Viewport Size</td>
          <td style="color:var(--dev-text-bright)">${innerWidth} × ${innerHeight} px</td>
        </tr>
        <tr>
          <td style="color:var(--dev-text-muted);font-weight:600">Screen Resolution</td>
          <td style="color:var(--dev-text-bright)">${screenWidth} × ${screenHeight} px</td>
        </tr>
        <tr>
          <td style="color:var(--dev-text-muted);font-weight:600">Device Pixel Ratio</td>
          <td style="color:var(--dev-text-bright)">${dpr}x</td>
        </tr>
        <tr>
          <td style="color:var(--dev-text-muted);font-weight:600">Touch Support</td>
          <td style="color:var(--dev-text-bright)">${touchSupport ? 'Yes' : 'No'}</td>
        </tr>
        <tr>
          <td style="color:var(--dev-text-muted);font-weight:600">Language</td>
          <td style="color:var(--dev-text-bright)">${lang}</td>
        </tr>
        <tr>
          <td style="color:var(--dev-text-muted);font-weight:600">Heap Memory</td>
          <td style="color:var(--dev-text-bright)">${memory}</td>
        </tr>
      </tbody>
    `;

    this.container.appendChild(topBar);
    this.container.appendChild(uaBox);
    this.container.appendChild(table);

    return this.container;
  }
}
