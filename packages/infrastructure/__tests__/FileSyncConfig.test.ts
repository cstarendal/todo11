import { FileSyncConfigManager, FileSyncConfig } from '../src/FileSyncConfig'
import * as path from 'path'
import * as os from 'os'
import * as fs from 'fs/promises'

jest.mock('fs/promises')

describe('FileSyncConfigManager', () => {
  const mockFs = fs as jest.Mocked<typeof fs>

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getDefaultConfig', () => {
    it('should return default config with local path', () => {
      const config = FileSyncConfigManager.getDefaultConfig()
      
      expect(config).toEqual({
        storageDir: path.join(os.homedir(), '.task-app'),
        enableFileWatcher: true,
        maxRetries: 3,
        retryDelay: 50
      })
    })
  })

  describe('getSynologyConfig', () => {
    it('should return config with Synology path', () => {
      const config = FileSyncConfigManager.getSynologyConfig()
      
      expect(config).toEqual({
        storageDir: path.join(os.homedir(), 'Synology Drive', 'TaskApp'),
        enableFileWatcher: true,
        maxRetries: 3,
        retryDelay: 50
      })
    })
  })

  describe('createCustomConfig', () => {
    it('should create config with custom storage directory', () => {
      const customPath = '/custom/path'
      const config = FileSyncConfigManager.createCustomConfig(customPath)
      
      expect(config).toEqual({
        storageDir: customPath,
        enableFileWatcher: true,
        maxRetries: 3,
        retryDelay: 50
      })
    })
  })

  describe('ensureStorageDirectory', () => {
    it('should create storage directory if it does not exist', async () => {
      const config: FileSyncConfig = {
        storageDir: '/test/path',
        enableFileWatcher: true,
        maxRetries: 3,
        retryDelay: 50
      }

      mockFs.mkdir.mockResolvedValueOnce(undefined)

      await FileSyncConfigManager.ensureStorageDirectory(config)

      expect(mockFs.mkdir).toHaveBeenCalledWith('/test/path', { recursive: true })
    })

    it('should handle errors when creating directory', async () => {
      const config: FileSyncConfig = {
        storageDir: '/test/path',
        enableFileWatcher: true,
        maxRetries: 3,
        retryDelay: 50
      }

      const error = new Error('Directory creation failed')
      mockFs.mkdir.mockRejectedValueOnce(error)

      await expect(FileSyncConfigManager.ensureStorageDirectory(config))
        .rejects.toThrow('Directory creation failed')
    })
  })
}) 