import React, {
  createContext,
  useContext,
  ReactNode,
  useCallback,
  useMemo,
} from 'react';
import useSWR, { useSWRConfig } from 'swr';
import { ProfileService } from '@/app/services';
import { UserProfile, UpdateProfileInput } from '@/app/types';
import { useAuth } from './use-auth';

interface ProfileContextType {
  profile: UserProfile | null;
  loading: boolean;
  isValidating: boolean;
  error: Error | null;
  refreshProfile: () => Promise<void>;
  updateProfile: (data: UpdateProfileInput) => Promise<boolean>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

// SWR fetcher function
const profileFetcher = async (userId: string): Promise<UserProfile | null> => {
  if (!userId) return null;
  
  const result = await ProfileService.getProfile(userId);
  
  if (!result.success) {
    throw new Error(result.error?.message ?? 'Failed to fetch profile');
  }
  
  return result.profile ?? null;
};

export function ProfileProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated, initialized } = useAuth();
  const userId = user?.id;
  
  // SWR cache key - changes when userId changes
  const cacheKey = userId ? `profile-${userId}` : null;
  
  // useSWR handles caching, deduping, and background revalidation
  const { data, error, isLoading, isValidating, mutate } = useSWR(
    cacheKey,
    () => profileFetcher(userId!),
    {
      // Only fetch if user is authenticated and initialized
      shouldRetryOnError: false,
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      dedupingInterval: 5000, // 5 seconds
    }
  );

  const refreshProfile = useCallback(async () => {
    if (!cacheKey) return;
    await mutate();
  }, [cacheKey, mutate]);

  const updateProfile = useCallback(async (updates: UpdateProfileInput): Promise<boolean> => {
    if (!userId) return false;
    
    const result = await ProfileService.updateProfile(userId, updates);
    
    if (result.success) {
      // Optimistically update the cache
      await mutate(
        (current) => {
          if (!current) return current;
          return { ...current, ...updates };
        },
        { revalidate: false }
      );
      return true;
    }
    
    return false;
  }, [userId, mutate]);

  const value = useMemo(() => ({
    profile: data ?? null,
    loading: isLoading && initialized && isAuthenticated,
    isValidating,
    error: error ?? null,
    refreshProfile,
    updateProfile,
  }), [data, isLoading, isValidating, error, refreshProfile, updateProfile, initialized, isAuthenticated]);

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useUserProfile(): ProfileContextType {
  const context = useContext(ProfileContext);
  
  if (context === undefined) {
    throw new Error('useUserProfile must be used within a ProfileProvider');
  }
  
  return context;
}

// Hook to manually mutate profile data from anywhere
export function useProfileMutation() {
  const { mutate } = useSWRConfig();
  const { user } = useAuth();
  const userId = user?.id;
  const cacheKey = userId ? `profile-${userId}` : null;
  
  const refresh = useCallback(async () => {
    if (cacheKey) {
      await mutate(cacheKey);
    }
  }, [cacheKey, mutate]);
  
  return { refresh };
}
