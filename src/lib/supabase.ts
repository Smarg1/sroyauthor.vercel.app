import { createClient } from '@supabase/supabase-js';
export const url = process.env.SUPABASE_URL;
export const key = process.env.SUPABASE_PUBLISHABLE_KEY;

if (!url) {
  throw new Error('Missing SUPABASE_URL');
}

if (!key) {
  throw new Error('Missing Supabase key');
}

export const supabase = createClient(url, key, {
  db: {
    schema: 'api',
  },
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
  global: {
    fetch,
  },
});
