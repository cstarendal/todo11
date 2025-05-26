import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';
import * as fs from 'fs';
import { NodeFileWatcher } from '../src/FileWatcher';

describe('NodeFileWatcher (unit)', () => {
  let watcher: NodeFileWatcher;
  let accessSpy: any;
  let callback: jest.Mock;

  beforeEach(() => {
    watcher = new NodeFileWatcher();
    callback = jest.fn();
    accessSpy = jest.spyOn(fs.promises, 'access');
  });

  afterEach(() => {
    accessSpy.mockRestore();
    jest.clearAllMocks();
  });

  it('should callback with type "created" if wasExisting=false and file now exists', async () => {
    accessSpy.mockResolvedValueOnce(undefined); // file exists
    await (watcher as any).handleFileChange('/tmp/file.txt', false, callback);
    expect(callback).toHaveBeenCalledWith(expect.objectContaining({ type: 'created' }));
  });

  it('should callback with type "deleted" if wasExisting=true and file now does not exist', async () => {
    accessSpy.mockRejectedValueOnce(new Error('not found')); // file does not exist
    await (watcher as any).handleFileChange('/tmp/file.txt', true, callback);
    expect(callback).toHaveBeenCalledWith(expect.objectContaining({ type: 'deleted' }));
  });

  it('should callback with type "modified" if wasExisting=true and file still exists', async () => {
    accessSpy.mockResolvedValueOnce(undefined); // file exists
    await (watcher as any).handleFileChange('/tmp/file.txt', true, callback);
    expect(callback).toHaveBeenCalledWith(expect.objectContaining({ type: 'modified' }));
  });

  it('should not callback if wasExisting=false and file still does not exist', async () => {
    accessSpy.mockRejectedValueOnce(new Error('not found'));
    await (watcher as any).handleFileChange('/tmp/file.txt', false, callback);
    expect(callback).not.toHaveBeenCalled();
  });

  it('should not callback if an error is thrown in try block', async () => {
    accessSpy.mockImplementationOnce(() => { throw new Error('fail'); });
    await (watcher as any).handleFileChange('/tmp/file.txt', true, callback);
    expect(callback).not.toHaveBeenCalled();
  });
}); 