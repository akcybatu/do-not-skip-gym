import { createClient } from '@supabase/supabase-js';
import { EXPO_PUBLIC_SUPABASE_URL, EXPO_PUBLIC_SUPABASE_ANON_KEY } from '@env';

// Fallback values for development
const supabaseUrl = EXPO_PUBLIC_SUPABASE_URL || 'your_supabase_project_url_here';
const supabaseAnonKey = EXPO_PUBLIC_SUPABASE_ANON_KEY || 'your_supabase_anon_key_here';

if (!EXPO_PUBLIC_SUPABASE_URL || !EXPO_PUBLIC_SUPABASE_ANON_KEY) {
  console.warn('⚠️  Supabase environment variables not configured. Please create a .env file with your Supabase credentials.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
