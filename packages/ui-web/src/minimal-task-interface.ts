// Minimal task interface implementation to make tests pass

/**
 * Creates a minimal task list DOM element
 * @returns HTMLDivElement - The created task list element
 */
function createTaskListElement(): HTMLDivElement {
  const taskList = document.createElement('div');
  taskList.id = 'task-list';
  taskList.className = 'task-list';
  taskList.innerHTML = '<p class="empty-message">No tasks yet. Create your first task above!</p>';
  return taskList;
}

/**
 * Initializes the minimal task interface by adding required DOM elements
 * Only runs in browser environment (when document is available)
 */
export function createMinimalTaskInterface(): void {
  // Guard clause: only run in browser environment
  if (typeof document === 'undefined') {
    return;
  }

  // Avoid duplicate initialization
  const existingTaskList = document.querySelector('#task-list');
  if (existingTaskList) {
    return;
  }

  // Create and append the task list element
  const taskListElement = createTaskListElement();
  document.body.appendChild(taskListElement);
}

// Auto-initialize when this module is loaded in browser environment
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  createMinimalTaskInterface();
}