/**
 * @fileoverview Follow-Up Action Validation Schemas - Barrel Export
 * @module schemas/incidents/follow-up
 *
 * Centralized exports for all follow-up action schemas and utilities.
 * This file maintains backward compatibility while providing modular organization.
 */

// ==========================================
// BASE SCHEMAS & TYPES
// ==========================================

export {
  // Enums
  FollowUpActionType,
  FollowUpStatus,
  FollowUpPriority,
  VerificationMethod,
  EvidenceType,
  RecurrenceFrequency,

  // Enum Types
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

  // Nested Types
  type ProgressNote,
  type Evidence,
  type RecurrencePattern,
  type EscalationRule,

  // Main Schema
  FollowUpActionSchema,
  type FollowUpAction,

  // Constants
  VALID_FOLLOWUP_TRANSITIONS,
} from './follow-up.base.schemas';

// ==========================================
// TRACKING SCHEMAS
// ==========================================

export {
  // Checklist
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
} from './follow-up.tracking.schemas';

// ==========================================
// COMPLETION SCHEMAS
// ==========================================

export {
  // Completion Report
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

  // Verification
  VerifyActionSchema,
  type VerifyActionInput,
} from './follow-up.completion.schemas';

// ==========================================
// OPERATIONS SCHEMAS
// ==========================================

export {
  // Create/Update
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
} from './follow-up.operations.schemas';

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

export {
  // Status Transitions
  isValidFollowUpTransition,
  getValidNextStatuses,

  // Date/Time Calculations
  isOverdue,
  daysUntilDue,
  hoursUntilDue,

  // Auto-generation
  generateActionNumber,

  // Progress & Status Helpers
  isTerminalStatus,
  isModifiable,
  calculateChecklistProgress,

  // Priority Helpers
  getPriorityWeight,
  shouldEscalatePriority,
} from './follow-up.utils';
