/**
 * Document Share and Activity Query Hooks
 *
 * TanStack Query hooks for fetching document shares, activity logs, and comments.
 * Manages document collaboration features.
 *
 * @module hooks/domains/documents/queries/useDocumentShareQueries
 * @author White Cross Healthcare Platform
 * @version 3.0.0
 */

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import {
  DOCUMENTS_QUERY_KEYS,
  DOCUMENTS_CACHE_CONFIG,
  DocumentShare,
  DocumentActivity,
  DocumentComment,
} from '../config';
import { documentQueryAPI } from './documentQueryAPI';

/**
 * Fetch document shares.
 * Shows who has access, permission levels, and share methods.
 * If docId provided, returns shares for that document only.
 *
 * @example
 * const { data: shares } = useDocumentShares('doc-123');
 */
export const useDocumentShares = (
  docId?: string,
  options?: UseQueryOptions<DocumentShare[], Error>
) => {
  return useQuery({
    queryKey: DOCUMENTS_QUERY_KEYS.sharesList(docId),
    queryFn: () => documentQueryAPI.getDocumentShares(docId),
    staleTime: DOCUMENTS_CACHE_CONFIG.DEFAULT_STALE_TIME,
    ...options,
  });
};

/**
 * Fetch individual share details by ID.
 * Includes permissions, expiration, and access history.
 *
 * @example
 * const { data: share } = useShareDetails('share-123');
 */
export const useShareDetails = (
  id: string,
  options?: UseQueryOptions<DocumentShare, Error>
) => {
  return useQuery({
    queryKey: DOCUMENTS_QUERY_KEYS.shareDetails(id),
    queryFn: () => documentQueryAPI.getShareById(id),
    staleTime: DOCUMENTS_CACHE_CONFIG.DEFAULT_STALE_TIME,
    enabled: !!id,
    ...options,
  });
};

/**
 * Fetch share by token (for public links).
 * Used for accessing documents via public links without authentication.
 * Token may be expired or revoked.
 *
 * @example
 * const token = searchParams.get('token');
 * const { data: share } = useShareByToken(token);
 */
export const useShareByToken = (
  token: string,
  options?: UseQueryOptions<DocumentShare, Error>
) => {
  return useQuery({
    queryKey: ['documents', 'share', 'token', token],
    queryFn: () => documentQueryAPI.getShareByToken(token),
    staleTime: DOCUMENTS_CACHE_CONFIG.DEFAULT_STALE_TIME,
    enabled: !!token,
    ...options,
  });
};

/**
 * Fetch document activity log.
 * Includes views, edits, downloads, shares, and other actions.
 * Provides audit trail for HIPAA compliance. Ordered by most recent first.
 *
 * @example
 * const { data: activity } = useDocumentActivity('doc-123');
 */
export const useDocumentActivity = (
  docId: string,
  options?: UseQueryOptions<DocumentActivity[], Error>
) => {
  return useQuery({
    queryKey: ['documents', docId, 'activity'],
    queryFn: () => documentQueryAPI.getDocumentActivity(docId),
    staleTime: DOCUMENTS_CACHE_CONFIG.DEFAULT_STALE_TIME,
    enabled: !!docId,
    ...options,
  });
};

/**
 * Fetch document comments.
 * Returns all comments for collaboration and discussion.
 * Automatically refetches every 30 seconds for near real-time updates.
 * Supports nested comment threads.
 *
 * @example
 * const { data: comments } = useDocumentComments('doc-123');
 */
export const useDocumentComments = (
  docId: string,
  options?: UseQueryOptions<DocumentComment[], Error>
) => {
  return useQuery({
    queryKey: ['documents', docId, 'comments'],
    queryFn: () => documentQueryAPI.getDocumentComments(docId),
    staleTime: DOCUMENTS_CACHE_CONFIG.DEFAULT_STALE_TIME,
    enabled: !!docId,
    refetchInterval: 30000, // Refresh every 30 seconds for real-time comments
    ...options,
  });
};
