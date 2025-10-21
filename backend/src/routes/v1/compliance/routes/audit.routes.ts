/**
 * Audit Trail Routes
 * HTTP endpoints for comprehensive audit logging and security monitoring
 * All routes prefixed with /api/v1/audit
 * HIPAA Compliance: Required for 45 CFR § 164.308(a)(1)(ii)(D)
 */

import { ServerRoute } from '@hapi/hapi';
import { asyncHandler } from '../../../shared/utils';
import { AuditController } from '../controllers/audit.controller';
import {
  auditLogQuerySchema,
  createAuditLogSchema,
  phiAccessQuerySchema,
  logPhiAccessSchema,
  auditStatisticsQuerySchema,
  userActivityQuerySchema,
  exportAuditLogsSchema,
  securityAnalysisQuerySchema,
  archiveLogsSchema,
  auditLogIdParamSchema,
  userIdParamSchema,
  sessionIdParamSchema,
  resourceParamSchema
} from '../validators/audit.validators';

/**
 * AUDIT LOG MANAGEMENT ROUTES
 */

const listAuditLogsRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/audit/logs',
  handler: asyncHandler(AuditController.listAuditLogs),
  options: {
    auth: 'jwt',
    tags: ['api', 'Audit', 'Compliance', 'v1'],
    description: 'List audit logs with filtering and pagination',
    notes: '**CRITICAL HIPAA ENDPOINT** - Returns paginated audit trail for all system actions. Supports filtering by user, entity type, action, date range, and IP address. Essential for HIPAA compliance audits and security investigations. All access to this endpoint is also logged.',
    validate: {
      query: auditLogQuerySchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Audit logs retrieved successfully with pagination' },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Forbidden - Admin or Compliance Officer only' }
        }
      }
    }
  }
};

const getAuditLogByIdRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/audit/logs/{id}',
  handler: asyncHandler(AuditController.getAuditLogById),
  options: {
    auth: 'jwt',
    tags: ['api', 'Audit', 'Compliance', 'v1'],
    description: 'Get audit log by ID',
    notes: 'Returns detailed audit log entry including user, action, entity, changes, IP address, and timestamp. Used for investigating specific system events.',
    validate: {
      params: auditLogIdParamSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Audit log retrieved successfully' },
          '401': { description: 'Unauthorized' },
          '404': { description: 'Audit log not found' }
        }
      }
    }
  }
};

const createAuditLogRoute: ServerRoute = {
  method: 'POST',
  path: '/api/v1/audit/logs',
  handler: asyncHandler(AuditController.createAuditLog),
  options: {
    auth: 'jwt',
    tags: ['api', 'Audit', 'Compliance', 'v1'],
    description: 'Create audit log entry',
    notes: 'Manually create audit log entry for system actions. Automatically captures IP address, user agent, and timestamp. Used for logging application-level events that require audit trails.',
    validate: {
      payload: createAuditLogSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '201': { description: 'Audit log created successfully' },
          '400': { description: 'Validation error - Invalid audit data' },
          '401': { description: 'Unauthorized' }
        }
      }
    }
  }
};

/**
 * PHI ACCESS LOGGING ROUTES
 */

const getPhiAccessLogsRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/audit/phi-access',
  handler: asyncHandler(AuditController.getPhiAccessLogs),
  options: {
    auth: 'jwt',
    tags: ['api', 'Audit', 'PHI', 'Compliance', 'v1'],
    description: 'Get PHI access logs',
    notes: '**CRITICAL HIPAA ENDPOINT** - Returns comprehensive Protected Health Information (PHI) access audit trail. Tracks who accessed what student data, when, and from where. Includes access type (VIEW, EDIT, EXPORT), data category, and user details. Required for HIPAA compliance. Admin/Compliance Officer only.',
    validate: {
      query: phiAccessQuerySchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'PHI access logs retrieved successfully with pagination' },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Forbidden - Admin or Compliance Officer only' }
        }
      }
    }
  }
};

const logPhiAccessRoute: ServerRoute = {
  method: 'POST',
  path: '/api/v1/audit/phi-access',
  handler: asyncHandler(AuditController.logPhiAccess),
  options: {
    auth: 'jwt',
    tags: ['api', 'Audit', 'PHI', 'Compliance', 'v1'],
    description: 'Log PHI access',
    notes: '**CRITICAL HIPAA ENDPOINT** - Records PHI access for compliance. Logs user, student, access type (VIEW/EDIT/EXPORT/PRINT/DELETE), data category (HEALTH_RECORD, MEDICATION, etc.), success status, and automatically captures IP address and timestamp. Required by HIPAA Security Rule 45 CFR § 164.308(a)(1)(ii)(D).',
    validate: {
      payload: logPhiAccessSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '201': { description: 'PHI access logged successfully' },
          '400': { description: 'Validation error - Invalid access log data' },
          '401': { description: 'Unauthorized' }
        }
      }
    }
  }
};

