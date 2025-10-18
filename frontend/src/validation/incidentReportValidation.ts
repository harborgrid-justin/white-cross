/**
 * WF-COMP-360 | incidentReportValidation.ts - React component or utility module
 * Purpose: react component or utility module
 * Upstream: React, external libs | Dependencies: zod, @/types/incidents
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: constants, types | Key Features: arrow component
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

/**
 * Incident Report Validation Schemas - Frontend
 * Enterprise-grade Zod validation matching backend Joi schemas
 *
 * Validation Rules (matching backend):
 * - Description: Minimum 20 characters for meaningful incident documentation
 * - Location: Required for safety incidents, minimum 3 characters
 * - Time: Incident must not occur in the future
 * - Actions Taken: Minimum 10 characters, required for all incidents
 * - Parent Notification: Required for HIGH and CRITICAL severity
 * - Follow-up: Required for INJURY type incidents
 * - Witness Statements: Minimum 20 characters
 * - Follow-up Due Date: Must be in the future
 */

import { z } from 'zod';
import {
  IncidentType,
  IncidentSeverity,
  WitnessType,
  ActionPriority,
  ActionStatus,
  InsuranceClaimStatus,
  ComplianceStatus,
  ParentNotificationMethod
} from '@/types/incidents';

/**
 * Validation constants (matching backend)
 */
export const VALIDATION_CONSTRAINTS = {
  DESCRIPTION_MIN_LENGTH: 20,
  DESCRIPTION_MAX_LENGTH: 5000,
  LOCATION_MIN_LENGTH: 3,
  LOCATION_MAX_LENGTH: 200,
  ACTIONS_TAKEN_MIN_LENGTH: 10,
  ACTIONS_TAKEN_MAX_LENGTH: 2000,
  WITNESS_STATEMENT_MIN_LENGTH: 20,
  WITNESS_STATEMENT_MAX_LENGTH: 3000,
  FOLLOW_UP_ACTION_MIN_LENGTH: 5,
  FOLLOW_UP_ACTION_MAX_LENGTH: 500,
  FOLLOW_UP_NOTES_MAX_LENGTH: 2000,
  WITNESS_NAME_MIN_LENGTH: 2,
  WITNESS_NAME_MAX_LENGTH: 100,
} as const;

/**
 * Schema for creating a new incident report
 */
export const createIncidentReportSchema = z.object({
  studentId: z.string()
    .uuid('Invalid student ID format')
    .min(1, 'Student ID is required'),

  reportedById: z.string()
    .uuid('Invalid reporter ID format')
    .min(1, 'Reporter ID is required'),

  type: z.nativeEnum(IncidentType, {
    errorMap: () => ({ message: `Incident type must be one of: ${Object.values(IncidentType).join(', ')}` })
  }),

  severity: z.nativeEnum(IncidentSeverity, {
    errorMap: () => ({ message: `Severity must be one of: ${Object.values(IncidentSeverity).join(', ')}` })
  }),

  description: z.string()
    .min(VALIDATION_CONSTRAINTS.DESCRIPTION_MIN_LENGTH, `Description must be at least ${VALIDATION_CONSTRAINTS.DESCRIPTION_MIN_LENGTH} characters for proper documentation`)
    .max(VALIDATION_CONSTRAINTS.DESCRIPTION_MAX_LENGTH, `Description cannot exceed ${VALIDATION_CONSTRAINTS.DESCRIPTION_MAX_LENGTH} characters`),

  location: z.string()
    .min(VALIDATION_CONSTRAINTS.LOCATION_MIN_LENGTH, `Location must be at least ${VALIDATION_CONSTRAINTS.LOCATION_MIN_LENGTH} characters`)
    .max(VALIDATION_CONSTRAINTS.LOCATION_MAX_LENGTH, `Location cannot exceed ${VALIDATION_CONSTRAINTS.LOCATION_MAX_LENGTH} characters`),

  witnesses: z.array(z.string()).default([]),

  actionsTaken: z.string()
    .min(VALIDATION_CONSTRAINTS.ACTIONS_TAKEN_MIN_LENGTH, `Actions taken must be at least ${VALIDATION_CONSTRAINTS.ACTIONS_TAKEN_MIN_LENGTH} characters`)
    .max(VALIDATION_CONSTRAINTS.ACTIONS_TAKEN_MAX_LENGTH, `Actions taken cannot exceed ${VALIDATION_CONSTRAINTS.ACTIONS_TAKEN_MAX_LENGTH} characters`),

  occurredAt: z.string()
    .refine((val) => {
      const date = new Date(val);
      return date <= new Date();
    }, 'Incident time cannot be in the future'),

  parentNotified: z.boolean().default(false).optional(),

  followUpRequired: z.boolean().default(false).optional(),

  followUpNotes: z.string()
    .max(VALIDATION_CONSTRAINTS.FOLLOW_UP_NOTES_MAX_LENGTH, `Follow-up notes cannot exceed ${VALIDATION_CONSTRAINTS.FOLLOW_UP_NOTES_MAX_LENGTH} characters`)
    .optional(),

  attachments: z.array(z.string().url('Each attachment must be a valid URL')).default([]).optional(),

  evidencePhotos: z.array(z.string().url('Each photo URL must be valid')).default([]).optional(),

  evidenceVideos: z.array(z.string().url('Each video URL must be valid')).default([]).optional(),

  insuranceClaimNumber: z.string().optional(),
}).refine((data) => {
  // Business rule: INJURY incidents require follow-up
  if (data.type === IncidentType.INJURY && !data.followUpRequired) {
    return false;
  }
  return true;
}, {
  message: 'Injury incidents require follow-up to be marked as required',
  path: ['followUpRequired']
}).refine((data) => {
  // Business rule: Medication errors require detailed description (minimum 50 characters)
  if (data.type === IncidentType.MEDICATION_ERROR && data.description.length < 50) {
    return false;
  }
  return true;
}, {
  message: 'Medication error incidents require detailed description (minimum 50 characters)',
  path: ['description']
});

