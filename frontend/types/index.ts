export type AccountCategory =
  | 'financial'
  | 'social'
  | 'storage'
  | 'entertainment'
  | 'work'
  | 'crypto'
  | 'other';

export type AccountDecision = 'keep' | 'delete' | 'transfer' | 'undecided';
export type ScanStatus = 'idle' | 'scanning' | 'complete' | 'error';

export type Account = {
  id: string;
  userId: string;
  serviceName: string;
  serviceUrl?: string;
  logoUrl?: string;
  category: AccountCategory;
  riskScore: number;
  riskReason?: string;
  decision: AccountDecision;
  transferTo?: string;
  notes?: string;
  discoveredVia: 'gmail' | 'manual';
  createdAt: string;
};

export type WillConfig = {
  id?: string;
  trustedContactName: string;
  trustedContactEmail: string;
  customMessage?: string;
  updatedAt?: string;
};

export type DeadManConfig = {
  id?: string;
  thresholdDays: 7 | 14 | 30 | 60 | 90;
  isActive: boolean;
  lastTriggered?: string;
};

export type ScanResult = {
  status: ScanStatus;
  accountsFound: number;
  accounts: Account[];
};

export type ApiSuccess<T> = { success: true; data: T };
export type ApiError = { success: false; error: string };
export type ApiResponse<T> = ApiSuccess<T> | ApiError;
