import { getCurrentUserId } from '@/lib/api/currentUser';
import { json } from '@/lib/api/response';
import { scanGmail } from '@/lib/gmail/scanner';
import type { ApiResponse } from '@/types';

export async function POST(): Promise<Response> {
  const current = await getCurrentUserId();
  if ('error' in current) {
    return json<ApiResponse<never>>({ success: false, error: current.error }, current.status);
  }

  const accessToken = current.session.accessToken;
  if (!accessToken) {
    return json<ApiResponse<never>>({ success: false, error: 'Missing Gmail access token' }, 401);
  }

  scanGmail(accessToken, current.userId).catch(console.error);

  return json<ApiResponse<{ jobId: string }>>({
    success: true,
    data: { jobId: current.userId },
  });
}
