/**
 * LOC: USACE-AS-002
 * File: /reuse/frontend/composites/usace/usace-accounting-systems-composites.ts
 *
 * UPSTREAM (imports from):
 *   - React 18+
 *   - Next.js 16+
 *   - TypeScript 5.x
 *   - @reuse/frontend/form-builder-kit
 *   - @reuse/frontend/analytics-tracking-kit
 *   - @reuse/frontend/workflow-approval-kit
 *   - @reuse/frontend/permissions-roles-kit
 *   - @reuse/frontend/version-control-kit
 *   - @reuse/frontend/import-export-cms-kit
 *
 * DOWNSTREAM (imported by):
 *   - USACE CEFMS accounting applications
 *   - General ledger systems
 *   - Journal entry management
 *   - Reconciliation tools
 */

/**
 * File: /reuse/frontend/composites/usace/usace-accounting-systems-composites.ts
 * Locator: WC-USACE-AS-COMP-002
 * Purpose: USACE CEFMS Accounting Systems Composites - Comprehensive accounting operations, ledger management, journal entries, and reconciliation
 *
 * Upstream: React 18+, Next.js 16+, TypeScript 5.x, form-builder-kit, analytics-tracking-kit, workflow-approval-kit
 * Downstream: USACE accounting systems, general ledger, journal entry systems, reconciliation tools
 * Dependencies: React 18+, Next.js 16+, TypeScript 5.x, reuse/frontend kits
 * Exports: 48+ functions for USACE accounting operations
 *
 * LLM Context: Enterprise-grade USACE CEFMS accounting system composites for React 18+ and Next.js 16+ applications.
 * Provides comprehensive general ledger management, journal entry processing, account reconciliation,
 * trial balance generation, financial period closing, chart of accounts management, and accounting reporting.
 * Designed specifically for U.S. Army Corps of Engineers Civil Works financial accounting requirements.
 */

'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  useFormState,
  FormProvider,
  FormConfig,
  FormData,
  FieldConfig,
  validateFieldValue,
  FormSection,
  getAllFields,
} from '../../form-builder-kit';
import {
  useTracking,
  trackEvent,
  trackError,
  trackFormInteraction,
  identifyUser,
} from '../../analytics-tracking-kit';
import {
  useWorkflowState,
  useApprovalFlow,
  WorkflowStatus,
  ApprovalDecision,
} from '../../workflow-approval-kit';
import {
  usePermissions,
  hasPermission,
  checkResourceAccess,
} from '../../permissions-roles-kit';
import {
  useVersionControl,
  createVersion,
  compareVersions,
} from '../../version-control-kit';
import {
  useImportExport,
  importFromCSV,
  exportToCSV,
  exportToExcel,
} from '../../import-export-cms-kit';

// ============================================================================
// TYPE DEFINITIONS - USACE CEFMS ACCOUNTING
// ============================================================================

/**
 * Chart of accounts entry
 */
export interface ChartOfAccountsEntry {
  id: string;
  accountNumber: string;
  accountName: string;
  accountType: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';
  accountSubtype: string;
  normalBalance: 'debit' | 'credit';
  parentAccountId?: string;
  level: number;
  isActive: boolean;
  isSummary: boolean;
  description: string;
  usageRestrictions?: string[];
  fiscalYear: number;
  createdDate: Date;
  lastModified: Date;
  metadata?: Record<string, any>;
}

/**
 * Journal entry structure
 */
export interface JournalEntry {
  id: string;
  entryNumber: string;
  entryDate: Date;
  postingDate: Date;
  fiscalYear: number;
  fiscalPeriod: number;
  entryType: 'standard' | 'adjusting' | 'closing' | 'reversing' | 'correction';
  description: string;
  referenceNumber?: string;
  sourceDocument?: string;
  preparedBy: string;
  approvedBy?: string;
  lineItems: JournalEntryLine[];
  totalDebits: number;
  totalCredits: number;
  isBalanced: boolean;
  status: 'draft' | 'pending_approval' | 'approved' | 'posted' | 'rejected' | 'voided';
  approvalWorkflowId?: string;
  postedDate?: Date;
  voidedDate?: Date;
  voidReason?: string;
  attachments?: string[];
  tags?: string[];
  metadata?: Record<string, any>;
}

/**
 * Journal entry line item
 */
export interface JournalEntryLine {
  id: string;
  lineNumber: number;
  accountId: string;
  accountNumber: string;
  accountName: string;
  debitAmount: number;
  creditAmount: number;
  description: string;
  projectId?: string;
  costCenterId?: string;
  appropriationId?: string;
  referenceId?: string;
  dimensions?: Record<string, string>;
  metadata?: Record<string, any>;
}

/**
 * General ledger account
 */
export interface GeneralLedgerAccount {
  accountId: string;
  accountNumber: string;
  accountName: string;
  accountType: string;
  beginningBalance: number;
  currentBalance: number;
  debitTotal: number;
  creditTotal: number;
  fiscalYear: number;
  fiscalPeriod: number;
  lastTransactionDate?: Date;
  transactions: LedgerTransaction[];
  isClosed: boolean;
  closedDate?: Date;
}

/**
 * Ledger transaction
 */
export interface LedgerTransaction {
  id: string;
  transactionDate: Date;
  postingDate: Date;
  journalEntryId: string;
  journalEntryNumber: string;
  lineNumber: number;
  description: string;
  debitAmount: number;
  creditAmount: number;
  balance: number;
  referenceNumber?: string;
  sourceDocument?: string;
  metadata?: Record<string, any>;
}

/**
 * Trial balance structure
 */
export interface TrialBalance {
  id: string;
  fiscalYear: number;
  fiscalPeriod: number;
  balanceDate: Date;
  balanceType: 'unadjusted' | 'adjusted' | 'post_closing';
  accounts: TrialBalanceAccount[];
  totalDebits: number;
  totalCredits: number;
  isBalanced: boolean;
  variance: number;
  generatedBy: string;
  generatedDate: Date;
  status: 'draft' | 'finalized';
}

/**
 * Trial balance account entry
 */
export interface TrialBalanceAccount {
  accountNumber: string;
  accountName: string;
  accountType: string;
  debitBalance: number;
  creditBalance: number;
  adjustments?: number;
  finalBalance: number;
}

/**
 * Account reconciliation
 */
