/**
 * Type Definitions for Vendor Domain
 *
 * Comprehensive TypeScript interfaces for vendor management including vendors,
 * contracts, evaluations, payments, and compliance tracking.
 *
 * @module hooks/domains/vendors/types
 *
 * @since 1.0.0
 */

// Re-export core vendor types
export type {
  Vendor,
  VendorContact,
  VendorAddress,
  InsuranceInfo,
} from './vendor-core-types';

// Re-export contract types
export type {
  VendorContract,
  ContractAmendment,
} from './vendor-contract-types';

// Re-export evaluation types
export type {
  VendorEvaluation,
} from './vendor-evaluation-types';

// Re-export payment types
export type {
  VendorPayment,
  PaymentAttachment,
} from './vendor-payment-types';

// Re-export document types
export type {
  VendorDocument,
} from './vendor-document-types';
