/**
 * Emergency Domain TypeScript Type Definitions
 *
 * Comprehensive type system supporting emergency management workflows including
 * plans, incidents, contacts, procedures, resources, and training.
 *
 * @module hooks/domains/emergency/emergencyTypes
 *
 * @remarks
 * This module provides the foundational type system for the emergency management system.
 * For better tree-shaking, import directly from the types/ subdirectory:
 * - types/emergencyPlanTypes
 * - types/emergencyIncidentTypes
 * - types/emergencyContactTypes
 * - types/emergencyProcedureTypes
 * - types/emergencyResourceTypes
 * - types/emergencyTrainingTypes
 * - types/emergencyUserTypes
 *
 * **Type Categories**:
 * - Emergency Plans: Response plans with activation criteria and escalation
 * - Emergency Incidents: Real-time incident tracking and response
 * - Emergency Contacts: Contact management with availability tracking
 * - Emergency Procedures: Step-by-step procedures with checklists
 * - Emergency Resources: Resource tracking and allocation
 * - Emergency Training: Training programs and certifications
 *
 * **HIPAA Compliance**:
 * - Audit trail support through user tracking in all entities
 * - PHI handling guidelines for emergency contacts
 * - Secure communication channel specifications
 *
 * @example
 * ```typescript
 * import { EmergencyPlan, EmergencyIncident } from '@/hooks/domains/emergency/emergencyTypes';
 *
 * const plan: EmergencyPlan = {
 *   id: 'plan-123',
 *   name: 'Fire Response Plan',
 *   // ... other properties
 * };
 * ```
 */

// Re-export all types from the types subdirectory
export type {
  EmergencyPlan,
  EmergencyPlanCategory,
  EscalationLevel,
  EscalationRule,
  CommunicationStep,
  RecoveryStep,
} from './types/emergencyPlanTypes';

export type {
  EmergencyIncident,
  IncidentType,
  IncidentLocation,
  IncidentTimelineEntry,
  IncidentCommunication,
  IncidentDamage,
} from './types/emergencyIncidentTypes';

export type {
  EmergencyContact,
  ContactAddress,
} from './types/emergencyContactTypes';

export type {
  EmergencyProcedure,
  ProcedureStep,
  ChecklistItem,
  ProcedureDocument,
} from './types/emergencyProcedureTypes';

export type {
  EmergencyResource,
  ResourceType,
  MaintenanceSchedule,
  ResourceSupplier,
} from './types/emergencyResourceTypes';

export type {
  EmergencyTraining,
  TrainingFrequency,
  TrainingModule,
  TrainingActivity,
  TrainingMaterial,
  TrainingAssessment,
  AssessmentQuestion,
} from './types/emergencyTrainingTypes';

export type {
  EmergencyUser,
  ContactAvailability,
} from './types/emergencyUserTypes';