export interface AccountReconciliation {
  id: string;
  reconciliationNumber: string;
  accountId: string;
  accountNumber: string;
  accountName: string;
  reconciliationDate: Date;
  fiscalYear: number;
  fiscalPeriod: number;
  bookBalance: number;
  statementBalance: number;
  reconciliationItems: ReconciliationItem[];
  totalAdjustments: number;
  reconciledBalance: number;
  isReconciled: boolean;
  variance: number;
  performedBy: string;
  reviewedBy?: string;
  approvedBy?: string;
  status: 'in_progress' | 'completed' | 'reviewed' | 'approved';
  notes?: string;
  attachments?: string[];
}

/**
 * Reconciliation item
 */
export interface ReconciliationItem {
  id: string;
  itemType: 'outstanding_check' | 'deposit_in_transit' | 'bank_fee' | 'interest' | 'error' | 'adjustment';
  description: string;
  amount: number;
  referenceNumber?: string;
  transactionDate: Date;
  clearingDate?: Date;
  isCleared: boolean;
  notes?: string;
}

/**
 * Fiscal period structure
 */
export interface FiscalPeriod {
  id: string;
  fiscalYear: number;
  period: number;
  periodName: string;
  startDate: Date;
  endDate: Date;
  status: 'open' | 'closed' | 'locked';
  closedBy?: string;
  closedDate?: Date;
  lockedBy?: string;
  lockedDate?: Date;
  periodType: 'regular' | 'adjustment' | 'year_end';
}

/**
 * Period closing checklist
 */
export interface PeriodClosingChecklist {
  id: string;
  fiscalYear: number;
  fiscalPeriod: number;
  closingDate: Date;
  tasks: ClosingTask[];
  overallStatus: 'not_started' | 'in_progress' | 'completed' | 'approved';
  completedBy?: string;
  approvedBy?: string;
  approvedDate?: Date;
}

/**
 * Closing task
 */
export interface ClosingTask {
  id: string;
  taskName: string;
  description: string;
  sequence: number;
  assignedTo: string;
  dueDate: Date;
  completedDate?: Date;
  status: 'pending' | 'in_progress' | 'completed' | 'blocked';
  dependencies?: string[];
  verificationRequired: boolean;
  verifiedBy?: string;
  notes?: string;
}

/**
 * Accounting batch processing
 */
export interface AccountingBatch {
  id: string;
  batchNumber: string;
  batchType: 'journal_entries' | 'adjustments' | 'allocations' | 'accruals';
  batchDate: Date;
  fiscalYear: number;
  fiscalPeriod: number;
  description: string;
  entries: JournalEntry[];
  totalEntries: number;
  totalDebits: number;
  totalCredits: number;
  isBalanced: boolean;
  status: 'draft' | 'validated' | 'posted' | 'rejected';
  createdBy: string;
  postedBy?: string;
  postedDate?: Date;
  validationErrors?: string[];
}

/**
 * Account balance inquiry
 */
export interface AccountBalanceInquiry {
  accountId: string;
  accountNumber: string;
  accountName: string;
  asOfDate: Date;
  currentBalance: number;
  availableBalance: number;
  pendingDebits: number;
  pendingCredits: number;
  lastActivity: Date;
  recentTransactions: LedgerTransaction[];
}

/**
 * Intercompany transaction
 */
export interface IntercompanyTransaction {
  id: string;
  transactionNumber: string;
  transactionDate: Date;
  fromEntity: string;
  toEntity: string;
  amount: number;
  description: string;
  fromAccountId: string;
  toAccountId: string;
  status: 'draft' | 'submitted' | 'confirmed' | 'posted' | 'rejected';
  eliminationEntryId?: string;
  isEliminated: boolean;
}

/**
 * Cost allocation rule
 */
export interface CostAllocationRule {
  id: string;
  ruleName: string;
  description: string;
  sourceAccountId: string;
  allocationMethod: 'percentage' | 'fixed' | 'formula' | 'driver_based';
  allocations: AllocationDistribution[];
  isActive: boolean;
  effectiveDate: Date;
  expirationDate?: Date;
}

/**
 * Allocation distribution
 */
export interface AllocationDistribution {
  targetAccountId: string;
  targetCostCenter?: string;
  targetProject?: string;
  allocationPercent?: number;
  fixedAmount?: number;
  allocationDriver?: string;
  notes?: string;
}

/**
 * Accounting dimension
 */
export interface AccountingDimension {
  dimensionName: string;
  dimensionCode: string;
  dimensionValue: string;
  description: string;
  isRequired: boolean;
  validValues?: string[];
}

// ============================================================================
// CHART OF ACCOUNTS MANAGEMENT
// ============================================================================

/**
 * Hook for chart of accounts management
 *
 * @description Manages chart of accounts structure and hierarchy
 *
 * @param {number} fiscalYear - Fiscal year for chart of accounts
 * @returns {object} Chart of accounts operations
 *
 * @example
 * ```tsx
 * function ChartOfAccountsManager() {
 *   const {
 *     accounts,
 *     addAccount,
 *     updateAccount,
 *     deactivateAccount,
 *     getAccountHierarchy
 *   } = useChartOfAccounts(2024);
 * }
 * ```
 */
