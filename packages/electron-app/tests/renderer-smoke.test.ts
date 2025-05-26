import fs from 'fs';
import path from 'path';
import { JSDOM } from 'jsdom';

describe.skip('Renderer build smoke test', () => {
  it('should render Task Manager heading in built HTML', () => {
    const buildDir = path.resolve(__dirname, '../build');
    const html = fs.readFileSync(path.join(buildDir, 'index.html'), 'utf-8');
    const dom = new JSDOM(html, { runScripts: 'dangerously', resources: 'usable' });
    // Simulate loading the renderer bundle
    const rendererPath = path.join(buildDir, 'renderer.js');
    const rendererCode = fs.readFileSync(rendererPath, 'utf-8');
    // Provide minimal Node globals expected by the bundle
    // @ts-ignore
    dom.window.__dirname = '/';
    // Some code paths may expect 'process' to exist
    // @ts-ignore
    dom.window.process = { env: {} };
    // @ts-ignore
    dom.window.require = (moduleName) => {
      if (moduleName === 'fs') {
        return {
          existsSync: () => false,
          readFileSync: () => '',
          join: path.join
        };
      }
      if (moduleName === 'path') {
        return { ...path };
      }
      // Return an object with a no-op join to satisfy any other unexpected uses
      return { join: path.join };
    };
    // @ts-ignore
    dom.window.Buffer = Buffer;
    // @ts-ignore
    dom.window.eval(rendererCode);
    // Wait for React to render
    // @ts-ignore
    return new Promise((resolve) => {
      setTimeout(() => {
        const h1 = dom.window.document.querySelector('h1');
        expect(h1?.textContent).toMatch(/Task Manager/);
        resolve(undefined);
      }, 100);
    });
  });
}); 