import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../src/App';

describe('Web App Fixed', () => {
  it('renders without crashing', () => {
    const { getByText } = render(<App />);
    expect(getByText(/Welcome to the Web App/i)).toBeInTheDocument();
  });
});