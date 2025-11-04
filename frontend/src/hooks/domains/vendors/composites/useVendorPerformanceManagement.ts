import { useQuery, useMutation } from '@tanstack/react-query';
import { vendorKeys } from '../config';
import { useVendors, useVendorCompliance } from '../queries/useVendorQueries';
import type { Vendor } from '../config';

// Vendor Performance Management
export const useVendorPerformanceManagement = (filters?: {
  category?: string;
  riskLevel?: 'LOW' | 'MEDIUM' | 'HIGH';
  performanceThreshold?: number;
}) => {
  const vendors = useVendors(filters);
  const compliance = useVendorCompliance();

  const performanceReport = useQuery({
    queryKey: [...vendorKeys.all, 'performance-report', filters],
    queryFn: async (): Promise<{
      summary: {
        totalVendors: number;
        highPerformers: number;
        underPerformers: number;
        atRiskVendors: number;
      };

      performanceMetrics: {
        averageRating: number;
        averageDeliveryRate: number;
        averageQualityScore: number;
        costSavingsTotal: number;
      };

      topPerformers: Array<{
        vendor: Vendor;
        score: number;
        strengths: string[];
      }>;

      underPerformers: Array<{
        vendor: Vendor;
        score: number;
        issues: string[];
        recommendations: string[];
      }>;

      trends: Array<{
        period: string;
        averageRating: number;
        issueCount: number;
        improvementCount: number;
      }>;
    }> => {
      const params = new URLSearchParams();
      if (filters?.category) params.append('category', filters.category);
      if (filters?.riskLevel) params.append('riskLevel', filters.riskLevel);
      if (filters?.performanceThreshold) params.append('threshold', filters.performanceThreshold.toString());

      const response = await fetch(`/api/vendors/performance-report?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch performance report');
      return response.json();
    },
    enabled: !!vendors.data,
  });

  const generatePerformanceReview = useMutation({
    mutationFn: async ({ vendorIds, period, includeRecommendations }: {
      vendorIds: string[];
      period: 'quarterly' | 'annual';
      includeRecommendations: boolean;
    }) => {
      const response = await fetch('/api/vendors/generate-performance-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vendorIds, period, includeRecommendations }),
      });
      if (!response.ok) throw new Error('Failed to generate performance review');
      return response.blob();
    },
  });

  return {
    // Data
    vendors: vendors.data,
    compliance: compliance.data,
    performanceReport: performanceReport.data,

    // Loading states
    isLoading: vendors.isLoading || compliance.isLoading || performanceReport.isLoading,

    // Actions
    generatePerformanceReview: generatePerformanceReview.mutate,

    // Action states
    isGeneratingReview: generatePerformanceReview.isPending,

    // Refetch
    refetch: () => {
      vendors.refetch();
      compliance.refetch();
      performanceReport.refetch();
    },
  };
};
