'use client';

import { useScan } from '@/hooks/useScan';

export default function ScanPage() {
  const { startScan, scanStatus, scannedCount } = useScan();

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <h2 className="text-3xl font-syne font-bold text-white">Gmail Scan</h2>
      <p className="mt-3 text-text-secondary">
        Find services from your inbox headers and score them by risk.
      </p>
      <button onClick={startScan} className="mt-6 rounded-xl bg-accent px-4 py-2 font-medium text-white">
        {scanStatus === 'scanning' ? 'Scanning...' : 'Start Scan'}
      </button>
      <p className="mt-4 text-sm text-muted-light">Messages processed: {scannedCount}</p>
    </div>
  );
}
