import { Task } from 'task11-domain';
import { ITaskRepository } from 'task11-shared';

export class ToggleTaskUseCase {
  constructor(private readonly repo: ITaskRepository) {}

  async execute(taskId: string): Promise<Task> {
    const task = await this.repo.getById(taskId);
    if (!task) {
      throw new Error('Task not found');
    }
    
    const toggledTask = task.toggle();
    await this.repo.update(toggledTask);
    return toggledTask;
  }
}
