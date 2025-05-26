import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import * as fs from 'fs/promises';
import * as path from 'path';
import { Task } from 'task11-domain';
import { FileTaskRepository, IFileWatcher, NodeFileWatcher } from '../src/index';

describe('File-Sync Integration', () => {
  let repository1: FileTaskRepository;
  let repository2: FileTaskRepository;
  let testDir: string;
  let storageDir: string;
  let watcher: IFileWatcher;

  beforeEach(async () => {
    // Create temporary directory for test
    testDir = path.join(__dirname, 'temp-sync-data', `test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
    storageDir = path.join(testDir, 'TaskApp');
    await fs.mkdir(storageDir, { recursive: true });
    
    // Create two repository instances simulating different devices
    repository1 = new FileTaskRepository(storageDir);
    repository2 = new FileTaskRepository(storageDir);
    
    watcher = new NodeFileWatcher();
  });

  afterEach(async () => {
    try {
      await fs.rm(testDir, { recursive: true, force: true });
    } catch (error) {
      // Ignore cleanup errors
    }
  });

  it('should sync tasks between two repository instances through file system', async () => {
    // Device 1 creates a task
    const task = new Task('Test sync task', 'sync-1', 'Test sync description');
    await repository1.add(task);
    
    // Device 2 should see the task after reloading
    const tasksFromDevice2 = await repository2.getAll();
    
    expect(tasksFromDevice2).toHaveLength(1);
    expect(tasksFromDevice2[0].title).toBe('Test sync task');
    expect(tasksFromDevice2[0].id).toBe('sync-1');
  });

  it('should detect file changes from external modifications', async () => {
    const filePath = path.join(storageDir, 'tasks.json');
    
    // Create initial task
    const task = new Task('Initial task', 'initial-1', 'Initial description');
    await repository1.add(task);
    
    const events: any[] = [];
    const eventPromise = new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Timeout waiting for file change event'));
      }, 8000);
      
      const callback = (event: any) => {
        events.push(event);
        if (event.type === 'modified') {
          clearTimeout(timeout);
          resolve();
        }
      };
      watcher.watch(filePath, callback);
    });
    
    // Simulate external modification (another device) after a delay
    setTimeout(async () => {
      const task2 = new Task('External task', 'external-1', 'Added by another device');
      await repository2.add(task2);
    }, 200);
    
    try {
      // Wait for file change detection
      await eventPromise;
      
      expect(events.some(e => e.type === 'modified')).toBe(true);
    } finally {
      await watcher.unwatch(filePath);
    }
  }, 10000);

  it('should maintain data consistency during concurrent modifications', async () => {
    // Create initial tasks from different "devices"
    const task1 = new Task('Task from device 1', 'device1-1', 'Description 1');
    const task2 = new Task('Task from device 2', 'device2-1', 'Description 2');
    
    // Save concurrently (simulating different devices)
    await Promise.all([
      repository1.add(task1),
      repository2.add(task2)
    ]);
    
    // Both devices should eventually see both tasks
    const allTasks = await repository1.getAll();
    expect(allTasks).toHaveLength(2);
    
    const titles = allTasks.map(t => t.title).sort();
    expect(titles).toEqual(['Task from device 1', 'Task from device 2']);
  });

  it('should handle Synology Drive path configuration', async () => {
    // Test with Synology Drive-like path structure
    const synologyPath = path.join(testDir, 'Synology Drive', 'TaskApp');
    await fs.mkdir(synologyPath, { recursive: true });
    
    const synologyRepo = new FileTaskRepository(synologyPath);
    
    const task = new Task('Synology task', 'synology-1', 'Stored in Synology Drive');
    await synologyRepo.add(task);
    
    // Verify file is created in correct location
    const filePath = path.join(synologyPath, 'tasks.json');
    const fileExists = await fs.access(filePath).then(() => true).catch(() => false);
    expect(fileExists).toBe(true);
    
    // Verify task can be loaded
    const loadedTasks = await synologyRepo.getAll();
    expect(loadedTasks).toHaveLength(1);
    expect(loadedTasks[0].title).toBe('Synology task');
  });
});
