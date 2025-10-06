import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import MoviesTab from '../MoviesTab';
import { vi } from 'vitest';
import { searchMovies } from '../../lib/tmdb/tmdbClient';

vi.mock('../../lib/firestore/models', () => ({
  deleteMovie: vi.fn(() => Promise.resolve()),
  upsertMovie: vi.fn(() => Promise.resolve()),
}));

vi.mock('../../lib/tmdb/tmdbClient', () => ({
  searchMovies: vi.fn(async () => ({
    results: [
      { tmdbId: 1, title: 'Inception', overview: 'A mind-bending heist', imageUrl: '' },
    ],
  })),
  fetchMovieFromTMDB: vi.fn(async () => ({ tmdbId: 1, title: 'Inception' })),
}));

describe('MoviesTab', () => {
  it('renders heading', () => {
    render(<MoviesTab theme="light" />);
    expect(screen.getByText(/Your Movies/i)).toBeInTheDocument();
  });

  it('clears search when clicking the X button', () => {
    render(<MoviesTab theme="light" />);
    const input = screen.getByPlaceholderText(/Search movies to add/i) as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'abc' } });
    expect(input.value).toBe('abc');
    const clearBtn = screen.getByRole('button', { name: /clear search/i });
    fireEvent.click(clearBtn);
    expect(input.value).toBe('');
  });


  it('removes a movie and shows a toast', async () => {
    render(
      <MoviesTab
        theme="light"
        items={[{ id: 'm1', title: 'Inception', tmdbId: 1 }]}
      />
    );

    const removeBtn = screen.getByRole('button', { name: /remove/i });
    fireEvent.click(removeBtn);

    await screen.findByRole('status');
    expect(screen.getByText(/Removed: Inception/i)).toBeInTheDocument();
  });

  it('searches and adds a movie, showing a toast', async () => {
    vi.useFakeTimers();
    render(<MoviesTab theme="light" />);

    const input = screen.getByPlaceholderText(/Search movies to add/i);
    fireEvent.change(input, { target: { value: 'incep' } });

    await act(async () => {
      vi.advanceTimersByTime(300);
    });

    // Return to real timers so Testing Library's async utilities work
    vi.useRealTimers();

    await screen.findByText('Inception');

    fireEvent.click(screen.getByRole('button', { name: 'Add' }));

    await waitFor(() => {
      expect(screen.getByRole('status')).toHaveTextContent('Added: Inception');
    });
  });

  it('renders empty state when no items', () => {
    render(<MoviesTab theme="dark" items={[]} />);
    expect(screen.getByText('No movies found.')).toBeInTheDocument();
  });

  it('sorts items alphabetically by title (case-insensitive)', () => {
    const items = [
      { id: '1', title: 'zulu' },
      { id: '2', title: 'Alpha' },
      { id: '3', title: 'mId' },
    ];
    render(<MoviesTab theme="light" items={items as any} />);

    const headings = screen.getAllByRole('heading', { level: 3 });
    const texts = headings.map(h => h.textContent);
    // Should be Alpha, mId, zulu (year portion may be absent)
    expect(texts?.[0]?.toLowerCase().startsWith('alpha')).toBe(true);
    expect(texts?.[1]?.toLowerCase().startsWith('mid')).toBe(true);
    expect(texts?.[2]?.toLowerCase().startsWith('zulu')).toBe(true);
  });

  it('renders year and top cast when provided', () => {
    const items = [
      { id: '1', title: 'Inception', year: 2010, topCast: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt'] },
    ];
    render(<MoviesTab theme="light" items={items as any} />);

    expect(screen.getByRole('heading', { name: /Inception \(2010\)/ })).toBeInTheDocument();
    const nodes = screen.getAllByText((content, element) =>
          (element?.textContent || '').includes('Top cast: Leonardo DiCaprio, Joseph Gordon-Levitt')
        );
        expect(nodes.length).toBeGreaterThan(0);
  });

  it('shows error message on failed search', async () => {
    // Arrange next call to reject
    (searchMovies as unknown as { mockRejectedValueOnce: (e: any) => void }).mockRejectedValueOnce(new Error('boom'));

    vi.useFakeTimers();
    render(<MoviesTab theme="light" />);
    fireEvent.change(screen.getByPlaceholderText(/Search movies to add/i), { target: { value: 'x' } });

    await act(async () => {
      vi.advanceTimersByTime(300);
    });

    vi.useRealTimers();
    await screen.findByText('boom');
  });

  it('schedules auto-dismiss toast after 5 seconds', async () => {
    const spy = vi.spyOn(global, 'setTimeout' as any);
    render(
      <MoviesTab
        theme="light"
        items={[{ id: 'm1', title: 'Inception', tmdbId: 1 }]}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /remove/i }));

    // Toast appears immediately
    await screen.findByRole('status');

    // Ensure auto-dismiss is scheduled for 5000ms
    expect(spy).toHaveBeenCalled();
    const any5000 = spy.mock.calls.some((c) => typeof c[1] === 'number' && c[1] === 5000);
    expect(any5000).toBe(true);

    spy.mockRestore();
  });
});


// Additional coverage tests for live search behavior
// Note: we rely on the existing vi.mock at top of file, and override per-test with mockResolvedValueOnce

describe('MoviesTab - live search limits and UX', () => {
  it('limits search suggestions to 10 results', async () => {
    const { searchMovies } = await import('../../lib/tmdb/tmdbClient');
    (searchMovies as unknown as { mockResolvedValueOnce: (v: any) => void }).mockResolvedValueOnce({
      results: Array.from({ length: 15 }, (_, i) => ({ tmdbId: i + 1, title: `Title ${i + 1}` }))
    });

    vi.useFakeTimers();
    render(<MoviesTab theme="light" />);
    fireEvent.change(screen.getByPlaceholderText(/Search movies to add/i), { target: { value: 't' } });

    await act(async () => {
      vi.advanceTimersByTime(300);
    });

    vi.useRealTimers();

    // There should be only 10 Add buttons for suggestions
    const addButtons = await screen.findAllByRole('button', { name: 'Add' });
    expect(addButtons.length).toBe(10);
  });
});
