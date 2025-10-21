/**
 * Incident Reports Validators
 * Validation schemas for comprehensive incident management
 */

import Joi from 'joi';
import { paginationSchema } from '../../../shared/validators';

/**
 * Incident Type Enum
 */
const incidentTypes = [
  'INJURY',
  'ILLNESS',
  'BEHAVIORAL',
  'MEDICATION_ERROR',
  'ALLERGIC_REACTION',
  'EMERGENCY',
  'OTHER'
];

/**
 * Incident Severity Enum
 */
const incidentSeverities = [
  'MINOR',
  'MODERATE',
  'SERIOUS',
  'CRITICAL',
  'LIFE_THREATENING'
];

/**
 * Incident Status Enum
 */
const incidentStatuses = [
  'REPORTED',
  'UNDER_REVIEW',
  'FOLLOW_UP_REQUIRED',
  'RESOLVED',
  'ARCHIVED'
];

/**
 * Witness Type Enum
 */
const witnessTypes = [
  'STUDENT',
  'STAFF',
  'PARENT',
  'OTHER'
];

/**
 * Action Priority Enum
 */
const actionPriorities = [
  'LOW',
  'MEDIUM',
  'HIGH',
  'URGENT'
];

/**
 * Action Status Enum
 */
const actionStatuses = [
  'PENDING',
  'IN_PROGRESS',
  'COMPLETED',
  'CANCELLED'
];

/**
 * Insurance Claim Status Enum
 */
const insuranceClaimStatuses = [
  'NOT_FILED',
  'FILED',
  'PENDING',
  'APPROVED',
  'DENIED',
  'CLOSED'
];

/**
 * Compliance Status Enum
 */
const complianceStatuses = [
  'PENDING',
  'COMPLIANT',
  'NON_COMPLIANT',
  'UNDER_REVIEW'
];

/**
 * Notification Methods
 */
const notificationMethods = [
  'EMAIL',
  'SMS',
  'PHONE',
  'IN_PERSON',
  'LETTER'
];

/**
 * Parameter Schemas
 */

export const incidentIdParamSchema = Joi.object({
  id: Joi.string().uuid().required().description('Incident report ID')
});

export const witnessIdParamSchema = Joi.object({
  witnessId: Joi.string().uuid().required().description('Witness statement ID')
});

export const followUpIdParamSchema = Joi.object({
  followUpId: Joi.string().uuid().required().description('Follow-up action ID')
});

export const studentIdParamSchema = Joi.object({
  studentId: Joi.string().uuid().required().description('Student ID')
});

/**
 * Query Schemas
 */

export const listIncidentsQuerySchema = Joi.object({
  ...paginationSchema.describe('Pagination parameters').extract(['page', 'limit']),
  studentId: Joi.string().uuid().optional().description('Filter by student ID'),
  reportedById: Joi.string().uuid().optional().description('Filter by reporter ID'),
  type: Joi.string().valid(...incidentTypes).optional().description('Filter by incident type'),
  severity: Joi.string().valid(...incidentSeverities).optional().description('Filter by severity level'),
  status: Joi.string().valid(...incidentStatuses).optional().description('Filter by incident status'),
  dateFrom: Joi.date().iso().optional().description('Filter by start date (ISO 8601)'),
  dateTo: Joi.date().iso().optional().description('Filter by end date (ISO 8601)'),
  parentNotified: Joi.boolean().optional().description('Filter by parent notification status'),
  followUpRequired: Joi.boolean().optional().description('Filter by follow-up requirement'),
  location: Joi.string().trim().optional().description('Filter by incident location')
});

export const searchIncidentsQuerySchema = Joi.object({
  ...paginationSchema.describe('Pagination parameters').extract(['page', 'limit']),
  query: Joi.string().trim().min(2).max(200).required().description('Search query string')
});

export const statisticsQuerySchema = Joi.object({
  dateFrom: Joi.date().iso().optional().description('Statistics start date'),
  dateTo: Joi.date().iso().optional().description('Statistics end date'),
  studentId: Joi.string().uuid().optional().description('Filter statistics by student'),
  groupBy: Joi.string().valid('type', 'severity', 'location', 'date').optional().description('Group statistics by field')
});

