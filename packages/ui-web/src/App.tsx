import React, { useState, useEffect } from 'react'
import { Task } from 'task11-domain'
import { CreateTaskUseCase } from 'task11-application'
import { ToggleTaskUseCase } from 'task11-application'
import { InMemoryTaskRepository } from 'task11-shared'

function App() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [newTaskDescription, setNewTaskDescription] = useState('')
  const [repository] = useState(() => new InMemoryTaskRepository())
  const [createTaskUseCase] = useState(() => new CreateTaskUseCase(repository))
  const [toggleTaskUseCase] = useState(() => new ToggleTaskUseCase(repository))

  // Load tasks from repository on mount
  useEffect(() => {
    const loadTasks = async () => {
      const allTasks = await repository.getAll()
      setTasks(allTasks)
    }
    loadTasks()
  }, [repository])

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newTaskTitle.trim()) {
      return
    }

    try {
      await createTaskUseCase.execute({
        title: newTaskTitle.trim(),
        description: newTaskDescription.trim() || undefined
      })
      
      // Refresh tasks from repository
      const allTasks = await repository.getAll()
      setTasks(allTasks)
      
      setNewTaskTitle('')
      setNewTaskDescription('')
    } catch (error) {
      // Error handling - could be enhanced with user notifications
    }
  }

  const handleToggleTask = async (taskId: string) => {
    try {
      await toggleTaskUseCase.execute(taskId)
      
      // Refresh tasks from repository
      const allTasks = await repository.getAll()
      setTasks(allTasks)
    } catch (error) {
      // Error handling - could be enhanced with user notifications
    }
  }

  return (
    <div style={{
      backgroundColor: 'white',
      color: 'black',
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      minHeight: '100vh'
    }}>
      
      <h1 style={{ 
        color: '#2563eb', 
        fontSize: '2rem', 
        marginBottom: '1rem'
      }}>
        🎯 Task11 - Task Management
      </h1>

      <form onSubmit={handleCreateTask} style={{
        marginBottom: '2rem',
        padding: '1rem',
        border: '1px solid #ccc',
        borderRadius: '8px'
      }}>
        <input
          type="text"
          placeholder="Enter task title..."
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          style={{
            padding: '0.5rem',
            marginRight: '0.5rem',
            border: '1px solid #ccc',
            borderRadius: '4px',
            fontSize: '1rem',
            width: '300px'
          }}
        />
        <button 
          type="submit"
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Add Task
        </button>
      </form>

      <div>
        <h2>Tasks ({tasks.length})</h2>
        {tasks.length === 0 ? (
          <p>No tasks yet. Create your first task above!</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {tasks.map(task => (
              <li 
                key={task.id}
                style={{
                  padding: '0.75rem',
                  margin: '0.5rem 0',
                  border: '1px solid #e5e7eb',
                  borderRadius: '4px',
                  backgroundColor: task.completed ? '#f0f9ff' : '#ffffff'
                }}
              >
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => handleToggleTask(task.id)}
                    style={{ marginRight: '0.5rem' }}
                  />
                  <span style={{ 
                    textDecoration: task.completed ? 'line-through' : 'none',
                    color: task.completed ? '#6b7280' : '#000000'
                  }}>
                    {task.title}
                  </span>
                </label>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default App
