import { _electron as electron, ElectronApplication, Page } from 'playwright';
import { test, expect } from '@playwright/test';

const electronAppPath = './dist/main.js';

test('Electron UI renders with Tailwind CSS (bg-gray-100 present)', async () => {
  const app: ElectronApplication = await electron.launch({
    args: [electronAppPath],
  });
  const window: Page = await app.firstWindow();
  await window.waitForSelector('.bg-gray-100', { timeout: 60000 });
  const bgColor = await window.$eval('.bg-gray-100', function(el) {
    // @ts-ignore
    return window.getComputedStyle(el).backgroundColor;
  });
  expect(bgColor).toBe('rgb(243, 244, 246)'); // Tailwind bg-gray-100
  await app.close();
}); 