/**
 * Emergency Management Domain Hooks
 * Centralized exports for all emergency-related React Query hooks
 */

// Configuration and types
export * from './config';

// Query hooks
export * from './queries/useEmergencyQueries';

// Mutation hooks  
export * from './mutations/useEmergencyMutations';

// Composite hooks
export * from './composites/useEmergencyComposites';

// Re-export commonly used types for convenience
export type {
  EmergencyPlan,
  EmergencyIncident,
  EmergencyContact,
  EmergencyProcedure,
  EmergencyResource,
  EmergencyTraining,
  EscalationLevel
} from './config';
