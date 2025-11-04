import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { vendorKeys } from '../config';
import { useVendorContracts } from '../queries/useVendorQueries';
import { useCreateVendorContract } from '../mutations/useVendorMutations';
import type { VendorContract } from '../config';

// Vendor Contract Management
export const useVendorContractManagement = (vendorId?: string) => {
  const queryClient = useQueryClient();

  const contracts = useVendorContracts(vendorId);
  const createContract = useCreateVendorContract();

  const contractLifecycle = useMutation({
    mutationFn: async ({ contractId, action, data }: {
      contractId: string;
      action: 'RENEW' | 'AMEND' | 'TERMINATE' | 'EXTEND';
      data?: any;
    }): Promise<VendorContract> => {
      const response = await fetch(`/api/vendor-contracts/${contractId}/lifecycle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, data }),
      });
      if (!response.ok) throw new Error('Failed to process contract lifecycle');
      return response.json();
    },
    onSuccess: (updatedContract) => {
      queryClient.invalidateQueries({ queryKey: vendorKeys.contracts(updatedContract.vendorId) });
    },
  });

  const generateContractReport = useMutation({
    mutationFn: async ({ vendorId, includeAmendments }: {
      vendorId?: string;
      includeAmendments: boolean;
    }) => {
      const response = await fetch('/api/vendor-contracts/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vendorId, includeAmendments }),
      });
      if (!response.ok) throw new Error('Failed to generate contract report');
      return response.blob();
    },
  });

  const expiringContracts = useQuery({
    queryKey: [...vendorKeys.all, 'contracts-expiring', vendorId],
    queryFn: async (): Promise<Array<{
      contract: VendorContract;
      daysUntilExpiry: number;
      renewalRecommendation: 'RENEW' | 'RENEW_WITH_CHANGES' | 'DO_NOT_RENEW';
      reason: string;
    }>> => {
      const params = vendorId ? `?vendorId=${vendorId}` : '';
      const response = await fetch(`/api/vendor-contracts/expiring${params}`);
      if (!response.ok) throw new Error('Failed to fetch expiring contracts');
      return response.json();
    },
    refetchInterval: 24 * 60 * 60 * 1000, // Daily refresh
  });

  return {
    // Data
    contracts: contracts.data,
    expiringContracts: expiringContracts.data,

    // Loading states
    isLoading: contracts.isLoading,
    isLoadingExpiring: expiringContracts.isLoading,

    // Actions
    createContract: createContract.mutate,
    contractLifecycle: contractLifecycle.mutate,
    generateContractReport: generateContractReport.mutate,

    // Action states
    isCreating: createContract.isPending,
    isProcessingLifecycle: contractLifecycle.isPending,
    isGeneratingReport: generateContractReport.isPending,

    // Refetch
    refetchContracts: contracts.refetch,
    refetchExpiring: expiringContracts.refetch,
  };
};
