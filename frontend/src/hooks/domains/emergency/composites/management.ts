import { UseQueryOptions } from '@tanstack/react-query';
import {
  useEmergencyPlans,
  useEmergencyPlanDetails,
  useActivePlans,
  useIncidents,
  useIncidentDetails,
  useIncidentTimeline,
  useContacts,
  useResources,
  useProcedures,
  usePrimaryContacts,
  useAvailableResources,
} from '../queries/useEmergencyQueries';
import {
  useCreateEmergencyPlan,
  useUpdateEmergencyPlan,
  useDeleteEmergencyPlan,
  useActivatePlan,
  useCreateIncident,
  useUpdateIncident,
  useCloseIncident,
  useAddTimelineEntry,
} from '../mutations/useEmergencyMutations';

// Combined emergency management hook
export const useEmergencyManagement = (
  filters?: any,
  options?: UseQueryOptions<any, Error>
) => {
  const plansQuery = useEmergencyPlans(filters, options);
  const incidentsQuery = useIncidents(filters, options);
  const contactsQuery = useContacts(undefined, options);
  const resourcesQuery = useResources(undefined, options);

  const createPlan = useCreateEmergencyPlan();
  const updatePlan = useUpdateEmergencyPlan();
  const deletePlan = useDeleteEmergencyPlan();
  const activatePlan = useActivatePlan();

  const createIncident = useCreateIncident();
  const updateIncident = useUpdateIncident();
  const closeIncident = useCloseIncident();

  return {
    // Queries
    plans: plansQuery.data || [],
    incidents: incidentsQuery.data || [],
    contacts: contactsQuery.data || [],
    resources: resourcesQuery.data || [],

    // Loading states
    isLoadingPlans: plansQuery.isLoading,
    isLoadingIncidents: incidentsQuery.isLoading,
    isLoadingContacts: contactsQuery.isLoading,
    isLoadingResources: resourcesQuery.isLoading,
    isLoading: plansQuery.isLoading || incidentsQuery.isLoading || contactsQuery.isLoading || resourcesQuery.isLoading,

    // Error states
    plansError: plansQuery.error,
    incidentsError: incidentsQuery.error,
    contactsError: contactsQuery.error,
    resourcesError: resourcesQuery.error,
    hasError: !!(plansQuery.error || incidentsQuery.error || contactsQuery.error || resourcesQuery.error),

    // Plan mutations
    createPlan: createPlan.mutate,
    updatePlan: updatePlan.mutate,
    deletePlan: deletePlan.mutate,
    activatePlan: activatePlan.mutate,

    // Incident mutations
    createIncident: createIncident.mutate,
    updateIncident: updateIncident.mutate,
    closeIncident: closeIncident.mutate,

    // Plan mutation states
    isCreatingPlan: createPlan.isPending,
    isUpdatingPlan: updatePlan.isPending,
    isDeletingPlan: deletePlan.isPending,
    isActivatingPlan: activatePlan.isPending,

    // Incident mutation states
    isCreatingIncident: createIncident.isPending,
    isUpdatingIncident: updateIncident.isPending,
    isClosingIncident: closeIncident.isPending,

    // Utility functions
    refetch: () => {
      plansQuery.refetch();
      incidentsQuery.refetch();
      contactsQuery.refetch();
      resourcesQuery.refetch();
    },
  };
};

// Emergency plan details with complete context
export const useEmergencyPlanDetailsComposite = (
  planId: string,
  options?: UseQueryOptions<any, Error>
) => {
  const planQuery = useEmergencyPlanDetails(planId, options);
  const proceduresQuery = useProcedures(undefined, options);
  const contactsQuery = useContacts(undefined, options);
  const resourcesQuery = useResources(undefined, options);

  return {
    // Data
    plan: planQuery.data,
    procedures: proceduresQuery.data || [],
    contacts: contactsQuery.data || [],
    resources: resourcesQuery.data || [],

    // Loading states
    isLoading: planQuery.isLoading,
    isLoadingProcedures: proceduresQuery.isLoading,
    isLoadingContacts: contactsQuery.isLoading,
    isLoadingResources: resourcesQuery.isLoading,

    // Error states
    error: planQuery.error,
    proceduresError: proceduresQuery.error,
    contactsError: contactsQuery.error,
    resourcesError: resourcesQuery.error,

    // Computed values
    isActivePlan: planQuery.data?.status === 'ACTIVE',
    lastActivated: planQuery.data?.lastActivated,
    activationCount: planQuery.data?.activationCount || 0,

    // Utility functions
    refetch: () => {
      planQuery.refetch();
      proceduresQuery.refetch();
      contactsQuery.refetch();
      resourcesQuery.refetch();
    },
  };
};

// Incident management with real-time updates
export const useIncidentManagement = (
  incidentId: string,
  options?: UseQueryOptions<any, Error>
) => {
  const incidentQuery = useIncidentDetails(incidentId, options);
  const timelineQuery = useIncidentTimeline(incidentId, options);
  const contactsQuery = usePrimaryContacts(options);
  const resourcesQuery = useAvailableResources(undefined, options);

  const updateIncident = useUpdateIncident();
  const addTimelineEntry = useAddTimelineEntry();
  const closeIncident = useCloseIncident();

  return {
    // Data
    incident: incidentQuery.data,
    timeline: timelineQuery.data || [],
    availableContacts: contactsQuery.data || [],
    availableResources: resourcesQuery.data || [],

    // Loading states
    isLoading: incidentQuery.isLoading,
    isLoadingTimeline: timelineQuery.isLoading,
    isLoadingContacts: contactsQuery.isLoading,
    isLoadingResources: resourcesQuery.isLoading,

    // Error states
    error: incidentQuery.error,
    timelineError: timelineQuery.error,
    contactsError: contactsQuery.error,
    resourcesError: resourcesQuery.error,

    // Mutations
    updateIncident: updateIncident.mutate,
    addTimelineEntry: addTimelineEntry.mutate,
    closeIncident: closeIncident.mutate,

    // Mutation states
    isUpdating: updateIncident.isPending,
    isAddingEntry: addTimelineEntry.isPending,
    isClosing: closeIncident.isPending,

    // Computed values
    isActive: incidentQuery.data?.status && !['RESOLVED', 'CLOSED'].includes(incidentQuery.data.status),
    isCritical: incidentQuery.data?.severity === 'CRITICAL',
    responseTime: incidentQuery.data?.respondedAt && incidentQuery.data?.reportedAt
      ? new Date(incidentQuery.data.respondedAt).getTime() - new Date(incidentQuery.data.reportedAt).getTime()
      : null,

    // Utility functions
    refetch: () => {
      incidentQuery.refetch();
      timelineQuery.refetch();
      contactsQuery.refetch();
      resourcesQuery.refetch();
    },
  };
};
