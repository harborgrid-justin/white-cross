/**
 * Document Query Hooks
 *
 * TanStack Query hooks for fetching document-related data. Provides hooks for
 * documents, categories, templates, shares, versions, activity, and comments.
 * All hooks include automatic caching, background refetching, and error handling.
 *
 * @module hooks/domains/documents/queries/useDocumentQueries
 * @author White Cross Healthcare Platform
 * @version 3.0.0
 *
 * @remarks
 * **Key Features:**
 * - Automatic caching with configurable staleTime
 * - Background refetching for data freshness
 * - Optimistic query enabling/disabling
 * - Built-in error handling
 * - Support for filters and pagination
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
 * } from '@/hooks/domains/documents';
 *
 * // In your component
 * const { data: documents, isLoading } = useDocuments();
 * const { data: document } = useDocumentDetails(documentId);
 * const { data: versions } = useDocumentVersions(documentId);
 * ```
 *
 * @see {@link ../config} for type definitions and configuration
 * @see {@link ../mutations/useDocumentMutations} for document mutations
 */

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import {
  DOCUMENTS_QUERY_KEYS,
  DOCUMENTS_CACHE_CONFIG,
  Document,
  DocumentCategory,
  DocumentTemplate,
  DocumentShare,
  DocumentVersion,
  DocumentActivity,
  DocumentComment,
} from '../config';

// Mock API functions (replace with actual API calls)
const mockDocumentAPI = {
  // Documents
  getDocuments: async (filters?: any): Promise<Document[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [];
  },
  
  getDocumentById: async (id: string): Promise<Document> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {} as Document;
  },
  
  getDocumentVersions: async (docId: string): Promise<DocumentVersion[]> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return [];
  },
  
  searchDocuments: async (query: string, filters?: any): Promise<Document[]> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    return [];
  },
  
  getRecentDocuments: async (userId: string, limit = 10): Promise<Document[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [];
  },
  
  getFavoriteDocuments: async (userId: string): Promise<Document[]> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return [];
  },
  
  getSharedWithMe: async (userId: string): Promise<Document[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [];
  },
  
  // Categories
  getCategories: async (filters?: any): Promise<DocumentCategory[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [];
  },
  
  getCategoryById: async (id: string): Promise<DocumentCategory> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return {} as DocumentCategory;
  },
  
  getCategoryDocuments: async (categoryId: string): Promise<Document[]> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return [];
  },
  
  // Templates
  getTemplates: async (filters?: any): Promise<DocumentTemplate[]> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return [];
  },
  
  getTemplateById: async (id: string): Promise<DocumentTemplate> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {} as DocumentTemplate;
  },
  
  getPopularTemplates: async (limit = 10): Promise<DocumentTemplate[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [];
  },
  
  // Shares
  getDocumentShares: async (docId?: string): Promise<DocumentShare[]> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return [];
  },
  
  getShareById: async (id: string): Promise<DocumentShare> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {} as DocumentShare;
  },
  
  getShareByToken: async (token: string): Promise<DocumentShare> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return {} as DocumentShare;
  },
  
  // Activity & Comments
  getDocumentActivity: async (docId: string): Promise<DocumentActivity[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [];
  },
  
  getDocumentComments: async (docId: string): Promise<DocumentComment[]> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return [];
  },
  
  // Analytics
  getDocumentAnalytics: async (docId: string, timeframe?: string): Promise<any> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      views: 0,
      downloads: 0,
      shares: 0,
      comments: 0,
      collaborators: 0,
    };
  },
  
  getDashboardStats: async (userId: string): Promise<any> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    return {
      totalDocuments: 0,
      recentUploads: 0,
      sharedDocuments: 0,
      storageUsed: 0,
      storageLimit: 1000000000, // 1GB
    };
  },
};

/**
 * Hook for fetching documents list with optional filtering.
 *
 * Retrieves all documents accessible to the current user, with optional filtering
 * by category, status, tags, or custom criteria. Results are cached for 10 minutes.
 *
 * @param filters - Optional filter criteria (category, status, tags, visibility, etc.)
 * @param options - Additional TanStack Query options for customization
 * @returns Query result containing documents array and query state
 *
 * @remarks
 * - Cached for 10 minutes (DOCUMENTS_STALE_TIME)
 * - Automatically refetches when filters change
 * - Supports pagination via filters object
 * - Access to PHI documents is automatically logged
 *
 * @example
 * ```typescript
 * // Fetch all documents
 * const { data: documents, isLoading } = useDocuments();
 *
 * // Fetch filtered documents
 * const { data: healthDocs } = useDocuments({
 *   categoryId: 'cat-health-records',
 *   status: 'PUBLISHED',
 *   tags: ['immunization']
 * });
 *
 * // With custom options
 * const { data } = useDocuments(
 *   { status: 'DRAFT' },
 *   { enabled: isAuthenticated, refetchInterval: 30000 }
 * );
 * ```
 *
 * @see {@link Document} for document structure
 * @see {@link useDocumentDetails} for individual document details
 */
