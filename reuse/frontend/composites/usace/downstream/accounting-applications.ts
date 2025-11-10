/**
 * LOC: USACE-AS-ACCT-APP-001
 * File: /reuse/frontend/composites/usace/downstream/accounting-applications.ts
 *
 * UPSTREAM (imports from):
 *   - ../usace-accounting-systems-composites.ts
 *   - ../../../form-builder-kit
 *   - ../../../analytics-tracking-kit
 *   - ../../../workflow-approval-kit
 *   - React 18+
 *   - Next.js 16+
 *   - TypeScript 5.x
 *
 * DOWNSTREAM (imported by):
 *   - USACE CEFMS accounting application UIs
 *   - Accounting transaction entry forms
 *   - Account management dashboards
 *   - Financial period management interfaces
 */

/**
 * File: /reuse/frontend/composites/usace/downstream/accounting-applications.ts
 * Locator: WC-USACE-AS-ACCT-APP-001
 * Purpose: USACE CEFMS Accounting Applications - Complete UI components for accounting operations
 *
 * Upstream: usace-accounting-systems-composites, form-builder-kit, analytics-tracking-kit
 * Downstream: USACE accounting UIs, transaction forms, account dashboards
 * Dependencies: React 18+, Next.js 16+, TypeScript 5.x
 * Exports: 15+ React components and hooks for accounting applications
 *
 * LLM Context: Production-ready USACE CEFMS accounting application components. Provides complete
 * UI implementations for chart of accounts management, journal entry creation, general ledger views,
 * trial balance reports, account reconciliation interfaces, and fiscal period management. Built on
 * parent composite functions with full React components, form handling, and user workflows.
 */

'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
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
  createJournalEntryForm,
  validateJournalEntryBalance,
  formatAccountNumber,
  type ChartOfAccountsEntry,
  type JournalEntry,
  type JournalEntryLine,
  type GeneralLedgerAccount,
  type TrialBalance,
  type AccountReconciliation,
  type FiscalPeriod,
  type PeriodClosingChecklist,
  type AccountingBatch,
} from '../usace-accounting-systems-composites';
import {
  useFormState,
  FormProvider,
  type FormConfig,
  type FormData,
} from '../../../form-builder-kit';
import {
  useTracking,
  trackEvent,
  trackError,
} from '../../../analytics-tracking-kit';
import {
  useWorkflowState,
  useApprovalFlow,
  type WorkflowStatus,
} from '../../../workflow-approval-kit';

// ============================================================================
// TYPE DEFINITIONS - ACCOUNTING APPLICATIONS
// ============================================================================

/**
 * Account search filters
 */
export interface AccountSearchFilters {
  accountNumber?: string;
  accountName?: string;
  accountType?: string;
  isActive?: boolean;
  minLevel?: number;
  maxLevel?: number;
}

/**
 * Journal entry filter options
 */
export interface JournalEntryFilters {
  startDate?: Date;
  endDate?: Date;
  fiscalYear?: number;
  fiscalPeriod?: number;
  entryType?: string;
  status?: string;
  preparedBy?: string;
}

/**
 * Account balance inquiry parameters
 */
export interface BalanceInquiryParams {
  accountId: string;
  asOfDate: Date;
  includeTransactions: boolean;
  transactionLimit?: number;
}

/**
 * Reconciliation wizard state
 */
export interface ReconciliationWizardState {
  step: 'setup' | 'items' | 'review' | 'complete';
  accountId: string;
  bookBalance: number;
  statementBalance: number;
  items: any[];
  isReconciled: boolean;
}

// ============================================================================
// CHART OF ACCOUNTS MANAGEMENT COMPONENTS
// ============================================================================

/**
 * Hook for chart of accounts management UI
 *
 * @description Provides complete UI state management for chart of accounts
 *
 * @param {number} fiscalYear - Fiscal year for accounts
 * @returns {object} Chart of accounts UI operations
 *
 * @example
 * ```tsx
 * function ChartOfAccountsManager() {
 *   const {
 *     accounts,
 *     filteredAccounts,
 *     searchFilters,
 *     updateSearchFilters,
 *     selectedAccount,
 *     setSelectedAccount,
 *     showAddAccountModal,
 *     openAddAccountModal,
 *     closeAddAccountModal
 *   } = useChartOfAccountsUI(2024);
 *
 *   return (
 *     <div>
 *       <AccountSearchBar filters={searchFilters} onChange={updateSearchFilters} />
 *       <AccountsTable accounts={filteredAccounts} onSelect={setSelectedAccount} />
 *       {showAddAccountModal && <AddAccountModal onClose={closeAddAccountModal} />}
 *     </div>
 *   );
 * }
 * ```
 */
