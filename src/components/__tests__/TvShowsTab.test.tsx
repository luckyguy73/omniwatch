import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TvShowsTab from '../TvShowsTab';
import { vi } from 'vitest';

vi.mock('../../lib/models', () => ({
  upsertTvShow: vi.fn(() => Promise.resolve()),
}));

vi.mock('../../lib/tmdbClient', () => ({
  searchTvShows: vi.fn(async () => ({
    results: [
      { tmdbId: 100, title: 'Severance', overview: 'Work-life balance to the extreme', imageUrl: '' },
    ],
  })),
  fetchTvShowFromTMDB: vi.fn(async () => ({ tmdbId: 100, title: 'Severance' })),
}));

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

  it('searches and adds a TV show, showing a toast', async () => {
    render(<TvShowsTab theme="light" />);

    const input = screen.getByPlaceholderText(/Search TV shows to add/i);
    fireEvent.change(input, { target: { value: 'sev' } });

    const submit = screen.getByRole('button', { name: /search/i });
    fireEvent.click(submit);

    await screen.findByText('Severance');

    fireEvent.click(screen.getByRole('button', { name: 'Add' }));

    await waitFor(() => {
      expect(screen.getByRole('status')).toHaveTextContent('Added: Severance');
    });
  });
});
