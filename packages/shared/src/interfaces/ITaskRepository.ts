import { Task } from '../../../domain/src/entities/Task';

export interface ITaskRepository {
  add(task: Task): Promise<void>;
  getAll(): Promise<Task[]>;
  getById(id: string): Promise<Task | null>;
  update(task: Task): Promise<void>;
}

// Exportera InMemoryTaskRepository separat för att undvika modulproblem
class InMemoryTaskRepositoryImpl implements ITaskRepository {
  private tasks: Task[] = [];

  async add(task: Task): Promise<void> {
    this.tasks.push(task);
  }

  async getAll(): Promise<Task[]> {
    return [...this.tasks];
  }

  async getById(id: string): Promise<Task | null> {
    const task = this.tasks.find(t => t.id === id);
    return task || null;
  }

  async update(task: Task): Promise<void> {
    const index = this.tasks.findIndex(t => t.id === task.id);
    if (index === -1) {
      throw new Error(`Task with id ${task.id} not found`);
    }
    this.tasks[index] = task;
  }
}

export { InMemoryTaskRepositoryImpl as InMemoryTaskRepository };
