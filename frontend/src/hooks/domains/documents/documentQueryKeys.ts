/**
 * Documents Domain Query Keys
 *
 * Query keys for Documents domain TanStack Query operations.
 * Provides a structured, hierarchical approach to cache key management for all
 * document-related queries. Keys are organized by entity type (documents, categories,
 * templates, shares) and operation (list, detail, versions).
 *
 * @module hooks/domains/documents/documentQueryKeys
 * @author White Cross Healthcare Platform
 * @version 3.0.0
 */

/**
 * Query keys for Documents domain TanStack Query operations.
 *
 * Provides a structured, hierarchical approach to cache key management for all
 * document-related queries. Keys are organized by entity type (documents, categories,
 * templates, shares) and operation (list, detail, versions).
 *
 * @remarks
 * - Uses const assertions for type safety and autocompletion
 * - Supports hierarchical cache invalidation (invalidate all documents, specific document, etc.)
 * - Keys include filters/parameters as part of cache identity for granular control
 * - Enables precise query matching and selective invalidation
 * - Essential for optimistic updates and cache synchronization
 *
 * @example
 * ```typescript
 * // Fetch all documents with filters
 * useQuery({
 *   queryKey: DOCUMENTS_QUERY_KEYS.documentsList({ status: 'PUBLISHED' }),
 *   queryFn: () => fetchDocuments({ status: 'PUBLISHED' })
 * });
 *
 * // Invalidate all document-related queries
 * queryClient.invalidateQueries({
 *   queryKey: DOCUMENTS_QUERY_KEYS.documents
 * });
 *
 * // Invalidate specific document details
 * queryClient.invalidateQueries({
 *   queryKey: DOCUMENTS_QUERY_KEYS.documentDetails('doc-123')
 * });
 *
 * // Invalidate all categories
 * queryClient.invalidateQueries({
 *   queryKey: DOCUMENTS_QUERY_KEYS.categories
 * });
 * ```
 *
 * @see {@link invalidateDocumentQueries} for bulk invalidation utilities
 */
export const DOCUMENTS_QUERY_KEYS = {
  // Documents
  documents: ['documents'] as const,
  documentsList: (filters?: any) => [...DOCUMENTS_QUERY_KEYS.documents, 'list', filters] as const,
  documentDetails: (id: string) => [...DOCUMENTS_QUERY_KEYS.documents, 'detail', id] as const,
  documentVersions: (docId: string) => [...DOCUMENTS_QUERY_KEYS.documents, docId, 'versions'] as const,

  // Categories
  categories: ['documents', 'categories'] as const,
  categoriesList: (filters?: any) => [...DOCUMENTS_QUERY_KEYS.categories, 'list', filters] as const,
  categoryDetails: (id: string) => [...DOCUMENTS_QUERY_KEYS.categories, 'detail', id] as const,

  // Templates
  templates: ['documents', 'templates'] as const,
  templatesList: (filters?: any) => [...DOCUMENTS_QUERY_KEYS.templates, 'list', filters] as const,
  templateDetails: (id: string) => [...DOCUMENTS_QUERY_KEYS.templates, 'detail', id] as const,

  // Shares
  shares: ['documents', 'shares'] as const,
  sharesList: (docId?: string) => [...DOCUMENTS_QUERY_KEYS.shares, 'list', docId] as const,
  shareDetails: (id: string) => [...DOCUMENTS_QUERY_KEYS.shares, 'detail', id] as const,
} as const;
