import { supabase } from '@/lib/supabase/client';
import type { DeadManConfig } from '@/types';

export async function getDeadman(userId: string): Promise<DeadManConfig | null> {
  const { data, error } = await supabase
    .from('deadman_configs')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;
  return dbRowToDeadman(data);
}

export async function saveDeadman(
  userId: string,
  config: DeadManConfig,
): Promise<DeadManConfig> {
  const { data, error } = await supabase
    .from('deadman_configs')
    .upsert(
      {
        user_id: userId,
        threshold_days: config.thresholdDays,
        is_active: config.isActive,
      },
      { onConflict: 'user_id' },
    )
    .select()
    .single();

  if (error) throw error;
  return dbRowToDeadman(data);
}

export async function disableDeadman(userId: string): Promise<void> {
  const { error } = await supabase
    .from('deadman_configs')
    .update({ is_active: false })
    .eq('user_id', userId);

  if (error) throw error;
}

export async function pingUser(userId: string): Promise<string> {
  const now = new Date().toISOString();
  const { error } = await supabase.from('users').update({ last_ping: now }).eq('id', userId);
  if (error) throw error;
  return now;
}

function dbRowToDeadman(row: Record<string, unknown>): DeadManConfig {
  return {
    id: row.id as string,
    thresholdDays: row.threshold_days as DeadManConfig['thresholdDays'],
    isActive: row.is_active as boolean,
    lastTriggered: row.last_triggered as string | undefined,
  };
}
