import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  useVendor,
  useVendorContracts,
  useVendorEvaluations,
  useVendorPayments,
  useVendorDocuments,
  useVendorAnalytics,
  useVendorPerformance
} from '../queries/useVendorQueries';
import {
  useUpdateVendor,
  useCreateVendorContract,
  useCreateVendorEvaluation,
  useUploadVendorDocument
} from '../mutations/useVendorMutations';

// Vendor Management Workflow
export const useVendorWorkflow = (vendorId?: string) => {
  const queryClient = useQueryClient();

  const vendor = useVendor(vendorId!);
  const contracts = useVendorContracts(vendorId);
  const evaluations = useVendorEvaluations(vendorId);
  const payments = useVendorPayments(vendorId);
  const documents = useVendorDocuments(vendorId!);
  const analytics = useVendorAnalytics(vendorId!, 'monthly');
  const performance = useVendorPerformance(vendorId!);

  const updateVendor = useUpdateVendor();
  const createContract = useCreateVendorContract();
  const createEvaluation = useCreateVendorEvaluation();
  const uploadDocument = useUploadVendorDocument();

  const sendReminder = useMutation({
    mutationFn: async ({ vendorId, type, message }: {
      vendorId: string;
      type: 'DOCUMENT_EXPIRY' | 'EVALUATION_DUE' | 'CONTRACT_RENEWAL' | 'PAYMENT_OVERDUE';
      message?: string;
    }): Promise<void> => {
      const response = await fetch(`/api/vendors/${vendorId}/send-reminder`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, message }),
      });
      if (!response.ok) throw new Error('Failed to send reminder');
    },
  });

  return {
    // Data
    vendor: vendor.data,
    contracts: contracts.data,
    evaluations: evaluations.data,
    payments: payments.data,
    documents: documents.data,
    analytics: analytics.data,
    performance: performance.data,

    // Loading states
    isLoading: vendor.isLoading || contracts.isLoading || evaluations.isLoading,
    isLoadingPayments: payments.isLoading,
    isLoadingDocuments: documents.isLoading,
    isLoadingAnalytics: analytics.isLoading,

    // Error states
    error: vendor.error || contracts.error || evaluations.error,

    // Actions
    updateVendor: updateVendor.mutate,
    createContract: createContract.mutate,
    createEvaluation: createEvaluation.mutate,
    uploadDocument: uploadDocument.mutate,
    sendReminder: sendReminder.mutate,

    // Action states
    isUpdating: updateVendor.isPending,
    isCreatingContract: createContract.isPending,
    isCreatingEvaluation: createEvaluation.isPending,
    isUploadingDocument: uploadDocument.isPending,
    isSendingReminder: sendReminder.isPending,

    // Refetch functions
    refetchVendor: vendor.refetch,
    refetchContracts: contracts.refetch,
    refetchEvaluations: evaluations.refetch,
    refetchPayments: payments.refetch,
    refetchDocuments: documents.refetch,
  };
};
