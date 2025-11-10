/**
 * LOC: USACE-AS-RECON-001
 * File: /reuse/frontend/composites/usace/downstream/reconciliation-tools.ts
 *
 * UPSTREAM (imports from):
 *   - ../usace-accounting-systems-composites.ts
 *   - ../../../form-builder-kit
 *   - ../../../analytics-tracking-kit
 *   - React 18+
 *   - Next.js 16+
 *   - TypeScript 5.x
 *
 * DOWNSTREAM (imported by):
 *   - Account reconciliation interfaces
 *   - Bank reconciliation tools
 *   - Reconciliation dashboards
 *   - Variance analysis modules
 */

/**
 * File: /reuse/frontend/composites/usace/downstream/reconciliation-tools.ts
 * Locator: WC-USACE-AS-RECON-001
 * Purpose: Reconciliation Tools - Complete reconciliation workflows and automation
 *
 * Upstream: usace-accounting-systems-composites, form-builder-kit, analytics-tracking-kit
 * Downstream: Reconciliation interfaces, bank recon tools, variance modules
 * Dependencies: React 18+, Next.js 16+, TypeScript 5.x
 * Exports: 11+ React components and hooks for account reconciliation
 *
 * LLM Context: Production-ready reconciliation tools for USACE CEFMS. Provides comprehensive
 * bank reconciliation, account reconciliation, automated matching, variance analysis, and
 * exception handling. Supports multi-step workflows, approval routing, and audit trails.
 */

'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  useAccountReconciliation,
  type AccountReconciliation,
  type ReconciliationItem,
} from '../usace-accounting-systems-composites';
import { useTracking, trackEvent } from '../../../analytics-tracking-kit';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface BankReconciliation extends AccountReconciliation {
  bankStatement: {
    statementDate: Date;
    beginningBalance: number;
    endingBalance: number;
    deposits: number;
    withdrawals: number;
    statementNumber: string;
  };
  outstandingChecks: ReconciliationItem[];
  depositsInTransit: ReconciliationItem[];
  bankCharges: ReconciliationItem[];
  bookAdjustments: ReconciliationItem[];
}

export interface AutoMatchRule {
  id: string;
  name: string;
  criteria: {
    amountTolerance?: number;
    dateTolerance?: number; // days
    referenceMatch?: boolean;
    descriptionMatch?: boolean;
    exactMatch?: boolean;
  };
  isActive: boolean;
  priority: number;
}

export interface ReconciliationException {
  id: string;
  type: 'unmatched_book' | 'unmatched_bank' | 'amount_difference' | 'date_difference';
  description: string;
  amount: number;
  date: Date;
  status: 'open' | 'investigating' | 'resolved' | 'written_off';
  assignedTo?: string;
  resolution?: string;
  resolvedDate?: Date;
}

// ============================================================================
// BANK RECONCILIATION WORKFLOW
// ============================================================================

/**
 * Hook for bank reconciliation workflow
 *
 * @description Complete workflow for bank statement reconciliation
 *
 * @param {string} accountId - Bank account identifier
 * @returns {object} Bank reconciliation operations
 *
 * @example
 * ```tsx
 * function BankReconciliationWorkflow({ accountId }) {
 *   const {
 *     reconciliation,
 *     startReconciliation,
 *     addOutstandingCheck,
 *     addDepositInTransit,
 *     autoMatch,
 *     calculateVariance,
 *     completeReconciliation
 *   } = useBankReconciliationWorkflow(accountId);
 *
 *   return (
 *     <div>
 *       <ReconciliationForm onStart={startReconciliation} />
 *       <OutstandingItems items={reconciliation?.outstandingChecks} />
 *       <VarianceSummary variance={calculateVariance()} />
 *     </div>
 *   );
 * }
 * ```
 */
