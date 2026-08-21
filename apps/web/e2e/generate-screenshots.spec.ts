import { test, expect, type Page } from '@playwright/test';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootOutputDir = path.resolve(__dirname, '../../../docs/assets');
const packageOutputDir = path.resolve(__dirname, '../../../packages/mobile-devtools/docs/assets');

const saveScreenshotToBothDirs = async (page: Page, filename: string) => {
  const rootPath = path.join(rootOutputDir, filename);
  const pkgPath = path.join(packageOutputDir, filename);
  await page.screenshot({ path: rootPath, fullPage: false });
  fs.copyFileSync(rootPath, pkgPath);
};

const injectIosSafariFrame = async (page: Page) => {
  await page.evaluate(() => {
    if (document.getElementById('ios-safari-frame-overlay')) return;

    const style = document.createElement('style');
    style.id = 'ios-safari-frame-style';
    style.textContent = `
      .ios-status-bar {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        height: 50px;
        background: rgba(255, 255, 255, 0.88);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        z-index: 2147483647;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 24px;
        font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif;
        font-size: 15px;
        font-weight: 600;
        color: #000000;
        pointer-events: none;
        user-select: none;
      }
      .ios-dynamic-island {
        width: 120px;
        height: 32px;
        background: #000000;
        border-radius: 20px;
        position: absolute;
        left: 50%;
        top: 10px;
        transform: translateX(-50%);
        box-shadow: 0 0 1px rgba(0,0,0,0.5);
      }
      .ios-status-right {
        display: flex;
        align-items: center;
        gap: 7px;
      }
      .ios-safari-bottom-bar {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        height: 80px;
        background: rgba(248, 248, 248, 0.92);
        backdrop-filter: blur(25px);
        -webkit-backdrop-filter: blur(25px);
        z-index: 2147483647;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        padding-top: 8px;
        border-top: 0.5px solid rgba(0, 0, 0, 0.12);
        pointer-events: none;
        user-select: none;
      }
      .ios-url-capsule {
        width: 90%;
        height: 42px;
        background: #ffffff;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 14px;
        font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif;
        font-size: 14px;
        color: #1c1c1e;
        box-shadow: 0 1px 4px rgba(0,0,0,0.06);
        border: 0.5px solid rgba(0,0,0,0.08);
      }
      .ios-home-indicator {
        width: 134px;
        height: 5px;
        background: #000000;
        border-radius: 3px;
        margin-top: 14px;
      }
    `;
    document.head.appendChild(style);

    const statusBar = document.createElement('div');
    statusBar.id = 'ios-safari-frame-overlay';
    statusBar.className = 'ios-status-bar';
    statusBar.innerHTML = `
      <span style="letter-spacing: -0.2px;">9:41</span>
      <div class="ios-dynamic-island"></div>
      <div class="ios-status-right">
        <svg width="18" height="12" viewBox="0 0 18 12" fill="none"><rect x="0.5" y="7" width="3" height="5" rx="0.8" fill="black"/><rect x="5" y="5" width="3" height="7" rx="0.8" fill="black"/><rect x="9.5" y="2.5" width="3" height="9.5" rx="0.8" fill="black"/><rect x="14" y="0.5" width="3" height="11.5" rx="0.8" fill="black"/></svg>
        <span style="font-size: 12px; font-weight: 700; margin-right: 1px;">5G</span>
        <svg width="25" height="12" viewBox="0 0 25 12" fill="none"><rect x="0.75" y="0.75" width="20.5" height="10.5" rx="3.5" stroke="black" stroke-opacity="0.4" stroke-width="1.5"/><rect x="2.5" y="2.5" width="17" height="7" rx="2" fill="black"/><path d="M23 4C23.8 4.7 23.8 7.3 23 8" stroke="black" stroke-width="1.2" stroke-linecap="round"/></svg>
      </div>
    `;

    const bottomBar = document.createElement('div');
    bottomBar.className = 'ios-safari-bottom-bar';
    bottomBar.innerHTML = `
      <div class="ios-url-capsule">
        <span style="font-size: 13px; font-weight: 600; color: #636366;">aA</span>
        <div style="display: flex; align-items: center; gap: 6px;">
          <svg width="12" height="14" viewBox="0 0 12 14" fill="none"><path d="M9.5 6H9V4.5C9 2.8 7.7 1.5 6 1.5C4.3 1.5 3 2.8 3 4.5V6H2.5C1.9 6 1.5 6.4 1.5 7V11.5C1.5 12.1 1.9 12.5 2.5 12.5H9.5C10.1 12.5 10.5 12.1 10.5 11.5V7C10.5 6.4 10.1 6 9.5 6ZM4.2 4.5C4.2 3.5 5 2.7 6 2.7C7 2.7 7.8 3.5 7.8 4.5V6H4.2V4.5Z" fill="#3A3A3C"/></svg>
          <span style="font-weight: 500; font-size: 13px; letter-spacing: -0.1px;">mobile-devtools.dewasemadi3.workers.dev</span>
        </div>
        <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M13.5 8C13.5 11 11 13.5 8 13.5C5 13.5 2.5 11 2.5 8C2.5 5 5 2.5 8 2.5C10.2 2.5 12.1 3.8 13 5.7M13 2.5V5.7H9.8" stroke="#007AFF" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </div>
      <div class="ios-home-indicator"></div>
    `;

    document.body.appendChild(statusBar);
    document.body.appendChild(bottomBar);
  });
};

