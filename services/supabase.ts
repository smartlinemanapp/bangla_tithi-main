import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.warn('Supabase URL or Key missing. App will run in offline/static mode.');
}

export const supabase = createClient(supabaseUrl || '', supabaseKey || '');

export const isSupabaseConfigured = () => {
    return !!supabaseUrl && !!supabaseKey;
};
