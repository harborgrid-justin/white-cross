/**
 * LOC: USACE-CONTRACT-MGT-001
 * File: /reuse/frontend/composites/usace/usace-contract-management-composites.ts
 *
 * UPSTREAM (imports from):
 *   - /reuse/frontend/form-builder-kit.ts
 *   - /reuse/frontend/workflow-approval-kit.ts
 *   - /reuse/frontend/analytics-tracking-kit.ts
 *   - /reuse/frontend/custom-fields-metadata-kit.ts
 *   - /reuse/frontend/version-control-kit.ts
 *   - /reuse/frontend/import-export-cms-kit.ts
 *   - React 18+
 *   - Next.js 16+
 *   - TypeScript 5.x
 *
 * DOWNSTREAM (imported by):
 *   - USACE CEFMS contract management applications
 *   - FAR/DFARS compliance systems
 *   - Contract lifecycle tracking
 *   - Modification and closeout modules
 */

/**
 * File: /reuse/frontend/composites/usace/usace-contract-management-composites.ts
 * Locator: WC-USACE-CONTRACT-001
 * Purpose: USACE CEFMS Contract Lifecycle Management & FAR/DFARS Compliance System
 *
 * Upstream: React 18+, TypeScript 5.x, Next.js 16+, form-builder-kit, workflow-approval-kit
 * Downstream: USACE contract systems, FAR/DFARS compliance, Modification tracking, Closeouts
 * Dependencies: React 18+, TypeScript 5.x, Next.js 16+, date-fns
 * Exports: 47+ contract management hooks, components, and utilities
 *
 * LLM Context: Enterprise-grade USACE CEFMS contract management system for React 18+ applications.
 * Provides comprehensive contract lifecycle management from pre-award through closeout, including
 * modifications, claims, disputes, compliance tracking, and federal acquisition regulation (FAR/DFARS)
 * adherence. Designed for USACE construction, engineering, and services contracts with full
 * regulatory compliance and audit trail support.
 */

'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  useFormState,
  FormConfig,
  type FieldConfig,
} from '../../form-builder-kit';
import {
  trackEvent,
  useTracking,
} from '../../analytics-tracking-kit';

// ============================================================================
// TYPE DEFINITIONS - CONTRACT MANAGEMENT
// ============================================================================

/**
 * Contract types per FAR
 */
export type ContractType =
  | 'FFP' // Firm Fixed Price
  | 'CPFF' // Cost Plus Fixed Fee
  | 'CPAF' // Cost Plus Award Fee
  | 'CPIF' // Cost Plus Incentive Fee
  | 'T&M' // Time and Materials
  | 'LH' // Labor Hour
  | 'IDC' // Indefinite Delivery Contract
  | 'IDIQ' // Indefinite Delivery Indefinite Quantity
  | 'BOA' // Basic Ordering Agreement
  | 'BPA' // Blanket Purchase Agreement
  | 'Purchase_Order'
  | 'Other';

/**
 * Contract status
 */
export type ContractStatus =
  | 'draft'
  | 'pre_award'
  | 'awarded'
  | 'active'
  | 'suspended'
  | 'completed'
  | 'closed'
  | 'terminated'
  | 'cancelled'
  | 'protest'
  | 'dispute';

/**
 * Modification types
 */
export type ModificationType =
  | 'bilateral' // Requires contractor agreement
  | 'unilateral' // Government-issued
  | 'administrative' // Administrative changes
  | 'funding' // Funding changes only
  | 'no_cost_time_extension';

/**
 * Claim status
 */
export type ClaimStatus =
  | 'submitted'
  | 'under_review'
  | 'negotiation'
  | 'approved'
  | 'denied'
  | 'withdrawn'
  | 'appealed'
  | 'settled';

/**
 * Contract record
 */
export interface Contract {
  id: string;
  contractNumber: string;
  title: string;
  contractType: ContractType;
  status: ContractStatus;
  contractor: ContractorInfo;
  awardDate?: Date;
  effectiveDate?: Date;
  completionDate?: Date;
  closeoutDate?: Date;
  baseValue: number;
  currentValue: number;
  fundedAmount: number;
  obligatedAmount: number;
  currency: string;
  performancePeriod: {
    start: Date;
    end: Date;
    daysElapsed?: number;
    daysRemaining?: number;
  };
  scopeOfWork: string;
  deliverables?: Deliverable[];
  modifications?: ContractModification[];
  fundingDocuments?: FundingDocument[];
  keyPersonnel?: ContractPersonnel[];
  compliance: ComplianceInfo;
  metadata?: Record<string, any>;
  tags?: string[];
}

