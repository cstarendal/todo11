/**
 * @jest-environment jsdom
 */

import { createMinimalTaskInterface } from '../src/minimal-task-interface';

describe('Minimal Task Interface', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should create task interface when called', () => {
    createMinimalTaskInterface();
    const taskList = document.querySelector('#task-list');
    expect(taskList).not.toBeNull();
  });
});