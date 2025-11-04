/**
 * Documents Domain Utility Functions
 *
 * Cache invalidation utilities for TanStack Query operations.
 * Provides helper functions for invalidating document-related queries.
 *
 * @module hooks/domains/documents/documentUtils
 * @author White Cross Healthcare Platform
 * @version 3.0.0
 */

import { QueryClient } from '@tanstack/react-query';
import { DOCUMENTS_QUERY_KEYS } from './documentQueryKeys';

/**
 * Invalidates all document-related queries in the cache.
 *
 * Utility function to invalidate all queries under the 'documents' key,
 * triggering refetch for any active queries. Use when you need to refresh
 * all document data after batch operations.
 *
 * @param queryClient - TanStack Query client instance
 *
 * @remarks
 * - Invalidates ALL documents domain queries (documents, categories, templates, shares)
 * - More aggressive than invalidateDocumentQueries - use sparingly
 * - Triggers refetch for all active queries
 * - Use after system-wide changes or bulk operations
 *
 * @example
 * ```typescript
 * // After bulk document import
 * const importDocuments = async (files: File[]) => {
 *   await Promise.all(files.map(uploadDocument));
 *   invalidateDocumentsQueries(queryClient);
 * };
 * ```
 *
 * @see {@link invalidateDocumentQueries} for more targeted invalidation
 */
export const invalidateDocumentsQueries = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: ['documents'] });
};

/**
 * Invalidates document-specific queries in the cache.
 *
 * Invalidates all queries related to documents (lists, details, versions)
 * but not categories, templates, or shares. Use after document CRUD operations.
 *
 * @param queryClient - TanStack Query client instance
 *
 * @remarks
 * - Invalidates documents lists, details, versions, activity, comments
 * - Does NOT invalidate categories, templates, or shares
 * - Efficient for most document mutations
 * - Automatically called by document mutation hooks
 *
 * @example
 * ```typescript
 * // After creating a document
 * const { mutate } = useCreateDocument({
 *   onSuccess: () => {
 *     invalidateDocumentQueries(queryClient);
 *     toast.success('Document uploaded successfully');
 *   }
 * });
 * ```
 *
 * @see {@link DOCUMENTS_QUERY_KEYS} for query key structure
 */
export const invalidateDocumentQueries = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: DOCUMENTS_QUERY_KEYS.documents });
};

/**
 * Invalidates document category queries in the cache.
 *
 * Invalidates all category-related queries (lists, details, category documents).
 * Use after category CRUD operations.
 *
 * @param queryClient - TanStack Query client instance
 *
 * @remarks
 * - Invalidates categories lists, details, and category document lists
 * - Use after creating, updating, or deleting categories
 * - Does not affect document queries directly
 *
 * @example
 * ```typescript
 * // After creating a category
 * const { mutate } = useCreateCategory({
 *   onSuccess: () => {
 *     invalidateCategoryQueries(queryClient);
 *   }
 * });
 * ```
 */
export const invalidateCategoryQueries = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: DOCUMENTS_QUERY_KEYS.categories });
};

/**
 * Invalidates document template queries in the cache.
 *
 * Invalidates all template-related queries (lists, details, popular templates).
 * Use after template CRUD operations.
 *
 * @param queryClient - TanStack Query client instance
 *
 * @remarks
 * - Invalidates templates lists, details, and popular templates
 * - Use after creating, updating, or deleting templates
 * - Does not affect document or category queries
 *
 * @example
 * ```typescript
 * // After creating a template
 * const { mutate } = useCreateTemplate({
 *   onSuccess: () => {
 *     invalidateTemplateQueries(queryClient);
 *   }
 * });
 * ```
 */
export const invalidateTemplateQueries = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: DOCUMENTS_QUERY_KEYS.templates });
};

/**
 * Invalidates document share queries in the cache.
 *
 * Invalidates all share-related queries (lists, details, share tokens).
 * Use after share CRUD operations.
 *
 * @param queryClient - TanStack Query client instance
 *
 * @remarks
 * - Invalidates shares lists, details, and token-based shares
 * - Use after creating, updating, or deleting shares
 * - Does not affect document queries directly
 *
 * @example
 * ```typescript
 * // After creating a share
 * const { mutate } = useCreateShare({
 *   onSuccess: () => {
 *     invalidateShareQueries(queryClient);
 *   }
 * });
 * ```
 */
export const invalidateShareQueries = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: DOCUMENTS_QUERY_KEYS.shares });
};
