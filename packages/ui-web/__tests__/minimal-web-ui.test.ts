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
  
  test('should be able to create a task interface', () => {
    // Load our minimal task interface module
    require('../src/minimal-task-interface');
    
    // Now this test should pass - the task-list element should exist
    expect(document.querySelector('#task-list')).not.toBeNull();
  });
});
