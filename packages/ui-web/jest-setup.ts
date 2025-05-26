// This file sets up the Jest environment with TypeScript support
import '@testing-library/jest-dom';

// Ensure globals are properly configured
declare global {
  var describe: jest.Describe;
  var it: jest.It;
  var expect: jest.Expect;
  var beforeEach: jest.Lifecycle;
  var afterEach: jest.Lifecycle;
  var beforeAll: jest.Lifecycle;
  var afterAll: jest.Lifecycle;
}
