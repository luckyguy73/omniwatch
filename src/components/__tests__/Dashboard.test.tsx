import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Dashboard from '../../app/dashboard/page';

describe('Dashboard', () => {
  it('renders dashboard heading', () => {
    render(<Dashboard />);
    expect(screen.getByText(/Omni Dashboard/i)).toBeInTheDocument();
  });

  it('toggles theme between light and dark', () => {
    render(<Dashboard />);
    const toggleButton = screen.getByLabelText('Toggle light/dark mode');
    expect(screen.getByText('☀️')).toBeInTheDocument();
    fireEvent.click(toggleButton);
    expect(screen.getByText('🌙')).toBeInTheDocument();
  });

  it('switches between TV Shows and Movies tabs', () => {
    render(<Dashboard />);
    expect(screen.getByText(/Your TV Shows/i)).toBeInTheDocument();
    fireEvent.click(screen.getByText(/Movies/i));
    expect(screen.getByText(/Your Movies/i)).toBeInTheDocument();
    fireEvent.click(screen.getByText(/TV Shows/i));
    expect(screen.getByText(/Your TV Shows/i)).toBeInTheDocument();
  });
});