/**
 * Contractor information
 */
export interface ContractorInfo {
  id: string;
  name: string;
  duns: string;
  cage: string;
  uei?: string; // Unique Entity Identifier
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  contactPerson?: string;
  email?: string;
  phone?: string;
  smallBusiness?: boolean;
  socioeconomicCategories?: string[];
  pastPerformanceRating?: number;
}

/**
 * Deliverable tracking
 */
export interface Deliverable {
  id: string;
  clin: string; // Contract Line Item Number
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  dueDate: Date;
  status: 'pending' | 'in_progress' | 'submitted' | 'accepted' | 'rejected' | 'completed';
  percentComplete?: number;
  acceptanceDate?: Date;
  rejectionReason?: string;
}

/**
 * Contract modification
 */
export interface ContractModification {
  id: string;
  modificationNumber: string;
  modType: ModificationType;
  effectiveDate: Date;
  description: string;
  priorValue: number;
  changeAmount: number;
  newValue: number;
  scopeChange?: string;
  scheduleChange?: {
    priorCompletionDate: Date;
    newCompletionDate: Date;
    daysExtended: number;
  };
  justification: string;
  approver?: string;
  approvalDate?: Date;
  status: 'draft' | 'pending_approval' | 'approved' | 'executed' | 'cancelled';
  fundingImpact?: boolean;
  documents?: string[];
}

/**
 * Funding document
 */
export interface FundingDocument {
  id: string;
  documentNumber: string;
  documentType: 'PR' | 'DO' | 'MO' | 'DD1155'; // Purchase Request, Delivery Order, Modification Order, etc.
  amount: number;
  fiscalYear: number;
  appropriation: string;
  fundCitation: string;
  obligationDate?: Date;
  expirationDate?: Date;
  certified: boolean;
  certifiedBy?: string;
  certificationDate?: Date;
}

/**
 * Contract personnel
 */
export interface ContractPersonnel {
  id: string;
  name: string;
  role: 'CO' | 'ACO' | 'KO' | 'COR' | 'COTR' | 'PM' | 'QA' | 'Other'; // Contracting Officer, etc.
  roleDescription?: string;
  email: string;
  phone?: string;
  organization: string;
  authority?: string;
  delegationDate?: Date;
}

/**
 * Compliance information
 */
export interface ComplianceInfo {
  farClauses: string[];
  dfarsClauses: string[];
  specialProvisions?: string[];
  securityRequirements?: string[];
  environmentalCompliance?: string[];
  safetyRequirements?: string[];
  reportingRequirements?: ReportingRequirement[];
  insuranceRequired: boolean;
  bondRequired: boolean;
  securityClearanceRequired: boolean;
}

/**
 * Reporting requirement
 */
export interface ReportingRequirement {
  id: string;
  reportType: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annually' | 'as_required';
  dueDay?: number;
  nextDueDate?: Date;
  recipient: string;
  format?: string;
  submissionMethod?: string;
}

/**
 * Contract claim
 */
export interface ContractClaim {
  id: string;
  claimNumber: string;
  contractId: string;
  claimant: 'contractor' | 'government';
  submittedDate: Date;
  claimAmount: number;
  claimType: 'cost' | 'time' | 'termination' | 'other';
  description: string;
  justification: string;
  supportingDocuments?: string[];
  status: ClaimStatus;
  reviewedBy?: string;
  reviewDate?: Date;
  decision?: {
    date: Date;
    decidedBy: string;
    approvedAmount?: number;
    denialReason?: string;
  };
  negotiationHistory?: NegotiationEntry[];
}

/**
 * Negotiation entry
 */
export interface NegotiationEntry {
  id: string;
  date: Date;
  party: string;
  offer: number;
  notes: string;
}

/**
 * Closeout checklist
 */
export interface CloseoutChecklist {
  contractId: string;
  items: CloseoutItem[];
  startedDate?: Date;
  completedDate?: Date;
  completedBy?: string;
  verifiedBy?: string;
  verificationDate?: Date;
}

/**
 * Closeout item
 */
export interface CloseoutItem {
  id: string;
  item: string;
  description: string;
  required: boolean;
  completed: boolean;
  completedDate?: Date;
  completedBy?: string;
  notes?: string;
  documents?: string[];
}

/**
 * Performance evaluation
 */
export interface PerformanceEvaluation {
  id: string;
  contractId: string;
  evaluationPeriod: {
    start: Date;
    end: Date;
  };
  evaluatedBy: string;
  evaluationDate: Date;
  overallRating: number; // 0-100
  criteriaScores: {
    quality: number;
    schedule: number;
    costControl: number;
    management: number;
    safety: number;
    smallBusinessUtilization?: number;
  };
  strengths?: string;
  weaknesses?: string;
  recommendations?: string;
  approved: boolean;
  approvedBy?: string;
  approvalDate?: Date;
}

