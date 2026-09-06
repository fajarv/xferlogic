import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://boopntgkwhaqhyzdbuze.supabase.co';
const supabasePublishableKey = 'sb_publishable_FyKVwA8CqeIsCfskfkq5hQ_Nf-ZIMXK';

export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
