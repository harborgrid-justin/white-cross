import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { vendorKeys } from '../config';
import type { VendorPayment } from '../config';

export const useCreateVendorPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (paymentData: Omit<VendorPayment, 'id' | 'createdAt' | 'updatedAt' | 'attachments'>): Promise<VendorPayment> => {
      const response = await fetch('/api/vendor-payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentData),
      });
      if (!response.ok) throw new Error('Failed to create payment');
      return response.json();
    },
    onSuccess: (newPayment) => {
      queryClient.invalidateQueries({ queryKey: vendorKeys.payments(newPayment.vendorId) });
      toast.success('Payment created successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create payment: ${error.message}`);
    },
  });
};

export const useApprovePayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ paymentId, approvalNote }: {
      paymentId: string;
      approvalNote?: string;
    }): Promise<VendorPayment> => {
      const response = await fetch(`/api/vendor-payments/${paymentId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approvalNote }),
      });
      if (!response.ok) throw new Error('Failed to approve payment');
      return response.json();
    },
    onSuccess: (approvedPayment) => {
      queryClient.invalidateQueries({ queryKey: vendorKeys.payments(approvedPayment.vendorId) });
      toast.success('Payment approved successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to approve payment: ${error.message}`);
    },
  });
};

export const useProcessPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ paymentId, paymentDetails }: {
      paymentId: string;
      paymentDetails: {
        paymentMethod: 'CHECK' | 'ACH' | 'WIRE' | 'CREDIT_CARD';
        paymentReference?: string;
        paidDate: string;
      };
    }): Promise<VendorPayment> => {
      const response = await fetch(`/api/vendor-payments/${paymentId}/process`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentDetails),
      });
      if (!response.ok) throw new Error('Failed to process payment');
      return response.json();
    },
    onSuccess: (processedPayment) => {
      queryClient.invalidateQueries({ queryKey: vendorKeys.payments(processedPayment.vendorId) });
      toast.success('Payment processed successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to process payment: ${error.message}`);
    },
  });
};
