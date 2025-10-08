import { useAuth } from '@/lib/auth/AuthContext';
import { useEffect, useState } from 'react';

/**
 * Hook to get user-specific data path for Firestore collections
 * This ensures each user has their own isolated data
 */
export const useUserData = () => {
  const { user } = useAuth();
  const [userPath, setUserPath] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      // Create a user-specific path for collections
      setUserPath(`users/${user.uid}`);
    } else {
      setUserPath(null);
    }
  }, [user]);

  return {
    user,
    userPath,
    userId: user?.uid || null,
    isAuthenticated: !!user,
  };
};

/**
 * Hook to check if user is premium/has special features
 * This can be extended later for subscription features
 */
export const useUserRole = () => {
  const { user } = useAuth();
  const [isPremium, setIsPremium] = useState(false);
  const [role, setRole] = useState<'free' | 'premium' | 'admin'>('free');

  useEffect(() => {
    if (user) {
      // In the future, you could check custom claims or Firestore user doc
      // For now, all users are free tier
      setRole('free');
      setIsPremium(false);
    } else {
      setRole('free');
      setIsPremium(false);
    }
  }, [user]);

  return {
    isPremium,
    role,
    isAdmin: role === 'admin',
  };
};