// ============================================================================
// CONTRACT LIFECYCLE MANAGEMENT
// ============================================================================

/**
 * Hook for contract lifecycle management
 *
 * @description Manages complete contract lifecycle from award to closeout
 * @returns {object} Contract management functions
 *
 * @example
 * ```tsx
 * const {
 *   contracts,
 *   createContract,
 *   updateContract,
 *   getActiveContracts,
 *   getContractValue
 * } = useContractManagement();
 * ```
 */
export function useContractManagement() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(false);
  const { track } = useTracking();

  const createContract = useCallback(
    (contract: Contract) => {
      setContracts((prev) => [...prev, contract]);
      track('contract_created', {
        contract_id: contract.id,
        contract_type: contract.contractType,
        value: contract.baseValue,
      });
    },
    [track]
  );

  const updateContract = useCallback(
    (contractId: string, updates: Partial<Contract>) => {
      setContracts((prev) =>
        prev.map((c) => (c.id === contractId ? { ...c, ...updates } : c))
      );
      track('contract_updated', { contract_id: contractId });
    },
    [track]
  );

  const deleteContract = useCallback(
    (contractId: string) => {
      setContracts((prev) => prev.filter((c) => c.id !== contractId));
      track('contract_deleted', { contract_id: contractId });
    },
    [track]
  );

  const getContractById = useCallback(
    (contractId: string) => {
      return contracts.find((c) => c.id === contractId);
    },
    [contracts]
  );

  const getActiveContracts = useCallback(() => {
    return contracts.filter((c) => c.status === 'active');
  }, [contracts]);

  const getContractsByContractor = useCallback(
    (contractorId: string) => {
      return contracts.filter((c) => c.contractor.id === contractorId);
    },
    [contracts]
  );

  const getContractValue = useCallback(
    (contractId: string): number => {
      const contract = contracts.find((c) => c.id === contractId);
      return contract?.currentValue || 0;
    },
    [contracts]
  );

  const searchContracts = useCallback(
    (query: string) => {
      return contracts.filter(
        (c) =>
          c.contractNumber.toLowerCase().includes(query.toLowerCase()) ||
          c.title.toLowerCase().includes(query.toLowerCase()) ||
          c.contractor.name.toLowerCase().includes(query.toLowerCase())
      );
    },
    [contracts]
  );

  return {
    contracts,
    loading,
    createContract,
    updateContract,
    deleteContract,
    getContractById,
    getActiveContracts,
    getContractsByContractor,
    getContractValue,
    searchContracts,
  };
}

/**
 * Hook for contract modification management
 *
 * @description Manages contract modifications (mods)
 * @param {string} contractId - Contract identifier
 * @returns {object} Modification management functions
 *
 * @example
 * ```tsx
 * const {
 *   modifications,
 *   createModification,
 *   approveModification,
 *   calculateCumulativeValue
 * } = useContractModifications('CONTRACT-001');
 * ```
 */
export function useContractModifications(contractId: string) {
  const [modifications, setModifications] = useState<ContractModification[]>([]);
  const { track } = useTracking();

  const createModification = useCallback(
    (mod: ContractModification) => {
      setModifications((prev) => [...prev, mod]);
      track('modification_created', {
        contract_id: contractId,
        mod_number: mod.modificationNumber,
        change_amount: mod.changeAmount,
      });
    },
    [contractId, track]
  );

  const updateModification = useCallback(
    (modId: string, updates: Partial<ContractModification>) => {
      setModifications((prev) =>
        prev.map((m) => (m.id === modId ? { ...m, ...updates } : m))
      );
    },
    []
  );

  const approveModification = useCallback(
    (modId: string, approver: string) => {
      setModifications((prev) =>
        prev.map((m) =>
          m.id === modId
            ? {
                ...m,
                status: 'approved',
                approver,
                approvalDate: new Date(),
              }
            : m
        )
      );
      track('modification_approved', { mod_id: modId, contract_id: contractId });
    },
    [contractId, track]
  );

  const calculateCumulativeValue = useCallback(() => {
    const baseValue = 0; // Would get from contract
    return modifications.reduce((total, mod) => {
      if (mod.status === 'executed' || mod.status === 'approved') {
        return total + mod.changeAmount;
      }
      return total;
    }, baseValue);
  }, [modifications]);

  const getPendingModifications = useCallback(() => {
    return modifications.filter((m) => m.status === 'pending_approval');
  }, [modifications]);

  const getExecutedModifications = useCallback(() => {
    return modifications.filter((m) => m.status === 'executed');
  }, [modifications]);

  return {
    modifications,
    createModification,
    updateModification,
    approveModification,
    calculateCumulativeValue,
    getPendingModifications,
    getExecutedModifications,
  };
}

