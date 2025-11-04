import { useMemo } from 'react';
import {
  useAuditDetails,
} from '../queries/useComplianceQueries';
import {
  useUpdateAudit,
  useDeleteAudit,
} from '../mutations/useComplianceMutations';
import { ComplianceAudit } from '../config';

// Composite hook for managing audit workflows
export const useAuditWorkflow = (auditId?: string) => {
  const auditQuery = useAuditDetails(auditId!, { enabled: !!auditId });
  const updateAuditMutation = useUpdateAudit();
  const deleteAuditMutation = useDeleteAudit();

  const audit = auditQuery.data;

  const actions = useMemo(() => ({
    updateAudit: (data: Partial<ComplianceAudit>) =>
      updateAuditMutation.mutate({ id: auditId!, data }),
    deleteAudit: () => deleteAuditMutation.mutate(auditId!),
    canEdit: audit?.status === 'SCHEDULED' || audit?.status === 'IN_PROGRESS',
    canDelete: audit?.status === 'SCHEDULED',
    isCompleted: audit?.status === 'COMPLETED',
  }), [audit, auditId, updateAuditMutation, deleteAuditMutation]);

  return {
    audit,
    isLoading: auditQuery.isLoading,
    error: auditQuery.error,
    actions,
    mutations: {
      update: updateAuditMutation,
      delete: deleteAuditMutation,
    },
  };
};
