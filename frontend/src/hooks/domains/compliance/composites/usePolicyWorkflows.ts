import { useMemo } from 'react';
import {
  usePolicyDetails,
} from '../queries/useComplianceQueries';
import {
  useUpdatePolicy,
  useApprovePolicy,
} from '../mutations/useComplianceMutations';
import { CompliancePolicy } from '../config';

// Composite hook for policy management workflow
export const usePolicyWorkflow = (policyId?: string) => {
  const policyQuery = usePolicyDetails(policyId!, { enabled: !!policyId });
  const updatePolicyMutation = useUpdatePolicy();
  const approvePolicyMutation = useApprovePolicy();

  const policy = policyQuery.data;

  const actions = useMemo(() => ({
    updatePolicy: (data: Partial<CompliancePolicy>) =>
      updatePolicyMutation.mutate({ id: policyId!, data }),
    approvePolicy: () => approvePolicyMutation.mutate(policyId!),
    canEdit: policy?.status === 'DRAFT' || policy?.status === 'UNDER_REVIEW',
    canApprove: policy?.status === 'UNDER_REVIEW',
    isActive: policy?.status === 'ACTIVE',
    needsReview: policy && new Date(policy.reviewDate) < new Date(),
  }), [policy, policyId, updatePolicyMutation, approvePolicyMutation]);

  return {
    policy,
    isLoading: policyQuery.isLoading,
    error: policyQuery.error,
    actions,
    mutations: {
      update: updatePolicyMutation,
      approve: approvePolicyMutation,
    },
  };
};
