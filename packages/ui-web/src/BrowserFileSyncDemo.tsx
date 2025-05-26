import React, { useState, useEffect, useCallback } from 'react'
import { Task } from 'task11-domain'
import { CreateTaskUseCase, ToggleTaskUseCase } from 'task11-application'
import { BrowserSyncRepository } from 'task11-platform-web'

interface SyncDemoProps {
  deviceName: string
  deviceIcon: string
  deviceId: string
}

const SyncDemo: React.FC<SyncDemoProps> = ({ deviceName, deviceIcon, deviceId }) => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [newTaskDescription, setNewTaskDescription] = useState('')
  const [syncStatus, setSyncStatus] = useState<string>('Initializing...')
  const [lastSync, setLastSync] = useState<string>('')
  
  // Initialize repository and use cases
  const [repository] = useState(() => new BrowserSyncRepository(deviceId))
  const [createTaskUseCase] = useState(() => new CreateTaskUseCase(repository))
  const [toggleTaskUseCase] = useState(() => new ToggleTaskUseCase(repository))

  // Load tasks and setup sync monitoring
  const loadTasks = useCallback(async () => {
    try {
      const allTasks = await repository.getAll()
      setTasks(allTasks)
      setSyncStatus('✅ Synced')
      setLastSync(new Date().toLocaleTimeString())
    } catch (error) {
      setSyncStatus('❌ Sync Error')
      console.error('Error loading tasks:', error)
    }
  }, [repository])

  useEffect(() => {
    // Initial load
    loadTasks()

    // Setup real-time sync monitoring
    const unsubscribe = repository.onSyncChange(() => {
      setSyncStatus('🔄 Syncing...')
      setTimeout(() => {
        loadTasks()
      }, 100) // Small delay to show sync indicator
    })

    return unsubscribe
  }, [loadTasks, repository])

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newTaskTitle.trim()) return

    setSyncStatus('🔄 Creating...')
    
    try {
      await createTaskUseCase.execute({
        title: newTaskTitle.trim(),
        description: newTaskDescription.trim() || undefined
      })
      
      setNewTaskTitle('')
      setNewTaskDescription('')
      await loadTasks()
    } catch (error) {
      setSyncStatus('❌ Create Error')
      console.error('Failed to create task:', error)
    }
  }

  const handleToggleTask = async (taskId: string) => {
    setSyncStatus('🔄 Updating...')
    
    try {
      await toggleTaskUseCase.execute(taskId)
      await loadTasks()
    } catch (error) {
      setSyncStatus('❌ Update Error')
      console.error('Failed to toggle task:', error)
    }
  }

  return (
    <div style={{
      border: '2px solid #e5e7eb',
      borderRadius: '12px',
      padding: '20px',
      margin: '10px',
      backgroundColor: 'white',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    }}>
      {/* Device Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '20px',
        paddingBottom: '15px',
        borderBottom: '2px solid #f3f4f6'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '1.5rem' }}>{deviceIcon}</span>
          <h3 style={{ margin: 0, color: '#374151' }}>{deviceName}</h3>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '0.9rem'
        }}>
          <span>{syncStatus}</span>
          {lastSync && (
            <span style={{ color: '#6b7280' }}>({lastSync})</span>
          )}
        </div>
      </div>

      {/* Task Creation Form */}
      <form onSubmit={handleCreateTask} style={{ marginBottom: '20px' }}>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="text"
            placeholder="Enter task title..."
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '1rem'
            }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="text"
            placeholder="Description (optional)"
            value={newTaskDescription}
            onChange={(e) => setNewTaskDescription(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '1rem'
            }}
          />
        </div>
        <button 
          type="submit"
          style={{
            backgroundColor: '#2563eb',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '1rem',
            transition: 'background-color 0.2s'
          }}
        >
          Add Task
        </button>
      </form>

      {/* Task List */}
      <div>
        <h4 style={{ marginBottom: '15px', color: '#374151' }}>
          Tasks ({tasks.length})
        </h4>
        {tasks.length === 0 ? (
          <p style={{ 
            color: '#6b7280', 
            fontStyle: 'italic',
            textAlign: 'center',
            padding: '20px'
          }}>
            No tasks yet. Create your first task above!
          </p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {tasks.map(task => (
              <li 
                key={task.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px',
                  margin: '8px 0',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  backgroundColor: task.completed ? '#f0f9ff' : '#ffffff',
                  transition: 'all 0.2s'
                }}
              >
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => handleToggleTask(task.id)}
                  style={{ 
                    marginRight: '12px',
                    width: '18px',
                    height: '18px',
                    cursor: 'pointer'
                  }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ 
                    textDecoration: task.completed ? 'line-through' : 'none',
                    color: task.completed ? '#6b7280' : '#000000',
                    fontWeight: '500'
                  }}>
                    {task.title}
                  </div>
                  {task.description && (
                    <div style={{ 
                      fontSize: '0.9rem',
                      color: '#6b7280',
                      marginTop: '4px'
                    }}>
                      {task.description}
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

const BrowserFileSyncDemo: React.FC = () => {
  return (
    <div style={{
      backgroundColor: '#f9fafb',
      minHeight: '100vh',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div style={{
          textAlign: 'center',
          marginBottom: '30px',
          padding: '20px',
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          <h1 style={{ 
            color: '#2563eb', 
            fontSize: '2.5rem', 
            marginBottom: '10px' 
          }}>
            🔄 React File-Sync Demo
          </h1>
          <p style={{ 
            color: '#6b7280', 
            fontSize: '1.2rem',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Real-time synchronization between multiple "devices" using browser storage events.
            Changes in one panel instantly appear in the other, simulating file-sync behavior.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '20px',
          marginBottom: '30px'
        }}>
          <SyncDemo 
            deviceName="MacBook Pro"
            deviceIcon="💻"
            deviceId="device-1"
          />
          <SyncDemo 
            deviceName="iPhone"
            deviceIcon="📱"
            deviceId="device-2"
          />
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{ marginBottom: '15px', color: '#374151' }}>
            🧪 Test Multi-Device Sync
          </h3>
          <div style={{ 
            display: 'flex', 
            gap: '10px', 
            flexWrap: 'wrap',
            marginBottom: '15px'
          }}>
            <button
              onClick={() => {
                const event = new StorageEvent('storage', {
                  key: 'task11_browser_sync',
                  newValue: localStorage.getItem('task11_browser_sync'),
                  oldValue: localStorage.getItem('task11_browser_sync')
                })
                window.dispatchEvent(event)
              }}
              style={{
                backgroundColor: '#059669',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              🔄 Trigger Sync Event
            </button>
            <button
              onClick={() => {
                localStorage.removeItem('task11_browser_sync')
                window.location.reload()
              }}
              style={{
                backgroundColor: '#dc2626',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              🗑️ Clear All Data
            </button>
            <button
              onClick={() => {
                window.open(window.location.href, '_blank')
              }}
              style={{
                backgroundColor: '#7c3aed',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              🆕 Open New Tab
            </button>
          </div>
          <p style={{ 
            color: '#6b7280', 
            fontSize: '0.9rem',
            margin: 0
          }}>
            <strong>Instructions:</strong> Create tasks in either panel and watch them instantly 
            appear in the other. Open multiple tabs to see real-time synchronization across 
            browser windows, simulating the file-sync behavior that will work with actual files 
            on macOS and Synology Drive.
          </p>
        </div>
      </div>
    </div>
  )
}

export default BrowserFileSyncDemo