/**
 * Incident CRUD Schemas
 */

export const createIncidentSchema = Joi.object({
  studentId: Joi.string().uuid().required().description('Student involved in incident'),
  type: Joi.string().valid(...incidentTypes).required().description('Incident type'),
  severity: Joi.string().valid(...incidentSeverities).required().description('Incident severity level'),
  status: Joi.string().valid(...incidentStatuses).optional().default('REPORTED').description('Incident status'),
  description: Joi.string().trim().min(10).max(5000).required().description('Detailed incident description'),
  location: Joi.string().trim().min(2).max(200).required().description('Location where incident occurred'),
  actionsTaken: Joi.string().trim().min(5).max(5000).required().description('Immediate actions taken'),
  occurredAt: Joi.date().iso().max('now').required().description('When the incident occurred'),
  witnesses: Joi.array().items(Joi.string().trim()).optional().description('List of witness names'),
  parentNotified: Joi.boolean().optional().default(false).description('Parent notification status'),
  parentNotificationMethod: Joi.string().valid(...notificationMethods).optional().description('Method used to notify parent'),
  followUpRequired: Joi.boolean().optional().default(false).description('Whether follow-up is required'),
  followUpNotes: Joi.string().trim().max(2000).optional().description('Follow-up notes'),
  attachments: Joi.array().items(Joi.string().uri()).optional().description('Attachment URLs'),
  evidencePhotos: Joi.array().items(Joi.string().uri()).optional().description('Photo evidence URLs'),
  evidenceVideos: Joi.array().items(Joi.string().uri()).optional().description('Video evidence URLs'),
  insuranceClaimNumber: Joi.string().trim().max(100).optional().description('Insurance claim number'),
  insuranceClaimStatus: Joi.string().valid(...insuranceClaimStatuses).optional().description('Insurance claim status'),
  legalComplianceStatus: Joi.string().valid(...complianceStatuses).optional().description('Legal compliance status')
});

export const updateIncidentSchema = Joi.object({
  type: Joi.string().valid(...incidentTypes).optional().description('Incident type'),
  severity: Joi.string().valid(...incidentSeverities).optional().description('Incident severity level'),
  status: Joi.string().valid(...incidentStatuses).optional().description('Incident status'),
  description: Joi.string().trim().min(10).max(5000).optional().description('Detailed incident description'),
  location: Joi.string().trim().min(2).max(200).optional().description('Location where incident occurred'),
  actionsTaken: Joi.string().trim().min(5).max(5000).optional().description('Immediate actions taken'),
  occurredAt: Joi.date().iso().max('now').optional().description('When the incident occurred'),
  witnesses: Joi.array().items(Joi.string().trim()).optional().description('List of witness names'),
  parentNotified: Joi.boolean().optional().description('Parent notification status'),
  parentNotificationMethod: Joi.string().valid(...notificationMethods).optional().description('Method used to notify parent'),
  followUpRequired: Joi.boolean().optional().description('Whether follow-up is required'),
  followUpNotes: Joi.string().trim().max(2000).optional().description('Follow-up notes'),
  attachments: Joi.array().items(Joi.string().uri()).optional().description('Attachment URLs'),
  evidencePhotos: Joi.array().items(Joi.string().uri()).optional().description('Photo evidence URLs'),
  evidenceVideos: Joi.array().items(Joi.string().uri()).optional().description('Video evidence URLs'),
  insuranceClaimNumber: Joi.string().trim().max(100).optional().description('Insurance claim number'),
  insuranceClaimStatus: Joi.string().valid(...insuranceClaimStatuses).optional().description('Insurance claim status'),
  legalComplianceStatus: Joi.string().valid(...complianceStatuses).optional().description('Legal compliance status')
}).min(1);

/**
 * Evidence Management Schemas
 */

export const addEvidenceSchema = Joi.object({
  evidenceType: Joi.string().valid('photo', 'video', 'attachment').required().description('Type of evidence'),
  evidenceUrls: Joi.array().items(Joi.string().uri()).min(1).max(20).required().description('Evidence file URLs'),
  description: Joi.string().trim().max(500).optional().description('Evidence description')
});

