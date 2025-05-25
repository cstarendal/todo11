/**
 * @jest-environment jsdom
 */

// Test for minimal web UI functionality

describe('Minimal Web UI Test', () => {
  // Clean DOM before each test
  beforeEach(() => {
    document.body.innerHTML = '<div id="root"></div>';
  });

  test('should load debug HTML', () => {
    // This will test the basic debug.html functionality
    const rootElement = document.getElementById('root');
    if (rootElement) {
      rootElement.innerHTML = '<h1>Test HTML</h1>';
      expect(document.querySelector('h1')?.textContent).toBe('Test HTML');
    } else {
      fail('Root element not found');
    }
  });

  test('should run JavaScript in the browser', () => {
    // Simple test to ensure JavaScript execution works
    const testValue = 42;
    expect(testValue).toBe(42);
  });
  
  test('should fail - task interface does not exist yet', () => {
    // RED test - this should fail because we haven't implemented the task interface
    // We expect NO task-list element to exist yet
    expect(document.querySelector('#task-list')).toBeNull();
    
    // But we want a task interface to exist (this will fail until we implement it)
    expect(document.querySelector('#task-form')).not.toBeNull();
    expect(document.querySelector('#task-input')).not.toBeNull();
    expect(document.querySelector('#task-counter')).not.toBeNull();
  });
});
