/**
 * Vendor Contract Type Definitions
 *
 * Contract-related types for vendor agreements, amendments,
 * and contract management.
 *
 * @module hooks/domains/vendors/vendor-contract-types
 *
 * @since 1.0.0
 */

/**
 * Contract amendment information
 */
export interface ContractAmendment {
  id: string;
  amendmentNumber: number;
  description: string;
  effectiveDate: string;
  documentUrl?: string;
  createdAt: string;
}

/**
 * Vendor contract information
 */
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
