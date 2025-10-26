import { z } from 'zod';

/**
 * HIPAA Compliance Schemas
 * Validation schemas for audit logs, policies, and compliance reporting
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
  ipAddress: z.string().ip(),
  userAgent: z.string(),
  sessionId: z.string(),
  details: z.record(z.any()).optional(),
  changes: z.object({
    before: z.record(z.any()).optional(),
    after: z.record(z.any()).optional(),
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
  ipAddresses: z.array(z.string().ip()).optional(),
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

// Compliance Violation Schema
export const ComplianceViolationSchema = z.object({
  id: z.string().uuid(),
  timestamp: z.string().datetime(),
  violationType: z.enum([
    'UNAUTHORIZED_ACCESS',
    'EXCESSIVE_ACCESS',
    'POLICY_VIOLATION',
    'DATA_BREACH',
    'IMPROPER_DISPOSAL',
    'MISSING_ENCRYPTION',
    'WEAK_AUTHENTICATION',
    'MISSING_AUDIT_LOG',
    'RETENTION_VIOLATION',
    'DISCLOSURE_VIOLATION',
  ]),
  severity: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  userId: z.string().uuid().optional(),
  userName: z.string().optional(),
  description: z.string(),
  affectedRecords: z.array(z.object({
    resourceType: ResourceType,
    resourceId: z.string(),
    resourceName: z.string().optional(),
  })),
  detectedBy: z.enum(['AUTOMATED', 'MANUAL', 'EXTERNAL']),
  status: z.enum(['OPEN', 'INVESTIGATING', 'RESOLVED', 'FALSE_POSITIVE']),
  assignedTo: z.string().uuid().optional(),
  resolution: z.string().optional(),
  resolvedAt: z.string().datetime().optional(),
  remediationSteps: z.array(z.string()).optional(),
  notificationsSent: z.array(z.object({
    recipient: z.string(),
    timestamp: z.string().datetime(),
    method: z.enum(['EMAIL', 'SMS', 'PUSH', 'IN_APP']),
  })).optional(),
});

export type ComplianceViolation = z.infer<typeof ComplianceViolationSchema>;

// Compliance Alert Schema
export const ComplianceAlertSchema = z.object({
  id: z.string().uuid(),
  timestamp: z.string().datetime(),
  alertType: z.enum([
    'SUSPICIOUS_ACTIVITY',
    'POLICY_EXPIRING',
    'TRAINING_OVERDUE',
    'EXCESSIVE_LOGIN_FAILURES',
    'UNUSUAL_ACCESS_PATTERN',
    'BULK_DATA_ACCESS',
    'OFF_HOURS_ACCESS',
    'MULTIPLE_LOCATION_ACCESS',
    'FAILED_ENCRYPTION',
    'BACKUP_FAILURE',
  ]),
  severity: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  title: z.string(),
  description: z.string(),
  userId: z.string().uuid().optional(),
  resourceType: ResourceType.optional(),
  resourceId: z.string().optional(),
  status: z.enum(['NEW', 'ACKNOWLEDGED', 'INVESTIGATING', 'RESOLVED', 'DISMISSED']),
  acknowledgedBy: z.string().uuid().optional(),
  acknowledgedAt: z.string().datetime().optional(),
  resolvedBy: z.string().uuid().optional(),
  resolvedAt: z.string().datetime().optional(),
  autoResolve: z.boolean().default(false),
  autoResolveAt: z.string().datetime().optional(),
});

export type ComplianceAlert = z.infer<typeof ComplianceAlertSchema>;

// Compliance Metrics Schema
export const ComplianceMetricsSchema = z.object({
  period: z.object({
    start: z.string().datetime(),
    end: z.string().datetime(),
  }),
  auditLogs: z.object({
    total: z.number().int().nonnegative(),
    byAction: z.record(AuditActionType, z.number().int().nonnegative()),
    bySeverity: z.record(AuditSeverity, z.number().int().nonnegative()),
    phiAccessCount: z.number().int().nonnegative(),
    failedActions: z.number().int().nonnegative(),
  }),
  violations: z.object({
    total: z.number().int().nonnegative(),
    open: z.number().int().nonnegative(),
    resolved: z.number().int().nonnegative(),
    bySeverity: z.record(z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']), z.number().int().nonnegative()),
  }),
  alerts: z.object({
    total: z.number().int().nonnegative(),
    active: z.number().int().nonnegative(),
    resolved: z.number().int().nonnegative(),
    bySeverity: z.record(z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']), z.number().int().nonnegative()),
  }),
  policies: z.object({
    total: z.number().int().nonnegative(),
    active: z.number().int().nonnegative(),
    acknowledged: z.number().int().nonnegative(),
    pending: z.number().int().nonnegative(),
    acknowledgmentRate: z.number().min(0).max(100),
  }),
  training: z.object({
    totalUsers: z.number().int().nonnegative(),
    completed: z.number().int().nonnegative(),
    overdue: z.number().int().nonnegative(),
    completionRate: z.number().min(0).max(100),
  }),
  dataRetention: z.object({
    recordsTotal: z.number().int().nonnegative(),
    recordsEligibleForArchival: z.number().int().nonnegative(),
    recordsEligibleForDeletion: z.number().int().nonnegative(),
    storageUsed: z.string(), // Human-readable (e.g., "150 GB")
  }),
  riskScore: z.number().min(0).max(100),
  complianceScore: z.number().min(0).max(100),
});

export type ComplianceMetrics = z.infer<typeof ComplianceMetricsSchema>;

// Data Retention Policy Schema
export const DataRetentionPolicySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(200),
  description: z.string(),
  resourceType: ResourceType,
  retentionPeriod: z.object({
    value: z.number().int().positive(),
    unit: z.enum(['DAYS', 'MONTHS', 'YEARS']),
  }),
  archiveAfter: z.object({
    value: z.number().int().positive(),
    unit: z.enum(['DAYS', 'MONTHS', 'YEARS']),
  }).optional(),
  deleteAfter: z.object({
    value: z.number().int().positive(),
    unit: z.enum(['DAYS', 'MONTHS', 'YEARS']),
  }),
  legalHold: z.boolean().default(false),
  exceptions: z.array(z.object({
    condition: z.string(),
    extendedRetention: z.object({
      value: z.number().int().positive(),
      unit: z.enum(['DAYS', 'MONTHS', 'YEARS']),
    }),
  })).optional(),
  automatedProcessing: z.boolean().default(true),
  notifyBefore: z.object({
    value: z.number().int().positive(),
    unit: z.enum(['DAYS', 'WEEKS', 'MONTHS']),
  }).optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'DRAFT']),
  createdBy: z.string().uuid(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type DataRetentionPolicy = z.infer<typeof DataRetentionPolicySchema>;

// HIPAA Report Schema
export const HIPAAReportSchema = z.object({
  id: z.string().uuid(),
  reportType: z.enum([
    'SECURITY_RISK_ASSESSMENT',
    'BREACH_NOTIFICATION',
    'AUDIT_TRAIL',
    'ACCESS_CONTROL',
    'DATA_INTEGRITY',
    'TRAINING_COMPLIANCE',
    'INCIDENT_RESPONSE',
    'BUSINESS_ASSOCIATE',
  ]),
  period: z.object({
    start: z.string().datetime(),
    end: z.string().datetime(),
  }),
  generatedBy: z.string().uuid(),
  generatedAt: z.string().datetime(),
  status: z.enum(['DRAFT', 'FINALIZED', 'SUBMITTED']),
  metrics: ComplianceMetricsSchema,
  findings: z.array(z.object({
    category: z.string(),
    severity: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
    description: z.string(),
    recommendation: z.string(),
    status: z.enum(['OPEN', 'IN_PROGRESS', 'RESOLVED']),
  })),
  recommendations: z.array(z.string()),
  attestations: z.array(z.object({
    statement: z.string(),
    attestedBy: z.string().uuid(),
    attestedAt: z.string().datetime(),
    signature: z.string().optional(),
  })).optional(),
});

export type HIPAAReport = z.infer<typeof HIPAAReportSchema>;
