import { getCurrentUserId } from '@/lib/api/currentUser';
import { json } from '@/lib/api/response';
import { getUserAccounts, upsertAccount } from '@/services/accountService';
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

export async function POST(req: Request): Promise<Response> {
  const current = await getCurrentUserId();
  if ('error' in current) {
    return json<ApiResponse<never>>({ success: false, error: current.error }, current.status);
  }

  try {
    const body = (await req.json()) as Partial<Account>;
    if (!body.serviceName) {
      return json<ApiResponse<never>>({ success: false, error: 'serviceName is required' }, 400);
    }

    const account = await upsertAccount(current.userId, {
      ...body,
      discoveredVia: 'manual',
      decision: body.decision ?? 'undecided',
      category: body.category ?? 'other',
      riskScore: body.riskScore ?? 50,
    });

    return json<ApiResponse<Account>>({ success: true, data: account }, 201);
  } catch (error) {
    return json<ApiResponse<never>>({ success: false, error: getErrorMessage(error) }, 500);
  }
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Account request failed';
}
