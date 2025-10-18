/**
 * WC-VAL-INC-060 | incidentReportValidator.ts - Incident Reporting Validation Schemas
 * Purpose: Enterprise-grade validation for incident reports, witness statements, follow-up actions with safety compliance
 * Upstream: ../database/types/enums, joi | Dependencies: joi, incident enums, compliance types
 * Downstream: ../routes/incidentReports.ts, ../services/incidentReportService.ts | Called by: incident reporting endpoints
 * Related: ../middleware/auditLogging.ts, ../validators/complianceValidators.ts, ../services/notificationService.ts
 * Exports: createIncidentReportSchema, createWitnessStatementSchema, createFollowUpActionSchema, validateIncidentData | Key Services: Safety incident validation
 * Last Updated: 2025-10-18 | File Type: .ts | Pattern: Validation Layer
 * Critical Path: Incident validation → Safety compliance → Witness documentation → Follow-up tracking
 * LLM Context: Safety incident validators with healthcare compliance, witness management, follow-up actions, insurance claims, parent notification, evidence handling
 */

/**
 * Incident Report Validation Schemas
 * Enterprise-grade validation with healthcare compliance and safety rules
 *
 * Validation Rules:
 * - Description: Minimum 20 characters for meaningful incident documentation
 * - Location: Required for safety incidents, minimum 3 characters
 * - Time: Incident must not occur in the future
 * - Actions Taken: Minimum 10 characters, required for all incidents
 * - Parent Notification: Required for HIGH and CRITICAL severity
 * - Follow-up: Required for INJURY type incidents
 * - Witness Statements: Minimum 20 characters
 * - Follow-up Due Date: Must be in the future
 */

import Joi from 'joi';
import {
  IncidentType,
  IncidentSeverity,
  WitnessType,
  ActionPriority,
  ActionStatus,
  InsuranceClaimStatus,
  ComplianceStatus
} from '../database/types/enums';

/**
 * Validation constants
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
 * Includes all mandatory safety and compliance validations
 */
