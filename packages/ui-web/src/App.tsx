import React, { useState, useEffect } from 'react'
import { Task } from 'task11-domain'
import { CreateTaskUseCase } from 'task11-application'
import { InMemoryTaskRepository } from 'task11-shared'

// Initialize the application layer
const taskRepository = new InMemoryTaskRepository()
const createTaskUseCase = new CreateTaskUseCase(taskRepository)

function App() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [newTaskDescription, setNewTaskDescription] = useState('')

  // Load tasks on component mount
  useEffect(() => {
    const loadTasks = async () => {
      const allTasks = await taskRepository.getAll()
      setTasks(allTasks)
    }
    loadTasks()
  }, [])

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newTaskTitle.trim()) {
      alert('Task title is required')
      return
    }

    try {
      await createTaskUseCase.execute({
        title: newTaskTitle.trim(),
        description: newTaskDescription.trim() || undefined
      })
      
      // Refresh tasks list
      const allTasks = await taskRepository.getAll()
      setTasks(allTasks)
      
      // Clear form
      setNewTaskTitle('')
      setNewTaskDescription('')
    } catch (error) {
      console.error('Failed to create task:', error)
      alert('Failed to create task')
    }
  }

  return (
    <div className="container">
      <h1>Task11 - Task Management</h1>
      
      <form onSubmit={handleCreateTask} className="task-form">
        <input
          type="text"
          placeholder="Task title..."
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Description (optional)..."
          value={newTaskDescription}
          onChange={(e) => setNewTaskDescription(e.target.value)}
        />
        <button type="submit">Add Task</button>
      </form>

      <div className="task-list">
        <h2>Tasks ({tasks.length})</h2>
        {tasks.length === 0 ? (
          <p>No tasks yet. Create your first task above!</p>
        ) : (
          tasks.map((task) => (
            <div key={task.id} className="task-item">
              <div>
                <h3>{task.title}</h3>
                {task.description && <p>{task.description}</p>}
                <small>Created: {task.createdAt.toLocaleString()}</small>
              </div>
              <div>
                <span>Status: {task.completed ? 'Completed' : 'Pending'}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default App