export const useDocuments = (
  filters?: any,
  options?: UseQueryOptions<Document[], Error>
) => {
  return useQuery({
    queryKey: DOCUMENTS_QUERY_KEYS.documentsList(filters),
    queryFn: () => mockDocumentAPI.getDocuments(filters),
    staleTime: DOCUMENTS_CACHE_CONFIG.DOCUMENTS_STALE_TIME,
    ...options,
  });
};

/**
 * Hook for fetching individual document details by ID.
 *
 * Retrieves complete details for a specific document including metadata,
 * permissions, and audit information. Automatically disabled when ID is empty.
 *
 * @param id - Unique document identifier
 * @param options - Additional TanStack Query options
 * @returns Query result containing document object and query state
 *
 * @remarks
 * - Cached for 10 minutes (DOCUMENTS_STALE_TIME)
 * - Automatically disabled if `id` is falsy
 * - Document access is logged for HIPAA compliance
 * - Use shorter staleTime for PHI-sensitive documents
 *
 * @example
 * ```typescript
 * // Fetch document details
 * const { data: document, isLoading, error } = useDocumentDetails('doc-123');
 *
 * // Conditionally enabled
 * const { data } = useDocumentDetails(
 *   selectedDocId,
 *   { enabled: !!selectedDocId && hasPermission }
 * );
 *
 * // Override cache for PHI documents
 * const { data } = useDocumentDetails(docId, { staleTime: 0 });
 * ```
 *
 * @see {@link Document} for return type structure
 * @see {@link useDocuments} for list of documents
 */
export const useDocumentDetails = (
  id: string,
  options?: UseQueryOptions<Document, Error>
) => {
  return useQuery({
    queryKey: DOCUMENTS_QUERY_KEYS.documentDetails(id),
    queryFn: () => mockDocumentAPI.getDocumentById(id),
    staleTime: DOCUMENTS_CACHE_CONFIG.DOCUMENTS_STALE_TIME,
    enabled: !!id,
    ...options,
  });
};

/**
 * Hook for fetching document version history.
 *
 * Retrieves all versions of a document for version control and audit trail.
 * Shows version numbers, changes, and who made each upload.
 *
 * @param docId - Document ID to fetch versions for
 * @param options - Additional TanStack Query options
 * @returns Query result containing versions array and query state
 *
 * @remarks
 * - Cached for 10 minutes (DOCUMENTS_STALE_TIME)
 * - Automatically disabled if `docId` is empty
 * - Versions are ordered by version number (newest first)
 * - Each version has separate file URL for access
 * - Version history provides audit trail for compliance
 *
 * @example
 * ```typescript
 * // Fetch version history
 * const { data: versions, isLoading } = useDocumentVersions('doc-123');
 *
 * // Display version comparison
 * {versions?.map(version => (
 *   <div key={version.id}>
 *     <p>Version {version.version}</p>
 *     <p>Changes: {version.changes}</p>
 *     <p>By: {version.createdBy.name}</p>
 *     <p>Date: {new Date(version.createdAt).toLocaleDateString()}</p>
 *     {version.isLatest && <span>Current</span>}
 *   </div>
 * ))}
 * ```
 *
 * @see {@link DocumentVersion} for version structure
 * @see {@link useUploadNewVersion} for uploading new versions
 */
export const useDocumentVersions = (
  docId: string,
  options?: UseQueryOptions<DocumentVersion[], Error>
) => {
  return useQuery({
    queryKey: DOCUMENTS_QUERY_KEYS.documentVersions(docId),
    queryFn: () => mockDocumentAPI.getDocumentVersions(docId),
    staleTime: DOCUMENTS_CACHE_CONFIG.DOCUMENTS_STALE_TIME,
    enabled: !!docId,
    ...options,
  });
};

