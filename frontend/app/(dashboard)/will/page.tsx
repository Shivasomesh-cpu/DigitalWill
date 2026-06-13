'use client';

import { useState } from 'react';
import { useWill } from '@/hooks/useWill';
import { useAccounts } from '@/hooks/useAccounts';
import { WillConfig } from '@/types';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { motion } from 'framer-motion';
import { Eye, CheckCircle2 } from 'lucide-react';

export default function WillPage() {
  const { will, saveWill, loading } = useWill();
  const { accounts } = useAccounts();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<WillConfig>(
    will || { trustedContactName: '', trustedContactEmail: '', customMessage: '' }
  );

  const handleSave = async () => {
    await saveWill(formData);
    // Show success
  };

  const accountsByDecision = {
    delete: accounts.filter((a) => a.decision === 'delete'),
    transfer: accounts.filter((a) => a.decision === 'transfer'),
    keep: accounts.filter((a) => a.decision === 'keep'),
    undecided: accounts.filter((a) => a.decision === 'undecided'),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg via-surface/20 to-bg/95">
    <div className="p-6 max-w-2xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-4">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`text-xs font-semibold ${step >= s ? 'text-accent' : 'text-muted'}`}
            >
              Step {s}
            </div>
          ))}
        </div>
        <div className="flex gap-2 h-1">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`flex-1 rounded-full transition-colors ${
                step >= s ? 'bg-accent' : 'bg-surface-raised'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Step 1: Trusted Contact */}
      {step === 1 && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
          <div>
            <h2 className="font-syne font-bold text-2xl text-white mb-2">Trusted Contact</h2>
            <p className="text-muted text-sm">
              This person will receive your instructions if your switch is triggered.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-white mb-2 block">Full Name</label>
              <Input
                value={formData.trustedContactName}
                onChange={(e) =>
                  setFormData({ ...formData, trustedContactName: e.target.value })
                }
                placeholder="John Doe"
                className="bg-surface-raised border-border"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-white mb-2 block">Email Address</label>
              <Input
                type="email"
                value={formData.trustedContactEmail}
                onChange={(e) =>
                  setFormData({ ...formData, trustedContactEmail: e.target.value })
                }
                placeholder="john@example.com"
                className="bg-surface-raised border-border"
                required
              />
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={() => setStep(2)}
              disabled={!formData.trustedContactName || !formData.trustedContactEmail}
              className="bg-accent hover:bg-accent/90 text-white flex-1"
            >
              Next →
            </Button>
          </div>
        </motion.div>
      )}

      {/* Step 2: Review Decisions */}
      {step === 2 && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
          <div>
            <h2 className="font-syne font-bold text-2xl text-white mb-2">Review Your Decisions</h2>
            <p className="text-muted text-sm">
              Here's what will happen to each account.{' '}
              <button
                onClick={() => setStep(1)}
                className="text-accent hover:underline"
              >
                Edit decisions
              </button>
            </p>
          </div>

          <div className="space-y-4">
            {/* To Delete */}
            {accountsByDecision.delete.length > 0 && (
              <div className="border-l-4 border-red-400 bg-red-400/5 p-4 rounded">
                <h3 className="font-semibold text-red-400 mb-2">🔴 To Delete ({accountsByDecision.delete.length})</h3>
                <ul className="text-sm text-muted space-y-1">
                  {accountsByDecision.delete.map((a) => (
                    <li key={a.id}>{a.serviceName}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* To Transfer */}
            {accountsByDecision.transfer.length > 0 && (
              <div className="border-l-4 border-indigo-400 bg-indigo-400/5 p-4 rounded">
                <h3 className="font-semibold text-indigo-400 mb-2">🔵 To Transfer ({accountsByDecision.transfer.length})</h3>
                <ul className="text-sm text-muted space-y-1">
                  {accountsByDecision.transfer.map((a) => (
                    <li key={a.id}>
                      {a.serviceName} → {a.transferTo}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* To Keep */}
            {accountsByDecision.keep.length > 0 && (
              <div className="border-l-4 border-green-400 bg-green-400/5 p-4 rounded">
                <h3 className="font-semibold text-green-400 mb-2">🟢 To Keep ({accountsByDecision.keep.length})</h3>
                <ul className="text-sm text-muted space-y-1">
                  {accountsByDecision.keep.map((a) => (
                    <li key={a.id}>{a.serviceName}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Undecided */}
            {accountsByDecision.undecided.length > 0 && (
              <div className="border-l-4 border-amber-400 bg-amber-400/5 p-4 rounded">
                <h3 className="font-semibold text-amber-400 mb-2">🟡 Undecided ({accountsByDecision.undecided.length})</h3>
                <p className="text-sm text-amber-300 mb-2">⚠️ {accountsByDecision.undecided.length} accounts still need a decision.</p>
                <ul className="text-sm text-muted space-y-1">
                  {accountsByDecision.undecided.map((a) => (
                    <li key={a.id}>{a.serviceName}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <Button
              onClick={() => setStep(1)}
              variant="outline"
              className="flex-1 border-border"
            >
              ← Back
            </Button>
            <Button
              onClick={() => setStep(3)}
              className="bg-accent hover:bg-accent/90 text-white flex-1"
            >
              Next →
            </Button>
          </div>
        </motion.div>
      )}

      {/* Step 3: Personal Message */}
      {step === 3 && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
          <div>
            <h2 className="font-syne font-bold text-2xl text-white mb-2">Personal Message</h2>
            <p className="text-muted text-sm">
              Write a message to your trusted contact. This appears in the email they receive.
            </p>
          </div>

          <div>
            <Textarea
              value={formData.customMessage}
              onChange={(e) =>
                setFormData({ ...formData, customMessage: e.target.value })
              }
              placeholder="Write a message to your trusted contact..."
              rows={5}
              maxLength={500}
              className="bg-surface-raised border-border resize-none"
            />
            <div className="text-xs text-muted mt-2 text-right">
              {formData.customMessage?.length || 0}/500
            </div>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full border-border text-muted">
                <Eye className="w-4 h-4 mr-2" />
                Preview email they'll receive
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-surface border-border max-w-md">
              <DialogHeader>
                <DialogTitle className="text-white">Email Preview</DialogTitle>
              </DialogHeader>
              <div className="bg-white text-black rounded-lg p-6 space-y-4">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Subject</p>
                  <p className="font-bold text-sm">Instructions from {formData.trustedContactName || 'Your Contact'}</p>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <p className="text-sm mb-4">Dear {formData.trustedContactName || 'Trusted Contact'},</p>
                  <p className="text-sm mb-4">
                    If you've received this, it means I've gone offline for an extended period without checking in. Here are my instructions:
                  </p>
                </div>

                {accountsByDecision.delete.length > 0 && (
                  <div className="text-sm">
                    <p className="font-bold mb-2">Accounts to Delete:</p>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {accountsByDecision.delete.map((a) => (
                        <li key={a.id}>• {a.serviceName}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {accountsByDecision.transfer.length > 0 && (
                  <div className="text-sm">
                    <p className="font-bold mb-2">Accounts to Transfer:</p>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {accountsByDecision.transfer.map((a) => (
                        <li key={a.id}>• {a.serviceName} → {a.transferTo}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {formData.customMessage && (
                  <div className="text-sm border-t border-gray-200 pt-4">
                    <p className="font-bold mb-2">Personal Message:</p>
                    <p className="text-xs text-gray-600 italic">{formData.customMessage}</p>
                  </div>
                )}

                <div className="border-t border-gray-200 pt-4 text-xs text-gray-600">
                  <p>No passwords were shared. These are your instructions only.</p>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <div className="flex gap-3">
            <Button
              onClick={() => setStep(2)}
              variant="outline"
              className="flex-1 border-border"
            >
              ← Back
            </Button>
            <Button
              onClick={handleSave}
              disabled={loading}
              className="bg-accent hover:bg-accent/90 text-white flex-1"
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Save Will
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
