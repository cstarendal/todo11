import { Task } from '../../domain/src/entities/Task';
import { ITaskRepository } from '../../shared/src/interfaces/ITaskRepository';

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
