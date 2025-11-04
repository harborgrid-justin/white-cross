import { useMutation, useQueryClient } from '@tanstack/react-query';
import { vendorKeys } from '../config';
import { useCreateVendor } from '../mutations/useVendorMutations';
import type { Vendor } from '../config';

// Vendor Onboarding Process
export const useVendorOnboarding = () => {
  const queryClient = useQueryClient();

  const createVendor = useCreateVendor();

  const processOnboarding = useMutation({
    mutationFn: async (onboardingData: {
      step: number;
      data: any;
      vendorId?: string;
    }): Promise<{
      currentStep: number;
      nextStep: number;
      isComplete: boolean;
      vendor: Vendor;
      requirements: Array<{
        type: string;
        status: 'PENDING' | 'COMPLETED' | 'FAILED';
        description: string;
      }>;
    }> => {
      const response = await fetch('/api/vendors/onboarding/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(onboardingData),
      });
      if (!response.ok) throw new Error('Failed to process onboarding step');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vendorKeys.all });
    },
  });

  const validateVendorData = useMutation({
    mutationFn: async (vendorData: any): Promise<{
      isValid: boolean;
      errors: Array<{
        field: string;
        message: string;
      }>;
      warnings: Array<{
        field: string;
        message: string;
      }>;
    }> => {
      const response = await fetch('/api/vendors/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vendorData),
      });
      if (!response.ok) throw new Error('Failed to validate vendor data');
      return response.json();
    },
  });

  return {
    // Actions
    createVendor: createVendor.mutate,
    processOnboarding: processOnboarding.mutate,
    validateVendorData: validateVendorData.mutate,

    // Action states
    isCreating: createVendor.isPending,
    isProcessing: processOnboarding.isPending,
    isValidating: validateVendorData.isPending,

    // Results
    onboardingResult: processOnboarding.data,
    validationResult: validateVendorData.data,
  };
};
