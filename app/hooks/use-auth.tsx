import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from 'react';
import { Session, User } from '@supabase/supabase-js';
import { AuthService } from '@/app/services';
import {
  SignInCredentials,
  SignUpCredentials,
} from '@/app/types';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  initialized: boolean;
  isAuthenticated: boolean;
  signIn: (credentials: SignInCredentials) => Promise<{ success: boolean; error?: string }>;
  signUp: (credentials: SignUpCredentials) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    async function initializeAuth() {
      const result = await AuthService.getSession();

      if (result.success) {
        setSession(result.session ?? null);
        setUser(result.user ?? null);
      }

      setInitialized(true);
    }

    initializeAuth();
  }, []);

  useEffect(() => {
    const { data: authListener } = AuthService.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const signIn = useCallback(
    async (credentials: SignInCredentials): Promise<{ success: boolean; error?: string }> => {
      setLoading(true);

      try {
        const result = await AuthService.signIn(credentials);

        if (result.success) {
          setUser(result.user ?? null);
          setSession(result.session ?? null);
          return { success: true };
        } else {
          return {
            success: false,
            error: result.error?.message ?? 'Sign in failed',
          };
        }
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const signUp = useCallback(
    async (credentials: SignUpCredentials): Promise<{ success: boolean; error?: string }> => {
      setLoading(true);

      try {
        const result = await AuthService.signUp(credentials);

        if (result.success) {
          setUser(result.user ?? null);
          setSession(result.session ?? null);
          return { success: true };
        } else {
          return {
            success: false,
            error: result.error?.message ?? 'Sign up failed',
          };
        }
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const signOut = useCallback(async (): Promise<{ success: boolean; error?: string }> => {
    setLoading(true);

    try {
      const result = await AuthService.signOut();

      if (result.success) {
        setUser(null);
        setSession(null);
        return { success: true };
      } else {
        return {
          success: false,
          error: result.error?.message ?? 'Sign out failed',
        };
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const value: AuthContextType = {
    user,
    session,
    loading,
    initialized,
    isAuthenticated: Boolean(user),
    signIn,
    signUp,
    signOut,
  };

  return React.createElement(
    AuthContext.Provider,
    { value },
    children
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
