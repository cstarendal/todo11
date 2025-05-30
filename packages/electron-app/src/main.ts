import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import type { IpcMainInvokeEvent } from 'electron';
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
let syncManager = new FileSyncManager(config.storageDir);
let repo: ReturnType<FileSyncManager['getRepository']>;
let currentStoragePath = config.storageDir;

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
  async (_event: IpcMainInvokeEvent, task: { title: string; description?: string }) => {
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

ipcMain.handle('toggle-task', async (_event: IpcMainInvokeEvent, taskId: string) => {
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

// IPC handler to pick a storage folder
ipcMain.handle('pick-storage-folder', async () => {
  const win = BrowserWindow.getFocusedWindow();
  const result: any = win
    ? await dialog.showOpenDialog(win, { properties: ['openDirectory'] })
    : await dialog.showOpenDialog({ properties: ['openDirectory'] });
  
  // Handle both old (string[]) and new (OpenDialogReturnValue) API formats
  const canceled = Array.isArray(result) ? false : result.canceled;
  const filePaths = Array.isArray(result) ? result : result.filePaths;
  
  if (!canceled && filePaths.length > 0) {
    currentStoragePath = filePaths[0];
    // Stop old syncManager if needed (not strictly necessary if no background process)
    // Create new syncManager and repo for the new path
    // (In a real app, you may want to debounce or queue this)
    if (syncManager && typeof (syncManager as any).stop === 'function') {
      await (syncManager as any).stop();
    }
    syncManager = new FileSyncManager(currentStoragePath);
    await syncManager.start();
    repo = syncManager.getRepository();
    return currentStoragePath;
  }
  return currentStoragePath;
});

// IPC handler to get current storage path
ipcMain.handle('get-storage-path', async () => {
  return currentStoragePath;
});

// IPC handler to set storage path (for future use)
ipcMain.handle('set-storage-path', async (_event: IpcMainInvokeEvent, newPath: string) => {
  currentStoragePath = newPath;
  // Optionally: update syncManager/repo here
  return currentStoragePath;
});