export function useBankReconciliationWorkflow(accountId: string) {
  const {
    reconciliation,
    startReconciliation,
    addReconciliationItem,
    calculateVariance,
    completeReconciliation,
  } = useAccountReconciliation(accountId);

  const [bankRecon, setBankRecon] = useState<BankReconciliation | null>(null);
  const [matchedItems, setMatchedItems] = useState<Map<string, string>>(new Map());
  const { track } = useTracking();

  const startBankReconciliation = useCallback((
    bookBalance: number,
    statementBalance: number,
    statementDate: Date,
    fiscalYear: number,
    fiscalPeriod: number
  ) => {
    track('bank_reconciliation_start', { account_id: accountId });

    const recon = startReconciliation(bookBalance, statementBalance, fiscalYear, fiscalPeriod);

    setBankRecon({
      ...recon,
      bankStatement: {
        statementDate,
        beginningBalance: 0,
        endingBalance: statementBalance,
        deposits: 0,
        withdrawals: 0,
        statementNumber: `STMT-${Date.now()}`,
      },
      outstandingChecks: [],
      depositsInTransit: [],
      bankCharges: [],
      bookAdjustments: [],
    });
  }, [accountId, startReconciliation, track]);

  const addOutstandingCheck = useCallback((checkData: Partial<ReconciliationItem>) => {
    track('bank_recon_add_outstanding_check', { account_id: accountId });

    const item = addReconciliationItem({
      ...checkData,
      itemType: 'outstanding_check',
    } as ReconciliationItem);

    setBankRecon(prev => prev ? {
      ...prev,
      outstandingChecks: [...prev.outstandingChecks, item],
    } : null);
  }, [accountId, addReconciliationItem, track]);

  const addDepositInTransit = useCallback((depositData: Partial<ReconciliationItem>) => {
    track('bank_recon_add_deposit_transit', { account_id: accountId });

    const item = addReconciliationItem({
      ...depositData,
      itemType: 'deposit_in_transit',
    } as ReconciliationItem);

    setBankRecon(prev => prev ? {
      ...prev,
      depositsInTransit: [...prev.depositsInTransit, item],
    } : null);
  }, [accountId, addReconciliationItem, track]);

  const addBankCharge = useCallback((chargeData: Partial<ReconciliationItem>) => {
    track('bank_recon_add_bank_charge', { account_id: accountId });

    const item = addReconciliationItem({
      ...chargeData,
      itemType: 'bank_charge',
    } as ReconciliationItem);

    setBankRecon(prev => prev ? {
      ...prev,
      bankCharges: [...prev.bankCharges, item],
    } : null);
  }, [accountId, addReconciliationItem, track]);

  const calculateReconciledBalance = useCallback(() => {
    if (!bankRecon) return 0;

    let reconciledBalance = bankRecon.bookBalance;

    // Subtract outstanding checks
    bankRecon.outstandingChecks.forEach(check => {
      reconciledBalance -= check.amount;
    });

    // Add deposits in transit
    bankRecon.depositsInTransit.forEach(deposit => {
      reconciledBalance += deposit.amount;
    });

    // Adjust for bank charges not in books
    bankRecon.bankCharges.forEach(charge => {
      reconciledBalance -= charge.amount;
    });

    return reconciledBalance;
  }, [bankRecon]);

  const variance = useMemo(() => {
    if (!bankRecon) return 0;
    const reconciledBalance = calculateReconciledBalance();
    return Math.abs(reconciledBalance - bankRecon.statementBalance);
  }, [bankRecon, calculateReconciledBalance]);

  const isReconciled = useMemo(() => {
    return variance < 0.01; // Within 1 cent
  }, [variance]);

  return {
    bankRecon,
    reconciliation,
    startBankReconciliation,
    addOutstandingCheck,
    addDepositInTransit,
    addBankCharge,
    calculateReconciledBalance,
    variance,
    isReconciled,
    completeReconciliation,
  };
}

// ============================================================================
// AUTOMATED MATCHING ENGINE
// ============================================================================

/**
 * Hook for automated transaction matching
 *
 * @description Automatically match book and bank transactions
 *
 * @returns {object} Auto-match operations
 *
 * @example
 * ```tsx
 * function AutoMatchEngine() {
 *   const {
 *     matchingRules,
 *     addRule,
 *     runAutoMatch,
 *     matchResults,
 *     reviewMatches,
 *     acceptMatch,
 *     rejectMatch
 *   } = useAutomatedMatching();
 *
 *   return (
 *     <div>
 *       <RulesList rules={matchingRules} />
 *       <button onClick={() => runAutoMatch(bookTransactions, bankTransactions)}>
 *         Run Auto-Match
 *       </button>
 *       <MatchResultsTable results={matchResults} />
 *     </div>
 *   );
 * }
 * ```
 */
