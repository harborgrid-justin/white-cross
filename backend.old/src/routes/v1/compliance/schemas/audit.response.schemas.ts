/**
 * Audit Module Response Schemas for Swagger Documentation
 * Comprehensive Joi schemas for audit trail and security monitoring responses
 *
 * HIPAA Compliance: These schemas document audit logging per 45 CFR § 164.308(a)(1)(ii)(D)
 *
 * Usage in routes:
 * import { AuditLogResponseSchema, PHIAccessLogResponseSchema } from '../schemas/audit.response.schemas';
 *
 * plugins: {
 *   'hapi-swagger': {
 *     responses: {
 *       '200': { description: 'Success', schema: AuditLogListResponseSchema }
 *     }
 *   }
 * }
 */

import Joi from 'joi';
import { PaginationMetaSchema, createPaginatedResponseSchema } from '../../RESPONSE_SCHEMAS';

/**
 * ============================================================================
 * AUDIT LOG SCHEMAS
 * ============================================================================
 */

/**
 * Audit Log Entry Schema
 * Complete audit trail entry for HIPAA compliance
 */
export const AuditLogSchema = Joi.object({
  id: Joi.string().uuid().example('123e4567-e89b-12d3-a456-426614174000').description('Audit log UUID'),
  userId: Joi.string().uuid().allow(null).example('456e7890-e89b-12d3-a456-426614174001').description('User ID (null for system actions)'),
  userName: Joi.string().optional().example('Jane Nurse').description('User full name'),
  userRole: Joi.string().optional().example('School Nurse').description('User role'),
  action: Joi.string()
    .valid('CREATE', 'READ', 'VIEW', 'ACCESS', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'EXPORT', 'IMPORT', 'BACKUP', 'RESTORE', 'SECURITY_EVENT')
    .example('VIEW')
    .description('Action performed'),
  entityType: Joi.string().example('HEALTH_RECORD').description('Entity type acted upon'),
  entityId: Joi.string().allow(null).example('789e0123-e89b-12d3-a456-426614174002').description('Entity UUID'),
  entityName: Joi.string().optional().example('John Doe - Asthma Record').description('Human-readable entity name'),
  changes: Joi.object().optional().example({
    before: { status: 'Active' },
    after: { status: 'Archived' }
  }).description('Change details (before/after values)'),
  ipAddress: Joi.string().ip().example('192.168.1.100').description('Source IP address (IPv4 or IPv6)'),
  userAgent: Joi.string().optional().example('Mozilla/5.0 (Windows NT 10.0; Win64; x64)').description('Browser user agent'),
  sessionId: Joi.string().uuid().optional().description('User session UUID'),
  success: Joi.boolean().example(true).description('Whether action succeeded'),
  errorMessage: Joi.string().optional().description('Error message if action failed'),
  timestamp: Joi.date().iso().example('2025-10-23T10:30:00Z').description('Action timestamp'),
  createdAt: Joi.date().iso().example('2025-10-23T10:30:00Z').description('Log creation timestamp')
}).label('AuditLog');

/**
 * Audit Log Single Response
 */
export const AuditLogResponseSchema = Joi.object({
  success: Joi.boolean().example(true),
  data: Joi.object({
    log: AuditLogSchema
  })
}).label('AuditLogResponse');

/**
 * Audit Log List Response
 */
export const AuditLogListResponseSchema = createPaginatedResponseSchema(AuditLogSchema, 'AuditLogListResponse');

/**
 * ============================================================================
 * PHI ACCESS LOG SCHEMAS
 * ============================================================================
 */

/**
 * PHI Access Log Entry Schema
 * Tracks Protected Health Information access for HIPAA compliance
 */
