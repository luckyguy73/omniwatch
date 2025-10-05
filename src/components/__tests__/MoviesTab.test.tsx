import React from 'react';
import { render, screen } from '@testing-library/react';
import MoviesTab from '../MoviesTab';

describe('MoviesTab', () => {
  it('renders Movies heading', () => {
    render(<MoviesTab theme="light" />);
    expect(screen.getByText(/Your Movies/i)).toBeInTheDocument();
  });

  it('renders correct text color for light mode', () => {
    render(<MoviesTab theme="light" />);
    const heading = screen.getByText(/Your Movies/i);
    expect(heading).toHaveClass('text-gray-800');
  });

  it('renders correct text color for dark mode', () => {
    render(<MoviesTab theme="dark" />);
    const heading = screen.getByText(/Your Movies/i);
    expect(heading).toHaveClass('text-blue-200');
  });
});
