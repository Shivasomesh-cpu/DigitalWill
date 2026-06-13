import { getCurrentUserId } from '@/lib/api/currentUser';
import { json } from '@/lib/api/response';
import { getUserAccounts } from '@/services/accountService';
import type { Account, ApiResponse } from '@/types';

export async function GET(): Promise<Response> {
  const current = await getCurrentUserId();
  if ('error' in current) {
    return json<ApiResponse<never>>({ success: false, error: current.error }, current.status);
  }

  try {
    const accounts = await getUserAccounts(current.userId);
    return json<ApiResponse<Account[]>>({ success: true, data: accounts });
  } catch (error) {
    return json<ApiResponse<never>>({ success: false, error: getErrorMessage(error) }, 500);
  }
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Failed to fetch accounts';
}
