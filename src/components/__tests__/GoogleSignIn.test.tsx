import GoogleSignIn from '@/components/GoogleSignIn';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

// Mock the useAuth hook
vi.mock('@/lib/auth/AuthContext', () => ({
  useAuth: vi.fn(() => ({
    user: null,
    loading: false,
    signInWithGoogle: vi.fn(),
    signOut: vi.fn(),
  })),
}));

describe('Authentication Components', () => {
  it('renders GoogleSignIn component', () => {
    render(<GoogleSignIn />);
    expect(screen.getByText('Sign in with Google')).toBeInTheDocument();
  });

  it('renders GoogleSignIn with light theme', () => {
    render(<GoogleSignIn theme="light" />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-gray-900');
  });

  it('renders GoogleSignIn with dark theme', () => {
    render(<GoogleSignIn theme="dark" />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-white');
  });
});