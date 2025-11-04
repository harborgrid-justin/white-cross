// This file now re-exports from modular query files
// All hooks remain available from the original path for backward compatibility

export { mockEmergencyAPI } from './mockEmergencyAPI';

export {
  useEmergencyPlans,
  useEmergencyPlanDetails,
  useActivePlans,
} from './usePlansQueries';

export {
  useIncidents,
  useIncidentDetails,
  useIncidentTimeline,
  useActiveIncidents,
  useCriticalIncidents,
} from './useIncidentsQueries';

export {
  useContacts,
  useContactDetails,
  usePrimaryContacts,
  use24x7Contacts,
} from './useContactsQueries';

export {
  useProcedures,
  useProcedureDetails,
  useProceduresByCategory,
} from './useProceduresQueries';

export {
  useResources,
  useResourceDetails,
  useAvailableResources,
  useResourcesByLocation,
} from './useResourcesQueries';

export {
  useTraining,
  useTrainingDetails,
  useUpcomingTraining,
  useRequiredTraining,
} from './useTrainingQueries';

export {
  useEmergencyDashboard,
  useIncidentStatistics,
  useReadinessReport,
  useEmergencyOverview,
} from './useAnalyticsQueries';