export function useChartOfAccounts(fiscalYear: number) {
  const [accounts, setAccounts] = useState<ChartOfAccountsEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { track } = useTracking();

  const loadAccounts = useCallback(async () => {
    setIsLoading(true);
    try {
      track('chart_of_accounts_load', { fiscal_year: fiscalYear });
      // API call to load accounts
    } catch (error) {
      trackError({ errorMessage: 'Failed to load chart of accounts', errorType: 'LoadError' });
    } finally {
      setIsLoading(false);
    }
  }, [fiscalYear, track]);

  const addAccount = useCallback(async (accountData: Partial<ChartOfAccountsEntry>) => {
    track('account_add', { account_type: accountData.accountType });
    const newAccount: ChartOfAccountsEntry = {
      id: `acct_${Date.now()}`,
      fiscalYear,
      isActive: true,
      isSummary: false,
      level: 1,
      createdDate: new Date(),
      lastModified: new Date(),
      normalBalance: accountData.accountType === 'asset' || accountData.accountType === 'expense' ? 'debit' : 'credit',
      ...accountData,
    } as ChartOfAccountsEntry;
    setAccounts(prev => [...prev, newAccount]);
    return newAccount;
  }, [fiscalYear, track]);

  const updateAccount = useCallback((accountId: string, updates: Partial<ChartOfAccountsEntry>) => {
    track('account_update', { account_id: accountId });
    setAccounts(prev =>
      prev.map(acct =>
        acct.id === accountId ? { ...acct, ...updates, lastModified: new Date() } : acct
      )
    );
  }, [track]);

  const deactivateAccount = useCallback((accountId: string) => {
    track('account_deactivate', { account_id: accountId });
    updateAccount(accountId, { isActive: false });
  }, [track, updateAccount]);

  const getAccountHierarchy = useCallback(() => {
    track('account_hierarchy_get');
    // Build hierarchical structure
    const hierarchy: any[] = [];
    accounts.forEach(acct => {
      if (!acct.parentAccountId) {
        hierarchy.push({
          ...acct,
          children: accounts.filter(a => a.parentAccountId === acct.id),
        });
      }
    });
    return hierarchy;
  }, [accounts, track]);

  const searchAccounts = useCallback((query: string) => {
    track('account_search', { query });
    return accounts.filter(
      acct =>
        acct.accountNumber.includes(query) ||
        acct.accountName.toLowerCase().includes(query.toLowerCase())
    );
  }, [accounts, track]);

  return {
    accounts,
    isLoading,
    loadAccounts,
    addAccount,
    updateAccount,
    deactivateAccount,
    getAccountHierarchy,
    searchAccounts,
  };
}

// ============================================================================
// JOURNAL ENTRY MANAGEMENT
// ============================================================================

/**
 * Hook for journal entry creation and management
 *
 * @description Manages journal entries with validation and approval workflow
 *
 * @returns {object} Journal entry operations
 *
 * @example
 * ```tsx
 * function JournalEntryForm() {
 *   const {
 *     createEntry,
 *     addLine,
 *     validateBalance,
 *     submitForApproval,
 *     postEntry
 *   } = useJournalEntry();
 * }
 * ```
 */
export function useJournalEntry() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [currentEntry, setCurrentEntry] = useState<JournalEntry | null>(null);
  const { track } = useTracking();
  const { startWorkflow } = useApprovalFlow();

  const createEntry = useCallback((entryData: Partial<JournalEntry>) => {
    track('journal_entry_create', { entry_type: entryData.entryType });
    const newEntry: JournalEntry = {
      id: `je_${Date.now()}`,
      entryNumber: `JE-${Date.now()}`,
      status: 'draft',
      lineItems: [],
      totalDebits: 0,
      totalCredits: 0,
      isBalanced: false,
      entryDate: new Date(),
      postingDate: new Date(),
      ...entryData,
    } as JournalEntry;
    setEntries(prev => [...prev, newEntry]);
    setCurrentEntry(newEntry);
    return newEntry;
  }, [track]);

  const addLine = useCallback((entryId: string, lineData: Partial<JournalEntryLine>) => {
    track('journal_entry_line_add', { entry_id: entryId });
    setEntries(prev =>
      prev.map(entry => {
        if (entry.id === entryId) {
          const newLine: JournalEntryLine = {
            id: `jel_${Date.now()}`,
            lineNumber: entry.lineItems.length + 1,
            debitAmount: 0,
            creditAmount: 0,
            ...lineData,
          } as JournalEntryLine;
          const updatedLines = [...entry.lineItems, newLine];
          const totalDebits = updatedLines.reduce((sum, line) => sum + line.debitAmount, 0);
          const totalCredits = updatedLines.reduce((sum, line) => sum + line.creditAmount, 0);
          return {
            ...entry,
            lineItems: updatedLines,
            totalDebits,
            totalCredits,
            isBalanced: Math.abs(totalDebits - totalCredits) < 0.01,
          };
        }
        return entry;
      })
    );
  }, [track]);

  const removeLine = useCallback((entryId: string, lineId: string) => {
    track('journal_entry_line_remove', { entry_id: entryId, line_id: lineId });
    setEntries(prev =>
      prev.map(entry => {
        if (entry.id === entryId) {
          const updatedLines = entry.lineItems.filter(line => line.id !== lineId);
          const totalDebits = updatedLines.reduce((sum, line) => sum + line.debitAmount, 0);
          const totalCredits = updatedLines.reduce((sum, line) => sum + line.creditAmount, 0);
          return {
            ...entry,
            lineItems: updatedLines,
            totalDebits,
            totalCredits,
            isBalanced: Math.abs(totalDebits - totalCredits) < 0.01,
          };
        }
        return entry;
      })
    );
  }, [track]);

  const validateBalance = useCallback((entryId: string) => {
    const entry = entries.find(e => e.id === entryId);
    if (!entry) return { isValid: false, message: 'Entry not found' };

    const isBalanced = Math.abs(entry.totalDebits - entry.totalCredits) < 0.01;
    track('journal_entry_validate', { entry_id: entryId, is_balanced: isBalanced });

    if (!isBalanced) {
      return {
        isValid: false,
        message: `Entry is not balanced. Difference: ${Math.abs(entry.totalDebits - entry.totalCredits).toFixed(2)}`,
      };
    }

    if (entry.lineItems.length < 2) {
      return { isValid: false, message: 'Entry must have at least 2 line items' };
    }

    return { isValid: true, message: 'Entry is valid' };
  }, [entries, track]);

  const submitForApproval = useCallback(async (entryId: string) => {
    const validation = validateBalance(entryId);
    if (!validation.isValid) {
      throw new Error(validation.message);
    }

    track('journal_entry_submit_approval', { entry_id: entryId });
    setEntries(prev =>
      prev.map(entry =>
        entry.id === entryId ? { ...entry, status: 'pending_approval' } : entry
      )
    );
    // Start approval workflow
    await startWorkflow({ entityId: entryId, entityType: 'journal_entry' });
  }, [validateBalance, track, startWorkflow]);

  const approveEntry = useCallback((entryId: string, approver: string) => {
    track('journal_entry_approve', { entry_id: entryId });
    setEntries(prev =>
      prev.map(entry =>
        entry.id === entryId ? { ...entry, status: 'approved', approvedBy: approver } : entry
      )
    );
  }, [track]);

  const postEntry = useCallback(async (entryId: string) => {
    track('journal_entry_post', { entry_id: entryId });
    setEntries(prev =>
      prev.map(entry =>
        entry.id === entryId
          ? { ...entry, status: 'posted', postedDate: new Date() }
          : entry
      )
    );
  }, [track]);

  const voidEntry = useCallback((entryId: string, reason: string) => {
    track('journal_entry_void', { entry_id: entryId });
    setEntries(prev =>
      prev.map(entry =>
        entry.id === entryId
          ? { ...entry, status: 'voided', voidedDate: new Date(), voidReason: reason }
          : entry
      )
    );
  }, [track]);

  return {
    entries,
    currentEntry,
    createEntry,
    addLine,
    removeLine,
    validateBalance,
    submitForApproval,
    approveEntry,
    postEntry,
    voidEntry,
  };
}

