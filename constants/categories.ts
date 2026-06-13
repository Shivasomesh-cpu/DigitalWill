import type { AccountCategory } from '@/types';

export const ACCOUNT_CATEGORIES: AccountCategory[] = [
  'financial',
  'social',
  'storage',
  'entertainment',
  'work',
  'crypto',
  'other',
];

export const CATEGORY_LABELS: Record<AccountCategory, string> = {
  financial: 'Financial',
  social: 'Social',
  storage: 'Storage',
  entertainment: 'Entertainment',
  work: 'Work',
  crypto: 'Crypto',
  other: 'Other',
};
