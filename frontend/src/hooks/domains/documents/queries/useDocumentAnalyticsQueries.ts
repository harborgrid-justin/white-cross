/**
 * Document Analytics Query Hooks
 *
 * TanStack Query hooks for fetching document analytics, statistics, and dashboard
 * data. Provides insights into document usage, user activity, and system metrics.
 *
 * @module hooks/domains/documents/queries/useDocumentAnalyticsQueries
 * @author White Cross Healthcare Platform
 * @version 3.0.0
 *
 * @remarks
 * **Key Features:**
 * - Document-level analytics (views, downloads, shares)
 * - User dashboard statistics
 * - Bulk overview queries for dashboards
 *
 * **Use Cases:**
 * - Document usage insights
 * - User activity tracking
 * - Dashboard widgets
 * - Reporting and analytics
 *
 * @example
 * ```typescript
 * import {
 *   useDocumentAnalytics,
 *   useDocumentsDashboard,
 *   useDocumentOverview
 * } from '@/hooks/domains/documents/queries';
 *
 * // Fetch analytics and dashboard data
 * const { data: analytics } = useDocumentAnalytics(docId);
 * const { data: dashboard } = useDocumentsDashboard(userId);
 * const { data: overview } = useDocumentOverview(userId);
 * ```
 *
 * @see {@link ../config} for type definitions and configuration
 * @see {@link documentQueryAPI} for API implementation
 */

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { DOCUMENTS_CACHE_CONFIG } from '../config';
import { documentQueryAPI } from './documentQueryAPI';

/**
 * Hook for fetching document analytics data.
 *
 * Retrieves analytics for a specific document including views, downloads,
 * shares, comments, and collaborator count. Useful for understanding
 * document usage and engagement.
 *
 * @param docId - Document identifier
 * @param timeframe - Optional timeframe filter (e.g., '7d', '30d', 'all')
 * @param options - Additional TanStack Query options
 * @returns Query result containing analytics data and query state
 *
 * @remarks
 * - Cached for 5 minutes (DEFAULT_STALE_TIME)
 * - Automatically disabled if `docId` is empty
 * - Analytics data includes:
 *   - Total views
 *   - Total downloads
 *   - Share count
 *   - Comment count
 *   - Collaborator count
 * - Timeframe parameter filters by date range
 *
 * @example
 * ```typescript
 * // Fetch document analytics
 * const { data: analytics } = useDocumentAnalytics('doc-123');
 *
 * // Analytics dashboard
 * <div>
 *   <h3>Document Analytics</h3>
 *   <div className="stats">
 *     <div>Views: {analytics?.views}</div>
 *     <div>Downloads: {analytics?.downloads}</div>
 *     <div>Shares: {analytics?.shares}</div>
 *     <div>Comments: {analytics?.comments}</div>
 *     <div>Collaborators: {analytics?.collaborators}</div>
 *   </div>
 * </div>
 *
 * // With timeframe
 * const { data } = useDocumentAnalytics('doc-123', '30d');
 * ```
 *
 * @see {@link useDocumentsDashboard} for user-level statistics
 */
export const useDocumentAnalytics = (
  docId: string,
  timeframe?: string,
  options?: UseQueryOptions<any, Error>
) => {
  return useQuery({
    queryKey: ['documents', docId, 'analytics', timeframe],
    queryFn: () => documentQueryAPI.getDocumentAnalytics(docId, timeframe),
    staleTime: DOCUMENTS_CACHE_CONFIG.DEFAULT_STALE_TIME,
    enabled: !!docId,
    ...options,
  });
};

/**
 * Hook for fetching user dashboard statistics.
 *
 * Retrieves high-level statistics for a user's document management
 * including total documents, recent uploads, shared documents, and
 * storage usage. Perfect for dashboard overview widgets.
 *
 * @param userId - User identifier
 * @param options - Additional TanStack Query options
 * @returns Query result containing dashboard statistics and query state
 *
 * @remarks
 * - Cached for 5 minutes (DEFAULT_STALE_TIME)
 * - Automatically disabled if `userId` is empty
 * - Statistics include:
 *   - Total documents owned
 *   - Recent uploads count
 *   - Shared documents count
 *   - Storage used (bytes)
 *   - Storage limit (bytes)
 *
 * @example
 * ```typescript
 * // Fetch dashboard stats
 * const { data: stats } = useDocumentsDashboard(currentUserId);
 *
 * // Dashboard overview
 * <div className="dashboard">
 *   <div className="stat-card">
 *     <h4>Total Documents</h4>
 *     <p>{stats?.totalDocuments}</p>
 *   </div>
 *   <div className="stat-card">
 *     <h4>Recent Uploads</h4>
 *     <p>{stats?.recentUploads}</p>
 *   </div>
 *   <div className="stat-card">
 *     <h4>Shared Documents</h4>
 *     <p>{stats?.sharedDocuments}</p>
 *   </div>
 *   <div className="stat-card">
 *     <h4>Storage</h4>
 *     <p>{formatBytes(stats?.storageUsed)} / {formatBytes(stats?.storageLimit)}</p>
 *   </div>
 * </div>
 * ```
 *
 * @see {@link useDocumentOverview} for detailed dashboard data
 */
