"use client";

import GoogleSignIn from '@/components/GoogleSignIn';
import { useAuth } from '@/lib/auth/AuthContext';
import React from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  theme?: 'light' | 'dark';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, theme = 'dark' }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          theme === 'dark'
            ? 'bg-gradient-to-br from-gray-900 to-gray-800'
            : 'bg-gradient-to-br from-blue-50 to-gray-100'
        }`}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            Loading...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center p-4 ${
          theme === 'dark'
            ? 'bg-gradient-to-br from-gray-900 to-gray-800'
            : 'bg-gradient-to-br from-blue-50 to-gray-100'
        }`}
      >
        <div
          className={`
            max-w-md w-full p-8 rounded-xl shadow-2xl text-center border
            ${theme === 'dark' 
              ? 'bg-gray-900 border-gray-700' 
              : 'bg-white border-gray-200'
            }
          `}
        >
          <div className="mb-6">
            <h1
              className={`text-3xl font-bold mb-2 ${
                theme === 'dark' ? 'text-blue-200' : 'text-blue-700'
              }`}
            >
              Welcome to OmniWatch
            </h1>
            <p
              className={`text-lg ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}
            >
              Your personal movies and TV shows tracker
            </p>
          </div>

          <div className="mb-6">
            <p
              className={`text-sm mb-4 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}
            >
              Sign in to start tracking your favorite content
            </p>
          </div>

          <div className="flex justify-center">
            <GoogleSignIn theme={theme} />
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p
              className={`text-xs ${
                theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
              }`}
            >
              We use Google authentication to keep your data secure and personalized
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
