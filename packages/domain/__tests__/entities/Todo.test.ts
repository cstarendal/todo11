import { Todo } from '../../src/entities/Todo';

describe('Todo', () => {
  it('should create a Todo with required properties', () => {
    const todo = new Todo('Buy groceries');
    
    expect(todo.id).toBeDefined();
    expect(todo.title).toBe('Buy groceries');
    expect(todo.description).toBe('');
    expect(todo.completed).toBe(false);
    expect(todo.createdAt).toBeInstanceOf(Date);
    expect(todo.updatedAt).toBeInstanceOf(Date);
  });

  it('should throw error when title is empty', () => {
    expect(() => new Todo('')).toThrow('Todo title cannot be empty');
  });

  it('should throw error when title is only whitespace', () => {
    expect(() => new Todo('   ')).toThrow('Todo title cannot be empty');
  });
  
  it('should toggle completion status', () => {
    // Arrange
    const todo = new Todo('Buy groceries');
    expect(todo.completed).toBe(false);
    
    // Act
    const completedTodo = todo.toggle();
    
    // Assert
    expect(completedTodo.completed).toBe(true);
    expect(completedTodo.id).toBe(todo.id); // Same identity
    expect(completedTodo.title).toBe(todo.title);
    expect(completedTodo.updatedAt).not.toBe(todo.updatedAt); // Timestamp updated
    
    // Toggle back to incomplete
    const incompleteTodo = completedTodo.toggle();
    expect(incompleteTodo.completed).toBe(false);
  });
  
  it('should create a Todo with optional due date', () => {
    const dueDate = new Date('2025-12-31');
    const todo = new Todo('Buy groceries', undefined, undefined, undefined, undefined, undefined, dueDate);
    
    expect(todo.dueDate).toBe(dueDate);
  });
  
  it('should create a Todo without due date by default', () => {
    const todo = new Todo('Buy groceries');
    
    expect(todo.dueDate).toBeUndefined();
  });
  
  it('should be able to set due date', () => {
    const todo = new Todo('Buy groceries');
    const dueDate = new Date('2025-12-31');
    
    const todoWithDueDate = todo.setDueDate(dueDate);
    
    expect(todoWithDueDate.dueDate).toBe(dueDate);
    expect(todoWithDueDate.id).toBe(todo.id); // Same identity
    expect(todoWithDueDate.updatedAt).not.toBe(todo.updatedAt); // Timestamp updated
  });
  
  it('should be able to clear due date', () => {
    const dueDate = new Date('2025-12-31');
    const todo = new Todo('Buy groceries', undefined, undefined, undefined, undefined, undefined, dueDate);
    
    const todoWithoutDueDate = todo.clearDueDate();
    
    expect(todoWithoutDueDate.dueDate).toBeUndefined();
    expect(todoWithoutDueDate.id).toBe(todo.id); // Same identity
    expect(todoWithoutDueDate.updatedAt).not.toBe(todo.updatedAt); // Timestamp updated
  });
});
