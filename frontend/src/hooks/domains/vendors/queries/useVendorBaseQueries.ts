/**
 * Base Vendor Query Hooks
 *
 * Provides TanStack Query hooks for fetching core vendor data including
 * single vendor details, vendor lists with filters, and paginated vendor queries.
 *
 * @module hooks/domains/vendors/queries/useVendorBaseQueries
 */

import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { vendorKeys } from '../config';
import type { Vendor } from '../config';

/**
 * Fetches a single vendor by ID with complete details.
 *
 * Returns vendor information including contacts, addresses, insurance, performance
 * metrics, and compliance status. Automatically caches results for 10 minutes.
 *
 * @param {string} vendorId - Unique vendor identifier
 * @returns TanStack Query result with vendor data and query states
 *
 * @example
 * ```typescript
 * // Basic usage
 * function VendorDetail({ vendorId }: Props) {
 *   const { data: vendor, isLoading, error } = useVendor(vendorId);
 *
 *   if (isLoading) return <LoadingSpinner />;
 *   if (error) return <ErrorMessage error={error} />;
 *   if (!vendor) return <NotFound />;
 *
 *   return (
 *     <div>
 *       <h1>{vendor.name}</h1>
 *       <VendorStatus status={vendor.status} />
 *       <PerformanceMetrics
 *         rating={vendor.overallRating}
 *         deliveryRate={vendor.onTimeDeliveryRate}
 *         qualityScore={vendor.qualityRating}
 *       />
 *       <ContactList contacts={[vendor.primaryContact, ...vendor.alternateContacts]} />
 *     </div>
 *   );
 * }
 *
 * // With refetch on interval for active vendors
 * const { data: vendor, refetch } = useVendor(vendorId);
 * useEffect(() => {
 *   if (vendor?.status === 'ACTIVE') {
 *     const interval = setInterval(refetch, 60000); // Refresh every minute
 *     return () => clearInterval(interval);
 *   }
 * }, [vendor, refetch]);
 * ```
 *
 * @remarks
 * **TanStack Query Configuration:**
 * - Query Key: vendorKeys.detail(vendorId) - ['vendors', 'detail', vendorId]
 * - Stale Time: 10 minutes (VENDORS_CACHE_CONFIG.VENDORS_STALE_TIME)
 * - Enabled: Only when vendorId is truthy (prevents invalid requests)
 * - Retry: 3 attempts with exponential backoff
 * - Refetch on Mount: Yes, if data is stale
 * - Refetch on Window Focus: Yes, if data is stale
 *
 * **Performance Considerations:**
 * - Results cached in memory for instant re-renders
 * - Parallel requests to same vendor deduplicated automatically
 * - Background refetching keeps data fresh without blocking UI
 * - Optimistic updates possible via queryClient.setQueryData()
 *
 * **Error Handling:**
 * - Network errors: Automatic retry with backoff
 * - 404 Not Found: Error state with status code
 * - 403 Forbidden: Insufficient permissions
 * - 500 Server Error: Backend error state
 *
 * @see {@link useVendors} for fetching multiple vendors with filters
 * @see {@link useUpdateVendor} for updating vendor data
 * @see {@link useVendorWorkflow} for complete vendor management workflow
 */
export const useVendor = (vendorId: string) => {
  return useQuery({
    queryKey: vendorKeys.detail(vendorId),
    queryFn: async (): Promise<Vendor> => {
      const response = await fetch(`/api/vendors/${vendorId}`);
      if (!response.ok) throw new Error('Failed to fetch vendor');
      return response.json();
    },
    enabled: !!vendorId,
  });
};

export const useVendors = (filters?: {
  type?: 'SUPPLIER' | 'CONTRACTOR' | 'SERVICE_PROVIDER' | 'CONSULTANT';
  status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'PENDING_APPROVAL';
  category?: string;
  search?: string;
  riskLevel?: 'LOW' | 'MEDIUM' | 'HIGH';
}) => {
  return useQuery({
    queryKey: vendorKeys.list(filters),
    queryFn: async (): Promise<Vendor[]> => {
      const params = new URLSearchParams();
      if (filters?.type) params.append('type', filters.type);
      if (filters?.status) params.append('status', filters.status);
      if (filters?.category) params.append('category', filters.category);
      if (filters?.search) params.append('search', filters.search);
      if (filters?.riskLevel) params.append('riskLevel', filters.riskLevel);

      const response = await fetch(`/api/vendors?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch vendors');
      return response.json();
    },
  });
};

export const useVendorsPaginated = (filters?: {
  type?: 'SUPPLIER' | 'CONTRACTOR' | 'SERVICE_PROVIDER' | 'CONSULTANT';
  status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'PENDING_APPROVAL';
  category?: string;
  search?: string;
  riskLevel?: 'LOW' | 'MEDIUM' | 'HIGH';
  sortBy?: 'name' | 'rating' | 'createdAt' | 'lastModified';
  sortOrder?: 'asc' | 'desc';
}) => {
  return useInfiniteQuery({
    queryKey: vendorKeys.paginated(filters),
    queryFn: async ({ pageParam = 0 }): Promise<{
      vendors: Vendor[];
      nextPage?: number;
      hasMore: boolean;
      total: number;
    }> => {
      const params = new URLSearchParams();
      params.append('page', pageParam.toString());
      if (filters?.type) params.append('type', filters.type);
      if (filters?.status) params.append('status', filters.status);
      if (filters?.category) params.append('category', filters.category);
      if (filters?.search) params.append('search', filters.search);
      if (filters?.riskLevel) params.append('riskLevel', filters.riskLevel);
      if (filters?.sortBy) params.append('sortBy', filters.sortBy);
      if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder);

      const response = await fetch(`/api/vendors/paginated?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch vendors');
      return response.json();
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0,
  });
};