export const PHIAccessLogSchema = Joi.object({
  id: Joi.string().uuid().example('123e4567-e89b-12d3-a456-426614174003').description('PHI access log UUID'),
  userId: Joi.string().uuid().example('456e7890-e89b-12d3-a456-426614174001').description('User accessing PHI'),
  userName: Joi.string().example('Dr. Smith').description('User full name'),
  userRole: Joi.string().example('Physician').description('User role/title'),
  studentId: Joi.string().uuid().example('789e0123-e89b-12d3-a456-426614174002').description('Student UUID'),
  studentName: Joi.string().example('John Doe').description('Student full name'),
  accessType: Joi.string()
    .valid('VIEW', 'EDIT', 'EXPORT', 'PRINT', 'DELETE')
    .example('VIEW')
    .description('Type of PHI access'),
  dataCategory: Joi.string()
    .valid('HEALTH_RECORD', 'MEDICATION', 'ALLERGY', 'CHRONIC_CONDITION', 'VACCINATION', 'MENTAL_HEALTH', 'EMERGENCY_CONTACT', 'FULL_PROFILE')
    .example('HEALTH_RECORD')
    .description('Category of PHI data accessed'),
  entityType: Joi.string().example('HealthRecord').description('Specific entity type'),
  entityId: Joi.string().optional().example('abc123-def456').description('Specific entity ID'),
  success: Joi.boolean().example(true).description('Whether access was successful'),
  errorMessage: Joi.string().optional().description('Error message if access failed'),
  ipAddress: Joi.string().ip().example('192.168.1.100').description('Source IP address'),
  userAgent: Joi.string().optional().example('Mozilla/5.0 (Windows NT 10.0; Win64; x64)').description('Browser user agent'),
  sessionId: Joi.string().uuid().optional().description('User session UUID'),
  timestamp: Joi.date().iso().example('2025-10-23T10:30:00Z').description('Access timestamp'),
  createdAt: Joi.date().iso().example('2025-10-23T10:30:00Z').description('Log creation timestamp')
}).label('PHIAccessLog');

/**
 * PHI Access Log List Response
 */
export const PHIAccessLogListResponseSchema = createPaginatedResponseSchema(PHIAccessLogSchema, 'PHIAccessLogListResponse');

/**
 * PHI Access Created Response
 */
export const PHIAccessCreatedResponseSchema = Joi.object({
  success: Joi.boolean().example(true),
  data: Joi.object({
    logged: Joi.boolean().example(true).description('Whether PHI access was logged'),
    logId: Joi.string().uuid().optional().description('Created log entry UUID')
  })
}).label('PHIAccessCreatedResponse');

/**
 * ============================================================================
 * AUDIT STATISTICS SCHEMAS
 * ============================================================================
 */

/**
 * Audit Statistics Schema
 */
export const AuditStatisticsSchema = Joi.object({
  totalLogs: Joi.number().integer().example(15420).description('Total audit log entries'),
  uniqueUsers: Joi.number().integer().example(124).description('Unique users with activity'),
  dateRange: Joi.object({
    startDate: Joi.date().iso().example('2025-10-01T00:00:00Z'),
    endDate: Joi.date().iso().example('2025-10-23T23:59:59Z')
  }).description('Statistics date range'),
  actionDistribution: Joi.object().pattern(Joi.string(), Joi.number()).example({
    'VIEW': 8520,
    'UPDATE': 3200,
    'CREATE': 2100,
    'DELETE': 450,
    'LOGIN': 1150
  }).description('Audit logs by action type'),
  entityTypeDistribution: Joi.object().pattern(Joi.string(), Joi.number()).example({
    'HEALTH_RECORD': 4500,
    'MEDICATION': 2800,
    'STUDENT': 3200,
    'APPOINTMENT': 1920
  }).description('Audit logs by entity type'),
  hourlyDistribution: Joi.object().pattern(Joi.string(), Joi.number()).optional().example({
    '08:00': 420,
    '09:00': 680,
    '10:00': 750,
    '11:00': 620
  }).description('Audit logs by hour of day'),
  dailyDistribution: Joi.object().pattern(Joi.string(), Joi.number()).optional().example({
    '2025-10-20': 580,
    '2025-10-21': 620,
    '2025-10-22': 710,
    '2025-10-23': 450
  }).description('Audit logs by day'),
  topUsers: Joi.array().items(Joi.object({
    userId: Joi.string().uuid(),
    userName: Joi.string(),
    actionCount: Joi.number().integer(),
    lastActivity: Joi.date().iso()
  })).example([
    { userId: 'user-1', userName: 'Jane Nurse', actionCount: 1250, lastActivity: '2025-10-23T14:30:00Z' },
    { userId: 'user-2', userName: 'Dr. Smith', actionCount: 980, lastActivity: '2025-10-23T15:00:00Z' }
  ]).description('Top users by activity'),
  failureRate: Joi.number().example(1.2).description('Percentage of failed actions'),
  successRate: Joi.number().example(98.8).description('Percentage of successful actions')
}).label('AuditStatistics');

/**
 * Audit Statistics Response
 */
export const AuditStatisticsResponseSchema = Joi.object({
  success: Joi.boolean().example(true),
  data: Joi.object({
    statistics: AuditStatisticsSchema
  })
}).label('AuditStatisticsResponse');

/**
 * ============================================================================
 * SECURITY ANALYSIS SCHEMAS
 * ============================================================================
 */

/**
 * Security Threat Schema
 */
