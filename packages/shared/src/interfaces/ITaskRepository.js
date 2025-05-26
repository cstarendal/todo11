"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryTaskRepository = void 0;
// Exportera InMemoryTaskRepository separat för att undvika modulproblem
class InMemoryTaskRepositoryImpl {
    tasks = [];
    async add(task) {
        this.tasks.push(task);
    }
    async getAll() {
        return [...this.tasks];
    }
    async getById(id) {
        const task = this.tasks.find(t => t.id === id);
        return task || null;
    }
    async update(task) {
        const index = this.tasks.findIndex(t => t.id === task.id);
        if (index === -1) {
            throw new Error(`Task with id ${task.id} not found`);
        }
        this.tasks[index] = task;
    }
}
exports.InMemoryTaskRepository = InMemoryTaskRepositoryImpl;
//# sourceMappingURL=ITaskRepository.js.map