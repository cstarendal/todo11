import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { FileSyncManager } from '../src/FileSyncManager';
import { Task } from 'task11-domain';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';

describe('FileSyncManager', () => {
  let testDir: string;
  let syncManager1: FileSyncManager;
  let syncManager2: FileSyncManager;

  beforeEach(async () => {
    testDir = await fs.mkdtemp(path.join(os.tmpdir(), 'filesync-'));
    syncManager1 = new FileSyncManager(testDir);
    syncManager2 = new FileSyncManager(testDir);
  });

  afterEach(async () => {
    await syncManager1.stop();
    await syncManager2.stop();
    await fs.rm(testDir, { recursive: true, force: true });
  });

  it('should provide access to repository', () => {
    const repository = syncManager1.getRepository();
    expect(repository).toBeDefined();
    expect(typeof repository.add).toBe('function');
    expect(typeof repository.getAll).toBe('function');
  });

  it('should start and stop file watching', async () => {
    await syncManager1.start();
    await syncManager1.stop();
    // Should not throw errors
  });

  it('should handle multiple start/stop calls gracefully', async () => {
    await syncManager1.start();
    await syncManager1.start(); // Should not throw
    await syncManager1.stop();
    await syncManager1.stop(); // Should not throw
  });

  it('should notify callbacks when tasks change through file system', async () => {
    const callbackEvents: Task[][] = [];
    
    syncManager1.onTasksChanged((tasks) => {
      callbackEvents.push([...tasks]);
    });

    await syncManager1.start();

    // Give the file watcher time to initialize
    await new Promise(resolve => setTimeout(resolve, 100));

    // Add a task through the second sync manager
    const task = new Task('Test Task', 'test-1', 'Test Description');
    await syncManager2.getRepository().add(task);

    // Wait for file watcher to detect the change
    await new Promise(resolve => setTimeout(resolve, 200));

    // Should have received notification about the new task
    expect(callbackEvents.length).toBeGreaterThanOrEqual(1);
    const latestTasks = callbackEvents[callbackEvents.length - 1];
    expect(latestTasks).toHaveLength(1);
    expect(latestTasks[0].title).toBe('Test Task');
  }, 10000);

  it('should handle callback errors gracefully', async () => {
    let callbackExecuted = false;

    // Add a callback that throws an error
    syncManager1.onTasksChanged(() => {
      throw new Error('Callback error');
    });

    // Add a callback that should still work
    syncManager1.onTasksChanged(() => {
      callbackExecuted = true;
    });

    await syncManager1.start();
    await new Promise(resolve => setTimeout(resolve, 100));

    // Add a task to trigger callbacks
    const task = new Task('Test Task', 'test-1', 'Test Description');
    await syncManager2.getRepository().add(task);

    await new Promise(resolve => setTimeout(resolve, 200));

    // The second callback should have executed despite the first one throwing
    expect(callbackExecuted).toBe(true);
  }, 10000);

  it('should sync real-time changes between multiple sync managers', async () => {
    const manager1Events: Task[][] = [];
    const manager2Events: Task[][] = [];

    syncManager1.onTasksChanged((tasks) => {
      manager1Events.push([...tasks]);
    });

    syncManager2.onTasksChanged((tasks) => {
      manager2Events.push([...tasks]);
    });

    await syncManager1.start();
    await syncManager2.start();

    await new Promise(resolve => setTimeout(resolve, 100));

    // Add task through manager 1
    const task1 = new Task('Task 1', 'task-1', 'First task');
    await syncManager1.getRepository().add(task1);

    await new Promise(resolve => setTimeout(resolve, 200));

    // Add task through manager 2
    const task2 = new Task('Task 2', 'task-2', 'Second task');
    await syncManager2.getRepository().add(task2);

    await new Promise(resolve => setTimeout(resolve, 200));

    // Both managers should eventually see both tasks
    const finalTasks1 = await syncManager1.getRepository().getAll();
    const finalTasks2 = await syncManager2.getRepository().getAll();

    expect(finalTasks1).toHaveLength(2);
    expect(finalTasks2).toHaveLength(2);

    const titles1 = finalTasks1.map(t => t.title).sort();
    const titles2 = finalTasks2.map(t => t.title).sort();

    expect(titles1).toEqual(['Task 1', 'Task 2']);
    expect(titles2).toEqual(['Task 1', 'Task 2']);

    // Both managers should have received change notifications
    expect(manager1Events.length).toBeGreaterThanOrEqual(1);
    expect(manager2Events.length).toBeGreaterThanOrEqual(1);
  }, 15000);
});
