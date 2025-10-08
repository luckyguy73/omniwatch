"use client";

import { useAuth } from '@/lib/auth/AuthContext';
import React, { useCallback, useEffect, useRef, useState } from 'react';

interface UserProfileProps {
  theme?: 'light' | 'dark';
  onSignOut?: () => void;
  onThemeToggle?: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ theme = 'dark', onSignOut, onThemeToggle }) => {
  const { user, signOut, loading, error } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSignOut = useCallback(async () => {
    try {
      await signOut();
      setIsDropdownOpen(false);
      onSignOut?.();
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  }, [signOut, onSignOut]);

  const handleThemeToggle = useCallback(() => {
    onThemeToggle?.();
    // Keep dropdown open after theme change
  }, [onThemeToggle]);

  const toggleDropdown = useCallback(() => {
    setIsDropdownOpen(prev => !prev);
  }, []);

  const closeDropdown = useCallback(() => {
    setIsDropdownOpen(false);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        closeDropdown();
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isDropdownOpen, closeDropdown]);

  // Close dropdown on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeDropdown();
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isDropdownOpen, closeDropdown]);

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className={`
          flex items-center gap-2 p-2 rounded-lg transition-colors duration-200 
          focus:outline-none focus:ring-2 focus:ring-offset-2
          ${theme === 'dark' 
            ? 'hover:bg-gray-700 focus:ring-gray-500' 
            : 'hover:bg-gray-100 focus:ring-blue-500'
          }
        `}
        aria-label="User menu"
        aria-expanded={isDropdownOpen}
        aria-haspopup="true"
      >
        <img
          src={user.photoURL || '/default-avatar.png'}
          alt={user.displayName || 'User'}
          className="w-8 h-8 rounded-full object-cover border-2 border-gray-300"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = `data:image/svg+xml;base64,${btoa(`
              <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                <circle cx="16" cy="16" r="16" fill="#e5e7eb"/>
                <circle cx="16" cy="12" r="5" fill="#9ca3af"/>
                <path d="M16 18c-5 0-9 3-9 6v2h18v-2c0-3-4-6-9-6z" fill="#9ca3af"/>
              </svg>
            `)}`;
          }}
        />
        <div className={`text-left hidden sm:block ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
          <p className="text-sm font-medium truncate max-w-[120px]">
            {user.displayName || 'User'}
          </p>
        </div>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${
            isDropdownOpen ? 'rotate-180' : ''
          } ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isDropdownOpen && (
        <div 
          className={`
            absolute right-0 mt-2 w-48 rounded-lg shadow-lg z-50 border
            ${theme === 'dark' 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-gray-200'
            }
          `}
        >
          <div className="p-3 border-b border-gray-200 dark:border-gray-700">
            <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
              {user.displayName}
            </p>
            <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              {user.email}
            </p>
          </div>
          <div className="p-1">
            {onThemeToggle && (
              <button
                onClick={handleThemeToggle}
                className={`
                  w-full text-left px-3 py-2 text-sm rounded transition-colors duration-200 flex items-center gap-2
                  ${theme === 'dark' 
                    ? 'text-gray-200 hover:bg-gray-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                  }
                `}
              >
                <span className="text-lg">
                  {theme === 'dark' ? '🌙' : '☀️'}
                </span>
                <span>Theme</span>
              </button>
            )}
            <button
              onClick={handleSignOut}
              disabled={loading}
              className={`
                w-full text-left px-3 py-2 text-sm rounded transition-colors duration-200
                ${loading ? 'opacity-50 cursor-not-allowed' : ''}
                ${theme === 'dark' 
                  ? 'text-gray-200 hover:bg-gray-700' 
                  : 'text-gray-700 hover:bg-gray-100'
                }
              `}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                  Signing out...
                </span>
              ) : (
                'Sign out'
              )}
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className={`absolute top-full left-0 mt-2 p-2 rounded text-sm ${
          theme === 'dark' ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-700'
        }`}>
          {error}
        </div>
      )}
    </div>
  );
};

export default UserProfile;