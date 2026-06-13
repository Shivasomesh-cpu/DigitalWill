'use client';

import { useEffect, useState } from 'react';
import { Account, ApiResponse } from '@/types';
import { MOCK_ACCOUNTS, USE_MOCK } from '@/constants/mockData';
import { useAppStore } from '@/stores/appStore';

export function useScan() {
  const { setScanStatus, setScannedCount, setAccounts } = useAppStore();
  const { scanStatus, scannedCount } = useAppStore();
  const [polling, setPolling] = useState(false);

  const startScan = async () => {
    try {
      setScanStatus('scanning');
      setScannedCount(0);
      setPolling(true);

      if (USE_MOCK) {
        // Simulate scanning with mock data
        for (let i = 0; i < MOCK_ACCOUNTS.length; i++) {
          await new Promise((resolve) => setTimeout(resolve, 200));
          setScannedCount(i + 1);
        }
        setAccounts(MOCK_ACCOUNTS);
        setScanStatus('complete');
      } else {
        // Real API: POST /api/gmail/scan
        const scanResponse = await fetch('/api/gmail/scan', { method: 'POST' });
        const scanResult: ApiResponse<{ jobId: string }> = await scanResponse.json();

        if (!scanResult.success) {
          setScanStatus('error');
          return;
        }

        // Poll GET /api/gmail/accounts every 2 seconds
        const pollInterval = setInterval(async () => {
          try {
            const accountsResponse = await fetch('/api/gmail/accounts');
            const accountsResult: ApiResponse<Account[]> = await accountsResponse.json();

            if (accountsResult.success) {
              const newCount = accountsResult.data.length;
              setScannedCount(newCount);
              setAccounts(accountsResult.data);

              // Check if scanning is complete (backend would indicate this)
              if (newCount >= 0) {
                // Assume complete after first response or based on backend flag
                setScanStatus('complete');
                clearInterval(pollInterval);
                setPolling(false);
              }
            }
          } catch (err) {
            console.error('Poll error:', err);
            setScanStatus('error');
            clearInterval(pollInterval);
            setPolling(false);
          }
        }, 2000);
      }
    } catch (err) {
      console.error('Scan error:', err);
      setScanStatus('error');
      setPolling(false);
    }
  };

  const cancelScan = () => {
    setScanStatus('idle');
    setScannedCount(0);
    setPolling(false);
  };

  return { startScan, cancelScan, scanStatus, scannedCount };
}
