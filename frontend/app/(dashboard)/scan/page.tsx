'use client';

import { useScan } from '@/hooks/useScan';
import { useAccounts } from '@/hooks/useAccounts';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Inbox, ArrowRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getRiskColor, getRiskGlow } from '@/lib/utils';

export default function ScanPage() {
  const { startScan, cancelScan, scanStatus, scannedCount } = useScan();
  const { accounts } = useAccounts();

  if (scanStatus === 'idle') {
    return (
      <div className="flex items-center justify-center min-h-full p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center max-w-md"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-6 relative"
          >
            <Inbox className="w-10 h-10 text-indigo-400" />
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-indigo-400/20"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>

          <h1 className="font-syne font-bold text-3xl text-white mb-3">
            Discover your entire digital footprint
          </h1>
          <p className="text-muted text-sm mb-8">
            We scan your Gmail headers to find every service you've signed up for.
          </p>

          <Button
            size="lg"
            onClick={startScan}
            className="bg-accent hover:bg-accent/90 text-white mb-6 w-full"
          >
            Scan Gmail Now
          </Button>

          <div className="flex gap-2 justify-center flex-wrap">
            {['Headers only', 'No message content', 'Data stays on your device'].map((text) => (
              <div
                key={text}
                className="px-4 py-2 rounded-full border border-border bg-surface-raised text-muted text-xs"
              >
                {text}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  if (scanStatus === 'scanning') {
    return (
      <div className="flex items-center justify-center min-h-full p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="text-center"
        >
          {/* Concentric rings animation */}
          <div className="relative w-40 h-40 mx-auto mb-8">
            {[0, 1, 2, 3].map((i) => (
              <motion.div
                key={`ring-${i}`}
                className="absolute inset-0 rounded-full border-2 border-accent/40"
                animate={{
                  scale: [1, 2],
                  opacity: [1, 0],
                }}
                transition={{
                  duration: 1.5,
                  delay: i * 0.3,
                  repeat: Infinity,
                }}
              />
            ))}

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center">
                <Inbox className="w-8 h-8 text-accent" />
              </div>
            </div>
          </div>

          <motion.div
            key={scannedCount}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="font-mono text-2xl font-bold text-accent mb-2"
          >
            Discovering accounts... {scannedCount}
          </motion.div>
          <p className="text-muted text-sm mb-4">This may take a minute.</p>

          <button
            onClick={cancelScan}
            className="text-muted text-sm underline hover:text-white transition-colors"
          >
            Cancel
          </button>
        </motion.div>
      </div>
    );
  }

  if (scanStatus === 'complete') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-bg via-surface/20 to-bg/95 p-6 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-6xl mx-auto"
        >
          <h1 className="font-syne font-bold text-4xl sm:text-5xl bg-gradient-to-r from-white via-text-secondary to-muted-light bg-clip-text text-transparent mb-3">
            Found {accounts.length} accounts
          </h1>
          <p className="text-muted-light text-lg">Ready to review and plan your digital legacy?</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.05 }}
          className="grid gap-3"
        >
          {accounts.map((account, i) => (
            <motion.div
              key={account.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              style={{ boxShadow: getRiskGlow(account.riskScore) }}
              className="bg-surface-raised rounded-lg p-4 border border-border flex items-center gap-4 hover:border-border/50 transition-colors"
            >
              {/* Logo placeholder */}
              <div className="w-10 h-10 rounded-lg bg-surface flex items-center justify-center flex-shrink-0 text-xs font-bold text-white">
                {account.serviceName.charAt(0)}
              </div>

              {/* Service info */}
              <div className="flex-1">
                <p className="font-syne font-bold text-white">{account.serviceName}</p>
                <p className="text-xs text-muted mt-1">{account.riskReason}</p>
              </div>

              {/* Category badge */}
              <div className="px-3 py-1 rounded-full bg-surface text-xs text-muted">
                {account.category}
              </div>

              {/* Risk score */}
              <div
                className={`px-3 py-1.5 rounded-lg border text-center font-mono font-bold text-sm ${getRiskColor(account.riskScore)}`}
              >
                {account.riskScore}
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="sticky bottom-6 flex justify-center"
        >
          <Link href="/accounts">
            <Button className="bg-accent hover:bg-accent/90 text-white">
              Review & Plan <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return null;
}
