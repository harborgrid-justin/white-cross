/**
 * Vendor Compliance and Categories Query Hooks
 *
 * Provides TanStack Query hooks for fetching vendor compliance data and category information.
 *
 * @module hooks/domains/vendors/queries/useVendorComplianceQueries
 */

import { useQuery } from '@tanstack/react-query';
import { vendorKeys } from '../config';

/**
 * Fetches vendor categories and subcategories.
 *
 * @returns TanStack Query result with category data and query states
 */
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

/**
 * Fetches vendor compliance dashboard data including summary, document compliance, and non-compliant vendors.
 *
 * @param {object} filters - Optional filters for compliance status and document type
 * @returns TanStack Query result with compliance data and query states
 */
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
