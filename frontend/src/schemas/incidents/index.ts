/**
 * @fileoverview Incidents Module - Barrel Export
 * @module schemas/incidents
 *
 * Centralized export for all incident-related schemas, types, validation utilities,
 * witness management, and follow-up action schemas. This barrel file provides a
 * single entry point for importing any incident-related schema or type.
 *
 * @example
 * ```typescript
 * // Import incident schemas
 * import {
 *   CreateIncidentSchema,
 *   IncidentSchema,
 *   IncidentType,
 *   IncidentStatus
 * } from '@/schemas/incidents';
 *
 * // Import follow-up schemas
 * import {
 *   CreateFollowUpActionSchema,
 *   FollowUpActionType,
 *   FollowUpStatus
 * } from '@/schemas/incidents';
 *
 * // Import witness schemas
 * import {
 *   WitnessSchema,
 *   CreateWitnessSchema,
 *   WitnessStatementSchema
 * } from '@/schemas/incidents';
 * ```
 *
 * @remarks
 * This module maintains strict type safety and provides comprehensive validation
 * for all incident-related operations. All schemas use Zod for runtime validation
 * with full TypeScript type inference.
 *
 * Organization:
 * - Incident Schemas: Core incident management, type-specific schemas, CRUD operations
 * - Follow-Up Schemas: Follow-up actions, tracking, completion, and verification
 * - Witness Schemas: Witness management, statements, verification, and interviews
 */

// ==========================================
// INCIDENT SCHEMAS
// ==========================================

/**
 * Core incident management schemas, types, and validation utilities.
 *
 * Includes:
 * - Base incident schema with common fields
 * - Type-specific schemas (Injury, Illness, Behavioral, Safety, Emergency)
 * - CRUD operation schemas (Create, Update, Patch)
 * - Filter and query schemas
 * - Status transition validation
 * - Enum definitions and constants
 */
export {
  // Enums & Constants
  IncidentType,
  IncidentStatus,
  IncidentSeverity,
  LocationType,
  MedicalResponse,
  ParentNotificationMethod,
  InjuryLocation,
  InjuryType,
  BehaviorType,
  HazardType,
  EmergencyType,
  EmergencySeverity,

  // Enum Types
  type IncidentTypeEnum,
  type IncidentStatusEnum,
  type IncidentSeverityEnum,
  type LocationTypeEnum,
  type MedicalResponseEnum,
  type ParentNotificationMethodEnum,
  type InjuryLocationEnum,
  type InjuryTypeEnum,
  type BehaviorTypeEnum,
  type HazardTypeEnum,
  type EmergencyTypeEnum,
  type EmergencySeverityEnum,

  // Base Schemas
  BaseIncidentSchema,
  AttachmentSchema,
  type BaseIncident,
  type Attachment,

  // Type-Specific Schemas
  InjuryIncidentSchema,
  IllnessIncidentSchema,
  BehavioralIncidentSchema,
  SafetyIncidentSchema,
  EmergencyIncidentSchema,
  VitalsSchema,
  type InjuryIncident,
  type IllnessIncident,
  type BehavioralIncident,
  type SafetyIncident,
  type EmergencyIncident,
  type Vitals,

  // CRUD Schemas
  IncidentSchema,
  CreateIncidentSchema,
  UpdateIncidentSchema,
  PatchIncidentSchema,
  CreateInjuryIncidentSchema,
  CreateIllnessIncidentSchema,
  CreateBehavioralIncidentSchema,
  CreateSafetyIncidentSchema,
  CreateEmergencyIncidentSchema,
  type Incident,
  type CreateIncidentInput,
  type UpdateIncidentInput,
  type PatchIncidentInput,
  type CreateInjuryIncidentInput,
  type CreateIllnessIncidentInput,
  type CreateBehavioralIncidentInput,
  type CreateSafetyIncidentInput,
  type CreateEmergencyIncidentInput,

  // Filter & Query Schemas
  IncidentFilterSchema,
  AdvancedIncidentFilterSchema,
  IncidentSearchSchema,
  IncidentListResponseSchema,
  type IncidentFilter,
  type AdvancedIncidentFilter,
  type IncidentSearch,
  type IncidentListResponse,

  // Validation Utilities
  VALID_STATUS_TRANSITIONS,
  isValidStatusTransition,
  getValidNextStatuses,
  isTerminalStatus,
  validateIncidentTypeFields,
} from './incident.schemas';

// ==========================================
// FOLLOW-UP ACTION SCHEMAS
// ==========================================

/**
 * Follow-up action schemas for tracking incident-related tasks and actions.
 *
 * Includes:
 * - Follow-up action creation and management
 * - Progress tracking and checklists
 * - Escalation management
 * - Completion reporting and verification
 * - Query and filter operations
 * - Bulk operations
 * - Utility functions for status, priority, and progress
 */
