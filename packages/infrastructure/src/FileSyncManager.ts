import { FileTaskRepository } from './FileTaskRepository';
import { IFileWatcher, NodeFileWatcher, FileEvent } from './FileWatcher';
import { Task } from 'task11-domain';
import * as path from 'path';

export interface IFileSyncManager {
  start(): Promise<void>;
  stop(): Promise<void>;
  onTasksChanged(callback: (tasks: Task[]) => void): void;
  getRepository(): FileTaskRepository;
}

export class FileSyncManager implements IFileSyncManager {
  private readonly repository: FileTaskRepository;
  private readonly watcher: IFileWatcher;
  private readonly tasksFile: string;
  private readonly callbacks: Array<(tasks: Task[]) => void> = [];
  private isWatching = false;

  constructor(dataDir: string, watcher?: IFileWatcher) {
    this.repository = new FileTaskRepository(dataDir);
    this.watcher = watcher || new NodeFileWatcher();
    this.tasksFile = path.join(dataDir, 'tasks.json');
  }

  async start(): Promise<void> {
    if (this.isWatching) {
      return;
    }

    // Start watching the tasks file for changes
    await this.watcher.watch(this.tasksFile, (event: FileEvent) => {
      this.handleFileChange(event);
    });

    this.isWatching = true;
  }

  async stop(): Promise<void> {
    if (!this.isWatching) {
      return;
    }

    await this.watcher.unwatch(this.tasksFile);
    this.isWatching = false;
  }

  onTasksChanged(callback: (tasks: Task[]) => void): void {
    this.callbacks.push(callback);
  }

  getRepository(): FileTaskRepository {
    return this.repository;
  }

  private async handleFileChange(event: FileEvent): Promise<void> {
    if (event.type === 'modified' || event.type === 'created') {
      try {
        // Load the updated tasks and notify all callbacks
        const tasks = await this.repository.getAll();
        this.callbacks.forEach(callback => {
          try {
            callback(tasks);
          } catch (error) {
            // Silently handle callback errors to prevent disrupting other callbacks
            // In production, this could be logged to a proper logging service
          }
        });
      } catch (error) {
        // Silently handle file change errors
        // In production, this could be logged to a proper logging service
      }
    }
  }
}
