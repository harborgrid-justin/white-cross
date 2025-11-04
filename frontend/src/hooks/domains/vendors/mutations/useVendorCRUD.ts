import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { vendorKeys } from '../config';
import type { Vendor } from '../config';

export const useCreateVendor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (vendorData: Omit<Vendor, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'lastModifiedBy'>): Promise<Vendor> => {
      const response = await fetch('/api/vendors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vendorData),
      });
      if (!response.ok) throw new Error('Failed to create vendor');
      return response.json();
    },
    onSuccess: (newVendor) => {
      queryClient.invalidateQueries({ queryKey: vendorKeys.all });
      toast.success(`Vendor "${newVendor.name}" created successfully`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to create vendor: ${error.message}`);
    },
  });
};

export const useUpdateVendor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ vendorId, updates }: {
      vendorId: string;
      updates: Partial<Vendor>;
    }): Promise<Vendor> => {
      const response = await fetch(`/api/vendors/${vendorId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error('Failed to update vendor');
      return response.json();
    },
    onSuccess: (updatedVendor, { vendorId }) => {
      queryClient.invalidateQueries({ queryKey: vendorKeys.detail(vendorId) });
      queryClient.invalidateQueries({ queryKey: vendorKeys.all });
      toast.success(`Vendor "${updatedVendor.name}" updated successfully`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to update vendor: ${error.message}`);
    },
  });
};

export const useDeleteVendor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (vendorId: string): Promise<void> => {
      const response = await fetch(`/api/vendors/${vendorId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete vendor');
    },
    onSuccess: (_, vendorId) => {
      queryClient.removeQueries({ queryKey: vendorKeys.detail(vendorId) });
      queryClient.invalidateQueries({ queryKey: vendorKeys.all });
      toast.success('Vendor deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete vendor: ${error.message}`);
    },
  });
};

export const useActivateVendor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (vendorId: string): Promise<Vendor> => {
      const response = await fetch(`/api/vendors/${vendorId}/activate`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to activate vendor');
      return response.json();
    },
    onSuccess: (activatedVendor, vendorId) => {
      queryClient.invalidateQueries({ queryKey: vendorKeys.detail(vendorId) });
      queryClient.invalidateQueries({ queryKey: vendorKeys.all });
      toast.success(`Vendor "${activatedVendor.name}" activated successfully`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to activate vendor: ${error.message}`);
    },
  });
};

export const useSuspendVendor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ vendorId, reason }: {
      vendorId: string;
      reason: string;
    }): Promise<Vendor> => {
      const response = await fetch(`/api/vendors/${vendorId}/suspend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      });
      if (!response.ok) throw new Error('Failed to suspend vendor');
      return response.json();
    },
    onSuccess: (suspendedVendor, { vendorId }) => {
      queryClient.invalidateQueries({ queryKey: vendorKeys.detail(vendorId) });
      queryClient.invalidateQueries({ queryKey: vendorKeys.all });
      toast.success(`Vendor "${suspendedVendor.name}" suspended`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to suspend vendor: ${error.message}`);
    },
  });
};
