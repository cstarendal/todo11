/* global describe, it, expect, jest, beforeEach, localStorage, window, StorageEvent */
import { BrowserSyncRepository } from '../src/BrowserSyncRepository'
import { Task } from 'task11-domain'

describe('BrowserSyncRepository', () => {
  let repository: BrowserSyncRepository
  const mockDeviceId = 'test-device'
  const mockStorageKey = 'task11_browser_sync'

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()
    repository = new BrowserSyncRepository(mockDeviceId)
  })

  describe('getAll', () => {
    it('should return empty array when no tasks exist', async () => {
      const tasks = await repository.getAll()
      expect(tasks).toEqual([])
    })

    it('should return tasks from localStorage', async () => {
      const mockTasks = [
        new Task('Test Task 1', '1', 'Description 1', false, new Date(), new Date()),
        new Task('Test Task 2', '2', 'Description 2', true, new Date(), new Date())
      ]
      localStorage.setItem(mockStorageKey, JSON.stringify({ tasks: mockTasks }))
      
      const tasks = await repository.getAll()
      expect(tasks).toHaveLength(2)
      expect(tasks[0].title).toBe('Test Task 1')
      expect(tasks[1].title).toBe('Test Task 2')
    })

    it('should handle invalid JSON data', async () => {
      localStorage.setItem(mockStorageKey, 'invalid-json')
      const tasks = await repository.getAll()
      expect(tasks).toEqual([])
    })
  })

  describe('add', () => {
    it('should add a new task', async () => {
      const task = new Task('New Task', '1', 'Description', false, new Date(), new Date())
      await repository.add(task)
      
      const tasks = await repository.getAll()
      expect(tasks).toHaveLength(1)
      expect(tasks[0].title).toBe('New Task')
    })
  })

  describe('getById', () => {
    it('should return null when task not found', async () => {
      const task = await repository.getById('non-existent')
      expect(task).toBeNull()
    })

    it('should return task when found', async () => {
      const mockTask = new Task('Test Task', '1', 'Description', false, new Date(), new Date())
      await repository.add(mockTask)
      
      const task = await repository.getById('1')
      expect(task).not.toBeNull()
      expect(task?.title).toBe('Test Task')
    })
  })

  describe('update', () => {
    it('should update existing task', async () => {
      const task = new Task('Original Task', '1', 'Description', false, new Date(), new Date())
      await repository.add(task)
      
      const updatedTask = new Task('Updated Task', '1', 'New Description', true, new Date(), new Date())
      await repository.update(updatedTask)
      
      const tasks = await repository.getAll()
      expect(tasks).toHaveLength(1)
      expect(tasks[0].title).toBe('Updated Task')
      expect(tasks[0].description).toBe('New Description')
      expect(tasks[0].completed).toBe(true)
    })

    it('should not update when task not found', async () => {
      const task = new Task('Test Task', '1', 'Description', false, new Date(), new Date())
      await repository.add(task)
      
      const nonExistentTask = new Task('Non Existent', '2', 'Description', false, new Date(), new Date())
      await repository.update(nonExistentTask)
      
      const tasks = await repository.getAll()
      expect(tasks).toHaveLength(1)
      expect(tasks[0].title).toBe('Test Task')
    })
  })

  describe('onSyncChange', () => {
    it('should notify subscribers of changes', () => {
      const callback = jest.fn()
      const unsubscribe = repository.onSyncChange(callback)
      
      // Simulate storage event
      const event = new StorageEvent('storage', {
        key: mockStorageKey,
        newValue: 'test',
        oldValue: null
      })
      window.dispatchEvent(event)
      
      expect(callback).toHaveBeenCalled()
      
      // Test unsubscribe
      unsubscribe()
      callback.mockClear()
      window.dispatchEvent(event)
      expect(callback).not.toHaveBeenCalled()
    })

    it('should handle callback errors gracefully', () => {
      const errorCallback = jest.fn().mockImplementation(() => {
        throw new Error('Test error')
      })
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
      
      repository.onSyncChange(errorCallback)
      
      const event = new StorageEvent('storage', {
        key: mockStorageKey,
        newValue: 'test',
        oldValue: null
      })
      window.dispatchEvent(event)
      
      expect(consoleSpy).toHaveBeenCalled()
      consoleSpy.mockRestore()
    })
  })
}) 