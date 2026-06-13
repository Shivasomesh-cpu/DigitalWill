import { getSupabaseAdminClient } from '@/lib/supabase/client';
import type { WillConfig } from '@/types';

export async function getWill(userId: string): Promise<WillConfig | null> {
  const { data, error } = await getSupabaseAdminClient()
    .from('will_configs')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;
  return dbRowToWill(data);
}

export async function saveWill(userId: string, config: WillConfig): Promise<WillConfig> {
  const { data, error } = await getSupabaseAdminClient()
    .from('will_configs')
    .upsert(
      {
        user_id: userId,
        trusted_contact_name: config.trustedContactName,
        trusted_contact_email: config.trustedContactEmail,
        custom_message: config.customMessage,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' },
    )
    .select()
    .single();

  if (error) throw error;
  return dbRowToWill(data);
}

function dbRowToWill(row: Record<string, unknown>): WillConfig {
  return {
    id: row.id as string,
    trustedContactName: row.trusted_contact_name as string,
    trustedContactEmail: row.trusted_contact_email as string,
    customMessage: row.custom_message as string | undefined,
    updatedAt: row.updated_at as string | undefined,
  };
}