/**
 * Hook for searching documents by text query and filters.
 *
 * Full-text search across document titles, descriptions, content, and tags.
 * Minimum query length of 2 characters required to prevent excessive API calls.
 *
 * @param query - Search query string (minimum 2 characters)
 * @param filters - Optional additional filters (category, status, date range)
 * @param options - Additional TanStack Query options
 * @returns Query result containing matching documents array and query state
 *
 * @remarks
 * - Cached for 5 minutes (DEFAULT_STALE_TIME)
 * - Automatically disabled if query is empty or less than 2 characters
 * - Searches document titles, descriptions, tags, and content
 * - Can be combined with filters for refined results
 * - Results relevance-ranked by search engine
 *
 * @example
 * ```typescript
 * // Basic search
 * const { data: results, isLoading } = useSearchDocuments('immunization');
 *
 * // Search with filters
 * const { data } = useSearchDocuments(
 *   'health assessment',
 *   { categoryId: 'cat-health', status: 'PUBLISHED' }
 * );
 *
 * // Debounced search input
 * const [searchTerm, setSearchTerm] = useState('');
 * const { data } = useSearchDocuments(searchTerm);
 * ```
 *
 * @see {@link useDocuments} for filtered browsing without search
 */
export const useSearchDocuments = (
  query: string,
  filters?: any,
  options?: UseQueryOptions<Document[], Error>
) => {
  return useQuery({
    queryKey: ['documents', 'search', query, filters],
    queryFn: () => mockDocumentAPI.searchDocuments(query, filters),
    staleTime: DOCUMENTS_CACHE_CONFIG.DEFAULT_STALE_TIME,
    enabled: !!query && query.length >= 2,
    ...options,
  });
};

/**
 * Hook for fetching recently accessed/modified documents for a user.
 *
 * Returns documents recently viewed, edited, or created by the specified user,
 * ordered by recency. Useful for "Recent Documents" dashboard widgets.
 *
 * @param userId - User ID to fetch recent documents for
 * @param limit - Maximum number of documents to return (default: 10)
 * @param options - Additional TanStack Query options
 * @returns Query result containing recent documents array and query state
 *
 * @remarks
 * - Cached for 5 minutes (DEFAULT_STALE_TIME)
 * - Automatically disabled if userId is empty
 * - Results ordered by most recent activity first
 * - Includes documents viewed, edited, or created
 * - Activity timestamp tracked in DocumentActivity
 *
 * @example
 * ```typescript
 * // Fetch 10 most recent documents
 * const { data: recentDocs } = useRecentDocuments(currentUserId);
 *
 * // Fetch more recent documents
 * const { data } = useRecentDocuments(currentUserId, 20);
 *
 * // Recent documents widget
 * <div>
 *   <h3>Recent Documents</h3>
 *   {recentDocs?.map(doc => (
 *     <DocumentCard key={doc.id} document={doc} />
 *   ))}
 * </div>
 * ```
 *
 * @see {@link useDocumentActivity} for activity tracking
 */
export const useRecentDocuments = (
  userId: string,
  limit = 10,
  options?: UseQueryOptions<Document[], Error>
) => {
  return useQuery({
    queryKey: ['documents', 'recent', userId, limit],
    queryFn: () => mockDocumentAPI.getRecentDocuments(userId, limit),
    staleTime: DOCUMENTS_CACHE_CONFIG.DEFAULT_STALE_TIME,
    enabled: !!userId,
    ...options,
  });
};

/**
 * Hook for fetching user's favorite/bookmarked documents.
 *
 * Returns all documents marked as favorites by the specified user.
 * Users can favorite documents for quick access.
 *
 * @param userId - User ID to fetch favorites for
 * @param options - Additional TanStack Query options
 * @returns Query result containing favorite documents array and query state
 *
 * @remarks
 * - Cached for 10 minutes (DOCUMENTS_STALE_TIME)
 * - Automatically disabled if userId is empty
 * - Results ordered by favorite date (newest first)
 * - Use with useFavoriteDocument/useUnfavoriteDocument mutations
 *
 * @example
 * ```typescript
 * // Fetch favorites
 * const { data: favorites } = useFavoriteDocuments(currentUserId);
 *
 * // Favorites page
 * <div>
 *   <h2>My Favorites</h2>
 *   {favorites?.length === 0 ? (
 *     <p>No favorite documents yet</p>
 *   ) : (
 *     favorites?.map(doc => <DocumentCard key={doc.id} document={doc} />)
 *   )}
 * </div>
 * ```
 *
 * @see {@link useFavoriteDocument} for adding favorites
 * @see {@link useUnfavoriteDocument} for removing favorites
 */
