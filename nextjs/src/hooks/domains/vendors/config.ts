/**
 * Vendor Domain Configuration and Type Definitions
 *
 * Centralized configuration for vendor management including query keys, cache settings,
 * TypeScript interfaces, and utility functions for vendor operations, contracts,
 * evaluations, payments, and compliance tracking.
 *
 * @module hooks/domains/vendors/config
 *
 * @remarks
 * **Architecture:**
 * - Query key factory pattern for consistent cache management
 * - Hierarchical query keys enable granular invalidation
 * - TypeScript interfaces for type-safe vendor operations
 * - Utility functions for scoring and risk assessment
 *
 * **Cache Strategy:**
 * - Vendors: 10-minute stale time (moderate update frequency)
 * - Contracts: 15-minute stale time (less volatile)
 * - Evaluations: 30-minute stale time (infrequent updates)
 * - Default: 5-minute stale time for general queries
 *
 * @see {@link useVendorQueries} for data fetching hooks
 * @see {@link useVendorMutations} for data modification hooks
 * @see {@link useVendorComposites} for composite workflow hooks
 *
 * @since 1.0.0
 */

import { QueryClient } from '@tanstack/react-query';

/**
 * Query keys factory for vendor domain cache management.
 *
 * Provides hierarchical query keys that enable efficient cache invalidation
 * and automatic refetching. Keys are structured from general to specific
 * to allow invalidating entire categories or specific items.
 *
 * @constant vendorKeys
 *
 * @example
 * ```typescript
 * // Invalidate all vendor queries
 * queryClient.invalidateQueries({ queryKey: vendorKeys.all });
 *
 * // Invalidate specific vendor
 * queryClient.invalidateQueries({ queryKey: vendorKeys.detail('vendor-123') });
 *
 * // Invalidate vendor contracts
 * queryClient.invalidateQueries({ queryKey: vendorKeys.contracts('vendor-123') });
 *
 * // Query with filters
 * const queryKey = vendorKeys.list({ status: 'ACTIVE', type: 'SUPPLIER' });
 * ```
 *
 * @remarks
 * Key hierarchy enables efficient invalidation:
 * - vendorKeys.all → Invalidates ALL vendor queries
 * - vendorKeys.list(filters) → Specific filtered lists
 * - vendorKeys.detail(id) → Individual vendor details
 * - vendorKeys.contracts(vendorId) → Vendor-specific contracts
 *
 * @see {@link invalidateVendorQueries} for helper function
 */
export const vendorKeys = {
  all: ['vendors'] as const,
  list: (filters?: any) => [...vendorKeys.all, 'list', filters] as const,
  paginated: (filters?: any) => [...vendorKeys.all, 'paginated', filters] as const,
  detail: (id: string) => [...vendorKeys.all, 'detail', id] as const,
  analytics: (vendorId: string, period?: string) => [...vendorKeys.all, 'analytics', vendorId, period] as const,
  performance: (vendorId: string) => [...vendorKeys.all, 'performance', vendorId] as const,
  
  // Contracts
  contracts: (vendorId?: string) => [...vendorKeys.all, 'contracts', vendorId] as const,
  contract: (contractId: string) => [...vendorKeys.all, 'contract', contractId] as const,
  
  // Evaluations
  evaluations: (vendorId?: string) => [...vendorKeys.all, 'evaluations', vendorId] as const,
  evaluation: (evaluationId: string) => [...vendorKeys.all, 'evaluation', evaluationId] as const,
  
  // Documents
  documents: (vendorId: string) => [...vendorKeys.all, 'documents', vendorId] as const,
  
  // Payments
  payments: (vendorId?: string) => [...vendorKeys.all, 'payments', vendorId] as const,
} as const;

