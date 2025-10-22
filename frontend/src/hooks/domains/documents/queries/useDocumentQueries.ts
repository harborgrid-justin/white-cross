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

// Document Queries
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
