import { Task } from 'task11-domain';
export interface ITaskRepository {
  add(task: Task): Promise<void>;
  getAll(): Promise<Task[]>;
  getById(id: string): Promise<Task | null>;
  update(task: Task): Promise<void>;
}
declare class InMemoryTaskRepositoryImpl implements ITaskRepository {
  private tasks;
  add(task: Task): Promise<void>;
  getAll(): Promise<Task[]>;
  getById(id: string): Promise<Task | null>;
  update(task: Task): Promise<void>;
}
export { InMemoryTaskRepositoryImpl as InMemoryTaskRepository };
//# sourceMappingURL=ITaskRepository.d.ts.map
