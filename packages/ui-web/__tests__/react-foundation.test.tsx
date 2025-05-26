/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

// Simple React component test for basic functionality verification
const ReactTestComponent = ({ title = "React Test", showCounter = false }: { title?: string, showCounter?: boolean }) => {
  const [count, setCount] = React.useState(0);
  
  return (
    <div data-testid="react-test-component">
      <h1>{title}</h1>
      <p>React rendering is working correctly</p>
      {showCounter && (
        <div>
          <p data-testid="counter">Count: {count}</p>
          <button onClick={() => setCount(c => c + 1)}>Increment</button>
        </div>
      )}
    </div>
  );
};

describe('React Foundation Tests', () => {
  afterEach(() => {
    cleanup();
  });

  describe('Basic React Rendering', () => {
    it('should render simple React components', () => {
      render(<ReactTestComponent />);
      
      expect(screen.getByTestId('react-test-component')).toBeInTheDocument();
      expect(screen.getByText('React Test')).toBeInTheDocument();
      expect(screen.getByText('React rendering is working correctly')).toBeInTheDocument();
    });

    it('should handle component props correctly', () => {
      render(<ReactTestComponent title="Custom Title" />);
      
      expect(screen.getByText('Custom Title')).toBeInTheDocument();
    });

    it('should manage component state correctly', () => {
      render(<ReactTestComponent showCounter={true} />);
      
      const counter = screen.getByTestId('counter');
      const button = screen.getByText('Increment');
      
      expect(counter).toHaveTextContent('Count: 0');
      
      fireEvent.click(button);
      expect(counter).toHaveTextContent('Count: 1');
      
      fireEvent.click(button);
      expect(counter).toHaveTextContent('Count: 2');
    });
  });

  describe('React Testing Library Features', () => {
    it('should support advanced query methods', () => {
      render(<ReactTestComponent title="Query Test" showCounter={true} />);
      
      // Test different query methods
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Query Test');
      expect(screen.getByRole('button')).toBeInTheDocument();
      expect(screen.getByText(/react rendering/i)).toBeInTheDocument();
    });

    it('should handle user events properly', () => {
      render(<ReactTestComponent showCounter={true} />);
      
      const button = screen.getByRole('button');
      
      // Multiple interactions
      for (let i = 1; i <= 5; i++) {
        fireEvent.click(button);
        expect(screen.getByTestId('counter')).toHaveTextContent(`Count: ${i}`);
      }
    });

    it('should work with component updates', () => {
      const { rerender } = render(<ReactTestComponent title="Initial" />);
      
      expect(screen.getByText('Initial')).toBeInTheDocument();
      
      rerender(<ReactTestComponent title="Updated" showCounter={true} />);
      
      expect(screen.getByText('Updated')).toBeInTheDocument();
      expect(screen.getByTestId('counter')).toBeInTheDocument();
    });
  });

  describe('Jest Environment Validation', () => {
    it('should have jsdom environment available', () => {
      expect(typeof document).toBe('object');
      expect(typeof window).toBe('object');
      expect(document.createElement).toBeDefined();
    });

    it('should support DOM manipulation', () => {
      const element = document.createElement('div');
      element.textContent = 'Test Element';
      element.className = 'test-class';
      
      expect(element.tagName).toBe('DIV');
      expect(element.textContent).toBe('Test Element');
      expect(element.className).toBe('test-class');
    });

    it('should handle CSS selectors and queries', () => {
      document.body.innerHTML = `
        <div id="test-id" class="test-class">
          <span>Test Content</span>
        </div>
      `;
      
      expect(document.getElementById('test-id')).not.toBeNull();
      expect(document.querySelector('.test-class')).not.toBeNull();
      expect(document.querySelector('span')?.textContent).toBe('Test Content');
      
      // Clean up
      document.body.innerHTML = '';
    });
  });
});
