import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import {
  EMERGENCY_QUERY_KEYS,
  EMERGENCY_CACHE_CONFIG,
  EmergencyPlan,
  EmergencyIncident,
  EmergencyContact,
  EmergencyProcedure,
  EmergencyResource,
  EmergencyTraining,
} from '../config';
import {
  useEmergencyPlans,
  useEmergencyPlanDetails,
  useActivePlans,
  useIncidents,
  useIncidentDetails,
  useIncidentTimeline,
  useActiveIncidents,
  useCriticalIncidents,
  useContacts,
  useContactDetails,
  usePrimaryContacts,
  use24x7Contacts,
  useProcedures,
  useProcedureDetails,
  useProceduresByCategory,
  useResources,
  useResourceDetails,
  useAvailableResources,
  useResourcesByLocation,
  useTraining,
  useTrainingDetails,
  useUpcomingTraining,
  useRequiredTraining,
  useEmergencyDashboard,
  useIncidentStatistics,
  useReadinessReport,
  useEmergencyOverview,
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
  useCreateContact,
  useUpdateContact,
  useDeleteContact,
  useCreateProcedure,
  useUpdateProcedure,
  useDeleteProcedure,
  useCreateResource,
  useUpdateResource,
  useDeleteResource,
  useCreateTraining,
  useUpdateTraining,
  useDeleteTraining,
  useBulkUpdateIncidents,
  useBulkActivateResources,
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

// Emergency contacts management
export const useContactManagement = (
  contactId?: string,
  options?: UseQueryOptions<any, Error>
) => {
  const contactsQuery = useContacts(undefined, options);
  const contactQuery = useContactDetails(contactId || '', { 
    ...options, 
    enabled: !!contactId 
  });
  const primaryContactsQuery = usePrimaryContacts(options);
  const contact24x7Query = use24x7Contacts(options);

  const createContact = useCreateContact();
  const updateContact = useUpdateContact();
  const deleteContact = useDeleteContact();

  return {
    // Data
    contacts: contactsQuery.data || [],
    contact: contactQuery.data,
    primaryContacts: primaryContactsQuery.data || [],
    contacts24x7: contact24x7Query.data || [],
    
    // Loading states
    isLoadingContacts: contactsQuery.isLoading,
    isLoadingContact: contactQuery.isLoading,
    isLoadingPrimary: primaryContactsQuery.isLoading,
    isLoading24x7: contact24x7Query.isLoading,
    isLoading: contactsQuery.isLoading || contactQuery.isLoading,
    
    // Error states
    contactsError: contactsQuery.error,
    contactError: contactQuery.error,
    primaryError: primaryContactsQuery.error,
    error24x7: contact24x7Query.error,
    
    // Mutations
    createContact: createContact.mutate,
    updateContact: updateContact.mutate,
    deleteContact: deleteContact.mutate,
    
    // Mutation states
    isCreating: createContact.isPending,
    isUpdating: updateContact.isPending,
    isDeleting: deleteContact.isPending,
    
    // Computed values
    totalContacts: contactsQuery.data?.length || 0,
    activeContacts: contactsQuery.data?.filter(c => c.isActive).length || 0,
    contactsByType: contactsQuery.data?.reduce((acc, contact) => {
      acc[contact.contactType] = (acc[contact.contactType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || {},
    
    // Utility functions
    refetch: () => {
      contactsQuery.refetch();
      contactQuery.refetch();
      primaryContactsQuery.refetch();
      contact24x7Query.refetch();
    },
  };
};

// Procedure management with categorization
export const useProcedureManagement = (
  procedureId?: string,
  category?: string,
  options?: UseQueryOptions<any, Error>
) => {
  const proceduresQuery = useProcedures(undefined, options);
  const procedureQuery = useProcedureDetails(procedureId || '', { 
    ...options, 
    enabled: !!procedureId 
  });
  const categoryProceduresQuery = useProceduresByCategory(category || '', { 
    ...options, 
    enabled: !!category 
  });

  const createProcedure = useCreateProcedure();
  const updateProcedure = useUpdateProcedure();
  const deleteProcedure = useDeleteProcedure();

  return {
    // Data
    procedures: proceduresQuery.data || [],
    procedure: procedureQuery.data,
    categoryProcedures: categoryProceduresQuery.data || [],
    
    // Loading states
    isLoadingProcedures: proceduresQuery.isLoading,
    isLoadingProcedure: procedureQuery.isLoading,
    isLoadingCategory: categoryProceduresQuery.isLoading,
    isLoading: proceduresQuery.isLoading || procedureQuery.isLoading,
    
    // Error states
    proceduresError: proceduresQuery.error,
    procedureError: procedureQuery.error,
    categoryError: categoryProceduresQuery.error,
    
    // Mutations
    createProcedure: createProcedure.mutate,
    updateProcedure: updateProcedure.mutate,
    deleteProcedure: deleteProcedure.mutate,
    
    // Mutation states
    isCreating: createProcedure.isPending,
    isUpdating: updateProcedure.isPending,
    isDeleting: deleteProcedure.isPending,
    
    // Computed values
    totalProcedures: proceduresQuery.data?.length || 0,
    activeProcedures: proceduresQuery.data?.filter(p => p.isActive).length || 0,
    proceduresByCategory: proceduresQuery.data?.reduce((acc, procedure) => {
      acc[procedure.category] = (acc[procedure.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || {},
    
    // Utility functions
    refetch: () => {
      proceduresQuery.refetch();
      procedureQuery.refetch();
      categoryProceduresQuery.refetch();
    },
  };
};

// Resource management with availability tracking
export const useResourceManagement = (
  resourceId?: string,
  locationId?: string,
  options?: UseQueryOptions<any, Error>
) => {
  const resourcesQuery = useResources(undefined, options);
  const resourceQuery = useResourceDetails(resourceId || '', { 
    ...options, 
    enabled: !!resourceId 
  });
  const availableResourcesQuery = useAvailableResources(undefined, options);
  const locationResourcesQuery = useResourcesByLocation(locationId || '', { 
    ...options, 
    enabled: !!locationId 
  });

  const createResource = useCreateResource();
  const updateResource = useUpdateResource();
  const deleteResource = useDeleteResource();
  const bulkActivateResources = useBulkActivateResources();

  return {
    // Data
    resources: resourcesQuery.data || [],
    resource: resourceQuery.data,
    availableResources: availableResourcesQuery.data || [],
    locationResources: locationResourcesQuery.data || [],
    
    // Loading states
    isLoadingResources: resourcesQuery.isLoading,
    isLoadingResource: resourceQuery.isLoading,
    isLoadingAvailable: availableResourcesQuery.isLoading,
    isLoadingLocation: locationResourcesQuery.isLoading,
    isLoading: resourcesQuery.isLoading || resourceQuery.isLoading,
    
    // Error states
    resourcesError: resourcesQuery.error,
    resourceError: resourceQuery.error,
    availableError: availableResourcesQuery.error,
    locationError: locationResourcesQuery.error,
    
    // Mutations
    createResource: createResource.mutate,
    updateResource: updateResource.mutate,
    deleteResource: deleteResource.mutate,
    bulkActivateResources: bulkActivateResources.mutate,
    
    // Mutation states
    isCreating: createResource.isPending,
    isUpdating: updateResource.isPending,
    isDeleting: deleteResource.isPending,
    isBulkActivating: bulkActivateResources.isPending,
    
    // Computed values
    totalResources: resourcesQuery.data?.length || 0,
    availableCount: availableResourcesQuery.data?.length || 0,
    resourcesByStatus: resourcesQuery.data?.reduce((acc, resource) => {
      acc[resource.status] = (acc[resource.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || {},
    resourcesByCondition: resourcesQuery.data?.reduce((acc, resource) => {
      acc[resource.condition] = (acc[resource.condition] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || {},
    
    // Utility functions
    refetch: () => {
      resourcesQuery.refetch();
      resourceQuery.refetch();
      availableResourcesQuery.refetch();
      locationResourcesQuery.refetch();
    },
  };
};

// Training management with compliance tracking
export const useTrainingManagement = (
  trainingId?: string,
  userId?: string,
  options?: UseQueryOptions<any, Error>
) => {
  const trainingQuery = useTraining(undefined, options);
  const trainingDetailsQuery = useTrainingDetails(trainingId || '', { 
    ...options, 
    enabled: !!trainingId 
  });
  const upcomingTrainingQuery = useUpcomingTraining(userId || '', { 
    ...options, 
    enabled: !!userId 
  });
  const requiredTrainingQuery = useRequiredTraining(userId || '', { 
    ...options, 
    enabled: !!userId 
  });

  const createTraining = useCreateTraining();
  const updateTraining = useUpdateTraining();
  const deleteTraining = useDeleteTraining();

  return {
    // Data
    training: trainingQuery.data || [],
    trainingDetails: trainingDetailsQuery.data,
    upcomingTraining: upcomingTrainingQuery.data || [],
    requiredTraining: requiredTrainingQuery.data || [],
    
    // Loading states
    isLoadingTraining: trainingQuery.isLoading,
    isLoadingDetails: trainingDetailsQuery.isLoading,
    isLoadingUpcoming: upcomingTrainingQuery.isLoading,
    isLoadingRequired: requiredTrainingQuery.isLoading,
    isLoading: trainingQuery.isLoading || trainingDetailsQuery.isLoading,
    
    // Error states
    trainingError: trainingQuery.error,
    detailsError: trainingDetailsQuery.error,
    upcomingError: upcomingTrainingQuery.error,
    requiredError: requiredTrainingQuery.error,
    
    // Mutations
    createTraining: createTraining.mutate,
    updateTraining: updateTraining.mutate,
    deleteTraining: deleteTraining.mutate,
    
    // Mutation states
    isCreating: createTraining.isPending,
    isUpdating: updateTraining.isPending,
    isDeleting: deleteTraining.isPending,
    
    // Computed values
    totalTraining: trainingQuery.data?.length || 0,
    activeTraining: trainingQuery.data?.filter(t => t.isActive).length || 0,
    upcomingCount: upcomingTrainingQuery.data?.length || 0,
    requiredCount: requiredTrainingQuery.data?.length || 0,
    trainingByType: trainingQuery.data?.reduce((acc, training) => {
      acc[training.type] = (acc[training.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || {},
    
    // Utility functions
    refetch: () => {
      trainingQuery.refetch();
      trainingDetailsQuery.refetch();
      upcomingTrainingQuery.refetch();
      requiredTrainingQuery.refetch();
    },
  };
};

// Emergency dashboard with real-time monitoring
export const useEmergencyDashboardComposite = (
  options?: UseQueryOptions<any, Error>
) => {
  const dashboardQuery = useEmergencyDashboard(options);
  const overviewQuery = useEmergencyOverview(options);
  const activeIncidentsQuery = useActiveIncidents(options);
  const criticalIncidentsQuery = useCriticalIncidents(options);
  const activePlansQuery = useActivePlans(options);
  const readinessQuery = useReadinessReport(options);

  return {
    // Data
    dashboard: dashboardQuery.data,
    overview: overviewQuery.data,
    activeIncidents: activeIncidentsQuery.data || [],
    criticalIncidents: criticalIncidentsQuery.data || [],
    activePlans: activePlansQuery.data || [],
    readiness: readinessQuery.data,
    
    // Loading states
    isLoadingDashboard: dashboardQuery.isLoading,
    isLoadingOverview: overviewQuery.isLoading,
    isLoadingActiveIncidents: activeIncidentsQuery.isLoading,
    isLoadingCriticalIncidents: criticalIncidentsQuery.isLoading,
    isLoadingActivePlans: activePlansQuery.isLoading,
    isLoadingReadiness: readinessQuery.isLoading,
    isLoading: dashboardQuery.isLoading || overviewQuery.isLoading,
    
    // Error states
    dashboardError: dashboardQuery.error,
    overviewError: overviewQuery.error,
    activeIncidentsError: activeIncidentsQuery.error,
    criticalIncidentsError: criticalIncidentsQuery.error,
    activePlansError: activePlansQuery.error,
    readinessError: readinessQuery.error,
    
    // Computed values
    totalActiveIncidents: activeIncidentsQuery.data?.length || 0,
    totalCriticalIncidents: criticalIncidentsQuery.data?.length || 0,
    totalActivePlans: activePlansQuery.data?.length || 0,
    overallReadiness: readinessQuery.data?.overallScore || 0,
    hasActiveEmergencies: (activeIncidentsQuery.data?.length || 0) > 0,
    hasCriticalIncidents: (criticalIncidentsQuery.data?.length || 0) > 0,
    
    // Alert levels
    alertLevel: (() => {
      const criticalCount = criticalIncidentsQuery.data?.length || 0;
      const activeCount = activeIncidentsQuery.data?.length || 0;
      
      if (criticalCount > 0) return 'CRITICAL';
      if (activeCount >= 3) return 'HIGH';
      if (activeCount > 0) return 'MEDIUM';
      return 'LOW';
    })(),
    
    // Utility functions
    refetch: () => {
      dashboardQuery.refetch();
      overviewQuery.refetch();
      activeIncidentsQuery.refetch();
      criticalIncidentsQuery.refetch();
      activePlansQuery.refetch();
      readinessQuery.refetch();
    },
  };
};

// Emergency response coordinator view
export const useEmergencyResponseCoordinator = (
  options?: UseQueryOptions<any, Error>
) => {
  const activeIncidentsQuery = useActiveIncidents(options);
  const criticalIncidentsQuery = useCriticalIncidents(options);
  const activePlansQuery = useActivePlans(options);
  const primaryContactsQuery = usePrimaryContacts(options);
  const availableResourcesQuery = useAvailableResources(undefined, options);
  const dashboardQuery = useEmergencyDashboard(options);

  const bulkUpdateIncidents = useBulkUpdateIncidents();
  const bulkActivateResources = useBulkActivateResources();

  return {
    // Data
    activeIncidents: activeIncidentsQuery.data || [],
    criticalIncidents: criticalIncidentsQuery.data || [],
    activePlans: activePlansQuery.data || [],
    primaryContacts: primaryContactsQuery.data || [],
    availableResources: availableResourcesQuery.data || [],
    dashboard: dashboardQuery.data,
    
    // Loading states
    isLoading: activeIncidentsQuery.isLoading || criticalIncidentsQuery.isLoading || dashboardQuery.isLoading,
    
    // Error states
    hasError: !!(activeIncidentsQuery.error || criticalIncidentsQuery.error || dashboardQuery.error),
    
    // Mutations
    bulkUpdateIncidents: bulkUpdateIncidents.mutate,
    bulkActivateResources: bulkActivateResources.mutate,
    
    // Mutation states
    isBulkUpdating: bulkUpdateIncidents.isPending,
    isBulkActivating: bulkActivateResources.isPending,
    
    // Computed values
    requiresImmediateAttention: criticalIncidentsQuery.data?.length || 0,
    totalActiveEvents: (activeIncidentsQuery.data?.length || 0) + (activePlansQuery.data?.length || 0),
    resourceUtilization: (() => {
      const total = availableResourcesQuery.data?.length || 0;
      const available = availableResourcesQuery.data?.filter(r => r.status === 'AVAILABLE').length || 0;
      return total > 0 ? ((total - available) / total * 100) : 0;
    })(),
    
    // Priority actions
    priorityActions: [
      ...(criticalIncidentsQuery.data || []).map(incident => ({
        type: 'critical_incident',
        id: incident.id,
        title: incident.title,
        priority: 'CRITICAL',
        timestamp: incident.reportedAt,
      })),
      ...(activeIncidentsQuery.data || []).filter(i => i.severity === 'HIGH').map(incident => ({
        type: 'high_incident',
        id: incident.id,
        title: incident.title,
        priority: 'HIGH',
        timestamp: incident.reportedAt,
      })),
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 10),
    
    // Utility functions
    refetch: () => {
      activeIncidentsQuery.refetch();
      criticalIncidentsQuery.refetch();
      activePlansQuery.refetch();
      primaryContactsQuery.refetch();
      availableResourcesQuery.refetch();
      dashboardQuery.refetch();
    },
  };
};

// Emergency analytics and reporting
export const useEmergencyAnalytics = (
  timeframe?: string,
  options?: UseQueryOptions<any, Error>
) => {
  const incidentStatsQuery = useIncidentStatistics(timeframe, options);
  const readinessQuery = useReadinessReport(options);
  const dashboardQuery = useEmergencyDashboard(options);

  return {
    // Data
    incidentStatistics: incidentStatsQuery.data,
    readinessReport: readinessQuery.data,
    dashboard: dashboardQuery.data,
    
    // Loading states
    isLoadingStatistics: incidentStatsQuery.isLoading,
    isLoadingReadiness: readinessQuery.isLoading,
    isLoadingDashboard: dashboardQuery.isLoading,
    isLoading: incidentStatsQuery.isLoading || readinessQuery.isLoading || dashboardQuery.isLoading,
    
    // Error states
    statisticsError: incidentStatsQuery.error,
    readinessError: readinessQuery.error,
    dashboardError: dashboardQuery.error,
    
    // Computed values
    totalIncidents: incidentStatsQuery.data?.totalIncidents || 0,
    averageResponseTime: incidentStatsQuery.data?.averageResponseTime || 0,
    averageResolutionTime: incidentStatsQuery.data?.averageResolutionTime || 0,
    overallReadiness: readinessQuery.data?.overallScore || 0,
    
    // Trends
    incidentTrends: incidentStatsQuery.data?.trendsData || [],
    readinessTrends: readinessQuery.data?.recommendations || [],
    
    // Utility functions
    refetch: () => {
      incidentStatsQuery.refetch();
      readinessQuery.refetch();
      dashboardQuery.refetch();
    },
  };
};

// Combined composites object for easy import
export const emergencyComposites = {
  useEmergencyManagement,
  useEmergencyPlanDetailsComposite,
  useIncidentManagement,
  useContactManagement,
  useProcedureManagement,
  useResourceManagement,
  useTrainingManagement,
  useEmergencyDashboardComposite,
  useEmergencyResponseCoordinator,
  useEmergencyAnalytics,
};
