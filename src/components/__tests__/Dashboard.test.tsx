import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Dashboard from '../../app/page';

describe('Dashboard', () => {
  it('renders dashboard heading', () => {
    render(<Dashboard />);
    expect(screen.getByText(/OmniWatch/i)).toBeInTheDocument();
  });

  it('toggles theme between dark and light', () => {
    render(<Dashboard />);
    const toggleButton = screen.getByLabelText('Toggle light/dark mode');
    // default is dark
    expect(screen.getByText('🌙')).toBeInTheDocument();
    fireEvent.click(toggleButton);
    expect(screen.getByText('☀️')).toBeInTheDocument();
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
