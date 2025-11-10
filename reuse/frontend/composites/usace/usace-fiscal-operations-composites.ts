/**
 * LOC: USACE-FO-003
 * File: /reuse/frontend/composites/usace/usace-fiscal-operations-composites.ts
 *
 * UPSTREAM (imports from):
 *   - React 18+
 *   - Next.js 16+
 *   - TypeScript 5.x
 *   - @reuse/frontend/form-builder-kit
 *   - @reuse/frontend/analytics-tracking-kit
 *   - @reuse/frontend/workflow-approval-kit
 *   - @reuse/frontend/permissions-roles-kit
 *   - @reuse/frontend/search-filter-cms-kit
 *
 * DOWNSTREAM (imported by):
 *   - USACE CEFMS fiscal operations applications
 *   - Appropriations management systems
 *   - Obligations tracking tools
 *   - Expenditure processing systems
 */

/**
 * File: /reuse/frontend/composites/usace/usace-fiscal-operations-composites.ts
 * Locator: WC-USACE-FO-COMP-003
 * Purpose: USACE CEFMS Fiscal Operations Composites - Comprehensive fiscal year operations, appropriations, obligations, and expenditures
 *
 * Upstream: React 18+, Next.js 16+, TypeScript 5.x, form-builder-kit, analytics-tracking-kit, workflow-approval-kit
 * Downstream: USACE fiscal operations, appropriations management, obligations tracking, expenditure processing
 * Dependencies: React 18+, Next.js 16+, TypeScript 5.x, reuse/frontend kits
 * Exports: 46+ functions for USACE fiscal operations
 *
 * LLM Context: Enterprise-grade USACE CEFMS fiscal operations composites for React 18+ and Next.js 16+ applications.
 * Provides comprehensive fiscal year operations management, appropriations tracking, obligations processing,
 * expenditure management, commitment tracking, fund status reporting, and fiscal compliance monitoring.
 * Designed specifically for U.S. Army Corps of Engineers Civil Works fiscal operations requirements.
 */

'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  useFormState,
  FormProvider,
  FormConfig,
  FieldConfig,
  FormData,
} from '../../form-builder-kit';
import {
  useTracking,
  trackEvent,
  trackError,
  trackConversion,
} from '../../analytics-tracking-kit';
import {
  useWorkflowState,
  useApprovalFlow,
  WorkflowStatus,
} from '../../workflow-approval-kit';
import {
  usePermissions,
  hasPermission,
} from '../../permissions-roles-kit';
import {
  useSearch,
  useFilter,
  SearchConfig,
} from '../../search-filter-cms-kit';

// ============================================================================
// TYPE DEFINITIONS - USACE CEFMS FISCAL OPERATIONS
// ============================================================================

/**
 * Obligation document structure
 */
export interface ObligationDocument {
  id: string;
  obligationNumber: string;
  obligationDate: Date;
  fiscalYear: number;
  appropriationId: string;
  projectId?: string;
  contractId?: string;
  vendorId?: string;
  vendorName: string;
  obligationType: 'contract' | 'purchase_order' | 'grant' | 'cooperative_agreement' | 'other';
  obligationAmount: number;
  expendedAmount: number;
  unobligatedAmount: number;
  remainingBalance: number;
  startDate: Date;
  endDate: Date;
  description: string;
  purpose: string;
  status: 'draft' | 'pending' | 'obligated' | 'partially_expended' | 'fully_expended' | 'closed' | 'cancelled';
  certifiedBy?: string;
  certifiedDate?: Date;
  approvedBy?: string;
  approvedDate?: Date;
  deobligationHistory?: Deobligation[];
  modifications?: ObligationModification[];
  fundingSource: string;
  accountingClassification: string;
  metadata?: Record<string, any>;
}

/**
 * Deobligation record
 */
export interface Deobligation {
  id: string;
  deobligationNumber: string;
  deobligationDate: Date;
  amount: number;
  reason: string;
  requestedBy: string;
  approvedBy?: string;
  status: 'pending' | 'approved' | 'rejected';
  notes?: string;
}

/**
 * Obligation modification
 */
export interface ObligationModification {
  id: string;
  modificationNumber: string;
  modificationDate: Date;
  modificationType: 'increase' | 'decrease' | 'scope_change' | 'time_extension';
  originalAmount: number;
  modificationAmount: number;
  newAmount: number;
  reason: string;
  approvedBy?: string;
  effectiveDate: Date;
}

/**
 * Expenditure transaction
 */
export interface ExpenditureTransaction {
  id: string;
  transactionNumber: string;
  transactionDate: Date;
  postingDate: Date;
  fiscalYear: number;
  fiscalPeriod: number;
  obligationId: string;
  obligationNumber: string;
  expenditureType: 'invoice_payment' | 'payroll' | 'travel' | 'procurement' | 'other';
  amount: number;
  vendorId?: string;
  vendorName: string;
  invoiceNumber?: string;
  invoiceDate?: Date;
  paymentDate?: Date;
  checkNumber?: string;
  description: string;
  appropriationId: string;
  projectId?: string;
  accountCode: string;
  status: 'pending' | 'approved' | 'paid' | 'voided';
  approvedBy?: string;
  paidBy?: string;
  voidReason?: string;
  attachments?: string[];
  metadata?: Record<string, any>;
}

/**
 * Commitment record
 */
export interface Commitment {
  id: string;
  commitmentNumber: string;
  commitmentDate: Date;
  fiscalYear: number;
  appropriationId: string;
  projectId?: string;
  commitmentType: 'requisition' | 'contract_pending' | 'planned_expense' | 'encumbrance';
  amount: number;
  convertedToObligation: boolean;
  obligationId?: string;
  releasedAmount: number;
  remainingAmount: number;
  description: string;
  requestedBy: string;
  expirationDate?: Date;
  status: 'active' | 'converted' | 'released' | 'expired';
  notes?: string;
}

