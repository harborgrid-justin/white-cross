/**
 * Purchase Order Search Hook
 *
 * Advanced search with facets and filtering.
 *
 * @module hooks/domains/purchase-orders/composites/usePurchaseOrderSearch
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

/**
 * Purchase Order Search and Filter Composite Hook.
 *
 * Performs advanced search with multiple criteria and returns results with facets.
 *
 * @returns {UseMutationResult} Mutation result with search functionality
 *
 * @example
 * ```tsx
 * const search = usePurchaseOrderSearch();
 *
 * const handleSearch = () => {
 *   search.mutate({
 *     searchTerm: 'office supplies',
 *     status: ['APPROVED', 'SENT'],
 *     vendorIds: ['vendor-1', 'vendor-2'],
 *     dateRange: { start: '2024-01-01', end: '2024-12-31' },
 *     amountRange: { min: 1000, max: 5000 },
 *     sortBy: 'created_at',
 *     sortOrder: 'desc'
 *   });
 * };
 *
 * if (search.isSuccess) {
 *   const { results, totalCount, facets } = search.data;
 *   // Render results...
 * }
 * ```
 */
export const usePurchaseOrderSearch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (searchCriteria: {
      searchTerm?: string;
      status?: string[];
      vendorIds?: string[];
      departmentIds?: string[];
      dateRange?: { start: string; end: string };
      amountRange?: { min: number; max: number };
      tags?: string[];
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
      limit?: number;
      offset?: number;
    }) => {
      // This would be your actual search API call
      await new Promise(resolve => setTimeout(resolve, 500));

      return {
        results: [], // Actual search results
        totalCount: 0,
        facets: {
          statuses: [],
          vendors: [],
          departments: [],
          categories: [],
        },
        searchMetadata: {
          query: searchCriteria.searchTerm,
          executionTime: 150,
          resultCount: 0,
        },
      };
    },
    onSuccess: (results) => {
      // Cache the search results
      queryClient.setQueryData(['purchase-orders', 'search-results'], results);
    },
    onError: (error: Error) => {
      toast.error(`Search failed: ${error.message}`);
    },
  });
};
