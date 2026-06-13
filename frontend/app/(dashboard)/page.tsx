'use client';

import { useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import Link from 'next/link';
import { ArrowRight, Inbox, FileText, Timer, Sparkles } from 'lucide-react';
import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { useAccounts } from '@/hooks/useAccounts';
import { useWill } from '@/hooks/useWill';
import { useDeadman } from '@/hooks/useDeadman';
import { useAppStore } from '@/stores/appStore';

const categoryColors: Record<string, string> = {
  financial: '#EF4444',
  crypto: '#EF4444',
  storage: '#F59E0B',
  work: '#F59E0B',
  social: '#6366F1',
  entertainment: '#22C55E',
  other: '#64748B',
};

export default function DashboardPage() {
  const { data: session } = useSession();
  const { accounts } = useAccounts();
  const { will } = useWill();
  const { deadman } = useDeadman();

  useEffect(() => {
    if (!session) {
      signIn('google');
    }
  }, [session]);

  if (!session) {
    return (
      <div className="flex items-center justify-center h-full">
        <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }}>
          Redirecting to login...
        </motion.div>
      </div>
    );
  }

  const totalAccounts = accounts.length;
  const highRiskCount = accounts.filter((a) => a.riskScore >= 70).length;
  const willStatus = will?.trustedContactName ? 'Saved' : 'Draft';
  const switchStatus = deadman?.isActive ? 'Armed' : 'Off';

  const categoryStats = accounts.reduce(
    (acc, account) => {
      const existing = acc.find((c) => c.name === account.category);
      if (existing) {
        existing.value += 1;
      } else {
        acc.push({ name: account.category, value: 1 });
      }
      return acc;
    },
    [] as { name: string; value: number }[]
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  };

  const StatCard = ({ label, value, icon: Icon, color, accent, highlight = false }: any) => (
    <motion.div variants={itemVariants} className="group">
      <div
        className={`relative overflow-hidden rounded-2xl p-6 border transition-all duration-300 cursor-pointer ${
          highlight
            ? 'border-red-500/50 bg-red-500/5 ring-2 ring-red-500/20'
            : 'border-border-light bg-surface-raised/50 hover:border-accent/50 hover:bg-surface-hover'
        }`}
      >
        {/* Background gradient accent */}
        <div
          className={`absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${accent}`}
        />

        {/* Content */}
        <div className="relative z-10 flex items-start justify-between">
          <div>
            <p className="text-muted text-sm font-medium mb-2">{label}</p>
            <p className="text-4xl font-syne font-bold text-white tracking-tight">
              {typeof value === 'number' ? (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6 }}
                >
                  {value}
                </motion.span>
              ) : (
                value
              )}
            </p>
          </div>
          <motion.div
            className={`p-3 rounded-xl backdrop-blur-sm ${color}`}
            whileHover={{ scale: 1.1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
          >
            <Icon className="w-6 h-6" />
          </motion.div>
        </div>

        {/* Bottom accent bar */}
        <motion.div
          className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-accent to-accent-light"
          initial={{ width: 0 }}
          whileInView={{ width: '24px' }}
          transition={{ duration: 0.6, delay: 0.2 }}
        />
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg via-surface/20 to-bg/95">
      <div className="p-6 sm:p-8 lg:p-12 max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl sm:text-5xl font-syne font-bold bg-gradient-to-r from-white via-text-secondary to-muted-light bg-clip-text text-transparent mb-2">
                Your Dashboard
              </h1>
              <p className="text-muted-light text-base">
                Complete control over your digital legacy. Monitor, plan, and secure everything.
              </p>
            </div>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="hidden lg:block"
            >
              <Sparkles className="w-8 h-8 text-accent/50" />
            </motion.div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          <StatCard
            label="Total Accounts"
            value={totalAccounts}
            icon={Inbox}
            color="bg-blue-500/20"
            accent="from-blue-500/10 to-cyan-500/10"
          />
          <StatCard
            label="High Risk"
            value={highRiskCount}
            icon={FileText}
            color="bg-red-500/20"
            accent="from-red-500/10 to-pink-500/10"
            highlight={highRiskCount > 0}
          />
          <StatCard
            label="Will Status"
            value={willStatus}
            icon={Timer}
            color="bg-green-500/20"
            accent="from-green-500/10 to-emerald-500/10"
          />
          <StatCard
            label="Switch Status"
            value={switchStatus}
            icon={Sparkles}
            color="bg-purple-500/20"
            accent="from-purple-500/10 to-indigo-500/10"
          />
        </motion.div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Risk Chart */}
          {categoryStats.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-2 relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-transparent rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
              <div className="relative bg-surface-raised/50 backdrop-blur border border-border-light rounded-2xl p-8 hover:border-accent/50 transition-colors duration-300">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-syne font-bold text-white">Risk Distribution</h2>
                  <div className="text-sm text-muted bg-surface-raised/80 px-3 py-1 rounded-full">
                    {totalAccounts} accounts
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={categoryStats}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={110}
                      paddingAngle={1}
                      dataKey="value"
                      label={false}
                    >
                      {categoryStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={categoryColors[entry.name] || '#64748B'} />
                      ))}
                    </Pie>
                    <Legend wrapperStyle={{ paddingTop: '20px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          )}

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-4"
          >
            <div className="bg-surface-raised/50 backdrop-blur border border-border-light rounded-2xl p-6">
              <p className="text-muted text-sm mb-3">Quick Actions</p>
              <div className="space-y-2">
                {[
                  { label: 'Accounts to Review', value: totalAccounts },
                  { label: 'Critical Items', value: highRiskCount },
                  { label: 'Decisions Made', value: accounts.filter((a) => a.decision !== 'undecided').length },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                    <span className="text-sm text-muted-light">{item.label}</span>
                    <span className="text-lg font-syne font-bold text-white">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Action CTA Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <motion.div variants={itemVariants}>
            <Link href="/scan" className="group block h-full">
              <div className="relative overflow-hidden rounded-2xl border border-border-light bg-surface-raised/50 backdrop-blur p-6 hover:border-accent/50 hover:bg-surface-hover transition-all duration-300 h-full">
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Content */}
                <div className="relative z-10">
                  <motion.div
                    className="p-3 w-fit rounded-xl bg-blue-500/10 mb-4 group-hover:bg-blue-500/20 transition-colors"
                    whileHover={{ scale: 1.05 }}
                  >
                    <Inbox className="w-6 h-6 text-blue-400" />
                  </motion.div>
                  <h3 className="text-lg font-syne font-bold text-white mb-2">Discover Your Footprint</h3>
                  <p className="text-muted text-sm mb-4 leading-relaxed">
                    Scan your Gmail to find every service and account you've ever signed up for.
                  </p>
                  <motion.div
                    className="inline-flex items-center gap-2 text-blue-400 text-sm font-medium group-hover:gap-3 transition-all"
                    whileHover={{ x: 4 }}
                  >
                    Start Scan <ArrowRight className="w-4 h-4" />
                  </motion.div>
                </div>
              </div>
            </Link>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Link href="/will" className="group block h-full">
              <div className="relative overflow-hidden rounded-2xl border border-border-light bg-surface-raised/50 backdrop-blur p-6 hover:border-accent/50 hover:bg-surface-hover transition-all duration-300 h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="relative z-10">
                  <motion.div
                    className="p-3 w-fit rounded-xl bg-green-500/10 mb-4 group-hover:bg-green-500/20 transition-colors"
                    whileHover={{ scale: 1.05 }}
                  >
                    <FileText className="w-6 h-6 text-green-400" />
                  </motion.div>
                  <h3 className="text-lg font-syne font-bold text-white mb-2">Build Your Will</h3>
                  <p className="text-muted text-sm mb-4 leading-relaxed">
                    Create instructions for what happens to each account when you're gone.
                  </p>
                  <motion.div
                    className="inline-flex items-center gap-2 text-green-400 text-sm font-medium group-hover:gap-3 transition-all"
                    whileHover={{ x: 4 }}
                  >
                    Create Plan <ArrowRight className="w-4 h-4" />
                  </motion.div>
                </div>
              </div>
            </Link>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Link href="/deadman" className="group block h-full">
              <div className="relative overflow-hidden rounded-2xl border border-border-light bg-surface-raised/50 backdrop-blur p-6 hover:border-accent/50 hover:bg-surface-hover transition-all duration-300 h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="relative z-10">
                  <motion.div
                    className="p-3 w-fit rounded-xl bg-purple-500/10 mb-4 group-hover:bg-purple-500/20 transition-colors"
                    whileHover={{ scale: 1.05 }}
                  >
                    <Timer className="w-6 h-6 text-purple-400" />
                  </motion.div>
                  <h3 className="text-lg font-syne font-bold text-white mb-2">Setup Failsafe</h3>
                  <p className="text-muted text-sm mb-4 leading-relaxed">
                    Configure your Dead Man's Switch to trigger after you go offline.
                  </p>
                  <motion.div
                    className="inline-flex items-center gap-2 text-purple-400 text-sm font-medium group-hover:gap-3 transition-all"
                    whileHover={{ x: 4 }}
                  >
                    Configure <ArrowRight className="w-4 h-4" />
                  </motion.div>
                </div>
              </div>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
