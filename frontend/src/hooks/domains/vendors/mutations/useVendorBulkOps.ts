import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { vendorKeys } from '../config';
import type { Vendor, VendorPayment } from '../config';

export const useBulkUpdateVendorStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ vendorIds, status, reason }: {
      vendorIds: string[];
      status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
      reason?: string;
    }): Promise<Vendor[]> => {
      const response = await fetch('/api/vendors/bulk-update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vendorIds, status, reason }),
      });
      if (!response.ok) throw new Error('Failed to update vendor status');
      return response.json();
    },
    onSuccess: (updatedVendors, { vendorIds }) => {
      vendorIds.forEach(id => {
        queryClient.invalidateQueries({ queryKey: vendorKeys.detail(id) });
      });
      queryClient.invalidateQueries({ queryKey: vendorKeys.all });
      toast.success(`${vendorIds.length} vendors updated successfully`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to update vendors: ${error.message}`);
    },
  });
};

export const useBulkApprovePayments = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (paymentIds: string[]): Promise<VendorPayment[]> => {
      const response = await fetch('/api/vendor-payments/bulk-approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentIds }),
      });
      if (!response.ok) throw new Error('Failed to approve payments');
      return response.json();
    },
    onSuccess: (approvedPayments, paymentIds) => {
      const vendorIds = [...new Set(approvedPayments.map(p => p.vendorId))];
      vendorIds.forEach(vendorId => {
        queryClient.invalidateQueries({ queryKey: vendorKeys.payments(vendorId) });
      });
      toast.success(`${paymentIds.length} payments approved successfully`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to approve payments: ${error.message}`);
    },
  });
};

export const useInitiateVendorOnboarding = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (onboardingData: {
      vendorName: string;
      contactEmail: string;
      type: 'SUPPLIER' | 'CONTRACTOR' | 'SERVICE_PROVIDER' | 'CONSULTANT';
      category: string;
      requestedBy: string;
    }): Promise<{
      onboardingId: string;
      invitationUrl: string;
      vendor: Vendor;
    }> => {
      const response = await fetch('/api/vendors/initiate-onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(onboardingData),
      });
      if (!response.ok) throw new Error('Failed to initiate onboarding');
      return response.json();
    },
    onSuccess: (onboardingResult) => {
      queryClient.invalidateQueries({ queryKey: vendorKeys.all });
      toast.success(`Onboarding initiated for "${onboardingResult.vendor.name}"`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to initiate onboarding: ${error.message}`);
    },
  });
};
