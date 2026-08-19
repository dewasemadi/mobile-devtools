import { expect, test } from '@playwright/test';

test.describe('Storage Tab E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Pre-populate storage items
    await page.evaluate(() => {
      localStorage.setItem('e2e_key', 'e2e_val');
      sessionStorage.setItem('session_key', 'session_val');
    });
  });

  test('should list localStorage items and allow adding a new key-value pair', async ({ page }) => {
    await page.locator('.devtools-badge').click();
    await page.locator('.devtools-tab-btn', { hasText: 'Storage' }).click();

    const listScroll = page.locator('.devtools-list-scroll');
    await expect(listScroll).toContainText('e2e_key');
    await expect(listScroll).toContainText('e2e_val');

    // Click '+' button to add new item
    const addBtn = page.locator('.devtools-toolbar button[title="Add new key-value pair"]');
    await addBtn.click();

    const keyInput = page.locator('input[placeholder="Key..."]');
    const valInput = page.locator('input[placeholder="Value..."]');
    const saveBtn = page.locator('button[title="Save"]');

    await keyInput.fill('new_e2e_key');
    await valInput.fill('new_e2e_val');
    await saveBtn.click();

    await expect(listScroll).toContainText('new_e2e_key');
    await expect(listScroll).toContainText('new_e2e_val');
  });

  test('should switch storage select options between localStorage and sessionStorage', async ({
    page,
  }) => {
    await page.locator('.devtools-badge').click();
    await page.locator('.devtools-tab-btn', { hasText: 'Storage' }).click();

    const select = page.locator('select.devtools-select');
    await select.selectOption('sessionStorage');

    const listScroll = page.locator('.devtools-list-scroll');
    await expect(listScroll).toContainText('session_key');
    await expect(listScroll).toContainText('session_val');
  });

  test('should filter storage items via search input', async ({ page }) => {
    await page.locator('.devtools-badge').click();
    await page.locator('.devtools-tab-btn', { hasText: 'Storage' }).click();

    const searchInput = page.locator('input.devtools-search-input');
    await searchInput.fill('e2e_key');

    const listScroll = page.locator('.devtools-list-scroll');
    await expect(listScroll).toContainText('e2e_key');
  });
});