export const removeEvidenceSchema = Joi.object({
  evidenceType: Joi.string().valid('photo', 'video', 'attachment').required().description('Type of evidence'),
  evidenceUrl: Joi.string().uri().required().description('Evidence file URL to remove')
});

/**
 * Witness Statement Schemas
 */

export const createWitnessStatementSchema = Joi.object({
  witnessName: Joi.string().trim().min(2).max(200).required().description('Witness full name'),
  witnessType: Joi.string().valid(...witnessTypes).required().description('Type of witness'),
  witnessContact: Joi.string().trim().max(200).optional().description('Witness contact information'),
  statement: Joi.string().trim().min(10).max(5000).required().description('Witness statement'),
  statementDate: Joi.date().iso().max('now').optional().description('When statement was given')
});

export const updateWitnessStatementSchema = Joi.object({
  witnessName: Joi.string().trim().min(2).max(200).optional().description('Witness full name'),
  witnessType: Joi.string().valid(...witnessTypes).optional().description('Type of witness'),
  witnessContact: Joi.string().trim().max(200).optional().description('Witness contact information'),
  statement: Joi.string().trim().min(10).max(5000).optional().description('Witness statement'),
  verified: Joi.boolean().optional().description('Statement verification status'),
  verifiedBy: Joi.string().trim().optional().description('Who verified the statement'),
  verifiedAt: Joi.date().iso().optional().description('When statement was verified')
}).min(1);

/**
 * Follow-Up Action Schemas
 */

export const createFollowUpActionSchema = Joi.object({
  action: Joi.string().trim().min(5).max(500).required().description('Follow-up action description'),
  dueDate: Joi.date().iso().min('now').required().description('Action due date'),
  priority: Joi.string().valid(...actionPriorities).required().description('Action priority level'),
  assignedTo: Joi.string().uuid().optional().description('User ID assigned to action'),
  notes: Joi.string().trim().max(2000).optional().description('Additional action notes')
});

export const updateFollowUpActionSchema = Joi.object({
  action: Joi.string().trim().min(5).max(500).optional().description('Follow-up action description'),
  dueDate: Joi.date().iso().min('now').optional().description('Action due date'),
  priority: Joi.string().valid(...actionPriorities).optional().description('Action priority level'),
  status: Joi.string().valid(...actionStatuses).optional().description('Action status'),
  assignedTo: Joi.string().uuid().optional().description('User ID assigned to action'),
  notes: Joi.string().trim().max(2000).optional().description('Additional action notes'),
  completedBy: Joi.string().trim().optional().description('Who completed the action'),
  completedAt: Joi.date().iso().optional().description('When action was completed')
}).min(1);

/**
 * Notification Schemas
 */

export const notifyParentSchema = Joi.object({
  method: Joi.string().valid(...notificationMethods).required().description('Notification method'),
  recipientName: Joi.string().trim().optional().description('Recipient name'),
  recipientContact: Joi.string().trim().optional().description('Recipient contact'),
  customMessage: Joi.string().trim().max(2000).optional().description('Custom notification message')
});

export const markParentNotifiedSchema = Joi.object({
  notificationMethod: Joi.string().valid(...notificationMethods).required().description('How parent was notified'),
  notifiedBy: Joi.string().trim().required().description('Who notified the parent'),
  notifiedAt: Joi.date().iso().optional().default('now').description('When parent was notified'),
  notes: Joi.string().trim().max(500).optional().description('Notification notes')
});

/**
 * Insurance & Compliance Schemas
 */

export const updateInsuranceClaimSchema = Joi.object({
  claimNumber: Joi.string().trim().min(3).max(100).required().description('Insurance claim number'),
  claimStatus: Joi.string().valid(...insuranceClaimStatuses).required().description('Claim status'),
  claimAmount: Joi.number().positive().optional().description('Claim amount'),
  claimNotes: Joi.string().trim().max(2000).optional().description('Claim notes')
});

export const updateComplianceStatusSchema = Joi.object({
  status: Joi.string().valid(...complianceStatuses).required().description('Compliance status'),
  reviewedBy: Joi.string().trim().optional().description('Who reviewed compliance'),
  reviewNotes: Joi.string().trim().max(2000).optional().description('Compliance review notes')
});