test.describe('Automated Documentation Screenshots (Mobile Light Mode)', () => {
  test.use({
    viewport: { width: 430, height: 932 }, // iPhone 14 / 15 Pro Max viewport
    deviceScaleFactor: 3, // High-DPI Super Retina HD mobile screenshot
    isMobile: true,
    hasTouch: true,
    colorScheme: 'light',
  });

  test.beforeAll(() => {
    if (!fs.existsSync(rootOutputDir)) {
      fs.mkdirSync(rootOutputDir, { recursive: true });
    }
    if (!fs.existsSync(packageOutputDir)) {
      fs.mkdirSync(packageOutputDir, { recursive: true });
    }
  });

  test('generate light mode mobile screenshots for all 5 tabs', async ({ page }) => {
    // 1. Force web app host page to Light Mode in localStorage
    await page.addInitScript(() => {
      localStorage.setItem('vite-theme', 'light');
    });

    await page.goto('/');

    // Ensure host page HTML element has light class & light background
    await page.evaluate(() => {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    });

    // 2. Seed rich data into Console, Network, and Storage
    await page.getByRole('button', { name: 'console.log()' }).click();
    await page.getByRole('button', { name: 'console.warn()' }).click();
    await page.getByRole('button', { name: 'console.error()' }).click();

    await page.getByRole('button', { name: 'GET /users/1 (200)' }).click();
    await page.getByRole('button', { name: 'PUT /posts/999999 (404)' }).click();
    await page.getByRole('button', { name: 'POST /posts (500 Danger)' }).click();

    await page.getByRole('button', { name: 'Set localStorage' }).click();
    await page.getByRole('button', { name: 'Set sessionStorage' }).click();
    await page.getByRole('button', { name: 'Set Cookie' }).click();
    await page.getByRole('button', { name: 'Seed IndexedDB' }).click();

    // 3. Open Mobile DevTools Drawer
    const badge = page.locator('.devtools-badge');
    await badge.click();

    const drawer = page.locator('.devtools-drawer');
    await expect(drawer).toHaveClass(/open/);

    // 4. Ensure DevTools Overlay Theme is Light Mode
    const devtoolsContainer = page.locator('.mobile-devtools-container');
    const isDark = await devtoolsContainer.evaluate((el) => el.classList.contains('theme-dark'));
    if (isDark) {
      const modeBtn = page.locator('button[title*="Mode"]');
      await modeBtn.click();
      await expect(devtoolsContainer).toHaveClass(/theme-light/);
    }

    // 5. Inject Realistic iOS Safari Status Bar & Address Bar Overlay
    await injectIosSafariFrame(page);

    // Give UI a moment to settle
    await page.waitForTimeout(400);

    // 6. Capture Console Tab: 01-console-light.png
    await page.locator('.devtools-tab-btn', { hasText: 'Console' }).click();
    await page.waitForTimeout(300);
    await saveScreenshotToBothDirs(page, '01-console-light.png');

    // 7. Capture Elements Tab: 02-elements-light.png
    await page.locator('.devtools-tab-btn', { hasText: 'Elements' }).click();
    await page.waitForTimeout(300);
    await saveScreenshotToBothDirs(page, '02-elements-light.png');

    // 8. Capture Network Tab: 03-network-light.png
    await page.locator('.devtools-tab-btn', { hasText: 'Network' }).click();
    await page.waitForTimeout(300);
    await saveScreenshotToBothDirs(page, '03-network-light.png');

    // 9. Capture Network Request Detail Modal: 04-network-detail-light.png (GET 200 Success Request)
    const networkRow = page.locator('.devtools-network-row', { hasText: 'users/1' }).first();
    if (await networkRow.isVisible()) {
      await networkRow.click();
      await page.waitForTimeout(300);
      await saveScreenshotToBothDirs(page, '04-network-detail-light.png');

      const backBtn = page.locator('button[title="Back to request list"]');
      if (await backBtn.isVisible()) {
        await backBtn.click();
        await page.waitForTimeout(300);
      }
    }

    // 10. Capture Storage Tab: 05-storage-light.png
    await page.locator('.devtools-tab-btn', { hasText: 'Storage' }).click();
    await page.waitForTimeout(300);
    await saveScreenshotToBothDirs(page, '05-storage-light.png');

    // 11. Capture System Tab: 06-system-light.png
    await page.locator('.devtools-tab-btn', { hasText: 'System' }).click();
    await page.waitForTimeout(300);
    await saveScreenshotToBothDirs(page, '06-system-light.png');
  });
});
