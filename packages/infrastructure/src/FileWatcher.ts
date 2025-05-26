import * as fs from 'fs';
import * as path from 'path';

/**
 * File system event types for multi-device sync detection
 */
export type FileEventType = 'created' | 'modified' | 'deleted';

/**
 * File system event data structure
 */
export interface FileEvent {
  type: FileEventType;
  path: string;
  timestamp: Date;
}

/**
 * Interface for file watching - foundation for multi-device sync
 * Detects when other devices/processes modify files
 */
export interface IFileWatcher {
  /**
   * Start watching a file for changes
   * @param filePath - Path to the file to watch
   * @param callback - Function called when file changes are detected
   */
  watch(filePath: string, callback: (event: FileEvent) => void): Promise<void>;

  /**
   * Stop watching a file
   * @param filePath - Path to stop watching
   */
  unwatch(filePath: string): Promise<void>;
}

/**
 * Node.js implementation of file watcher using fs.watch
 * Detects changes from other processes/devices for multi-device sync
 */
export class NodeFileWatcher implements IFileWatcher {
  private watchers = new Map<string, fs.FSWatcher>();
  private callbacks = new Map<string, (event: FileEvent) => void>();

  async watch(filePath: string, callback: (event: FileEvent) => void): Promise<void> {
    // Stop any existing watcher for this path
    await this.unwatch(filePath);

    // Store callback for this path
    this.callbacks.set(filePath, callback);

    try {
      // Watch the directory containing the file to detect creation/deletion
      const dir = path.dirname(filePath);
      const filename = path.basename(filePath);
      
      // Check if file exists initially
      let fileExists = false;
      try {
        await fs.promises.access(filePath);
        fileExists = true;
      } catch {
        // File doesn't exist yet
      }

      const watcher = fs.watch(dir, (eventType, changedFilename) => {
        if (changedFilename === filename) {
          this.handleFileChange(filePath, fileExists, callback);
        }
      });

      this.watchers.set(filePath, watcher);

    } catch (error) {
      throw new Error(`Failed to watch file ${filePath}: ${error}`);
    }
  }

  async unwatch(filePath: string): Promise<void> {
    const watcher = this.watchers.get(filePath);
    if (watcher) {
      watcher.close();
      this.watchers.delete(filePath);
      this.callbacks.delete(filePath);
    }
  }

  private async handleFileChange(
    filePath: string, 
    wasExisting: boolean, 
    callback: (event: FileEvent) => void
  ): Promise<void> {
    try {
      const exists = await fs.promises.access(filePath).then(() => true).catch(() => false);
      
      let fileEventType: FileEventType;
      
      if (!wasExisting && exists) {
        fileEventType = 'created';
      } else if (wasExisting && !exists) {
        fileEventType = 'deleted';
      } else if (exists) {
        fileEventType = 'modified';
      } else {
        // No clear event type determined
        return;
      }

      callback({
        type: fileEventType,
        path: filePath,
        timestamp: new Date()
      });

    } catch (error) {
      // Ignore errors in event handling to prevent crashes
      // Note: In production, consider proper logging instead
    }
  }
}
