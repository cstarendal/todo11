// This file sets up the Jest environment with TypeScript support

// Define the taskManager property on the global Window interface
declare global {
  interface Window {
    taskManager: any;
  }
}

// Configure Jest globals
global.document = window.document;
global.window = window;

// Export an empty module to satisfy TypeScript
export {};
