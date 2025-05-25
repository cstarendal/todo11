import { describe, it, expect, beforeEach } from '@jest/globals';
import { Task } from '../../../domain/src/entities/Task';
import { ToggleTaskUseCase } from '../../src/ToggleTaskUseCase';
import { InMemoryTaskRepository } from '../../../shared/src/interfaces/ITaskRepository';

describe('ToggleTaskUseCase Integration Test', () => {
  let repository: InMemoryTaskRepository;
  let useCase: ToggleTaskUseCase;

  beforeEach(() => {
    repository = new InMemoryTaskRepository();
    useCase = new ToggleTaskUseCase(repository);
  });

  it('should toggle task completion status', async () => {
    // Arrange
    const task = new Task('Test task', undefined, 'Test description');
    await repository.add(task);
    
    expect(task.completed).toBe(false);
    
    // Act
    const toggledTask = await useCase.execute(task.id);
    
    // Assert
    expect(toggledTask.completed).toBe(true);
    expect(toggledTask.id).toBe(task.id);
    expect(toggledTask.title).toBe(task.title);
    expect(toggledTask.description).toBe(task.description);
    
    // Verify persistence
    const allTasks = await repository.getAll();
    const persistedTask = allTasks.find(t => t.id === task.id);
    expect(persistedTask?.completed).toBe(true);
  });

  it('should throw error when task is not found', async () => {
    // Act & Assert
    await expect(useCase.execute('non-existent-id'))
      .rejects
      .toThrow('Task not found');
  });
});
