import { FileSyncManager } from 'task11-infrastructure';
import { FileSyncConfigManager } from 'task11-infrastructure';
import { Task } from 'task11-domain';
import * as fs from 'fs/promises';
import * as path from 'path';

describe('FileSyncManager integration', () => {
  const config = FileSyncConfigManager.getDefaultConfig();
  const tasksFile = path.join(config.storageDir, 'tasks.json');
  let syncManager: FileSyncManager;

  beforeEach(async () => {
    // Clean up tasks file before each test
    await fs.rm(config.storageDir, { recursive: true, force: true });
    syncManager = new FileSyncManager(config.storageDir);
    await syncManager.start();
  });

  afterEach(async () => {
    await syncManager.stop();
    await fs.rm(config.storageDir, { recursive: true, force: true });
  });

  it('should persist tasks to disk and detect external changes', async () => {
    const repo = syncManager.getRepository();
    const task = new Task('Integration test', 't1', 'desc', false);
    await repo.add(task);

    // Check file exists and contains the task
    const fileData = await fs.readFile(tasksFile, 'utf-8');
    expect(fileData).toContain('Integration test');

    // Simulate external modification
    const newTask = { id: 't2', title: 'External', description: '', completed: false };
    const tasksArr = [task, newTask];
    await fs.writeFile(tasksFile, JSON.stringify(tasksArr, null, 2), 'utf-8');

    // Wait for watcher to pick up change
    await new Promise((resolve) => setTimeout(resolve, 200));
    const allTasks = await repo.getAll();
    expect(allTasks.length).toBe(2);
    expect(allTasks.some(t => t.id === 't2')).toBe(true);
  });
}); 