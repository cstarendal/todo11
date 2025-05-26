import * as fs from 'fs/promises';
import * as path from 'path';
import { Task } from '../../domain/src/entities/Task';
import { ITaskRepository } from '../../shared/src/interfaces/ITaskRepository';

interface FileSystemError extends Error {
  code?: string;
}

export class FileTaskRepository implements ITaskRepository {
  private readonly dataDir: string;
  private readonly tasksFile: string;

  constructor(dataDir: string) {
    this.dataDir = dataDir;
    this.tasksFile = path.join(dataDir, 'tasks.json');
  }

  async add(task: Task): Promise<void> {
    const tasks = await this.loadTasks();
    tasks.push(task);
    await this.saveTasks(tasks);
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
    const tasks = await this.loadTasks();
    const index = tasks.findIndex(t => t.id === task.id);
    if (index === -1) {
      throw new Error(`Task with id ${task.id} not found`);
    }
    tasks[index] = task;
    await this.saveTasks(tasks);
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