/**
 * AUDIT STATISTICS & ANALYTICS ROUTES
 */

const getAuditStatisticsRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/audit/statistics',
  handler: asyncHandler(AuditController.getAuditStatistics),
  options: {
    auth: 'jwt',
    tags: ['api', 'Audit', 'Statistics', 'Compliance', 'v1'],
    description: 'Get audit statistics',
    notes: 'Returns comprehensive audit statistics for specified date range. Includes total logs, unique users, action distribution (CREATE, READ, UPDATE, DELETE), entity type distribution, hourly/daily trends, and top users by activity. Used for compliance dashboards and system usage analysis.',
    validate: {
      query: auditStatisticsQuerySchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Audit statistics retrieved successfully' },
          '400': { description: 'Validation error - Invalid date range' },
          '401': { description: 'Unauthorized' }
        }
      }
    }
  }
};

const getUserActivityRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/audit/user/{userId}/activity',
  handler: asyncHandler(AuditController.getUserActivity),
  options: {
    auth: 'jwt',
    tags: ['api', 'Audit', 'Users', 'Compliance', 'v1'],
    description: 'Get user activity audit logs',
    notes: 'Returns paginated audit trail for specific user. Includes all actions performed (login, data access, modifications, exports), timestamps, entity types accessed, and success/failure status. Used for user activity monitoring and investigation.',
    validate: {
      params: userIdParamSchema,
      query: userActivityQuerySchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'User activity retrieved successfully with pagination' },
          '401': { description: 'Unauthorized' },
          '404': { description: 'User not found' }
        }
      }
    }
  }
};

const exportAuditLogsRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/audit/export',
  handler: asyncHandler(AuditController.exportAuditLogs),
  options: {
    auth: 'jwt',
    tags: ['api', 'Audit', 'Export', 'Compliance', 'v1'],
    description: 'Export audit logs',
    notes: 'Exports audit logs for specified date range in CSV, JSON, or PDF format. Supports filtering by user, entity type, and action. Used for compliance reporting, external audits, and long-term archival. Large exports may take time to process. Admin only.',
    validate: {
      query: exportAuditLogsSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Audit logs exported successfully' },
          '400': { description: 'Validation error - Invalid export parameters' },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Forbidden - Admin only' }
        }
      }
    }
  }
};

/**
 * SECURITY ANALYSIS ROUTES
 */

const getSecurityAnalysisRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/audit/security-analysis',
  handler: asyncHandler(AuditController.getSecurityAnalysis),
  options: {
    auth: 'jwt',
    tags: ['api', 'Audit', 'Security', 'Compliance', 'v1'],
    description: 'Get security analysis',
    notes: '**SECURITY CRITICAL** - Performs comprehensive security analysis: suspicious login patterns (failed attempts, brute force), unusual PHI access (high volume, wide access, after-hours), data exfiltration detection (bulk exports, rapid downloads), and access pattern analysis. Returns risk levels, flagged users, and security recommendations. Admin/Security Officer only.',
    validate: {
      query: securityAnalysisQuerySchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Security analysis completed successfully' },
          '400': { description: 'Validation error - Invalid analysis parameters' },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Forbidden - Admin or Security Officer only' }
        }
      }
    }
  }
};

const runSecurityAnalysisRoute: ServerRoute = {
  method: 'POST',
  path: '/api/v1/audit/security-analysis/run',
  handler: asyncHandler(AuditController.runSecurityAnalysis),
  options: {
    auth: 'jwt',
    tags: ['api', 'Audit', 'Security', 'Compliance', 'v1'],
    description: 'Run security analysis',
    notes: '**SECURITY CRITICAL** - Triggers on-demand comprehensive security analysis. Analyzes audit logs for security threats, generates detailed report with risk scores, identifies high-risk users, and provides actionable recommendations. Results saved for compliance documentation. Admin/Security Officer only.',
    validate: {
      payload: securityAnalysisQuerySchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '201': { description: 'Security analysis completed and report generated' },
          '400': { description: 'Validation error - Invalid analysis parameters' },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Forbidden - Admin or Security Officer only' }
        }
      }
    }
  }
};

/**
 * COMPLIANCE REPORTING ROUTES
 */

const generateComplianceReportRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/audit/compliance-report',
  handler: asyncHandler(AuditController.generateComplianceReport),
  options: {
    auth: 'jwt',
    tags: ['api', 'Audit', 'Compliance', 'Reports', 'v1'],
    description: 'Generate HIPAA compliance report',
    notes: '**HIPAA COMPLIANCE ENDPOINT** - Generates comprehensive compliance report for HIPAA audits. Includes PHI access summary (total access, success rate), access by type and category, top users and students by access count, failed access attempts, and compliance metrics. Required for periodic HIPAA compliance reviews. Compliance Officer only.',
    validate: {
      query: auditStatisticsQuerySchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Compliance report generated successfully' },
          '400': { description: 'Validation error - Invalid date range' },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Forbidden - Compliance Officer only' }
        }
      }
    }
  }
};

