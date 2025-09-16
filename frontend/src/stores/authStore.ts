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
        // Handle specific Supabase errors for existing users
        if (error.message.includes('User already registered') || 
            error.message.includes('already been registered') ||
            error.message.includes('already exists')) {
          throw new Error('An account with this email address already exists. Please sign in instead.');
        }
        throw error;
      }

      // Check if user was created or already exists
      if (data.user && !data.user.email_confirmed_at && data.user.identities && data.user.identities.length === 0) {
        // This indicates the user already exists but is not confirmed
        throw new Error('An account with this email address already exists but is not confirmed. Please check your email for the confirmation link or sign in if you have already confirmed your account.');
      }

      if (data.user && data.user.identities && data.user.identities.length === 0) {
        // User already exists and is confirmed
        throw new Error('An account with this email address already exists. Please sign in instead.');
      }

      // Show email confirmation message for new users
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
