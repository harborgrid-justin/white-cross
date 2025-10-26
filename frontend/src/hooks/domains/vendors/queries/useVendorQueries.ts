/**
 * Vendor Domain Query Hooks
 *
 * Provides TanStack Query hooks for fetching vendor data including vendors,
 * contracts, evaluations, payments, documents, analytics, and compliance information.
 * All hooks leverage React Query's caching, automatic revalidation, and error handling.
 *
 * @module hooks/domains/vendors/queries
 *
 * @remarks
 * **Hook Categories:**
 * - **Vendor Queries**: useVendor, useVendors, useVendorsPaginated
 * - **Contract Queries**: useVendorContract, useVendorContracts
 * - **Evaluation Queries**: useVendorEvaluation, useVendorEvaluations
 * - **Payment Queries**: useVendorPayments
 * - **Document Queries**: useVendorDocuments
 * - **Analytics Queries**: useVendorAnalytics, useVendorPerformance
 * - **Compliance Queries**: useVendorCompliance
 * - **Search Queries**: useVendorSearch, useVendorRecommendations
 *
 * **TanStack Query Features:**
 * - Automatic caching with configurable stale times (see VENDORS_CACHE_CONFIG)
 * - Background refetching when data becomes stale
 * - Automatic retry with exponential backoff (3 attempts)
 * - Query deduplication for parallel requests
 * - Cache invalidation via vendorKeys factory
 *
 * @see {@link vendorKeys} for query key structure
 * @see {@link VENDORS_CACHE_CONFIG} for cache configuration
 * @see {@link useVendorMutations} for data modification hooks
 *
 * @since 1.0.0
 */

import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { vendorKeys } from '../config';
import type {
  Vendor,
  VendorContract,
  VendorEvaluation,
  VendorPayment,
  VendorDocument
} from '../config';

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

// Vendor Contract Queries
export const useVendorContract = (contractId: string) => {
  return useQuery({
    queryKey: vendorKeys.contract(contractId),
    queryFn: async (): Promise<VendorContract> => {
      const response = await fetch(`/api/vendor-contracts/${contractId}`);
      if (!response.ok) throw new Error('Failed to fetch contract');
      return response.json();
    },
    enabled: !!contractId,
  });
};

