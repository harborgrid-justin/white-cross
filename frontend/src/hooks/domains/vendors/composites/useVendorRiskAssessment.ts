import { useQuery, useMutation } from '@tanstack/react-query';
import { vendorKeys } from '../config';

// Vendor Risk Assessment
export const useVendorRiskAssessment = (vendorIds?: string[]) => {
  const riskAssessment = useQuery({
    queryKey: [...vendorKeys.all, 'risk-assessment', vendorIds],
    queryFn: async (): Promise<{
      overallRisk: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

      riskFactors: Array<{
        category: 'FINANCIAL' | 'OPERATIONAL' | 'COMPLIANCE' | 'STRATEGIC';
        level: 'LOW' | 'MEDIUM' | 'HIGH';
        description: string;
        impact: number;
        probability: number;
      }>;

      vendorRisks: Array<{
        vendorId: string;
        vendorName: string;
        riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
        score: number;
        topRisks: string[];
        recommendations: string[];
      }>;

      mitigation: Array<{
        risk: string;
        strategy: string;
        owner: string;
        timeline: string;
        status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED';
      }>;
    }> => {
      const params = new URLSearchParams();
      vendorIds?.forEach(id => params.append('vendorIds', id));

      const response = await fetch(`/api/vendors/risk-assessment?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch risk assessment');
      return response.json();
    },
    enabled: !vendorIds || vendorIds.length > 0,
    refetchInterval: 60 * 60 * 1000, // Hourly refresh
  });

  const createRiskMitigation = useMutation({
    mutationFn: async (mitigationPlan: {
      vendorId: string;
      riskCategory: string;
      strategy: string;
      owner: string;
      timeline: string;
      budget?: number;
    }): Promise<void> => {
      const response = await fetch('/api/vendors/risk-mitigation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mitigationPlan),
      });
      if (!response.ok) throw new Error('Failed to create risk mitigation plan');
    },
    onSuccess: () => {
      riskAssessment.refetch();
    },
  });

  return {
    // Data
    riskAssessment: riskAssessment.data,

    // Loading states
    isLoading: riskAssessment.isLoading,

    // Actions
    createRiskMitigation: createRiskMitigation.mutate,

    // Action states
    isCreatingMitigation: createRiskMitigation.isPending,

    // Refetch
    refetch: riskAssessment.refetch,
  };
};
