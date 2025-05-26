import React, { useState } from 'react';
import './index.css';
import { TasksProvider } from './context/TasksProvider';
import Sidebar from './components/Sidebar';
import TaskList from './components/TaskList';
import TaskDetails from './components/TaskDetails';
import { Task } from 'task11-domain';

const App: React.FC = () => {
  const [activeList, setActiveList] = useState<string>('today');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  return (
    <TasksProvider>
      <div className="flex h-screen">
        <Sidebar activeList={activeList} onSelect={setActiveList} />
        <TaskList onSelectTask={setSelectedTask} />
        <TaskDetails task={selectedTask} />
      </div>
    </TasksProvider>
  );
};

export default App;
