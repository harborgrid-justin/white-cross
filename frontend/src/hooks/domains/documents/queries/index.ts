/**
 * Document Query Hooks - Index
 *
 * Central export point for all document query hooks. This file provides
 * backward compatibility by re-exporting all hooks from the modularized files.
 * Import from this index to access any document query hook.
 *
 * @module hooks/domains/documents/queries
 * @author White Cross Healthcare Platform
 * @version 3.0.0
 *
 * @remarks
 * **Module Organization:**
 * - Core queries: Basic document operations (list, details, versions, search)
 * - Category queries: Categories and templates
 * - Share queries: Shares, activity, and comments
 * - Analytics queries: Analytics and dashboard statistics
 * - API: Mock API implementation (replace with real API in production)
 *
 * **Usage:**
 * ```typescript
 * // Import individual hooks
 * import { useDocuments, useDocumentDetails } from '@/hooks/domains/documents/queries';
 *
 * // Import all hooks
 * import * as documentQueries from '@/hooks/domains/documents/queries';
 * ```
 *
 * @see {@link useDocumentCoreQueries} for core document hooks
 * @see {@link useDocumentCategoryQueries} for category and template hooks
 * @see {@link useDocumentShareQueries} for share and activity hooks
 * @see {@link useDocumentAnalyticsQueries} for analytics hooks
 */

// Core document queries
export {
  useDocuments,
  useDocumentDetails,
  useDocumentVersions,
  useSearchDocuments,
  useRecentDocuments,
  useFavoriteDocuments,
  useSharedWithMe,
} from './useDocumentCoreQueries';

// Category and template queries
export {
  useCategories,
  useCategoryDetails,
  useCategoryDocuments,
  useTemplates,
  useTemplateDetails,
  usePopularTemplates,
} from './useDocumentCategoryQueries';

// Share, activity, and comment queries
export {
  useDocumentShares,
  useShareDetails,
  useShareByToken,
  useDocumentActivity,
  useDocumentComments,
} from './useDocumentShareQueries';

// Analytics and dashboard queries
export {
  useDocumentAnalytics,
  useDocumentsDashboard,
  useDocumentOverview,
} from './useDocumentAnalyticsQueries';

// Export API for advanced usage or testing
export { documentQueryAPI } from './documentQueryAPI';
