import { accountToDbRow, dbRowToAccount } from '@/lib/gmail/scanner';
import { supabase } from '@/lib/supabase/client';
import type { Account } from '@/types';

export async function getUserAccounts(userId: string): Promise<Account[]> {
  const { data, error } = await supabase
    .from('accounts')
    .select('*')
    .eq('user_id', userId)
    .order('risk_score', { ascending: false });

  if (error) throw error;
  return (data ?? []).map(dbRowToAccount);
}

export async function upsertAccount(
  userId: string,
  partial: Partial<Account>,
): Promise<Account> {
  const { data, error } = await supabase
    .from('accounts')
    .upsert(
      { user_id: userId, ...accountToDbRow({ ...partial, userId }) },
      { onConflict: 'user_id,service_name' },
    )
    .select()
    .single();

  if (error) throw error;
  return dbRowToAccount(data);
}

export async function patchAccount(
  id: string,
  userId: string,
  updates: Partial<Account>,
): Promise<Account> {
  const { data, error } = await supabase
    .from('accounts')
    .update(accountToDbRow(updates))
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;
  return dbRowToAccount(data);
}

export async function deleteAccount(id: string, userId: string): Promise<void> {
  const { error } = await supabase
    .from('accounts')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);
  if (error) throw error;
}
