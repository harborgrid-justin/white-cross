// Re-export mock API
export { mockEmergencyAPI } from './mockEmergencyAPI';

// Re-export Emergency Plans queries
export {
  useEmergencyPlans,
  useEmergencyPlanDetails,
  useActivePlans,
} from './usePlansQueries';

// Re-export Emergency Incidents queries
export {
  useIncidents,
  useIncidentDetails,
  useIncidentTimeline,
  useActiveIncidents,
  useCriticalIncidents,
} from './useIncidentsQueries';

// Re-export Emergency Contacts queries
export {
  useContacts,
  useContactDetails,
  usePrimaryContacts,
  use24x7Contacts,
} from './useContactsQueries';

// Re-export Emergency Procedures queries
export {
  useProcedures,
  useProcedureDetails,
  useProceduresByCategory,
} from './useProceduresQueries';

// Re-export Emergency Resources queries
export {
  useResources,
  useResourceDetails,
  useAvailableResources,
  useResourcesByLocation,
} from './useResourcesQueries';

// Re-export Emergency Training queries
export {
  useTraining,
  useTrainingDetails,
  useUpcomingTraining,
  useRequiredTraining,
} from './useTrainingQueries';

// Re-export Analytics queries
export {
  useEmergencyDashboard,
  useIncidentStatistics,
  useReadinessReport,
  useEmergencyOverview,
} from './useAnalyticsQueries';
