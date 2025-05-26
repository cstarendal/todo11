import React from 'react';
import { Task } from 'task11-domain';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onSelect: (task: Task) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onSelect }) => {
  return (
    <li
      className="flex items-center p-3 border rounded-md mb-2 bg-white hover:bg-gray-50 transition"
    >
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggle(task.id)}
        className="mr-3 w-4 h-4"
      />
      <button
        onClick={() => onSelect(task)}
        className="flex-1 text-left"
      >
        <span className={task.completed ? 'line-through text-gray-400' : ''}>{task.title}</span>
      </button>
    </li>
  );
};

export default TaskItem; 