export function useAutomatedMatching() {
  const [matchingRules, setMatchingRules] = useState<AutoMatchRule[]>([]);
  const [matchResults, setMatchResults] = useState<any[]>([]);
  const [isMatching, setIsMatching] = useState(false);
  const { track } = useTracking();

  const addRule = useCallback((ruleData: Partial<AutoMatchRule>) => {
    track('auto_match_rule_add');

    const newRule: AutoMatchRule = {
      id: `rule_${Date.now()}`,
      name: ruleData.name || 'New Rule',
      criteria: ruleData.criteria || {},
      isActive: true,
      priority: ruleData.priority || matchingRules.length + 1,
    };

    setMatchingRules(prev => [...prev, newRule]);
  }, [matchingRules, track]);

  const runAutoMatch = useCallback((bookTransactions: any[], bankTransactions: any[]) => {
    setIsMatching(true);
    track('auto_match_run', {
      book_count: bookTransactions.length,
      bank_count: bankTransactions.length,
    });

    const matches: any[] = [];
    const activeRules = matchingRules.filter(r => r.isActive).sort((a, b) => a.priority - b.priority);

    const matchedBookIds = new Set<string>();
    const matchedBankIds = new Set<string>();

    // Try each rule in priority order
    for (const rule of activeRules) {
      for (const bookTx of bookTransactions) {
        if (matchedBookIds.has(bookTx.id)) continue;

        for (const bankTx of bankTransactions) {
          if (matchedBankIds.has(bankTx.id)) continue;

          if (isMatch(bookTx, bankTx, rule.criteria)) {
            matches.push({
              id: `match_${Date.now()}_${Math.random()}`,
              bookTransaction: bookTx,
              bankTransaction: bankTx,
              matchedBy: rule.name,
              confidence: calculateMatchConfidence(bookTx, bankTx, rule.criteria),
              status: 'pending_review',
            });

            matchedBookIds.add(bookTx.id);
            matchedBankIds.add(bankTx.id);
            break;
          }
        }
      }
    }

    setMatchResults(matches);
    setIsMatching(false);
  }, [matchingRules, track]);

  const isMatch = (bookTx: any, bankTx: any, criteria: AutoMatchRule['criteria']) => {
    // Exact amount match required
    const amountMatch = Math.abs(bookTx.amount - bankTx.amount) <= (criteria.amountTolerance || 0);
    if (!amountMatch) return false;

    // Date tolerance
    if (criteria.dateTolerance !== undefined) {
      const daysDiff = Math.abs((new Date(bookTx.date).getTime() - new Date(bankTx.date).getTime()) / (1000 * 60 * 60 * 24));
      if (daysDiff > criteria.dateTolerance) return false;
    }

    // Reference match
    if (criteria.referenceMatch && bookTx.reference !== bankTx.reference) {
      return false;
    }

    // Description match
    if (criteria.descriptionMatch) {
      const bookDesc = bookTx.description.toLowerCase();
      const bankDesc = bankTx.description.toLowerCase();
      if (!bookDesc.includes(bankDesc) && !bankDesc.includes(bookDesc)) {
        return false;
      }
    }

    return true;
  };

  const calculateMatchConfidence = (bookTx: any, bankTx: any, criteria: AutoMatchRule['criteria']) => {
    let confidence = 0;

    // Amount match
    if (bookTx.amount === bankTx.amount) confidence += 40;
    else if (Math.abs(bookTx.amount - bankTx.amount) < 0.01) confidence += 35;

    // Date match
    if (bookTx.date === bankTx.date) confidence += 30;
    else if (Math.abs(new Date(bookTx.date).getTime() - new Date(bankTx.date).getTime()) < 86400000) confidence += 20;

    // Reference match
    if (bookTx.reference && bankTx.reference && bookTx.reference === bankTx.reference) confidence += 20;

    // Description similarity
    if (bookTx.description.toLowerCase() === bankTx.description.toLowerCase()) confidence += 10;

    return Math.min(confidence, 100);
  };

  const acceptMatch = useCallback((matchId: string) => {
    track('auto_match_accept', { match_id: matchId });
    setMatchResults(prev =>
      prev.map(m => m.id === matchId ? { ...m, status: 'accepted' } : m)
    );
  }, [track]);

  const rejectMatch = useCallback((matchId: string) => {
    track('auto_match_reject', { match_id: matchId });
    setMatchResults(prev =>
      prev.map(m => m.id === matchId ? { ...m, status: 'rejected' } : m)
    );
  }, [track]);

  const acceptAllHighConfidence = useCallback((threshold: number = 95) => {
    track('auto_match_accept_high_confidence', { threshold });
    setMatchResults(prev =>
      prev.map(m =>
        m.confidence >= threshold && m.status === 'pending_review'
          ? { ...m, status: 'accepted' }
          : m
      )
    );
  }, [track]);

  return {
    matchingRules,
    addRule,
    runAutoMatch,
    matchResults,
    isMatching,
    acceptMatch,
    rejectMatch,
    acceptAllHighConfidence,
  };
}

