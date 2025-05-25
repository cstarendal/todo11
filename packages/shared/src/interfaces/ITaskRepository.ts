import { Task } from '../../../domain/src/entities/Task';

export interface ITaskRepository {
  add(task: Task): Promise<void>;
  getAll(): Promise<Task[]>;
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
}

export { InMemoryTaskRepositoryImpl as InMemoryTaskRepository };
