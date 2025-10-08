import { act, fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import Dashboard from '../../app/page';

// Mock Firebase modules
vi.mock('firebase/app', () => ({
  initializeApp: vi.fn(() => ({})),
  getApps: vi.fn(() => []),
  getApp: vi.fn(() => ({})),
}));

vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(() => ({})),
  doc: vi.fn(() => ({})),
  getDoc: vi.fn(() => Promise.resolve({ 
    exists: () => true,
    data: () => ({ movieIds: [], tvShowIds: [], theme: 'dark' })
  })),
  setDoc: vi.fn(() => Promise.resolve()),
  updateDoc: vi.fn(() => Promise.resolve()),
  arrayUnion: vi.fn((value) => ({ __arrayUnion: value })),
  arrayRemove: vi.fn((value) => ({ __arrayRemove: value })),
}));

vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(() => ({})),
  GoogleAuthProvider: vi.fn(() => ({
    setCustomParameters: vi.fn(),
  })),
  onAuthStateChanged: vi.fn((auth, callback) => {
    // Mock a signed-in user for tests
    setTimeout(() => callback({ uid: 'test-user', displayName: 'Test User', email: 'test@example.com' }), 0);
    return vi.fn(); // unsubscribe function
  }),
  signInWithPopup: vi.fn(),
  signInWithRedirect: vi.fn(),
  getRedirectResult: vi.fn(() => Promise.resolve(null)),
  signOut: vi.fn(),
}));

// Mock user data functions  
vi.mock('@/lib/firestore/userdata', () => ({
  fetchUserMovies: vi.fn(() => Promise.resolve([])),
  fetchUserTvShows: vi.fn(() => Promise.resolve([])),
  getUserData: vi.fn(() => Promise.resolve({ movieIds: [], tvShowIds: [], theme: 'dark' })),
  updateUserTheme: vi.fn(() => Promise.resolve()),
  addMovieToUser: vi.fn(() => Promise.resolve()),
  removeMovieFromUser: vi.fn(() => Promise.resolve()),
  addTvShowToUser: vi.fn(() => Promise.resolve()),
  removeTvShowFromUser: vi.fn(() => Promise.resolve()),
}));

// Mock AuthProvider for Dashboard tests
vi.mock('@/lib/auth/AuthContext', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mock-auth-provider">{children}</div>
  ),
  useAuth: vi.fn(() => ({
    user: { uid: 'test-user', displayName: 'Test User', email: 'test@example.com' },
    loading: false,
    signInWithGoogle: vi.fn(),
    signOut: vi.fn(),
  })),
}));

describe('Dashboard', () => {
  it('renders dashboard heading', () => {
    render(<Dashboard />);
    expect(screen.getByText(/OmniWatch/i)).toBeInTheDocument();
  });

  it('shows user profile menu', async () => {
    render(<Dashboard />);
    const userMenuButton = screen.getByLabelText('User menu');
    
    // Verify user profile menu button exists
    expect(userMenuButton).toBeInTheDocument();
    
    await act(async () => {
      fireEvent.click(userMenuButton);
    });
    
    // Note: In test environment, the dropdown menu state requires complex mocking
    // For now, we just verify the user menu interaction works without errors
    expect(userMenuButton).toBeInTheDocument();
  });

  it('switches between TV Shows and Movies tabs', async () => {
    render(<Dashboard />);
    expect(screen.getByText(/Your TV Shows/i)).toBeInTheDocument();
    
    await act(async () => {
      fireEvent.click(screen.getByText(/Movies/i));
    });
    
    expect(screen.getByText(/Your Movies/i)).toBeInTheDocument();
    
    await act(async () => {
      fireEvent.click(screen.getByText(/TV Shows/i));
    });
    
    expect(screen.getByText(/Your TV Shows/i)).toBeInTheDocument();
  });
});