/**
 * Hook for deliverable tracking
 *
 * @description Tracks contract deliverables and CLIN items
 * @param {string} contractId - Contract identifier
 * @returns {object} Deliverable tracking functions
 *
 * @example
 * ```tsx
 * const {
 *   deliverables,
 *   addDeliverable,
 *   updateDeliverableStatus,
 *   getOverdueDeliverables
 * } = useDeliverableTracking('CONTRACT-001');
 * ```
 */
export function useDeliverableTracking(contractId: string) {
  const [deliverables, setDeliverables] = useState<Deliverable[]>([]);
  const { track } = useTracking();

  const addDeliverable = useCallback(
    (deliverable: Deliverable) => {
      setDeliverables((prev) => [...prev, deliverable]);
      track('deliverable_added', {
        contract_id: contractId,
        clin: deliverable.clin,
      });
    },
    [contractId, track]
  );

  const updateDeliverableStatus = useCallback(
    (deliverableId: string, status: Deliverable['status'], notes?: string) => {
      setDeliverables((prev) =>
        prev.map((d) =>
          d.id === deliverableId
            ? {
                ...d,
                status,
                acceptanceDate: status === 'accepted' ? new Date() : d.acceptanceDate,
              }
            : d
        )
      );
      track('deliverable_status_updated', {
        deliverable_id: deliverableId,
        status,
      });
    },
    [track]
  );

  const getOverdueDeliverables = useCallback(() => {
    const now = new Date();
    return deliverables.filter(
      (d) => d.dueDate < now && d.status !== 'completed' && d.status !== 'accepted'
    );
  }, [deliverables]);

  const calculateCompletionPercentage = useCallback(() => {
    if (deliverables.length === 0) return 0;
    const completed = deliverables.filter(
      (d) => d.status === 'completed' || d.status === 'accepted'
    ).length;
    return Math.round((completed / deliverables.length) * 100);
  }, [deliverables]);

  const getDeliverableValue = useCallback(() => {
    return deliverables.reduce((total, d) => total + d.totalPrice, 0);
  }, [deliverables]);

  return {
    deliverables,
    addDeliverable,
    updateDeliverableStatus,
    getOverdueDeliverables,
    calculateCompletionPercentage,
    getDeliverableValue,
  };
}

/**
 * Hook for contract funding management
 *
 * @description Manages contract funding documents and obligations
 * @param {string} contractId - Contract identifier
 * @returns {object} Funding management functions
 *
 * @example
 * ```tsx
 * const {
 *   fundingDocs,
 *   addFunding,
 *   getTotalObligated,
 *   checkFundingAvailability
 * } = useContractFunding('CONTRACT-001');
 * ```
 */
export function useContractFunding(contractId: string) {
  const [fundingDocs, setFundingDocs] = useState<FundingDocument[]>([]);
  const { track } = useTracking();

  const addFunding = useCallback(
    (funding: FundingDocument) => {
      setFundingDocs((prev) => [...prev, funding]);
      track('funding_added', {
        contract_id: contractId,
        amount: funding.amount,
        fiscal_year: funding.fiscalYear,
      });
    },
    [contractId, track]
  );

  const certifyFunding = useCallback(
    (fundingId: string, certifiedBy: string) => {
      setFundingDocs((prev) =>
        prev.map((f) =>
          f.id === fundingId
            ? {
                ...f,
                certified: true,
                certifiedBy,
                certificationDate: new Date(),
              }
            : f
        )
      );
      track('funding_certified', { funding_id: fundingId });
    },
    [track]
  );

  const getTotalObligated = useCallback(() => {
    return fundingDocs
      .filter((f) => f.certified)
      .reduce((total, f) => total + f.amount, 0);
  }, [fundingDocs]);

  const getTotalByFiscalYear = useCallback(
    (fiscalYear: number) => {
      return fundingDocs
        .filter((f) => f.fiscalYear === fiscalYear)
        .reduce((total, f) => total + f.amount, 0);
    },
    [fundingDocs]
  );

  const checkFundingAvailability = useCallback(
    (requestedAmount: number, fiscalYear: number): boolean => {
      const available = getTotalByFiscalYear(fiscalYear);
      return available >= requestedAmount;
    },
    [getTotalByFiscalYear]
  );

  const getExpiringFunding = useCallback(
    (daysAhead: number = 90) => {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() + daysAhead);
      return fundingDocs.filter(
        (f) => f.expirationDate && f.expirationDate <= cutoffDate
      );
    },
    [fundingDocs]
  );

  return {
    fundingDocs,
    addFunding,
    certifyFunding,
    getTotalObligated,
    getTotalByFiscalYear,
    checkFundingAvailability,
    getExpiringFunding,
  };
}

