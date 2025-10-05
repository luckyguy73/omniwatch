import React from 'react';
import { render, screen } from '@testing-library/react';
import TvShowsTab from '../TvShowsTab';

describe('TvShowsTab', () => {
  it('renders TV Shows heading', () => {
    render(<TvShowsTab theme="light" />);
    expect(screen.getByText(/Your TV Shows/i)).toBeInTheDocument();
  });

  it('renders correct text color for light mode', () => {
    render(<TvShowsTab theme="light" />);
    const heading = screen.getByText(/Your TV Shows/i);
    expect(heading).toHaveClass('text-gray-800');
  });

  it('renders correct text color for dark mode', () => {
    render(<TvShowsTab theme="dark" />);
    const heading = screen.getByText(/Your TV Shows/i);
    expect(heading).toHaveClass('text-blue-200');
  });
});
