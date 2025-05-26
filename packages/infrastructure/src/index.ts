// Infrastructure adapters for file storage and persistence
export { FileTaskRepository } from './FileTaskRepository';
export { IFileWatcher, FileEvent, FileEventType, NodeFileWatcher } from './FileWatcher';
export { IFileSyncManager, FileSyncManager } from './FileSyncManager';
export { FileSyncConfig, FileSyncConfigManager } from './FileSyncConfig';
