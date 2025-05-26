/* eslint-disable no-undef */
import { Task } from 'task11-domain'

// Browser-compatible repository that syncs via localStorage events
export class BrowserSyncRepository {
  private readonly storageKey = 'task11_browser_sync'
  private readonly deviceId: string
  private readonly syncCallbacks: Set<() => void> = new Set()

  constructor(deviceId: string) {
    this.deviceId = deviceId
    // Listen for localStorage changes (simulating file-watcher)
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', this.handleStorageChange.bind(this))
    }
  }

  private handleStorageChange(event: StorageEvent) {
    if (event.key === this.storageKey) {
      this.notifySyncCallbacks()
    }
  }

  private notifySyncCallbacks() {
    this.syncCallbacks.forEach(cb => {
      try {
        cb()
      } catch (err) {
        console.error('Sync callback error:', err)
      }
    })
  }

  /** Subscribe to changes triggered by other browser tabs */
  onSyncChange(callback: () => void) {
    this.syncCallbacks.add(callback)
    return () => this.syncCallbacks.delete(callback)
  }

  /** Load all tasks from localStorage */
  async getAll(): Promise<Task[]> {
    const data = typeof localStorage === 'undefined' ? null : localStorage.getItem(this.storageKey)
    if (!data) return []

    try {
      const parsed = JSON.parse(data)
      return parsed.tasks.map((t: any) =>
        new Task(t.title, t.id, t.description, t.completed, new Date(t.createdAt), new Date(t.updatedAt))
      )
    } catch {
      return []
    }
  }

  async add(task: Task): Promise<void> {
    const tasks = await this.getAll()
    tasks.push(task)
    await this.saveAll(tasks)
  }

  async getById(id: string): Promise<Task | null> {
    const tasks = await this.getAll()
    return tasks.find(t => t.id === id) || null
  }

  async update(task: Task): Promise<void> {
    const tasks = await this.getAll()
    const index = tasks.findIndex(t => t.id === task.id)
    if (index >= 0) {
      tasks[index] = task
      await this.saveAll(tasks)
    }
  }

  private async saveAll(tasks: Task[]): Promise<void> {
    const syncData = {
      tasks,
      lastSync: new Date().toISOString(),
      syncedBy: this.deviceId
    }
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.storageKey, JSON.stringify(syncData))
    }
  }
} 