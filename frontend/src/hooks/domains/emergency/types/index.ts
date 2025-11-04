/**
 * Emergency Domain Type Definitions Index
 *
 * Centralized exports for all emergency management type definitions.
 *
 * @module hooks/domains/emergency/types
 */

// Emergency Plan Types
export type {
  EmergencyPlan,
  EmergencyPlanCategory,
  EscalationLevel,
  EscalationRule,
  CommunicationStep,
  RecoveryStep,
} from './emergencyPlanTypes';

// Emergency Incident Types
export type {
  EmergencyIncident,
  IncidentType,
  IncidentLocation,
  IncidentTimelineEntry,
  IncidentCommunication,
  IncidentDamage,
} from './emergencyIncidentTypes';

// Emergency Contact Types
export type {
  EmergencyContact,
  ContactAddress,
} from './emergencyContactTypes';

// Emergency Procedure Types
export type {
  EmergencyProcedure,
  ProcedureStep,
  ChecklistItem,
  ProcedureDocument,
} from './emergencyProcedureTypes';

// Emergency Resource Types
export type {
  EmergencyResource,
  ResourceType,
  MaintenanceSchedule,
  ResourceSupplier,
} from './emergencyResourceTypes';

// Emergency Training Types
export type {
  EmergencyTraining,
  TrainingFrequency,
  TrainingModule,
  TrainingActivity,
  TrainingMaterial,
  TrainingAssessment,
  AssessmentQuestion,
} from './emergencyTrainingTypes';

// Emergency User Types
export type { EmergencyUser, ContactAvailability } from './emergencyUserTypes';