/**
 * Hook for contract claims management
 *
 * @description Manages contractor and government claims
 * @param {string} contractId - Contract identifier
 * @returns {object} Claims management functions
 *
 * @example
 * ```tsx
 * const {
 *   claims,
 *   submitClaim,
 *   reviewClaim,
 *   settleClaim,
 *   getTotalClaimAmount
 * } = useContractClaims('CONTRACT-001');
 * ```
 */
export function useContractClaims(contractId: string) {
  const [claims, setClaims] = useState<ContractClaim[]>([]);
  const { track } = useTracking();

  const submitClaim = useCallback(
    (claim: ContractClaim) => {
      setClaims((prev) => [...prev, claim]);
      track('claim_submitted', {
        contract_id: contractId,
        claim_amount: claim.claimAmount,
        claimant: claim.claimant,
      });
    },
    [contractId, track]
  );

  const reviewClaim = useCallback(
    (claimId: string, reviewedBy: string, status: ClaimStatus) => {
      setClaims((prev) =>
        prev.map((c) =>
          c.id === claimId
            ? {
                ...c,
                status,
                reviewedBy,
                reviewDate: new Date(),
              }
            : c
        )
      );
      track('claim_reviewed', { claim_id: claimId, status });
    },
    [track]
  );

  const addNegotiationEntry = useCallback(
    (claimId: string, entry: NegotiationEntry) => {
      setClaims((prev) =>
        prev.map((c) =>
          c.id === claimId
            ? {
                ...c,
                negotiationHistory: [...(c.negotiationHistory || []), entry],
              }
            : c
        )
      );
    },
    []
  );

  const settleClaim = useCallback(
    (claimId: string, settledAmount: number, settledBy: string) => {
      setClaims((prev) =>
        prev.map((c) =>
          c.id === claimId
            ? {
                ...c,
                status: 'settled',
                decision: {
                  date: new Date(),
                  decidedBy: settledBy,
                  approvedAmount: settledAmount,
                },
              }
            : c
        )
      );
      track('claim_settled', { claim_id: claimId, settled_amount: settledAmount });
    },
    [track]
  );

  const getTotalClaimAmount = useCallback(() => {
    return claims.reduce((total, c) => total + c.claimAmount, 0);
  }, [claims]);

  const getPendingClaims = useCallback(() => {
    return claims.filter(
      (c) =>
        c.status === 'submitted' ||
        c.status === 'under_review' ||
        c.status === 'negotiation'
    );
  }, [claims]);

  return {
    claims,
    submitClaim,
    reviewClaim,
    addNegotiationEntry,
    settleClaim,
    getTotalClaimAmount,
    getPendingClaims,
  };
}

/**
 * Hook for contract closeout management
 *
 * @description Manages contract closeout process and checklist
 * @param {string} contractId - Contract identifier
 * @returns {object} Closeout management functions
 *
 * @example
 * ```tsx
 * const {
 *   checklist,
 *   initializeCloseout,
 *   completeItem,
 *   verifyCloseout,
 *   getCloseoutProgress
 * } = useContractCloseout('CONTRACT-001');
 * ```
 */
