import React, { useState } from 'react';
import { useTasks } from '../context/TasksProvider';
import TaskItem from './TaskItem';
import { Task } from 'task11-domain';

interface TaskListProps {
  onSelectTask: (task: Task) => void;
}

const TaskList: React.FC<TaskListProps> = ({ onSelectTask }) => {
  const { tasks, createTask, toggleTask } = useTasks();
  const [newTitle, setNewTitle] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    await createTask(newTitle.trim());
    setNewTitle('');
  };

  return (
    <section className="flex-1 p-6 overflow-auto">
      <h2 className="text-xl font-semibold mb-4">Tasks ({tasks.length})</h2>
      <form onSubmit={handleSubmit} className="mb-4 flex gap-2">
        <input
          type="text"
          value={newTitle}
          placeholder="Add task..."
          onChange={e => setNewTitle(e.target.value)}
          className="flex-1 border rounded-md p-2"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 rounded-md"
        >
          Add
        </button>
      </form>

      {tasks.length === 0 ? (
        <p className="text-gray-500 italic">No tasks yet</p>
      ) : (
        <ul>
          {tasks.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={toggleTask}
              onSelect={onSelectTask}
            />
          ))}
        </ul>
      )}
    </section>
  );
};

export default TaskList; 