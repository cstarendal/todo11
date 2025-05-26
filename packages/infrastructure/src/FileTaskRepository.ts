import * as fs from 'fs/promises';
import * as path from 'path';
import { Task } from 'task11-domain';
import { ITaskRepository } from 'task11-shared';

interface FileSystemError extends Error {
  code?: string;
}

export class FileTaskRepository implements ITaskRepository {
  private readonly dataDir: string;
  private readonly tasksFile: string;
  private readonly lockFile: string;
  private readonly maxRetries = 3;
  private readonly retryDelay = 50; // ms

  constructor(dataDir: string) {
    this.dataDir = dataDir;
    this.tasksFile = path.join(dataDir, 'tasks.json');
    this.lockFile = path.join(dataDir, 'tasks.json.lock');
  }

  async add(task: Task): Promise<void> {
    await this.withLock(async () => {
      const tasks = await this.loadTasks();
      tasks.push(task);
      await this.saveTasks(tasks);
    });
  }

  async getAll(): Promise<Task[]> {
    return await this.loadTasks();
  }

  async getById(id: string): Promise<Task | null> {
    const tasks = await this.loadTasks();
    const task = tasks.find(t => t.id === id);
    return task || null;
  }

  async update(task: Task): Promise<void> {
    await this.withLock(async () => {
      const tasks = await this.loadTasks();
      const index = tasks.findIndex(t => t.id === task.id);
      if (index === -1) {
        throw new Error(`Task with id ${task.id} not found`);
      }
      tasks[index] = task;
      await this.saveTasks(tasks);
    });
  }

  private async withLock<T>(operation: () => Promise<T>): Promise<T> {
    for (let attempt = 0; attempt < this.maxRetries; attempt++) {
      try {
        await this.acquireLock();
        try {
          return await operation();
        } finally {
          await this.releaseLock();
        }
      } catch (error) {
        if (attempt === this.maxRetries - 1) {
          throw error;
        }
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, this.retryDelay * (attempt + 1)));
      }
    }
    throw new Error('Failed to acquire lock after maximum retries');
  }

  private async acquireLock(): Promise<void> {
    try {
      // Ensure directory exists
      await fs.mkdir(this.dataDir, { recursive: true });
      
      // Try to create lock file (exclusive operation)
      await fs.writeFile(this.lockFile, process.pid.toString(), { flag: 'wx' });
    } catch (error) {
      if ((error as FileSystemError).code === 'EEXIST') {
        throw new Error('Lock file already exists');
      }
      throw error;
    }
  }

  private async releaseLock(): Promise<void> {
    try {
      await fs.unlink(this.lockFile);
    } catch (error) {
      // Ignore errors when releasing lock (file might not exist)
    }
  }

  private async loadTasks(): Promise<Task[]> {
    try {
      const data = await fs.readFile(this.tasksFile, 'utf-8');
      const tasksData = JSON.parse(data);
      
      // Validate that tasksData is an array
      if (!Array.isArray(tasksData)) {
        throw new Error(`Invalid tasks file format: expected array, got ${typeof tasksData}`);
      }
      
      // Convert plain objects back to Task instances with validation
      return tasksData.map((taskData: any, index: number) => {
        if (!taskData || typeof taskData !== 'object') {
          throw new Error(`Invalid task data at index ${index}: expected object, got ${typeof taskData}`);
        }
        if (!taskData.title || !taskData.id) {
          throw new Error(`Invalid task data at index ${index}: missing required fields (title, id)`);
        }
        
        return new Task(taskData.title, taskData.id, taskData.description, taskData.completed);
      });
    } catch (error) {
      if ((error as FileSystemError).code === 'ENOENT') {
        // File doesn't exist yet, return empty array
        return [];
      }
      // Re-throw parsing errors and other file system errors
      throw error;
    }
  }

  private async saveTasks(tasks: Task[]): Promise<void> {
    // Ensure directory exists
    await fs.mkdir(this.dataDir, { recursive: true });
    
    // Convert Task instances to plain objects for JSON serialization
    const tasksData = tasks.map(task => ({
      id: task.id,
      title: task.title,
      description: task.description,
      completed: task.completed
    }));
    
    await fs.writeFile(this.tasksFile, JSON.stringify(tasksData, null, 2), 'utf-8');
  }
}
