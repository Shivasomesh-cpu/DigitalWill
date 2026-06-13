import { createClient } from '@supabase/supabase-js';

let supabaseAdminClient: ReturnType<typeof createClient<any, any, any>> | null = null;

export function getSupabaseAdminClient() {
  if (supabaseAdminClient) return supabaseAdminClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error('Supabase admin client env vars are missing');
  }

  supabaseAdminClient = createClient<any, any, any>(url, key);
  return supabaseAdminClient;
}
