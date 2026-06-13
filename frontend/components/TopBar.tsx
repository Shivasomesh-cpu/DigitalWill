'use client';

import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { Menu, Bell, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

const breadcrumbMap: Record<string, string> = {
  '/': 'Home',
  '/scan': 'Scan Gmail',
  '/accounts': 'Accounts',
  '/will': 'My Will',
  '/deadman': 'Dead Man\'s Switch',
};

export function TopBar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const title = breadcrumbMap[pathname] || 'Dashboard';

  return (
    <motion.div
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.4 }}
      className="md:ml-60 h-16 bg-gradient-to-r from-surface/60 via-surface-raised/40 to-surface/60 backdrop-blur-xl border-b border-border-light sticky top-0 z-40 flex items-center justify-between px-6 shadow-lg shadow-black/20"
    >
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="md:hidden p-2 hover:bg-surface-raised rounded-lg transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <Menu className="w-5 h-5 text-muted-light" />
        </motion.button>
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="font-syne font-bold text-xl text-white"
        >
          {title}
        </motion.h1>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="relative p-2 text-muted-light hover:text-white hover:bg-surface-raised rounded-lg transition-colors group"
        >
          <Bell className="w-5 h-5" />
          <motion.div
            className="absolute top-1 right-1 w-2 h-2 rounded-full bg-gradient-to-r from-red-400 to-pink-400"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.button>

        {/* User Dropdown */}
        {session?.user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-surface-raised transition-colors group"
              >
                <motion.div
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-accent-light flex items-center justify-center text-white text-xs font-bold shadow-lg"
                  whileHover={{ scale: 1.1 }}
                >
                  {session.user.email?.charAt(0).toUpperCase()}
                </motion.div>
                <div className="hidden sm:flex items-center gap-1">
                  <span className="text-sm font-medium text-text truncate max-w-[120px]">
                    {session.user.email?.split('@')[0]}
                  </span>
                  <ChevronDown className="w-4 h-4 text-muted group-hover:text-text transition-colors" />
                </div>
              </motion.button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-surface-raised/95 backdrop-blur border-border-light">
              <div className="px-4 py-3 border-b border-border">
                <p className="text-xs text-muted mb-1">Logged in as</p>
                <p className="text-sm font-medium text-white truncate">{session.user.email}</p>
              </div>
              <DropdownMenuItem className="cursor-pointer text-muted-light hover:text-white data-[highlighted]:bg-surface-hover">
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer text-muted-light hover:text-white data-[highlighted]:bg-surface-hover">
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-border/50" />
              <DropdownMenuItem
                onClick={() => signOut()}
                className="cursor-pointer text-red-400 hover:text-red-300 data-[highlighted]:bg-red-500/10"
              >
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </motion.div>
  );
}
      </div>
    </div>
  );
}
