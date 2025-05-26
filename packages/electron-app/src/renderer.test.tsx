import * as React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect, jest } from '@jest/globals';

declare const window: any;
window.require = () => ({
  ipcRenderer: {
    // @ts-ignore
    invoke: jest.fn().mockResolvedValue([] as any),
  } as any,
});
import { App } from './renderer';

describe('App', () => {
  it('renders sidebar title and main pane header', () => {
    const { getByText } = render(<App />);
    expect(getByText('TODO')).toBeInTheDocument(); // Sidebar title
    // Check for 'Today' specifically in an h1 element
    expect(
      getByText((content, element) =>
        element?.tagName.toLowerCase() === 'h1' && content === 'Today'
      )
    ).toBeInTheDocument();
  });
});
