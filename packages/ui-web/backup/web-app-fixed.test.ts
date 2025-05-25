/**
 * @jest-environment jsdom
 */

// Export to make this a module for global declarations
export {};

// Create extended window interface to match what our app will do
declare global {
  interface Window {
    taskManager: any;
  }
}

describe('Web App Basic Functionality', () => {
  // Setup DOM environment before each test
  beforeEach(() => {
    // Create a clean DOM environment for testing
    document.body.innerHTML = `
      <div id="root"></div>
    `;
    
    // Reset any modules
    jest.resetModules();
  });

  it('should load HTML structure correctly', () => {
    // Import HTML structure function - this will fail until we implement it
    expect(() => {
      require('../src/vanilla-app');
    }).not.toThrow();
    
    // Manual trigger for DOMContentLoaded since Jest doesn't naturally trigger it
    const event = new Event('DOMContentLoaded');
    window.document.dispatchEvent(event);
    
    // Check if TaskManager was properly loaded and attached to window
    expect(window.taskManager).toBeDefined();
  });

  it('should create DOM elements correctly', () => {
    // Load the app
    require('../src/vanilla-app');
    
    // Verify elements were created
    expect(document.querySelector('h1')).toBeTruthy();
    expect(document.querySelector('form#task-form')).toBeTruthy();
    expect(document.querySelector('input#task-input')).toBeTruthy();
    expect(document.querySelector('button[type="submit"]')).toBeTruthy();
    expect(document.querySelector('#task-list')).toBeTruthy();
    expect(document.querySelector('#task-counter')).toBeTruthy();
  });

  it('should handle task creation correctly', () => {
    // Load the app
    require('../src/vanilla-app');
    
    // Set task input value
    const taskInput = document.querySelector('#task-input') as HTMLInputElement;
    expect(taskInput).toBeTruthy();
    taskInput.value = 'Test Task';
    
    // Submit the form
    const taskForm = document.querySelector('#task-form') as HTMLFormElement;
    expect(taskForm).toBeTruthy();
    
    // Create and dispatch submit event
    const submitEvent = new Event('submit');
    submitEvent.preventDefault = jest.fn();
    taskForm.dispatchEvent(submitEvent);
    
    // Verify task was added to the list
    const taskCounterText = document.querySelector('#task-counter')?.textContent;
    expect(taskCounterText).toContain('Tasks (1)');
    
    // Check if task item was added to the DOM
    const taskItem = document.querySelector('.task-item');
    expect(taskItem).toBeTruthy();
    expect(taskItem?.textContent).toContain('Test Task');
  });
  
  it('should toggle task completion status', () => {
    // Load the app
    require('../src/vanilla-app');
    
    // Add a task first
    const taskInput = document.querySelector('#task-input') as HTMLInputElement;
    taskInput.value = 'Toggle Test Task';
    
    const taskForm = document.querySelector('#task-form') as HTMLFormElement;
    const submitEvent = new Event('submit');
    submitEvent.preventDefault = jest.fn();
    taskForm.dispatchEvent(submitEvent);
    
    // Find the checkbox
    const checkbox = document.querySelector('.task-item input[type="checkbox"]') as HTMLInputElement;
    expect(checkbox).toBeTruthy();
    expect(checkbox.checked).toBe(false);
    
    // Toggle the task
    checkbox.checked = true;
    const changeEvent = new Event('change');
    checkbox.dispatchEvent(changeEvent);
    
    // Verify task was marked as completed
    expect(document.querySelector('.task-item.completed')).toBeTruthy();
  });
});
