import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getRiskColor(score: number): string {
  if (score >= 70) return 'text-red-400 bg-red-400/10 border-red-400/20';
  if (score >= 40) return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
  return 'text-green-400 bg-green-400/10 border-green-400/20';
}

export function getRiskGlow(score: number): string {
  if (score >= 70) return '0 0 20px rgba(239,68,68,0.15)';
  if (score >= 40) return '0 0 20px rgba(245,158,11,0.10)';
  return 'none';
}