export {
  // Base Schemas & Types
  FollowUpActionType,
  FollowUpStatus,
  FollowUpPriority,
  VerificationMethod,
  EvidenceType,
  RecurrenceFrequency,
  type FollowUpActionTypeEnum,
  type FollowUpStatusEnum,
  type FollowUpPriorityEnum,
  type VerificationMethodEnum,
  type EvidenceTypeEnum,
  type RecurrenceFrequencyEnum,

  // Nested Schemas
  ProgressNoteSchema,
  EvidenceSchema,
  RecurrencePatternSchema,
  EscalationRuleSchema,
  type ProgressNote,
  type Evidence,
  type RecurrencePattern,
  type EscalationRule,

  // Main Schema
  FollowUpActionSchema,
  type FollowUpAction,
  VALID_FOLLOWUP_TRANSITIONS,

  // Tracking Schemas
  ChecklistItemSchema,
  type ChecklistItem,
  CreateChecklistItemSchema,
  type CreateChecklistItemInput,
  UpdateChecklistItemSchema,
  type UpdateChecklistItemInput,
  CompleteChecklistItemSchema,
  type CompleteChecklistItemInput,

  // Escalation
  EscalationReason,
  type EscalationReasonEnum,
  NotificationMethod,
  type NotificationMethodEnum,
  ActionEscalationSchema,
  type ActionEscalation,
  CreateEscalationSchema,
  type CreateEscalationInput,
  ResolveEscalationSchema,
  type ResolveEscalationInput,

  // Progress
  UpdateProgressSchema,
  type UpdateProgressInput,

  // Completion Schemas
  SuccessMetricSchema,
  type SuccessMetric,
  ResourceUsageSchema,
  type ResourceUsage,
  StakeholderFeedbackSchema,
  type StakeholderFeedback,
  ReportAttachmentSchema,
  type ReportAttachment,
  CompletionReportSchema,
  type CompletionReport,
  CreateCompletionReportSchema,
  type CreateCompletionReportInput,
  UpdateCompletionReportSchema,
  type UpdateCompletionReportInput,
  VerifyActionSchema,
  type VerifyActionInput,

  // Operations Schemas
  CreateFollowUpActionSchema,
  type CreateFollowUpActionInput,
  UpdateFollowUpActionSchema,
  type UpdateFollowUpActionInput,
  UpdateActionStatusSchema,
  type UpdateActionStatusInput,
  AssignActionSchema,
  type AssignActionInput,

  // Query/Filter
  FollowUpSortField,
  type FollowUpSortFieldEnum,
  SortOrder,
  type SortOrderEnum,
  FollowUpFilterSchema,
  type FollowUpFilter,
  FollowUpQueryResponseSchema,
  type FollowUpQueryResponse,

  // Bulk Operations
  BulkUpdateActionsSchema,
  type BulkUpdateActionsInput,
  BulkDeleteActionsSchema,
  type BulkDeleteActionsInput,

  // Utility Functions
  isValidFollowUpTransition,
  getValidNextStatuses as getValidFollowUpNextStatuses,
  isOverdue,
  daysUntilDue,
  hoursUntilDue,
  generateActionNumber,
  isTerminalStatus as isFollowUpTerminalStatus,
  isModifiable,
  calculateChecklistProgress,
  getPriorityWeight,
  shouldEscalatePriority,
} from './follow-up.schemas';

// ==========================================
// WITNESS MANAGEMENT SCHEMAS
// ==========================================

/**
 * Witness management and statement collection schemas.
 *
 * Includes:
 * - Witness registration and contact information
 * - Legal-grade witness statements with versioning
 * - Statement verification and digital signatures
 * - Witness interview structured documentation
 * - Tamper-proof audit trails
 * - Status transition validation
 */
export {
  // Enums & Constants
  WitnessType,
  type WitnessTypeEnum,
  StatementStatus,
  type StatementStatusEnum,
  VerificationMethod as WitnessVerificationMethod,
  type VerificationMethodEnum as WitnessVerificationMethodEnum,

  // Main Schemas
  WitnessSchema,
  type Witness,
  WitnessStatementSchema,
  type WitnessStatement,
  StatementVerificationSchema,
  type StatementVerification,

  // CRUD Schemas
  CreateWitnessSchema,
  type CreateWitnessInput,
  UpdateWitnessSchema,
  type UpdateWitnessInput,
  CreateStatementSchema,
  type CreateStatementInput,
  UpdateStatementSchema,
  type UpdateStatementInput,

  // Interview Schema
  WitnessInterviewSchema,
  type WitnessInterview,

  // Utility Functions
  generateVerificationCode,
  VALID_STATEMENT_TRANSITIONS,
  isValidStatementTransition,
  createStatementHash,
} from './witness.schemas';
