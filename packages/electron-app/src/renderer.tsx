import './index.css';
import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { Task } from 'task11-domain';
// Dynamically require Electron's ipcRenderer at runtime to avoid bundling the entire electron package.
// eslint-disable-next-line @typescript-eslint/no-var-requires
// @ts-ignore
const { ipcRenderer } = (window as any).require
  ? (window as any).require('electron')
  : require('electron');

import SettingsModal from './SettingsModal';

const SIDEBAR_LISTS = [
  { name: 'Today', icon: '📅', count: 0 },
  { name: 'Next 7 Days', icon: '🗓️', count: 0 },
  { name: 'Inbox', icon: '📥', count: 0 },
  { name: 'OKRs (2025)', icon: '🎯', count: 0 },
  { name: 'Hälsa & Rutiner', icon: '💪', count: 0 },
  { name: 'WeekRetroList', icon: '🔄', count: 0 },
  { name: 'Hemfix', icon: '🏠', count: 0 },
  { name: 'Starendal Ventures', icon: '��', count: 0 },
];

export function App(): React.ReactElement {
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [selectedList, setSelectedList] = React.useState('Today');
  const [selectedTask, setSelectedTask] = React.useState<Task | null>(null);
  const [newTaskTitle, setNewTaskTitle] = React.useState('');
  const [newTaskDescription, setNewTaskDescription] = React.useState('');
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const [storagePath, setStoragePath] = React.useState<string>('');

  React.useEffect(() => {
    loadTasks();
    loadStoragePath();
  }, []);

  const loadTasks = async () => {
    const loadedTasks = await ipcRenderer.invoke('get-tasks');
    setTasks(Array.isArray(loadedTasks) ? loadedTasks : []);
  };

  const loadStoragePath = async () => {
    const path = await ipcRenderer.invoke('get-storage-path');
    setStoragePath(typeof path === 'string' ? path : '');
  };

  const handleChooseFolder = async () => {
    const newPath = await ipcRenderer.invoke('pick-storage-folder');
    if (typeof newPath === 'string') {
      setStoragePath(newPath);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    await ipcRenderer.invoke('create-task', {
      title: newTaskTitle.trim(),
      description: newTaskDescription.trim() || undefined,
    });
    setNewTaskTitle('');
    setNewTaskDescription('');
    await loadTasks();
  };

  const handleToggleTask = async (taskId: string) => {
    await ipcRenderer.invoke('toggle-task', taskId);
    await loadTasks();
  };

  // For now, all tasks are shown in Today
  const visibleTasks = tasks;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r flex flex-col">
        <div className="p-4 text-2xl font-bold border-b flex items-center justify-between">
          TODO
          <button
            data-testid="open-settings"
            className="ml-2 p-1 rounded hover:bg-gray-200"
            onClick={() => setSettingsOpen(true)}
            title="Settings"
          >
            <span role="img" aria-label="settings">⚙️</span>
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto">
          {SIDEBAR_LISTS.map(list => (
            <div
              key={list.name}
              className={`flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100 ${selectedList === list.name ? 'bg-gray-200 font-semibold' : ''}`}
              onClick={() => setSelectedList(list.name)}
            >
              <span className="mr-3 text-lg">{list.icon}</span>
              <span className="flex-1">{list.name}</span>
              {list.count > 0 && (
                <span className="ml-2 bg-gray-300 rounded-full px-2 text-xs">
                  {list.count}
                </span>
              )}
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Pane */}
      <main className="flex-1 flex flex-col">
        <header className="flex items-center justify-between px-8 py-4 border-b bg-white">
          <h1 className="text-2xl font-bold">{selectedList}</h1>
          <span className="text-gray-500">{visibleTasks.length} tasks</span>
        </header>
        <form
          onSubmit={handleCreateTask}
          className="px-8 py-4 bg-white border-b flex gap-2"
        >
          <input
            type="text"
            value={newTaskTitle}
            onChange={e => setNewTaskTitle(e.target.value)}
            placeholder={'Add task to "Inbox"'}
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Add
          </button>
        </form>
        <div className="flex-1 overflow-y-auto px-8 py-4 space-y-2 bg-gray-50">
          {visibleTasks.map(task => (
            <div
              key={task.id}
              className={`flex items-center p-4 bg-white rounded-lg shadow-sm cursor-pointer hover:bg-blue-50 ${selectedTask?.id === task.id ? 'ring-2 ring-blue-400' : ''}`}
              onClick={() => setSelectedTask(task)}
            >
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => handleToggleTask(task.id)}
                className="w-5 h-5 mr-4"
              />
              <div className="flex-1">
                <h3
                  className={`text-lg font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}
                >
                  {task.title}
                </h3>
                {task.description && (
                  <p className="text-gray-600 mt-1">{task.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Details Pane */}
      <aside className="w-96 bg-white border-l flex flex-col">
        <div className="p-6 border-b">
          {selectedTask ? (
            <>
              <h2 className="text-xl font-bold mb-2">{selectedTask.title}</h2>
              <div className="text-gray-600 mb-2">
                {selectedTask.description}
              </div>
              <div className="text-sm text-gray-400">
                Task ID: {selectedTask.id}
              </div>
              <div className="mt-4">
                <span
                  className={`inline-block px-2 py-1 rounded text-xs ${selectedTask.completed ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}
                >
                  {selectedTask.completed ? 'Completed' : 'Active'}
                </span>
              </div>
            </>
          ) : (
            <div className="text-gray-400 italic">
              Select a task to see details
            </div>
          )}
        </div>
      </aside>

      <SettingsModal
        open={settingsOpen}
        storagePath={storagePath}
        onChooseFolder={handleChooseFolder}
        onClose={() => setSettingsOpen(false)}
      />
    </div>
  );
}

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