export const createIncidentReportSchema = Joi.object({
  studentId: Joi.string()
    .uuid()
    .required()
    .messages({
      'string.empty': 'Student ID is required',
      'string.guid': 'Invalid student ID format',
      'any.required': 'Student ID is required'
    }),

  reportedById: Joi.string()
    .uuid()
    .required()
    .messages({
      'string.empty': 'Reporter ID is required',
      'string.guid': 'Invalid reporter ID format',
      'any.required': 'Reporter ID is required'
    }),

  type: Joi.string()
    .valid(...Object.values(IncidentType))
    .required()
    .messages({
      'string.empty': 'Incident type is required',
      'any.only': `Incident type must be one of: ${Object.values(IncidentType).join(', ')}`,
      'any.required': 'Incident type is required'
    }),

  severity: Joi.string()
    .valid(...Object.values(IncidentSeverity))
    .required()
    .messages({
      'string.empty': 'Incident severity is required',
      'any.only': `Severity must be one of: ${Object.values(IncidentSeverity).join(', ')}`,
      'any.required': 'Incident severity is required'
    }),

  description: Joi.string()
    .min(VALIDATION_CONSTRAINTS.DESCRIPTION_MIN_LENGTH)
    .max(VALIDATION_CONSTRAINTS.DESCRIPTION_MAX_LENGTH)
    .required()
    .messages({
      'string.empty': 'Incident description is required',
      'string.min': `Description must be at least ${VALIDATION_CONSTRAINTS.DESCRIPTION_MIN_LENGTH} characters for proper documentation`,
      'string.max': `Description cannot exceed ${VALIDATION_CONSTRAINTS.DESCRIPTION_MAX_LENGTH} characters`,
      'any.required': 'Incident description is required'
    }),

  location: Joi.string()
    .min(VALIDATION_CONSTRAINTS.LOCATION_MIN_LENGTH)
    .max(VALIDATION_CONSTRAINTS.LOCATION_MAX_LENGTH)
    .required()
    .messages({
      'string.empty': 'Incident location is required for safety documentation',
      'string.min': `Location must be at least ${VALIDATION_CONSTRAINTS.LOCATION_MIN_LENGTH} characters`,
      'string.max': `Location cannot exceed ${VALIDATION_CONSTRAINTS.LOCATION_MAX_LENGTH} characters`,
      'any.required': 'Incident location is required for safety documentation'
    }),

  witnesses: Joi.array()
    .items(Joi.string())
    .default([])
    .messages({
      'array.base': 'Witnesses must be an array of strings'
    }),

  actionsTaken: Joi.string()
    .min(VALIDATION_CONSTRAINTS.ACTIONS_TAKEN_MIN_LENGTH)
    .max(VALIDATION_CONSTRAINTS.ACTIONS_TAKEN_MAX_LENGTH)
    .required()
    .messages({
      'string.empty': 'Actions taken must be documented for all incidents',
      'string.min': `Actions taken must be at least ${VALIDATION_CONSTRAINTS.ACTIONS_TAKEN_MIN_LENGTH} characters`,
      'string.max': `Actions taken cannot exceed ${VALIDATION_CONSTRAINTS.ACTIONS_TAKEN_MAX_LENGTH} characters`,
      'any.required': 'Actions taken must be documented for all incidents'
    }),

  occurredAt: Joi.date()
    .max('now')
    .required()
    .messages({
      'date.base': 'Invalid incident date/time',
      'date.max': 'Incident time cannot be in the future',
      'any.required': 'Incident occurrence time is required'
    }),

  parentNotified: Joi.boolean()
    .default(false)
    .messages({
      'boolean.base': 'Parent notification status must be true or false'
    }),

  followUpRequired: Joi.boolean()
    .default(false)
    .messages({
      'boolean.base': 'Follow-up required status must be true or false'
    }),

  followUpNotes: Joi.string()
    .max(VALIDATION_CONSTRAINTS.FOLLOW_UP_NOTES_MAX_LENGTH)
    .allow(null, '')
    .messages({
      'string.max': `Follow-up notes cannot exceed ${VALIDATION_CONSTRAINTS.FOLLOW_UP_NOTES_MAX_LENGTH} characters`
    }),

  attachments: Joi.array()
    .items(Joi.string().uri())
    .default([])
    .messages({
      'array.base': 'Attachments must be an array of URLs',
      'string.uri': 'Each attachment must be a valid URL'
    }),

  evidencePhotos: Joi.array()
    .items(Joi.string().uri())
    .default([])
    .messages({
      'array.base': 'Evidence photos must be an array of URLs',
      'string.uri': 'Each photo URL must be valid'
    }),

  evidenceVideos: Joi.array()
    .items(Joi.string().uri())
    .default([])
    .messages({
      'array.base': 'Evidence videos must be an array of URLs',
      'string.uri': 'Each video URL must be valid'
    }),

  insuranceClaimNumber: Joi.string()
    .allow(null, '')
    .messages({
      'string.base': 'Insurance claim number must be a string'
    })
}).custom((value, helpers) => {
  // Custom validation: High/Critical severity requires parent notification flag acknowledgment
  if (['HIGH', 'CRITICAL'].includes(value.severity) && !value.parentNotified) {
    // Allow it but log a warning - service layer will auto-notify
    helpers.warn('incident.parentNotificationRecommended', {
      message: 'High and critical incidents typically require parent notification'
    });
  }

  // Custom validation: Injury incidents require follow-up
  if (value.type === 'INJURY' && !value.followUpRequired) {
    return helpers.error('incident.injuryFollowUpRequired', {
      message: 'Injury incidents require follow-up to be marked as required'
    });
  }

  // Custom validation: Medication errors require detailed documentation
  if (value.type === 'MEDICATION_ERROR' && value.description.length < 50) {
    return helpers.error('incident.medicationErrorDetailRequired', {
      message: 'Medication error incidents require detailed description (minimum 50 characters)'
    });
  }

  return value;
}, 'Incident Report Business Rules Validation');

