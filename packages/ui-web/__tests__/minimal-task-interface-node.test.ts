/**
 * @jest-environment node
 */

import { createMinimalTaskInterface } from '../src/minimal-task-interface';

describe('Minimal Task Interface - Node Environment', () => {
  it('should handle non-browser environment gracefully', () => {
    // In Node.js environment, document is undefined
    expect(typeof document).toBe('undefined');
    
    // This should not throw an error and should return early (covers line 22)
    expect(() => createMinimalTaskInterface()).not.toThrow();
  });
});
