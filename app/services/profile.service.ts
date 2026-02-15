import { supabase } from '@/lib/supabase';
import { CreateProfileInput, UpdateProfileInput, UserProfile } from '@/app/types';

export class ProfileService {
  static async createProfile(input: CreateProfileInput): Promise<{ success: boolean; error?: { message: string } }> {
    try {
      const { error } = await supabase.from('users_profile').insert({
        user_id: input.user_id,
        first_name: input.first_name,
        last_name: input.last_name,
      });

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

  static async getProfile(userId: string): Promise<{ success: boolean; profile?: UserProfile; error?: { message: string } }> {
    try {
      const { data, error } = await supabase
        .from('users_profile')
        .select('*')
        .eq('user_id', userId)
        .single();

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
        profile: data as UserProfile,
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

  static async updateProfile(userId: string, input: UpdateProfileInput): Promise<{ success: boolean; error?: { message: string } }> {
    try {
      const { error } = await supabase
        .from('users_profile')
        .update({
          ...input,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId);

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
}