/**
 * Schema for updating an existing incident report
 */
export const updateIncidentReportSchema = z.object({
  type: z.nativeEnum(IncidentType).optional(),

  severity: z.nativeEnum(IncidentSeverity).optional(),

  description: z.string()
    .min(VALIDATION_CONSTRAINTS.DESCRIPTION_MIN_LENGTH, `Description must be at least ${VALIDATION_CONSTRAINTS.DESCRIPTION_MIN_LENGTH} characters`)
    .max(VALIDATION_CONSTRAINTS.DESCRIPTION_MAX_LENGTH, `Description cannot exceed ${VALIDATION_CONSTRAINTS.DESCRIPTION_MAX_LENGTH} characters`)
    .optional(),

  location: z.string()
    .min(VALIDATION_CONSTRAINTS.LOCATION_MIN_LENGTH, `Location must be at least ${VALIDATION_CONSTRAINTS.LOCATION_MIN_LENGTH} characters`)
    .max(VALIDATION_CONSTRAINTS.LOCATION_MAX_LENGTH, `Location cannot exceed ${VALIDATION_CONSTRAINTS.LOCATION_MAX_LENGTH} characters`)
    .optional(),

  witnesses: z.array(z.string()).optional(),

  actionsTaken: z.string()
    .min(VALIDATION_CONSTRAINTS.ACTIONS_TAKEN_MIN_LENGTH, `Actions taken must be at least ${VALIDATION_CONSTRAINTS.ACTIONS_TAKEN_MIN_LENGTH} characters`)
    .max(VALIDATION_CONSTRAINTS.ACTIONS_TAKEN_MAX_LENGTH, `Actions taken cannot exceed ${VALIDATION_CONSTRAINTS.ACTIONS_TAKEN_MAX_LENGTH} characters`)
    .optional(),

  occurredAt: z.string()
    .refine((val) => {
      const date = new Date(val);
      return date <= new Date();
    }, 'Incident time cannot be in the future')
    .optional(),

  parentNotified: z.boolean().optional(),

  followUpRequired: z.boolean().optional(),

  followUpNotes: z.string()
    .max(VALIDATION_CONSTRAINTS.FOLLOW_UP_NOTES_MAX_LENGTH, `Follow-up notes cannot exceed ${VALIDATION_CONSTRAINTS.FOLLOW_UP_NOTES_MAX_LENGTH} characters`)
    .optional(),

  attachments: z.array(z.string().url()).optional(),

  evidencePhotos: z.array(z.string().url()).optional(),

  evidenceVideos: z.array(z.string().url()).optional(),

  insuranceClaimNumber: z.string().optional(),

  insuranceClaimStatus: z.nativeEnum(InsuranceClaimStatus).optional(),

  legalComplianceStatus: z.nativeEnum(ComplianceStatus).optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: 'At least one field must be provided for update'
});

/**
 * Schema for creating a witness statement
 */