export const SecurityThreatSchema = Joi.object({
  id: Joi.string().uuid().example('threat-123').description('Threat identifier'),
  type: Joi.string()
    .valid('BRUTE_FORCE', 'UNUSUAL_ACCESS', 'BULK_EXPORT', 'AFTER_HOURS_ACCESS', 'SUSPICIOUS_PATTERN', 'POLICY_VIOLATION')
    .example('BRUTE_FORCE')
    .description('Threat type'),
  severity: Joi.string()
    .valid('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')
    .example('HIGH')
    .description('Threat severity level'),
  userId: Joi.string().uuid().optional().description('Associated user ID'),
  userName: Joi.string().optional().example('Suspicious User').description('Associated user name'),
  description: Joi.string().example('Multiple failed login attempts detected from 192.168.1.100').description('Threat description'),
  evidence: Joi.object().example({
    failedAttempts: 15,
    timespan: '10 minutes',
    ipAddresses: ['192.168.1.100']
  }).description('Supporting evidence'),
  detectedAt: Joi.date().iso().example('2025-10-23T10:45:00Z').description('Detection timestamp'),
  status: Joi.string()
    .valid('DETECTED', 'INVESTIGATING', 'RESOLVED', 'FALSE_POSITIVE')
    .example('DETECTED')
    .description('Investigation status')
}).label('SecurityThreat');

/**
 * Security Analysis Result Schema
 */
export const SecurityAnalysisSchema = Joi.object({
  analysisId: Joi.string().uuid().example('analysis-123').description('Analysis UUID'),
  analyzedAt: Joi.date().iso().example('2025-10-23T15:00:00Z').description('Analysis timestamp'),
  dateRange: Joi.object({
    startDate: Joi.date().iso(),
    endDate: Joi.date().iso()
  }).description('Analysis date range'),
  overallRiskLevel: Joi.string()
    .valid('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')
    .example('MEDIUM')
    .description('Overall security risk level'),
  threatsDetected: Joi.array().items(SecurityThreatSchema).description('Detected security threats'),
  threatCount: Joi.object({
    total: Joi.number().integer().example(12),
    critical: Joi.number().integer().example(2),
    high: Joi.number().integer().example(4),
    medium: Joi.number().integer().example(4),
    low: Joi.number().integer().example(2)
  }).description('Threat count by severity'),
  suspiciousUsers: Joi.array().items(Joi.object({
    userId: Joi.string().uuid(),
    userName: Joi.string(),
    riskScore: Joi.number().example(78.5),
    reasons: Joi.array().items(Joi.string()).example(['High volume PHI access', 'After-hours activity'])
  })).description('Users flagged for suspicious activity'),
  recommendations: Joi.array().items(Joi.string()).example([
    'Review access permissions for high-risk users',
    'Enable multi-factor authentication for all staff',
    'Implement IP address whitelisting'
  ]).description('Security recommendations'),
  complianceIssues: Joi.array().items(Joi.string()).optional().example([
    'Audit log retention below HIPAA minimum'
  ]).description('Compliance issues identified')
}).label('SecurityAnalysis');

/**
 * Security Analysis Response
 */
export const SecurityAnalysisResponseSchema = Joi.object({
  success: Joi.boolean().example(true),
  data: Joi.object({
    analysis: SecurityAnalysisSchema
  })
}).label('SecurityAnalysisResponse');

/**
 * ============================================================================
 * COMPLIANCE REPORT SCHEMAS (Audit Module)
 * ============================================================================
 */

/**
 * HIPAA Compliance Report Schema (from Audit module)
 */
