import { z } from 'zod';

/**
 * Audit Log Schemas
 * Validation schemas for HIPAA-compliant audit logging
 */

// Audit Log Action Types
export const AuditActionType = z.enum([
  // Authentication actions
  'LOGIN',
  'LOGOUT',
  'LOGIN_FAILED',
  'PASSWORD_CHANGE',
  'PASSWORD_RESET',
  'SESSION_EXPIRED',
  'MFA_ENABLED',
  'MFA_DISABLED',

  // PHI Access actions
  'PHI_VIEW',
  'PHI_CREATE',
  'PHI_UPDATE',
  'PHI_DELETE',
  'PHI_EXPORT',
  'PHI_PRINT',
  'PHI_SEARCH',
  'PHI_BULK_ACCESS',

  // Record management
  'RECORD_CREATE',
  'RECORD_UPDATE',
  'RECORD_DELETE',
  'RECORD_VIEW',
  'RECORD_ARCHIVE',
  'RECORD_RESTORE',

  // System actions
  'PERMISSION_CHANGE',
  'ROLE_CHANGE',
  'SETTING_CHANGE',
  'POLICY_ACKNOWLEDGMENT',
  'SECURITY_ALERT',
  'DATA_BREACH',
  'UNAUTHORIZED_ACCESS',

  // Document actions
  'DOCUMENT_UPLOAD',
  'DOCUMENT_DOWNLOAD',
  'DOCUMENT_SHARE',
  'DOCUMENT_DELETE',

  // Medication actions
  'MEDICATION_ADMINISTERED',
  'MEDICATION_PRESCRIBED',
  'MEDICATION_DISCONTINUED',

  // Emergency actions
  'EMERGENCY_ACCESS',
  'EMERGENCY_OVERRIDE',
  'BREAK_GLASS',
]);

export type AuditActionTypeEnum = z.infer<typeof AuditActionType>;

// Audit Log Severity
export const AuditSeverity = z.enum([
  'INFO',
  'WARNING',
  'ERROR',
  'CRITICAL',
  'SECURITY',
]);

export type AuditSeverityEnum = z.infer<typeof AuditSeverity>;

// Audit Log Resource Type
export const ResourceType = z.enum([
  'USER',
  'STUDENT',
  'HEALTH_RECORD',
  'MEDICATION',
  'APPOINTMENT',
  'DOCUMENT',
  'INCIDENT',
  'EMERGENCY_CONTACT',
  'IMMUNIZATION',
  'ALLERGY',
  'CONDITION',
  'POLICY',
  'SYSTEM',
]);

export type ResourceTypeEnum = z.infer<typeof ResourceType>;

// Audit Log Schema
export const AuditLogSchema = z.object({
  id: z.string().uuid(),
  timestamp: z.string().datetime(),
  action: AuditActionType,
  severity: AuditSeverity,
  userId: z.string().uuid(),
  userName: z.string(),
  userRole: z.string(),
  resourceType: ResourceType.optional(),
  resourceId: z.string().optional(),
  resourceName: z.string().optional(),
  ipAddress: z.string(),
  userAgent: z.string(),
  sessionId: z.string(),
  details: z.record(z.string(), z.any()).optional(),
  changes: z.object({
    before: z.record(z.string(), z.any()).optional(),
    after: z.record(z.string(), z.any()).optional(),
  }).optional(),
  status: z.enum(['SUCCESS', 'FAILURE', 'PARTIAL']),
  errorMessage: z.string().optional(),
  phiAccessed: z.boolean(),
  complianceFlags: z.array(z.string()).optional(),
  verificationHash: z.string(), // Cryptographic hash for tamper detection
  previousHash: z.string().optional(), // Hash of previous log entry (blockchain-style)
});

export type AuditLog = z.infer<typeof AuditLogSchema>;

// Audit Log Filter Schema
export const AuditLogFilterSchema = z.object({
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  actions: z.array(AuditActionType).optional(),
  severities: z.array(AuditSeverity).optional(),
  userIds: z.array(z.string().uuid()).optional(),
  resourceTypes: z.array(ResourceType).optional(),
  resourceIds: z.array(z.string()).optional(),
  phiAccessOnly: z.boolean().optional(),
  ipAddresses: z.array(z.string()).optional(),
  searchTerm: z.string().optional(),
  page: z.number().int().positive().default(1),
  pageSize: z.number().int().positive().max(100).default(20),
  sortBy: z.enum(['timestamp', 'action', 'severity', 'userId', 'resourceType']).default('timestamp'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type AuditLogFilter = z.infer<typeof AuditLogFilterSchema>;

// Audit Log Export Schema
export const AuditLogExportSchema = z.object({
  format: z.enum(['PDF', 'CSV', 'JSON', 'XLSX']),
  filters: AuditLogFilterSchema,
  includeDetails: z.boolean().default(true),
  includeChanges: z.boolean().default(true),
  encryptOutput: z.boolean().default(true),
  password: z.string().min(8).optional(),
});

export type AuditLogExport = z.infer<typeof AuditLogExportSchema>;