/**
 * Cache configuration for vendor queries.
 *
 * Stale times determine how long cached data remains fresh before TanStack Query
 * triggers a background refetch. Longer stale times reduce API calls for stable data.
 *
 * @constant VENDORS_CACHE_CONFIG
 *
 * @property {number} DEFAULT_STALE_TIME - 5 minutes for general queries
 * @property {number} VENDORS_STALE_TIME - 10 minutes for vendor data (moderate changes)
 * @property {number} CONTRACTS_STALE_TIME - 15 minutes for contracts (less volatile)
 * @property {number} EVALUATIONS_STALE_TIME - 30 minutes for evaluations (infrequent updates)
 *
 * @example
 * ```typescript
 * // Use in query configuration
 * useQuery({
 *   queryKey: vendorKeys.detail(vendorId),
 *   queryFn: () => fetchVendor(vendorId),
 *   staleTime: VENDORS_CACHE_CONFIG.VENDORS_STALE_TIME
 * });
 * ```
 *
 * @remarks
 * Stale time vs. Cache time:
 * - **Stale Time**: How long data is considered "fresh" (no refetch on mount/focus)
 * - **Cache Time**: How long unused data stays in memory (default: 5 minutes)
 *
 * Balance considerations:
 * - Shorter stale times = more API calls, fresher data
 * - Longer stale times = fewer API calls, potentially stale data
 * - Critical data (contracts, payments) uses longer stale times due to lower volatility
 */
export const VENDORS_CACHE_CONFIG = {
  DEFAULT_STALE_TIME: 5 * 60 * 1000, // 5 minutes
  VENDORS_STALE_TIME: 10 * 60 * 1000, // 10 minutes
  CONTRACTS_STALE_TIME: 15 * 60 * 1000, // 15 minutes
  EVALUATIONS_STALE_TIME: 30 * 60 * 1000, // 30 minutes
} as const;

/**
 * Complete vendor entity with all business information.
 *
 * Represents a vendor/supplier through entire lifecycle from onboarding to
 * performance management. Includes contact info, financial terms, performance
 * metrics, and compliance tracking.
 *
 * @interface Vendor
 *
 * @property {string} id - Unique vendor identifier
 * @property {string} name - Vendor business name
 * @property {string} type - Vendor classification (SUPPLIER, CONTRACTOR, SERVICE_PROVIDER, CONSULTANT)
 * @property {string} status - Current vendor status (ACTIVE, INACTIVE, SUSPENDED, PENDING_APPROVAL)
 * @property {string} category - Primary business category
 * @property {string} [subcategory] - Detailed category classification
 * @property {string} [taxId] - Tax identification number (EIN/SSN)
 * @property {string} [registrationNumber] - Business registration number
 *
 * @property {VendorContact} primaryContact - Main point of contact
 * @property {VendorContact[]} alternateContacts - Additional contacts (billing, technical, emergency)
 * @property {VendorAddress[]} addresses - Business, billing, shipping addresses
 *
 * @property {number} [yearEstablished] - Year business was established
 * @property {number} [numberOfEmployees] - Company size
 * @property {number} [annualRevenue] - Reported annual revenue
 * @property {string[]} certifications - Business certifications (ISO, etc.)
 * @property {InsuranceInfo[]} insurance - Insurance policies (liability, workers comp, etc.)
 *
 * @property {string} paymentTerms - Payment terms (Net 30, Net 60, etc.)
 * @property {number} [creditLimit] - Maximum outstanding credit allowed
 * @property {string} [creditRating] - Credit rating (EXCELLENT, GOOD, FAIR, POOR)
 *
 * @property {number} overallRating - Performance rating (1-5 scale)
 * @property {number} onTimeDeliveryRate - Percentage of on-time deliveries (0-100)
 * @property {number} qualityRating - Quality score (1-5 scale)
 *
 * @property {boolean} w9OnFile - W-9 form on file for IRS compliance
 * @property {boolean} insuranceCurrent - All insurance policies current
 * @property {string} [backgroundCheckDate] - Last background check date (ISO format)
 *
 * @property {string} createdAt - Creation timestamp (ISO format)
 * @property {string} updatedAt - Last update timestamp (ISO format)
 * @property {string} createdBy - User ID who created vendor
 * @property {string} lastModifiedBy - User ID who last modified vendor
 *
 * @example
 * ```typescript
 * const vendor: Vendor = {
 *   id: 'vendor-123',
 *   name: 'Medical Supplies Inc',
 *   type: 'SUPPLIER',
 *   status: 'ACTIVE',
 *   category: 'Medical Equipment',
 *   primaryContact: {
 *     id: 'contact-1',
 *     type: 'PRIMARY',
 *     name: 'John Smith',
 *     email: 'john@medicalsupplies.com',
 *     phone: '555-0100',
 *     isPrimary: true
 *   },
 *   paymentTerms: 'Net 30',
 *   overallRating: 4.5,
 *   onTimeDeliveryRate: 95,
 *   qualityRating: 4.8,
 *   w9OnFile: true,
 *   insuranceCurrent: true,
 *   // ... other fields
 * };
 * ```
 *
 * @see {@link VendorContact} for contact structure
 * @see {@link VendorAddress} for address structure
 * @see {@link InsuranceInfo} for insurance details
 * @see {@link calculateVendorScore} for scoring algorithm
 */
