/* global describe, it, expect, jest */
import { BrowserSyncRepository } from '../src/BrowserSyncRepository'

describe('BrowserSyncRepository', () => {
  it('returns empty array when no data is present', async () => {
    // stub globals
    const localStorageMock = {
      getItem: jest.fn().mockReturnValue(null),
      setItem: jest.fn(),
      removeItem: jest.fn()
    }
    // @ts-ignore
    global.localStorage = localStorageMock
    // @ts-ignore
    global.window = { addEventListener: jest.fn() }

    const repo = new BrowserSyncRepository('test-device')
    const tasks = await repo.getAll()
    expect(tasks).toEqual([])
  })
}) 