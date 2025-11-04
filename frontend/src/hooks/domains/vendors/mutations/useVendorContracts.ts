import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { vendorKeys } from '../config';
import type { VendorContract } from '../config';

export const useCreateVendorContract = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (contractData: Omit<VendorContract, 'id' | 'createdAt' | 'updatedAt' | 'amendments'>): Promise<VendorContract> => {
      const response = await fetch('/api/vendor-contracts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contractData),
      });
      if (!response.ok) throw new Error('Failed to create contract');
      return response.json();
    },
    onSuccess: (newContract) => {
      queryClient.invalidateQueries({ queryKey: vendorKeys.contracts(newContract.vendorId) });
      queryClient.invalidateQueries({ queryKey: vendorKeys.detail(newContract.vendorId) });
      toast.success(`Contract "${newContract.title}" created successfully`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to create contract: ${error.message}`);
    },
  });
};

export const useUpdateVendorContract = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ contractId, updates }: {
      contractId: string;
      updates: Partial<VendorContract>;
    }): Promise<VendorContract> => {
      const response = await fetch(`/api/vendor-contracts/${contractId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error('Failed to update contract');
      return response.json();
    },
    onSuccess: (updatedContract, { contractId }) => {
      queryClient.invalidateQueries({ queryKey: vendorKeys.contract(contractId) });
      queryClient.invalidateQueries({ queryKey: vendorKeys.contracts(updatedContract.vendorId) });
      toast.success(`Contract "${updatedContract.title}" updated successfully`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to update contract: ${error.message}`);
    },
  });
};

export const useApproveContract = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ contractId, approvalNote }: {
      contractId: string;
      approvalNote?: string;
    }): Promise<VendorContract> => {
      const response = await fetch(`/api/vendor-contracts/${contractId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approvalNote }),
      });
      if (!response.ok) throw new Error('Failed to approve contract');
      return response.json();
    },
    onSuccess: (approvedContract, { contractId }) => {
      queryClient.invalidateQueries({ queryKey: vendorKeys.contract(contractId) });
      queryClient.invalidateQueries({ queryKey: vendorKeys.contracts(approvedContract.vendorId) });
      toast.success(`Contract "${approvedContract.title}" approved successfully`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to approve contract: ${error.message}`);
    },
  });
};

export const useTerminateContract = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ contractId, reason }: {
      contractId: string;
      reason: string;
    }): Promise<VendorContract> => {
      const response = await fetch(`/api/vendor-contracts/${contractId}/terminate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      });
      if (!response.ok) throw new Error('Failed to terminate contract');
      return response.json();
    },
    onSuccess: (terminatedContract, { contractId }) => {
      queryClient.invalidateQueries({ queryKey: vendorKeys.contract(contractId) });
      queryClient.invalidateQueries({ queryKey: vendorKeys.contracts(terminatedContract.vendorId) });
      toast.success(`Contract "${terminatedContract.title}" terminated`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to terminate contract: ${error.message}`);
    },
  });
};
