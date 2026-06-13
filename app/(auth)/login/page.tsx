'use client';

import { signIn } from 'next-auth/react';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.18),transparent_35%),linear-gradient(180deg,var(--bg),#07070d)] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-3xl border border-border-light bg-surface-raised/90 backdrop-blur-xl p-8 shadow-2xl"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-accent to-accent-light flex items-center justify-center">
            <ShieldCheck className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-syne font-bold text-white">DigitalWill</h1>
            <p className="text-sm text-muted-light">Your digital life, planned.</p>
          </div>
        </div>

        <p className="text-sm text-text-secondary leading-relaxed mb-6">
          Sign in to scan your Gmail, organize accounts, and prepare your digital estate.
        </p>

        <button
          onClick={() => signIn('google')}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 font-medium text-black transition hover:bg-gray-100"
        >
          Continue with Google
          <ArrowRight className="h-4 w-4" />
        </button>
      </motion.div>
    </div>
  );
}
