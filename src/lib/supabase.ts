import { createClient } from '@supabase/supabase-js';

import type { Database } from '@/lib/types/db.types';

function requireEnv(name: string): string {
  const value = process.env[name];
  if (typeof value !== 'string' || value.length === 0) {
    throw new Error(`${name} is missing. Check your environment variables.`);
  }
  return value;
}

const SUPABASE_URL = requireEnv('NEXT_PUBLIC_SUPABASE_URL');

const SUPABASE_ANON_KEY = requireEnv('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY');

export function createSupabaseServerClient() {
  return createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
    db: {
      schema: 'api',
    },
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}
