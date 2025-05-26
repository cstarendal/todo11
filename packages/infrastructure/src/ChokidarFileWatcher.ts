import { IFileWatcher, FileEvent, FileEventType } from './FileWatcher';
import chokidar, { FSWatcher } from 'chokidar';
import * as path from 'path';

export class ChokidarFileWatcher implements IFileWatcher {
  private watchers = new Map<string, FSWatcher>();

  async watch(filePath: string, callback: (event: FileEvent) => void): Promise<void> {
    await this.unwatch(filePath);

    const dir = path.dirname(filePath);
    const filename = path.basename(filePath);

    // Initialize chokidar watcher on the parent dir
    const watcher = chokidar.watch(dir, {
      ignoreInitial: true,
      depth: 0,
    });

    const handler = (eventType: FileEventType) => {
      callback({ path: filePath, type: eventType, timestamp: new Date() });
    };

    watcher
      .on('add', (changed) => {
        if (path.basename(changed) === filename) handler('created');
      })
      .on('change', (changed) => {
        if (path.basename(changed) === filename) handler('modified');
      })
      .on('unlink', (changed) => {
        if (path.basename(changed) === filename) handler('deleted');
      });

    this.watchers.set(filePath, watcher);
  }

  async unwatch(filePath: string): Promise<void> {
    const watcher = this.watchers.get(filePath);
    if (watcher) {
      await watcher.close();
      this.watchers.delete(filePath);
    }
  }
} 