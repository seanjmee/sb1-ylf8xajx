import { create } from 'zustand';
import { supabase } from './supabase';

interface UserState {
  user: any;
  profile: any;
  workouts: any[];
  activities: any[];
  stravaConnected: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, username: string) => Promise<boolean>;
  logout: () => Promise<void>;
  fetchWorkouts: () => Promise<void>;
  fetchStravaActivities: () => Promise<void>;
}

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  profile: null,
  workouts: [],
  activities: [],
  stravaConnected: false,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
    set({ user: data.user, isLoading: false });
  },

  signup: async (email, password, username) => {
    set({ isLoading: true, error: null });
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { username } },
    });
    if (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
    set({ isLoading: false });
    return true;
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    await supabase.auth.signOut();
    set({ user: null, isLoading: false });
  },

  fetchWorkouts: async () => {
    try {
      set({ isLoading: true, error: null });
      const { data: workouts, error } = await supabase
        .from('workouts')
        .select('*')
        .order('date', { ascending: true });

      if (error) {
        set({ error: error.message, isLoading: false });
        return;
      }

      set({ workouts: workouts || [], isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  fetchStravaActivities: async () => {
    try {
      set({ isLoading: true, error: null });
      
      // Check if user is logged in
      const { user } = get();
      if (!user) {
        set({ stravaConnected: false, activities: [], isLoading: false });
        return;
      }

      // Check if user has Strava connected using maybeSingle() instead of single()
      const { data: tokens, error: tokenError } = await supabase
        .from('strava_tokens')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (tokenError || !tokens) {
        set({ stravaConnected: false, activities: [], isLoading: false });
        return;
      }

      set({ stravaConnected: true });

      // Fetch activities
      const { data: activities, error } = await supabase
        .from('activities')
        .select('*')
        .eq('source', 'strava')
        .order('date', { ascending: false });

      if (error) {
        set({ error: error.message, isLoading: false });
        return;
      }

      set({ activities: activities || [], isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },
}));