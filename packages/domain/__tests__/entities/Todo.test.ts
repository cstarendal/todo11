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
});
