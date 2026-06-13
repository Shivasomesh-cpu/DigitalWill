import { getCurrentUserId } from '@/lib/api/currentUser';
import { json } from '@/lib/api/response';
import { getWill, saveWill } from '@/services/willService';
import type { ApiResponse, WillConfig } from '@/types';

export async function GET(): Promise<Response> {
  const current = await getCurrentUserId();
  if ('error' in current) {
    return json<ApiResponse<never>>({ success: false, error: current.error }, current.status);
  }

  try {
    const will = await getWill(current.userId);
    return json<ApiResponse<WillConfig | null>>({ success: true, data: will });
  } catch (error) {
    return json<ApiResponse<never>>({ success: false, error: getErrorMessage(error) }, 500);
  }
}

export async function PUT(req: Request): Promise<Response> {
  const current = await getCurrentUserId();
  if ('error' in current) {
    return json<ApiResponse<never>>({ success: false, error: current.error }, current.status);
  }

  try {
    const body = (await req.json()) as WillConfig;
    if (!body.trustedContactName || !body.trustedContactEmail) {
      return json<ApiResponse<never>>(
        { success: false, error: 'trustedContactName and trustedContactEmail are required' },
        400,
      );
    }

    const will = await saveWill(current.userId, body);
    return json<ApiResponse<WillConfig>>({ success: true, data: will });
  } catch (error) {
    return json<ApiResponse<never>>({ success: false, error: getErrorMessage(error) }, 500);
  }
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Will request failed';
}