export interface Vendor {
  id: string;
  name: string;
  type: 'SUPPLIER' | 'CONTRACTOR' | 'SERVICE_PROVIDER' | 'CONSULTANT';
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'PENDING_APPROVAL';
  category: string;
  subcategory?: string;
  taxId?: string;
  registrationNumber?: string;
  
  // Contact Information
  primaryContact: VendorContact;
  alternateContacts: VendorContact[];
  
  // Address Information
  addresses: VendorAddress[];
  
  // Business Information
  yearEstablished?: number;
  numberOfEmployees?: number;
  annualRevenue?: number;
  certifications: string[];
  insurance: InsuranceInfo[];
  
  // Financial Information
  paymentTerms: string;
  creditLimit?: number;
  creditRating?: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR';
  
  // Performance Metrics
  overallRating: number;
  onTimeDeliveryRate: number;
  qualityRating: number;
  
  // Compliance
  w9OnFile: boolean;
  insuranceCurrent: boolean;
  backgroundCheckDate?: string;
  
  // System Information
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  lastModifiedBy: string;
}

export interface VendorContact {
  id: string;
  type: 'PRIMARY' | 'BILLING' | 'TECHNICAL' | 'EMERGENCY';
  name: string;
  title?: string;
  email: string;
  phone: string;
  mobile?: string;
  isPrimary: boolean;
}

export interface VendorAddress {
  id: string;
  type: 'BUSINESS' | 'BILLING' | 'SHIPPING' | 'MAILING';
  street1: string;
  street2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isPrimary: boolean;
}

export interface InsuranceInfo {
  type: 'GENERAL_LIABILITY' | 'PROFESSIONAL_LIABILITY' | 'WORKERS_COMP' | 'CYBER_LIABILITY';
  provider: string;
  policyNumber: string;
  coverageAmount: number;
  effectiveDate: string;
  expirationDate: string;
  certificateUrl?: string;
}

export interface VendorContract {
  id: string;
  vendorId: string;
  contractNumber: string;
  title: string;
  type: 'MASTER_AGREEMENT' | 'PURCHASE_ORDER' | 'SERVICE_CONTRACT' | 'CONSULTING';
  status: 'DRAFT' | 'UNDER_REVIEW' | 'ACTIVE' | 'EXPIRED' | 'TERMINATED';
  
  // Financial Terms
  totalValue: number;
  currency: string;
  paymentSchedule: 'NET_30' | 'NET_60' | 'MILESTONE' | 'MONTHLY' | 'CUSTOM';
  
  // Dates
  startDate: string;
  endDate: string;
  signedDate?: string;
  
  // Terms
  renewalOptions: boolean;
  autoRenewal: boolean;
  terminationClause: string;
  penaltyClause?: string;
  
  // Documents
  documentUrl?: string;
  amendments: ContractAmendment[];
  
  // Approval
  approvedBy?: string;
  approvalDate?: string;
  
  createdAt: string;
  updatedAt: string;
}

export interface ContractAmendment {
  id: string;
  amendmentNumber: number;
  description: string;
  effectiveDate: string;
  documentUrl?: string;
  createdAt: string;
}

