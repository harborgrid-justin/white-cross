import { UseQueryOptions } from '@tanstack/react-query';
import {
  useRecentDocuments,
  useFavoriteDocuments,
  useSharedWithMe,
  useDocumentAnalytics,
  useCategories,
} from '../queries/useDocumentQueries';

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