export const useFavoriteDocuments = (
  userId: string,
  options?: UseQueryOptions<Document[], Error>
) => {
  return useQuery({
    queryKey: ['documents', 'favorites', userId],
    queryFn: () => mockDocumentAPI.getFavoriteDocuments(userId),
    staleTime: DOCUMENTS_CACHE_CONFIG.DOCUMENTS_STALE_TIME,
    enabled: !!userId,
    ...options,
  });
};

/**
 * Hook for fetching documents shared with the current user.
 *
 * Returns all documents that have been shared with the specified user
 * via email, link, or internal sharing.
 *
 * @param userId - User ID to fetch shared documents for
 * @param options - Additional TanStack Query options
 * @returns Query result containing shared documents array and query state
 *
 * @remarks
 * - Cached for 5 minutes (DEFAULT_STALE_TIME)
 * - Automatically disabled if userId is empty
 * - Includes documents shared via all methods (EMAIL, LINK, INTERNAL)
 * - Results ordered by share date (newest first)
 * - Access permissions may vary (view-only, comment, edit)
 *
 * @example
 * ```typescript
 * // Fetch shared documents
 * const { data: sharedDocs } = useSharedWithMe(currentUserId);
 *
 * // Shared with me page
 * <div>
 *   <h2>Shared With Me</h2>
 *   {sharedDocs?.map(doc => (
 *     <DocumentCard
 *       key={doc.id}
 *       document={doc}
 *       showSharedBy={true}
 *     />
 *   ))}
 * </div>
 * ```
 *
 * @see {@link useDocumentShares} for document's share list
 * @see {@link useCreateShare} for sharing documents
 */
export const useSharedWithMe = (
  userId: string,
  options?: UseQueryOptions<Document[], Error>
) => {
  return useQuery({
    queryKey: ['documents', 'shared-with-me', userId],
    queryFn: () => mockDocumentAPI.getSharedWithMe(userId),
    staleTime: DOCUMENTS_CACHE_CONFIG.DEFAULT_STALE_TIME,
    enabled: !!userId,
    ...options,
  });
};

// Category Queries
export const useCategories = (
  filters?: any,
  options?: UseQueryOptions<DocumentCategory[], Error>
) => {
  return useQuery({
    queryKey: DOCUMENTS_QUERY_KEYS.categoriesList(filters),
    queryFn: () => mockDocumentAPI.getCategories(filters),
    staleTime: DOCUMENTS_CACHE_CONFIG.CATEGORIES_STALE_TIME,
    ...options,
  });
};

export const useCategoryDetails = (
  id: string,
  options?: UseQueryOptions<DocumentCategory, Error>
) => {
  return useQuery({
    queryKey: DOCUMENTS_QUERY_KEYS.categoryDetails(id),
    queryFn: () => mockDocumentAPI.getCategoryById(id),
    staleTime: DOCUMENTS_CACHE_CONFIG.CATEGORIES_STALE_TIME,
    enabled: !!id,
    ...options,
  });
};

export const useCategoryDocuments = (
  categoryId: string,
  options?: UseQueryOptions<Document[], Error>
) => {
  return useQuery({
    queryKey: ['documents', 'category', categoryId, 'documents'],
    queryFn: () => mockDocumentAPI.getCategoryDocuments(categoryId),
    staleTime: DOCUMENTS_CACHE_CONFIG.DOCUMENTS_STALE_TIME,
    enabled: !!categoryId,
    ...options,
  });
};

// Template Queries
export const useTemplates = (
  filters?: any,
  options?: UseQueryOptions<DocumentTemplate[], Error>
) => {
  return useQuery({
    queryKey: DOCUMENTS_QUERY_KEYS.templatesList(filters),
    queryFn: () => mockDocumentAPI.getTemplates(filters),
    staleTime: DOCUMENTS_CACHE_CONFIG.TEMPLATES_STALE_TIME,
    ...options,
  });
};

export const useTemplateDetails = (
  id: string,
  options?: UseQueryOptions<DocumentTemplate, Error>
) => {
  return useQuery({
    queryKey: DOCUMENTS_QUERY_KEYS.templateDetails(id),
    queryFn: () => mockDocumentAPI.getTemplateById(id),
    staleTime: DOCUMENTS_CACHE_CONFIG.TEMPLATES_STALE_TIME,
    enabled: !!id,
    ...options,
  });
};