export const createWitnessStatementSchema = z.object({
  incidentReportId: z.string()
    .uuid('Invalid incident report ID format')
    .min(1, 'Incident report ID is required'),

  witnessName: z.string()
    .min(VALIDATION_CONSTRAINTS.WITNESS_NAME_MIN_LENGTH, `Witness name must be at least ${VALIDATION_CONSTRAINTS.WITNESS_NAME_MIN_LENGTH} characters`)
    .max(VALIDATION_CONSTRAINTS.WITNESS_NAME_MAX_LENGTH, `Witness name cannot exceed ${VALIDATION_CONSTRAINTS.WITNESS_NAME_MAX_LENGTH} characters`),

  witnessType: z.nativeEnum(WitnessType, {
    errorMap: () => ({ message: `Witness type must be one of: ${Object.values(WitnessType).join(', ')}` })
  }),

  witnessContact: z.string().optional(),

  statement: z.string()
    .min(VALIDATION_CONSTRAINTS.WITNESS_STATEMENT_MIN_LENGTH, `Witness statement must be at least ${VALIDATION_CONSTRAINTS.WITNESS_STATEMENT_MIN_LENGTH} characters for proper documentation`)
    .max(VALIDATION_CONSTRAINTS.WITNESS_STATEMENT_MAX_LENGTH, `Witness statement cannot exceed ${VALIDATION_CONSTRAINTS.WITNESS_STATEMENT_MAX_LENGTH} characters`),
});

/**
 * Schema for updating a witness statement
 */
export const updateWitnessStatementSchema = z.object({
  witnessName: z.string()
    .min(VALIDATION_CONSTRAINTS.WITNESS_NAME_MIN_LENGTH, `Witness name must be at least ${VALIDATION_CONSTRAINTS.WITNESS_NAME_MIN_LENGTH} characters`)
    .max(VALIDATION_CONSTRAINTS.WITNESS_NAME_MAX_LENGTH, `Witness name cannot exceed ${VALIDATION_CONSTRAINTS.WITNESS_NAME_MAX_LENGTH} characters`)
    .optional(),

  witnessType: z.nativeEnum(WitnessType).optional(),

  witnessContact: z.string().optional(),

  statement: z.string()
    .min(VALIDATION_CONSTRAINTS.WITNESS_STATEMENT_MIN_LENGTH, `Witness statement must be at least ${VALIDATION_CONSTRAINTS.WITNESS_STATEMENT_MIN_LENGTH} characters`)
    .max(VALIDATION_CONSTRAINTS.WITNESS_STATEMENT_MAX_LENGTH, `Witness statement cannot exceed ${VALIDATION_CONSTRAINTS.WITNESS_STATEMENT_MAX_LENGTH} characters`)
    .optional(),

  verified: z.boolean().optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: 'At least one field must be provided for update'
});

/**
 * Schema for creating a follow-up action
 */
