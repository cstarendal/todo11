"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Task = void 0;
const uuid_1 = require("uuid");
class Task {
    id;
    title;
    description;
    completed;
    createdAt;
    updatedAt;
    dueDate;
    constructor(title, id, description, completed, createdAt, updatedAt, dueDate) {
        if (!title || title.trim().length === 0) {
            throw new Error('Task title cannot be empty');
        }
        this.id = id || (0, uuid_1.v4)();
        this.title = title.trim();
        this.description = description || '';
        this.completed = completed || false;
        this.createdAt = createdAt || new Date();
        this.updatedAt = updatedAt || new Date();
        this.dueDate = dueDate;
    }
    clone(changes) {
        return new Task(changes.title ?? this.title, changes.id ?? this.id, changes.description ?? this.description, changes.completed ?? this.completed, changes.createdAt ?? this.createdAt, changes.updatedAt ?? new Date(), 'dueDate' in changes ? changes.dueDate : this.dueDate);
    }
    toggle() {
        return this.clone({ completed: !this.completed });
    }
    setDueDate(dueDate) {
        return this.clone({ dueDate });
    }
    clearDueDate() {
        return this.clone({ dueDate: undefined });
    }
}
exports.Task = Task;
