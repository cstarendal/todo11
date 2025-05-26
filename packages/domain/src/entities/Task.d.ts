export declare class Task {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly completed: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly dueDate?: Date;
  constructor(
    title: string,
    id?: string,
    description?: string,
    completed?: boolean,
    createdAt?: Date,
    updatedAt?: Date,
    dueDate?: Date
  );
  private clone;
  toggle(): Task;
  setDueDate(dueDate: Date): Task;
  clearDueDate(): Task;
}
//# sourceMappingURL=Task.d.ts.map
