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
 * @deprecated This file re-exports from modularized files. Import from specific modules or use barrel export (index.ts) instead.
 */

// Re-export everything from modularized files
export { vendorKeys } from './query-keys';
export { VENDORS_CACHE_CONFIG } from './cache-config';
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
} from './types';
export {
  invalidateVendorQueries,
  invalidateVendorContractQueries,
  calculateVendorScore,
  getVendorRiskLevel,
} from './utils';
