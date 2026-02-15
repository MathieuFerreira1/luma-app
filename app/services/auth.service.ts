import { supabase } from '@/lib/supabase';
import {
  SignInCredentials,
  SignUpCredentials,
} from '@/app/types';
import { Session, User, AuthChangeEvent } from '@supabase/supabase-js';

interface AuthResponse {
  success: boolean;
  user?: User | null;
  session?: Session | null;
  error?: {
    message: string;
    code?: string;
  };
}

export class AuthService {
  static async signUp(credentials: SignUpCredentials): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          data: {
            first_name: credentials.firstName,
            last_name: credentials.lastName,
          },
          emailRedirectTo: undefined,
        },
      });

      if (error) {
        return {
          success: false,
          error: {
            message: error.message,
            code: error.code,
          },
        };
      }

      return {
        success: true,
        user: data.user,
        session: data.session,
      };
    } catch (err) {
      return {
        success: false,
        error: {
          message: err instanceof Error ? err.message : 'An unexpected error occurred',
        },
      };
    }
  }

  static async signIn(credentials: SignInCredentials): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        return {
          success: false,
          error: {
            message: error.message,
            code: error.code,
          },
        };
      }

      return {
        success: true,
        user: data.user,
        session: data.session,
      };
    } catch (err) {
      return {
        success: false,
        error: {
          message: err instanceof Error ? err.message : 'An unexpected error occurred',
        },
      };
    }
  }

  static async signOut(): Promise<{ success: boolean; error?: { message: string } }> {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        return {
          success: false,
          error: {
            message: error.message,
          },
        };
      }

      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: {
          message: err instanceof Error ? err.message : 'An unexpected error occurred',
        },
      };
    }
  }

  static async getSession(): Promise<{
    success: boolean;
    session?: Session | null;
    user?: User | null;
    error?: { message: string };
  }> {
    try {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        return {
          success: false,
          error: {
            message: error.message,
          },
        };
      }

      return {
        success: true,
        session: data.session,
        user: data.session?.user ?? null,
      };
    } catch (err) {
      return {
        success: false,
        error: {
          message: err instanceof Error ? err.message : 'An unexpected error occurred',
        },
      };
    }
  }

  static onAuthStateChange(callback: (event: AuthChangeEvent, session: Session | null) => void) {
    return supabase.auth.onAuthStateChange(callback);
  }
}
