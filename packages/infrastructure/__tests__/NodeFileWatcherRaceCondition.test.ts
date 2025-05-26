import { NodeFileWatcher } from '../src/FileWatcher';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';

describe('NodeFileWatcher race condition', () => {
  it('should not throw ENOENT when watching a freshly created directory', async () => {
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'watcher-'));
    const filePath = path.join(tempDir, 'tasks.json');

    const watcher = new NodeFileWatcher();

    // Expect watch to resolve without throwing
    await expect(
      watcher.watch(filePath, () => {})
    ).resolves.not.toThrow();

    await watcher.unwatch(filePath);
    await fs.rm(tempDir, { recursive: true, force: true });
  });
}); 