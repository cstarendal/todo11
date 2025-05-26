import { v4 as uuidv4 } from 'uuid';

interface TaskProperties {
  id?: string;
  title: string;
  description?: string;
  completed?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  dueDate?: Date;
}

export class Task {
  public readonly id: string;
  public readonly title: string;
  public readonly description: string;
  public readonly completed: boolean;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;
  public readonly dueDate?: Date;

  constructor(
    title: string,
    id?: string,
    description?: string,
    completed?: boolean,
    createdAt?: Date,
    updatedAt?: Date,
    dueDate?: Date
  ) {
    if (!title || title.trim().length === 0) {
      throw new Error('Task title cannot be empty');
    }

    this.id = id || uuidv4();
    this.title = title.trim();
    this.description = description || '';
    this.completed = completed || false;
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
    this.dueDate = dueDate;
  }

  private clone(changes: Partial<TaskProperties>): Task {
    return new Task(
      changes.title ?? this.title,
      changes.id ?? this.id,
      changes.description ?? this.description,
      changes.completed ?? this.completed,
      changes.createdAt ?? this.createdAt,
      changes.updatedAt ?? new Date(),
      'dueDate' in changes ? changes.dueDate : this.dueDate
    );
  }

  toggle(): Task {
    return this.clone({ completed: !this.completed });
  }

  setDueDate(dueDate: Date): Task {
    return this.clone({ dueDate });
  }

  clearDueDate(): Task {
    return this.clone({ dueDate: undefined });
  }
}
