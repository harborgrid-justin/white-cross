/**
 * Incident Validation Schemas
 *
 * Validation schemas for incident reporting and management.
 * Contains PHI when health-related incidents involve students.
 */

import { z } from 'zod';
import { dateTimeSchema, optionalDateTimeSchema } from '../common/date.schemas';

/**
 * Incident types
 */
export const INCIDENT_TYPES = [
  'injury',
  'illness',
  'behavioral',
  'accident',
  'safety',
  'medical-emergency',
  'allergic-reaction',
  'medication-error',
  'fall',
  'altercation',
  'other'
] as const;

/**
 * Incident severity levels
 */
export const INCIDENT_SEVERITY = ['low', 'medium', 'high', 'critical'] as const;

/**
 * Incident status
 */
export const INCIDENT_STATUS = [
  'reported',
  'investigating',
  'resolved',
  'closed',
  'requires-follow-up'
] as const;

/**
 * Create incident report schema
 * PHI when involves student health information
 */
export const createIncidentSchema = z.object({
  studentId: z
    .string({ required_error: 'Student is required' })
    .uuid('Invalid student ID'),

  type: z.enum(INCIDENT_TYPES, {
    required_error: 'Incident type is required',
    invalid_type_error: 'Invalid incident type'
  }),

  severity: z.enum(INCIDENT_SEVERITY, {
    required_error: 'Severity is required',
    invalid_type_error: 'Invalid severity level'
  }),

  occurredAt: dateTimeSchema,

  location: z
    .string({ required_error: 'Location is required' })
    .min(1, 'Location is required')
    .max(200, 'Location must be less than 200 characters')
    .trim(),

  description: z
    .string({ required_error: 'Description is required' })
    .min(10, 'Description must be at least 10 characters')
    .max(5000, 'Description must be less than 5000 characters')
    .trim(),

  actionsTaken: z
    .string()
    .max(5000, 'Actions taken must be less than 5000 characters')
    .optional()
    .nullable(),

  injuriesReported: z
    .string()
    .max(2000, 'Injuries must be less than 2000 characters')
    .optional()
    .nullable(),

  witnessNames: z
    .string()
    .max(500, 'Witness names must be less than 500 characters')
    .optional()
    .nullable(),

  followUpRequired: z.boolean().default(false),

  followUpNotes: z
    .string()
    .max(2000, 'Follow-up notes must be less than 2000 characters')
    .optional()
    .nullable(),

  parentNotified: z.boolean().default(false),

  parentNotificationMethod: z
    .enum(['phone', 'email', 'in-person', 'letter', 'other'])
    .optional()
    .nullable(),

  parentNotificationTime: optionalDateTimeSchema,

  emergencyServicesContacted: z.boolean().default(false),

  emergencyServicesDetails: z
    .string()
    .max(1000, 'Emergency services details must be less than 1000 characters')
    .optional()
    .nullable(),

  status: z.enum(INCIDENT_STATUS).default('reported'),

  notes: z
    .string()
    .max(2000, 'Notes must be less than 2000 characters')
    .optional()
    .nullable()
});

/**
 * Update incident schema
 */
export const updateIncidentSchema = createIncidentSchema
  .partial()
  .extend({
    id: z.string().uuid('Invalid incident ID')
  });

/**
 * Witness statement schema
 */
export const witnessStatementSchema = z.object({
  incidentId: z
    .string({ required_error: 'Incident is required' })
    .uuid('Invalid incident ID'),

  witnessName: z
    .string({ required_error: 'Witness name is required' })
    .min(1, 'Witness name is required')
    .max(200, 'Witness name must be less than 200 characters')
    .trim(),

  witnessRole: z
    .string()
    .max(100, 'Witness role must be less than 100 characters')
    .optional()
    .nullable(),

  witnessContact: z
    .string()
    .max(200, 'Contact information must be less than 200 characters')
    .optional()
    .nullable(),

  statementDate: dateTimeSchema,

  statement: z
    .string({ required_error: 'Statement is required' })
    .min(10, 'Statement must be at least 10 characters')
    .max(5000, 'Statement must be less than 5000 characters')
    .trim(),

  notes: z
    .string()
    .max(1000, 'Notes must be less than 1000 characters')
    .optional()
    .nullable()
});

/**
 * Follow-up action schema
 */
export const followUpActionSchema = z.object({
  incidentId: z
    .string({ required_error: 'Incident is required' })
    .uuid('Invalid incident ID'),

  actionType: z
    .enum([
      'parent-meeting',
      'medical-referral',
      'counseling',
      'discipline',
      'safety-improvement',
      'policy-review',
      'training',
      'other'
    ], {
      required_error: 'Action type is required'
    }),

  description: z
    .string({ required_error: 'Description is required' })
    .min(10, 'Description must be at least 10 characters')
    .max(2000, 'Description must be less than 2000 characters')
    .trim(),

  assignedTo: z
    .string()
    .max(200, 'Assigned to must be less than 200 characters')
    .optional()
    .nullable(),

  dueDate: optionalDateTimeSchema,

  completedDate: optionalDateTimeSchema,

  status: z
    .enum(['pending', 'in-progress', 'completed', 'cancelled'])
    .default('pending'),

  notes: z
    .string()
    .max(1000, 'Notes must be less than 1000 characters')
    .optional()
    .nullable()
});

/**
 * Incident search/filter schema
 */
export const incidentSearchSchema = z.object({
  search: z.string().max(200).optional(),

  studentId: z.string().uuid().optional(),

  type: z.enum(INCIDENT_TYPES).optional(),

  severity: z.enum(INCIDENT_SEVERITY).optional(),

  status: z.enum(INCIDENT_STATUS).optional(),

  startDate: optionalDateTimeSchema,

  endDate: optionalDateTimeSchema,

  location: z.string().max(200).optional(),

  // Pagination
  page: z.number().int().min(1).default(1),

  limit: z.number().int().min(1).max(100).default(20),

  // Sorting
  sortBy: z.enum(['occurredAt', 'severity', 'status']).optional(),

  sortOrder: z.enum(['asc', 'desc']).default('desc')
});

/**
 * PHI field markers (conditional - when health-related)
 */
export const INCIDENT_PHI_FIELDS = [
  'description',
  'injuriesReported',
  'actionsTaken',
  'followUpNotes'
] as const;

/**
 * Type exports
 */
export type CreateIncident = z.infer<typeof createIncidentSchema>;
export type UpdateIncident = z.infer<typeof updateIncidentSchema>;
export type WitnessStatement = z.infer<typeof witnessStatementSchema>;
export type FollowUpAction = z.infer<typeof followUpActionSchema>;
export type IncidentSearch = z.infer<typeof incidentSearchSchema>;
export type IncidentType = typeof INCIDENT_TYPES[number];
export type IncidentSeverity = typeof INCIDENT_SEVERITY[number];
export type IncidentStatus = typeof INCIDENT_STATUS[number];