export const HIPAAComplianceReportSchema = Joi.object({
  reportId: Joi.string().uuid().example('report-123').description('Report UUID'),
  reportType: Joi.string().example('HIPAA_COMPLIANCE').description('Report type'),
  generatedAt: Joi.date().iso().example('2025-10-23T16:00:00Z').description('Generation timestamp'),
  generatedBy: Joi.string().uuid().description('Generator user ID'),
  period: Joi.object({
    startDate: Joi.date().iso(),
    endDate: Joi.date().iso()
  }).description('Report period'),
  phiAccessSummary: Joi.object({
    totalAccess: Joi.number().integer().example(4520).description('Total PHI access events'),
    successfulAccess: Joi.number().integer().example(4470).description('Successful access events'),
    failedAccess: Joi.number().integer().example(50).description('Failed access events'),
    successRate: Joi.number().example(98.9).description('Success rate percentage')
  }).description('PHI access summary'),
  accessByType: Joi.object().pattern(Joi.string(), Joi.number()).example({
    'VIEW': 3200,
    'EDIT': 980,
    'EXPORT': 240,
    'PRINT': 100
  }).description('Access by type distribution'),
  accessByCategory: Joi.object().pattern(Joi.string(), Joi.number()).example({
    'HEALTH_RECORD': 2400,
    'MEDICATION': 1200,
    'ALLERGY': 450,
    'VACCINATION': 470
  }).description('Access by data category'),
  topUsers: Joi.array().items(Joi.object({
    userId: Joi.string().uuid(),
    userName: Joi.string(),
    accessCount: Joi.number().integer(),
    mostAccessedCategory: Joi.string()
  })).description('Top users by PHI access'),
  topStudents: Joi.array().items(Joi.object({
    studentId: Joi.string().uuid(),
    studentName: Joi.string(),
    accessCount: Joi.number().integer(),
    uniqueUsers: Joi.number().integer()
  })).description('Top students by PHI access'),
  failedAccessAttempts: Joi.array().items(Joi.object({
    timestamp: Joi.date().iso(),
    userId: Joi.string().uuid(),
    studentId: Joi.string().uuid(),
    reason: Joi.string()
  })).optional().description('Failed access attempts'),
  complianceMetrics: Joi.object({
    auditLogRetention: Joi.object({
      status: Joi.string().example('COMPLIANT'),
      oldestLog: Joi.date().iso(),
      retentionDays: Joi.number().integer().example(2180)
    }),
    accessControlCompliance: Joi.number().example(99.2).description('Access control compliance percentage'),
    documentationCompliance: Joi.number().example(98.5).description('Documentation compliance percentage')
  }).optional().description('HIPAA compliance metrics')
}).label('HIPAAComplianceReport');

/**
 * Compliance Report Response
 */
export const ComplianceReportResponseSchema = Joi.object({
  success: Joi.boolean().example(true),
  data: Joi.object({
    report: HIPAAComplianceReportSchema
  })
}).label('ComplianceReportResponse');

/**
 * ============================================================================
 * ANOMALY DETECTION SCHEMAS
 * ============================================================================
 */

/**
 * Detected Anomaly Schema
 */
export const AnomalySchema = Joi.object({
  id: Joi.string().uuid().example('anomaly-123').description('Anomaly identifier'),
  type: Joi.string()
    .valid('SUSPICIOUS_LOGIN', 'UNUSUAL_PHI_ACCESS', 'AFTER_HOURS_ACCESS', 'BULK_OPERATION', 'RAPID_ACCESS', 'GEOGRAPHIC_ANOMALY')
    .example('UNUSUAL_PHI_ACCESS')
    .description('Anomaly type'),
  severity: Joi.string()
    .valid('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')
    .example('HIGH')
    .description('Anomaly severity'),
  userId: Joi.string().uuid().optional().description('Associated user ID'),
  userName: Joi.string().optional().example('Jane Doe').description('Associated user name'),
  description: Joi.string().example('User accessed 50 student records in 5 minutes').description('Anomaly description'),
  details: Joi.object().example({
    accessCount: 50,
    timespan: '5 minutes',
    normalAverage: 8
  }).description('Anomaly details'),
  detectedAt: Joi.date().iso().example('2025-10-23T14:30:00Z').description('Detection timestamp'),
  riskScore: Joi.number().example(85.5).description('Risk score (0-100)'),
  recommendedAction: Joi.string().optional().example('Review user access permissions').description('Recommended action')
}).label('Anomaly');

/**
 * Anomaly Detection Response
 */
export const AnomalyDetectionResponseSchema = Joi.object({
  success: Joi.boolean().example(true),
  data: Joi.object({
    anomalies: Joi.array().items(AnomalySchema).description('Detected anomalies'),
    analysisDate: Joi.date().iso().example('2025-10-23T15:00:00Z').description('Analysis timestamp'),
    totalAnomalies: Joi.number().integer().example(8).description('Total anomalies detected'),
    criticalAnomalies: Joi.number().integer().example(2).description('Critical anomalies'),
    highAnomalies: Joi.number().integer().example(3).description('High severity anomalies')
  })
}).label('AnomalyDetectionResponse');

/**
 * ============================================================================
 * SESSION AUDIT TRAIL SCHEMAS
 * ============================================================================
 */

/**
 * Session Audit Trail Response
 */
