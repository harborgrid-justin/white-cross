/**
 * LOC: USACE-DOWNSTREAM-EXP-PROC-004
 * File: /reuse/frontend/composites/usace/downstream/expenditure-processing-systems.ts
 */

'use client';

import React, { useState, useCallback, useMemo } from 'react';
import {
  ExpenditureTransaction,
  ObligationDocument,
  useExpenditureProcessing,
} from '../usace-fiscal-operations-composites';

export interface ExpenditureBatch {
  batchId: string;
  batchDate: Date;
  totalAmount: number;
  transactionCount: number;
  status: 'pending' | 'processing' | 'approved' | 'paid';
  transactions: ExpenditureTransaction[];
  approvedBy?: string;
  paidDate?: Date;
}

export function useExpenditureBatchProcessing() {
  const { expenditures, createExpenditure, approveExpenditure, processPayment } = useExpenditureProcessing();
  const [batches, setBatches] = useState<ExpenditureBatch[]>([]);

  const createBatch = useCallback((transactions: Partial<ExpenditureTransaction>[]) => {
    const batchId = `batch_${Date.now()}`;
    const totalAmount = transactions.reduce((sum, t) => sum + (t.amount || 0), 0);

    const batch: ExpenditureBatch = {
      batchId,
      batchDate: new Date(),
      totalAmount,
      transactionCount: transactions.length,
      status: 'pending',
      transactions: transactions as ExpenditureTransaction[],
    };

    setBatches(prev => [...prev, batch]);
    return batch;
  }, []);

  const approveBatch = useCallback(async (batchId: string, approver: string) => {
    setBatches(prev => prev.map(b =>
      b.batchId === batchId
        ? { ...b, status: 'approved', approvedBy: approver }
        : b
    ));
  }, []);

  const processBatchPayment = useCallback(async (batchId: string) => {
    setBatches(prev => prev.map(b =>
      b.batchId === batchId
        ? { ...b, status: 'paid', paidDate: new Date() }
        : b
    ));
  }, []);

  return {
    batches,
    expenditures,
    createBatch,
    approveBatch,
    processBatchPayment,
    createExpenditure,
    approveExpenditure,
    processPayment,
  };
}

export function validateExpenditureAgainstObligation(
  expenditure: Partial<ExpenditureTransaction>,
  obligation: ObligationDocument
): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!expenditure.amount || expenditure.amount <= 0) {
    errors.push('Expenditure amount must be greater than zero');
  }

  if (expenditure.amount && expenditure.amount > obligation.remainingBalance) {
    errors.push(`Expenditure amount ($${expenditure.amount}) exceeds remaining obligation balance ($${obligation.remainingBalance})`);
  }

  if (obligation.status !== 'obligated' && obligation.status !== 'partially_expended') {
    errors.push(`Cannot process expenditure - obligation status is ${obligation.status}`);
  }

  const now = new Date();
  const obligationEnd = new Date(obligation.endDate);
  if (now > obligationEnd) {
    warnings.push('Obligation period has ended - verify this is an accrued expense');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

export default {
  useExpenditureBatchProcessing,
  validateExpenditureAgainstObligation,
};
