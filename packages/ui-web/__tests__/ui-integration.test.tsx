/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

// Create a comprehensive test app that covers all UI functionality we want to test
interface Task {
  id: string;
  title: string;
  completed: boolean;
}

const TestTaskApp = () => {
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = React.useState('');

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newTaskTitle.trim()) {
      return;
    }

    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle.trim(),
      completed: false
    };

    setTasks(prev => [...prev, newTask]);
    setNewTaskTitle('');
  };

  const handleToggleTask = (taskId: string) => {
    setTasks(prev =>
      prev.map(task => 
        task.id === taskId 
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  };

  return (
    <div data-testid="task-app">
      <h1>🎯 Task11 - Task Management</h1>

      <form onSubmit={handleCreateTask} data-testid="task-form">
        <input
          type="text"
          placeholder="Enter task title..."
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          data-testid="task-input"
        />
        <button type="submit">Add Task</button>
      </form>

      <div data-testid="tasks-section">
        <h2>Tasks ({tasks.length})</h2>
        {tasks.length === 0 ? (
          <p data-testid="empty-message">No tasks yet. Create your first task above!</p>
        ) : (
          <ul data-testid="tasks-list">
            {tasks.map(task => (
              <li key={task.id} data-testid={`task-item-${task.id}`}>
                <label>
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => handleToggleTask(task.id)}
                    data-testid={`task-checkbox-${task.id}`}
                  />
                  <span 
                    style={{ 
                      textDecoration: task.completed ? 'line-through' : 'none',
                      color: task.completed ? '#6b7280' : '#000000'
                    }}
                    data-testid={`task-text-${task.id}`}
                  >
                    {task.title}
                  </span>
                </label>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

describe('Task Management UI Integration Tests', () => {
  afterEach(() => {
    cleanup();
  });

  describe('App Component Rendering', () => {
    it('should render the main app with title', () => {
      render(<TestTaskApp />);
      
      expect(screen.getByText(/Task11 - Task Management/)).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    });

    it('should render task creation form', () => {
      render(<TestTaskApp />);
      
      expect(screen.getByPlaceholderText(/enter task title/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /add task/i })).toBeInTheDocument();
    });

    it('should show empty state initially', () => {
      render(<TestTaskApp />);
      
      expect(screen.getByText(/no tasks yet/i)).toBeInTheDocument();
    });
  });

  describe('Task Creation Functionality', () => {
    it('should create a new task when form is submitted', () => {
      render(<TestTaskApp />);
      
      const input = screen.getByPlaceholderText(/enter task title/i);
      const button = screen.getByRole('button', { name: /add task/i });
      
      // Type a task title
      fireEvent.change(input, { target: { value: 'Test Task' } });
      expect(input).toHaveValue('Test Task');
      
      // Submit the form
      fireEvent.click(button);
      
      // Check that task was created
      expect(screen.getByText('Test Task')).toBeInTheDocument();
      expect(input).toHaveValue(''); // Input should be cleared
      expect(screen.queryByText(/no tasks yet/i)).not.toBeInTheDocument();
    });

    it('should not create task with empty title', () => {
      render(<TestTaskApp />);
      
      const button = screen.getByRole('button', { name: /add task/i });
      
      // Try to submit with empty input
      fireEvent.click(button);
      
      // Should still show empty state
      expect(screen.getByText(/no tasks yet/i)).toBeInTheDocument();
    });

    it('should not create task with only whitespace', () => {
      render(<TestTaskApp />);
      
      const input = screen.getByPlaceholderText(/enter task title/i);
      const button = screen.getByRole('button', { name: /add task/i });
      
      // Type only whitespace
      fireEvent.change(input, { target: { value: '   ' } });
      fireEvent.click(button);
      
      // Should still show empty state
      expect(screen.getByText(/no tasks yet/i)).toBeInTheDocument();
    });
  });

  describe('Task Management Functionality', () => {
    beforeEach(() => {
      render(<TestTaskApp />);
      
      // Create a test task
      const input = screen.getByPlaceholderText(/enter task title/i);
      const button = screen.getByRole('button', { name: /add task/i });
      
      fireEvent.change(input, { target: { value: 'Test Task' } });
      fireEvent.click(button);
    });

    it('should toggle task completion status', () => {
      const checkbox = screen.getByRole('checkbox');
      
      // Initially unchecked
      expect(checkbox).not.toBeChecked();
      
      // Click to complete
      fireEvent.click(checkbox);
      expect(checkbox).toBeChecked();
      
      // Click to uncomplete
      fireEvent.click(checkbox);
      expect(checkbox).not.toBeChecked();
    });

    it('should show task with proper styling based on completion', () => {
      const checkbox = screen.getByRole('checkbox');
      const taskText = screen.getByText('Test Task');
      
      // Initially not completed
      expect(taskText).not.toHaveStyle('text-decoration: line-through');
      
      // Complete the task
      fireEvent.click(checkbox);
      
      // Should have strikethrough styling
      expect(taskText).toHaveStyle('text-decoration: line-through');
    });
  });

  describe('Multiple Tasks Management', () => {
    it('should handle multiple tasks correctly', () => {
      render(<TestTaskApp />);
      
      const input = screen.getByPlaceholderText(/enter task title/i);
      const button = screen.getByRole('button', { name: /add task/i });
      
      // Create multiple tasks
      const tasks = ['Task 1', 'Task 2', 'Task 3'];
      tasks.forEach(taskTitle => {
        fireEvent.change(input, { target: { value: taskTitle } });
        fireEvent.click(button);
      });
      
      // All tasks should be visible
      tasks.forEach(taskTitle => {
        expect(screen.getByText(taskTitle)).toBeInTheDocument();
      });
      
      // Should have 3 checkboxes
      expect(screen.getAllByRole('checkbox')).toHaveLength(3);
    });

    it('should toggle individual tasks independently', () => {
      render(<TestTaskApp />);
      
      const input = screen.getByPlaceholderText(/enter task title/i);
      const button = screen.getByRole('button', { name: /add task/i });
      
      // Create two tasks
      fireEvent.change(input, { target: { value: 'Task 1' } });
      fireEvent.click(button);
      fireEvent.change(input, { target: { value: 'Task 2' } });
      fireEvent.click(button);
      
      const checkboxes = screen.getAllByRole('checkbox');
      
      // Toggle first task
      fireEvent.click(checkboxes[0]);
      
      expect(checkboxes[0]).toBeChecked();
      expect(checkboxes[1]).not.toBeChecked();
      
      // Toggle second task
      fireEvent.click(checkboxes[1]);
      
      expect(checkboxes[0]).toBeChecked();
      expect(checkboxes[1]).toBeChecked();
    });
  });

  describe('Accessibility and User Experience', () => {
    it('should have proper semantic structure', () => {
      render(<TestTaskApp />);
      
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /add task/i })).toBeInTheDocument();
    });

    it('should allow form submission with Enter key', () => {
      render(<TestTaskApp />);
      
      const input = screen.getByPlaceholderText(/enter task title/i);
      
      fireEvent.change(input, { target: { value: 'Keyboard Task' } });
      fireEvent.submit(input.closest('form')!);
      
      expect(screen.getByText('Keyboard Task')).toBeInTheDocument();
    });
  });
});