export const useDocumentsDashboard = (
  userId: string,
  options?: UseQueryOptions<any, Error>
) => {
  return useQuery({
    queryKey: ['documents', 'dashboard', userId],
    queryFn: () => documentQueryAPI.getDashboardStats(userId),
    staleTime: DOCUMENTS_CACHE_CONFIG.DEFAULT_STALE_TIME,
    enabled: !!userId,
    ...options,
  });
};

/**
 * Hook for fetching comprehensive document overview for dashboards.
 *
 * Performs multiple queries in parallel to fetch recent documents, favorites,
 * shared documents, and statistics all at once. Optimized for dashboard pages
 * that need multiple data sources simultaneously.
 *
 * @param userId - User identifier
 * @param options - Additional TanStack Query options
 * @returns Query result containing overview data and query state
 *
 * @remarks
 * - Cached for 5 minutes (DEFAULT_STALE_TIME)
 * - Automatically disabled if `userId` is empty
 * - Fetches data in parallel using Promise.all:
 *   - Recent documents (5 most recent)
 *   - Favorite documents (5 most recent)
 *   - Shared documents (5 most recent)
 *   - Dashboard statistics
 *   - Quick action items
 * - Single network request for all data
 * - Optimized for dashboard performance
 *
 * @example
 * ```typescript
 * // Fetch complete overview
 * const { data: overview, isLoading } = useDocumentOverview(currentUserId);
 *
 * // Dashboard page
 * <div className="dashboard">
 *   {isLoading ? (
 *     <Spinner />
 *   ) : (
 *     <>
 *       <section>
 *         <h2>Recent Documents</h2>
 *         {overview?.recent.map(doc => (
 *           <DocumentCard key={doc.id} document={doc} />
 *         ))}
 *       </section>
 *
 *       <section>
 *         <h2>Favorites</h2>
 *         {overview?.favorites.map(doc => (
 *           <DocumentCard key={doc.id} document={doc} />
 *         ))}
 *       </section>
 *
 *       <section>
 *         <h2>Shared With Me</h2>
 *         {overview?.shared.map(doc => (
 *           <DocumentCard key={doc.id} document={doc} />
 *         ))}
 *       </section>
 *
 *       <section>
 *         <h2>Quick Actions</h2>
 *         {overview?.quickActions.map(action => (
 *           <button
 *             key={action.key}
 *             disabled={!action.available}
 *           >
 *             {action.label}
 *           </button>
 *         ))}
 *       </section>
 *
 *       <section>
 *         <h2>Statistics</h2>
 *         <StatsGrid stats={overview?.stats} />
 *       </section>
 *     </>
 *   )}
 * </div>
 * ```
 *
 * @see {@link useDocumentsDashboard} for statistics only
 * @see {@link useRecentDocuments} for recent documents only
 * @see {@link useFavoriteDocuments} for favorites only
 */
export const useDocumentOverview = (
  userId: string,
  options?: UseQueryOptions<any, Error>
) => {
  return useQuery({
    queryKey: ['documents', 'overview', userId],
    queryFn: async () => {
      const [recent, favorites, shared, stats] = await Promise.all([
        documentQueryAPI.getRecentDocuments(userId, 5),
        documentQueryAPI.getFavoriteDocuments(userId),
        documentQueryAPI.getSharedWithMe(userId),
        documentQueryAPI.getDashboardStats(userId),
      ]);

      return {
        recent,
        favorites: favorites.slice(0, 5),
        shared: shared.slice(0, 5),
        stats,
        quickActions: [
          { key: 'upload', label: 'Upload Document', available: true },
          { key: 'create', label: 'Create from Template', available: true },
          { key: 'scan', label: 'Scan Document', available: true },
          { key: 'share', label: 'Share Document', available: recent.length > 0 },
        ],
      };
    },
    staleTime: DOCUMENTS_CACHE_CONFIG.DEFAULT_STALE_TIME,
    enabled: !!userId,
    ...options,
  });
};
