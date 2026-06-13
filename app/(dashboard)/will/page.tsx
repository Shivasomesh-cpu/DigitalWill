'use client';

import { useState } from 'react';
import { useWill } from '@/hooks/useWill';

export default function WillPage() {
  const { will, saveWill } = useWill();
  const [trustedContactName, setTrustedContactName] = useState(will?.trustedContactName ?? '');
  const [trustedContactEmail, setTrustedContactEmail] = useState(will?.trustedContactEmail ?? '');
  const [customMessage, setCustomMessage] = useState(will?.customMessage ?? '');

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h2 className="text-3xl font-syne font-bold text-white">Will</h2>
      <div className="mt-6 grid gap-4">
        <input
          value={trustedContactName}
          onChange={(e) => setTrustedContactName(e.target.value)}
          placeholder="Trusted contact name"
          className="rounded-xl border border-border bg-surface-raised px-4 py-3 text-white"
        />
        <input
          value={trustedContactEmail}
          onChange={(e) => setTrustedContactEmail(e.target.value)}
          placeholder="Trusted contact email"
          className="rounded-xl border border-border bg-surface-raised px-4 py-3 text-white"
        />
        <textarea
          value={customMessage}
          onChange={(e) => setCustomMessage(e.target.value)}
          placeholder="Custom message"
          className="min-h-40 rounded-xl border border-border bg-surface-raised px-4 py-3 text-white"
        />
        <button
          onClick={() => saveWill({ trustedContactName, trustedContactEmail, customMessage })}
          className="w-fit rounded-xl bg-accent px-4 py-2 font-medium text-white"
        >
          Save will
        </button>
      </div>
    </div>
  );
}
