'use client';

import { signIn } from 'next-auth/react';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-bg via-bg to-bg/95 flex overflow-hidden">
      {/* Left Panel - Premium Background */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col items-center justify-center p-8">
        {/* Gradient orbs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ duration: 1.5 }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-accent/20 to-transparent rounded-full blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }}
          transition={{ duration: 2 }}
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-tl from-blue-500/10 to-transparent rounded-full blur-3xl"
        />

        {/* Animated SVG Network */}
        <motion.svg
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 500 500"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <style>{`
              @keyframes line-pulse { 0%, 100% { opacity: 0.1; } 50% { opacity: 0.4; } }
              @keyframes node-drift { 0%, 100% { transform: translate(0, 0); } 33% { transform: translate(15px, -15px); } 66% { transform: translate(-15px, 20px); } }
              .connection { animation: line-pulse 3s ease-in-out infinite; }
              .drift-node { animation: node-drift 8s ease-in-out infinite; }
            `}</style>
          </defs>

          {/* Connecting lines */}
          <line x1="250" y1="250" x2="150" y2="150" stroke="#6366F1" strokeWidth="1.5" className="connection" />
          <line x1="250" y1="250" x2="350" y2="150" stroke="#6366F1" strokeWidth="1.5" className="connection" />
          <line x1="250" y1="250" x2="150" y2="350" stroke="#6366F1" strokeWidth="1.5" className="connection" />
          <line x1="250" y1="250" x2="350" y2="350" stroke="#6366F1" strokeWidth="1.5" className="connection" />
          <line x1="150" y1="150" x2="150" y2="350" stroke="#6366F1" strokeWidth="0.5" className="connection" opacity="0.3" />
          <line x1="350" y1="150" x2="350" y2="350" stroke="#6366F1" strokeWidth="0.5" className="connection" opacity="0.3" />

          {/* Central lock node */}
          <motion.circle cx="250" cy="250" r="8" fill="#6366F1" filter="url(#glow)" animate={{ r: [8, 10, 8] }} transition={{ duration: 2, repeat: Infinity }} />

          {/* Outer nodes */}
          {[
            { cx: 150, cy: 150 },
            { cx: 350, cy: 150 },
            { cx: 150, cy: 350 },
            { cx: 350, cy: 350 },
            { cx: 250, cy: 100 },
            { cx: 250, cy: 400 },
            { cx: 100, cy: 250 },
            { cx: 400, cy: 250 },
          ].map((node, i) => (
            <motion.circle
              key={`node-${i}`}
              cx={node.cx}
              cy={node.cy}
              r="4"
              fill="#818CF8"
              className="drift-node"
              opacity="0.6"
            />
          ))}
        </motion.svg>

        {/* Content overlay */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative z-10 text-center max-w-md"
        >
          <h2 className="text-2xl font-syne font-bold text-white mb-4">
            Secure Your Digital Legacy
          </h2>
          <p className="text-muted-light text-sm leading-relaxed">
            Plan your digital estate with confidence. Your accounts, your rules, your future.
          </p>
        </motion.div>
      </div>

      {/* Right Panel - Login Card */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Card Container */}
          <div className="relative">
            {/* Background gradient accent */}
            <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-blue-500/5 rounded-3xl blur-xl" />

            {/* Main card */}
            <div className="relative bg-surface-raised/80 backdrop-blur-xl border border-border-light rounded-3xl p-8 sm:p-10">
              {/* Header */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="flex justify-center mb-8"
              >
                <div className="relative">
                  <div className="w-14 h-14 bg-gradient-to-br from-accent to-accent-light rounded-2xl flex items-center justify-center">
                    <ShieldCheck className="w-7 h-7 text-white" />
                  </div>
                  <motion.div
                    className="absolute inset-0 rounded-2xl bg-accent/20"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>
              </motion.div>

              {/* Text */}
              <div className="text-center mb-8">
                <h1 className="text-3xl font-syne font-bold text-white mb-2">DigitalWill</h1>
                <p className="text-muted-light text-sm">Your digital life, planned.</p>
              </div>

              <Separator className="mb-8" />

              {/* Sign In Button */}
              <motion.button
                onClick={() => signIn('google')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full group relative overflow-hidden rounded-xl py-3 px-4 font-medium transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-accent via-accent-light to-accent" />
                <div className="absolute inset-0 bg-gradient-to-r from-accent/80 via-accent-light/80 to-accent/80 opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="relative flex items-center justify-center gap-2 text-white">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continue with Google
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.button>

              {/* Divider */}
              <div className="flex items-center gap-3 my-6">
                <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent" />
                <span className="text-xs text-muted">or</span>
                <div className="flex-1 h-px bg-gradient-to-l from-border to-transparent" />
              </div>

              {/* Guest Button */}
              <motion.button
                onClick={() => signIn('google')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 px-4 rounded-xl border border-border-light bg-surface/50 hover:bg-surface-hover text-white font-medium transition-all duration-300"
              >
                Explore as Guest
              </motion.button>

              {/* Footer */}
              <p className="text-xs text-muted text-center mt-8 leading-relaxed">
                We access email headers only — never message contents. Your privacy is sacred.
              </p>
            </div>
          </div>

          {/* Bottom trust badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-6 flex items-center justify-center gap-6 text-xs text-muted-light"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-success" />
              Secure & Private
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-success" />
              Data Local
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-success" />
              100% Safe
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
              style={{ animationDelay: `${i * 0.3}s` }}
            />
          ))}

          {/* Connection lines */}
          <line x1="200" y1="200" x2="100" y2="100" stroke="#6366F1" strokeWidth="1" className="connection-line" />
          <line x1="200" y1="200" x2="300" y2="100" stroke="#6366F1" strokeWidth="1" className="connection-line" style={{ animationDelay: '0.5s' }} />
          <line x1="200" y1="200" x2="100" y2="300" stroke="#6366F1" strokeWidth="1" className="connection-line" style={{ animationDelay: '1s' }} />
          <line x1="200" y1="200" x2="300" y2="300" stroke="#6366F1" strokeWidth="1" className="connection-line" style={{ animationDelay: '1.5s' }} />
          <line x1="100" y1="100" x2="300" y2="100" stroke="#6366F1" strokeWidth="1" className="connection-line" style={{ animationDelay: '2s' }} />

          {/* Central lock icon placeholder */}
          <circle cx="200" cy="200" r="15" fill="none" stroke="#6366F1" strokeWidth="2" opacity="0.6" />
          <text x="200" y="208" textAnchor="middle" fill="#6366F1" fontSize="20" fontWeight="bold">
            🔒
          </text>
        </svg>

        {/* Caption */}
        <div className="absolute bottom-12 text-center px-8">
          <p className="text-muted text-sm italic leading-relaxed">
            "47% of digital assets are never recovered after death."
          </p>
        </div>
      </div>

      {/* Right Panel - Sign in form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 lg:w-1/2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="w-full max-w-[400px]"
        >
          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <h1 className="font-syne font-800 text-2xl text-white">DigitalWill</h1>
          </div>

          {/* Tagline */}
          <p className="text-center text-muted text-sm mb-6">Your digital life, planned.</p>

          <Separator className="mb-6" />

          {/* Google Sign In Button */}
          <Button
            onClick={() => signIn('google')}
            size="lg"
            className="w-full bg-white text-black hover:bg-gray-100 h-11 font-medium"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </Button>

          {/* Fine print */}
          <p className="text-xs text-muted text-center mt-4">
            We access email headers only — never message contents.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
