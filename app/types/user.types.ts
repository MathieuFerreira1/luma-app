export interface UserProfile {
  id: string;
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  xp: number;
  level: number;
  streak: number;
  created_at: string;
  updated_at: string;
}

export interface CreateProfileInput {
  user_id: string;
  first_name: string;
  last_name: string;
}

export interface UpdateProfileInput {
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  xp?: number;
  level?: number;
  streak?: number;
}
