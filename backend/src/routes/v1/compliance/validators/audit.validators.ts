/**
 * Audit Log Validators
 * Validation schemas for comprehensive audit trail and security logging
 */

import Joi from 'joi';
import { paginationSchema } from '../../../shared/validators';

/**
 * Audit Log Query Schemas
 */

export const auditLogQuerySchema = Joi.object({
  ...paginationSchema.describe('Pagination parameters').extract(['page', 'limit']),
  userId: Joi.string().uuid().optional().description('Filter by user ID'),
  entityType: Joi.string().trim().optional().description('Filter by entity type (e.g., STUDENT, HEALTH_RECORD, MEDICATION)'),
  action: Joi.string()
    .valid('CREATE', 'READ', 'VIEW', 'ACCESS', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'EXPORT', 'IMPORT', 'BACKUP', 'RESTORE', 'SECURITY_EVENT')
    .optional()
    .description('Filter by action type'),
  startDate: Joi.date().iso().optional().description('Filter by start date'),
  endDate: Joi.date().iso().optional().description('Filter by end date'),
  ipAddress: Joi.string().ip().optional().description('Filter by IP address')
});

export const createAuditLogSchema = Joi.object({
  userId: Joi.string().uuid().optional().description('User ID (null for system actions)'),
  action: Joi.string()
    .valid('CREATE', 'READ', 'VIEW', 'ACCESS', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'EXPORT', 'IMPORT', 'BACKUP', 'RESTORE', 'SECURITY_EVENT')
    .required()
    .description('Action type'),
  entityType: Joi.string().trim().required().description('Entity type being acted upon'),
  entityId: Joi.string().trim().optional().description('Entity ID if applicable'),
  changes: Joi.object().optional().description('Details of changes or action metadata'),
  ipAddress: Joi.string().ip().optional().description('IP address of request'),
  userAgent: Joi.string().trim().max(500).optional().description('Browser user agent')
});

/**
 * PHI Access Log Schemas
 */

export const phiAccessQuerySchema = Joi.object({
  ...paginationSchema.describe('Pagination parameters').extract(['page', 'limit']),
  userId: Joi.string().uuid().optional().description('Filter by user ID'),
  studentId: Joi.string().uuid().optional().description('Filter by student ID'),
  accessType: Joi.string()
    .valid('VIEW', 'EDIT', 'EXPORT', 'PRINT', 'DELETE')
    .optional()
    .description('Filter by access type'),
  dataCategory: Joi.string()
    .valid('HEALTH_RECORD', 'MEDICATION', 'ALLERGY', 'CHRONIC_CONDITION', 'VACCINATION', 'MENTAL_HEALTH', 'EMERGENCY_CONTACT', 'FULL_PROFILE')
    .optional()
    .description('Filter by data category'),
  startDate: Joi.date().iso().optional().description('Filter by start date'),
  endDate: Joi.date().iso().optional().description('Filter by end date')
});

export const logPhiAccessSchema = Joi.object({
  userId: Joi.string().uuid().required().description('User accessing PHI'),
  studentId: Joi.string().uuid().required().description('Student whose PHI is being accessed'),
  accessType: Joi.string()
    .valid('VIEW', 'EDIT', 'EXPORT', 'PRINT', 'DELETE')
    .required()
    .description('Type of access'),
  dataCategory: Joi.string()
    .valid('HEALTH_RECORD', 'MEDICATION', 'ALLERGY', 'CHRONIC_CONDITION', 'VACCINATION', 'MENTAL_HEALTH', 'EMERGENCY_CONTACT', 'FULL_PROFILE')
    .required()
    .description('Category of PHI data'),
  entityType: Joi.string().trim().required().description('Specific entity type'),
  entityId: Joi.string().trim().optional().description('Specific entity ID'),
  success: Joi.boolean().optional().default(true).description('Whether access was successful'),
  errorMessage: Joi.string().trim().max(1000).optional().description('Error message if access failed')
});

/**
 * Audit Statistics Schemas
 */

export const auditStatisticsQuerySchema = Joi.object({
  startDate: Joi.date().iso().required().description('Statistics start date'),
  endDate: Joi.date().iso().required().description('Statistics end date'),
  groupBy: Joi.string()
    .valid('action', 'entityType', 'user', 'hour', 'day')
    .optional()
    .default('action')
    .description('Group statistics by field')
});

/**
 * User Activity Schemas
 */

export const userActivityQuerySchema = Joi.object({
  ...paginationSchema.describe('Pagination parameters').extract(['page', 'limit']),
  startDate: Joi.date().iso().optional().description('Filter by start date'),
  endDate: Joi.date().iso().optional().description('Filter by end date'),
  action: Joi.string().optional().description('Filter by action type')
});

/**
 * Export Schema
 */

export const exportAuditLogsSchema = Joi.object({
  startDate: Joi.date().iso().required().description('Export start date'),
  endDate: Joi.date().iso().required().description('Export end date'),
  format: Joi.string().valid('JSON', 'CSV', 'PDF').optional().default('CSV').description('Export format'),
  userId: Joi.string().uuid().optional().description('Filter by user ID'),
  entityType: Joi.string().trim().optional().description('Filter by entity type'),
  action: Joi.string().optional().description('Filter by action type')
});

/**
 * Security Analysis Schemas
 */

export const securityAnalysisQuerySchema = Joi.object({
  startDate: Joi.date().iso().required().description('Analysis start date'),
  endDate: Joi.date().iso().required().description('Analysis end date'),
  analysisType: Joi.string()
    .valid('SUSPICIOUS_LOGINS', 'UNUSUAL_PHI_ACCESS', 'AFTER_HOURS_ACCESS', 'DATA_EXFILTRATION', 'COMPREHENSIVE')
    .optional()
    .default('COMPREHENSIVE')
    .description('Type of security analysis to perform')
});

/**
 * Archive Schemas
 */

export const archiveLogsSchema = Joi.object({
  olderThanDays: Joi.number().integer().min(90).max(3650).required()
    .description('Archive logs older than X days (minimum 90 days for compliance)'),
  entityTypes: Joi.array().items(Joi.string().trim()).optional()
    .description('Only archive specific entity types (optional)'),
  dryRun: Joi.boolean().optional().default(false)
    .description('Simulate archive without deleting (for testing)')
});

/**
 * Parameter Schemas
 */

export const auditLogIdParamSchema = Joi.object({
  id: Joi.string().uuid().required().description('Audit log ID')
});

export const userIdParamSchema = Joi.object({
  userId: Joi.string().uuid().required().description('User ID')
});

export const sessionIdParamSchema = Joi.object({
  sessionId: Joi.string().trim().required().description('Session ID')
});

export const resourceParamSchema = Joi.object({
  resourceType: Joi.string().trim().required().description('Resource type'),
  resourceId: Joi.string().trim().required().description('Resource ID')
});
