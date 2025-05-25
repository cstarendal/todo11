import { Task } from '../../src/entities/Task';

describe('Task', () => {
  it('should create a Task with required properties', () => {
    const task = new Task('Buy groceries');
    
    expect(task.id).toBeDefined();
    expect(task.title).toBe('Buy groceries');
    expect(task.description).toBe('');
    expect(task.completed).toBe(false);
    expect(task.createdAt).toBeInstanceOf(Date);
    expect(task.updatedAt).toBeInstanceOf(Date);
  });

  it('should throw error when title is empty', () => {
    expect(() => new Task('')).toThrow('Task title cannot be empty');
  });

  it('should throw error when title is only whitespace', () => {
    expect(() => new Task('   ')).toThrow('Task title cannot be empty');
  });
  
  it('should toggle completion status', () => {
    // Arrange
    const task = new Task('Buy groceries');
    expect(task.completed).toBe(false);
    
    // Act
    const completedTask = task.toggle();
    
    // Assert
    expect(completedTask.completed).toBe(true);
    expect(completedTask.id).toBe(task.id); // Same identity
    expect(completedTask.title).toBe(task.title);
    expect(completedTask.updatedAt).not.toBe(task.updatedAt); // Timestamp updated
    
    // Toggle back to incomplete
    const incompleteTask = completedTask.toggle();
    expect(incompleteTask.completed).toBe(false);
  });
  
  it('should create a Task with optional due date', () => {
    const dueDate = new Date('2025-12-31');
    const task = new Task('Buy groceries', undefined, undefined, undefined, undefined, undefined, dueDate);
    
    expect(task.dueDate).toBe(dueDate);
  });
  
  it('should create a Task without due date by default', () => {
    const task = new Task('Buy groceries');
    
    expect(task.dueDate).toBeUndefined();
  });
  
  it('should be able to set due date', () => {
    const task = new Task('Buy groceries');
    const dueDate = new Date('2025-12-31');
    
    const taskWithDueDate = task.setDueDate(dueDate);
    
    expect(taskWithDueDate.dueDate).toBe(dueDate);
    expect(taskWithDueDate.id).toBe(task.id); // Same identity
    expect(taskWithDueDate.updatedAt).not.toBe(task.updatedAt); // Timestamp updated
  });
  
  it('should be able to clear due date', () => {
    const dueDate = new Date('2025-12-31');
    const task = new Task('Buy groceries', undefined, undefined, undefined, undefined, undefined, dueDate);
    
    const taskWithoutDueDate = task.clearDueDate();
    
    expect(taskWithoutDueDate.dueDate).toBeUndefined();
    expect(taskWithoutDueDate.id).toBe(task.id); // Same identity
    expect(taskWithoutDueDate.updatedAt).not.toBe(task.updatedAt); // Timestamp updated
  });
});
