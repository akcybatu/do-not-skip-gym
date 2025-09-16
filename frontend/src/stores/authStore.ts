import { create } from 'zustand';
import { supabase } from '../services/supabase';
import { AuthState, User, Profile } from '../types/auth';

interface AuthActions {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
  checkUser: () => Promise<void>;
  clearEmailConfirmation: () => void;
}

export const useAuthStore = create<AuthState & AuthActions>((set, get) => ({
  // State
  user: null,
  profile: null,
  isLoading: false,
  isAuthenticated: false,
  error: null,
  showEmailConfirmation: false,
  pendingEmail: null,

  // Actions
  signIn: async (email: string, password: string) => {
    try {
      set({ isLoading: true, error: null });

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        set({
          user: {
            id: data.user.id,
            email: data.user.email!,
            created_at: data.user.created_at,
          },
          isAuthenticated: true,
          isLoading: false,
        });
      }
    } catch (error: any) {
      set({
        error: error.message || 'An error occurred during sign in',
        isLoading: false,
        isAuthenticated: false,
      });
    }
  },

  signUp: async (email: string, password: string) => {
    try {
      set({ isLoading: true, error: null, showEmailConfirmation: false });

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      // Show email confirmation message instead of auto-signing in
      set({
        isLoading: false,
        showEmailConfirmation: true,
        pendingEmail: email,
        isAuthenticated: false,
        user: null,
      });
    } catch (error: any) {
      set({
        error: error.message || 'An error occurred during sign up',
        isLoading: false,
        isAuthenticated: false,
        showEmailConfirmation: false,
      });
    }
  },

  signOut: async () => {
    try {
      set({ isLoading: true });
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }

      set({
        user: null,
        profile: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        error: error.message || 'An error occurred during sign out',
        isLoading: false,
      });
    }
  },

  clearError: () => {
    set({ error: null });
  },

  clearEmailConfirmation: () => {
    set({ showEmailConfirmation: false, pendingEmail: null });
  },

  checkUser: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        set({
          user: {
            id: user.id,
            email: user.email!,
            created_at: user.created_at,
          },
          isAuthenticated: true,
        });
      }
    } catch (error) {
      console.error('Error checking user:', error);
    }
  },
}));