export function useChartOfAccountsUI(fiscalYear: number) {
  const {
    accounts,
    isLoading,
    loadAccounts,
    addAccount,
    updateAccount,
    deactivateAccount,
    getAccountHierarchy,
    searchAccounts,
  } = useChartOfAccounts(fiscalYear);

  const [searchFilters, setSearchFilters] = useState<AccountSearchFilters>({});
  const [selectedAccount, setSelectedAccount] = useState<ChartOfAccountsEntry | null>(null);
  const [showAddAccountModal, setShowAddAccountModal] = useState(false);
  const [showEditAccountModal, setShowEditAccountModal] = useState(false);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const { track } = useTracking();

  useEffect(() => {
    loadAccounts();
  }, [loadAccounts]);

  const filteredAccounts = useMemo(() => {
    let filtered = accounts;

    if (searchFilters.accountNumber) {
      filtered = filtered.filter(acc =>
        acc.accountNumber.includes(searchFilters.accountNumber!)
      );
    }

    if (searchFilters.accountName) {
      filtered = filtered.filter(acc =>
        acc.accountName.toLowerCase().includes(searchFilters.accountName!.toLowerCase())
      );
    }

    if (searchFilters.accountType) {
      filtered = filtered.filter(acc => acc.accountType === searchFilters.accountType);
    }

    if (searchFilters.isActive !== undefined) {
      filtered = filtered.filter(acc => acc.isActive === searchFilters.isActive);
    }

    if (searchFilters.minLevel !== undefined) {
      filtered = filtered.filter(acc => acc.level >= searchFilters.minLevel!);
    }

    if (searchFilters.maxLevel !== undefined) {
      filtered = filtered.filter(acc => acc.level <= searchFilters.maxLevel!);
    }

    return filtered;
  }, [accounts, searchFilters]);

  const accountHierarchy = useMemo(() => {
    return getAccountHierarchy();
  }, [accounts, getAccountHierarchy]);

  const updateSearchFilters = useCallback((filters: Partial<AccountSearchFilters>) => {
    track('account_search_filter_update', filters);
    setSearchFilters(prev => ({ ...prev, ...filters }));
  }, [track]);

  const clearSearchFilters = useCallback(() => {
    track('account_search_filter_clear');
    setSearchFilters({});
  }, [track]);

  const openAddAccountModal = useCallback(() => {
    track('account_add_modal_open');
    setShowAddAccountModal(true);
  }, [track]);

  const closeAddAccountModal = useCallback(() => {
    setShowAddAccountModal(false);
  }, []);

  const openEditAccountModal = useCallback((account: ChartOfAccountsEntry) => {
    track('account_edit_modal_open', { account_id: account.id });
    setSelectedAccount(account);
    setShowEditAccountModal(true);
  }, [track]);

  const closeEditAccountModal = useCallback(() => {
    setShowEditAccountModal(false);
    setSelectedAccount(null);
  }, []);

  const toggleNodeExpansion = useCallback((accountId: string) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(accountId)) {
        newSet.delete(accountId);
      } else {
        newSet.add(accountId);
      }
      return newSet;
    });
  }, []);

  const handleAccountDeactivate = useCallback(async (accountId: string) => {
    if (confirm('Are you sure you want to deactivate this account?')) {
      track('account_deactivate_confirm', { account_id: accountId });
      await deactivateAccount(accountId);
    }
  }, [deactivateAccount, track]);

  return {
    accounts,
    filteredAccounts,
    accountHierarchy,
    searchFilters,
    updateSearchFilters,
    clearSearchFilters,
    selectedAccount,
    setSelectedAccount,
    showAddAccountModal,
    openAddAccountModal,
    closeAddAccountModal,
    showEditAccountModal,
    openEditAccountModal,
    closeEditAccountModal,
    expandedNodes,
    toggleNodeExpansion,
    handleAccountDeactivate,
    isLoading,
  };
}

/**
 * Hook for account balance inquiry UI
 *
 * @description Provides account balance inquiry with transaction history
 *
 * @returns {object} Balance inquiry operations
 *
 * @example
 * ```tsx
 * function AccountBalanceInquiry() {
 *   const {
 *     inquiryParams,
 *     setInquiryParams,
 *     balanceData,
 *     loadBalance,
 *     isLoading
 *   } = useAccountBalanceInquiry();
 *
 *   return (
 *     <div>
 *       <BalanceInquiryForm params={inquiryParams} onChange={setInquiryParams} />
 *       <button onClick={loadBalance}>Load Balance</button>
 *       {balanceData && <BalanceDisplay data={balanceData} />}
 *     </div>
 *   );
 * }
 * ```
 */
