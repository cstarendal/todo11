import { _electron as electron, ElectronApplication, Page } from 'playwright';
import { test, expect } from '@playwright/test';

// Path to your Electron app's main process file
const electronAppPath = './dist/main.js';

test('Electron app UI is visible', async () => {
  const app: ElectronApplication = await electron.launch({
    args: [electronAppPath],
  });
  const window: Page = await app.firstWindow();
  await window.waitForSelector('text=Task Manager', { timeout: 5000 });
  const isVisible = await window.isVisible('text=Task Manager');
  expect(isVisible).toBe(true);
  await app.close();
}); 