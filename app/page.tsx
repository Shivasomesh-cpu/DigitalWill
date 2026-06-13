'use client';

import Link from 'next/link';
import { useAccounts } from '@/hooks/useAccounts';
import { useWill } from '@/hooks/useWill';
import { useDeadman } from '@/hooks/useDeadman';

export default function HomePage() {
  const { accounts, loading } = useAccounts();
  const { will } = useWill();
  const { deadman } = useDeadman();

  const highRisk = accounts.filter((a) => a.riskScore >= 70).length;

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <section className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-3xl border border-border bg-surface-raised p-6 lg:col-span-2">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-light">Overview</p>
          <h2 className="mt-2 text-4xl font-syne font-bold text-white">Your digital estate, in one place.</h2>
          <p className="mt-4 max-w-2xl text-text-secondary">
            Scan accounts, decide what happens to them, and set a dead man&apos;s switch for the people you trust.
          </p>
          <div className="mt-6 flex gap-3">
            <Link className="rounded-xl bg-accent px-4 py-2 font-medium text-white" href="/scan">
              Start scan
            </Link>
            <Link className="rounded-xl border border-border px-4 py-2 font-medium text-white" href="/will">
              Edit will
            </Link>
          </div>
        </div>
        <div className="rounded-3xl border border-border bg-surface-raised p-6">
          <p className="text-sm text-muted-light">Status</p>
          <div className="mt-6 space-y-4 text-sm">
            <div className="flex justify-between">
              <span>Accounts</span>
              <strong>{loading ? '...' : accounts.length}</strong>
            </div>
            <div className="flex justify-between">
              <span>High risk</span>
              <strong>{highRisk}</strong>
            </div>
            <div className="flex justify-between">
              <span>Will</span>
              <strong>{will?.trustedContactName ? 'Saved' : 'Draft'}</strong>
            </div>
            <div className="flex justify-between">
              <span>Switch</span>
              <strong>{deadman?.isActive ? 'Armed' : 'Off'}</strong>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
