import { _electron as electron, ElectronApplication, Page } from 'playwright';
import { test, expect } from '@playwright/test';

const electronAppPath = './dist/main.js';

test('User can open settings, pick a storage folder, and see the new path', async () => {
  const app: ElectronApplication = await electron.launch({
    args: [electronAppPath],
  });
  const window: Page = await app.firstWindow();

  // Open settings (assume a button with data-testid="open-settings")
  await window.click('[data-testid="open-settings"]');

  // Click "Change Folder" (assume a button with data-testid="choose-folder")
  await window.click('[data-testid="choose-folder"]');

  // Simulate folder selection (Playwright cannot interact with native dialogs, so this will fail until implemented)
  // After implementation, the UI should show the new path (assume a span with data-testid="storage-path")
  const storagePath = await window.textContent('[data-testid="storage-path"]');
  expect(storagePath).toContain('/'); // Should show a path

  await app.close();
}); 