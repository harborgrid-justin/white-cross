import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { vendorKeys } from '../config';
import type { 
  Vendor, 
  VendorContract, 
  VendorEvaluation, 
  VendorPayment, 
  VendorDocument 
} from '../config';

// Vendor Mutations
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

// Vendor Contract Mutations
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

// Vendor Evaluation Mutations
export const useCreateVendorEvaluation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (evaluationData: Omit<VendorEvaluation, 'id' | 'createdAt' | 'updatedAt' | 'evaluatedBy' | 'evaluationDate'>): Promise<VendorEvaluation> => {
      const response = await fetch('/api/vendor-evaluations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(evaluationData),
      });
      if (!response.ok) throw new Error('Failed to create evaluation');
      return response.json();
    },
    onSuccess: (newEvaluation) => {
      queryClient.invalidateQueries({ queryKey: vendorKeys.evaluations(newEvaluation.vendorId) });
      queryClient.invalidateQueries({ queryKey: vendorKeys.detail(newEvaluation.vendorId) });
      queryClient.invalidateQueries({ queryKey: vendorKeys.performance(newEvaluation.vendorId) });
      toast.success('Vendor evaluation created successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create evaluation: ${error.message}`);
    },
  });
};

export const useUpdateVendorEvaluation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ evaluationId, updates }: {
      evaluationId: string;
      updates: Partial<VendorEvaluation>;
    }): Promise<VendorEvaluation> => {
      const response = await fetch(`/api/vendor-evaluations/${evaluationId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error('Failed to update evaluation');
      return response.json();
    },
    onSuccess: (updatedEvaluation, { evaluationId }) => {
      queryClient.invalidateQueries({ queryKey: vendorKeys.evaluation(evaluationId) });
      queryClient.invalidateQueries({ queryKey: vendorKeys.evaluations(updatedEvaluation.vendorId) });
      queryClient.invalidateQueries({ queryKey: vendorKeys.performance(updatedEvaluation.vendorId) });
      toast.success('Evaluation updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update evaluation: ${error.message}`);
    },
  });
};

export const useSubmitEvaluationForReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (evaluationId: string): Promise<VendorEvaluation> => {
      const response = await fetch(`/api/vendor-evaluations/${evaluationId}/submit`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to submit evaluation');
      return response.json();
    },
    onSuccess: (submittedEvaluation, evaluationId) => {
      queryClient.invalidateQueries({ queryKey: vendorKeys.evaluation(evaluationId) });
      queryClient.invalidateQueries({ queryKey: vendorKeys.evaluations(submittedEvaluation.vendorId) });
      toast.success('Evaluation submitted for review');
    },
    onError: (error: Error) => {
      toast.error(`Failed to submit evaluation: ${error.message}`);
    },
  });
};

// Vendor Payment Mutations
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

// Vendor Document Mutations
export const useUploadVendorDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ vendorId, documentData, file }: {
      vendorId: string;
      documentData: {
        type: 'W9' | 'INSURANCE_CERT' | 'LICENSE' | 'CERTIFICATION' | 'CONTRACT' | 'OTHER';
        title: string;
        expirationDate?: string;
        isRequired: boolean;
      };
      file: File;
    }): Promise<VendorDocument> => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('documentData', JSON.stringify(documentData));

      const response = await fetch(`/api/vendors/${vendorId}/documents`, {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error('Failed to upload document');
      return response.json();
    },
    onSuccess: (uploadedDocument, { vendorId }) => {
      queryClient.invalidateQueries({ queryKey: vendorKeys.documents(vendorId) });
      queryClient.invalidateQueries({ queryKey: vendorKeys.detail(vendorId) });
      toast.success(`Document "${uploadedDocument.title}" uploaded successfully`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to upload document: ${error.message}`);
    },
  });
};

export const useDeleteVendorDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ vendorId, documentId }: {
      vendorId: string;
      documentId: string;
    }): Promise<void> => {
      const response = await fetch(`/api/vendors/${vendorId}/documents/${documentId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete document');
    },
    onSuccess: (_, { vendorId }) => {
      queryClient.invalidateQueries({ queryKey: vendorKeys.documents(vendorId) });
      queryClient.invalidateQueries({ queryKey: vendorKeys.detail(vendorId) });
      toast.success('Document deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete document: ${error.message}`);
    },
  });
};

export const useReviewVendorDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ vendorId, documentId, reviewData }: {
      vendorId: string;
      documentId: string;
      reviewData: {
        status: 'CURRENT' | 'EXPIRED' | 'EXPIRING_SOON';
        notes?: string;
      };
    }): Promise<VendorDocument> => {
      const response = await fetch(`/api/vendors/${vendorId}/documents/${documentId}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData),
      });
      if (!response.ok) throw new Error('Failed to review document');
      return response.json();
    },
    onSuccess: (reviewedDocument, { vendorId }) => {
      queryClient.invalidateQueries({ queryKey: vendorKeys.documents(vendorId) });
      toast.success('Document reviewed successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to review document: ${error.message}`);
    },
  });
};

// Bulk Operations
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

// Vendor Onboarding
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