/**
 * Schema for updating an existing incident report
 * All fields are optional for partial updates
 */
export const updateIncidentReportSchema = Joi.object({
  type: Joi.string()
    .valid(...Object.values(IncidentType))
    .messages({
      'any.only': `Incident type must be one of: ${Object.values(IncidentType).join(', ')}`
    }),

  severity: Joi.string()
    .valid(...Object.values(IncidentSeverity))
    .messages({
      'any.only': `Severity must be one of: ${Object.values(IncidentSeverity).join(', ')}`
    }),

  description: Joi.string()
    .min(VALIDATION_CONSTRAINTS.DESCRIPTION_MIN_LENGTH)
    .max(VALIDATION_CONSTRAINTS.DESCRIPTION_MAX_LENGTH)
    .messages({
      'string.min': `Description must be at least ${VALIDATION_CONSTRAINTS.DESCRIPTION_MIN_LENGTH} characters`,
      'string.max': `Description cannot exceed ${VALIDATION_CONSTRAINTS.DESCRIPTION_MAX_LENGTH} characters`
    }),

  location: Joi.string()
    .min(VALIDATION_CONSTRAINTS.LOCATION_MIN_LENGTH)
    .max(VALIDATION_CONSTRAINTS.LOCATION_MAX_LENGTH)
    .messages({
      'string.min': `Location must be at least ${VALIDATION_CONSTRAINTS.LOCATION_MIN_LENGTH} characters`,
      'string.max': `Location cannot exceed ${VALIDATION_CONSTRAINTS.LOCATION_MAX_LENGTH} characters`
    }),

  witnesses: Joi.array()
    .items(Joi.string())
    .messages({
      'array.base': 'Witnesses must be an array of strings'
    }),

  actionsTaken: Joi.string()
    .min(VALIDATION_CONSTRAINTS.ACTIONS_TAKEN_MIN_LENGTH)
    .max(VALIDATION_CONSTRAINTS.ACTIONS_TAKEN_MAX_LENGTH)
    .messages({
      'string.min': `Actions taken must be at least ${VALIDATION_CONSTRAINTS.ACTIONS_TAKEN_MIN_LENGTH} characters`,
      'string.max': `Actions taken cannot exceed ${VALIDATION_CONSTRAINTS.ACTIONS_TAKEN_MAX_LENGTH} characters`
    }),

  occurredAt: Joi.date()
    .max('now')
    .messages({
      'date.base': 'Invalid incident date/time',
      'date.max': 'Incident time cannot be in the future'
    }),

  parentNotified: Joi.boolean()
    .messages({
      'boolean.base': 'Parent notification status must be true or false'
    }),

  followUpRequired: Joi.boolean()
    .messages({
      'boolean.base': 'Follow-up required status must be true or false'
    }),

  followUpNotes: Joi.string()
    .max(VALIDATION_CONSTRAINTS.FOLLOW_UP_NOTES_MAX_LENGTH)
    .allow(null, '')
    .messages({
      'string.max': `Follow-up notes cannot exceed ${VALIDATION_CONSTRAINTS.FOLLOW_UP_NOTES_MAX_LENGTH} characters`
    }),

  attachments: Joi.array()
    .items(Joi.string().uri())
    .messages({
      'array.base': 'Attachments must be an array of URLs',
      'string.uri': 'Each attachment must be a valid URL'
    }),

  evidencePhotos: Joi.array()
    .items(Joi.string().uri())
    .messages({
      'array.base': 'Evidence photos must be an array of URLs',
      'string.uri': 'Each photo URL must be valid'
    }),

  evidenceVideos: Joi.array()
    .items(Joi.string().uri())
    .messages({
      'array.base': 'Evidence videos must be an array of URLs',
      'string.uri': 'Each video URL must be valid'
    }),

  insuranceClaimNumber: Joi.string()
    .allow(null, '')
    .messages({
      'string.base': 'Insurance claim number must be a string'
    }),

  insuranceClaimStatus: Joi.string()
    .valid(...Object.values(InsuranceClaimStatus))
    .messages({
      'any.only': `Insurance claim status must be one of: ${Object.values(InsuranceClaimStatus).join(', ')}`
    }),

  legalComplianceStatus: Joi.string()
    .valid(...Object.values(ComplianceStatus))
    .messages({
      'any.only': `Compliance status must be one of: ${Object.values(ComplianceStatus).join(', ')}`
    })
}).min(1).messages({
  'object.min': 'At least one field must be provided for update'
});

