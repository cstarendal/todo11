import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import * as fs from 'fs/promises';
import * as path from 'path';
import { Task } from 'task11-domain';
import { FileTaskRepository } from '../src/FileTaskRepository';

describe('FileTaskRepository', () => {
  let repository: FileTaskRepository;
  let testDir: string;

  beforeEach(async () => {
    // Create a temporary directory for each test
    testDir = path.join(__dirname, 'temp-test-data', `test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
    await fs.mkdir(testDir, { recursive: true });
    repository = new FileTaskRepository(testDir);
  });

  afterEach(async () => {
    // Clean up test directory
    try {
      await fs.rm(testDir, { recursive: true, force: true });
    } catch (error) {
      // Ignore cleanup errors
    }
  });

  it('should implement ITaskRepository interface', () => {
    expect(repository).toBeDefined();
    expect(typeof repository.add).toBe('function');
    expect(typeof repository.getAll).toBe('function');
    expect(typeof repository.getById).toBe('function');
    expect(typeof repository.update).toBe('function');
  });

  it('should save and load tasks from JSON file', async () => {
    // Arrange
    const task = new Task('Test Task', 'test-1', 'Test Description');

    // Act
    await repository.add(task);
    const tasks = await repository.getAll();

    // Assert
    expect(tasks).toHaveLength(1);
    expect(tasks[0].title).toBe('Test Task');
    expect(tasks[0].id).toBe('test-1');
    expect(tasks[0].description).toBe('Test Description');
  });

  it('should persist tasks to file system', async () => {
    // Arrange
    const task = new Task('Persistent Task', 'persist-1');
    
    // Act
    await repository.add(task);
    
    // Assert - Check that file exists
    const tasksFile = path.join(testDir, 'tasks.json');
    const fileExists = await fs.access(tasksFile).then(() => true).catch(() => false);
    expect(fileExists).toBe(true);
    
    // Assert - Check file content
    const fileContent = await fs.readFile(tasksFile, 'utf-8');
    const savedTasks = JSON.parse(fileContent);
    expect(savedTasks).toHaveLength(1);
    expect(savedTasks[0].title).toBe('Persistent Task');
  });

  it('should meet performance requirement of <50ms for file operations', async () => {
    // Arrange
    const task = new Task('Performance Test', 'perf-1');
    
    // Act & Assert - Add operation
    const addStart = performance.now();
    await repository.add(task);
    const addTime = performance.now() - addStart;
    expect(addTime).toBeLessThan(50);
    
    // Act & Assert - GetAll operation
    const getAllStart = performance.now();
    await repository.getAll();
    const getAllTime = performance.now() - getAllStart;
    expect(getAllTime).toBeLessThan(50);
  });
});
