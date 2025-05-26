import React from 'react';
import { Task } from 'task11-domain';

interface TaskDetailsProps {
  task: Task | null;
}

const TaskDetails: React.FC<TaskDetailsProps> = ({ task }) => {
  if (!task) {
    return (
      <aside className="w-72 p-6 border-l border-gray-200 text-gray-500 italic">
        Select a task
      </aside>
    );
  }

  return (
    <aside className="w-72 p-6 border-l border-gray-200">
      <h3 className="text-lg font-semibold mb-2">Details</h3>
      <p className="mb-2">
        <span className="font-medium">Title:</span> {task.title}
      </p>
      {task.description && (
        <p className="mb-2">
          <span className="font-medium">Description:</span> {task.description}
        </p>
      )}
      <p className="text-sm text-gray-500 mt-4">
        Created: {task.createdAt.toLocaleString()}
      </p>
    </aside>
  );
};

export default TaskDetails; 