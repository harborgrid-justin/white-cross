/**
 * Documents Domain Cache Configuration
 *
 * Cache configuration for Documents domain TanStack Query operations.
 * Defines staleTime and cacheTime (garbage collection time) for different types
 * of document data to balance performance and data freshness.
 *
 * @module hooks/domains/documents/documentCacheConfig
 * @author White Cross Healthcare Platform
 * @version 3.0.0
 */

/**
 * Cache configuration for Documents domain TanStack Query operations.
 *
 * Defines staleTime and cacheTime (garbage collection time) for different types
 * of document data to balance performance and data freshness. Healthcare documents
 * often contain PHI, so cache times are configured to ensure timely updates while
 * minimizing unnecessary API calls.
 *
 * @remarks
 * - **staleTime**: How long data is considered fresh before automatic refetch
 * - **cacheTime**: How long unused data remains in cache before garbage collection
 * - Documents: 10min staleTime (moderate freshness for active documents)
 * - Categories: 30min staleTime (rarely change)
 * - Templates: 15min staleTime (static structure, occasional updates)
 * - Default: 5min staleTime (for activity, comments, analytics)
 * - PHI-containing documents should use shorter staleTime in production
 *
 * @example
 * ```typescript
 * // Used in query hooks
 * useQuery({
 *   queryKey: DOCUMENTS_QUERY_KEYS.documentsList(),
 *   queryFn: fetchDocuments,
 *   staleTime: DOCUMENTS_CACHE_CONFIG.DOCUMENTS_STALE_TIME, // 10 minutes
 * });
 *
 * // Override for PHI-sensitive documents
 * useQuery({
 *   queryKey: DOCUMENTS_QUERY_KEYS.documentDetails(id),
 *   queryFn: () => fetchDocument(id),
 *   staleTime: 0, // Always fetch fresh for PHI documents
 * });
 * ```
 *
 * @see {@link DOCUMENTS_QUERY_KEYS} for related query key structure
 */
export const DOCUMENTS_CACHE_CONFIG = {
  DEFAULT_STALE_TIME: 5 * 60 * 1000, // 5 minutes
  DEFAULT_CACHE_TIME: 10 * 60 * 1000, // 10 minutes
  DOCUMENTS_STALE_TIME: 10 * 60 * 1000, // 10 minutes
  CATEGORIES_STALE_TIME: 30 * 60 * 1000, // 30 minutes
  TEMPLATES_STALE_TIME: 15 * 60 * 1000, // 15 minutes
} as const;