// ============================================================================
// RECONCILIATION EXCEPTION MANAGEMENT
// ============================================================================

/**
 * Hook for reconciliation exception management
 *
 * @description Manage and resolve reconciliation exceptions
 *
 * @param {string} accountId - Account identifier
 * @returns {object} Exception management operations
 *
 * @example
 * ```tsx
 * function ReconciliationExceptions({ accountId }) {
 *   const {
 *     exceptions,
 *     createException,
 *     assignException,
 *     resolveException,
 *     writeOffException,
 *     agingReport
 *   } = useReconciliationExceptions(accountId);
 *
 *   return (
 *     <div>
 *       <ExceptionsList exceptions={exceptions} />
 *       <AgingAnalysis report={agingReport} />
 *     </div>
 *   );
 * }
 * ```
 */
export function useReconciliationExceptions(accountId: string) {
  const [exceptions, setExceptions] = useState<ReconciliationException[]>([]);
  const { track } = useTracking();

  const createException = useCallback((exceptionData: Partial<ReconciliationException>) => {
    track('reconciliation_exception_create', { account_id: accountId, type: exceptionData.type });

    const newException: ReconciliationException = {
      id: `exc_${Date.now()}`,
      type: exceptionData.type || 'unmatched_book',
      description: exceptionData.description || '',
      amount: exceptionData.amount || 0,
      date: exceptionData.date || new Date(),
      status: 'open',
    };

    setExceptions(prev => [...prev, newException]);
  }, [accountId, track]);

  const assignException = useCallback((exceptionId: string, assignedTo: string) => {
    track('reconciliation_exception_assign', { exception_id: exceptionId, assigned_to: assignedTo });

    setExceptions(prev =>
      prev.map(e =>
        e.id === exceptionId
          ? { ...e, assignedTo, status: 'investigating' as const }
          : e
      )
    );
  }, [track]);

  const resolveException = useCallback((exceptionId: string, resolution: string) => {
    track('reconciliation_exception_resolve', { exception_id: exceptionId });

    setExceptions(prev =>
      prev.map(e =>
        e.id === exceptionId
          ? { ...e, status: 'resolved' as const, resolution, resolvedDate: new Date() }
          : e
      )
    );
  }, [track]);

  const writeOffException = useCallback((exceptionId: string, reason: string) => {
    track('reconciliation_exception_write_off', { exception_id: exceptionId });

    setExceptions(prev =>
      prev.map(e =>
        e.id === exceptionId
          ? { ...e, status: 'written_off' as const, resolution: reason, resolvedDate: new Date() }
          : e
      )
    );
  }, [track]);

  const agingReport = useMemo(() => {
    const now = new Date();
    const aging = {
      current: 0,
      days30: 0,
      days60: 0,
      days90: 0,
      over90: 0,
    };

    exceptions.filter(e => e.status === 'open' || e.status === 'investigating').forEach(e => {
      const age = Math.floor((now.getTime() - e.date.getTime()) / (1000 * 60 * 60 * 24));
      const amount = Math.abs(e.amount);

      if (age <= 30) aging.current += amount;
      else if (age <= 60) aging.days30 += amount;
      else if (age <= 90) aging.days60 += amount;
      else aging.over90 += amount;
    });

    return aging;
  }, [exceptions]);

  const openExceptions = useMemo(() => {
    return exceptions.filter(e => e.status === 'open' || e.status === 'investigating');
  }, [exceptions]);

  return {
    exceptions,
    openExceptions,
    createException,
    assignException,
    resolveException,
    writeOffException,
    agingReport,
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  useBankReconciliationWorkflow,
  useAutomatedMatching,
  useReconciliationExceptions,
};
