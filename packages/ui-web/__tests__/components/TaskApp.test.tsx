/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../../src/App';

describe('TaskApp Component', () => {
  beforeEach(() => {
    render(<App />);
  });

  describe('Component Rendering', () => {
    it('should render the main app with title', () => {
      expect(screen.getByText(/Task11 - Task Management/)).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    });

    it('should render task creation form', () => {
      expect(screen.getByPlaceholderText(/enter task title/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /add task/i })).toBeInTheDocument();
    });

    it('should show empty state initially', () => {
      expect(screen.getByText(/no tasks yet/i)).toBeInTheDocument();
    });
  });

  describe('Task Creation', () => {
    it('should create a new task when form is submitted', () => {
      const input = screen.getByPlaceholderText(/enter task title/i);
      const button = screen.getByRole('button', { name: /add task/i });
      
      fireEvent.change(input, { target: { value: 'Test Task' } });
      fireEvent.click(button);
      
      expect(screen.getByText('Test Task')).toBeInTheDocument();
      expect(input).toHaveValue('');
    });

    it('should not create task with empty title', () => {
      const button = screen.getByRole('button', { name: /add task/i });
      
      fireEvent.click(button);
      
      expect(screen.getByText(/no tasks yet/i)).toBeInTheDocument();
    });
  });

  describe('Task Management', () => {
    beforeEach(() => {
      const input = screen.getByPlaceholderText(/enter task title/i);
      const button = screen.getByRole('button', { name: /add task/i });
      
      fireEvent.change(input, { target: { value: 'Test Task' } });
      fireEvent.click(button);
    });

    it('should toggle task completion status', () => {
      const checkbox = screen.getByRole('checkbox');
      
      expect(checkbox).not.toBeChecked();
      fireEvent.click(checkbox);
      expect(checkbox).toBeChecked();
    });
  });
});
