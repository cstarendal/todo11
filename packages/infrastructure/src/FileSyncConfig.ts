import * as path from 'path';
import * as os from 'os';

export interface FileSyncConfig {
  storageDir: string;
  enableFileWatcher: boolean;
  maxRetries: number;
  retryDelay: number;
}

export class FileSyncConfigManager {
  private static readonly DEFAULT_SYNOLOGY_PATH = path.join(
    os.homedir(),
    'Synology Drive',
    'TaskApp'
  );

  private static readonly DEFAULT_LOCAL_PATH = path.join(
    os.homedir(),
    '.task-app'
  );

  static getDefaultConfig(): FileSyncConfig {
    return {
      storageDir: this.DEFAULT_LOCAL_PATH,
      enableFileWatcher: true,
      maxRetries: 3,
      retryDelay: 50
    };
  }

  static getSynologyConfig(): FileSyncConfig {
    return {
      storageDir: this.DEFAULT_SYNOLOGY_PATH,
      enableFileWatcher: true,
      maxRetries: 3,
      retryDelay: 50
    };
  }

  static createCustomConfig(storageDir: string): FileSyncConfig {
    return {
      storageDir,
      enableFileWatcher: true,
      maxRetries: 3,
      retryDelay: 50
    };
  }

  static async ensureStorageDirectory(config: FileSyncConfig): Promise<void> {
    const fs = await import('fs/promises');
    await fs.mkdir(config.storageDir, { recursive: true });
  }
}
