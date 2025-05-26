import React from 'react';
import { createRoot } from 'react-dom/client';
import { Task } from 'task11-domain';
import { CreateTaskUseCase, ToggleTaskUseCase } from 'task11-application';
import { ipcRenderer } from 'electron';

export const App: React.FC = () => {
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = React.useState('');
  const [newTaskDescription, setNewTaskDescription] = React.useState('');

  React.useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    const loadedTasks = await ipcRenderer.invoke('get-tasks');
    setTasks(loadedTasks);
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    await ipcRenderer.invoke('create-task', {
      title: newTaskTitle.trim(),
      description: newTaskDescription.trim() || undefined
    });

    setNewTaskTitle('');
    setNewTaskDescription('');
    await loadTasks();
  };

  const handleToggleTask = async (taskId: string) => {
    await ipcRenderer.invoke('toggle-task', taskId);
    await loadTasks();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Task Manager</h1>
          
          <form onSubmit={handleCreateTask} className="mb-8">
            <div className="mb-4">
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="Enter task title..."
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <input
                type="text"
                value={newTaskDescription}
                onChange={(e) => setNewTaskDescription(e.target.value)}
                placeholder="Enter task description (optional)..."
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Add Task
            </button>
          </form>

          <div className="space-y-4">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center p-4 bg-gray-50 rounded-lg"
              >
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => handleToggleTask(task.id)}
                  className="w-5 h-5 mr-4"
                />
                <div className="flex-1">
                  <h3 className={`text-lg font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                    {task.title}
                  </h3>
                  {task.description && (
                    <p className="text-gray-600 mt-1">{task.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
} 