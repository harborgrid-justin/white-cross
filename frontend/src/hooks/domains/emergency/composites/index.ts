export {
  useEmergencyManagement,
  useEmergencyPlanDetailsComposite,
  useIncidentManagement,
} from './management';

export {
  useContactManagement,
  useProcedureManagement,
  useResourceManagement,
} from './resources';

export {
  useTrainingManagement,
} from './training';

export {
  useEmergencyDashboardComposite,
  useEmergencyResponseCoordinator,
  useEmergencyAnalytics,
} from './monitoring';

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
