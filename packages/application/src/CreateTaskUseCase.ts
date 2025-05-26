import { Task } from 'task11-domain';
import { ITaskRepository } from 'task11-shared';

export interface CreateTaskDTO {
  title: string;
  description?: string;
}

export class CreateTaskUseCase {
  constructor(private readonly repo: ITaskRepository) {}

  async execute(input: CreateTaskDTO): Promise<Task> {
    const task = new Task(input.title, undefined, input.description);
    await this.repo.add(task);
    return task;
  }
}

export {};