/**
 * ANOMALY DETECTION ROUTES
 */

const detectAnomaliesRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/audit/anomalies',
  handler: asyncHandler(AuditController.detectAnomalies),
  options: {
    auth: 'jwt',
    tags: ['api', 'Audit', 'Security', 'Anomalies', 'v1'],
    description: 'Detect security anomalies',
    notes: '**SECURITY CRITICAL** - Detects anomalous behavior patterns in audit logs. Identifies: suspicious logins (multiple failures, brute force attempts), unusual PHI access (abnormal volumes, patterns), and after-hours access (outside business hours). Returns flagged activities with risk levels for investigation. Security/Admin only.',
    validate: {
      query: auditStatisticsQuerySchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Anomalies detected and analyzed' },
          '400': { description: 'Validation error - Invalid date range' },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Forbidden - Security Officer or Admin only' }
        }
      }
    }
  }
};

/**
 * SESSION AUDIT TRAIL ROUTES
 */

const getSessionAuditTrailRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/audit/session/{sessionId}',
  handler: asyncHandler(AuditController.getSessionAuditTrail),
  options: {
    auth: 'jwt',
    tags: ['api', 'Audit', 'Sessions', 'Compliance', 'v1'],
    description: 'Get session audit trail',
    notes: 'Returns complete audit trail for a user session. Tracks all actions performed during a session from login to logout including: entities accessed, modifications made, failed attempts, and timeline. Used for session-based security investigations.',
    validate: {
      params: sessionIdParamSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Session audit trail retrieved successfully' },
          '401': { description: 'Unauthorized' },
          '404': { description: 'Session not found' }
        }
      }
    }
  }
};

/**
 * DATA ACCESS HISTORY ROUTES
 */

const getDataAccessHistoryRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/audit/data-access/{resourceType}/{resourceId}',
  handler: asyncHandler(AuditController.getDataAccessHistory),
  options: {
    auth: 'jwt',
    tags: ['api', 'Audit', 'DataAccess', 'Compliance', 'v1'],
    description: 'Get resource access history',
    notes: '**PHI AUDIT ENDPOINT** - Returns complete access history for a specific resource (e.g., health record, medication record). Shows who accessed, when, what action (VIEW/EDIT/DELETE), and from where (IP address). Critical for PHI disclosure accounting as required by HIPAA. Used to answer "Who accessed this student\'s records?"',
    validate: {
      params: resourceParamSchema,
      query: auditLogQuerySchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Data access history retrieved successfully with pagination' },
          '401': { description: 'Unauthorized' },
          '404': { description: 'Resource not found' }
        }
      }
    }
  }
};

/**
 * ARCHIVE OPERATIONS ROUTES
 */

const archiveOldLogsRoute: ServerRoute = {
  method: 'DELETE',
  path: '/api/v1/audit/logs/archive',
  handler: asyncHandler(AuditController.archiveOldLogs),
  options: {
    auth: 'jwt',
    tags: ['api', 'Audit', 'Archive', 'Compliance', 'v1'],
    description: 'Archive old audit logs',
    notes: '**COMPLIANCE CRITICAL** - Archives audit logs older than specified days (minimum 90 days for HIPAA compliance). Moves logs to long-term storage while maintaining compliance with data retention requirements. Supports dry-run mode for testing. Admin only. Cannot delete logs newer than 90 days to maintain required audit trail.',
    validate: {
      payload: archiveLogsSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Audit logs archived successfully' },
          '400': { description: 'Validation error - Invalid archive parameters or retention violation' },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Forbidden - Admin only' }
        }
      }
    }
  }
};

/**
 * EXPORT ROUTES
 */

export const auditRoutes: ServerRoute[] = [
  // Audit log management
  listAuditLogsRoute,
  getAuditLogByIdRoute,
  createAuditLogRoute,

  // PHI access logging
  getPhiAccessLogsRoute,
  logPhiAccessRoute,

  // Statistics & analytics
  getAuditStatisticsRoute,
  getUserActivityRoute,
  exportAuditLogsRoute,

  // Security analysis
  getSecurityAnalysisRoute,
  runSecurityAnalysisRoute,

  // Compliance reporting
  generateComplianceReportRoute,

  // Anomaly detection
  detectAnomaliesRoute,

  // Session audit trail
  getSessionAuditTrailRoute,

  // Data access history
  getDataAccessHistoryRoute,

  // Archive operations
  archiveOldLogsRoute
];
