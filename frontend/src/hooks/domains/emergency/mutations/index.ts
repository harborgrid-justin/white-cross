// Re-export all mutation hooks for backward compatibility

// Types
export * from './types';

// Emergency Plan Mutations
export {
  useCreateEmergencyPlan,
  useUpdateEmergencyPlan,
  useDeleteEmergencyPlan,
  useActivatePlan,
} from './useEmergencyPlanMutations';

// Emergency Incident Mutations
export {
  useCreateIncident,
  useUpdateIncident,
  useCloseIncident,
  useAddTimelineEntry,
} from './useEmergencyIncidentMutations';

// Emergency Contact Mutations
export {
  useCreateContact,
  useUpdateContact,
  useDeleteContact,
} from './useEmergencyContactMutations';

// Emergency Procedure Mutations
export {
  useCreateProcedure,
  useUpdateProcedure,
  useDeleteProcedure,
} from './useEmergencyProcedureMutations';

// Emergency Resource Mutations
export {
  useCreateResource,
  useUpdateResource,
  useDeleteResource,
} from './useEmergencyResourceMutations';

// Emergency Training Mutations
export {
  useCreateTraining,
  useUpdateTraining,
  useDeleteTraining,
} from './useEmergencyTrainingMutations';

// Bulk Operations
export {
  useBulkUpdateIncidents,
  useBulkActivateResources,
} from './useBulkOperationMutations';

// Import functions for combined object
import {
  useCreateEmergencyPlan,
  useUpdateEmergencyPlan,
  useDeleteEmergencyPlan,
  useActivatePlan,
} from './useEmergencyPlanMutations';

import {
  useCreateIncident,
  useUpdateIncident,
  useCloseIncident,
  useAddTimelineEntry,
} from './useEmergencyIncidentMutations';

import {
  useCreateContact,
  useUpdateContact,
  useDeleteContact,
} from './useEmergencyContactMutations';

import {
  useCreateProcedure,
  useUpdateProcedure,
  useDeleteProcedure,
} from './useEmergencyProcedureMutations';

import {
  useCreateResource,
  useUpdateResource,
  useDeleteResource,
} from './useEmergencyResourceMutations';

import {
  useCreateTraining,
  useUpdateTraining,
  useDeleteTraining,
} from './useEmergencyTrainingMutations';

import {
  useBulkUpdateIncidents,
  useBulkActivateResources,
} from './useBulkOperationMutations';

// Combined mutations object for easy import
export const emergencyMutations = {
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
};
