/**
 * Document Core Query Hooks
 *
 * TanStack Query hooks for core document operations: fetching documents, details,
 * versions, search, recent, favorites, and shared documents.
 *
 * @module hooks/domains/documents/queries/useDocumentCoreQueries
 * @author White Cross Healthcare Platform
 * @version 3.0.0
 */

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import {
  DOCUMENTS_QUERY_KEYS,
  DOCUMENTS_CACHE_CONFIG,
  Document,
  DocumentVersion,
} from '../config';
import { documentQueryAPI } from './documentQueryAPI';

/**
 * Fetch documents list with optional filtering.
 * Cached for 10 minutes. PHI access is automatically logged.
 *
 * @example
 * const { data: documents } = useDocuments({ status: 'PUBLISHED' });
 */
export const useDocuments = (
  filters?: any,
  options?: UseQueryOptions<Document[], Error>
) => {
  return useQuery({
    queryKey: DOCUMENTS_QUERY_KEYS.documentsList(filters),
    queryFn: () => documentQueryAPI.getDocuments(filters),
    staleTime: DOCUMENTS_CACHE_CONFIG.DOCUMENTS_STALE_TIME,
    ...options,
  });
};

/**
 * Fetch individual document details by ID.
 * Automatically disabled if ID is empty. Cached for 10 minutes.
 *
 * @example
 * const { data: document } = useDocumentDetails('doc-123');
 */
export const useDocumentDetails = (
  id: string,
  options?: UseQueryOptions<Document, Error>
) => {
  return useQuery({
    queryKey: DOCUMENTS_QUERY_KEYS.documentDetails(id),
    queryFn: () => documentQueryAPI.getDocumentById(id),
    staleTime: DOCUMENTS_CACHE_CONFIG.DOCUMENTS_STALE_TIME,
    enabled: !!id,
    ...options,
  });
};

/**
 * Fetch document version history.
 * Returns all versions ordered by version number (newest first).
 * Provides audit trail for compliance.
 *
 * @example
 * const { data: versions } = useDocumentVersions('doc-123');
 */
export const useDocumentVersions = (
  docId: string,
  options?: UseQueryOptions<DocumentVersion[], Error>
) => {
  return useQuery({
    queryKey: DOCUMENTS_QUERY_KEYS.documentVersions(docId),
    queryFn: () => documentQueryAPI.getDocumentVersions(docId),
    staleTime: DOCUMENTS_CACHE_CONFIG.DOCUMENTS_STALE_TIME,
    enabled: !!docId,
    ...options,
  });
};

/**
 * Full-text search across document titles, descriptions, content, and tags.
 * Minimum query length of 2 characters. Cached for 5 minutes.
 *
 * @example
 * const { data: results } = useSearchDocuments('immunization', {
 *   categoryId: 'cat-health',
 *   status: 'PUBLISHED'
 * });
 */
export const useSearchDocuments = (
  query: string,
  filters?: any,
  options?: UseQueryOptions<Document[], Error>
) => {
  return useQuery({
    queryKey: ['documents', 'search', query, filters],
    queryFn: () => documentQueryAPI.searchDocuments(query, filters),
    staleTime: DOCUMENTS_CACHE_CONFIG.DEFAULT_STALE_TIME,
    enabled: !!query && query.length >= 2,
    ...options,
  });
};

/**
 * Fetch recently accessed/modified documents for a user.
 * Returns documents recently viewed, edited, or created, ordered by recency.
 * Useful for "Recent Documents" dashboard widgets.
 *
 * @param userId - User ID to fetch recent documents for
 * @param limit - Maximum number of documents to return (default: 10)
 *
 * @example
 * const { data: recentDocs } = useRecentDocuments(currentUserId, 10);
 */
export const useRecentDocuments = (
  userId: string,
  limit = 10,
  options?: UseQueryOptions<Document[], Error>
) => {
  return useQuery({
    queryKey: ['documents', 'recent', userId, limit],
    queryFn: () => documentQueryAPI.getRecentDocuments(userId, limit),
    staleTime: DOCUMENTS_CACHE_CONFIG.DEFAULT_STALE_TIME,
    enabled: !!userId,
    ...options,
  });
};

/**
 * Fetch user's favorite/bookmarked documents.
 * Returns all documents marked as favorites, ordered by favorite date (newest first).
 *
 * @example
 * const { data: favorites } = useFavoriteDocuments(currentUserId);
 */
export const useFavoriteDocuments = (
  userId: string,
  options?: UseQueryOptions<Document[], Error>
) => {
  return useQuery({
    queryKey: ['documents', 'favorites', userId],
    queryFn: () => documentQueryAPI.getFavoriteDocuments(userId),
    staleTime: DOCUMENTS_CACHE_CONFIG.DOCUMENTS_STALE_TIME,
    enabled: !!userId,
    ...options,
  });
};

/**
 * Fetch documents shared with the current user.
 * Includes documents shared via email, link, or internal sharing.
 * Ordered by share date (newest first).
 *
 * @example
 * const { data: sharedDocs } = useSharedWithMe(currentUserId);
 */
export const useSharedWithMe = (
  userId: string,
  options?: UseQueryOptions<Document[], Error>
) => {
  return useQuery({
    queryKey: ['documents', 'shared-with-me', userId],
    queryFn: () => documentQueryAPI.getSharedWithMe(userId),
    staleTime: DOCUMENTS_CACHE_CONFIG.DEFAULT_STALE_TIME,
    enabled: !!userId,
    ...options,
  });
};
