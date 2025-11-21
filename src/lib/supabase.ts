import { createClient } from '@supabase/supabase-js';
import 'server-only';

const SUPABASE_URL = process.env.NEXT_PUBLIC_DB_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_DB_SUPABASE_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('Supabase URL or ANON KEY is missing. Check your environment variables.');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
