// Vendors Domain - Complete Export Module
// Centralized exports for vendor management functionality

// Configuration and Types
export * from './config';

// Query Hooks
export * from './queries/useVendorQueries';

// Mutation Hooks  
export * from './mutations/useVendorMutations';

// Composite Hooks
export * from './composites/useVendorComposites';

// Re-export key types for convenience
export type {
  Vendor,
  VendorContact,
  VendorAddress,
  InsuranceInfo,
  VendorContract,
  ContractAmendment,
  VendorEvaluation,
  VendorPayment,
  PaymentAttachment,
  VendorDocument,
} from './config';
