import { useQueries, UseQueryOptions } from '@tanstack/react-query';
import {
  DOCUMENTS_QUERY_KEYS,
  DOCUMENTS_CACHE_CONFIG,
  Document,
} from '../config';
import {
  useBulkDeleteDocuments,
  useBulkMoveDocuments,
} from '../mutations/useDocumentMutations';

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
