import { randomUUID } from 'crypto';

export class Todo {
  public readonly id: string;
  public readonly title: string;
  public readonly description: string;
  public readonly completed: boolean;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(title: string) {
    if (!title || title.trim().length === 0) {
      throw new Error('Todo title cannot be empty');
    }
    
    this.id = randomUUID();
    this.title = title.trim();
    this.description = '';
    this.completed = false;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}
