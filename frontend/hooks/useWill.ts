'use client';

import { useEffect, useState } from 'react';
import { WillConfig, ApiResponse } from '@/types';
import { MOCK_WILL, USE_MOCK } from '@/constants/mockData';
import { useAppStore } from '@/stores/appStore';

export function useWill() {
  const { will, setWill } = useAppStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWill = async () => {
      try {
        setLoading(true);
        if (USE_MOCK) {
          setWill(MOCK_WILL);
        } else {
          const response = await fetch('/api/will');
          const result: ApiResponse<WillConfig> = await response.json();
          if (result.success) {
            setWill(result.data);
          } else {
            setError(result.error);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch will config');
      } finally {
        setLoading(false);
      }
    };

    fetchWill();
  }, [setWill]);

  const saveWill = async (config: WillConfig) => {
    try {
      setLoading(true);
      if (USE_MOCK) {
        setWill({ ...config, updatedAt: new Date().toISOString() });
      } else {
        const response = await fetch('/api/will', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(config),
        });
        const result: ApiResponse<WillConfig> = await response.json();
        if (result.success) {
          setWill(result.data);
        } else {
          setError(result.error);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save will');
    } finally {
      setLoading(false);
    }
  };

  return { will, saveWill, loading, error };
}