export const createFollowUpActionSchema = z.object({
  incidentReportId: z.string()
    .uuid('Invalid incident report ID format')
    .min(1, 'Incident report ID is required'),

  action: z.string()
    .min(VALIDATION_CONSTRAINTS.FOLLOW_UP_ACTION_MIN_LENGTH, `Action must be at least ${VALIDATION_CONSTRAINTS.FOLLOW_UP_ACTION_MIN_LENGTH} characters`)
    .max(VALIDATION_CONSTRAINTS.FOLLOW_UP_ACTION_MAX_LENGTH, `Action cannot exceed ${VALIDATION_CONSTRAINTS.FOLLOW_UP_ACTION_MAX_LENGTH} characters`),

  dueDate: z.string()
    .refine((val) => {
      const date = new Date(val);
      return date > new Date();
    }, 'Due date must be in the future'),

  priority: z.nativeEnum(ActionPriority, {
    errorMap: () => ({ message: `Priority must be one of: ${Object.values(ActionPriority).join(', ')}` })
  }),

  assignedTo: z.string().uuid('Invalid assigned user ID format').optional(),
}).refine((data) => {
  // Business rule: URGENT priority should have due date within 24 hours
  if (data.priority === ActionPriority.URGENT) {
    const dueDate = new Date(data.dueDate);
    const now = new Date();
    const hoursDiff = (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (hoursDiff > 24) {
      // This is a warning, not an error - we'll allow it but could show a toast
      console.warn('URGENT priority actions typically should be due within 24 hours');
    }
  }
  return true;
});

/**
 * Schema for updating a follow-up action
 */
export const updateFollowUpActionSchema = z.object({
  action: z.string()
    .min(VALIDATION_CONSTRAINTS.FOLLOW_UP_ACTION_MIN_LENGTH, `Action must be at least ${VALIDATION_CONSTRAINTS.FOLLOW_UP_ACTION_MIN_LENGTH} characters`)
    .max(VALIDATION_CONSTRAINTS.FOLLOW_UP_ACTION_MAX_LENGTH, `Action cannot exceed ${VALIDATION_CONSTRAINTS.FOLLOW_UP_ACTION_MAX_LENGTH} characters`)
    .optional(),

  dueDate: z.string()
    .refine((val) => {
      const date = new Date(val);
      return date >= new Date();
    }, 'Due date cannot be in the past')
    .optional(),

  priority: z.nativeEnum(ActionPriority).optional(),

  status: z.nativeEnum(ActionStatus).optional(),

  assignedTo: z.string().uuid('Invalid assigned user ID format').optional(),

  notes: z.string()
    .max(VALIDATION_CONSTRAINTS.FOLLOW_UP_NOTES_MAX_LENGTH, `Notes cannot exceed ${VALIDATION_CONSTRAINTS.FOLLOW_UP_NOTES_MAX_LENGTH} characters`)
    .optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: 'At least one field must be provided for update'
}).refine((data) => {
  // Business rule: COMPLETED status requires notes
  if (data.status === ActionStatus.COMPLETED && (!data.notes || data.notes.trim().length === 0)) {
    return false;
  }
  return true;
}, {
  message: 'Completion notes are required when marking an action as completed',
  path: ['notes']
});

/**
 * Schema for marking parent as notified
 */
export const markParentNotifiedSchema = z.object({
  notificationMethod: z.string().optional(),
  notifiedBy: z.string().uuid('Invalid user ID format').optional(),
});

/**
 * Schema for parent notification request
 */
export const notifyParentSchema = z.object({
  method: z.nativeEnum(ParentNotificationMethod, {
    errorMap: () => ({ message: `Method must be one of: ${Object.values(ParentNotificationMethod).join(', ')}` })
  }),
});

/**
 * Schema for adding evidence
 */
export const addEvidenceSchema = z.object({
  evidenceType: z.enum(['photo', 'video'], {
    errorMap: () => ({ message: 'Evidence type must be either "photo" or "video"' })
  }),
  evidenceUrls: z.array(z.string().url('Each evidence URL must be valid')).min(1, 'At least one evidence URL is required'),
});

/**
 * Schema for updating insurance claim
 */
export const updateInsuranceClaimSchema = z.object({
  claimNumber: z.string().min(1, 'Insurance claim number is required'),
  status: z.nativeEnum(InsuranceClaimStatus, {
    errorMap: () => ({ message: `Status must be one of: ${Object.values(InsuranceClaimStatus).join(', ')}` })
  }),
});

/**
 * Schema for updating compliance status
 */
export const updateComplianceStatusSchema = z.object({
  status: z.nativeEnum(ComplianceStatus, {
    errorMap: () => ({ message: `Status must be one of: ${Object.values(ComplianceStatus).join(', ')}` })
  }),
});

/**
 * Type exports for form data
 */
export type CreateIncidentReportFormData = z.infer<typeof createIncidentReportSchema>;
export type UpdateIncidentReportFormData = z.infer<typeof updateIncidentReportSchema>;
export type CreateWitnessStatementFormData = z.infer<typeof createWitnessStatementSchema>;
export type UpdateWitnessStatementFormData = z.infer<typeof updateWitnessStatementSchema>;
export type CreateFollowUpActionFormData = z.infer<typeof createFollowUpActionSchema>;
export type UpdateFollowUpActionFormData = z.infer<typeof updateFollowUpActionSchema>;
export type MarkParentNotifiedFormData = z.infer<typeof markParentNotifiedSchema>;
export type NotifyParentFormData = z.infer<typeof notifyParentSchema>;
export type AddEvidenceFormData = z.infer<typeof addEvidenceSchema>;
export type UpdateInsuranceClaimFormData = z.infer<typeof updateInsuranceClaimSchema>;
export type UpdateComplianceStatusFormData = z.infer<typeof updateComplianceStatusSchema>;

/**
 * Validation helper functions
 */

/**
 * Validate incident description meets requirements based on type
 */
export const validateIncidentDescription = (type: IncidentType, description: string): string | null => {
  if (type === IncidentType.MEDICATION_ERROR && description.length < 50) {
    return 'Medication error incidents require detailed description (minimum 50 characters)';
  }
  if (description.length < VALIDATION_CONSTRAINTS.DESCRIPTION_MIN_LENGTH) {
    return `Description must be at least ${VALIDATION_CONSTRAINTS.DESCRIPTION_MIN_LENGTH} characters`;
  }
  return null;
};

/**
 * Check if parent notification should be required based on severity
 */
export const shouldRequireParentNotification = (severity: IncidentSeverity): boolean => {
  return severity === IncidentSeverity.HIGH || severity === IncidentSeverity.CRITICAL;
};

/**
 * Check if follow-up should be required based on incident type
 */
export const shouldRequireFollowUp = (type: IncidentType): boolean => {
  return type === IncidentType.INJURY;
};

/**
 * Validate due date for urgency level
 */
export const validateDueDateForPriority = (priority: ActionPriority, dueDate: string): string | null => {
  if (priority === ActionPriority.URGENT) {
    const dueDateObj = new Date(dueDate);
    const now = new Date();
    const hoursDiff = (dueDateObj.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (hoursDiff > 24) {
      return 'URGENT priority actions typically should be due within 24 hours';
    }
  }
  return null;
};
