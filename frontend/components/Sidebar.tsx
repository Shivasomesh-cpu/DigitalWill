'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { LayoutDashboard, Scan, List, FileText, Timer, LogOut, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const navItems = [
  { icon: LayoutDashboard, label: 'Home', href: '/' },
  { icon: Scan, label: 'Scan Gmail', href: '/scan' },
  { icon: List, label: 'Accounts', href: '/accounts' },
  { icon: FileText, label: 'My Will', href: '/will' },
  { icon: Timer, label: 'Dead Man\'s Switch', href: '/deadman' },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <motion.div
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.4 }}
      className="hidden md:flex md:w-60 md:flex-col md:fixed md:left-0 md:top-0 md:h-screen md:bg-gradient-to-b md:from-surface md:to-surface/80 md:border-r md:border-border-light md:backdrop-blur-sm"
    >
      {/* Logo Section */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="px-6 py-6 border-b border-border"
      >
        <Link href="/" className="flex items-center gap-3 group">
          <motion.div
            className="w-10 h-10 bg-gradient-to-br from-accent to-accent-light rounded-xl flex items-center justify-center shadow-lg"
            whileHover={{ scale: 1.05, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-white text-lg font-bold">⚔</span>
          </motion.div>
          <div>
            <p className="text-sm font-syne font-bold text-white leading-tight">DigitalWill</p>
            <p className="text-xs text-muted">v1.0</p>
          </div>
        </Link>
      </motion.div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
        {navItems.map((item, i) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.15 + i * 0.05 }}
            >
              <Link
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative overflow-hidden',
                  isActive
                    ? 'bg-gradient-to-r from-accent to-accent-light text-white shadow-lg shadow-accent/30'
                    : 'text-muted-light hover:text-text hover:bg-surface-hover'
                )}
              >
                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute inset-0 bg-gradient-to-r from-accent to-accent-light rounded-xl -z-10"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}

                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                >
                  <Icon className="w-5 h-5" />
                </motion.div>
                <span className="flex-1">{item.label}</span>
                {isActive && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring' }}
                    className="w-1.5 h-1.5 rounded-full bg-white"
                  />
                )}
              </Link>
            </motion.div>
          );
        })}
      </nav>

      {/* User Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="border-t border-border p-4 space-y-3"
      >
        {session?.user && (
          <>
            <div className="px-4 py-4 bg-surface-raised rounded-xl border border-border-light">
              <p className="text-xs text-muted mb-2 font-medium">Logged in as</p>
              <p className="text-sm font-medium text-white truncate flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-accent to-accent-light flex items-center justify-center text-xs font-bold text-white">
                  {session.user.email?.charAt(0).toUpperCase()}
                </div>
                <span className="truncate">{session.user.email}</span>
              </p>
            </div>

            <motion.button
              onClick={() => signOut()}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center gap-2 px-4 py-3 text-sm text-muted-light hover:text-white hover:bg-surface-raised rounded-xl transition-all duration-200 group"
            >
              <LogOut className="w-4 h-4 group-hover:text-red-400 transition-colors" />
              Sign Out
            </motion.button>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}