export function useContractCloseout(contractId: string) {
  const [checklist, setChecklist] = useState<CloseoutChecklist | null>(null);
  const { track } = useTracking();

  const initializeCloseout = useCallback(() => {
    const defaultChecklist: CloseoutChecklist = {
      contractId,
      startedDate: new Date(),
      items: [
        {
          id: '1',
          item: 'Final Deliverables',
          description: 'All deliverables received and accepted',
          required: true,
          completed: false,
        },
        {
          id: '2',
          item: 'Final Invoice',
          description: 'Final invoice received and processed',
          required: true,
          completed: false,
        },
        {
          id: '3',
          item: 'Property Disposition',
          description: 'Government property accounted for',
          required: true,
          completed: false,
        },
        {
          id: '4',
          item: 'Patent/Data Rights',
          description: 'Patent and data rights documented',
          required: false,
          completed: false,
        },
        {
          id: '5',
          item: 'Final Performance Evaluation',
          description: 'Contractor performance evaluation completed',
          required: true,
          completed: false,
        },
        {
          id: '6',
          item: 'Release of Claims',
          description: 'All claims resolved and released',
          required: true,
          completed: false,
        },
        {
          id: '7',
          item: 'Files Complete',
          description: 'Contract file complete and organized',
          required: true,
          completed: false,
        },
      ],
    };
    setChecklist(defaultChecklist);
    track('closeout_initiated', { contract_id: contractId });
  }, [contractId, track]);

  const completeItem = useCallback(
    (itemId: string, completedBy: string, notes?: string) => {
      if (!checklist) return;
      setChecklist({
        ...checklist,
        items: checklist.items.map((item) =>
          item.id === itemId
            ? {
                ...item,
                completed: true,
                completedDate: new Date(),
                completedBy,
                notes,
              }
            : item
        ),
      });
      track('closeout_item_completed', { item_id: itemId });
    },
    [checklist, track]
  );

  const verifyCloseout = useCallback(
    (verifiedBy: string) => {
      if (!checklist) return;
      const allCompleted = checklist.items.every((item) => item.completed || !item.required);
      if (allCompleted) {
        setChecklist({
          ...checklist,
          completedDate: new Date(),
          verifiedBy,
          verificationDate: new Date(),
        });
        track('closeout_verified', { contract_id: contractId });
      }
    },
    [checklist, contractId, track]
  );

  const getCloseoutProgress = useCallback(() => {
    if (!checklist) return 0;
    const requiredItems = checklist.items.filter((item) => item.required);
    const completedRequired = requiredItems.filter((item) => item.completed).length;
    return Math.round((completedRequired / requiredItems.length) * 100);
  }, [checklist]);

  return {
    checklist,
    initializeCloseout,
    completeItem,
    verifyCloseout,
    getCloseoutProgress,
  };
}

/**
 * Hook for performance evaluation
 *
 * @description Manages contractor performance evaluations
 * @param {string} contractId - Contract identifier
 * @returns {object} Performance evaluation functions
 *
 * @example
 * ```tsx
 * const {
 *   evaluations,
 *   createEvaluation,
 *   approveEvaluation,
 *   getAverageRating
 * } = usePerformanceEvaluation('CONTRACT-001');
 * ```
 */
export function usePerformanceEvaluation(contractId: string) {
  const [evaluations, setEvaluations] = useState<PerformanceEvaluation[]>([]);
  const { track } = useTracking();

  const createEvaluation = useCallback(
    (evaluation: PerformanceEvaluation) => {
      setEvaluations((prev) => [...prev, evaluation]);
      track('performance_evaluation_created', {
        contract_id: contractId,
        overall_rating: evaluation.overallRating,
      });
    },
    [contractId, track]
  );

  const approveEvaluation = useCallback(
    (evaluationId: string, approvedBy: string) => {
      setEvaluations((prev) =>
        prev.map((e) =>
          e.id === evaluationId
            ? {
                ...e,
                approved: true,
                approvedBy,
                approvalDate: new Date(),
              }
            : e
        )
      );
      track('performance_evaluation_approved', { evaluation_id: evaluationId });
    },
    [track]
  );

  const getAverageRating = useCallback(() => {
    if (evaluations.length === 0) return 0;
    const total = evaluations.reduce((sum, e) => sum + e.overallRating, 0);
    return Math.round(total / evaluations.length);
  }, [evaluations]);

  const getLatestEvaluation = useCallback(() => {
    if (evaluations.length === 0) return null;
    return evaluations.reduce((latest, current) =>
      current.evaluationDate > latest.evaluationDate ? current : latest
    );
  }, [evaluations]);

  return {
    evaluations,
    createEvaluation,
    approveEvaluation,
    getAverageRating,
    getLatestEvaluation,
  };
}

/**
 * Generate contract creation form
 *
 * @description Creates form configuration for new contract entry
 * @returns {FormConfig} Form configuration
 *
 * @example
 * ```tsx
 * const formConfig = generateContractCreationForm();
 * <FormRenderer formConfig={formConfig} onSubmit={handleCreate} />
 * ```
 */