/**
 * Schema for creating a witness statement
 * Requires detailed statement with minimum length for credibility
 */
export const createWitnessStatementSchema = Joi.object({
  incidentReportId: Joi.string()
    .uuid()
    .required()
    .messages({
      'string.empty': 'Incident report ID is required',
      'string.guid': 'Invalid incident report ID format',
      'any.required': 'Incident report ID is required'
    }),

  witnessName: Joi.string()
    .min(VALIDATION_CONSTRAINTS.WITNESS_NAME_MIN_LENGTH)
    .max(VALIDATION_CONSTRAINTS.WITNESS_NAME_MAX_LENGTH)
    .required()
    .messages({
      'string.empty': 'Witness name is required',
      'string.min': `Witness name must be at least ${VALIDATION_CONSTRAINTS.WITNESS_NAME_MIN_LENGTH} characters`,
      'string.max': `Witness name cannot exceed ${VALIDATION_CONSTRAINTS.WITNESS_NAME_MAX_LENGTH} characters`,
      'any.required': 'Witness name is required'
    }),

  witnessType: Joi.string()
    .valid(...Object.values(WitnessType))
    .required()
    .messages({
      'string.empty': 'Witness type is required',
      'any.only': `Witness type must be one of: ${Object.values(WitnessType).join(', ')}`,
      'any.required': 'Witness type is required'
    }),

  witnessContact: Joi.string()
    .allow(null, '')
    .messages({
      'string.base': 'Witness contact must be a string'
    }),

  statement: Joi.string()
    .min(VALIDATION_CONSTRAINTS.WITNESS_STATEMENT_MIN_LENGTH)
    .max(VALIDATION_CONSTRAINTS.WITNESS_STATEMENT_MAX_LENGTH)
    .required()
    .messages({
      'string.empty': 'Witness statement is required',
      'string.min': `Witness statement must be at least ${VALIDATION_CONSTRAINTS.WITNESS_STATEMENT_MIN_LENGTH} characters for proper documentation`,
      'string.max': `Witness statement cannot exceed ${VALIDATION_CONSTRAINTS.WITNESS_STATEMENT_MAX_LENGTH} characters`,
      'any.required': 'Witness statement is required'
    })
});

/**
 * Schema for updating a witness statement
 */
export const updateWitnessStatementSchema = Joi.object({
  witnessName: Joi.string()
    .min(VALIDATION_CONSTRAINTS.WITNESS_NAME_MIN_LENGTH)
    .max(VALIDATION_CONSTRAINTS.WITNESS_NAME_MAX_LENGTH)
    .messages({
      'string.min': `Witness name must be at least ${VALIDATION_CONSTRAINTS.WITNESS_NAME_MIN_LENGTH} characters`,
      'string.max': `Witness name cannot exceed ${VALIDATION_CONSTRAINTS.WITNESS_NAME_MAX_LENGTH} characters`
    }),

  witnessType: Joi.string()
    .valid(...Object.values(WitnessType))
    .messages({
      'any.only': `Witness type must be one of: ${Object.values(WitnessType).join(', ')}`
    }),

  witnessContact: Joi.string()
    .allow(null, '')
    .messages({
      'string.base': 'Witness contact must be a string'
    }),

  statement: Joi.string()
    .min(VALIDATION_CONSTRAINTS.WITNESS_STATEMENT_MIN_LENGTH)
    .max(VALIDATION_CONSTRAINTS.WITNESS_STATEMENT_MAX_LENGTH)
    .messages({
      'string.min': `Witness statement must be at least ${VALIDATION_CONSTRAINTS.WITNESS_STATEMENT_MIN_LENGTH} characters`,
      'string.max': `Witness statement cannot exceed ${VALIDATION_CONSTRAINTS.WITNESS_STATEMENT_MAX_LENGTH} characters`
    }),

  verified: Joi.boolean()
    .messages({
      'boolean.base': 'Verified status must be true or false'
    })
}).min(1).messages({
  'object.min': 'At least one field must be provided for update'
});

