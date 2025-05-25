interface Task {
  id: string
  title: string
  completed: boolean
}

// Global declarations must be in a module context
declare global {
  interface Window {
    taskManager: TaskManager
  }
}

class TaskManager {
  private tasks: Task[] = []
  private taskList!: HTMLElement
  private taskForm!: HTMLFormElement  
  private taskInput!: HTMLInputElement
  private taskCounter!: HTMLElement

  constructor() {
    this.initializeApp()
  }

  private initializeApp(): void {
    document.body.innerHTML = `
      <div class="app">
        <h1>🎯 Task11 - Task Management</h1>
        
        <form id="task-form" class="task-form">
          <input 
            type="text" 
            id="task-input" 
            placeholder="Enter task title..." 
            required
          />
          <button type="submit">Add Task</button>
        </form>

        <div class="tasks-section">
          <h2 id="task-counter">Tasks (0)</h2>
          <div id="task-list"></div>
        </div>
      </div>
    `

    this.taskForm = document.getElementById('task-form') as HTMLFormElement
    this.taskInput = document.getElementById('task-input') as HTMLInputElement
    this.taskList = document.getElementById('task-list') as HTMLElement
    this.taskCounter = document.getElementById('task-counter') as HTMLElement

    this.bindEvents()
    this.render()
  }

  private bindEvents(): void {
    this.taskForm.addEventListener('submit', (e) => {
      e.preventDefault()
      this.addTask()
    })
  }

  private addTask(): void {
    const title = this.taskInput.value.trim()
    if (!title) return

    const newTask: Task = {
      id: Date.now().toString(),
      title,
      completed: false
    }

    this.tasks.push(newTask)
    this.taskInput.value = ''
    this.render()
  }

  private toggleTask(taskId: string): void {
    const task = this.tasks.find(t => t.id === taskId)
    if (task) {
      task.completed = !task.completed
      this.render()
    }
  }

  private render(): void {
    this.updateCounter()
    this.renderTasks()
  }

  private updateCounter(): void {
    this.taskCounter.textContent = `Tasks (${this.tasks.length})`
  }

  private renderTasks(): void {
    if (this.tasks.length === 0) {
      this.taskList.innerHTML = '<p>No tasks yet. Create your first task above!</p>'
      return
    }

    this.taskList.innerHTML = this.tasks
      .map(task => `
        <div class="task-item ${task.completed ? 'completed' : ''}">
          <label class="task-label">
            <input 
              type="checkbox" 
              ${task.completed ? 'checked' : ''}
              onchange="taskManager.toggleTask('${task.id}')"
            />
            <span>${task.title}</span>
          </label>
        </div>
      `)
      .join('')
  }
}

// Global reference for event handlers
let taskManager: TaskManager

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  taskManager = new TaskManager()
})

// Export for event handlers
declare global {
  interface Window {
    taskManager: TaskManager
  }
}
window.taskManager = taskManager
