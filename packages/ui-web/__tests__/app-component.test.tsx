/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

// Create a simple test component to verify React rendering works
const TestComponent = () => (
  <div data-testid="test-component">
    <h1>React Test Component</h1>
    <p>This tests React rendering in Jest</p>
  </div>
);

describe('React Component Testing', () => {
  afterEach(() => {
    cleanup();
    document.body.innerHTML = '';
  });

  it('can render a simple React component', () => {
    const { getByTestId, getByText } = render(<TestComponent />);
    
    expect(getByTestId('test-component')).toBeInTheDocument();
    expect(getByText('React Test Component')).toBeInTheDocument();
    expect(getByText('This tests React rendering in Jest')).toBeInTheDocument();
  });

  it('can test component behavior', () => {
    const { container } = render(<TestComponent />);
    
    // Verify the component structure
    expect(container.firstChild).toHaveAttribute('data-testid', 'test-component');
    expect(container.querySelector('h1')).toHaveTextContent('React Test Component');
    expect(container.querySelector('p')).toHaveTextContent('This tests React rendering in Jest');
  });
});