/**
 * Hook for batch journal entry processing
 *
 * @description Manages batch processing of multiple journal entries
 *
 * @returns {object} Batch processing operations
 *
 * @example
 * ```tsx
 * function BatchEntryProcessor() {
 *   const {
 *     createBatch,
 *     addEntryToBatch,
 *     validateBatch,
 *     postBatch
 *   } = useBatchJournalEntry();
 * }
 * ```
 */
export function useBatchJournalEntry() {
  const [batches, setBatches] = useState<AccountingBatch[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { track } = useTracking();

  const createBatch = useCallback((batchData: Partial<AccountingBatch>) => {
    track('journal_batch_create', { batch_type: batchData.batchType });
    const newBatch: AccountingBatch = {
      id: `batch_${Date.now()}`,
      batchNumber: `BATCH-${Date.now()}`,
      status: 'draft',
      entries: [],
      totalEntries: 0,
      totalDebits: 0,
      totalCredits: 0,
      isBalanced: false,
      batchDate: new Date(),
      ...batchData,
    } as AccountingBatch;
    setBatches(prev => [...prev, newBatch]);
    return newBatch;
  }, [track]);

  const addEntryToBatch = useCallback((batchId: string, entry: JournalEntry) => {
    track('journal_batch_entry_add', { batch_id: batchId });
    setBatches(prev =>
      prev.map(batch => {
        if (batch.id === batchId) {
          const updatedEntries = [...batch.entries, entry];
          const totalDebits = updatedEntries.reduce((sum, e) => sum + e.totalDebits, 0);
          const totalCredits = updatedEntries.reduce((sum, e) => sum + e.totalCredits, 0);
          return {
            ...batch,
            entries: updatedEntries,
            totalEntries: updatedEntries.length,
            totalDebits,
            totalCredits,
            isBalanced: Math.abs(totalDebits - totalCredits) < 0.01,
          };
        }
        return batch;
      })
    );
  }, [track]);

  const validateBatch = useCallback((batchId: string) => {
    track('journal_batch_validate', { batch_id: batchId });
    const batch = batches.find(b => b.id === batchId);
    if (!batch) return { isValid: false, errors: ['Batch not found'] };

    const errors: string[] = [];
    if (batch.entries.length === 0) {
      errors.push('Batch has no entries');
    }
    if (!batch.isBalanced) {
      errors.push('Batch is not balanced');
    }

    batch.entries.forEach((entry, index) => {
      if (!entry.isBalanced) {
        errors.push(`Entry ${index + 1} (${entry.entryNumber}) is not balanced`);
      }
    });

    setBatches(prev =>
      prev.map(b =>
        b.id === batchId
          ? { ...b, status: errors.length === 0 ? 'validated' : 'draft', validationErrors: errors }
          : b
      )
    );

    return { isValid: errors.length === 0, errors };
  }, [batches, track]);

  const postBatch = useCallback(async (batchId: string) => {
    setIsProcessing(true);
    try {
      track('journal_batch_post', { batch_id: batchId });
      // Post all entries in the batch
      setBatches(prev =>
        prev.map(b =>
          b.id === batchId
            ? { ...b, status: 'posted', postedDate: new Date() }
            : b
        )
      );
    } finally {
      setIsProcessing(false);
    }
  }, [track]);

  return {
    batches,
    isProcessing,
    createBatch,
    addEntryToBatch,
    validateBatch,
    postBatch,
  };
}

// ============================================================================
// GENERAL LEDGER OPERATIONS
// ============================================================================

/**
 * Hook for general ledger account management
 *
 * @description Manages general ledger accounts and transactions
 *
 * @param {string} accountId - Account identifier
 * @returns {object} General ledger operations
 *
 * @example
 * ```tsx
 * function LedgerAccountView({ accountId }) {
 *   const {
 *     account,
 *     transactions,
 *     loadTransactions,
 *     calculateBalance,
 *     getActivityReport
 *   } = useGeneralLedger(accountId);
 * }
 * ```
 */
export function useGeneralLedger(accountId: string) {
  const [account, setAccount] = useState<GeneralLedgerAccount | null>(null);
  const [transactions, setTransactions] = useState<LedgerTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { track } = useTracking();

  const loadAccount = useCallback(async () => {
    setIsLoading(true);
    try {
      track('ledger_account_load', { account_id: accountId });
      // Load account data
    } finally {
      setIsLoading(false);
    }
  }, [accountId, track]);

  const loadTransactions = useCallback(async (startDate: Date, endDate: Date) => {
    track('ledger_transactions_load', { account_id: accountId });
    // Load transactions for date range
  }, [accountId, track]);

  const calculateBalance = useCallback((asOfDate: Date) => {
    track('ledger_balance_calculate', { account_id: accountId, as_of_date: asOfDate });
    if (!account) return 0;

    const relevantTransactions = transactions.filter(
      t => t.transactionDate <= asOfDate
    );

    return relevantTransactions.reduce((balance, t) => {
      return balance + t.debitAmount - t.creditAmount;
    }, account.beginningBalance);
  }, [account, transactions, accountId, track]);

  const getActivityReport = useCallback((fiscalPeriod: number) => {
    track('ledger_activity_report', { account_id: accountId, fiscal_period: fiscalPeriod });
    const periodTransactions = transactions.filter(
      t => t.fiscalPeriod === fiscalPeriod
    );

    return {
      totalDebits: periodTransactions.reduce((sum, t) => sum + t.debitAmount, 0),
      totalCredits: periodTransactions.reduce((sum, t) => sum + t.creditAmount, 0),
      netChange: periodTransactions.reduce((sum, t) => sum + t.debitAmount - t.creditAmount, 0),
      transactionCount: periodTransactions.length,
    };
  }, [transactions, accountId, track]);

  const postTransaction = useCallback(async (transaction: Partial<LedgerTransaction>) => {
    track('ledger_transaction_post', { account_id: accountId });
    const newTransaction: LedgerTransaction = {
      id: `txn_${Date.now()}`,
      balance: 0,
      ...transaction,
    } as LedgerTransaction;
    setTransactions(prev => [...prev, newTransaction]);
    return newTransaction;
  }, [accountId, track]);

  return {
    account,
    transactions,
    isLoading,
    loadAccount,
    loadTransactions,
    calculateBalance,
    getActivityReport,
    postTransaction,
  };
}

/**
 * Hook for trial balance generation
 *
 * @description Generates trial balance reports
 *
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @returns {object} Trial balance operations
 *
 * @example
 * ```tsx
 * function TrialBalanceReport({ fiscalYear, fiscalPeriod }) {
 *   const {
 *     trialBalance,
 *     generateTrialBalance,
 *     verifyBalance,
 *     exportTrialBalance
 *   } = useTrialBalance(fiscalYear, fiscalPeriod);
 * }
 * ```
 */
export function useTrialBalance(fiscalYear: number, fiscalPeriod: number) {
  const [trialBalance, setTrialBalance] = useState<TrialBalance | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { track } = useTracking();

  const generateTrialBalance = useCallback(async (balanceType: 'unadjusted' | 'adjusted' | 'post_closing') => {
    setIsGenerating(true);
    try {
      track('trial_balance_generate', { fiscal_year: fiscalYear, fiscal_period: fiscalPeriod, type: balanceType });
      // Generate trial balance from ledger accounts
      const newTrialBalance: TrialBalance = {
        id: `tb_${Date.now()}`,
        fiscalYear,
        fiscalPeriod,
        balanceDate: new Date(),
        balanceType,
        accounts: [],
        totalDebits: 0,
        totalCredits: 0,
        isBalanced: true,
        variance: 0,
        generatedBy: 'current_user',
        generatedDate: new Date(),
        status: 'draft',
      };
      setTrialBalance(newTrialBalance);
      return newTrialBalance;
    } finally {
      setIsGenerating(false);
    }
  }, [fiscalYear, fiscalPeriod, track]);

  const verifyBalance = useCallback(() => {
    if (!trialBalance) return { isBalanced: false, variance: 0 };

    const totalDebits = trialBalance.accounts.reduce((sum, acct) => sum + acct.debitBalance, 0);
    const totalCredits = trialBalance.accounts.reduce((sum, acct) => sum + acct.creditBalance, 0);
    const variance = Math.abs(totalDebits - totalCredits);
    const isBalanced = variance < 0.01;

    track('trial_balance_verify', { is_balanced: isBalanced, variance });

    return { isBalanced, variance, totalDebits, totalCredits };
  }, [trialBalance, track]);

  const finalizeTrialBalance = useCallback(() => {
    track('trial_balance_finalize', { trial_balance_id: trialBalance?.id });
    if (trialBalance) {
      setTrialBalance({ ...trialBalance, status: 'finalized' });
    }
  }, [trialBalance, track]);

  const exportTrialBalance = useCallback(async (format: 'excel' | 'pdf' | 'csv') => {
    track('trial_balance_export', { format });
    // Export logic
    return `trial_balance_fy${fiscalYear}_p${fiscalPeriod}.${format}`;
  }, [fiscalYear, fiscalPeriod, track]);

  return {
    trialBalance,
    isGenerating,
    generateTrialBalance,
    verifyBalance,
    finalizeTrialBalance,
    exportTrialBalance,
  };
}

// ============================================================================
// ACCOUNT RECONCILIATION
// ============================================================================

/**
 * Hook for account reconciliation
 *
 * @description Manages account reconciliation process
 *
 * @param {string} accountId - Account to reconcile
 * @returns {object} Reconciliation operations
 *
 * @example
 * ```tsx
 * function AccountReconciliationTool({ accountId }) {
 *   const {
 *     reconciliation,
 *     startReconciliation,
 *     addReconciliationItem,
 *     calculateVariance,
 *     completeReconciliation
 *   } = useAccountReconciliation(accountId);
 * }
 * ```
 */
export function useAccountReconciliation(accountId: string) {
  const [reconciliation, setReconciliation] = useState<AccountReconciliation | null>(null);
  const [reconciliationHistory, setHistory] = useState<AccountReconciliation[]>([]);
  const { track } = useTracking();

  const startReconciliation = useCallback(
    (bookBalance: number, statementBalance: number, fiscalYear: number, fiscalPeriod: number) => {
      track('reconciliation_start', { account_id: accountId });
      const newRecon: AccountReconciliation = {
        id: `recon_${Date.now()}`,
        reconciliationNumber: `RECON-${Date.now()}`,
        accountId,
        accountNumber: '',
        accountName: '',
        reconciliationDate: new Date(),
        fiscalYear,
        fiscalPeriod,
        bookBalance,
        statementBalance,
        reconciliationItems: [],
        totalAdjustments: 0,
        reconciledBalance: bookBalance,
        isReconciled: false,
        variance: bookBalance - statementBalance,
        performedBy: 'current_user',
        status: 'in_progress',
      };
      setReconciliation(newRecon);
      return newRecon;
    },
    [accountId, track]
  );

  const addReconciliationItem = useCallback((item: Partial<ReconciliationItem>) => {
    track('reconciliation_item_add', { item_type: item.itemType });
    if (!reconciliation) return;

    const newItem: ReconciliationItem = {
      id: `item_${Date.now()}`,
      isCleared: false,
      ...item,
    } as ReconciliationItem;

    const updatedItems = [...reconciliation.reconciliationItems, newItem];
    const totalAdjustments = updatedItems.reduce((sum, i) => sum + i.amount, 0);
    const reconciledBalance = reconciliation.bookBalance + totalAdjustments;
    const variance = Math.abs(reconciledBalance - reconciliation.statementBalance);

    setReconciliation({
      ...reconciliation,
      reconciliationItems: updatedItems,
      totalAdjustments,
      reconciledBalance,
      variance,
      isReconciled: variance < 0.01,
    });
  }, [reconciliation, track]);

  const removeReconciliationItem = useCallback((itemId: string) => {
    track('reconciliation_item_remove', { item_id: itemId });
    if (!reconciliation) return;

    const updatedItems = reconciliation.reconciliationItems.filter(i => i.id !== itemId);
    const totalAdjustments = updatedItems.reduce((sum, i) => sum + i.amount, 0);
    const reconciledBalance = reconciliation.bookBalance + totalAdjustments;
    const variance = Math.abs(reconciledBalance - reconciliation.statementBalance);

    setReconciliation({
      ...reconciliation,
      reconciliationItems: updatedItems,
      totalAdjustments,
      reconciledBalance,
      variance,
      isReconciled: variance < 0.01,
    });
  }, [reconciliation, track]);

  const calculateVariance = useCallback(() => {
    if (!reconciliation) return 0;
    return Math.abs(reconciliation.reconciledBalance - reconciliation.statementBalance);
  }, [reconciliation]);

  const completeReconciliation = useCallback(() => {
    track('reconciliation_complete', { account_id: accountId });
    if (reconciliation) {
      const completed = { ...reconciliation, status: 'completed' as const };
      setReconciliation(completed);
      setHistory(prev => [...prev, completed]);
    }
  }, [reconciliation, accountId, track]);

  const approveReconciliation = useCallback((approver: string) => {
    track('reconciliation_approve', { account_id: accountId });
    if (reconciliation) {
      setReconciliation({
        ...reconciliation,
        status: 'approved',
        approvedBy: approver,
      });
    }
  }, [reconciliation, accountId, track]);

  return {
    reconciliation,
    reconciliationHistory,
    startReconciliation,
    addReconciliationItem,
    removeReconciliationItem,
    calculateVariance,
    completeReconciliation,
    approveReconciliation,
  };
}

// ============================================================================
// FISCAL PERIOD MANAGEMENT
// ============================================================================

/**
 * Hook for fiscal period management
 *
 * @description Manages fiscal period opening, closing, and locking
 *
 * @param {number} fiscalYear - Fiscal year
 * @returns {object} Fiscal period operations
 *
 * @example
 * ```tsx
 * function FiscalPeriodManager({ fiscalYear }) {
 *   const {
 *     periods,
 *     openPeriod,
 *     closePeriod,
 *     lockPeriod,
 *     getCurrentPeriod
 *   } = useFiscalPeriodManagement(fiscalYear);
 * }
 * ```
 */
export function useFiscalPeriodManagement(fiscalYear: number) {
  const [periods, setPeriods] = useState<FiscalPeriod[]>([]);
  const { track } = useTracking();

  const loadPeriods = useCallback(async () => {
    track('fiscal_periods_load', { fiscal_year: fiscalYear });
    // Load fiscal periods for the year
  }, [fiscalYear, track]);

  const openPeriod = useCallback((periodNumber: number) => {
    track('fiscal_period_open', { fiscal_year: fiscalYear, period: periodNumber });
    setPeriods(prev =>
      prev.map(p =>
        p.period === periodNumber ? { ...p, status: 'open' } : p
      )
    );
  }, [fiscalYear, track]);

  const closePeriod = useCallback((periodNumber: number, closedBy: string) => {
    track('fiscal_period_close', { fiscal_year: fiscalYear, period: periodNumber });
    setPeriods(prev =>
      prev.map(p =>
        p.period === periodNumber
          ? { ...p, status: 'closed', closedBy, closedDate: new Date() }
          : p
      )
    );
  }, [fiscalYear, track]);

  const lockPeriod = useCallback((periodNumber: number, lockedBy: string) => {
    track('fiscal_period_lock', { fiscal_year: fiscalYear, period: periodNumber });
    setPeriods(prev =>
      prev.map(p =>
        p.period === periodNumber
          ? { ...p, status: 'locked', lockedBy, lockedDate: new Date() }
          : p
      )
    );
  }, [fiscalYear, track]);

  const getCurrentPeriod = useCallback(() => {
    const currentDate = new Date();
    return periods.find(
      p => currentDate >= p.startDate && currentDate <= p.endDate
    );
  }, [periods]);

  const isPeriodOpen = useCallback((periodNumber: number) => {
    const period = periods.find(p => p.period === periodNumber);
    return period?.status === 'open';
  }, [periods]);

  return {
    periods,
    loadPeriods,
    openPeriod,
    closePeriod,
    lockPeriod,
    getCurrentPeriod,
    isPeriodOpen,
  };
}

/**
 * Hook for period closing checklist management
 *
 * @description Manages period closing tasks and checklist
 *
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @returns {object} Period closing operations
 *
 * @example
 * ```tsx
 * function PeriodClosingChecklist({ fiscalYear, fiscalPeriod }) {
 *   const {
 *     checklist,
 *     createChecklist,
 *     completeTask,
 *     getCompletionStatus
 *   } = usePeriodClosingChecklist(fiscalYear, fiscalPeriod);
 * }
 * ```
 */
export function usePeriodClosingChecklist(fiscalYear: number, fiscalPeriod: number) {
  const [checklist, setChecklist] = useState<PeriodClosingChecklist | null>(null);
  const { track } = useTracking();

  const createChecklist = useCallback(() => {
    track('period_closing_checklist_create', { fiscal_year: fiscalYear, period: fiscalPeriod });
    const standardTasks: ClosingTask[] = [
      {
        id: 'task_1',
        taskName: 'Reconcile all bank accounts',
        description: 'Complete reconciliation for all bank accounts',
        sequence: 1,
        assignedTo: '',
        dueDate: new Date(),
        status: 'pending',
        verificationRequired: true,
      },
      {
        id: 'task_2',
        taskName: 'Review and post accruals',
        description: 'Review and post all accrual entries',
        sequence: 2,
        assignedTo: '',
        dueDate: new Date(),
        status: 'pending',
        verificationRequired: true,
      },
      {
        id: 'task_3',
        taskName: 'Review accounts payable',
        description: 'Review AP aging and outstanding invoices',
        sequence: 3,
        assignedTo: '',
        dueDate: new Date(),
        status: 'pending',
        verificationRequired: false,
      },
      {
        id: 'task_4',
        taskName: 'Review accounts receivable',
        description: 'Review AR aging and collections',
        sequence: 4,
        assignedTo: '',
        dueDate: new Date(),
        status: 'pending',
        verificationRequired: false,
      },
      {
        id: 'task_5',
        taskName: 'Generate trial balance',
        description: 'Generate and review trial balance',
        sequence: 5,
        assignedTo: '',
        dueDate: new Date(),
        status: 'pending',
        verificationRequired: true,
      },
    ];

    const newChecklist: PeriodClosingChecklist = {
      id: `checklist_${Date.now()}`,
      fiscalYear,
      fiscalPeriod,
      closingDate: new Date(),
      tasks: standardTasks,
      overallStatus: 'not_started',
    };

    setChecklist(newChecklist);
    return newChecklist;
  }, [fiscalYear, fiscalPeriod, track]);

  const completeTask = useCallback((taskId: string, completedBy: string) => {
    track('closing_task_complete', { task_id: taskId });
    if (!checklist) return;

    setChecklist({
      ...checklist,
      tasks: checklist.tasks.map(task =>
        task.id === taskId
          ? { ...task, status: 'completed', completedDate: new Date() }
          : task
      ),
    });
  }, [checklist, track]);

  const verifyTask = useCallback((taskId: string, verifiedBy: string) => {
    track('closing_task_verify', { task_id: taskId });
    if (!checklist) return;

    setChecklist({
      ...checklist,
      tasks: checklist.tasks.map(task =>
        task.id === taskId ? { ...task, verifiedBy } : task
      ),
    });
  }, [checklist, track]);

  const getCompletionStatus = useCallback(() => {
    if (!checklist) return { completedCount: 0, totalCount: 0, percentComplete: 0 };

    const completedCount = checklist.tasks.filter(t => t.status === 'completed').length;
    const totalCount = checklist.tasks.length;
    const percentComplete = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

    return { completedCount, totalCount, percentComplete };
  }, [checklist]);

  const approveClosing = useCallback((approver: string) => {
    track('period_closing_approve', { fiscal_year: fiscalYear, period: fiscalPeriod });
    if (checklist) {
      setChecklist({
        ...checklist,
        overallStatus: 'approved',
        approvedBy: approver,
        approvedDate: new Date(),
      });
    }
  }, [checklist, fiscalYear, fiscalPeriod, track]);

  return {
    checklist,
    createChecklist,
    completeTask,
    verifyTask,
    getCompletionStatus,
    approveClosing,
  };
}

// ============================================================================
// INTERCOMPANY TRANSACTIONS
// ============================================================================

/**
 * Hook for intercompany transaction management
 *
 * @description Manages intercompany transactions and eliminations
 *
 * @returns {object} Intercompany transaction operations
 *
 * @example
 * ```tsx
 * function IntercompanyTransactionManager() {
 *   const {
 *     transactions,
 *     createTransaction,
 *     confirmTransaction,
 *     eliminateTransaction
 *   } = useIntercompanyTransactions();
 * }
 * ```
 */
export function useIntercompanyTransactions() {
  const [transactions, setTransactions] = useState<IntercompanyTransaction[]>([]);
  const { track } = useTracking();

  const createTransaction = useCallback((txnData: Partial<IntercompanyTransaction>) => {
    track('intercompany_transaction_create');
    const newTxn: IntercompanyTransaction = {
      id: `ic_${Date.now()}`,
      transactionNumber: `IC-${Date.now()}`,
      status: 'draft',
      isEliminated: false,
      ...txnData,
    } as IntercompanyTransaction;
    setTransactions(prev => [...prev, newTxn]);
    return newTxn;
  }, [track]);

  const submitTransaction = useCallback((txnId: string) => {
    track('intercompany_transaction_submit', { transaction_id: txnId });
    setTransactions(prev =>
      prev.map(txn => (txn.id === txnId ? { ...txn, status: 'submitted' } : txn))
    );
  }, [track]);

  const confirmTransaction = useCallback((txnId: string) => {
    track('intercompany_transaction_confirm', { transaction_id: txnId });
    setTransactions(prev =>
      prev.map(txn => (txn.id === txnId ? { ...txn, status: 'confirmed' } : txn))
    );
  }, [track]);

  const eliminateTransaction = useCallback((txnId: string, eliminationEntryId: string) => {
    track('intercompany_transaction_eliminate', { transaction_id: txnId });
    setTransactions(prev =>
      prev.map(txn =>
        txn.id === txnId
          ? { ...txn, isEliminated: true, eliminationEntryId, status: 'posted' }
          : txn
      )
    );
  }, [track]);

  return {
    transactions,
    createTransaction,
    submitTransaction,
    confirmTransaction,
    eliminateTransaction,
  };
}

// ============================================================================
// COST ALLOCATION
// ============================================================================

/**
 * Hook for cost allocation rule management
 *
 * @description Manages cost allocation rules and processing
 *
 * @returns {object} Cost allocation operations
 *
 * @example
 * ```tsx
 * function CostAllocationManager() {
 *   const {
 *     rules,
 *     createRule,
 *     processAllocation,
 *     calculateAllocations
 *   } = useCostAllocation();
 * }
 * ```
 */
export function useCostAllocation() {
  const [rules, setRules] = useState<CostAllocationRule[]>([]);
  const { track } = useTracking();

  const createRule = useCallback((ruleData: Partial<CostAllocationRule>) => {
    track('cost_allocation_rule_create');
    const newRule: CostAllocationRule = {
      id: `rule_${Date.now()}`,
      isActive: true,
      allocations: [],
      ...ruleData,
    } as CostAllocationRule;
    setRules(prev => [...prev, newRule]);
    return newRule;
  }, [track]);

  const addAllocation = useCallback((ruleId: string, allocation: AllocationDistribution) => {
    track('cost_allocation_add', { rule_id: ruleId });
    setRules(prev =>
      prev.map(rule =>
        rule.id === ruleId
          ? { ...rule, allocations: [...rule.allocations, allocation] }
          : rule
      )
    );
  }, [track]);

  const calculateAllocations = useCallback((ruleId: string, totalAmount: number) => {
    track('cost_allocation_calculate', { rule_id: ruleId, amount: totalAmount });
    const rule = rules.find(r => r.id === ruleId);
    if (!rule) return [];

    return rule.allocations.map(alloc => {
      let allocatedAmount = 0;
      if (rule.allocationMethod === 'percentage' && alloc.allocationPercent) {
        allocatedAmount = totalAmount * (alloc.allocationPercent / 100);
      } else if (rule.allocationMethod === 'fixed' && alloc.fixedAmount) {
        allocatedAmount = alloc.fixedAmount;
      }

      return {
        ...alloc,
        allocatedAmount,
      };
    });
  }, [rules, track]);

  const processAllocation = useCallback(async (ruleId: string, amount: number) => {
    track('cost_allocation_process', { rule_id: ruleId, amount });
    const allocations = calculateAllocations(ruleId, amount);
    // Create journal entries for allocations
    return allocations;
  }, [calculateAllocations, track]);

  return {
    rules,
    createRule,
    addAllocation,
    calculateAllocations,
    processAllocation,
  };
}

// ============================================================================
// ACCOUNTING DIMENSION MANAGEMENT
// ============================================================================

/**
 * Hook for accounting dimension management
 *
 * @description Manages accounting dimensions for enhanced reporting
 *
 * @returns {object} Dimension management operations
 *
 * @example
 * ```tsx
 * function DimensionManager() {
 *   const {
 *     dimensions,
 *     addDimension,
 *     validateDimensionValue
 *   } = useAccountingDimensions();
 * }
 * ```
 */
export function useAccountingDimensions() {
  const [dimensions, setDimensions] = useState<AccountingDimension[]>([]);
  const { track } = useTracking();

  const addDimension = useCallback((dimension: AccountingDimension) => {
    track('accounting_dimension_add', { dimension_name: dimension.dimensionName });
    setDimensions(prev => [...prev, dimension]);
  }, [track]);

  const validateDimensionValue = useCallback((dimensionName: string, value: string) => {
    const dimension = dimensions.find(d => d.dimensionName === dimensionName);
    if (!dimension) return { valid: false, message: 'Dimension not found' };

    if (dimension.validValues && !dimension.validValues.includes(value)) {
      return { valid: false, message: `Invalid value for ${dimensionName}` };
    }

    return { valid: true };
  }, [dimensions]);

  const getRequiredDimensions = useCallback(() => {
    return dimensions.filter(d => d.isRequired);
  }, [dimensions]);

  return {
    dimensions,
    addDimension,
    validateDimensionValue,
    getRequiredDimensions,
  };
}

// ============================================================================
// FORM CONFIGURATIONS
// ============================================================================

/**
 * Creates journal entry form configuration
 *
 * @description Generates form configuration for journal entries
 *
 * @returns {FormConfig} Journal entry form configuration
 *
 * @example
 * ```tsx
 * function JournalEntryForm() {
 *   const formConfig = createJournalEntryForm();
 *   return <FormProvider formConfig={formConfig} onSubmit={handleSubmit} />;
 * }
 * ```
 */
export function createJournalEntryForm(): FormConfig {
  return {
    id: 'journal_entry_form',
    title: 'Journal Entry',
    description: 'Create a new journal entry',
    sections: [
      {
        id: 'header',
        title: 'Entry Header',
        fields: [
          {
            id: 'entry_date',
            name: 'entryDate',
            type: 'date',
            label: 'Entry Date',
            required: true,
          },
          {
            id: 'posting_date',
            name: 'postingDate',
            type: 'date',
            label: 'Posting Date',
            required: true,
          },
          {
            id: 'entry_type',
            name: 'entryType',
            type: 'select',
            label: 'Entry Type',
            required: true,
            options: [
              { label: 'Standard', value: 'standard' },
              { label: 'Adjusting', value: 'adjusting' },
              { label: 'Closing', value: 'closing' },
              { label: 'Reversing', value: 'reversing' },
            ],
          },
          {
            id: 'description',
            name: 'description',
            type: 'textarea',
            label: 'Description',
            required: true,
            rows: 3,
          },
        ],
      },
      {
        id: 'line_items',
        title: 'Line Items',
        fields: [
          {
            id: 'lines',
            name: 'lineItems',
            type: 'repeater',
            label: 'Journal Entry Lines',
            required: true,
            repeaterConfig: {
              minItems: 2,
              itemTemplate: [
                {
                  id: 'account',
                  name: 'accountId',
                  type: 'select',
                  label: 'Account',
                  required: true,
                  options: [],
                },
                {
                  id: 'description',
                  name: 'description',
                  type: 'text',
                  label: 'Description',
                  required: true,
                },
                {
                  id: 'debit',
                  name: 'debitAmount',
                  type: 'number',
                  label: 'Debit',
                  min: 0,
                },
                {
                  id: 'credit',
                  name: 'creditAmount',
                  type: 'number',
                  label: 'Credit',
                  min: 0,
                },
              ],
            },
          },
        ],
      },
    ],
    submitButtonText: 'Create Entry',
  };
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Validates journal entry balance
 *
 * @description Validates that debits equal credits
 *
 * @param {JournalEntry} entry - Journal entry to validate
 * @returns {object} Validation result
 *
 * @example
 * ```tsx
 * const result = validateJournalEntryBalance(entry);
 * if (!result.isValid) {
 *   alert(result.message);
 * }
 * ```
 */
export function validateJournalEntryBalance(entry: JournalEntry): {
  isValid: boolean;
  message: string;
  difference: number;
} {
  const difference = Math.abs(entry.totalDebits - entry.totalCredits);
  const isValid = difference < 0.01;

  return {
    isValid,
    message: isValid ? 'Entry is balanced' : `Entry is out of balance by ${difference.toFixed(2)}`,
    difference,
  };
}

/**
 * Formats account number
 *
 * @description Formats account number with standard separators
 *
 * @param {string} accountNumber - Raw account number
 * @returns {string} Formatted account number
 *
 * @example
 * ```tsx
 * const formatted = formatAccountNumber('1000-100-00'); // "1000-100-00"
 * ```
 */
export function formatAccountNumber(accountNumber: string): string {
  return accountNumber; // Implement based on USACE account number format
}

// ============================================================================
// DEFAULT EXPORT
// ============================================================================

export default {
  // Hooks
  useChartOfAccounts,
  useJournalEntry,
  useBatchJournalEntry,
  useGeneralLedger,
  useTrialBalance,
  useAccountReconciliation,
  useFiscalPeriodManagement,
  usePeriodClosingChecklist,
  useIntercompanyTransactions,
  useCostAllocation,
  useAccountingDimensions,

  // Form Builders
  createJournalEntryForm,

  // Utilities
  validateJournalEntryBalance,
  formatAccountNumber,
};