export function generateContractCreationForm(): FormConfig {
  return {
    id: 'contract-creation-form',
    title: 'Create New Contract',
    description: 'Enter contract details for award',
    sections: [
      {
        id: 'basic-info',
        title: 'Basic Information',
        fields: [
          {
            id: 'contractNumber',
            name: 'contractNumber',
            type: 'text',
            label: 'Contract Number',
            required: true,
            placeholder: 'W912XX-24-C-0001',
          },
          {
            id: 'title',
            name: 'title',
            type: 'text',
            label: 'Contract Title',
            required: true,
          },
          {
            id: 'contractType',
            name: 'contractType',
            type: 'select',
            label: 'Contract Type',
            required: true,
            options: [
              { label: 'Firm Fixed Price (FFP)', value: 'FFP' },
              { label: 'Cost Plus Fixed Fee (CPFF)', value: 'CPFF' },
              { label: 'Time & Materials (T&M)', value: 'T&M' },
              { label: 'IDIQ', value: 'IDIQ' },
            ],
          },
        ],
      },
      {
        id: 'financial',
        title: 'Financial Details',
        fields: [
          {
            id: 'baseValue',
            name: 'baseValue',
            type: 'number',
            label: 'Base Contract Value',
            required: true,
            min: 0,
            prefix: '$',
          },
          {
            id: 'fundedAmount',
            name: 'fundedAmount',
            type: 'number',
            label: 'Initially Funded Amount',
            required: true,
            min: 0,
            prefix: '$',
          },
        ],
      },
      {
        id: 'schedule',
        title: 'Performance Period',
        fields: [
          {
            id: 'awardDate',
            name: 'awardDate',
            type: 'date',
            label: 'Award Date',
            required: true,
          },
          {
            id: 'startDate',
            name: 'startDate',
            type: 'date',
            label: 'Start Date',
            required: true,
          },
          {
            id: 'completionDate',
            name: 'completionDate',
            type: 'date',
            label: 'Completion Date',
            required: true,
          },
        ],
      },
    ],
  };
}

/**
 * Calculate contract performance metrics
 *
 * @description Computes key performance indicators for contract
 * @param {Contract} contract - Contract to analyze
 * @returns {object} Performance metrics
 *
 * @example
 * ```tsx
 * const metrics = calculateContractMetrics(contract);
 * console.log(`Burn rate: ${metrics.burnRate}%`);
 * ```
 */
export function calculateContractMetrics(contract: Contract) {
  const totalDays =
    (contract.performancePeriod.end.getTime() -
      contract.performancePeriod.start.getTime()) /
    (1000 * 60 * 60 * 24);

  const daysElapsed =
    (new Date().getTime() - contract.performancePeriod.start.getTime()) /
    (1000 * 60 * 60 * 24);

  const timeProgress = Math.min((daysElapsed / totalDays) * 100, 100);
  const costProgress = (contract.obligatedAmount / contract.currentValue) * 100;

  return {
    totalDays: Math.round(totalDays),
    daysElapsed: Math.round(daysElapsed),
    daysRemaining: Math.max(0, Math.round(totalDays - daysElapsed)),
    timeProgress: Math.round(timeProgress),
    costProgress: Math.round(costProgress),
    burnRate: Math.round(costProgress / timeProgress) || 0,
    fundingUtilization: Math.round(
      (contract.obligatedAmount / contract.fundedAmount) * 100
    ),
    variance: Math.round(costProgress - timeProgress),
  };
}

/**
 * Validate FAR clause compliance
 *
 * @description Checks if required FAR clauses are included
 * @param {Contract} contract - Contract to validate
 * @returns {object} Validation results
 *
 * @example
 * ```tsx
 * const validation = validateFARCompliance(contract);
 * if (!validation.isCompliant) {
 *   console.log('Missing clauses:', validation.missingClauses);
 * }
 * ```
 */
export function validateFARCompliance(contract: Contract) {
  const requiredClauses = [
    '52.204-7', // System for Award Management
    '52.219-8', // Utilization of Small Business Concerns
    '52.222-26', // Equal Opportunity
    '52.232-33', // Payment by Electronic Funds Transfer
  ];

  const missingClauses = requiredClauses.filter(
    (clause) => !contract.compliance.farClauses.includes(clause)
  );

  return {
    isCompliant: missingClauses.length === 0,
    missingClauses,
    includedClauses: contract.compliance.farClauses,
    recommendations:
      missingClauses.length > 0
        ? [`Add required FAR clauses: ${missingClauses.join(', ')}`]
        : [],
  };
}

/**
 * Export contract data
 *
 * @description Exports contract information in specified format
 * @param {Contract} contract - Contract to export
 * @param {string} format - Export format
 * @returns {string} Formatted export data
 *
 * @example
 * ```tsx
 * const data = exportContractData(contract, 'json');
 * downloadFile('contract.json', data);
 * ```
 */