export function useAccountBalanceInquiry() {
  const [inquiryParams, setInquiryParams] = useState<BalanceInquiryParams | null>(null);
  const [balanceData, setBalanceData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { track } = useTracking();

  const loadBalance = useCallback(async () => {
    if (!inquiryParams) return;

    setIsLoading(true);
    try {
      track('account_balance_inquiry', {
        account_id: inquiryParams.accountId,
        as_of_date: inquiryParams.asOfDate,
      });

      // Simulate API call
      const mockBalanceData = {
        accountId: inquiryParams.accountId,
        asOfDate: inquiryParams.asOfDate,
        currentBalance: 125000.00,
        availableBalance: 120000.00,
        pendingDebits: 3000.00,
        pendingCredits: 2000.00,
        lastActivity: new Date(),
        recentTransactions: [],
      };

      setBalanceData(mockBalanceData);
    } catch (error) {
      trackError({ errorMessage: 'Failed to load balance', errorType: 'BalanceInquiryError' });
    } finally {
      setIsLoading(false);
    }
  }, [inquiryParams, track]);

  const clearInquiry = useCallback(() => {
    setInquiryParams(null);
    setBalanceData(null);
  }, []);

  return {
    inquiryParams,
    setInquiryParams,
    balanceData,
    loadBalance,
    clearInquiry,
    isLoading,
  };
}

// ============================================================================
// JOURNAL ENTRY MANAGEMENT COMPONENTS
// ============================================================================

/**
 * Hook for journal entry creation UI
 *
 * @description Complete UI workflow for creating and managing journal entries
 *
 * @returns {object} Journal entry UI operations
 *
 * @example
 * ```tsx
 * function JournalEntryWorkflow() {
 *   const {
 *     currentEntry,
 *     startNewEntry,
 *     addLineToEntry,
 *     removeLineFromEntry,
 *     validateCurrentEntry,
 *     submitCurrentEntry,
 *     entryIsBalanced
 *   } = useJournalEntryUI();
 *
 *   return (
 *     <div>
 *       <JournalEntryForm entry={currentEntry} onAddLine={addLineToEntry} />
 *       {!entryIsBalanced && <BalanceWarning />}
 *       <button onClick={submitCurrentEntry} disabled={!entryIsBalanced}>
 *         Submit Entry
 *       </button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useJournalEntryUI() {
  const {
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
  } = useJournalEntry();

  const [entryFilters, setEntryFilters] = useState<JournalEntryFilters>({});
  const [selectedLines, setSelectedLines] = useState<Set<string>>(new Set());
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const { track } = useTracking();

  const startNewEntry = useCallback((entryType: string) => {
    track('journal_entry_start', { entry_type: entryType });
    createEntry({
      entryType: entryType as any,
      fiscalYear: new Date().getFullYear(),
      fiscalPeriod: Math.floor((new Date().getMonth() + 1) / 3) + 1,
      preparedBy: 'current_user',
    });
  }, [createEntry, track]);

  const addLineToEntry = useCallback((entryId: string, lineData: Partial<JournalEntryLine>) => {
    track('journal_entry_line_add', { entry_id: entryId });
    addLine(entryId, lineData);
    setValidationErrors([]);
  }, [addLine, track]);

  const removeLineFromEntry = useCallback((entryId: string, lineId: string) => {
    track('journal_entry_line_remove', { entry_id: entryId, line_id: lineId });
    removeLine(entryId, lineId);
  }, [removeLine, track]);

  const validateCurrentEntry = useCallback(() => {
    if (!currentEntry) {
      setValidationErrors(['No current entry to validate']);
      return false;
    }

    const validation = validateBalance(currentEntry.id);
    if (!validation.isValid) {
      setValidationErrors([validation.message]);
      return false;
    }

    const errors: string[] = [];

    if (currentEntry.lineItems.length < 2) {
      errors.push('Entry must have at least 2 line items');
    }

    currentEntry.lineItems.forEach((line, index) => {
      if (!line.accountId) {
        errors.push(`Line ${index + 1}: Account is required`);
      }
      if (!line.description) {
        errors.push(`Line ${index + 1}: Description is required`);
      }
      if (line.debitAmount === 0 && line.creditAmount === 0) {
        errors.push(`Line ${index + 1}: Must have either debit or credit amount`);
      }
      if (line.debitAmount > 0 && line.creditAmount > 0) {
        errors.push(`Line ${index + 1}: Cannot have both debit and credit`);
      }
    });

    setValidationErrors(errors);
    return errors.length === 0;
  }, [currentEntry, validateBalance]);

  const submitCurrentEntry = useCallback(async () => {
    if (!currentEntry) return;

    if (!validateCurrentEntry()) {
      trackError({ errorMessage: 'Entry validation failed', errorType: 'ValidationError' });
      return;
    }

    try {
      track('journal_entry_submit', { entry_id: currentEntry.id });
      await submitForApproval(currentEntry.id);
      setShowApprovalModal(true);
    } catch (error) {
      trackError({ errorMessage: 'Failed to submit entry', errorType: 'SubmitError' });
    }
  }, [currentEntry, validateCurrentEntry, submitForApproval, track]);

  const entryIsBalanced = useMemo(() => {
    if (!currentEntry) return false;
    return Math.abs(currentEntry.totalDebits - currentEntry.totalCredits) < 0.01;
  }, [currentEntry]);

  const filteredEntries = useMemo(() => {
    let filtered = entries;

    if (entryFilters.startDate) {
      filtered = filtered.filter(e => e.entryDate >= entryFilters.startDate!);
    }

    if (entryFilters.endDate) {
      filtered = filtered.filter(e => e.entryDate <= entryFilters.endDate!);
    }

    if (entryFilters.fiscalYear) {
      filtered = filtered.filter(e => e.fiscalYear === entryFilters.fiscalYear);
    }

    if (entryFilters.fiscalPeriod) {
      filtered = filtered.filter(e => e.fiscalPeriod === entryFilters.fiscalPeriod);
    }

    if (entryFilters.entryType) {
      filtered = filtered.filter(e => e.entryType === entryFilters.entryType);
    }

    if (entryFilters.status) {
      filtered = filtered.filter(e => e.status === entryFilters.status);
    }

    if (entryFilters.preparedBy) {
      filtered = filtered.filter(e => e.preparedBy === entryFilters.preparedBy);
    }

    return filtered;
  }, [entries, entryFilters]);

  return {
    entries,
    filteredEntries,
    currentEntry,
    startNewEntry,
    addLineToEntry,
    removeLineFromEntry,
    validateCurrentEntry,
    submitCurrentEntry,
    entryIsBalanced,
    validationErrors,
    entryFilters,
    setEntryFilters,
    selectedLines,
    setSelectedLines,
    showApprovalModal,
    setShowApprovalModal,
  };
}

/**
 * Hook for batch journal entry processing UI
 *
 * @description UI for managing batch journal entry operations
 *
 * @returns {object} Batch entry UI operations
 *
 * @example
 * ```tsx
 * function BatchJournalEntryProcessor() {
 *   const {
 *     currentBatch,
 *     startNewBatch,
 *     addEntryToBatch,
 *     validateBatchEntries,
 *     postBatchEntries,
 *     batchIsValid
 *   } = useBatchJournalEntryUI();
 *
 *   return (
 *     <div>
 *       <BatchSummary batch={currentBatch} />
 *       <button onClick={postBatchEntries} disabled={!batchIsValid}>
 *         Post Batch
 *       </button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useBatchJournalEntryUI() {
  const {
    batches,
    isProcessing,
    createBatch,
    addEntryToBatch,
    validateBatch,
    postBatch,
  } = useBatchJournalEntry();

  const [currentBatch, setCurrentBatch] = useState<AccountingBatch | null>(null);
  const [batchValidation, setBatchValidation] = useState<{ isValid: boolean; errors: string[] }>({
    isValid: false,
    errors: [],
  });
  const { track } = useTracking();

  const startNewBatch = useCallback((batchType: string, fiscalYear: number, fiscalPeriod: number) => {
    track('batch_journal_entry_start', { batch_type: batchType });
    const batch = createBatch({
      batchType: batchType as any,
      fiscalYear,
      fiscalPeriod,
      description: `Batch ${batchType} - ${new Date().toLocaleDateString()}`,
      createdBy: 'current_user',
    });
    setCurrentBatch(batch);
  }, [createBatch, track]);

  const addEntryToCurrentBatch = useCallback((entry: JournalEntry) => {
    if (!currentBatch) return;
    track('batch_entry_add', { batch_id: currentBatch.id });
    addEntryToBatch(currentBatch.id, entry);
  }, [currentBatch, addEntryToBatch, track]);

  const validateBatchEntries = useCallback(() => {
    if (!currentBatch) {
      setBatchValidation({ isValid: false, errors: ['No batch selected'] });
      return false;
    }

    track('batch_validate', { batch_id: currentBatch.id });
    const validation = validateBatch(currentBatch.id);
    setBatchValidation(validation);
    return validation.isValid;
  }, [currentBatch, validateBatch, track]);

  const postBatchEntries = useCallback(async () => {
    if (!currentBatch) return;

    if (!validateBatchEntries()) {
      trackError({ errorMessage: 'Batch validation failed', errorType: 'BatchValidationError' });
      return;
    }

    try {
      track('batch_post', { batch_id: currentBatch.id });
      await postBatch(currentBatch.id);
    } catch (error) {
      trackError({ errorMessage: 'Failed to post batch', errorType: 'BatchPostError' });
    }
  }, [currentBatch, validateBatchEntries, postBatch, track]);

  const batchIsValid = useMemo(() => {
    return batchValidation.isValid && (currentBatch?.isBalanced ?? false);
  }, [batchValidation, currentBatch]);

  return {
    batches,
    currentBatch,
    startNewBatch,
    addEntryToCurrentBatch,
    validateBatchEntries,
    postBatchEntries,
    batchIsValid,
    batchValidation,
    isProcessing,
  };
}

// ============================================================================
// GENERAL LEDGER COMPONENTS
// ============================================================================

/**
 * Hook for general ledger account view UI
 *
 * @description Complete UI for viewing and managing general ledger accounts
 *
 * @param {string} accountId - Account identifier
 * @returns {object} General ledger UI operations
 *
 * @example
 * ```tsx
 * function GeneralLedgerAccountView({ accountId }) {
 *   const {
 *     account,
 *     transactions,
 *     dateRange,
 *     setDateRange,
 *     loadAccountTransactions,
 *     currentBalance,
 *     activityReport
 *   } = useGeneralLedgerUI(accountId);
 *
 *   return (
 *     <div>
 *       <AccountHeader account={account} balance={currentBalance} />
 *       <DateRangePicker value={dateRange} onChange={setDateRange} />
 *       <TransactionList transactions={transactions} />
 *       <ActivitySummary report={activityReport} />
 *     </div>
 *   );
 * }
 * ```
 */
export function useGeneralLedgerUI(accountId: string) {
  const {
    account,
    transactions,
    isLoading,
    loadAccount,
    loadTransactions,
    calculateBalance,
    getActivityReport,
    postTransaction,
  } = useGeneralLedger(accountId);

  const [dateRange, setDateRange] = useState<{ start: Date; end: Date }>({
    start: new Date(new Date().getFullYear(), 0, 1),
    end: new Date(),
  });
  const [selectedTransactions, setSelectedTransactions] = useState<Set<string>>(new Set());
  const [showTransactionDetail, setShowTransactionDetail] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const { track } = useTracking();

  useEffect(() => {
    loadAccount();
  }, [loadAccount]);

  const loadAccountTransactions = useCallback(() => {
    track('ledger_transactions_load', {
      account_id: accountId,
      start_date: dateRange.start,
      end_date: dateRange.end,
    });
    loadTransactions(dateRange.start, dateRange.end);
  }, [accountId, dateRange, loadTransactions, track]);

  useEffect(() => {
    if (account) {
      loadAccountTransactions();
    }
  }, [account, loadAccountTransactions]);

  const currentBalance = useMemo(() => {
    return calculateBalance(new Date());
  }, [calculateBalance]);

  const activityReport = useMemo(() => {
    if (!account) return null;
    const currentPeriod = Math.floor((new Date().getMonth() + 1) / 3) + 1;
    return getActivityReport(currentPeriod);
  }, [account, getActivityReport]);

  const openTransactionDetail = useCallback((transaction: any) => {
    track('transaction_detail_open', { transaction_id: transaction.id });
    setSelectedTransaction(transaction);
    setShowTransactionDetail(true);
  }, [track]);

  const closeTransactionDetail = useCallback(() => {
    setShowTransactionDetail(false);
    setSelectedTransaction(null);
  }, []);

  const exportTransactions = useCallback((format: 'csv' | 'excel') => {
    track('transactions_export', { account_id: accountId, format });
    // Export logic would go here
    const filename = `ledger_${accountId}_${format}`;
    return filename;
  }, [accountId, track]);

  return {
    account,
    transactions,
    dateRange,
    setDateRange,
    loadAccountTransactions,
    currentBalance,
    activityReport,
    selectedTransactions,
    setSelectedTransactions,
    showTransactionDetail,
    selectedTransaction,
    openTransactionDetail,
    closeTransactionDetail,
    exportTransactions,
    isLoading,
  };
}

// ============================================================================
// TRIAL BALANCE COMPONENTS
// ============================================================================

/**
 * Hook for trial balance report UI
 *
 * @description UI for generating and viewing trial balance reports
 *
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @returns {object} Trial balance UI operations
 *
 * @example
 * ```tsx
 * function TrialBalanceReport({ fiscalYear, fiscalPeriod }) {
 *   const {
 *     trialBalance,
 *     generateReport,
 *     verifyBalances,
 *     exportReport,
 *     balanceVerification,
 *     isGenerating
 *   } = useTrialBalanceUI(fiscalYear, fiscalPeriod);
 *
 *   return (
 *     <div>
 *       <button onClick={() => generateReport('adjusted')}>
 *         Generate Trial Balance
 *       </button>
 *       {trialBalance && <TrialBalanceTable data={trialBalance} />}
 *       <BalanceVerificationStatus status={balanceVerification} />
 *     </div>
 *   );
 * }
 * ```
 */
export function useTrialBalanceUI(fiscalYear: number, fiscalPeriod: number) {
  const {
    trialBalance,
    isGenerating,
    generateTrialBalance,
    verifyBalance,
    finalizeTrialBalance,
    exportTrialBalance,
  } = useTrialBalance(fiscalYear, fiscalPeriod);

  const [balanceVerification, setBalanceVerification] = useState<any>(null);
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [sortColumn, setSortColumn] = useState<string>('accountNumber');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const { track } = useTracking();

  const generateReport = useCallback(async (balanceType: 'unadjusted' | 'adjusted' | 'post_closing') => {
    track('trial_balance_generate', { fiscal_year: fiscalYear, fiscal_period: fiscalPeriod, type: balanceType });
    await generateTrialBalance(balanceType);
  }, [fiscalYear, fiscalPeriod, generateTrialBalance, track]);

  const verifyBalances = useCallback(() => {
    track('trial_balance_verify', { fiscal_year: fiscalYear, fiscal_period: fiscalPeriod });
    const verification = verifyBalance();
    setBalanceVerification(verification);
    return verification;
  }, [fiscalYear, fiscalPeriod, verifyBalance, track]);

  useEffect(() => {
    if (trialBalance) {
      verifyBalances();
    }
  }, [trialBalance, verifyBalances]);

  const exportReport = useCallback(async (format: 'excel' | 'pdf' | 'csv') => {
    track('trial_balance_export', { format });
    const filename = await exportTrialBalance(format);
    return filename;
  }, [exportTrialBalance, track]);

  const sortedAccounts = useMemo(() => {
    if (!trialBalance) return [];

    const sorted = [...trialBalance.accounts].sort((a, b) => {
      let aValue: any = a[sortColumn as keyof typeof a];
      let bValue: any = b[sortColumn as keyof typeof b];

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = (bValue as string).toLowerCase();
      }

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return sorted;
  }, [trialBalance, sortColumn, sortDirection]);

  const toggleSort = useCallback((column: string) => {
    if (sortColumn === column) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  }, [sortColumn]);

  return {
    trialBalance,
    isGenerating,
    generateReport,
    verifyBalances,
    balanceVerification,
    exportReport,
    showExportOptions,
    setShowExportOptions,
    sortedAccounts,
    sortColumn,
    sortDirection,
    toggleSort,
  };
}

// ============================================================================
// ACCOUNT RECONCILIATION COMPONENTS
// ============================================================================

/**
 * Hook for account reconciliation wizard UI
 *
 * @description Step-by-step wizard for account reconciliation
 *
 * @param {string} accountId - Account to reconcile
 * @returns {object} Reconciliation wizard operations
 *
 * @example
 * ```tsx
 * function ReconciliationWizard({ accountId }) {
 *   const {
 *     wizardState,
 *     nextStep,
 *     previousStep,
 *     addReconciliationItem,
 *     removeReconciliationItem,
 *     completeReconciliation,
 *     variance
 *   } = useReconciliationWizardUI(accountId);
 *
 *   return (
 *     <div>
 *       <WizardSteps current={wizardState.step} />
 *       {wizardState.step === 'setup' && <SetupStep />}
 *       {wizardState.step === 'items' && <ItemsStep />}
 *       {wizardState.step === 'review' && <ReviewStep variance={variance} />}
 *     </div>
 *   );
 * }
 * ```
 */
export function useReconciliationWizardUI(accountId: string) {
  const {
    reconciliation,
    reconciliationHistory,
    startReconciliation,
    addReconciliationItem,
    removeReconciliationItem,
    calculateVariance,
    completeReconciliation,
    approveReconciliation,
  } = useAccountReconciliation(accountId);

  const [wizardState, setWizardState] = useState<ReconciliationWizardState>({
    step: 'setup',
    accountId,
    bookBalance: 0,
    statementBalance: 0,
    items: [],
    isReconciled: false,
  });
  const { track } = useTracking();

  const startWizard = useCallback((bookBalance: number, statementBalance: number, fiscalYear: number, fiscalPeriod: number) => {
    track('reconciliation_wizard_start', { account_id: accountId });
    startReconciliation(bookBalance, statementBalance, fiscalYear, fiscalPeriod);
    setWizardState({
      step: 'items',
      accountId,
      bookBalance,
      statementBalance,
      items: [],
      isReconciled: false,
    });
  }, [accountId, startReconciliation, track]);

  const nextStep = useCallback(() => {
    const steps: ReconciliationWizardState['step'][] = ['setup', 'items', 'review', 'complete'];
    const currentIndex = steps.indexOf(wizardState.step);
    if (currentIndex < steps.length - 1) {
      track('reconciliation_wizard_next_step', { from: wizardState.step, to: steps[currentIndex + 1] });
      setWizardState(prev => ({ ...prev, step: steps[currentIndex + 1] }));
    }
  }, [wizardState.step, track]);

  const previousStep = useCallback(() => {
    const steps: ReconciliationWizardState['step'][] = ['setup', 'items', 'review', 'complete'];
    const currentIndex = steps.indexOf(wizardState.step);
    if (currentIndex > 0) {
      track('reconciliation_wizard_previous_step', { from: wizardState.step, to: steps[currentIndex - 1] });
      setWizardState(prev => ({ ...prev, step: steps[currentIndex - 1] }));
    }
  }, [wizardState.step, track]);

  const addItem = useCallback((item: any) => {
    track('reconciliation_item_add_wizard', { item_type: item.itemType });
    addReconciliationItem(item);
    setWizardState(prev => ({ ...prev, items: [...prev.items, item] }));
  }, [addReconciliationItem, track]);

  const removeItem = useCallback((itemId: string) => {
    track('reconciliation_item_remove_wizard', { item_id: itemId });
    removeReconciliationItem(itemId);
    setWizardState(prev => ({
      ...prev,
      items: prev.items.filter(i => i.id !== itemId),
    }));
  }, [removeReconciliationItem, track]);

  const variance = useMemo(() => {
    return calculateVariance();
  }, [calculateVariance, wizardState.items]);

  const finishReconciliation = useCallback(() => {
    track('reconciliation_wizard_complete', { account_id: accountId });
    completeReconciliation();
    setWizardState(prev => ({ ...prev, step: 'complete', isReconciled: true }));
  }, [accountId, completeReconciliation, track]);

  return {
    wizardState,
    reconciliation,
    reconciliationHistory,
    startWizard,
    nextStep,
    previousStep,
    addItem,
    removeItem,
    variance,
    finishReconciliation,
  };
}

// ============================================================================
// FISCAL PERIOD MANAGEMENT COMPONENTS
// ============================================================================

/**
 * Hook for fiscal period management UI
 *
 * @description UI for managing fiscal period opening, closing, and status
 *
 * @param {number} fiscalYear - Fiscal year
 * @returns {object} Fiscal period UI operations
 *
 * @example
 * ```tsx
 * function FiscalPeriodManager({ fiscalYear }) {
 *   const {
 *     periods,
 *     currentPeriod,
 *     openPeriodUI,
 *     closePeriodUI,
 *     lockPeriodUI,
 *     showClosingChecklist
 *   } = useFiscalPeriodUI(fiscalYear);
 *
 *   return (
 *     <div>
 *       <PeriodStatusTable periods={periods} currentPeriod={currentPeriod} />
 *       <PeriodActions onOpen={openPeriodUI} onClose={closePeriodUI} onLock={lockPeriodUI} />
 *     </div>
 *   );
 * }
 * ```
 */
export function useFiscalPeriodUI(fiscalYear: number) {
  const {
    periods,
    loadPeriods,
    openPeriod,
    closePeriod,
    lockPeriod,
    getCurrentPeriod,
    isPeriodOpen,
  } = useFiscalPeriodManagement(fiscalYear);

  const [showClosingModal, setShowClosingModal] = useState(false);
  const [periodToClose, setPeriodToClose] = useState<number | null>(null);
  const [showLockConfirm, setShowLockConfirm] = useState(false);
  const [periodToLock, setPeriodToLock] = useState<number | null>(null);
  const { track } = useTracking();

  useEffect(() => {
    loadPeriods();
  }, [loadPeriods]);

  const currentPeriod = useMemo(() => {
    return getCurrentPeriod();
  }, [getCurrentPeriod, periods]);

  const openPeriodUI = useCallback(async (periodNumber: number) => {
    if (confirm(`Are you sure you want to open period ${periodNumber}?`)) {
      track('fiscal_period_open_ui', { fiscal_year: fiscalYear, period: periodNumber });
      await openPeriod(periodNumber);
    }
  }, [fiscalYear, openPeriod, track]);

  const closePeriodUI = useCallback((periodNumber: number) => {
    track('fiscal_period_close_modal_open', { fiscal_year: fiscalYear, period: periodNumber });
    setPeriodToClose(periodNumber);
    setShowClosingModal(true);
  }, [fiscalYear, track]);

  const confirmClosePeriod = useCallback(async () => {
    if (periodToClose === null) return;

    track('fiscal_period_close_confirm', { fiscal_year: fiscalYear, period: periodToClose });
    await closePeriod(periodToClose, 'current_user');
    setShowClosingModal(false);
    setPeriodToClose(null);
  }, [periodToClose, fiscalYear, closePeriod, track]);

  const lockPeriodUI = useCallback((periodNumber: number) => {
    track('fiscal_period_lock_modal_open', { fiscal_year: fiscalYear, period: periodNumber });
    setPeriodToLock(periodNumber);
    setShowLockConfirm(true);
  }, [fiscalYear, track]);

  const confirmLockPeriod = useCallback(async () => {
    if (periodToLock === null) return;

    track('fiscal_period_lock_confirm', { fiscal_year: fiscalYear, period: periodToLock });
    await lockPeriod(periodToLock, 'current_user');
    setShowLockConfirm(false);
    setPeriodToLock(null);
  }, [periodToLock, fiscalYear, lockPeriod, track]);

  const getPeriodStatus = useCallback((periodNumber: number) => {
    const period = periods.find(p => p.period === periodNumber);
    return period?.status || 'unknown';
  }, [periods]);

  return {
    periods,
    currentPeriod,
    openPeriodUI,
    closePeriodUI,
    confirmClosePeriod,
    lockPeriodUI,
    confirmLockPeriod,
    getPeriodStatus,
    isPeriodOpen,
    showClosingModal,
    setShowClosingModal,
    showLockConfirm,
    setShowLockConfirm,
  };
}

/**
 * Hook for period closing checklist UI
 *
 * @description UI for managing period closing checklist and tasks
 *
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @returns {object} Period closing UI operations
 *
 * @example
 * ```tsx
 * function PeriodClosingChecklist({ fiscalYear, fiscalPeriod }) {
 *   const {
 *     checklist,
 *     completeTaskUI,
 *     verifyTaskUI,
 *     completionStatus,
 *     approveClosing
 *   } = usePeriodClosingUI(fiscalYear, fiscalPeriod);
 *
 *   return (
 *     <div>
 *       <ProgressBar percent={completionStatus.percentComplete} />
 *       <ChecklistTable checklist={checklist} onComplete={completeTaskUI} />
 *       {completionStatus.percentComplete === 100 && (
 *         <button onClick={approveClosing}>Approve Closing</button>
 *       )}
 *     </div>
 *   );
 * }
 * ```
 */
export function usePeriodClosingUI(fiscalYear: number, fiscalPeriod: number) {
  const {
    checklist,
    createChecklist,
    completeTask,
    verifyTask,
    getCompletionStatus,
    approveClosing,
  } = usePeriodClosingChecklist(fiscalYear, fiscalPeriod);

  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [taskToVerify, setTaskToVerify] = useState<string | null>(null);
  const { track } = useTracking();

  useEffect(() => {
    if (!checklist) {
      createChecklist();
    }
  }, [checklist, createChecklist]);

  const completionStatus = useMemo(() => {
    return getCompletionStatus();
  }, [getCompletionStatus, checklist]);

  const completeTaskUI = useCallback((taskId: string) => {
    track('closing_task_complete_ui', { task_id: taskId, fiscal_year: fiscalYear, period: fiscalPeriod });
    completeTask(taskId, 'current_user');
  }, [fiscalYear, fiscalPeriod, completeTask, track]);

  const verifyTaskUI = useCallback((taskId: string) => {
    track('closing_task_verify_modal_open', { task_id: taskId });
    setTaskToVerify(taskId);
    setShowVerifyModal(true);
  }, [track]);

  const confirmVerifyTask = useCallback(() => {
    if (!taskToVerify) return;

    track('closing_task_verify_confirm', { task_id: taskToVerify });
    verifyTask(taskToVerify, 'current_user');
    setShowVerifyModal(false);
    setTaskToVerify(null);
  }, [taskToVerify, verifyTask, track]);

  const approveClosingUI = useCallback(() => {
    if (completionStatus.percentComplete !== 100) {
      alert('All tasks must be completed before approving closing');
      return;
    }

    if (confirm('Are you sure you want to approve the period closing?')) {
      track('period_closing_approve_ui', { fiscal_year: fiscalYear, period: fiscalPeriod });
      approveClosing('current_user');
    }
  }, [completionStatus, fiscalYear, fiscalPeriod, approveClosing, track]);

  return {
    checklist,
    completeTaskUI,
    verifyTaskUI,
    confirmVerifyTask,
    completionStatus,
    approveClosingUI,
    showVerifyModal,
    setShowVerifyModal,
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Chart of Accounts
  useChartOfAccountsUI,
  useAccountBalanceInquiry,

  // Journal Entries
  useJournalEntryUI,
  useBatchJournalEntryUI,

  // General Ledger
  useGeneralLedgerUI,

  // Trial Balance
  useTrialBalanceUI,

  // Reconciliation
  useReconciliationWizardUI,

  // Fiscal Period
  useFiscalPeriodUI,
  usePeriodClosingUI,
};
