'use client';

import { useState } from 'react';
import { useDeadman } from '@/hooks/useDeadman';

const thresholds = [7, 14, 30, 60, 90] as const;

export default function DeadmanPage() {
  const { deadman, enable, disable, updateThreshold } = useDeadman();
  const [thresholdDays, setThresholdDays] = useState(deadman?.thresholdDays ?? 30);
  const [isActive, setIsActive] = useState(deadman?.isActive ?? false);

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h2 className="text-3xl font-syne font-bold text-white">Dead Man&apos;s Switch</h2>
      <div className="mt-6 grid gap-4 rounded-3xl border border-border bg-surface-raised p-6">
        <label className="grid gap-2 text-sm">
          Threshold
          <select
            value={thresholdDays}
            onChange={(e) => {
              const value = Number(e.target.value) as 7 | 14 | 30 | 60 | 90;
              setThresholdDays(value);
              updateThreshold(value);
            }}
            className="rounded-xl border border-border bg-surface px-4 py-3 text-white"
          >
            {thresholds.map((days) => (
              <option key={days} value={days}>
                {days} days
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-3 text-sm">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
          />
          Active
        </label>
        <div className="flex gap-3">
          <button
            onClick={() =>
              isActive ? enable({ thresholdDays, isActive }) : disable()
            }
            className="rounded-xl bg-accent px-4 py-2 font-medium text-white"
          >
            Save
          </button>
          <button onClick={disable} className="rounded-xl border border-border px-4 py-2 font-medium text-white">
            Disable
          </button>
        </div>
      </div>
    </div>
  );
}
