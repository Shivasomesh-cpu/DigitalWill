import type { AccountCategory } from '@/types';

export const RISK_WEIGHTS: Record<AccountCategory, number> = {
  crypto: 98,
  financial: 90,
  storage: 72,
  work: 62,
  social: 55,
  entertainment: 25,
  other: 35,
};

export const RISK_SCORE_BOUNDS = {
  min: 0,
  max: 100,
};
