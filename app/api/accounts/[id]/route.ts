import { getCurrentUserId } from '@/lib/api/currentUser';
import { json } from '@/lib/api/response';
import { deleteAccount, patchAccount } from '@/services/accountService';
import type { Account, ApiResponse } from '@/types';

type RouteContext = {
  params: { id: string };
};

export async function PATCH(req: Request, { params }: RouteContext): Promise<Response> {
  const current = await getCurrentUserId();
  if ('error' in current) {
    return json<ApiResponse<never>>({ success: false, error: current.error }, current.status);
  }

  try {
    const body = (await req.json()) as Partial<Account>;
    const account = await patchAccount(params.id, current.userId, {
      decision: body.decision,
      transferTo: body.transferTo,
      notes: body.notes,
      serviceName: body.serviceName,
      serviceUrl: body.serviceUrl,
      logoUrl: body.logoUrl,
      category: body.category,
      riskScore: body.riskScore,
      riskReason: body.riskReason,
    });

    return json<ApiResponse<Account>>({ success: true, data: account });
  } catch (error) {
    return json<ApiResponse<never>>({ success: false, error: getErrorMessage(error) }, 500);
  }
}

export async function DELETE(_req: Request, { params }: RouteContext): Promise<Response> {
  const current = await getCurrentUserId();
  if ('error' in current) {
    return json<ApiResponse<never>>({ success: false, error: current.error }, current.status);
  }

  try {
    await deleteAccount(params.id, current.userId);
    return json<ApiResponse<{ id: string }>>({ success: true, data: { id: params.id } });
  } catch (error) {
    return json<ApiResponse<never>>({ success: false, error: getErrorMessage(error) }, 500);
  }
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Account update failed';
}
