import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { vendorKeys } from '../config';
import type { VendorEvaluation } from '../config';

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
