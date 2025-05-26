import React from 'react';
jest.mock('electron');
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { App } from './renderer';

describe('App', () => {
  it('renders without crashing', () => {
    const { getByText } = render(<App />);
    expect(getByText('Task Manager')).toBeInTheDocument();
  });
}); 