/**
 * Vendor Domain - Central Export Hub
 *
 * Provides comprehensive vendor management functionality including vendor CRUD,
 * contract lifecycle management, performance evaluations, payment processing,
 * compliance tracking, and risk assessment workflows.
 *
 * @module hooks/domains/vendors
 *
 * @remarks
 * **Domain Capabilities:**
 * - **Vendor Management**: Create, update, activate, suspend vendors
 * - **Contract Lifecycle**: Draft, approve, amend, renew, terminate contracts
 * - **Performance Tracking**: Evaluations, ratings, KPIs, analytics
 * - **Payment Processing**: Invoice tracking, approval workflows, reconciliation
 * - **Compliance Monitoring**: Document tracking, expiration alerts, audits
 * - **Risk Assessment**: Performance scoring, risk classification, mitigation
 *
 * **Architecture:**
 * - Query hooks for data fetching (read operations)
 * - Mutation hooks for data modifications (write operations)
 * - Composite hooks for complex multi-step workflows
 * - Configuration module with types and utilities
 *
 * **TanStack Query Integration:**
 * - Automatic caching with configurable stale times
 * - Optimistic updates for better UX
 * - Automatic refetching on window focus
 * - Cache invalidation on mutations
 *
 * @example
 * ```typescript
 * // Import specific hooks
 * import { useVendor, useCreateVendor, useVendorWorkflow } from '@/hooks/domains/vendors';
 *
 * // Or import everything
 * import * as vendorHooks from '@/hooks/domains/vendors';
 *
 * // Using in component
 * function VendorManagement() {
 *   const { data: vendors } = useVendors({ status: 'ACTIVE' });
 *   const { mutate: createVendor } = useCreateVendor();
 *   const workflow = useVendorWorkflow(vendorId);
 *
 *   return <VendorDashboard vendors={vendors} workflow={workflow} />;
 * }
 * ```
 *
 * @see {@link useVendorQueries} for all query hooks
 * @see {@link useVendorMutations} for all mutation hooks
 * @see {@link useVendorComposites} for workflow hooks
 * @see {@link vendorKeys} for cache key structure
 * @see {@link VENDORS_CACHE_CONFIG} for cache configuration
 *
 * @since 1.0.0
 */

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