export const usePopularTemplates = (
  limit = 10,
  options?: UseQueryOptions<DocumentTemplate[], Error>
) => {
  return useQuery({
    queryKey: ['documents', 'templates', 'popular', limit],
    queryFn: () => mockDocumentAPI.getPopularTemplates(limit),
    staleTime: DOCUMENTS_CACHE_CONFIG.TEMPLATES_STALE_TIME,
    ...options,
  });
};

// Share Queries
export const useDocumentShares = (
  docId?: string,
  options?: UseQueryOptions<DocumentShare[], Error>
) => {
  return useQuery({
    queryKey: DOCUMENTS_QUERY_KEYS.sharesList(docId),
    queryFn: () => mockDocumentAPI.getDocumentShares(docId),
    staleTime: DOCUMENTS_CACHE_CONFIG.DEFAULT_STALE_TIME,
    ...options,
  });
};

export const useShareDetails = (
  id: string,
  options?: UseQueryOptions<DocumentShare, Error>
) => {
  return useQuery({
    queryKey: DOCUMENTS_QUERY_KEYS.shareDetails(id),
    queryFn: () => mockDocumentAPI.getShareById(id),
    staleTime: DOCUMENTS_CACHE_CONFIG.DEFAULT_STALE_TIME,
    enabled: !!id,
    ...options,
  });
};

export const useShareByToken = (
  token: string,
  options?: UseQueryOptions<DocumentShare, Error>
) => {
  return useQuery({
    queryKey: ['documents', 'share', 'token', token],
    queryFn: () => mockDocumentAPI.getShareByToken(token),
    staleTime: DOCUMENTS_CACHE_CONFIG.DEFAULT_STALE_TIME,
    enabled: !!token,
    ...options,
  });
};

// Activity & Comments Queries
export const useDocumentActivity = (
  docId: string,
  options?: UseQueryOptions<DocumentActivity[], Error>
) => {
  return useQuery({
    queryKey: ['documents', docId, 'activity'],
    queryFn: () => mockDocumentAPI.getDocumentActivity(docId),
    staleTime: DOCUMENTS_CACHE_CONFIG.DEFAULT_STALE_TIME,
    enabled: !!docId,
    ...options,
  });
};

export const useDocumentComments = (
  docId: string,
  options?: UseQueryOptions<DocumentComment[], Error>
) => {
  return useQuery({
    queryKey: ['documents', docId, 'comments'],
    queryFn: () => mockDocumentAPI.getDocumentComments(docId),
    staleTime: DOCUMENTS_CACHE_CONFIG.DEFAULT_STALE_TIME,
    enabled: !!docId,
    refetchInterval: 30000, // Refresh every 30 seconds for real-time comments
    ...options,
  });
};

// Analytics Queries
export const useDocumentAnalytics = (
  docId: string,
  timeframe?: string,
  options?: UseQueryOptions<any, Error>
) => {
  return useQuery({
    queryKey: ['documents', docId, 'analytics', timeframe],
    queryFn: () => mockDocumentAPI.getDocumentAnalytics(docId, timeframe),
    staleTime: DOCUMENTS_CACHE_CONFIG.DEFAULT_STALE_TIME,
    enabled: !!docId,
    ...options,
  });
};

export const useDocumentsDashboard = (
  userId: string,
  options?: UseQueryOptions<any, Error>
) => {
  return useQuery({
    queryKey: ['documents', 'dashboard', userId],
    queryFn: () => mockDocumentAPI.getDashboardStats(userId),
    staleTime: DOCUMENTS_CACHE_CONFIG.DEFAULT_STALE_TIME,
    enabled: !!userId,
    ...options,
  });
};

// Bulk Queries for Dashboard
export const useDocumentOverview = (
  userId: string,
  options?: UseQueryOptions<any, Error>
) => {
  return useQuery({
    queryKey: ['documents', 'overview', userId],
    queryFn: async () => {
      const [recent, favorites, shared, stats] = await Promise.all([
        mockDocumentAPI.getRecentDocuments(userId, 5),
        mockDocumentAPI.getFavoriteDocuments(userId),
        mockDocumentAPI.getSharedWithMe(userId),
        mockDocumentAPI.getDashboardStats(userId),
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
