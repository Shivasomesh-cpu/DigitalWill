'use client';

import { useState } from 'react';
import { useDeadman } from '@/hooks/useDeadman';
import { DeadManConfig } from '@/types';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Separator } from '@/components/ui/separator';
import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

export default function DeadmanPage() {
  const { deadman, enable, disable, updateThreshold } = useDeadman();
  const [showConfirm, setShowConfirm] = useState(false);

  if (!deadman) {
    return <div className="p-6">Loading...</div>;
  }

  const thresholdDays = deadman.thresholdDays || 30;
  const isActive = deadman.isActive || false;

  // Calculate progress (mock - would come from backend)
  const daysSinceLastLogin = 12; // Mock value
  const progress = (daysSinceLastLogin / thresholdDays) * 100;
  const isWarning = progress > 80;

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg via-surface/20 to-bg/95">
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      {/* Status Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-br from-surface-raised/80 to-surface-raised/40 backdrop-blur rounded-2xl p-8 border border-border-light shadow-lg shadow-black/20"
      >
        <div className="flex items-center gap-4 mb-6">
          <Switch
            checked={isActive}
            onCheckedChange={(checked) => (checked ? enable(deadman) : disable())}
            className="scale-150"
          />
          <div>
            <p className={`font-syne font-bold text-lg ${isActive ? 'text-success' : 'text-muted'}`}>
              {isActive ? 'Switch is armed' : 'Switch is disabled'}
            </p>
          </div>
        </div>

        {isActive && (
          <>
            {/* Progress Bar */}
            <div className="mb-6">
              <div className="h-2 bg-surface rounded-full overflow-hidden mb-2">
                <motion.div
                  className={`h-full ${
                    progress < 50
                      ? 'bg-success'
                      : progress < 80
                        ? 'bg-warning'
                        : 'bg-danger'
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <p className="text-xs text-muted">
                {daysSinceLastLogin} of {thresholdDays} days elapsed
              </p>
            </div>

            {/* Warning Banner */}
            {isWarning && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-warning/15 border border-warning/30 rounded-lg p-3 text-warning text-sm flex items-start gap-3 mb-6"
              >
                <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p>You're close to triggering. Logging in resets the timer.</p>
              </motion.div>
            )}
          </>
        )}
      </motion.div>

      {/* Threshold Selector */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-3"
      >
        <p className="text-sm font-semibold text-white">Choose a threshold:</p>
        <div className="flex gap-2 flex-wrap">
          {[7, 14, 30, 60, 90].map((days) => (
            <button
              key={days}
              onClick={() => updateThreshold(days as 7 | 14 | 30 | 60 | 90)}
              className={`px-4 py-2 rounded-full font-medium transition-colors ${
                thresholdDays === days
                  ? 'bg-accent text-white'
                  : 'bg-surface-raised text-muted border border-border hover:border-border/50'
              }`}
            >
              {days} days
            </button>
          ))}
        </div>
      </motion.div>

      {/* How It Works */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        <p className="text-sm font-semibold text-white">How It Works</p>
        <div className="space-y-3">
          {[
            { num: 1, text: 'Add your trusted contact in Will Builder.' },
            { num: 2, text: 'If you don't log in within your chosen window...' },
            { num: 3, text: 'They receive your decisions — automatically. No passwords. Just your plan.' },
          ].map((item) => (
            <div key={item.num} className="flex items-start gap-4">
              <div className="w-6 h-6 rounded-full bg-accent/20 text-accent flex items-center justify-center flex-shrink-0 font-bold text-xs">
                {item.num}
              </div>
              <p className="text-sm text-muted leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </motion.div>

      <Separator className="border-border" />

      {/* Danger Zone */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-4"
      >
        <p className="text-sm font-semibold text-danger">Danger Zone</p>
        <Button
          onClick={() => setShowConfirm(true)}
          variant="outline"
          className="text-danger border-danger/30 hover:bg-danger/10 w-full"
        >
          Disable Switch
        </Button>
      </motion.div>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent className="bg-surface border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Disable the switch?</AlertDialogTitle>
            <AlertDialogDescription className="text-muted">
              Your trusted contact will not be notified if you go offline.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel className="border-border">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                disable();
                setShowConfirm(false);
              }}
              className="bg-danger hover:bg-danger/90 text-white"
            >
              Disable
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
