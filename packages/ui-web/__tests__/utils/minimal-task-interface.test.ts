/**
 * @jest-environment jsdom
 */

import { createMinimalTaskInterface } from '../../src/minimal-task-interface';

describe('Minimal Task Interface Utils', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('createMinimalTaskInterface', () => {
    it('should create task list element in browser environment', () => {
      createMinimalTaskInterface();
      
      const taskList = document.querySelector('#task-list');
      expect(taskList).not.toBeNull();
      expect(taskList?.className).toBe('task-list');
      expect(taskList?.innerHTML).toContain('No tasks yet');
    });

    it('should not create duplicate task list elements', () => {
      createMinimalTaskInterface();
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
});
