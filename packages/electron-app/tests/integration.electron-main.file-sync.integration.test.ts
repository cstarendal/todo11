import { FileSyncConfigManager } from 'task11-infrastructure';
import { FileSyncManager } from 'task11-infrastructure';
import { Task } from 'task11-domain';
import * as fs from 'fs/promises';
import * as path from 'path';

describe('Electron main process + FileSyncManager integration', () => {
  const config = FileSyncConfigManager.getDefaultConfig();
  const tasksFile = path.join(config.storageDir, 'tasks.json');
  let syncManager: FileSyncManager;

  beforeEach(async () => {
    await fs.rm(config.storageDir, { recursive: true, force: true });
    syncManager = new FileSyncManager(config.storageDir);
    await syncManager.start();
  });

  afterEach(async () => {
    await syncManager.stop();
    await fs.rm(config.storageDir, { recursive: true, force: true });
  });

  it('should persist tasks via repository and load them via IPC', async () => {
    // Simulate Electron main process handlers
    const repo = syncManager.getRepository();
    const task = new Task('IPC test', 'ipc1', 'desc', false);
    await repo.add(task);

    // Simulate IPC handler for get-tasks
    const loadedTasks = await repo.getAll();
    expect(loadedTasks.length).toBe(1);
    expect(loadedTasks[0].title).toBe('IPC test');

    // Simulate app restart: new manager loads from disk
    const syncManager2 = new FileSyncManager(config.storageDir);
    await syncManager2.start();
    const repo2 = syncManager2.getRepository();
    const loadedTasks2 = await repo2.getAll();
    expect(loadedTasks2.length).toBe(1);
    expect(loadedTasks2[0].title).toBe('IPC test');
    await syncManager2.stop();
  });
}); 