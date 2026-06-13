'use client';

import { useEffect, useState } from 'react';
import { Account, ApiResponse } from '@/types';
import { MOCK_ACCOUNTS, USE_MOCK } from '@/constants/mockData';
import { useAppStore } from '@/stores/appStore';

export function useAccounts() {
  const { accounts, setAccounts, updateAccount } = useAppStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        setLoading(true);
        if (USE_MOCK) {
          setAccounts(MOCK_ACCOUNTS);
        } else {
          const response = await fetch('/api/accounts');
          const result: ApiResponse<Account[]> = await response.json();
          if (result.success) {
            setAccounts(result.data);
          } else {
            setError(result.error);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch accounts');
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, [setAccounts]);

  const updateDecision = async (
    id: string,
    decision: Account['decision'],
    transferTo?: string
  ) => {
    try {
      updateAccount(id, { decision, transferTo });
      if (!USE_MOCK) {
        const response = await fetch(`/api/accounts/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ decision, transferTo }),
        });
        const result: ApiResponse<Account> = await response.json();
        if (!result.success) {
          setError(result.error);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update account');
    }
  };

  const addManualAccount = async (partial: Partial<Account>) => {
    try {
      if (USE_MOCK) {
        const newAccount: Account = {
          id: String(accounts.length + 1),
          userId: 'u1',
          serviceName: partial.serviceName || 'Unknown',
          category: partial.category || 'other',
          riskScore: partial.riskScore || 50,
          decision: 'undecided',
          discoveredVia: 'manual',
          createdAt: new Date().toISOString(),
        };
        setAccounts([...accounts, newAccount]);
      } else {
        const response = await fetch('/api/accounts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(partial),
        });
        const result: ApiResponse<Account> = await response.json();
        if (result.success) {
          setAccounts([...accounts, result.data]);
        } else {
          setError(result.error);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add account');
    }
  };

  return { accounts, loading, error, updateDecision, addManualAccount };
}
