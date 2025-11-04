/**
 * Vendor Domain Query Hooks
 *
 * Provides TanStack Query hooks for fetching vendor data including vendors,
 * contracts, evaluations, payments, documents, analytics, and compliance information.
 * All hooks leverage React Query's caching, automatic revalidation, and error handling.
 *
 * @module hooks/domains/vendors/queries
 *
 * @remarks
 * **Hook Categories:**
 * - **Vendor Queries**: useVendor, useVendors, useVendorsPaginated
 * - **Contract Queries**: useVendorContract, useVendorContracts
 * - **Evaluation Queries**: useVendorEvaluation, useVendorEvaluations
 * - **Payment Queries**: useVendorPayments
 * - **Document Queries**: useVendorDocuments
 * - **Analytics Queries**: useVendorAnalytics, useVendorPerformance
 * - **Compliance Queries**: useVendorCompliance
 * - **Search Queries**: useVendorSearch, useVendorRecommendations
 *
 * **TanStack Query Features:**
 * - Automatic caching with configurable stale times (see VENDORS_CACHE_CONFIG)
 * - Background refetching when data becomes stale
 * - Automatic retry with exponential backoff (3 attempts)
 * - Query deduplication for parallel requests
 * - Cache invalidation via vendorKeys factory
 *
 * @see {@link vendorKeys} for query key structure
 * @see {@link VENDORS_CACHE_CONFIG} for cache configuration
 * @see {@link useVendorMutations} for data modification hooks
 *
 * @since 1.0.0
 */

// Re-export all hooks from modular files
export * from './useVendorBaseQueries';
export * from './useVendorContractQueries';
export * from './useVendorEvaluationQueries';
export * from './useVendorPaymentQueries';
export * from './useVendorDocumentQueries';
export * from './useVendorAnalyticsQueries';
export * from './useVendorComplianceQueries';
export * from './useVendorSearchQueries';
