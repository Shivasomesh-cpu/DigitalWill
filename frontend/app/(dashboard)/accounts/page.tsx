'use client';

import { useState, useMemo } from 'react';
import { useAccounts } from '@/hooks/useAccounts';
import { useAppStore } from '@/stores/appStore';
import { Account, AccountCategory, AccountDecision } from '@/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { getRiskColor, getRiskGlow } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Save, X } from 'lucide-react';

const CATEGORIES: AccountCategory[] = ['financial', 'social', 'storage', 'entertainment', 'work', 'crypto', 'other'];
const DECISIONS: AccountDecision[] = ['keep', 'delete', 'transfer', 'undecided'];

export default function AccountsPage() {
  const { accounts, updateDecision } = useAccounts();
  const { updateAccount } = useAppStore();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState({
    categories: new Set<AccountCategory>(),
    decisions: new Set<AccountDecision>(),
    sort: 'risk-high',
  });
  const [editingNotes, setEditingNotes] = useState<Record<string, string>>({});

  const filteredAccounts = useMemo(() => {
    let result = accounts;

    // Category filter
    if (filters.categories.size > 0) {
      result = result.filter((a) => filters.categories.has(a.category));
    }

    // Decision filter
    if (filters.decisions.size > 0) {
      result = result.filter((a) => filters.decisions.has(a.decision));
    }

    // Sort
    if (filters.sort === 'risk-high') {
      result.sort((a, b) => b.riskScore - a.riskScore);
    } else if (filters.sort === 'risk-low') {
      result.sort((a, b) => a.riskScore - b.riskScore);
    } else if (filters.sort === 'a-z') {
      result.sort((a, b) => a.serviceName.localeCompare(b.serviceName));
    }

    return result;
  }, [accounts, filters]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(filteredAccounts.map((a) => a.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleToggleSelect = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedIds(newSet);
  };

  const handleBulkDelete = () => {
    selectedIds.forEach((id) => {
      updateDecision(id, 'delete');
    });
    setSelectedIds(new Set());
  };

  const handleBulkKeep = () => {
    selectedIds.forEach((id) => {
      updateDecision(id, 'keep');
    });
    setSelectedIds(new Set());
  };

  const handleClearSelection = () => {
    setSelectedIds(new Set());
  };

  const toggleCategory = (cat: AccountCategory) => {
    const newSet = new Set(filters.categories);
    if (newSet.has(cat)) {
      newSet.delete(cat);
    } else {
      newSet.add(cat);
    }
    setFilters({ ...filters, categories: newSet });
  };

  const toggleDecision = (dec: AccountDecision) => {
    const newSet = new Set(filters.decisions);
    if (newSet.has(dec)) {
      newSet.delete(dec);
    } else {
      newSet.add(dec);
    }
    setFilters({ ...filters, decisions: newSet });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Filter Bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="sticky top-14 z-40 bg-gradient-to-r from-surface/60 via-surface-raised/40 to-surface/60 backdrop-blur-xl p-6 -mx-6 px-6 border-b border-border-light rounded-b-2xl space-y-4 shadow-lg shadow-black/20"
      >
        <div>
          <p className="text-xs text-muted mb-3 font-semibold">CATEGORIES</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilters({ ...filters, categories: new Set() })}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                filters.categories.size === 0
                  ? 'bg-accent text-white'
                  : 'bg-surface-raised text-muted border border-border'
              }`}
            >
              All
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => toggleCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors capitalize ${
                  filters.categories.has(cat)
                    ? 'bg-accent text-white'
                    : 'bg-surface-raised text-muted border border-border'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-4 flex-wrap">
          <div>
            <p className="text-xs text-muted mb-2 font-semibold">DECISION</p>
            <Select
              value={Array.from(filters.decisions).join(',')}
              onValueChange={(val) => {
                if (val === '') {
                  setFilters({ ...filters, decisions: new Set() });
                } else {
                  setFilters({ ...filters, decisions: new Set(val.split(',') as AccountDecision[]) });
                }
              }}
            >
              <SelectTrigger className="w-40 bg-surface-raised border-border">
                <SelectValue placeholder="All decisions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All</SelectItem>
                {DECISIONS.map((dec) => (
                  <SelectItem key={dec} value={dec} className="capitalize">
                    {dec}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <p className="text-xs text-muted mb-2 font-semibold">SORT</p>
            <Select value={filters.sort} onValueChange={(val) => setFilters({ ...filters, sort: val })}>
              <SelectTrigger className="w-40 bg-surface-raised border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="risk-high">Risk High → Low</SelectItem>
                <SelectItem value="risk-low">Risk Low → High</SelectItem>
                <SelectItem value="a-z">A → Z</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border overflow-x-auto">
        <Table>
          <TableHeader className="bg-surface-raised border-b border-border">
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedIds.size === filteredAccounts.length && filteredAccounts.length > 0}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead className="text-muted">Service</TableHead>
              <TableHead className="text-muted">Category</TableHead>
              <TableHead className="text-muted">Risk</TableHead>
              <TableHead className="text-muted">Reason</TableHead>
              <TableHead className="text-muted">Decision</TableHead>
              <TableHead className="text-muted">Transfer To</TableHead>
              <TableHead className="text-muted">Notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAccounts.map((account) => (
              <TableRow
                key={account.id}
                style={{ boxShadow: account.riskScore >= 70 ? getRiskGlow(account.riskScore) : 'none' }}
                className="hover:bg-surface-raised/50 transition-colors"
              >
                <TableCell>
                  <Checkbox
                    checked={selectedIds.has(account.id)}
                    onCheckedChange={() => handleToggleSelect(account.id)}
                  />
                </TableCell>
                <TableCell className="font-medium text-white">{account.serviceName}</TableCell>
                <TableCell>
                  <span className="px-2 py-1 rounded-full bg-surface text-xs text-muted capitalize">
                    {account.category}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-1 bg-surface-raised rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-green-400 to-red-400"
                        style={{ width: `${account.riskScore}%` }}
                      />
                    </div>
                    <span className="font-mono text-sm font-bold text-white">{account.riskScore}</span>
                  </div>
                </TableCell>
                <TableCell className="text-xs text-muted truncate max-w-xs">{account.riskReason}</TableCell>
                <TableCell>
                  <Select
                    value={account.decision}
                    onValueChange={(val) => updateDecision(account.id, val as AccountDecision)}
                  >
                    <SelectTrigger className="w-28 bg-surface-raised border-border text-xs h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DECISIONS.map((dec) => (
                        <SelectItem key={dec} value={dec} className="capitalize text-xs">
                          {dec}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  {account.decision === 'transfer' && (
                    <Input
                      type="email"
                      placeholder="email@example.com"
                      value={account.transferTo || ''}
                      onChange={(e) => updateAccount(account.id, { transferTo: e.target.value })}
                      className="w-40 bg-surface-raised border-border text-xs h-8"
                    />
                  )}
                </TableCell>
                <TableCell>
                  <Input
                    placeholder="Add note..."
                    value={editingNotes[account.id] || account.notes || ''}
                    onChange={(e) => setEditingNotes({ ...editingNotes, [account.id]: e.target.value })}
                    className="w-32 bg-surface-raised border-border text-xs h-8"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Bulk Actions */}
      <AnimatePresence>
        {selectedIds.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-surface-raised border border-border rounded-lg px-6 py-4 shadow-lg flex items-center gap-4"
          >
            <span className="text-sm text-muted font-medium">{selectedIds.size} rows selected</span>
            <Button
              size="sm"
              variant="outline"
              onClick={handleBulkDelete}
              className="text-red-400 border-red-400/30 hover:bg-red-400/10"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Mark Delete
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleBulkKeep}
              className="text-green-400 border-green-400/30 hover:bg-green-400/10"
            >
              Mark Keep
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleClearSelection}
              className="text-muted hover:text-white"
            >
              <X className="w-4 h-4 mr-1" />
              Clear
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button className="bg-accent hover:bg-accent/90 text-white">
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>
    </div>
  );
}
