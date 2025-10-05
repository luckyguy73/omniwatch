import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import MoviesTab from '../MoviesTab';
import { vi } from 'vitest';

vi.mock('../../lib/models', () => ({
  setMovieFavorite: vi.fn(() => Promise.resolve()),
  upsertMovie: vi.fn(() => Promise.resolve()),
}));

vi.mock('../../lib/tmdbClient', () => ({
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

  it('shows Favorite button for items and toggles toast on click', async () => {
    render(
      <MoviesTab
        theme="light"
        items={[{ id: 'm1', title: 'Inception', tmdbId: 1, isFavorite: false }]}
      />
    );

    const favBtn = screen.getByRole('button', { name: /favorite/i });
    fireEvent.click(favBtn);

    await screen.findByRole('status');
    expect(screen.getByText(/Favorited: Inception/i)).toBeInTheDocument();
  });

  it('searches and adds a movie, showing a toast', async () => {
    render(<MoviesTab theme="light" />);

    const input = screen.getByPlaceholderText(/Search movies to add/i);
    fireEvent.change(input, { target: { value: 'incep' } });

    const submit = screen.getByRole('button', { name: /search/i });
    fireEvent.click(submit);

    await screen.findByText('Inception');

    fireEvent.click(screen.getByRole('button', { name: 'Add' }));

    await waitFor(() => {
      expect(screen.getByRole('status')).toHaveTextContent('Added: Inception');
    });
  });
});
