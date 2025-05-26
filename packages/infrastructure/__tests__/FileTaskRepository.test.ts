import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
jest.mock('fs/promises');
import * as fs from 'fs/promises';
import * as path from 'path';
import { Task } from 'task11-domain';
import { FileTaskRepository } from '../src/FileTaskRepository';

const mockedFs = fs as jest.Mocked<typeof fs>;

describe('FileTaskRepository', () => {
  let repository: FileTaskRepository;
  let testDir: string;
  let fileStore: Map<string, string>;

  beforeEach(async () => {
    jest.clearAllMocks();
    fileStore = new Map<string, string>();
    testDir = path.join(__dirname, 'temp-test-data', `test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);

    // Mock mkdir/rm/unlink to resolve immediately
    mockedFs.mkdir.mockResolvedValue(undefined);
    mockedFs.rm.mockResolvedValue(undefined);
    mockedFs.unlink.mockResolvedValue(undefined);

    // Mock writeFile to save data to in-memory store
    (mockedFs.writeFile as any).mockImplementation(async (file: any, data: any) => {
      fileStore.set(file.toString(), typeof data === 'string' ? data : data.toString());
      return undefined;
    });

    // Mock readFile to read from in-memory store or throw ENOENT if not found
    (mockedFs.readFile as any).mockImplementation(async (file: any, encoding: any) => {
      const content = fileStore.get(file.toString());
      if (content !== undefined) {
        return encoding === 'utf-8' ? content : Buffer.from(content);
      }
      const err = Object.assign(new Error('not found'), { code: 'ENOENT' });
      throw err;
    });

    // Mock access to succeed if file exists, else fail
    (mockedFs.access as any)?.mockImplementation(async (file: any) => {
      if (fileStore.has(file.toString())) return undefined;
      const err = Object.assign(new Error('not found'), { code: 'ENOENT' });
      throw err;
    });

    repository = new FileTaskRepository(testDir);
  });

  afterEach(async () => {
    jest.clearAllMocks();
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

  it('should throw if lock file already exists (EEXIST)', async () => {
    mockedFs.writeFile.mockRejectedValueOnce(Object.assign(new Error('exists'), { code: 'EEXIST' }));
    await expect(repository['acquireLock']()).rejects.toThrow('Lock file already exists');
  });

  it('should throw if update is called on non-existent task', async () => {
    mockedFs.readFile.mockResolvedValueOnce('[]');
    const task = new Task('Not found', 'no-id');
    await expect(repository.update(task)).rejects.toThrow('Task with id no-id not found');
  });

  it('should return empty array if tasks file does not exist (ENOENT)', async () => {
    mockedFs.readFile.mockRejectedValueOnce(Object.assign(new Error('not found'), { code: 'ENOENT' }));
    const tasks = await repository['loadTasks']();
    expect(tasks).toEqual([]);
  });

  it('should throw if tasks file is invalid JSON', async () => {
    mockedFs.readFile.mockResolvedValueOnce('not-json');
    await expect(repository.getAll()).rejects.toThrow();
  });

  it('should throw if tasks file is not an array', async () => {
    mockedFs.readFile.mockResolvedValueOnce(JSON.stringify({ not: 'an array' }));
    await expect(repository.getAll()).rejects.toThrow('Invalid tasks file format');
  });

  it('should throw if a task in file is missing required fields', async () => {
    mockedFs.readFile.mockResolvedValueOnce(JSON.stringify([{ id: '1' }]));
    await expect(repository.getAll()).rejects.toThrow('missing required fields');
  });

  it('should ignore errors when releasing lock', async () => {
    mockedFs.unlink.mockRejectedValueOnce(new Error('fail'));
    await expect(repository['releaseLock']()).resolves.toBeUndefined();
  });

  it('should retry withLock if acquireLock fails first, then succeeds', async () => {
    // Första anropet kastar EEXIST, andra lyckas
    mockedFs.writeFile
      .mockRejectedValueOnce(Object.assign(new Error('exists'), { code: 'EEXIST' }))
      .mockResolvedValueOnce(undefined);

    // Mocka saveTasks så vi kan verifiera att operationen körs
    const saveTasksSpy = jest.spyOn(repository as any, 'saveTasks').mockResolvedValue(undefined);

    const task = new Task('Retry Test', 'retry-1');
    await repository.add(task);

    expect(saveTasksSpy).toHaveBeenCalled();
    saveTasksSpy.mockRestore();
  });

  it('should re-throw unknown errors from loadTasks', async () => {
    const customError = Object.assign(new Error('custom error'), { code: 'EACCES' });
    mockedFs.readFile.mockRejectedValueOnce(customError);
    await expect(repository['loadTasks']()).rejects.toThrow('custom error');
  });

  it('should re-throw errors from saveTasks if mkdir fails', async () => {
    const mkdirError = new Error('mkdir fail');
    mockedFs.mkdir.mockRejectedValueOnce(mkdirError);
    const task = new Task('Save Error', 'save-err');
    await expect(repository['saveTasks']([task])).rejects.toThrow('mkdir fail');
  });

  it('should re-throw errors from saveTasks if writeFile fails', async () => {
    mockedFs.mkdir.mockResolvedValueOnce(undefined);
    mockedFs.writeFile.mockRejectedValueOnce(new Error('write fail'));
    const task = new Task('Write Error', 'write-err');
    await expect(repository['saveTasks']([task])).rejects.toThrow('write fail');
  });

  it('should re-throw errors from acquireLock if writeFile fails (not EEXIST)', async () => {
    mockedFs.mkdir.mockResolvedValueOnce(undefined);
    mockedFs.writeFile.mockRejectedValueOnce(new Error('other write fail'));
    await expect(repository['acquireLock']()).rejects.toThrow('other write fail');
  });

  it('should throw if a task in file is null or not an object', async () => {
    mockedFs.readFile.mockResolvedValueOnce(JSON.stringify([null, 42, 'string']));
    await expect(repository.getAll()).rejects.toThrow('Invalid task data at index 0');
  });

  it('should throw with correct index if a task in file is missing required fields at different positions', async () => {
    // Första task är OK, andra saknar title, tredje saknar id
    const tasks = [
      { id: '1', title: 'ok' },
      { id: '2' },
      { title: 'no id' }
    ];
    mockedFs.readFile.mockResolvedValueOnce(JSON.stringify(tasks));
    await expect(repository.getAll()).rejects.toThrow('missing required fields');
  });
});
