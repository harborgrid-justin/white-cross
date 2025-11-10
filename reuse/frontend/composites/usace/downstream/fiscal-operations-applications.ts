/**
 * LOC: USACE-DOWNSTREAM-FISC-OPS-001
 * File: /reuse/frontend/composites/usace/downstream/fiscal-operations-applications.ts
 */

'use client';

import React, { useState, useCallback, useMemo } from 'react';
import {
  ObligationDocument,
  ExpenditureTransaction,
  FundStatus,
  useObligationManagement,
  useExpenditureProcessing,
  useFundStatus,
} from '../usace-fiscal-operations-composites';

export interface FiscalYearSummary {
  fiscalYear: number;
  totalAppropriations: number;
  totalObligations: number;
  totalExpenditures: number;
  availableFunds: number;
  obligationRate: number;
  expenditureRate: number;
  burnRate: number;
}

export function useFiscalOperationsWorkflow() {
  const { obligations, createObligation, certifyObligation } = useObligationManagement();
  const { expenditures, createExpenditure, approveExpenditure } = useExpenditureProcessing();
  const [workflow, setWorkflow] = useState<string>('obligation');

  const processObligationWorkflow = useCallback(async (
    obligationData: Partial<ObligationDocument>
  ) => {
    const obligation = await createObligation(obligationData);
    await certifyObligation(obligation.id, 'system');
    setWorkflow('expenditure');
    return obligation;
  }, [createObligation, certifyObligation]);

  return {
    workflow,
    setWorkflow,
    processObligationWorkflow,
    obligations,
    expenditures,
  };
}

export function calculateFiscalYearSummary(
  obligations: ObligationDocument[],
  expenditures: ExpenditureTransaction[],
  fiscalYear: number,
  totalAppropriations: number
): FiscalYearSummary {
  const yearObligations = obligations.filter(o => o.fiscalYear === fiscalYear);
  const yearExpenditures = expenditures.filter(e => e.fiscalYear === fiscalYear);

  const totalObligations = yearObligations.reduce((sum, o) => sum + o.obligationAmount, 0);
  const totalExpenditures = yearExpenditures
    .filter(e => e.status === 'paid')
    .reduce((sum, e) => sum + e.amount, 0);

  const availableFunds = totalAppropriations - totalObligations;
  const obligationRate = totalAppropriations > 0 ? (totalObligations / totalAppropriations) * 100 : 0;
  const expenditureRate = totalObligations > 0 ? (totalExpenditures / totalObligations) * 100 : 0;
  const burnRate = totalAppropriations > 0 ? (totalExpenditures / totalAppropriations) * 100 : 0;

  return {
    fiscalYear,
    totalAppropriations: Math.round(totalAppropriations * 100) / 100,
    totalObligations: Math.round(totalObligations * 100) / 100,
    totalExpenditures: Math.round(totalExpenditures * 100) / 100,
    availableFunds: Math.round(availableFunds * 100) / 100,
    obligationRate: Math.round(obligationRate * 10) / 10,
    expenditureRate: Math.round(expenditureRate * 10) / 10,
    burnRate: Math.round(burnRate * 10) / 10,
  };
}

export default {
  useFiscalOperationsWorkflow,
  calculateFiscalYearSummary,
};