export const SessionAuditTrailResponseSchema = Joi.object({
  success: Joi.boolean().example(true),
  data: Joi.object({
    sessionId: Joi.string().uuid().description('Session UUID'),
    userId: Joi.string().uuid().description('User UUID'),
    userName: Joi.string().example('Jane Nurse').description('User name'),
    sessionStart: Joi.date().iso().example('2025-10-23T08:00:00Z').description('Session start time'),
    sessionEnd: Joi.date().iso().allow(null).example('2025-10-23T16:00:00Z').description('Session end time (null if active)'),
    duration: Joi.number().integer().example(28800).description('Session duration in seconds'),
    auditLogs: Joi.array().items(AuditLogSchema).description('All audit logs for this session'),
    totalActions: Joi.number().integer().example(145).description('Total actions in session'),
    actionSummary: Joi.object().pattern(Joi.string(), Joi.number()).example({
      'VIEW': 85,
      'UPDATE': 45,
      'CREATE': 12,
      'DELETE': 3
    }).description('Action type summary')
  })
}).label('SessionAuditTrailResponse');

/**
 * ============================================================================
 * DATA ACCESS HISTORY SCHEMAS
 * ============================================================================
 */

/**
 * Resource Access History Response
 */
export const DataAccessHistoryResponseSchema = createPaginatedResponseSchema(
  Joi.object({
    id: Joi.string().uuid().description('Access log UUID'),
    userId: Joi.string().uuid().description('User ID'),
    userName: Joi.string().example('Dr. Smith').description('User name'),
    action: Joi.string().example('VIEW').description('Action performed'),
    timestamp: Joi.date().iso().example('2025-10-23T10:30:00Z').description('Access timestamp'),
    ipAddress: Joi.string().ip().example('192.168.1.100').description('Source IP address'),
    changes: Joi.object().optional().description('Changes made (if applicable)')
  }),
  'DataAccessHistoryResponse'
);

/**
 * ============================================================================
 * EXPORT SCHEMAS
 * ============================================================================
 */

/**
 * Audit Export Response
 */
export const AuditExportResponseSchema = Joi.object({
  success: Joi.boolean().example(true),
  data: Joi.object({
    format: Joi.string().valid('CSV', 'JSON', 'PDF').example('CSV').description('Export format'),
    recordCount: Joi.number().integer().example(1520).description('Number of exported records'),
    fileSize: Joi.number().integer().example(2048576).description('Export file size in bytes'),
    downloadUrl: Joi.string().uri().optional().example('https://storage.example.com/exports/audit-logs.csv').description('Download URL'),
    expiresAt: Joi.date().iso().example('2025-10-24T15:00:00Z').description('Download URL expiration'),
    generatedAt: Joi.date().iso().example('2025-10-23T15:00:00Z').description('Generation timestamp'),
    fileContent: Joi.any().optional().description('File content (for immediate download)')
  })
}).label('AuditExportResponse');

/**
 * ============================================================================
 * ARCHIVE SCHEMAS
 * ============================================================================
 */

/**
 * Archive Logs Response
 */
export const ArchiveLogsResponseSchema = Joi.object({
  success: Joi.boolean().example(true),
  data: Joi.object({
    archived: Joi.boolean().example(true).description('Whether logs were archived'),
    recordsArchived: Joi.number().integer().example(15420).description('Number of logs archived'),
    oldestLogArchived: Joi.date().iso().example('2019-01-01T00:00:00Z').description('Oldest archived log date'),
    archiveLocation: Joi.string().optional().example('s3://whitecross-archives/audit-logs/2019-2023/').description('Archive storage location'),
    archivedAt: Joi.date().iso().example('2025-10-23T16:00:00Z').description('Archive timestamp'),
    retentionPeriodDays: Joi.number().integer().example(2180).description('Minimum retention period (HIPAA: 6 years)')
  })
}).label('ArchiveLogsResponse');

/**
 * ============================================================================
 * COMMON ERROR SCHEMAS
 * ============================================================================
 */

/**
 * Standard Error Response
 */
export const ErrorResponseSchema = Joi.object({
  success: Joi.boolean().example(false).description('Request success status'),
  error: Joi.object({
    message: Joi.string().example('Unauthorized - Authentication required').description('Human-readable error message'),
    code: Joi.string().example('UNAUTHORIZED').optional().description('Machine-readable error code'),
    details: Joi.any().optional().description('Additional error details')
  }).description('Error information')
}).label('ErrorResponse');

/**
 * Validation Error Response
 */
export const ValidationErrorResponseSchema = Joi.object({
  success: Joi.boolean().example(false),
  error: Joi.object({
    message: Joi.string().example('Validation failed'),
    code: Joi.string().example('VALIDATION_ERROR'),
    details: Joi.array().items(
      Joi.object({
        field: Joi.string().example('startDate').description('Field name'),
        message: Joi.string().example('Start date is required').description('Validation message'),
        value: Joi.any().optional().description('Invalid value')
      })
    ).description('Validation errors by field')
  })
}).label('ValidationErrorResponse');