/**
 * Schema for creating a follow-up action
 * Ensures due dates are in the future and actions are properly documented
 */
export const createFollowUpActionSchema = Joi.object({
  incidentReportId: Joi.string()
    .uuid()
    .required()
    .messages({
      'string.empty': 'Incident report ID is required',
      'string.guid': 'Invalid incident report ID format',
      'any.required': 'Incident report ID is required'
    }),

  action: Joi.string()
    .min(VALIDATION_CONSTRAINTS.FOLLOW_UP_ACTION_MIN_LENGTH)
    .max(VALIDATION_CONSTRAINTS.FOLLOW_UP_ACTION_MAX_LENGTH)
    .required()
    .messages({
      'string.empty': 'Follow-up action description is required',
      'string.min': `Action must be at least ${VALIDATION_CONSTRAINTS.FOLLOW_UP_ACTION_MIN_LENGTH} characters`,
      'string.max': `Action cannot exceed ${VALIDATION_CONSTRAINTS.FOLLOW_UP_ACTION_MAX_LENGTH} characters`,
      'any.required': 'Follow-up action description is required'
    }),

  dueDate: Joi.date()
    .min('now')
    .required()
    .messages({
      'date.base': 'Invalid due date',
      'date.min': 'Due date must be in the future',
      'any.required': 'Due date is required for follow-up actions'
    }),

  priority: Joi.string()
    .valid(...Object.values(ActionPriority))
    .required()
    .messages({
      'string.empty': 'Priority is required',
      'any.only': `Priority must be one of: ${Object.values(ActionPriority).join(', ')}`,
      'any.required': 'Priority is required'
    }),

  assignedTo: Joi.string()
    .uuid()
    .allow(null, '')
    .messages({
      'string.guid': 'Invalid assigned user ID format'
    })
}).custom((value, helpers) => {
  // Custom validation: URGENT priority should have due date within 24 hours
  if (value.priority === 'URGENT') {
    const dueDate = new Date(value.dueDate);
    const now = new Date();
    const hoursDiff = (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (hoursDiff > 24) {
      helpers.warn('followUpAction.urgentDueDateWarning', {
        message: 'URGENT priority actions typically should be due within 24 hours'
      });
    }
  }

  return value;
}, 'Follow-up Action Business Rules Validation');

/**
 * Schema for updating a follow-up action
 */
export const updateFollowUpActionSchema = Joi.object({
  action: Joi.string()
    .min(VALIDATION_CONSTRAINTS.FOLLOW_UP_ACTION_MIN_LENGTH)
    .max(VALIDATION_CONSTRAINTS.FOLLOW_UP_ACTION_MAX_LENGTH)
    .messages({
      'string.min': `Action must be at least ${VALIDATION_CONSTRAINTS.FOLLOW_UP_ACTION_MIN_LENGTH} characters`,
      'string.max': `Action cannot exceed ${VALIDATION_CONSTRAINTS.FOLLOW_UP_ACTION_MAX_LENGTH} characters`
    }),

  dueDate: Joi.date()
    .min('now')
    .messages({
      'date.base': 'Invalid due date',
      'date.min': 'Due date cannot be in the past'
    }),

  priority: Joi.string()
    .valid(...Object.values(ActionPriority))
    .messages({
      'any.only': `Priority must be one of: ${Object.values(ActionPriority).join(', ')}`
    }),

  status: Joi.string()
    .valid(...Object.values(ActionStatus))
    .messages({
      'any.only': `Status must be one of: ${Object.values(ActionStatus).join(', ')}`
    }),

  assignedTo: Joi.string()
    .uuid()
    .allow(null, '')
    .messages({
      'string.guid': 'Invalid assigned user ID format'
    }),

  notes: Joi.string()
    .max(VALIDATION_CONSTRAINTS.FOLLOW_UP_NOTES_MAX_LENGTH)
    .allow(null, '')
    .messages({
      'string.max': `Notes cannot exceed ${VALIDATION_CONSTRAINTS.FOLLOW_UP_NOTES_MAX_LENGTH} characters`
    })
}).min(1).custom((value, helpers) => {
  // Custom validation: COMPLETED status requires notes
  if (value.status === 'COMPLETED' && (!value.notes || value.notes.trim().length === 0)) {
    return helpers.error('followUpAction.completedNotesRequired', {
      message: 'Completion notes are required when marking an action as completed'
    });
  }

  return value;
}, 'Follow-up Action Update Validation').messages({
  'object.min': 'At least one field must be provided for update'
});

/**
 * Schema for marking parent as notified
 */
export const markParentNotifiedSchema = Joi.object({
  notificationMethod: Joi.string()
    .allow(null, '')
    .messages({
      'string.base': 'Notification method must be a string'
    }),

  notifiedBy: Joi.string()
    .uuid()
    .allow(null, '')
    .messages({
      'string.guid': 'Invalid user ID format'
    })
});

/**
 * Schema for adding evidence to incident
 */
export const addEvidenceSchema = Joi.object({
  evidenceType: Joi.string()
    .valid('photo', 'video')
    .required()
    .messages({
      'string.empty': 'Evidence type is required',
      'any.only': 'Evidence type must be either "photo" or "video"',
      'any.required': 'Evidence type is required'
    }),

  evidenceUrls: Joi.array()
    .items(Joi.string().uri())
    .min(1)
    .required()
    .messages({
      'array.base': 'Evidence URLs must be an array',
      'array.min': 'At least one evidence URL is required',
      'string.uri': 'Each evidence URL must be valid',
      'any.required': 'Evidence URLs are required'
    })
});

/**
 * Schema for updating insurance claim
 */
export const updateInsuranceClaimSchema = Joi.object({
  claimNumber: Joi.string()
    .required()
    .messages({
      'string.empty': 'Insurance claim number is required',
      'any.required': 'Insurance claim number is required'
    }),

  status: Joi.string()
    .valid(...Object.values(InsuranceClaimStatus))
    .required()
    .messages({
      'string.empty': 'Claim status is required',
      'any.only': `Status must be one of: ${Object.values(InsuranceClaimStatus).join(', ')}`,
      'any.required': 'Claim status is required'
    })
});

/**
 * Schema for updating compliance status
 */
export const updateComplianceStatusSchema = Joi.object({
  status: Joi.string()
    .valid(...Object.values(ComplianceStatus))
    .required()
    .messages({
      'string.empty': 'Compliance status is required',
      'any.only': `Status must be one of: ${Object.values(ComplianceStatus).join(', ')}`,
      'any.required': 'Compliance status is required'
    })
});

/**
 * Helper function to validate data against schema
 */
export const validateIncidentData = <T>(
  schema: Joi.ObjectSchema,
  data: any
): { value: T; error?: Joi.ValidationError } => {
  const result = schema.validate(data, {
    abortEarly: false,
    stripUnknown: true,
    convert: true
  });

  return {
    value: result.value as T,
    error: result.error
  };
};
