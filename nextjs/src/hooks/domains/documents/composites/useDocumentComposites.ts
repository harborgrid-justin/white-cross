import { useQuery, useQueries, UseQueryOptions } from '@tanstack/react-query';
import {
  DOCUMENTS_QUERY_KEYS,
  DOCUMENTS_CACHE_CONFIG,
  Document,
  DocumentCategory,
  DocumentTemplate,
  DocumentShare,
  DocumentActivity,
  DocumentComment,
} from '../config';
import {
  useDocuments,
  useDocumentDetails,
  useDocumentVersions,
  useSearchDocuments,
  useRecentDocuments,
  useFavoriteDocuments,
  useSharedWithMe,
  useCategories,
  useCategoryDetails,
  useCategoryDocuments,
  useTemplates,
  useTemplateDetails,
  useDocumentShares,
  useShareDetails,
  useDocumentActivity,
  useDocumentComments,
  useDocumentAnalytics,
} from '../queries/useDocumentQueries';
import {
  useCreateDocument,
  useUpdateDocument,
  useDeleteDocument,
  useMoveDocument,
  useCreateCategory,
  useUpdateCategory,
  useCreateTemplate,
  useCreateShare,
  useBulkDeleteDocuments,
  useBulkMoveDocuments,
} from '../mutations/useDocumentMutations';

// Combined document management hook
export const useDocumentManagement = (
  filters?: any,
  options?: UseQueryOptions<any, Error>
) => {
  const documentsQuery = useDocuments(filters, options);
  const categoriesQuery = useCategories(undefined, options);
  const templatesQuery = useTemplates(undefined, options);

  const createDocument = useCreateDocument();
  const updateDocument = useUpdateDocument();
  const deleteDocument = useDeleteDocument();
  const moveDocument = useMoveDocument();
  const bulkDelete = useBulkDeleteDocuments();
  const bulkMove = useBulkMoveDocuments();

  return {
    // Queries
    documents: documentsQuery.data || [],
    categories: categoriesQuery.data || [],
    templates: templatesQuery.data || [],
    
    // Loading states
    isLoadingDocuments: documentsQuery.isLoading,
    isLoadingCategories: categoriesQuery.isLoading,
    isLoadingTemplates: templatesQuery.isLoading,
    isLoading: documentsQuery.isLoading || categoriesQuery.isLoading || templatesQuery.isLoading,
    
    // Error states
    documentsError: documentsQuery.error,
    categoriesError: categoriesQuery.error,
    templatesError: templatesQuery.error,
    hasError: !!(documentsQuery.error || categoriesQuery.error || templatesQuery.error),
    
    // Mutations
    createDocument: createDocument.mutate,
    updateDocument: updateDocument.mutate,
    deleteDocument: deleteDocument.mutate,
    moveDocument: moveDocument.mutate,
    bulkDelete: bulkDelete.mutate,
    bulkMove: bulkMove.mutate,
    
    // Mutation states
    isCreating: createDocument.isPending,
    isUpdating: updateDocument.isPending,
    isDeleting: deleteDocument.isPending,
    isMoving: moveDocument.isPending,
    isBulkDeleting: bulkDelete.isPending,
    isBulkMoving: bulkMove.isPending,
    
    // Utility functions
    refetch: () => {
      documentsQuery.refetch();
      categoriesQuery.refetch();
      templatesQuery.refetch();
    },
  };
};

// Document details with related data
export const useDocumentDetailsComposite = (
  documentId: string,
  options?: UseQueryOptions<any, Error>
) => {
  const documentQuery = useDocumentDetails(documentId, options);
  const versionsQuery = useDocumentVersions(documentId, options);
  const sharesQuery = useDocumentShares(documentId, options);
  const activityQuery = useDocumentActivity(documentId, options);
  const commentsQuery = useDocumentComments(documentId, options);

  return {
    // Data
    document: documentQuery.data,
    versions: versionsQuery.data || [],
    shares: sharesQuery.data || [],
    activity: activityQuery.data || [],
    comments: commentsQuery.data || [],
    
    // Loading states
    isLoading: documentQuery.isLoading,
    isLoadingVersions: versionsQuery.isLoading,
    isLoadingShares: sharesQuery.isLoading,
    isLoadingActivity: activityQuery.isLoading,
    isLoadingComments: commentsQuery.isLoading,
    
    // Error states
    error: documentQuery.error,
    versionsError: versionsQuery.error,
    sharesError: sharesQuery.error,
    activityError: activityQuery.error,
    commentsError: commentsQuery.error,
    
    // Utility functions
    refetch: () => {
      documentQuery.refetch();
      versionsQuery.refetch();
      sharesQuery.refetch();
      activityQuery.refetch();
      commentsQuery.refetch();
    },
  };
};

