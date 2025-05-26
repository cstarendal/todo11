// Manual testing demo for Task App
// Self-contained implementation that mirrors the actual use cases

// Simple Task entity (mirrors packages/domain/src/entities/Task.ts)
class Task {
    constructor(title, id = null, description = '', isCompleted = false) {
        this.id = id || this.generateId();
        this.title = title;
        this.description = description;
        this.isCompleted = isCompleted;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }

    generateId() {
        return 'task_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    toggle() {
        return new Task(this.title, this.id, this.description, !this.isCompleted);
    }
}

// Simple repository (mirrors packages/shared/src/interfaces/ITaskRepository.ts)
class InMemoryTaskRepository {
    constructor() {
        this.tasks = [];
    }

    async save(task) {
        const existingIndex = this.tasks.findIndex(t => t.id === task.id);
        if (existingIndex >= 0) {
            this.tasks[existingIndex] = task;
        } else {
            this.tasks.push(task);
        }
        return task;
    }

    async findAll() {
        return [...this.tasks];
    }

    async findById(id) {
        return this.tasks.find(t => t.id === id) || null;
    }
}

// Use cases (mirror packages/application/src/*)
class CreateTaskUseCase {
    constructor(repository) {
        this.repo = repository;
    }

    async execute(input) {
        const task = new Task(input.title, undefined, input.description);
        return await this.repo.save(task);
    }
}

class ToggleTaskUseCase {
    constructor(repository) {
        this.repo = repository;
    }

    async execute(taskId) {
        const task = await this.repo.findById(taskId);
        if (!task) {
            throw new Error('Task not found');
        }
        const toggledTask = task.toggle();
        return await this.repo.save(toggledTask);
    }
}

class TaskDemo {
    constructor() {
        // Initialize repository and use cases
        this.repository = new InMemoryTaskRepository();
        this.createTaskUseCase = new CreateTaskUseCase(this.repository);
        this.toggleTaskUseCase = new ToggleTaskUseCase(this.repository);
        
        // Initialize UI
        this.initializeEventListeners();
        this.renderTasks();
        
        console.log('🚀 Task Demo initialized successfully!');
    }

    initializeEventListeners() {
        const form = document.getElementById('task-form');
        form.addEventListener('submit', (e) => this.handleCreateTask(e));
    }

    async handleCreateTask(event) {
        event.preventDefault();
        
        const titleInput = document.getElementById('task-title');
        const descriptionInput = document.getElementById('task-description');
        
        const title = titleInput.value.trim();
        const description = descriptionInput.value.trim();
        
        if (!title) {
            alert('Please enter a task title');
            return;
        }

        try {
            // Use our CreateTaskUseCase
            const task = await this.createTaskUseCase.execute({
                title,
                description: description || undefined
            });
            
            console.log('✅ Task created:', task);
            
            // Clear form
            titleInput.value = '';
            descriptionInput.value = '';
            
            // Re-render tasks
            this.renderTasks();
            
        } catch (error) {
            console.error('❌ Error creating task:', error);
            alert('Error creating task: ' + error.message);
        }
    }

    async handleToggleTask(taskId) {
        try {
            // Use our ToggleTaskUseCase
            const updatedTask = await this.toggleTaskUseCase.execute(taskId);
            console.log('🔄 Task toggled:', updatedTask);
            
            // Re-render tasks
            this.renderTasks();
            
        } catch (error) {
            console.error('❌ Error toggling task:', error);
            alert('Error toggling task: ' + error.message);
        }
    }

    async renderTasks() {
        try {
            // Get all tasks from repository
            const tasks = await this.repository.findAll();
            
            // Update task count
            const taskCount = document.getElementById('task-count');
            taskCount.textContent = `Total tasks: ${tasks.length}`;
            
            // Render task list
            const taskList = document.getElementById('task-list');
            taskList.innerHTML = '';
            
            if (tasks.length === 0) {
                taskList.innerHTML = '<li class="empty-state">No tasks yet. Create your first task above!</li>';
                return;
            }
            
            tasks.forEach(task => {
                const li = document.createElement('li');
                li.className = `task-item ${task.isCompleted ? 'completed' : 'pending'}`;
                li.innerHTML = `
                    <div class="task-content">
                        <h3 class="task-title">${this.escapeHtml(task.title)}</h3>
                        ${task.description ? `<p class="task-description">${this.escapeHtml(task.description)}</p>` : ''}
                        <div class="task-meta">
                            <span class="task-status">${task.isCompleted ? '✅ Completed' : '⏳ Pending'}</span>
                            <span class="task-id">ID: ${task.id.slice(0, 8)}...</span>
                        </div>
                    </div>
                    <button class="toggle-btn" onclick="demo.handleToggleTask('${task.id}')">
                        ${task.isCompleted ? 'Mark Pending' : 'Mark Complete'}
                    </button>
                `;
                
                taskList.appendChild(li);
            });
            
        } catch (error) {
            console.error('❌ Error rendering tasks:', error);
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize demo when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.demo = new TaskDemo();
});

// Error handling for module loading
window.addEventListener('error', (event) => {
    if (event.message.includes('Failed to resolve module')) {
        console.error('🚨 Module loading failed. Please build the TypeScript packages first:');
        console.error('Run: npm run build');
        
        document.body.innerHTML = `
            <div style="max-width: 600px; margin: 50px auto; padding: 20px; background: #fee; border: 1px solid #fcc; border-radius: 8px;">
                <h2>🚨 Setup Required</h2>
                <p>Please build the TypeScript packages first:</p>
                <pre style="background: #f5f5f5; padding: 10px; margin: 10px 0; border-radius: 4px;">npm run build</pre>
                <p>Then refresh this page.</p>
            </div>
        `;
    }
});
