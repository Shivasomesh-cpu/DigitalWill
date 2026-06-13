'use client';

import { useState } from 'react';
import { useAccounts } from '@/hooks/useAccounts';

export default function AccountsPage() {
  const { accounts, loading, updateDecision, addManualAccount } = useAccounts();
  const [serviceName, setServiceName] = useState('');

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <h2 className="text-3xl font-syne font-bold text-white">Accounts</h2>
      <div className="mt-6 flex gap-3">
        <input
          value={serviceName}
          onChange={(e) => setServiceName(e.target.value)}
          placeholder="Service name"
          className="min-w-0 flex-1 rounded-xl border border-border bg-surface-raised px-4 py-2 text-white outline-none"
        />
        <button
          onClick={() => {
            if (!serviceName.trim()) return;
            addManualAccount({ serviceName, discoveredVia: 'manual' });
            setServiceName('');
          }}
          className="rounded-xl bg-accent px-4 py-2 font-medium text-white"
        >
          Add account
        </button>
      </div>
      <div className="mt-6 overflow-hidden rounded-3xl border border-border bg-surface-raised">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-surface">
            <tr>
              <th className="px-4 py-3">Service</th>
              <th className="px-4 py-3">Risk</th>
              <th className="px-4 py-3">Decision</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td className="px-4 py-6 text-text-secondary" colSpan={3}>
                  Loading...
                </td>
              </tr>
            ) : (
              accounts.map((account) => (
                <tr key={account.id} className="border-t border-border">
                  <td className="px-4 py-3 text-white">{account.serviceName}</td>
                  <td className="px-4 py-3 text-text-secondary">{account.riskScore}</td>
                  <td className="px-4 py-3">
                    <select
                      value={account.decision}
                      onChange={(e) => updateDecision(account.id, e.target.value as any)}
                      className="rounded-lg border border-border bg-surface px-3 py-2 text-white"
                    >
                      <option value="undecided">Undecided</option>
                      <option value="keep">Keep</option>
                      <option value="delete">Delete</option>
                      <option value="transfer">Transfer</option>
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
