import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import { FileSyncManager } from 'task11-infrastructure';
import { FileSyncConfigManager } from 'task11-infrastructure';
import { Task } from 'task11-domain';

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // In development, load from localhost
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools();
  } else {
    // In production, load the built index.html
    mainWindow.loadFile(path.join(__dirname, '../build/index.html'));
  }
}

// Persistent file-based task storage
const config = FileSyncConfigManager.getDefaultConfig();
const syncManager = new FileSyncManager(config.storageDir);
let repo: ReturnType<FileSyncManager['getRepository']>;

app.whenReady().then(async () => {
  await syncManager.start();
  repo = syncManager.getRepository();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC handlers for task operations
ipcMain.handle('get-tasks', async () => {
  return repo.getAll();
});

ipcMain.handle(
  'create-task',
  async (_, task: { title: string; description?: string }) => {
    const newTask = new Task(
      task.title,
      Math.random().toString(36).substring(2, 9),
      task.description,
      false
    );
    await repo.add(newTask);
    return newTask;
  }
);

ipcMain.handle('toggle-task', async (_, taskId: string) => {
  const allTasks = await repo.getAll();
  const task = allTasks.find(t => t.id === taskId);
  if (task) {
    const updatedTask = new Task(
      task.title,
      task.id,
      task.description,
      !task.completed
    );
    await repo.update(updatedTask);
    return updatedTask;
  }
  return null;
});
