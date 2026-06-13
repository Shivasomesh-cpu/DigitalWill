'use client';

import { useEffect, useState } from 'react';
import { DeadManConfig, ApiResponse } from '@/types';
import { MOCK_DEADMAN, USE_MOCK } from '@/constants/mockData';
import { useAppStore } from '@/stores/appStore';

export function useDeadman() {
  const { deadman, setDeadman } = useAppStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDeadman = async () => {
      try {
        setLoading(true);
        if (USE_MOCK) {
          setDeadman(MOCK_DEADMAN);
        } else {
          const response = await fetch('/api/deadman');
          const result: ApiResponse<DeadManConfig> = await response.json();
          if (result.success) {
            setDeadman(result.data);
          } else {
            setError(result.error);
          }
        }

        // Silently ping to reset timer
        if (!USE_MOCK) {
          try {
            await fetch('/api/deadman/ping', { method: 'POST' });
          } catch (err) {
            // Silently fail ping
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch deadman config');
      } finally {
        setLoading(false);
      }
    };

    fetchDeadman();
  }, [setDeadman]);

  const enable = async (config: DeadManConfig) => {
    try {
      setLoading(true);
      if (USE_MOCK) {
        setDeadman({ ...config, isActive: true });
      } else {
        const response = await fetch('/api/deadman', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...config, isActive: true }),
        });
        const result: ApiResponse<DeadManConfig> = await response.json();
        if (result.success) {
          setDeadman(result.data);
        } else {
          setError(result.error);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to enable deadman');
    } finally {
      setLoading(false);
    }
  };

  const disable = async () => {
    try {
      setLoading(true);
      if (USE_MOCK) {
        setDeadman({ ...MOCK_DEADMAN, isActive: false });
      } else {
        const response = await fetch('/api/deadman', { method: 'DELETE' });
        const result: ApiResponse<{ disabled: true }> = await response.json();
        if (result.success) {
          setDeadman({ ...MOCK_DEADMAN, isActive: false });
        } else {
          setError(result.error);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to disable deadman');
    } finally {
      setLoading(false);
    }
  };

  const updateThreshold = async (thresholdDays: 7 | 14 | 30 | 60 | 90) => {
    try {
      setLoading(true);
      const newConfig = { ...deadman, thresholdDays } as DeadManConfig;
      if (USE_MOCK) {
        setDeadman(newConfig);
      } else {
        const response = await fetch('/api/deadman', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newConfig),
        });
        const result: ApiResponse<DeadManConfig> = await response.json();
        if (result.success) {
          setDeadman(result.data);
        } else {
          setError(result.error);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update threshold');
    } finally {
      setLoading(false);
    }
  };

  return { deadman, enable, disable, updateThreshold, loading, error };
}
