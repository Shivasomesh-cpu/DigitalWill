import { getCurrentUserId } from '@/lib/api/currentUser';
import { json } from '@/lib/api/response';
import { disableDeadman, getDeadman, saveDeadman } from '@/services/deadmanService';
import type { ApiResponse, DeadManConfig } from '@/types';

const VALID_THRESHOLDS = new Set([7, 14, 30, 60, 90]);

export async function GET(): Promise<Response> {
  const current = await getCurrentUserId();
  if ('error' in current) {
    return json<ApiResponse<never>>({ success: false, error: current.error }, current.status);
  }

  try {
    const deadman = await getDeadman(current.userId);
    return json<ApiResponse<DeadManConfig | null>>({ success: true, data: deadman });
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
    const body = (await req.json()) as DeadManConfig;
    if (!VALID_THRESHOLDS.has(body.thresholdDays)) {
      return json<ApiResponse<never>>({ success: false, error: 'Invalid thresholdDays' }, 400);
    }

    const deadman = await saveDeadman(current.userId, {
      thresholdDays: body.thresholdDays,
      isActive: body.isActive,
    });

    return json<ApiResponse<DeadManConfig>>({ success: true, data: deadman });
  } catch (error) {
    return json<ApiResponse<never>>({ success: false, error: getErrorMessage(error) }, 500);
  }
}

export async function DELETE(): Promise<Response> {
  const current = await getCurrentUserId();
  if ('error' in current) {
    return json<ApiResponse<never>>({ success: false, error: current.error }, current.status);
  }

  try {
    await disableDeadman(current.userId);
    return json<ApiResponse<{ disabled: true }>>({ success: true, data: { disabled: true } });
  } catch (error) {
    return json<ApiResponse<never>>({ success: false, error: getErrorMessage(error) }, 500);
  }
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Deadman request failed';
}