export interface VendorEvaluation {
  id: string;
  vendorId: string;
  evaluationType: 'ANNUAL' | 'PROJECT_BASED' | 'INCIDENT' | 'RENEWAL';
  evaluationPeriod: string;
  
  // Ratings (1-5 scale)
  qualityRating: number;
  deliveryRating: number;
  communicationRating: number;
  costEffectivenessRating: number;
  overallRating: number;
  
  // Detailed Feedback
  strengths: string[];
  areasForImprovement: string[];
  comments: string;
  
  // Recommendations
  recommendForFutureWork: boolean;
  contractRenewalRecommendation: 'RENEW' | 'RENEW_WITH_CONDITIONS' | 'DO_NOT_RENEW';
  
  // System Information
  evaluatedBy: string;
  evaluationDate: string;
  reviewedBy?: string;
  reviewDate?: string;
  
  createdAt: string;
  updatedAt: string;
}

export interface VendorPayment {
  id: string;
  vendorId: string;
  invoiceNumber: string;
  purchaseOrderNumber?: string;
  contractId?: string;
  
  amount: number;
  currency: string;
  dueDate: string;
  paidDate?: string;
  
  status: 'PENDING' | 'APPROVED' | 'PAID' | 'OVERDUE' | 'DISPUTED' | 'CANCELLED';
  
  description: string;
  category: string;
  
  // Approval Workflow
  approvalStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  approvedBy?: string;
  approvalDate?: string;
  rejectionReason?: string;
  
  // Payment Information
  paymentMethod?: 'CHECK' | 'ACH' | 'WIRE' | 'CREDIT_CARD';
  paymentReference?: string;
  
  attachments: PaymentAttachment[];
  
  createdAt: string;
  updatedAt: string;
}

export interface PaymentAttachment {
  id: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: string;
}

export interface VendorDocument {
  id: string;
  vendorId: string;
  type: 'W9' | 'INSURANCE_CERT' | 'LICENSE' | 'CERTIFICATION' | 'CONTRACT' | 'OTHER';
  title: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  
  expirationDate?: string;
  isRequired: boolean;
  status: 'CURRENT' | 'EXPIRED' | 'EXPIRING_SOON' | 'MISSING';
  
  uploadedBy: string;
  uploadedAt: string;
  lastReviewedBy?: string;
  lastReviewedAt?: string;
}

/**
 * Invalidates vendor-related queries in React Query cache.
 *
 * Helper function to invalidate all queries related to a specific vendor or
 * all vendor queries globally. Triggers refetch on next access.
 *
 * @param {QueryClient} queryClient - React Query client instance
 * @param {string} [vendorId] - Optional vendor ID for targeted invalidation
 *
 * @example
 * ```typescript
 * // Invalidate specific vendor after update
 * const { mutate } = useUpdateVendor();
 * mutate(vendorData, {
 *   onSuccess: () => {
 *     invalidateVendorQueries(queryClient, 'vendor-123');
 *   }
 * });
 *
 * // Invalidate all vendors after bulk operation
 * invalidateVendorQueries(queryClient);
 * ```
 *
 * @remarks
 * When vendorId provided:
 * - Invalidates vendor details
 * - Invalidates vendor contracts
 * - Invalidates vendor evaluations
 * - Invalidates vendor list (to update aggregate data)
 *
 * When vendorId omitted:
 * - Invalidates ALL vendor queries globally
 * - Use for bulk operations or system-wide updates
 *
 * @see {@link invalidateVendorContractQueries} for contract-specific invalidation
 */
export const invalidateVendorQueries = (queryClient: QueryClient, vendorId?: string) => {
  if (vendorId) {
    queryClient.invalidateQueries({ queryKey: vendorKeys.detail(vendorId) });
    queryClient.invalidateQueries({ queryKey: vendorKeys.contracts(vendorId) });
    queryClient.invalidateQueries({ queryKey: vendorKeys.evaluations(vendorId) });
  }
  queryClient.invalidateQueries({ queryKey: vendorKeys.all });
};

export const invalidateVendorContractQueries = (queryClient: QueryClient, vendorId?: string) => {
  queryClient.invalidateQueries({ queryKey: vendorKeys.contracts(vendorId) });
  if (vendorId) {
    queryClient.invalidateQueries({ queryKey: vendorKeys.detail(vendorId) });
  }
};

