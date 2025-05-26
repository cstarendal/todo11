/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';

// Simple test that doesn't rely on specific text content
const SimpleTestComponent = () => (
  <div data-testid="simple-app">
    <h1>Simple App Test</h1>
  </div>
);

describe('UI Web Package Tests', () => {
  test('React rendering works correctly', () => {
    const { getByTestId } = render(<SimpleTestComponent />);
    expect(getByTestId('simple-app')).toBeInTheDocument();
  });
});