// Category management with documents
export const useCategoryManagement = (
  categoryId?: string,
  options?: UseQueryOptions<any, Error>
) => {
  const categoriesQuery = useCategories(undefined, options);
  const categoryQuery = useCategoryDetails(categoryId || '', { 
    ...options, 
    enabled: !!categoryId 
  });
  const categoryDocumentsQuery = useCategoryDocuments(categoryId || '', { 
    ...options, 
    enabled: !!categoryId 
  });

  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();

  return {
    // Data
    categories: categoriesQuery.data || [],
    category: categoryQuery.data,
    categoryDocuments: categoryDocumentsQuery.data || [],
    
    // Loading states
    isLoadingCategories: categoriesQuery.isLoading,
    isLoadingCategory: categoryQuery.isLoading,
    isLoadingCategoryDocuments: categoryDocumentsQuery.isLoading,
    isLoading: categoriesQuery.isLoading || categoryQuery.isLoading || categoryDocumentsQuery.isLoading,
    
    // Error states
    categoriesError: categoriesQuery.error,
    categoryError: categoryQuery.error,
    categoryDocumentsError: categoryDocumentsQuery.error,
    
    // Mutations
    createCategory: createCategory.mutate,
    updateCategory: updateCategory.mutate,
    
    // Mutation states
    isCreating: createCategory.isPending,
    isUpdating: updateCategory.isPending,
    
    // Utility functions
    refetch: () => {
      categoriesQuery.refetch();
      categoryQuery.refetch();
      categoryDocumentsQuery.refetch();
    },
  };
};

// Template management with usage
export const useTemplateManagement = (
  templateId?: string,
  options?: UseQueryOptions<any, Error>
) => {
  const templatesQuery = useTemplates(undefined, options);
  const templateQuery = useTemplateDetails(templateId || '', { 
    ...options, 
    enabled: !!templateId 
  });

  const createTemplate = useCreateTemplate();

  return {
    // Data
    templates: templatesQuery.data || [],
    template: templateQuery.data,
    
    // Loading states
    isLoadingTemplates: templatesQuery.isLoading,
    isLoadingTemplate: templateQuery.isLoading,
    isLoading: templatesQuery.isLoading || templateQuery.isLoading,
    
    // Error states
    templatesError: templatesQuery.error,
    templateError: templateQuery.error,
    
    // Mutations
    createTemplate: createTemplate.mutate,
    
    // Mutation states
    isCreating: createTemplate.isPending,
    
    // Utility functions
    refetch: () => {
      templatesQuery.refetch();
      templateQuery.refetch();
    },
  };
};

// Document sharing management
export const useDocumentSharing = (
  documentId: string,
  options?: UseQueryOptions<any, Error>
) => {
  const documentQuery = useDocumentDetails(documentId, options);
  const sharesQuery = useDocumentShares(documentId, options);

  const createShare = useCreateShare();

  return {
    // Data
    document: documentQuery.data,
    shares: sharesQuery.data || [],
    
    // Loading states
    isLoadingDocument: documentQuery.isLoading,
    isLoadingShares: sharesQuery.isLoading,
    isLoading: documentQuery.isLoading || sharesQuery.isLoading,
    
    // Error states
    documentError: documentQuery.error,
    sharesError: sharesQuery.error,
    
    // Mutations
    createShare: createShare.mutate,
    
    // Mutation states
    isCreatingShare: createShare.isPending,
    
    // Utility functions
    refetch: () => {
      documentQuery.refetch();
      sharesQuery.refetch();
    },
  };
};

// Document search with filters
export const useDocumentSearch = (
  searchTerm: string,
  filters: {
    categoryId?: string;
    tags?: string[];
    status?: string;
    dateFrom?: string;
    dateTo?: string;
  } = {},
  options?: UseQueryOptions<any, Error>
) => {
  const searchQuery = useSearchDocuments(searchTerm, filters, options);
  const categoriesQuery = useCategories(undefined, options);

  return {
    // Data
    searchResults: searchQuery.data || [],
    categories: categoriesQuery.data || [],
    
    // Loading states
    isSearching: searchQuery.isLoading,
    isLoadingCategories: categoriesQuery.isLoading,
    
    // Error states
    searchError: searchQuery.error,
    categoriesError: categoriesQuery.error,
    
    // Meta data
    searchTerm,
    filters,
    hasResults: (searchQuery.data?.length || 0) > 0,
    
    // Utility functions
    refetch: () => {
      searchQuery.refetch();
      categoriesQuery.refetch();
    },
  };
};

