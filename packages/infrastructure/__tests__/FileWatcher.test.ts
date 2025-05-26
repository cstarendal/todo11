import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import * as fs from 'fs';
import * as path from 'path';
import { IFileWatcher, FileEvent, NodeFileWatcher } from '../src/index';

describe('FileWatcher', () => {
  let watcher: IFileWatcher;
  let testDir: string;
  let testFile: string;

  beforeEach(async () => {
    // Create a temporary directory for each test
    testDir = path.join(__dirname, 'temp-watch-data', `test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
    await fs.promises.mkdir(testDir, { recursive: true });
    testFile = path.join(testDir, 'test.json');
    watcher = new NodeFileWatcher();
  });

  afterEach(async () => {
    // Stop watching and clean up
    try {
      await watcher.unwatch(testFile);
      await fs.promises.rm(testDir, { recursive: true, force: true });
    } catch (error) {
      // Ignore cleanup errors
    }
  });

  it('should implement IFileWatcher interface', () => {
    expect(watcher).toBeDefined();
    expect(typeof watcher.watch).toBe('function');
    expect(typeof watcher.unwatch).toBe('function');
  });

  it('should detect file creation events', async () => {
    const events: FileEvent[] = [];
    const eventPromise = new Promise<void>((resolve) => {
      const callback = (event: FileEvent) => {
        events.push(event);
        if (event.type === 'created') {
          resolve();
        }
      };
      watcher.watch(testFile, callback);
    });

    // Create the file after a small delay to ensure watcher is set up
    setTimeout(async () => {
      await fs.promises.writeFile(testFile, JSON.stringify({ test: 'data' }));
    }, 100);
    
    // Wait for event
    await eventPromise;
    
    expect(events).toHaveLength(1);
    expect(events[0].type).toBe('created');
    expect(events[0].path).toBe(testFile);
    expect(events[0].timestamp).toBeInstanceOf(Date);
  }, 10000);

  it('should detect file modification events', async () => {
    // Create file first
    await fs.promises.writeFile(testFile, JSON.stringify({ initial: 'data' }));
    
    const events: FileEvent[] = [];
    const eventPromise = new Promise<void>((resolve) => {
      const callback = (event: FileEvent) => {
        events.push(event);
        if (event.type === 'modified') {
          resolve();
        }
      };
      watcher.watch(testFile, callback);
    });

    // Modify the file after a small delay
    setTimeout(async () => {
      await fs.promises.writeFile(testFile, JSON.stringify({ modified: 'data' }));
    }, 100);

    // Wait for event
    await eventPromise;
    
    expect(events.some(e => e.type === 'modified')).toBe(true);
    const modifiedEvent = events.find(e => e.type === 'modified');
    expect(modifiedEvent?.path).toBe(testFile);
  }, 10000);

  it('should detect file deletion events', async () => {
    // Create file first
    await fs.promises.writeFile(testFile, JSON.stringify({ test: 'data' }));
    
    const events: FileEvent[] = [];
    const eventPromise = new Promise<void>((resolve) => {
      const callback = (event: FileEvent) => {
        events.push(event);
        if (event.type === 'deleted') {
          resolve();
        }
      };
      watcher.watch(testFile, callback);
    });

    // Delete the file after a small delay
    setTimeout(async () => {
      await fs.promises.unlink(testFile);
    }, 100);

    // Wait for event
    await eventPromise;
    
    expect(events.some(e => e.type === 'deleted')).toBe(true);
    const deletedEvent = events.find(e => e.type === 'deleted');
    expect(deletedEvent?.path).toBe(testFile);
  }, 10000);

  it('should stop watching when unwatch is called', async () => {
    const events: FileEvent[] = [];
    const callback = (event: FileEvent) => {
      events.push(event);
    };

    // Start watching
    await watcher.watch(testFile, callback);
    
    // Stop watching
    await watcher.unwatch(testFile);
    
    // Create a file after unwatching
    await fs.promises.writeFile(testFile, JSON.stringify({ test: 'data' }));
    
    // Wait a bit to see if any events are triggered
    await new Promise(resolve => setTimeout(resolve, 300));

    // No events should be detected after unwatching
    expect(events).toHaveLength(0);
  }, 10000);

  it('should not trigger an event if file does not exist and is not created', async () => {
    const events: FileEvent[] = [];
    const callback = (event: FileEvent) => {
      events.push(event);
    };
    await watcher.watch(testFile, callback);
    // Simulate a change in the directory without creating the file
    const dir = path.dirname(testFile);
    fs.watchFile(dir, () => {
      // Do nothing, file is not created
    });
    // Wait a bit to see if any events are triggered
    await new Promise(resolve => setTimeout(resolve, 300));
    expect(events).toHaveLength(0);
    fs.unwatchFile(dir);
  }, 10000);

  it('should handle fs.promises.access throwing an error', async () => {
    const events: FileEvent[] = [];
    const callback = (event: FileEvent) => {
      events.push(event);
    };
    // Mock fs.promises.access to throw an error
    const accessSpy = jest.spyOn(fs.promises, 'access').mockRejectedValue(new Error('Access error'));
    await watcher.watch(testFile, callback);
    // Simulate a change in the directory
    const dir = path.dirname(testFile);
    fs.watchFile(dir, () => {
      // Trigger a change
    });
    // Wait a bit to see if any events are triggered
    await new Promise(resolve => setTimeout(resolve, 300));
    expect(events).toHaveLength(0);
    fs.unwatchFile(dir);
    // Restore original fs.promises.access
    accessSpy.mockRestore();
  }, 10000);
});
