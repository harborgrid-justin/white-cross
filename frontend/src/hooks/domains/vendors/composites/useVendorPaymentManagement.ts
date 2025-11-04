import { useMutation, useQueryClient } from '@tanstack/react-query';
import { vendorKeys } from '../config';
import { useVendorPayments } from '../queries/useVendorQueries';
import {
  useApprovePayment,
  useBulkApprovePayments
} from '../mutations/useVendorMutations';

// Vendor Payment Management
export const useVendorPaymentManagement = (vendorId?: string) => {
  const queryClient = useQueryClient();

  const payments = useVendorPayments(vendorId, { status: 'PENDING' });
  const approvePayment = useApprovePayment();
  const bulkApprove = useBulkApprovePayments();

  const paymentWorkflow = useMutation({
    mutationFn: async ({ action, paymentIds, data }: {
      action: 'APPROVE' | 'REJECT' | 'HOLD' | 'BATCH_PROCESS';
      paymentIds: string[];
      data?: any;
    }): Promise<{
      processed: number;
      failed: number;
      results: Array<{
        paymentId: string;
        status: 'SUCCESS' | 'FAILED';
        message: string;
      }>;
    }> => {
      const response = await fetch('/api/vendor-payments/workflow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, paymentIds, data }),
      });
      if (!response.ok) throw new Error('Failed to process payment workflow');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vendorKeys.payments(vendorId) });
    },
  });

  const reconcilePayments = useMutation({
    mutationFn: async ({ vendorId, period }: {
      vendorId: string;
      period: string;
    }): Promise<{
      totalInvoices: number;
      totalPaid: number;
      discrepancies: Array<{
        invoiceNumber: string;
        expectedAmount: number;
        paidAmount: number;
        difference: number;
        reason?: string;
      }>;
    }> => {
      const response = await fetch(`/api/vendors/${vendorId}/reconcile-payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ period }),
      });
      if (!response.ok) throw new Error('Failed to reconcile payments');
      return response.json();
    },
  });

  return {
    // Data
    pendingPayments: payments.data,

    // Loading states
    isLoading: payments.isLoading,

    // Actions
    approvePayment: approvePayment.mutate,
    bulkApprove: bulkApprove.mutate,
    paymentWorkflow: paymentWorkflow.mutate,
    reconcilePayments: reconcilePayments.mutate,

    // Action states
    isApproving: approvePayment.isPending,
    isBulkApproving: bulkApprove.isPending,
    isProcessingWorkflow: paymentWorkflow.isPending,
    isReconciling: reconcilePayments.isPending,

    // Results
    workflowResult: paymentWorkflow.data,
    reconciliationResult: reconcilePayments.data,

    // Refetch
    refetch: payments.refetch,
  };
};
