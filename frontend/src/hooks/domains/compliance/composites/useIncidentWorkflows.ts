import { useMemo } from 'react';
import {
  useIncidentDetails,
} from '../queries/useComplianceQueries';
import {
  useUpdateIncident,
  useResolveIncident,
} from '../mutations/useComplianceMutations';
import { ComplianceIncident } from '../config';

// Composite hook for incident management workflow
export const useIncidentWorkflow = (incidentId?: string) => {
  const incidentQuery = useIncidentDetails(incidentId!, { enabled: !!incidentId });
  const updateIncidentMutation = useUpdateIncident();
  const resolveIncidentMutation = useResolveIncident();

  const incident = incidentQuery.data;

  const actions = useMemo(() => ({
    updateIncident: (data: Partial<ComplianceIncident>) =>
      updateIncidentMutation.mutate({ id: incidentId!, data }),
    resolveIncident: (resolution: string) =>
      resolveIncidentMutation.mutate({ id: incidentId!, resolution }),
    canEdit: incident?.status !== 'CLOSED',
    canResolve: incident?.status === 'INVESTIGATING',
    isCritical: incident?.severity === 'CRITICAL' || incident?.severity === 'HIGH',
    isOverdue: incident && !incident.resolvedAt &&
               new Date() > new Date(new Date(incident.reportedAt).getTime() + 7 * 24 * 60 * 60 * 1000),
  }), [incident, incidentId, updateIncidentMutation, resolveIncidentMutation]);

  return {
    incident,
    isLoading: incidentQuery.isLoading,
    error: incidentQuery.error,
    actions,
    mutations: {
      update: updateIncidentMutation,
      resolve: resolveIncidentMutation,
    },
  };
};
