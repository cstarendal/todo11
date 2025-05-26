import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';
import { ChokidarFileWatcher } from '../src/ChokidarFileWatcher';
import chokidar from 'chokidar';

jest.mock('chokidar');
const mockedChokidar = chokidar as jest.Mocked<typeof chokidar>;

describe('ChokidarFileWatcher', () => {
  let watcherInstance: any;
  let fileWatcher: ChokidarFileWatcher;

  beforeEach(() => {
    watcherInstance = {
      on: jest.fn().mockReturnThis(),
      close: jest.fn(),
    };
    mockedChokidar.watch.mockReturnValue(watcherInstance);
    fileWatcher = new ChokidarFileWatcher();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should NOT trigger callback if a different file is changed', async () => {
    const callback = jest.fn();
    await fileWatcher.watch('/tmp/testdir/file1.json', callback);

    // Hämta handlern för 'change'
    const changeHandler = watcherInstance.on.mock.calls.find((call: any[]) => call[0] === 'change')[1];
    // Simulera ändring på annan fil
    changeHandler('/tmp/testdir/otherfile.json');

    expect(callback).not.toHaveBeenCalled();
  });

  it('should trigger callback with type "created" when the watched file is added', async () => {
    const callback = jest.fn();
    await fileWatcher.watch('/tmp/testdir/file1.json', callback);
    const addHandler = watcherInstance.on.mock.calls.find((call: any[]) => call[0] === 'add')[1];
    addHandler('/tmp/testdir/file1.json');
    expect(callback).toHaveBeenCalledWith(expect.objectContaining({
      path: '/tmp/testdir/file1.json',
      type: 'created',
    }));
  });

  it('should trigger callback with type "modified" when the watched file is changed', async () => {
    const callback = jest.fn();
    await fileWatcher.watch('/tmp/testdir/file1.json', callback);
    const changeHandler = watcherInstance.on.mock.calls.find((call: any[]) => call[0] === 'change')[1];
    changeHandler('/tmp/testdir/file1.json');
    expect(callback).toHaveBeenCalledWith(expect.objectContaining({
      path: '/tmp/testdir/file1.json',
      type: 'modified',
    }));
  });

  it('should trigger callback with type "deleted" when the watched file is unlinked', async () => {
    const callback = jest.fn();
    await fileWatcher.watch('/tmp/testdir/file1.json', callback);
    const unlinkHandler = watcherInstance.on.mock.calls.find((call: any[]) => call[0] === 'unlink')[1];
    unlinkHandler('/tmp/testdir/file1.json');
    expect(callback).toHaveBeenCalledWith(expect.objectContaining({
      path: '/tmp/testdir/file1.json',
      type: 'deleted',
    }));
  });
}); 