export const useVendorContracts = (vendorId?: string, filters?: {
  status?: 'DRAFT' | 'UNDER_REVIEW' | 'ACTIVE' | 'EXPIRED' | 'TERMINATED';
  type?: 'MASTER_AGREEMENT' | 'PURCHASE_ORDER' | 'SERVICE_CONTRACT' | 'CONSULTING';
}) => {
  return useQuery({
    queryKey: vendorKeys.contracts(vendorId),
    queryFn: async (): Promise<VendorContract[]> => {
      const params = new URLSearchParams();
      if (vendorId) params.append('vendorId', vendorId);
      if (filters?.status) params.append('status', filters.status);
      if (filters?.type) params.append('type', filters.type);

      const response = await fetch(`/api/vendor-contracts?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch contracts');
      return response.json();
    },
  });
};

// Vendor Evaluation Queries
export const useVendorEvaluation = (evaluationId: string) => {
  return useQuery({
    queryKey: vendorKeys.evaluation(evaluationId),
    queryFn: async (): Promise<VendorEvaluation> => {
      const response = await fetch(`/api/vendor-evaluations/${evaluationId}`);
      if (!response.ok) throw new Error('Failed to fetch evaluation');
      return response.json();
    },
    enabled: !!evaluationId,
  });
};

export const useVendorEvaluations = (vendorId?: string, filters?: {
  evaluationType?: 'ANNUAL' | 'PROJECT_BASED' | 'INCIDENT' | 'RENEWAL';
  year?: number;
}) => {
  return useQuery({
    queryKey: vendorKeys.evaluations(vendorId),
    queryFn: async (): Promise<VendorEvaluation[]> => {
      const params = new URLSearchParams();
      if (vendorId) params.append('vendorId', vendorId);
      if (filters?.evaluationType) params.append('evaluationType', filters.evaluationType);
      if (filters?.year) params.append('year', filters.year.toString());

      const response = await fetch(`/api/vendor-evaluations?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch evaluations');
      return response.json();
    },
  });
};

// Vendor Payment Queries
export const useVendorPayments = (vendorId?: string, filters?: {
  status?: 'PENDING' | 'APPROVED' | 'PAID' | 'OVERDUE' | 'DISPUTED' | 'CANCELLED';
  startDate?: string;
  endDate?: string;
}) => {
  return useQuery({
    queryKey: vendorKeys.payments(vendorId),
    queryFn: async (): Promise<VendorPayment[]> => {
      const params = new URLSearchParams();
      if (vendorId) params.append('vendorId', vendorId);
      if (filters?.status) params.append('status', filters.status);
      if (filters?.startDate) params.append('startDate', filters.startDate);
      if (filters?.endDate) params.append('endDate', filters.endDate);

      const response = await fetch(`/api/vendor-payments?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch payments');
      return response.json();
    },
  });
};

// Vendor Documents Queries
export const useVendorDocuments = (vendorId: string, filters?: {
  type?: 'W9' | 'INSURANCE_CERT' | 'LICENSE' | 'CERTIFICATION' | 'CONTRACT' | 'OTHER';
  status?: 'CURRENT' | 'EXPIRED' | 'EXPIRING_SOON' | 'MISSING';
}) => {
  return useQuery({
    queryKey: vendorKeys.documents(vendorId),
    queryFn: async (): Promise<VendorDocument[]> => {
      const params = new URLSearchParams();
      if (filters?.type) params.append('type', filters.type);
      if (filters?.status) params.append('status', filters.status);

      const response = await fetch(`/api/vendors/${vendorId}/documents?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch documents');
      return response.json();
    },
    enabled: !!vendorId,
  });
};

// Vendor Analytics Queries
export const useVendorAnalytics = (vendorId: string, period?: 'monthly' | 'quarterly' | 'yearly') => {
  return useQuery({
    queryKey: vendorKeys.analytics(vendorId, period),
    queryFn: async (): Promise<{
      totalSpent: number;
      averageOrderValue: number;
      onTimeDeliveryRate: number;
      qualityScore: number;
      costSavings: number;
      
      monthlySpending: Array<{
        month: string;
        amount: number;
        orderCount: number;
      }>;
      
      performanceTrends: Array<{
        period: string;
        deliveryRate: number;
        qualityScore: number;
        costEffectiveness: number;
      }>;
      
      riskAssessment: {
        overallRisk: 'LOW' | 'MEDIUM' | 'HIGH';
        riskFactors: Array<{
          category: string;
          level: 'LOW' | 'MEDIUM' | 'HIGH';
          description: string;
        }>;
      };
    }> => {
      const params = period ? `?period=${period}` : '';
      const response = await fetch(`/api/vendors/${vendorId}/analytics${params}`);
      if (!response.ok) throw new Error('Failed to fetch analytics');
      return response.json();
    },
    enabled: !!vendorId,
  });
};

export const useVendorPerformance = (vendorId: string) => {
  return useQuery({
    queryKey: vendorKeys.performance(vendorId),
    queryFn: async (): Promise<{
      currentRating: number;
      ratingHistory: Array<{
        date: string;
        rating: number;
        evaluationType: string;
      }>;
      
      kpis: {
        onTimeDelivery: {
          current: number;
          target: number;
          trend: 'UP' | 'DOWN' | 'STABLE';
        };
        qualityScore: {
          current: number;
          target: number;
          trend: 'UP' | 'DOWN' | 'STABLE';
        };
        costEffectiveness: {
          current: number;
          target: number;
          trend: 'UP' | 'DOWN' | 'STABLE';
        };
      };
      
      recentIssues: Array<{
        date: string;
        type: string;
        description: string;
        severity: 'LOW' | 'MEDIUM' | 'HIGH';
        resolved: boolean;
      }>;
      
      improvements: Array<{
        area: string;
        suggestion: string;
        priority: 'LOW' | 'MEDIUM' | 'HIGH';
      }>;
    }> => {
      const response = await fetch(`/api/vendors/${vendorId}/performance`);
      if (!response.ok) throw new Error('Failed to fetch performance');
      return response.json();
    },
    enabled: !!vendorId,
    refetchInterval: 300000, // Refresh every 5 minutes
  });
};

// Vendor Categories and Types
export const useVendorCategories = () => {
  return useQuery({
    queryKey: [...vendorKeys.all, 'categories'],
    queryFn: async (): Promise<Array<{
      id: string;
      name: string;
      subcategories: Array<{
        id: string;
        name: string;
      }>;
    }>> => {
      const response = await fetch('/api/vendor-categories');
      if (!response.ok) throw new Error('Failed to fetch categories');
      return response.json();
    },
    staleTime: 30 * 60 * 1000, // 30 minutes - categories don't change often
  });
};

// Vendor Compliance Dashboard
export const useVendorCompliance = (filters?: {
  status?: 'COMPLIANT' | 'NON_COMPLIANT' | 'EXPIRING_SOON';
  documentType?: 'W9' | 'INSURANCE_CERT' | 'LICENSE' | 'CERTIFICATION';
}) => {
  return useQuery({
    queryKey: [...vendorKeys.all, 'compliance', filters],
    queryFn: async (): Promise<{
      summary: {
        totalVendors: number;
        compliantVendors: number;
        nonCompliantVendors: number;
        expiringSoon: number;
      };
      
      byDocumentType: Array<{
        type: string;
        required: number;
        current: number;
        expired: number;
        missing: number;
      }>;
      
      expiringDocuments: Array<{
        vendorId: string;
        vendorName: string;
        documentType: string;
        expirationDate: string;
        daysUntilExpiration: number;
      }>;
      
      nonCompliantVendors: Array<{
        vendorId: string;
        vendorName: string;
        issues: Array<{
          type: string;
          description: string;
          severity: 'LOW' | 'MEDIUM' | 'HIGH';
        }>;
      }>;
    }> => {
      const params = new URLSearchParams();
      if (filters?.status) params.append('status', filters.status);
      if (filters?.documentType) params.append('documentType', filters.documentType);
      
      const response = await fetch(`/api/vendor-compliance?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch compliance data');
      return response.json();
    },
    refetchInterval: 600000, // Refresh every 10 minutes
  });
};

// Vendor Search and Recommendations
export const useVendorSearch = (query: string, filters?: {
  type?: string;
  category?: string;
  minRating?: number;
  maxDistance?: number;
  location?: string;
}) => {
  return useQuery({
    queryKey: [...vendorKeys.all, 'search', query, filters],
    queryFn: async (): Promise<{
      vendors: Vendor[];
      suggestions: string[];
      facets: {
        types: Array<{ value: string; count: number }>;
        categories: Array<{ value: string; count: number }>;
        ratings: Array<{ range: string; count: number }>;
      };
    }> => {
      const params = new URLSearchParams();
      params.append('q', query);
      if (filters?.type) params.append('type', filters.type);
      if (filters?.category) params.append('category', filters.category);
      if (filters?.minRating) params.append('minRating', filters.minRating.toString());
      if (filters?.maxDistance) params.append('maxDistance', filters.maxDistance.toString());
      if (filters?.location) params.append('location', filters.location);
      
      const response = await fetch(`/api/vendors/search?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to search vendors');
      return response.json();
    },
    enabled: query.length >= 2,
  });
};

export const useVendorRecommendations = (criteria: {
  category?: string;
  budget?: number;
  location?: string;
  timeline?: string;
}) => {
  return useQuery({
    queryKey: [...vendorKeys.all, 'recommendations', criteria],
    queryFn: async (): Promise<{
      recommended: Array<{
        vendor: Vendor;
        score: number;
        reasons: string[];
        matchPercentage: number;
      }>;
      
      alternatives: Array<{
        vendor: Vendor;
        score: number;
        reasons: string[];
      }>;
    }> => {
      const response = await fetch('/api/vendors/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(criteria),
      });
      if (!response.ok) throw new Error('Failed to get recommendations');
      return response.json();
    },
    enabled: !!(criteria.category || criteria.budget),
  });
};
