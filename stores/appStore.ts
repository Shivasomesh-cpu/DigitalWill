import { create } from 'zustand';
import { Account, WillConfig, DeadManConfig, ScanStatus } from '@/types';

type AppStore = {
  accounts: Account[];
  setAccounts: (accounts: Account[]) => void;
  updateAccount: (id: string, updates: Partial<Account>) => void;

  scanStatus: ScanStatus;
  setScanStatus: (status: ScanStatus) => void;
  scannedCount: number;
  setScannedCount: (n: number) => void;

  will: WillConfig | null;
  setWill: (will: WillConfig) => void;

  deadman: DeadManConfig | null;
  setDeadman: (config: DeadManConfig) => void;
};

export const useAppStore = create<AppStore>((set) => ({
  accounts: [],
  setAccounts: (accounts) => set({ accounts }),
  updateAccount: (id, updates) =>
    set((s) => ({
      accounts: s.accounts.map((a) => (a.id === id ? { ...a, ...updates } : a)),
    })),

  scanStatus: 'idle',
  setScanStatus: (scanStatus) => set({ scanStatus }),
  scannedCount: 0,
  setScannedCount: (scannedCount) => set({ scannedCount }),

  will: null,
  setWill: (will) => set({ will }),

  deadman: null,
  setDeadman: (deadman) => set({ deadman }),
}));
