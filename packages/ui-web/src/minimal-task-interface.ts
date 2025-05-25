// Minimal task interface implementation to make tests pass
// This is the absolute minimum needed for GREEN phase

export function createMinimalTaskInterface(): void {
  // Create the basic structure that our tests expect
  const taskListElement = document.createElement('div');
  taskListElement.id = 'task-list';
  
  const taskInputElement = document.createElement('input');
  taskInputElement.id = 'task-input';
  taskInputElement.type = 'text';
  taskInputElement.placeholder = 'Enter task...';
  
  const addButtonElement = document.createElement('button');
  addButtonElement.id = 'add-task-button';
  addButtonElement.textContent = 'Add Task';
  
  // Find root or body and append elements
  const root = document.getElementById('root') || document.body;
  root.appendChild(taskInputElement);
  root.appendChild(addButtonElement);
  root.appendChild(taskListElement);
}

// Auto-initialize when loaded
if (typeof document !== 'undefined') {
  createMinimalTaskInterface();
}