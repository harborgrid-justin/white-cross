/**
 * Vendor Query Hooks - Barrel Export
 *
 * Exports all vendor query hooks from their respective modules.
 *
 * @module hooks/domains/vendors/queries
 */

// Base vendor queries
export {
  useVendor,
  useVendors,
  useVendorsPaginated,
} from './useVendorBaseQueries';

// Contract queries
export {
  useVendorContract,
  useVendorContracts,
} from './useVendorContractQueries';

// Evaluation queries
export {
  useVendorEvaluation,
  useVendorEvaluations,
} from './useVendorEvaluationQueries';

// Payment queries
export {
  useVendorPayments,
} from './useVendorPaymentQueries';

// Document queries
export {
  useVendorDocuments,
} from './useVendorDocumentQueries';

// Analytics and performance queries
export {
  useVendorAnalytics,
  useVendorPerformance,
} from './useVendorAnalyticsQueries';

// Compliance and categories queries
export {
  useVendorCategories,
  useVendorCompliance,
} from './useVendorComplianceQueries';

// Search and recommendation queries
export {
  useVendorSearch,
  useVendorRecommendations,
} from './useVendorSearchQueries';
