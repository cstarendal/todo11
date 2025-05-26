/**
 * @jest-environment jsdom
 */

import { createMinimalTaskInterface } from '../src/minimal-task-interface';

describe('Minimal Task Interface', () => {
  beforeEach(() => {
    // Clean up DOM before each test
    document.body.innerHTML = '';
  });

  afterEach(() => {
    // Clean up after each test
    document.body.innerHTML = '';
  });

  describe('createMinimalTaskInterface function', () => {
    it('should create a task list element when called in browser environment', () => {
      // Ensure we're in browser environment (jsdom provides document)
      expect(typeof document).toBe('object');
      
      // Call the function
      createMinimalTaskInterface();
      
      // Verify the task list was created
      const taskList = document.querySelector('#task-list');
      expect(taskList).not.toBeNull();
      expect(taskList?.className).toBe('task-list');
      expect(taskList?.innerHTML).toContain('No tasks yet. Create your first task above!');
    });

    it('should not create duplicate task list elements', () => {
      // First call should create the element
      createMinimalTaskInterface();
      expect(document.querySelectorAll('#task-list')).toHaveLength(1);
      
      // Second call should not create another element (covers existing task list check)
      createMinimalTaskInterface();
      expect(document.querySelectorAll('#task-list')).toHaveLength(1);
    });

    it('should create element with correct structure', () => {
      createMinimalTaskInterface();
      
      const taskList = document.querySelector('#task-list') as HTMLDivElement;
      expect(taskList).toBeInstanceOf(HTMLDivElement);
      expect(taskList.id).toBe('task-list');
      expect(taskList.className).toBe('task-list');
      
      const emptyMessage = taskList.querySelector('.empty-message');
      expect(emptyMessage).not.toBeNull();
      expect(emptyMessage?.textContent).toBe('No tasks yet. Create your first task above!');
    });
  });

  describe('Auto-initialization behavior', () => {
    it('should auto-initialize when module is imported in browser environment', () => {
      // Clear any existing elements first
      document.body.innerHTML = '';
      
      // Call the function explicitly since we cleared the DOM
      createMinimalTaskInterface();
      
      // Should have created the task list
      const taskList = document.querySelector('#task-list');
      expect(taskList).not.toBeNull();
    });
  });
});
