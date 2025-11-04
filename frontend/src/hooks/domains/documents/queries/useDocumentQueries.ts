/**
 * Document Query Hooks - Main Export
 *
 * This file maintains backward compatibility by re-exporting all hooks from
 * the modularized query files. The original 729 LOC file has been broken down
 * into smaller, focused modules for better maintainability.
 *
 * @module hooks/domains/documents/queries/useDocumentQueries
 * @author White Cross Healthcare Platform
 * @version 3.0.0
 *
 * @remarks
 * **Module Organization:**
 * - `documentQueryAPI.ts` - Mock API functions for all document operations
 * - `useDocumentCoreQueries.ts` - Core document hooks (list, details, versions, search, recent, favorites, shared)
 * - `useDocumentCategoryQueries.ts` - Category and template management hooks
 * - `useDocumentShareQueries.ts` - Share, activity, and comment hooks
 * - `useDocumentAnalyticsQueries.ts` - Analytics and dashboard statistics hooks
 *
 * **PHI Considerations:**
 * - Documents may contain Protected Health Information
 * - All document access triggers audit logging
 * - Cache times configured for PHI compliance
 * - Use shorter staleTime for highly sensitive documents
 *
 * @example
 * ```typescript
 * import {
 *   useDocuments,
 *   useDocumentDetails,
 *   useDocumentVersions
 * } from '@/hooks/domains/documents/queries/useDocumentQueries';
 *
 * // In your component
 * const { data: documents, isLoading } = useDocuments();
 * const { data: document } = useDocumentDetails(documentId);
 * const { data: versions } = useDocumentVersions(documentId);
 * ```
 *
 * @see {@link documentQueryAPI} for API implementation
 * @see {@link useDocumentCoreQueries} for core hooks
 * @see {@link useDocumentCategoryQueries} for category hooks
 * @see {@link useDocumentShareQueries} for share hooks
 * @see {@link useDocumentAnalyticsQueries} for analytics hooks
 */

// Re-export mock API for advanced usage or testing
export { documentQueryAPI } from './documentQueryAPI';

// Re-export core document query hooks
export {
  useDocuments,
  useDocumentDetails,
  useDocumentVersions,
  useSearchDocuments,
  useRecentDocuments,
  useFavoriteDocuments,
  useSharedWithMe,
} from './useDocumentCoreQueries';

// Re-export category and template query hooks
export {
  useCategories,
  useCategoryDetails,
  useCategoryDocuments,
  useTemplates,
  useTemplateDetails,
  usePopularTemplates,
} from './useDocumentCategoryQueries';

// Re-export share, activity, and comment query hooks
export {
  useDocumentShares,
  useShareDetails,
  useShareByToken,
  useDocumentActivity,
  useDocumentComments,
} from './useDocumentShareQueries';

// Re-export analytics and dashboard query hooks
export {
  useDocumentAnalytics,
  useDocumentsDashboard,
  useDocumentOverview,
} from './useDocumentAnalyticsQueries';

/**
 * Backward Compatibility Notes:
 *
 * This file now serves as a re-export hub to maintain backward compatibility
 * with existing imports. All functionality has been preserved and moved to
 * smaller, more focused files:
 *
 * **Before (729 LOC):**
 * - Single large file with all hooks and API functions
 * - Difficult to navigate and maintain
 * - Hard to find specific functionality
 *
 * **After (Modularized):**
 * - documentQueryAPI.ts (263 LOC) - API layer
 * - useDocumentCoreQueries.ts (170 LOC) - Core document hooks
 * - useDocumentCategoryQueries.ts (141 LOC) - Category/template hooks
 * - useDocumentShareQueries.ts (127 LOC) - Share/activity/comment hooks
 * - useDocumentAnalyticsQueries.ts (279 LOC) - Analytics/dashboard hooks
 * - useDocumentQueries.ts (this file, ~100 LOC) - Re-exports for compatibility
 *
 * **Migration Path:**
 * - Existing imports continue to work without changes
 * - New code can import from specific files for clarity
 * - All hooks have identical signatures and behavior
 * - No breaking changes to API or functionality
 *
 * **Benefits:**
 * - Better code organization and maintainability
 * - Easier to locate specific hooks
 * - Reduced cognitive load when reading code
 * - Clearer separation of concerns
 * - Better tree-shaking for production builds
 */