// Recent documents dashboard
export const useRecentDocumentsComposite = (
  limit: number = 10,
  options?: UseQueryOptions<any, Error>
) => {
  const recentQuery = useRecentDocuments('current-user', limit, options);
  const favoritesQuery = useFavoriteDocuments('current-user', options);
  const sharedWithMeQuery = useSharedWithMe('current-user', options);

  return {
    // Data
    recentDocuments: recentQuery.data || [],
    favoriteDocuments: favoritesQuery.data || [],
    sharedWithMe: sharedWithMeQuery.data || [],
    
    // Loading states
    isLoadingRecent: recentQuery.isLoading,
    isLoadingFavorites: favoritesQuery.isLoading,
    isLoadingShared: sharedWithMeQuery.isLoading,
    isLoading: recentQuery.isLoading || favoritesQuery.isLoading || sharedWithMeQuery.isLoading,
    
    // Error states
    recentError: recentQuery.error,
    favoritesError: favoritesQuery.error,
    sharedError: sharedWithMeQuery.error,
    
    // Utility functions
    refetch: () => {
      recentQuery.refetch();
      favoritesQuery.refetch();
      sharedWithMeQuery.refetch();
    },
  };
};

// Document analytics composite
export const useDocumentAnalyticsComposite = (
  dateRange?: { start: string; end: string },
  options?: UseQueryOptions<any, Error>
) => {
  const analyticsQuery = useDocumentAnalytics('analytics-overview', undefined, options);
  const categoriesQuery = useCategories(undefined, options);

  return {
    // Data
    analytics: analyticsQuery.data,
    categories: categoriesQuery.data || [],
    
    // Loading states
    isLoadingAnalytics: analyticsQuery.isLoading,
    isLoadingCategories: categoriesQuery.isLoading,
    isLoading: analyticsQuery.isLoading || categoriesQuery.isLoading,
    
    // Error states
    analyticsError: analyticsQuery.error,
    categoriesError: categoriesQuery.error,
    
    // Computed values
    totalDocuments: analyticsQuery.data?.totalDocuments || 0,
    totalSize: analyticsQuery.data?.totalSize || 0,
    activeShares: analyticsQuery.data?.activeShares || 0,
    topCategories: analyticsQuery.data?.categoryBreakdown || [],
    
    // Utility functions
    refetch: () => {
      analyticsQuery.refetch();
      categoriesQuery.refetch();
    },
  };
};

// Bulk operations management
export const useBulkDocumentOperations = () => {
  const bulkDelete = useBulkDeleteDocuments();
  const bulkMove = useBulkMoveDocuments();

  return {
    // Mutations
    bulkDelete: bulkDelete.mutate,
    bulkMove: bulkMove.mutate,
    
    // Loading states
    isBulkDeleting: bulkDelete.isPending,
    isBulkMoving: bulkMove.isPending,
    isProcessing: bulkDelete.isPending || bulkMove.isPending,
    
    // Error states
    deleteError: bulkDelete.error,
    moveError: bulkMove.error,
    
    // Success states
    deleteSuccess: bulkDelete.isSuccess,
    moveSuccess: bulkMove.isSuccess,
    
    // Reset functions
    reset: () => {
      bulkDelete.reset();
      bulkMove.reset();
    },
  };
};

// Multiple documents details
export const useMultipleDocuments = (
  documentIds: string[],
  options?: UseQueryOptions<any, Error>
) => {
  // Mock API function for individual document fetch (to avoid hook in queryFn)
  const fetchDocument = async (id: string) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {} as Document;
  };

  const queries = useQueries({
    queries: documentIds.map(id => ({
      queryKey: DOCUMENTS_QUERY_KEYS.documentDetails(id),
      queryFn: () => fetchDocument(id),
      staleTime: DOCUMENTS_CACHE_CONFIG.DOCUMENTS_STALE_TIME,
      ...options,
    })),
  });

  return {
    // Data
    documents: queries.map(query => query.data).filter(Boolean) as Document[],
    
    // Loading states
    isLoading: queries.some(query => query.isLoading),
    isLoadingAny: queries.some(query => query.isLoading),
    loadingCount: queries.filter(query => query.isLoading).length,
    
    // Error states
    hasError: queries.some(query => query.error),
    errors: queries.map(query => query.error).filter(Boolean),
    errorCount: queries.filter(query => query.error).length,
    
    // Success states
    successCount: queries.filter(query => query.isSuccess).length,
    isAllLoaded: queries.every(query => query.isSuccess),
    
    // Individual queries for advanced use
    queries,
    
    // Utility functions
    refetchAll: () => {
      queries.forEach(query => query.refetch());
    },
  };
};

// Combined composites object for easy import
export const documentComposites = {
  useDocumentManagement,
  useDocumentDetailsComposite,
  useCategoryManagement,
  useTemplateManagement,
  useDocumentSharing,
  useDocumentSearch,
  useRecentDocumentsComposite,
  useDocumentAnalyticsComposite,
  useBulkDocumentOperations,
  useMultipleDocuments,
};
