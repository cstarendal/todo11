# Test info

- Name: Electron app UI is visible
- Location: /Users/cstarendal/Resilio Sync/Code/TODO 11/packages/electron-app/tests/e2e/e2e-ui-visible.spec.ts:7:5

# Error details

```
TimeoutError: page.waitForSelector: Timeout 5000ms exceeded.
Call log:
  - waiting for locator('text=Task Manager') to be visible

    at /Users/cstarendal/Resilio Sync/Code/TODO 11/packages/electron-app/tests/e2e/e2e-ui-visible.spec.ts:12:16
```

# Test source

```ts
   1 | import { _electron as electron, ElectronApplication, Page } from 'playwright';
   2 | import { test, expect } from '@playwright/test';
   3 |
   4 | // Path to your Electron app's main process file
   5 | const electronAppPath = './dist/main.js';
   6 |
   7 | test('Electron app UI is visible', async () => {
   8 |   const app: ElectronApplication = await electron.launch({
   9 |     args: [electronAppPath],
  10 |   });
  11 |   const window: Page = await app.firstWindow();
> 12 |   await window.waitForSelector('text=Task Manager', { timeout: 5000 });
     |                ^ TimeoutError: page.waitForSelector: Timeout 5000ms exceeded.
  13 |   const isVisible = await window.isVisible('text=Task Manager');
  14 |   expect(isVisible).toBe(true);
  15 |   await app.close();
  16 | }); 
```