/**
 * Calculates weighted vendor performance score.
 *
 * Combines multiple performance metrics into single score using weighted algorithm.
 * Score ranges from 0-5, with 5 being excellent performance.
 *
 * @param {Vendor} vendor - Vendor entity with performance metrics
 * @returns {number} Weighted performance score (0-5 scale)
 *
 * @example
 * ```typescript
 * const vendor: Vendor = {
 *   overallRating: 4.5,
 *   onTimeDeliveryRate: 0.95,  // 95%
 *   qualityRating: 4.8,
 *   // ... other fields
 * };
 *
 * const score = calculateVendorScore(vendor);
 * // Returns: 4.575 (weighted average)
 *
 * // Use for vendor comparison
 * const topVendors = vendors
 *   .sort((a, b) => calculateVendorScore(b) - calculateVendorScore(a))
 *   .slice(0, 5);
 * ```
 *
 * @remarks
 * **Weighting Algorithm:**
 * - Overall Rating: 40% (general satisfaction)
 * - On-Time Delivery Rate: 30% (reliability)
 * - Quality Rating: 30% (product/service quality)
 *
 * **Score Interpretation:**
 * - 4.5-5.0: Excellent (top-tier vendor)
 * - 4.0-4.5: Good (reliable vendor)
 * - 3.0-4.0: Average (meets expectations)
 * - Below 3.0: Poor (needs improvement or replacement)
 *
 * @see {@link getVendorRiskLevel} for risk classification based on score
 */
export const calculateVendorScore = (vendor: Vendor): number => {
  const weights = {
    overall: 0.4,
    delivery: 0.3,
    quality: 0.3
  };
  
  return (
    vendor.overallRating * weights.overall +
    vendor.onTimeDeliveryRate * weights.delivery +
    vendor.qualityRating * weights.quality
  );
};

/**
 * Determines vendor risk level based on performance score.
 *
 * Classifies vendors into risk categories based on their calculated performance
 * score. Used for risk management, compliance monitoring, and vendor selection.
 *
 * @param {Vendor} vendor - Vendor entity to assess
 * @returns {'LOW' | 'MEDIUM' | 'HIGH'} Risk classification
 *
 * @example
 * ```typescript
 * const vendor: Vendor = {
 *   overallRating: 3.5,
 *   onTimeDeliveryRate: 0.85,
 *   qualityRating: 3.8,
 *   // ... other fields
 * };
 *
 * const riskLevel = getVendorRiskLevel(vendor);
 * // Returns: 'MEDIUM' (score 3.575 falls in medium range)
 *
 * // Filter high-risk vendors for review
 * const highRiskVendors = vendors.filter(v =>
 *   getVendorRiskLevel(v) === 'HIGH'
 * );
 *
 * // Risk-based UI styling
 * const badgeColor = {
 *   LOW: 'green',
 *   MEDIUM: 'yellow',
 *   HIGH: 'red'
 * }[getVendorRiskLevel(vendor)];
 * ```
 *
 * @remarks
 * **Risk Classification Thresholds:**
 * - **LOW** (score >= 4.0): Trusted vendor, minimal oversight required
 * - **MEDIUM** (score 3.0-4.0): Standard vendor, regular monitoring needed
 * - **HIGH** (score < 3.0): At-risk vendor, requires immediate attention
 *
 * **Risk Management Actions:**
 * - LOW: Annual review, standard terms
 * - MEDIUM: Quarterly review, performance improvement plan
 * - HIGH: Monthly review, contract re-evaluation, find alternatives
 *
 * @see {@link calculateVendorScore} for underlying score calculation
 * @see {@link useVendorRiskAssessment} for comprehensive risk analysis
 */
export const getVendorRiskLevel = (vendor: Vendor): 'LOW' | 'MEDIUM' | 'HIGH' => {
  const score = calculateVendorScore(vendor);
  
  if (score >= 4.0) return 'LOW';
  if (score >= 3.0) return 'MEDIUM';
  return 'HIGH';
};