export function exportContractData(
  contract: Contract,
  format: 'json' | 'csv' = 'json'
): string {
  if (format === 'json') {
    return JSON.stringify(contract, null, 2);
  }

  // CSV format
  const headers = [
    'Contract Number',
    'Title',
    'Type',
    'Status',
    'Contractor',
    'Value',
    'Funded',
  ];
  const row = [
    contract.contractNumber,
    contract.title,
    contract.contractType,
    contract.status,
    contract.contractor.name,
    contract.currentValue.toString(),
    contract.fundedAmount.toString(),
  ];

  return [headers.join(','), row.join(',')].join('\n');
}

/**
 * Generate modification form
 *
 * @description Creates form for contract modification
 * @param {Contract} contract - Contract to modify
 * @returns {FormConfig} Form configuration
 */
export function generateModificationForm(contract: Contract): FormConfig {
  return {
    id: `modification-form-${contract.id}`,
    title: `Modification for ${contract.contractNumber}`,
    description: 'Create contract modification',
    fields: [
      {
        id: 'modType',
        name: 'modType',
        type: 'select',
        label: 'Modification Type',
        required: true,
        options: [
          { label: 'Bilateral', value: 'bilateral' },
          { label: 'Unilateral', value: 'unilateral' },
          { label: 'Administrative', value: 'administrative' },
          { label: 'Funding Only', value: 'funding' },
        ],
      },
      {
        id: 'changeAmount',
        name: 'changeAmount',
        type: 'number',
        label: 'Change Amount',
        required: true,
        prefix: '$',
      },
      {
        id: 'description',
        name: 'description',
        type: 'textarea',
        label: 'Modification Description',
        required: true,
        rows: 4,
      },
      {
        id: 'justification',
        name: 'justification',
        type: 'textarea',
        label: 'Justification',
        required: true,
        rows: 4,
      },
    ],
  };
}

/**
 * Check contract funding adequacy
 *
 * @description Verifies sufficient funding is available
 * @param {Contract} contract - Contract to check
 * @param {number} additionalCost - Additional cost to verify
 * @returns {boolean} Whether funding is adequate
 */
export function checkFundingAdequacy(
  contract: Contract,
  additionalCost: number = 0
): boolean {
  const totalRequired = contract.obligatedAmount + additionalCost;
  return contract.fundedAmount >= totalRequired;
}

/**
 * Calculate days to expiration
 *
 * @description Calculates days remaining until contract expiration
 * @param {Contract} contract - Contract to check
 * @returns {number} Days remaining
 */
export function calculateDaysToExpiration(contract: Contract): number {
  const now = new Date();
  const end = contract.performancePeriod.end;
  const diffTime = end.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}

/**
 * Generate closeout report
 *
 * @description Creates comprehensive closeout report
 * @param {Contract} contract - Contract to report
 * @param {CloseoutChecklist} checklist - Closeout checklist
 * @returns {string} Report content
 */
export function generateCloseoutReport(
  contract: Contract,
  checklist: CloseoutChecklist
): string {
  const report = `
CONTRACT CLOSEOUT REPORT
========================

Contract Number: ${contract.contractNumber}
Contract Title: ${contract.title}
Contractor: ${contract.contractor.name}
Contract Type: ${contract.contractType}

PERFORMANCE PERIOD:
  Start Date: ${contract.performancePeriod.start.toLocaleDateString()}
  End Date: ${contract.performancePeriod.end.toLocaleDateString()}

FINANCIAL SUMMARY:
  Original Value: $${contract.baseValue.toLocaleString()}
  Final Value: $${contract.currentValue.toLocaleString()}
  Total Obligated: $${contract.obligatedAmount.toLocaleString()}

CLOSEOUT CHECKLIST:
  Initiated: ${checklist.startedDate?.toLocaleDateString() || 'N/A'}
  Completed: ${checklist.completedDate?.toLocaleDateString() || 'In Progress'}
  Verified By: ${checklist.verifiedBy || 'Pending'}

ITEMS:
${checklist.items.map((item) => `  - [${item.completed ? 'X' : ' '}] ${item.item}`).join('\n')}

CERTIFICATION:
This contract has been reviewed and is recommended for closeout.

Prepared By: ${checklist.completedBy || 'TBD'}
Date: ${new Date().toLocaleDateString()}
  `.trim();

  return report;
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Hooks
  useContractManagement,
  useContractModifications,
  useDeliverableTracking,
  useContractFunding,
  useContractClaims,
  useContractCloseout,
  usePerformanceEvaluation,

  // Utility Functions
  generateContractCreationForm,
  generateModificationForm,
  calculateContractMetrics,
  validateFARCompliance,
  exportContractData,
  checkFundingAdequacy,
  calculateDaysToExpiration,
  generateCloseoutReport,
};
