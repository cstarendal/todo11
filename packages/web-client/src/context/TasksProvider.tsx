import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { Task } from 'task11-domain';
import { CreateTaskUseCase, ToggleTaskUseCase } from 'task11-application';
import { BrowserSyncRepository } from 'task11-platform-web';

interface TasksContextValue {
  tasks: Task[];
  createTask: (title: string, description?: string) => Promise<void>;
  toggleTask: (id: string) => Promise<void>;
}

const TasksContext = createContext<TasksContextValue | undefined>(undefined);

export const TasksProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);

  // Initialize repository and use cases once
  const repositoryRef = React.useRef(new BrowserSyncRepository('web-client'));
  const createTaskUseCaseRef = React.useRef(new CreateTaskUseCase(repositoryRef.current));
  const toggleTaskUseCaseRef = React.useRef(new ToggleTaskUseCase(repositoryRef.current));

  const loadTasks = useCallback(async () => {
    const all = await repositoryRef.current.getAll();
    setTasks(all);
  }, []);

  useEffect(() => {
    loadTasks();

    const unsubscribe = repositoryRef.current.onSyncChange(() => {
      // Brief delay for UX (show spinner later)
      setTimeout(() => {
        loadTasks();
      }, 50);
    });

    return () => {
      unsubscribe();
    };
  }, [loadTasks]);

  const createTask = useCallback(async (title: string, description?: string) => {
    await createTaskUseCaseRef.current.execute({ title, description });
    await loadTasks();
  }, [loadTasks]);

  const toggleTask = useCallback(async (id: string) => {
    await toggleTaskUseCaseRef.current.execute(id);
    await loadTasks();
  }, [loadTasks]);

  const value: TasksContextValue = {
    tasks,
    createTask,
    toggleTask,
  };

  return <TasksContext.Provider value={value}>{children}</TasksContext.Provider>;
};

export const useTasks = (): TasksContextValue => {
  const ctx = useContext(TasksContext);
  if (!ctx) throw new Error('useTasks must be used within TasksProvider');
  return ctx;
}; 