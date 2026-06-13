import { getCurrentUserId } from '@/lib/api/currentUser';
import { json } from '@/lib/api/response';
import { pingUser } from '@/services/deadmanService';
import type { ApiResponse } from '@/types';

export async function POST(): Promise<Response> {
  const current = await getCurrentUserId();
  if ('error' in current) {
    return json<ApiResponse<never>>({ success: false, error: current.error }, current.status);
  }

  try {
    const lastPing = await pingUser(current.userId);
    return json<ApiResponse<{ lastPing: string }>>({ success: true, data: { lastPing } });
  } catch (error) {
    return json<ApiResponse<never>>(
      { success: false, error: error instanceof Error ? error.message : 'Ping failed' },
      500,
    );
  }
}
