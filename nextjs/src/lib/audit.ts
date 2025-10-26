/**
 * HIPAA-compliant audit logging utilities
 * Tracks all PHI access and modifications for compliance
 */

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

/**
 * Audit log entry interface
 */
export interface AuditLogEntry {
  userId?: string;
  action: string;
  resource: string;
  resourceId?: string;
  details?: string;
  ipAddress?: string;
  userAgent?: string;
  success?: boolean;
  errorMessage?: string;
  changes?: Record<string, any>;
}

/**
 * Log audit event to backend
 * HIPAA Requirement: All PHI access must be logged
 */
export async function auditLog(entry: AuditLogEntry): Promise<void> {
  try {
    // Send audit log to backend service
    await fetch(`${BACKEND_URL}/api/v1/audit/log`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: entry.userId,
        action: entry.action,
        entityType: entry.resource,
        entityId: entry.resourceId,
        changes: entry.changes || {
          details: entry.details,
          success: entry.success !== undefined ? entry.success : true,
          errorMessage: entry.errorMessage
        },
        ipAddress: entry.ipAddress,
        userAgent: entry.userAgent
      })
    });
  } catch (error) {
    // Audit logging should never break the main flow
    // Log to console for debugging but don't throw
    console.error('Audit log failed:', error);
  }
}

/**
 * PHI access actions
 */
export const PHI_ACTIONS = {
  VIEW: 'VIEW_PHI',
  CREATE: 'CREATE_PHI',
  UPDATE: 'UPDATE_PHI',
  DELETE: 'DELETE_PHI',
  EXPORT: 'EXPORT_PHI',
  PRINT: 'PRINT_PHI'
} as const;

/**
 * Log PHI access
 * HIPAA Critical: All Protected Health Information access must be audited
 */
export async function logPHIAccess(entry: Omit<AuditLogEntry, 'action'> & { action: keyof typeof PHI_ACTIONS }): Promise<void> {
  await auditLog({
    ...entry,
    action: PHI_ACTIONS[entry.action]
  });
}

/**
 * Common audit actions
 */
export const AUDIT_ACTIONS = {
  // Authentication
  LOGIN: 'USER_LOGIN',
  LOGOUT: 'USER_LOGOUT',
  LOGIN_FAILED: 'LOGIN_FAILED',
  TOKEN_REFRESH: 'TOKEN_REFRESH',
  PASSWORD_CHANGE: 'PASSWORD_CHANGE',

  // Students
  VIEW_STUDENT: 'VIEW_STUDENT',
  CREATE_STUDENT: 'CREATE_STUDENT',
  UPDATE_STUDENT: 'UPDATE_STUDENT',
  DELETE_STUDENT: 'DELETE_STUDENT',
  LIST_STUDENTS: 'LIST_STUDENTS',

  // Health Records
  VIEW_HEALTH_RECORD: 'VIEW_HEALTH_RECORD',
  CREATE_HEALTH_RECORD: 'CREATE_HEALTH_RECORD',
  UPDATE_HEALTH_RECORD: 'UPDATE_HEALTH_RECORD',
  DELETE_HEALTH_RECORD: 'DELETE_HEALTH_RECORD',

  // Medications
  VIEW_MEDICATION: 'VIEW_MEDICATION',
  CREATE_MEDICATION: 'CREATE_MEDICATION',
  UPDATE_MEDICATION: 'UPDATE_MEDICATION',
  DELETE_MEDICATION: 'DELETE_MEDICATION',
  ADMINISTER_MEDICATION: 'ADMINISTER_MEDICATION',

  // Incidents
  VIEW_INCIDENT: 'VIEW_INCIDENT',
  CREATE_INCIDENT: 'CREATE_INCIDENT',
  UPDATE_INCIDENT: 'UPDATE_INCIDENT',
  DELETE_INCIDENT: 'DELETE_INCIDENT',

  // Documents
  VIEW_DOCUMENT: 'VIEW_DOCUMENT',
  UPLOAD_DOCUMENT: 'UPLOAD_DOCUMENT',
  DOWNLOAD_DOCUMENT: 'DOWNLOAD_DOCUMENT',
  DELETE_DOCUMENT: 'DELETE_DOCUMENT',

  // Reports
  GENERATE_REPORT: 'GENERATE_REPORT',
  EXPORT_DATA: 'EXPORT_DATA'
} as const;

/**
 * Extract IP address from request
 */
export function extractIPAddress(request: Request): string | undefined {
  // Check various headers for IP address
  const headers = [
    'x-forwarded-for',
    'x-real-ip',
    'cf-connecting-ip'
  ];

  for (const header of headers) {
    const value = request.headers.get(header);
    if (value) {
      // x-forwarded-for can contain multiple IPs, take the first one
      return value.split(',')[0].trim();
    }
  }

  return undefined;
}

/**
 * Extract user agent from request
 */
export function extractUserAgent(request: Request): string | undefined {
  return request.headers.get('user-agent') || undefined;
}

/**
 * Create audit context from request
 */
export function createAuditContext(request: Request, userId?: string) {
  return {
    userId,
    ipAddress: extractIPAddress(request),
    userAgent: extractUserAgent(request)
  };
}
