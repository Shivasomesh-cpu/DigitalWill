import Link from 'next/link';
import type { ReactNode } from 'react';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/scan', label: 'Scan' },
  { href: '/accounts', label: 'Accounts' },
  { href: '/will', label: 'Will' },
  { href: '/deadman', label: 'Dead Man' },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-bg text-text">
      <header className="sticky top-0 z-20 border-b border-border bg-surface/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-light">DigitalWill</p>
            <h1 className="font-syne text-xl font-bold">Estate dashboard</h1>
          </div>
          <nav className="flex gap-3 text-sm text-text-secondary">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full border border-border px-3 py-1.5 transition hover:border-accent hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
