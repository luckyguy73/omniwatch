import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import TvShowsTab from '../TvShowsTab';
import { vi } from 'vitest';
import { searchTvShows } from '../../lib/tmdb/tmdbClient';

vi.mock('../../lib/firestore/models', () => ({
  upsertTvShow: vi.fn(() => Promise.resolve()),
  deleteTvShow: vi.fn(() => Promise.resolve()),
}));

vi.mock('../../lib/tmdb/tmdbClient', () => ({
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
    vi.useFakeTimers();
    render(<TvShowsTab theme="light" />);

    const input = screen.getByPlaceholderText(/Search TV shows to add/i);
    fireEvent.change(input, { target: { value: 'sev' } });

    await act(async () => {
      vi.advanceTimersByTime(300);
    });

    vi.useRealTimers();
    await screen.findByText('Severance');

    fireEvent.click(screen.getByRole('button', { name: 'Add' }));

    await waitFor(() => {
      expect(screen.getByRole('status')).toHaveTextContent('Added: Severance');
    });
  });

  it('renders empty state when no items', () => {
    render(<TvShowsTab theme="dark" items={[]} />);
    expect(screen.getByText('No TV shows found.')).toBeInTheDocument();
  });

  it('clears search when clicking the X button', () => {
    render(<TvShowsTab theme="light" />);
    const input = screen.getByPlaceholderText(/Search TV shows to add/i) as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'sev' } });
    expect(input.value).toBe('sev');
    const clearBtn = screen.getByRole('button', { name: /clear search/i });
    fireEvent.click(clearBtn);
    expect(input.value).toBe('');
  });

  it('removes a TV show and shows a toast', async () => {
    render(<TvShowsTab theme="light" items={[{ id: 't1', tmdbId: 100, title: 'Severance' }] as any} />);
    const removeBtn = screen.getByRole('button', { name: /remove/i });
    fireEvent.click(removeBtn);
    await screen.findByRole('status');
    expect(screen.getByText(/Removed: Severance/)).toBeInTheDocument();
  });

  it('sorts items alphabetically by title (case-insensitive)', () => {
    const items = [
      { id: '1', title: 'zeta' },
      { id: '2', title: 'Bravo' },
      { id: '3', title: 'alpha' },
    ];
    render(<TvShowsTab theme="light" items={items as any} />);

    const headings = screen.getAllByRole('heading', { level: 3 });
    const texts = headings.map(h => h.textContent?.toLowerCase());
    expect(texts?.[0]).toContain('alpha');
    expect(texts?.[1]).toContain('bravo');
    expect(texts?.[2]).toContain('zeta');
  });

  it('renders episode info line when provided', () => {
    const items = [
      { id: '1', title: 'Show', seasonNumber: 1, episodeNumber: 2, episodeTitle: 'Pilot' },
    ];
    render(<TvShowsTab theme="light" items={items as any} />);

    expect(screen.getByText(/S1 • E2 – Pilot/)).toBeInTheDocument();
  });

  it('shows error message on failed search', async () => {
    // Arrange next call to reject
    (searchTvShows as unknown as { mockRejectedValueOnce: (e: any) => void }).mockRejectedValueOnce(new Error('search failed'));

    vi.useFakeTimers();
    render(<TvShowsTab theme="light" />);
    fireEvent.change(screen.getByPlaceholderText(/Search TV shows to add/i), { target: { value: 'x' } });

    await act(async () => {
      vi.advanceTimersByTime(300);
    });

    vi.useRealTimers();
    await screen.findByText('search failed');
  });

  it('schedules auto-dismiss toast after 5 seconds', async () => {
    const spy = vi.spyOn(global, 'setTimeout' as any);
    render(<TvShowsTab theme="light" />);

    // Use real timers to keep Testing Library async utilities working
    fireEvent.change(screen.getByPlaceholderText(/Search TV shows to add/i), { target: { value: 'sev' } });
    await screen.findByText('Severance');
    fireEvent.click(screen.getByRole('button', { name: 'Add' }));

    await screen.findByRole('status');

    expect(spy).toHaveBeenCalled();
    const any5000 = spy.mock.calls.some((c) => typeof c[1] === 'number' && c[1] === 5000);
    expect(any5000).toBe(true);

    spy.mockRestore();
  });
});