import { createClient } from '@supabase/supabase-js';

export const SUPABASE_URL = 'https://hrfspeeekhcijkktbmib.supabase.co';
export const DEFAULT_ANON_KEY = 'sb_publishable_1LGMDgoEmzpuzZUmjWERLQ_SrWtkm_C';

export const getSupabaseAnonKey = () => {
  return localStorage.getItem('dk_supabase_anon_key') || import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_ANON_KEY;
};

export const setSupabaseAnonKey = (key) => {
  if (key) {
    localStorage.setItem('dk_supabase_anon_key', key.trim());
  } else {
    localStorage.removeItem('dk_supabase_anon_key');
  }
};

// Initialize Supabase client
export const getSupabaseClient = () => {
  const anonKey = getSupabaseAnonKey();
  if (anonKey) {
    try {
      return createClient(SUPABASE_URL, anonKey);
    } catch (err) {
      console.warn('Supabase init failed, falling back to local engine:', err);
      return null;
    }
  }
  return null;
};
