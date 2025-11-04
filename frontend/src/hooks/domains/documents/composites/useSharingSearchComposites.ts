import { UseQueryOptions } from '@tanstack/react-query';
import {
  useDocumentDetails,
  useDocumentShares,
  useSearchDocuments,
  useCategories,
} from '../queries/useDocumentQueries';
import {
  useCreateShare,
} from '../mutations/useDocumentMutations';

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
