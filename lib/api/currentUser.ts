import { auth } from '@/lib/auth';
import { supabase } from '@/lib/supabase/client';
import type { Session } from 'next-auth';

type CurrentUserResult =
  | { userId: string; session: Session }
  | { error: string; status: 401 | 404 };

export async function getCurrentUserId(): Promise<CurrentUserResult> {
  const session = await auth();

  if (!session?.user?.email) {
    return { error: 'Unauthorized', status: 401 as const };
  }

  const { data: user, error } = await supabase
    .from('users')
    .select('id')
    .eq('email', session.user.email)
    .single();

  if (error || !user) {
    return { error: 'User not found', status: 404 as const };
  }

  return { userId: user.id as string, session };
}
