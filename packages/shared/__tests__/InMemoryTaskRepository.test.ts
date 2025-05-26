import { describe, it, expect, beforeEach } from '@jest/globals';
import { Task } from 'task11-domain';
import { InMemoryTaskRepository } from '../src/interfaces/ITaskRepository';

describe('InMemoryTaskRepository', () => {
  let repository: InMemoryTaskRepository;

  beforeEach(() => {
    repository = new InMemoryTaskRepository();
  });

  it('should add a task', async () => {
    const task = new Task('Test Task', 'task-1', 'Test Description');
    await repository.add(task);
    const tasks = await repository.getAll();
    expect(tasks).toContain(task);
  });

  it('should get all tasks', async () => {
    const task1 = new Task('Test Task 1', 'task-1');
    const task2 = new Task('Test Task 2', 'task-2');
    await repository.add(task1);
    await repository.add(task2);
    const tasks = await repository.getAll();
    expect(tasks).toEqual([task1, task2]);
  });

  it('should get a task by id', async () => {
    const task = new Task('Test Task', 'task-1');
    await repository.add(task);
    const foundTask = await repository.getById('task-1');
    expect(foundTask).toEqual(task);
  });

  it('should return null when getting a non-existent task by id', async () => {
    const foundTask = await repository.getById('non-existent-id');
    expect(foundTask).toBeNull();
  });

  it('should update a task', async () => {
    const initialTask = new Task('Test Task', 'task-1', 'Initial Description');
    await repository.add(initialTask);
    
    const updatedTaskInstance = new Task(
      initialTask.title,
      initialTask.id,
      'Updated Description',
      true, // completed status
      initialTask.createdAt,
      new Date(), // new updated date
      initialTask.dueDate
    );

    await repository.update(updatedTaskInstance);
    const foundTask = await repository.getById('task-1');
    
    expect(foundTask).toEqual(updatedTaskInstance);
    expect(foundTask?.description).toBe('Updated Description');
    expect(foundTask?.completed).toBe(true);
    expect(foundTask?.updatedAt).not.toBe(initialTask.updatedAt);
  });

  it('should throw an error when trying to update a non-existent task', async () => {
    const task = new Task('Non Existent Task', 'non-existent-id');
    await expect(repository.update(task)).rejects.toThrow('Task with id non-existent-id not found');
  });
});