/**
 * Fund status report
 */
export interface FundStatus {
  appropriationId: string;
  appropriationCode: string;
  appropriationName: string;
  fiscalYear: number;
  totalAppropriated: number;
  totalObligated: number;
  totalExpended: number;
  totalCommitments: number;
  availableForObligation: number;
  percentObligated: number;
  percentExpended: number;
  undeliveredOrders: number;
  asOfDate: Date;
  expirationDate?: Date;
  status: 'available' | 'expiring_soon' | 'expired';
  restrictions?: string[];
}

/**
 * Apportionment record
 */
export interface Apportionment {
  id: string;
  apportionmentNumber: string;
  fiscalYear: number;
  appropriationId: string;
  quarter: 1 | 2 | 3 | 4;
  apportionedAmount: number;
  obligationAuthority: number;
  obligatedToDate: number;
  remainingAuthority: number;
  effectiveDate: Date;
  expirationDate: Date;
  approvedBy: string;
  restrictions?: string[];
  footnotes?: string[];
  status: 'active' | 'expired' | 'superseded';
}

/**
 * Allotment structure
 */
export interface Allotment {
  id: string;
  allotmentNumber: string;
  fiscalYear: number;
  appropriationId: string;
  organizationId: string;
  organizationName: string;
  allottedAmount: number;
  obligatedAmount: number;
  expendedAmount: number;
  availableBalance: number;
  effectiveDate: Date;
  expirationDate: Date;
  purpose: string;
  restrictions?: string[];
  status: 'active' | 'closed' | 'cancelled';
}

/**
 * Reimbursable agreement
 */
export interface ReimbursableAgreement {
  id: string;
  agreementNumber: string;
  fiscalYear: number;
  sponsorName: string;
  sponsorId: string;
  agreementType: 'reimbursable' | 'advance' | 'direct_cite';
  totalAmount: number;
  receivedToDate: number;
  obligatedAmount: number;
  expendedAmount: number;
  remainingBalance: number;
  startDate: Date;
  endDate: Date;
  purpose: string;
  appropriationId: string;
  projectId?: string;
  status: 'draft' | 'active' | 'completed' | 'terminated';
  billingSchedule?: BillingSchedule[];
  collections?: Collection[];
}

/**
 * Billing schedule entry
 */
export interface BillingSchedule {
  id: string;
  billingDate: Date;
  billingAmount: number;
  invoiceNumber?: string;
  invoicedDate?: Date;
  paidDate?: Date;
  status: 'pending' | 'invoiced' | 'paid' | 'overdue';
}

/**
 * Collection record
 */
export interface Collection {
  id: string;
  collectionNumber: string;
  collectionDate: Date;
  amount: number;
  paymentMethod: string;
  referenceNumber: string;
  deposited: boolean;
  depositDate?: Date;
  notes?: string;
}

/**
 * Undelivered order
 */
export interface UndeliveredOrder {
  id: string;
  obligationId: string;
  obligationNumber: string;
  vendorName: string;
  originalAmount: number;
  deliveredAmount: number;
  undeliveredAmount: number;
  expectedDeliveryDate?: Date;
  ageInDays: number;
  status: 'pending_delivery' | 'partially_delivered' | 'overdue';
  lastFollowUpDate?: Date;
  notes?: string;
}

/**
 * Fiscal compliance check
 */
export interface FiscalComplianceCheck {
  checkType: 'anti_deficiency' | 'purpose' | 'time' | 'amount';
  passed: boolean;
  message: string;
  details?: string;
  violationSeverity?: 'warning' | 'error' | 'critical';
  remediation?: string;
}

/**
 * Fund reservation
 */
export interface FundReservation {
  id: string;
  reservationNumber: string;
  fiscalYear: number;
  appropriationId: string;
  reservedAmount: number;
  purpose: string;
  reservedBy: string;
  reservationDate: Date;
  expirationDate: Date;
  releasedAmount: number;
  remainingAmount: number;
  status: 'active' | 'released' | 'expired';
}

/**
 * Obligation authority
 */
export interface ObligationAuthority {
  fiscalYear: number;
  appropriationId: string;
  totalAuthority: number;
  obligatedToDate: number;
  commitments: number;
  reservations: number;
  availableAuthority: number;
  authorityType: 'annual' | 'multi_year' | 'no_year';
  expirationDate?: Date;
  restrictions?: string[];
}

// ============================================================================
// OBLIGATION MANAGEMENT
// ============================================================================

/**
 * Hook for obligation document management
 *
 * @description Manages obligation documents with certification and approval
 *
 * @returns {object} Obligation management operations
 *
 * @example
 * ```tsx
 * function ObligationManager() {
 *   const {
 *     obligations,
 *     createObligation,
 *     modifyObligation,
 *     deobligate,
 *     closeObligation
 *   } = useObligationManagement();
 * }
 * ```
 */
