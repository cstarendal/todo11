/**
 * @jest-environment node
 */

import { createMinimalTaskInterface } from '../../src/minimal-task-interface';

describe('Minimal Task Interface - Server Side', () => {
  it('should handle non-browser environment gracefully', () => {
    // In Node.js environment, document is undefined
    expect(typeof document).toBe('undefined');
    
    // This should not throw an error and return early (covers browser guard clause)
    expect(() => createMinimalTaskInterface()).not.toThrow();
  });
});
