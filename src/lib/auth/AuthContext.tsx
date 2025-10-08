"use client";

import { auth, googleProvider } from '@/lib/firestore/firebase';
import {
    User,
    signOut as firebaseSignOut,
    getRedirectResult,
    onAuthStateChanged,
    signInWithPopup,
    signInWithRedirect
} from 'firebase/auth';
import React, { ReactNode, createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  error: string | null;
  clearError: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    // Check for redirect result on component mount
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          setUser(result.user);
        }
      })
      .catch((error) => {
        console.error('Error getting redirect result:', error);
      })
      .finally(() => {
        setLoading(false);
      });

    return () => unsubscribe();
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const signInWithGoogle = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try popup first, fallback to redirect on mobile or if popup is blocked
      try {
        await signInWithPopup(auth, googleProvider);
      } catch (popupError: any) {
        console.log('Popup error:', popupError.code);
        // If popup is blocked or domain not authorized, use redirect
        if (
          popupError.code === 'auth/popup-blocked' || 
          popupError.code === 'auth/unauthorized-domain' ||
          popupError.code === 'auth/configuration-not-found'
        ) {
          console.log('Falling back to redirect signin');
          await signInWithRedirect(auth, googleProvider);
        } else {
          throw popupError;
        }
      }
    } catch (error: any) {
      console.error('Error signing in with Google:', error);
      
      // Set user-friendly error messages
      let errorMessage = 'Sign in failed. Please try again.';
      
      if (error.code === 'auth/configuration-not-found') {
        errorMessage = 'Authentication service is not properly configured.';
      } else if (error.code === 'auth/unauthorized-domain') {
        errorMessage = 'This domain is not authorized for sign-in.';
      } else if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = 'Sign-in was cancelled.';
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Network error. Please check your connection.';
      }
      
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      await firebaseSignOut(auth);
    } catch (error: any) {
      console.error('Error signing out:', error);
      const errorMessage = 'Failed to sign out. Please try again.';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Memoize computed values to prevent unnecessary re-renders
  const isAuthenticated = useMemo(() => !!user, [user]);

  const value = useMemo(() => ({
    user,
    loading,
    signInWithGoogle,
    signOut,
    error,
    clearError,
    isAuthenticated,
  }), [user, loading, signInWithGoogle, signOut, error, clearError, isAuthenticated]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};