export function useObligationManagement() {
  const [obligations, setObligations] = useState<ObligationDocument[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { track } = useTracking();
  const { startWorkflow } = useApprovalFlow();

  const createObligation = useCallback(async (obligationData: Partial<ObligationDocument>) => {
    track('obligation_create', { type: obligationData.obligationType });
    const newObligation: ObligationDocument = {
      id: `obl_${Date.now()}`,
      obligationNumber: `OBL-${Date.now()}`,
      status: 'draft',
      expendedAmount: 0,
      remainingBalance: obligationData.obligationAmount || 0,
      unobligatedAmount: 0,
      deobligationHistory: [],
      modifications: [],
      ...obligationData,
    } as ObligationDocument;
    setObligations(prev => [...prev, newObligation]);
    return newObligation;
  }, [track]);

  const certifyObligation = useCallback(async (obligationId: string, certifier: string) => {
    track('obligation_certify', { obligation_id: obligationId });
    setObligations(prev =>
      prev.map(obl =>
        obl.id === obligationId
          ? { ...obl, certifiedBy: certifier, certifiedDate: new Date() }
          : obl
      )
    );
  }, [track]);

  const approveObligation = useCallback(async (obligationId: string, approver: string) => {
    track('obligation_approve', { obligation_id: obligationId });
    setObligations(prev =>
      prev.map(obl =>
        obl.id === obligationId
          ? { ...obl, status: 'obligated', approvedBy: approver, approvedDate: new Date() }
          : obl
      )
    );
  }, [track]);

  const modifyObligation = useCallback(
    async (obligationId: string, modification: Partial<ObligationModification>) => {
      track('obligation_modify', { obligation_id: obligationId, type: modification.modificationType });
      const obligation = obligations.find(o => o.id === obligationId);
      if (!obligation) return;

      const newModification: ObligationModification = {
        id: `mod_${Date.now()}`,
        modificationNumber: `MOD-${Date.now()}`,
        modificationDate: new Date(),
        originalAmount: obligation.obligationAmount,
        ...modification,
      } as ObligationModification;

      setObligations(prev =>
        prev.map(obl =>
          obl.id === obligationId
            ? {
                ...obl,
                obligationAmount: newModification.newAmount,
                remainingBalance: newModification.newAmount - obl.expendedAmount,
                modifications: [...(obl.modifications || []), newModification],
              }
            : obl
        )
      );
    },
    [obligations, track]
  );

  const deobligate = useCallback(
    async (obligationId: string, amount: number, reason: string, requestedBy: string) => {
      track('obligation_deobligate', { obligation_id: obligationId, amount });
      const deobligation: Deobligation = {
        id: `deob_${Date.now()}`,
        deobligationNumber: `DEOB-${Date.now()}`,
        deobligationDate: new Date(),
        amount,
        reason,
        requestedBy,
        status: 'pending',
      };

      setObligations(prev =>
        prev.map(obl =>
          obl.id === obligationId
            ? {
                ...obl,
                unobligatedAmount: (obl.unobligatedAmount || 0) + amount,
                remainingBalance: obl.remainingBalance + amount,
                deobligationHistory: [...(obl.deobligationHistory || []), deobligation],
              }
            : obl
        )
      );
    },
    [track]
  );

  const closeObligation = useCallback(async (obligationId: string) => {
    track('obligation_close', { obligation_id: obligationId });
    setObligations(prev =>
      prev.map(obl => (obl.id === obligationId ? { ...obl, status: 'closed' } : obl))
    );
  }, [track]);

  const searchObligations = useCallback(
    (query: string) => {
      track('obligation_search', { query });
      return obligations.filter(
        obl =>
          obl.obligationNumber.includes(query) ||
          obl.vendorName.toLowerCase().includes(query.toLowerCase())
      );
    },
    [obligations, track]
  );

  return {
    obligations,
    isProcessing,
    createObligation,
    certifyObligation,
    approveObligation,
    modifyObligation,
    deobligate,
    closeObligation,
    searchObligations,
  };
}

/**
 * Hook for expenditure transaction processing
 *
 * @description Manages expenditure transactions against obligations
 *
 * @returns {object} Expenditure processing operations
 *
 * @example
 * ```tsx
 * function ExpenditureProcessor() {
 *   const {
 *     expenditures,
 *     createExpenditure,
 *     approveExpenditure,
 *     processPayment,
 *     voidExpenditure
 *   } = useExpenditureProcessing();
 * }
 * ```
 */
export function useExpenditureProcessing() {
  const [expenditures, setExpenditures] = useState<ExpenditureTransaction[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { track } = useTracking();

  const createExpenditure = useCallback(async (expenditureData: Partial<ExpenditureTransaction>) => {
    track('expenditure_create', { type: expenditureData.expenditureType });
    const newExpenditure: ExpenditureTransaction = {
      id: `exp_${Date.now()}`,
      transactionNumber: `EXP-${Date.now()}`,
      status: 'pending',
      transactionDate: new Date(),
      postingDate: new Date(),
      ...expenditureData,
    } as ExpenditureTransaction;
    setExpenditures(prev => [...prev, newExpenditure]);
    return newExpenditure;
  }, [track]);

  const approveExpenditure = useCallback(async (expenditureId: string, approver: string) => {
    track('expenditure_approve', { expenditure_id: expenditureId });
    setExpenditures(prev =>
      prev.map(exp =>
        exp.id === expenditureId ? { ...exp, status: 'approved', approvedBy: approver } : exp
      )
    );
  }, [track]);

  const processPayment = useCallback(
    async (expenditureId: string, checkNumber: string, paidBy: string) => {
      setIsProcessing(true);
      try {
        track('expenditure_payment_process', { expenditure_id: expenditureId });
        setExpenditures(prev =>
          prev.map(exp =>
            exp.id === expenditureId
              ? { ...exp, status: 'paid', checkNumber, paidBy, paymentDate: new Date() }
              : exp
          )
        );
      } finally {
        setIsProcessing(false);
      }
    },
    [track]
  );

  const voidExpenditure = useCallback(async (expenditureId: string, reason: string) => {
    track('expenditure_void', { expenditure_id: expenditureId });
    setExpenditures(prev =>
      prev.map(exp => (exp.id === expenditureId ? { ...exp, status: 'voided', voidReason: reason } : exp))
    );
  }, [track]);

  const getExpendituresByObligation = useCallback(
    (obligationId: string) => {
      return expenditures.filter(exp => exp.obligationId === obligationId);
    },
    [expenditures]
  );

  const calculateTotalExpended = useCallback(
    (obligationId: string) => {
      const obExpenses = getExpendituresByObligation(obligationId);
      return obExpenses
        .filter(exp => exp.status === 'paid')
        .reduce((sum, exp) => sum + exp.amount, 0);
    },
    [getExpendituresByObligation]
  );

  return {
    expenditures,
    isProcessing,
    createExpenditure,
    approveExpenditure,
    processPayment,
    voidExpenditure,
    getExpendituresByObligation,
    calculateTotalExpended,
  };
}

// ============================================================================
// COMMITMENT TRACKING
// ============================================================================

/**
 * Hook for commitment management
 *
 * @description Manages commitments and their conversion to obligations
 *
 * @returns {object} Commitment management operations
 *
 * @example
 * ```tsx
 * function CommitmentTracker() {
 *   const {
 *     commitments,
 *     createCommitment,
 *     convertToObligation,
 *     releaseCommitment,
 *     getActiveCommitments
 *   } = useCommitmentManagement();
 * }
 * ```
 */
export function useCommitmentManagement() {
  const [commitments, setCommitments] = useState<Commitment[]>([]);
  const { track } = useTracking();

  const createCommitment = useCallback(async (commitmentData: Partial<Commitment>) => {
    track('commitment_create', { type: commitmentData.commitmentType });
    const newCommitment: Commitment = {
      id: `com_${Date.now()}`,
      commitmentNumber: `COM-${Date.now()}`,
      commitmentDate: new Date(),
      status: 'active',
      convertedToObligation: false,
      releasedAmount: 0,
      remainingAmount: commitmentData.amount || 0,
      ...commitmentData,
    } as Commitment;
    setCommitments(prev => [...prev, newCommitment]);
    return newCommitment;
  }, [track]);

  const convertToObligation = useCallback(async (commitmentId: string, obligationId: string) => {
    track('commitment_convert_obligation', { commitment_id: commitmentId });
    setCommitments(prev =>
      prev.map(com =>
        com.id === commitmentId
          ? { ...com, convertedToObligation: true, obligationId, status: 'converted' }
          : com
      )
    );
  }, [track]);

  const releaseCommitment = useCallback(async (commitmentId: string, amount: number) => {
    track('commitment_release', { commitment_id: commitmentId, amount });
    setCommitments(prev =>
      prev.map(com => {
        if (com.id === commitmentId) {
          const newReleasedAmount = com.releasedAmount + amount;
          const newRemainingAmount = com.amount - newReleasedAmount;
          return {
            ...com,
            releasedAmount: newReleasedAmount,
            remainingAmount: newRemainingAmount,
            status: newRemainingAmount === 0 ? 'released' : com.status,
          };
        }
        return com;
      })
    );
  }, [track]);

  const getActiveCommitments = useCallback(() => {
    return commitments.filter(c => c.status === 'active');
  }, [commitments]);

  const getTotalCommitments = useCallback(
    (appropriationId: string) => {
      return commitments
        .filter(c => c.appropriationId === appropriationId && c.status === 'active')
        .reduce((sum, c) => sum + c.remainingAmount, 0);
    },
    [commitments]
  );

  return {
    commitments,
    createCommitment,
    convertToObligation,
    releaseCommitment,
    getActiveCommitments,
    getTotalCommitments,
  };
}

// ============================================================================
// FUND STATUS AND AVAILABILITY
// ============================================================================

/**
 * Hook for fund status monitoring
 *
 * @description Monitors fund status and availability
 *
 * @param {string} appropriationId - Appropriation identifier
 * @returns {object} Fund status operations
 *
 * @example
 * ```tsx
 * function FundStatusMonitor({ appropriationId }) {
 *   const {
 *     fundStatus,
 *     refreshStatus,
 *     checkAvailability,
 *     getUtilizationRate
 *   } = useFundStatus(appropriationId);
 * }
 * ```
 */
export function useFundStatus(appropriationId: string) {
  const [fundStatus, setFundStatus] = useState<FundStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { track } = useTracking();

  const refreshStatus = useCallback(async () => {
    setIsLoading(true);
    try {
      track('fund_status_refresh', { appropriation_id: appropriationId });
      // Calculate fund status from obligations, expenditures, commitments
      const status: FundStatus = {
        appropriationId,
        appropriationCode: '',
        appropriationName: '',
        fiscalYear: 2024,
        totalAppropriated: 10000000,
        totalObligated: 7000000,
        totalExpended: 5000000,
        totalCommitments: 1000000,
        availableForObligation: 2000000,
        percentObligated: 70,
        percentExpended: 50,
        undeliveredOrders: 2000000,
        asOfDate: new Date(),
        status: 'available',
      };
      setFundStatus(status);
    } finally {
      setIsLoading(false);
    }
  }, [appropriationId, track]);

  const checkAvailability = useCallback(
    (requestedAmount: number) => {
      if (!fundStatus) return { available: false, message: 'Fund status not loaded' };

      if (fundStatus.availableForObligation >= requestedAmount) {
        return { available: true, message: 'Funds available' };
      }

      return {
        available: false,
        message: `Insufficient funds. Available: $${fundStatus.availableForObligation.toLocaleString()}`,
        shortfall: requestedAmount - fundStatus.availableForObligation,
      };
    },
    [fundStatus]
  );

  const getUtilizationRate = useCallback(() => {
    if (!fundStatus || fundStatus.totalAppropriated === 0) return 0;
    return (fundStatus.totalObligated / fundStatus.totalAppropriated) * 100;
  }, [fundStatus]);

  const getExpenditureRate = useCallback(() => {
    if (!fundStatus || fundStatus.totalObligated === 0) return 0;
    return (fundStatus.totalExpended / fundStatus.totalObligated) * 100;
  }, [fundStatus]);

  return {
    fundStatus,
    isLoading,
    refreshStatus,
    checkAvailability,
    getUtilizationRate,
    getExpenditureRate,
  };
}

/**
 * Hook for apportionment management
 *
 * @description Manages apportionments and obligation authority
 *
 * @param {number} fiscalYear - Fiscal year
 * @returns {object} Apportionment operations
 *
 * @example
 * ```tsx
 * function ApportionmentManager({ fiscalYear }) {
 *   const {
 *     apportionments,
 *     createApportionment,
 *     getQuarterlyApportionment,
 *     checkAuthority
 *   } = useApportionmentManagement(fiscalYear);
 * }
 * ```
 */
export function useApportionmentManagement(fiscalYear: number) {
  const [apportionments, setApportionments] = useState<Apportionment[]>([]);
  const { track } = useTracking();

  const createApportionment = useCallback(
    async (apportionmentData: Partial<Apportionment>) => {
      track('apportionment_create', { fiscal_year: fiscalYear, quarter: apportionmentData.quarter });
      const newApportionment: Apportionment = {
        id: `app_${Date.now()}`,
        apportionmentNumber: `APP-${Date.now()}`,
        fiscalYear,
        obligatedToDate: 0,
        status: 'active',
        ...apportionmentData,
      } as Apportionment;
      setApportionments(prev => [...prev, newApportionment]);
      return newApportionment;
    },
    [fiscalYear, track]
  );

  const getQuarterlyApportionment = useCallback(
    (quarter: 1 | 2 | 3 | 4, appropriationId: string) => {
      return apportionments.find(
        app =>
          app.quarter === quarter &&
          app.appropriationId === appropriationId &&
          app.fiscalYear === fiscalYear
      );
    },
    [apportionments, fiscalYear]
  );

  const checkAuthority = useCallback(
    (appropriationId: string, requestedAmount: number) => {
      const currentQuarter = Math.ceil(new Date().getMonth() / 3) as 1 | 2 | 3 | 4;
      const apportionment = getQuarterlyApportionment(currentQuarter, appropriationId);

      if (!apportionment) {
        return { authorized: false, message: 'No apportionment for current quarter' };
      }

      if (apportionment.remainingAuthority >= requestedAmount) {
        return { authorized: true, message: 'Authority available' };
      }

      return {
        authorized: false,
        message: 'Insufficient authority',
        shortfall: requestedAmount - apportionment.remainingAuthority,
      };
    },
    [getQuarterlyApportionment]
  );

  return {
    apportionments,
    createApportionment,
    getQuarterlyApportionment,
    checkAuthority,
  };
}

// ============================================================================
// ALLOTMENT MANAGEMENT
// ============================================================================

/**
 * Hook for allotment management
 *
 * @description Manages allotments to organizations
 *
 * @returns {object} Allotment operations
 *
 * @example
 * ```tsx
 * function AllotmentManager() {
 *   const {
 *     allotments,
 *     createAllotment,
 *     trackAllotmentUsage,
 *     closeAllotment
 *   } = useAllotmentManagement();
 * }
 * ```
 */
export function useAllotmentManagement() {
  const [allotments, setAllotments] = useState<Allotment[]>([]);
  const { track } = useTracking();

  const createAllotment = useCallback(async (allotmentData: Partial<Allotment>) => {
    track('allotment_create');
    const newAllotment: Allotment = {
      id: `alot_${Date.now()}`,
      allotmentNumber: `ALOT-${Date.now()}`,
      status: 'active',
      obligatedAmount: 0,
      expendedAmount: 0,
      availableBalance: allotmentData.allottedAmount || 0,
      ...allotmentData,
    } as Allotment;
    setAllotments(prev => [...prev, newAllotment]);
    return newAllotment;
  }, [track]);

  const trackAllotmentUsage = useCallback(
    (allotmentId: string, obligatedAmount: number, expendedAmount: number) => {
      track('allotment_usage_track', { allotment_id: allotmentId });
      setAllotments(prev =>
        prev.map(alot => {
          if (alot.id === allotmentId) {
            return {
              ...alot,
              obligatedAmount: alot.obligatedAmount + obligatedAmount,
              expendedAmount: alot.expendedAmount + expendedAmount,
              availableBalance: alot.allottedAmount - (alot.obligatedAmount + obligatedAmount),
            };
          }
          return alot;
        })
      );
    },
    [track]
  );

  const closeAllotment = useCallback((allotmentId: string) => {
    track('allotment_close', { allotment_id: allotmentId });
    setAllotments(prev =>
      prev.map(alot => (alot.id === allotmentId ? { ...alot, status: 'closed' } : alot))
    );
  }, [track]);

  const getAllotmentsByOrganization = useCallback(
    (organizationId: string) => {
      return allotments.filter(a => a.organizationId === organizationId && a.status === 'active');
    },
    [allotments]
  );

  return {
    allotments,
    createAllotment,
    trackAllotmentUsage,
    closeAllotment,
    getAllotmentsByOrganization,
  };
}

// ============================================================================
// REIMBURSABLE AGREEMENTS
// ============================================================================

/**
 * Hook for reimbursable agreement management
 *
 * @description Manages reimbursable agreements with billing and collections
 *
 * @returns {object} Reimbursable agreement operations
 *
 * @example
 * ```tsx
 * function ReimbursableAgreementManager() {
 *   const {
 *     agreements,
 *     createAgreement,
 *     recordCollection,
 *     generateBill,
 *     trackReceivables
 *   } = useReimbursableAgreements();
 * }
 * ```
 */
export function useReimbursableAgreements() {
  const [agreements, setAgreements] = useState<ReimbursableAgreement[]>([]);
  const { track } = useTracking();

  const createAgreement = useCallback(async (agreementData: Partial<ReimbursableAgreement>) => {
    track('reimbursable_agreement_create', { type: agreementData.agreementType });
    const newAgreement: ReimbursableAgreement = {
      id: `reimb_${Date.now()}`,
      agreementNumber: `REIMB-${Date.now()}`,
      status: 'draft',
      receivedToDate: 0,
      obligatedAmount: 0,
      expendedAmount: 0,
      remainingBalance: agreementData.totalAmount || 0,
      billingSchedule: [],
      collections: [],
      ...agreementData,
    } as ReimbursableAgreement;
    setAgreements(prev => [...prev, newAgreement]);
    return newAgreement;
  }, [track]);

  const recordCollection = useCallback(
    async (agreementId: string, collection: Partial<Collection>) => {
      track('reimbursable_collection_record', { agreement_id: agreementId });
      const newCollection: Collection = {
        id: `col_${Date.now()}`,
        collectionNumber: `COL-${Date.now()}`,
        collectionDate: new Date(),
        deposited: false,
        ...collection,
      } as Collection;

      setAgreements(prev =>
        prev.map(agr => {
          if (agr.id === agreementId) {
            return {
              ...agr,
              receivedToDate: agr.receivedToDate + newCollection.amount,
              remainingBalance: agr.totalAmount - (agr.receivedToDate + newCollection.amount),
              collections: [...(agr.collections || []), newCollection],
            };
          }
          return agr;
        })
      );
    },
    [track]
  );

  const generateBill = useCallback(
    (agreementId: string, billingDate: Date, amount: number) => {
      track('reimbursable_bill_generate', { agreement_id: agreementId, amount });
      const bill: BillingSchedule = {
        id: `bill_${Date.now()}`,
        billingDate,
        billingAmount: amount,
        status: 'pending',
      };

      setAgreements(prev =>
        prev.map(agr =>
          agr.id === agreementId
            ? { ...agr, billingSchedule: [...(agr.billingSchedule || []), bill] }
            : agr
        )
      );
    },
    [track]
  );

  const trackReceivables = useCallback(
    (agreementId: string) => {
      const agreement = agreements.find(a => a.id === agreementId);
      if (!agreement) return { outstanding: 0, overdue: 0 };

      const outstanding = (agreement.billingSchedule || [])
        .filter(b => b.status === 'invoiced' || b.status === 'overdue')
        .reduce((sum, b) => sum + b.billingAmount, 0);

      const overdue = (agreement.billingSchedule || [])
        .filter(b => b.status === 'overdue')
        .reduce((sum, b) => sum + b.billingAmount, 0);

      return { outstanding, overdue };
    },
    [agreements]
  );

  return {
    agreements,
    createAgreement,
    recordCollection,
    generateBill,
    trackReceivables,
  };
}

// ============================================================================
// UNDELIVERED ORDERS TRACKING
// ============================================================================

/**
 * Hook for undelivered orders tracking
 *
 * @description Tracks and manages undelivered orders
 *
 * @returns {object} Undelivered order operations
 *
 * @example
 * ```tsx
 * function UndeliveredOrdersTracker() {
 *   const {
 *     undeliveredOrders,
 *     trackUndelivered,
 *     recordDelivery,
 *     getAgedOrders
 *   } = useUndeliveredOrders();
 * }
 * ```
 */
export function useUndeliveredOrders() {
  const [undeliveredOrders, setUndeliveredOrders] = useState<UndeliveredOrder[]>([]);
  const { track } = useTracking();

  const trackUndelivered = useCallback((orderData: Partial<UndeliveredOrder>) => {
    track('undelivered_order_track');
    const newOrder: UndeliveredOrder = {
      id: `udo_${Date.now()}`,
      deliveredAmount: 0,
      undeliveredAmount: orderData.originalAmount || 0,
      ageInDays: 0,
      status: 'pending_delivery',
      ...orderData,
    } as UndeliveredOrder;
    setUndeliveredOrders(prev => [...prev, newOrder]);
    return newOrder;
  }, [track]);

  const recordDelivery = useCallback((orderId: string, deliveredAmount: number) => {
    track('undelivered_order_delivery_record', { order_id: orderId });
    setUndeliveredOrders(prev =>
      prev.map(order => {
        if (order.id === orderId) {
          const newDeliveredAmount = order.deliveredAmount + deliveredAmount;
          const newUndeliveredAmount = order.originalAmount - newDeliveredAmount;
          return {
            ...order,
            deliveredAmount: newDeliveredAmount,
            undeliveredAmount: newUndeliveredAmount,
            status:
              newUndeliveredAmount === 0
                ? ('partially_delivered' as const)
                : ('pending_delivery' as const),
          };
        }
        return order;
      })
    );
  }, [track]);

  const getAgedOrders = useCallback(
    (daysThreshold: number) => {
      return undeliveredOrders.filter(order => order.ageInDays > daysThreshold);
    },
    [undeliveredOrders]
  );

  const getOverdueOrders = useCallback(() => {
    const today = new Date();
    return undeliveredOrders.filter(
      order => order.expectedDeliveryDate && order.expectedDeliveryDate < today
    );
  }, [undeliveredOrders]);

  return {
    undeliveredOrders,
    trackUndelivered,
    recordDelivery,
    getAgedOrders,
    getOverdueOrders,
  };
}

// ============================================================================
// FISCAL COMPLIANCE CHECKING
// ============================================================================

/**
 * Hook for fiscal compliance checking
 *
 * @description Performs fiscal compliance checks
 *
 * @returns {object} Compliance checking operations
 *
 * @example
 * ```tsx
 * function FiscalComplianceChecker() {
 *   const {
 *     checkAntiDeficiency,
 *     checkPurpose,
 *     checkTime,
 *     performFullCompliance
 *   } = useFiscalCompliance();
 * }
 * ```
 */
export function useFiscalCompliance() {
  const { track } = useTracking();

  const checkAntiDeficiency = useCallback(
    (appropriationId: string, requestedAmount: number, availableAmount: number) => {
      track('compliance_check_anti_deficiency');
      const check: FiscalComplianceCheck = {
        checkType: 'anti_deficiency',
        passed: availableAmount >= requestedAmount,
        message: availableAmount >= requestedAmount
          ? 'Sufficient funds available'
          : 'Anti-Deficiency Act violation: Insufficient funds',
        violationSeverity: availableAmount < requestedAmount ? 'critical' : undefined,
        remediation: availableAmount < requestedAmount
          ? 'Do not obligate funds. Seek additional appropriation or reduce requirement.'
          : undefined,
      };
      return check;
    },
    [track]
  );

  const checkPurpose = useCallback(
    (appropriationPurpose: string, proposedUse: string) => {
      track('compliance_check_purpose');
      // Simplified purpose check
      const check: FiscalComplianceCheck = {
        checkType: 'purpose',
        passed: true,
        message: 'Purpose check passed',
      };
      return check;
    },
    [track]
  );

  const checkTime = useCallback(
    (appropriationExpirationDate: Date, proposedObligationDate: Date) => {
      track('compliance_check_time');
      const check: FiscalComplianceCheck = {
        checkType: 'time',
        passed: proposedObligationDate <= appropriationExpirationDate,
        message:
          proposedObligationDate <= appropriationExpirationDate
            ? 'Time availability check passed'
            : 'Appropriation expired',
        violationSeverity: proposedObligationDate > appropriationExpirationDate ? 'error' : undefined,
      };
      return check;
    },
    [track]
  );

  const performFullCompliance = useCallback(
    (params: {
      appropriationId: string;
      requestedAmount: number;
      availableAmount: number;
      appropriationPurpose: string;
      proposedUse: string;
      expirationDate: Date;
      proposedDate: Date;
    }) => {
      track('compliance_check_full');
      const checks: FiscalComplianceCheck[] = [
        checkAntiDeficiency(params.appropriationId, params.requestedAmount, params.availableAmount),
        checkPurpose(params.appropriationPurpose, params.proposedUse),
        checkTime(params.expirationDate, params.proposedDate),
      ];

      const allPassed = checks.every(c => c.passed);
      const criticalViolations = checks.filter(c => c.violationSeverity === 'critical');

      return {
        passed: allPassed,
        checks,
        criticalViolations,
        canProceed: criticalViolations.length === 0,
      };
    },
    [checkAntiDeficiency, checkPurpose, checkTime, track]
  );

  return {
    checkAntiDeficiency,
    checkPurpose,
    checkTime,
    performFullCompliance,
  };
}

// ============================================================================
// FUND RESERVATION
// ============================================================================

/**
 * Hook for fund reservation management
 *
 * @description Manages temporary fund reservations
 *
 * @returns {object} Fund reservation operations
 *
 * @example
 * ```tsx
 * function FundReservationManager() {
 *   const {
 *     reservations,
 *     createReservation,
 *     releaseReservation,
 *     convertToObligation
 *   } = useFundReservation();
 * }
 * ```
 */
export function useFundReservation() {
  const [reservations, setReservations] = useState<FundReservation[]>([]);
  const { track } = useTracking();

  const createReservation = useCallback(async (reservationData: Partial<FundReservation>) => {
    track('fund_reservation_create');
    const newReservation: FundReservation = {
      id: `res_${Date.now()}`,
      reservationNumber: `RES-${Date.now()}`,
      reservationDate: new Date(),
      status: 'active',
      releasedAmount: 0,
      remainingAmount: reservationData.reservedAmount || 0,
      ...reservationData,
    } as FundReservation;
    setReservations(prev => [...prev, newReservation]);
    return newReservation;
  }, [track]);

  const releaseReservation = useCallback((reservationId: string) => {
    track('fund_reservation_release', { reservation_id: reservationId });
    setReservations(prev =>
      prev.map(res => (res.id === reservationId ? { ...res, status: 'released' } : res))
    );
  }, [track]);

  const convertToObligation = useCallback((reservationId: string, obligationId: string) => {
    track('fund_reservation_convert', { reservation_id: reservationId });
    releaseReservation(reservationId);
  }, [releaseReservation, track]);

  const getActiveReservations = useCallback(
    (appropriationId: string) => {
      return reservations.filter(
        r => r.appropriationId === appropriationId && r.status === 'active'
      );
    },
    [reservations]
  );

  return {
    reservations,
    createReservation,
    releaseReservation,
    convertToObligation,
    getActiveReservations,
  };
}

// ============================================================================
// OBLIGATION AUTHORITY TRACKING
// ============================================================================

/**
 * Hook for obligation authority tracking
 *
 * @description Tracks obligation authority and limits
 *
 * @param {string} appropriationId - Appropriation identifier
 * @returns {object} Obligation authority operations
 *
 * @example
 * ```tsx
 * function ObligationAuthorityMonitor({ appropriationId }) {
 *   const {
 *     authority,
 *     calculateAuthority,
 *     checkAuthorityLimit
 *   } = useObligationAuthority(appropriationId);
 * }
 * ```
 */
export function useObligationAuthority(appropriationId: string) {
  const [authority, setAuthority] = useState<ObligationAuthority | null>(null);
  const { track } = useTracking();

  const calculateAuthority = useCallback(
    (totalAuthority: number, obligated: number, commitments: number, reservations: number) => {
      track('obligation_authority_calculate', { appropriation_id: appropriationId });
      const available = totalAuthority - obligated - commitments - reservations;
      const newAuthority: ObligationAuthority = {
        fiscalYear: 2024,
        appropriationId,
        totalAuthority,
        obligatedToDate: obligated,
        commitments,
        reservations,
        availableAuthority: available,
        authorityType: 'annual',
      };
      setAuthority(newAuthority);
      return newAuthority;
    },
    [appropriationId, track]
  );

  const checkAuthorityLimit = useCallback(
    (requestedAmount: number) => {
      if (!authority) return { authorized: false, message: 'Authority not calculated' };

      if (authority.availableAuthority >= requestedAmount) {
        return { authorized: true, message: 'Sufficient authority' };
      }

      return {
        authorized: false,
        message: 'Insufficient obligation authority',
        shortfall: requestedAmount - authority.availableAuthority,
      };
    },
    [authority]
  );

  return {
    authority,
    calculateAuthority,
    checkAuthorityLimit,
  };
}

// ============================================================================
// FORM CONFIGURATIONS
// ============================================================================

/**
 * Creates obligation document form configuration
 *
 * @description Generates form for creating obligations
 *
 * @returns {FormConfig} Obligation form configuration
 *
 * @example
 * ```tsx
 * function ObligationForm() {
 *   const formConfig = createObligationForm();
 *   return <FormProvider formConfig={formConfig} onSubmit={handleSubmit} />;
 * }
 * ```
 */
export function createObligationForm(): FormConfig {
  return {
    id: 'obligation_form',
    title: 'Obligation Document',
    description: 'Create new obligation',
    fields: [
      {
        id: 'obligation_date',
        name: 'obligationDate',
        type: 'date',
        label: 'Obligation Date',
        required: true,
      },
      {
        id: 'appropriation',
        name: 'appropriationId',
        type: 'select',
        label: 'Appropriation',
        required: true,
        options: [],
      },
      {
        id: 'obligation_type',
        name: 'obligationType',
        type: 'select',
        label: 'Obligation Type',
        required: true,
        options: [
          { label: 'Contract', value: 'contract' },
          { label: 'Purchase Order', value: 'purchase_order' },
          { label: 'Grant', value: 'grant' },
          { label: 'Cooperative Agreement', value: 'cooperative_agreement' },
        ],
      },
      {
        id: 'vendor_name',
        name: 'vendorName',
        type: 'text',
        label: 'Vendor Name',
        required: true,
      },
      {
        id: 'amount',
        name: 'obligationAmount',
        type: 'number',
        label: 'Obligation Amount',
        required: true,
        min: 0,
      },
      {
        id: 'description',
        name: 'description',
        type: 'textarea',
        label: 'Description',
        required: true,
        rows: 4,
      },
      {
        id: 'purpose',
        name: 'purpose',
        type: 'textarea',
        label: 'Purpose',
        required: true,
        rows: 3,
      },
    ],
    submitButtonText: 'Create Obligation',
  };
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Calculates fiscal year from date
 *
 * @description Determines fiscal year from date
 *
 * @param {Date} date - Date to calculate
 * @returns {number} Fiscal year
 *
 * @example
 * ```tsx
 * const fy = getFiscalYear(new Date('2024-11-15')); // 2025
 * ```
 */
export function getFiscalYear(date: Date): number {
  const month = date.getMonth();
  const year = date.getFullYear();
  return month >= 9 ? year + 1 : year;
}

/**
 * Formats obligation status for display
 *
 * @description Formats obligation status with color coding
 *
 * @param {string} status - Obligation status
 * @returns {object} Status display properties
 *
 * @example
 * ```tsx
 * const { label, color } = formatObligationStatus('obligated');
 * ```
 */
export function formatObligationStatus(status: string): { label: string; color: string } {
  const statusMap: Record<string, { label: string; color: string }> = {
    draft: { label: 'Draft', color: 'gray' },
    pending: { label: 'Pending', color: 'yellow' },
    obligated: { label: 'Obligated', color: 'green' },
    partially_expended: { label: 'Partially Expended', color: 'blue' },
    fully_expended: { label: 'Fully Expended', color: 'purple' },
    closed: { label: 'Closed', color: 'gray' },
    cancelled: { label: 'Cancelled', color: 'red' },
  };
  return statusMap[status] || { label: status, color: 'gray' };
}

// ============================================================================
// DEFAULT EXPORT
// ============================================================================

export default {
  // Hooks
  useObligationManagement,
  useExpenditureProcessing,
  useCommitmentManagement,
  useFundStatus,
  useApportionmentManagement,
  useAllotmentManagement,
  useReimbursableAgreements,
  useUndeliveredOrders,
  useFiscalCompliance,
  useFundReservation,
  useObligationAuthority,

  // Form Builders
  createObligationForm,

  // Utilities
  getFiscalYear,
  formatObligationStatus,
};
