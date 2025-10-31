/**
 * HIPAA-compliant audit logging utilities
 * Tracks all PHI access and modifications for compliance
 */

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

/**
 * Audit log entry interface
 */
export interface AuditLogEntry {
  userId?: string | null;
  action: string;
  resource: string;
  resourceId?: string;
  details?: string;
  ipAddress?: string;
  userAgent?: string;
  success?: boolean;
  errorMessage?: string;
  changes?: Record<string, unknown>;
}

/**
 * Log audit event to backend
 * HIPAA Requirement: All PHI access must be logged
 */
export async function auditLog(entry: AuditLogEntry): Promise<void> {
  try {
    // Send audit log to backend service
    await fetch(`${BACKEND_URL}/audit/log`, {
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

  // Appointments
  VIEW_APPOINTMENT: 'VIEW_APPOINTMENT',
  LIST_APPOINTMENTS: 'LIST_APPOINTMENTS',
  CREATE_APPOINTMENT: 'CREATE_APPOINTMENT',
  UPDATE_APPOINTMENT: 'UPDATE_APPOINTMENT',
  DELETE_APPOINTMENT: 'DELETE_APPOINTMENT',
  RESCHEDULE_APPOINTMENT: 'RESCHEDULE_APPOINTMENT',
  CANCEL_APPOINTMENT: 'CANCEL_APPOINTMENT',
  COMPLETE_APPOINTMENT: 'COMPLETE_APPOINTMENT',
  CONFIRM_APPOINTMENT: 'CONFIRM_APPOINTMENT',
  NO_SHOW_APPOINTMENT: 'NO_SHOW_APPOINTMENT',
  SEND_APPOINTMENT_REMINDER: 'SEND_APPOINTMENT_REMINDER',

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
  CREATE_DOCUMENT: 'CREATE_DOCUMENT',
  UPDATE_DOCUMENT: 'UPDATE_DOCUMENT',
  SIGN_DOCUMENT: 'SIGN_DOCUMENT',
  SHARE_DOCUMENT: 'SHARE_DOCUMENT',

  // PHI Records
  CREATE_PHI_RECORD: 'CREATE_PHI_RECORD',
  ACCESS_PHI_RECORD: 'ACCESS_PHI_RECORD',

  // User Management
  CREATE_USER: 'CREATE_USER',
  UPDATE_USER: 'UPDATE_USER',
  DELETE_USER: 'DELETE_USER',

  // Organization Management
  CREATE_ORGANIZATION: 'CREATE_ORGANIZATION',
  UPDATE_ORGANIZATION: 'UPDATE_ORGANIZATION',

  // Configuration
  UPDATE_CONFIGURATION: 'UPDATE_CONFIGURATION',

  // Reports
  GENERATE_REPORT: 'GENERATE_REPORT',
  EXPORT_DATA: 'EXPORT_DATA'
} as const;

/**
 * Extract IP address from request or headers
 */
export function extractIPAddress(request: Request | { get(name: string): string | null }): string | undefined {
  // Check various headers for IP address
  const headersList = [
    'x-forwarded-for',
    'x-real-ip',
    'cf-connecting-ip'
  ];

  const headers = 'headers' in request ? request.headers : request;

  for (const header of headersList) {
    const value = headers.get(header);
    if (value) {
      // x-forwarded-for can contain multiple IPs, take the first one
      return value.split(',')[0].trim();
    }
  }

  return undefined;
}

/**
 * Extract user agent from request or headers
 */
export function extractUserAgent(request: Request | { get(name: string): string | null }): string | undefined {
  const headers = 'headers' in request ? request.headers : request;
  return headers.get('user-agent') || undefined;
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

/**
 * Get client IP from Next.js server context
 *
 * Works in server actions and components.
 *
 * @returns Client IP address
 *
 * @example
 * ```typescript
 * 'use server'
 *
 * export async function myAction() {
 *   const ip = await getClientIP();
 *   await auditLog({ ipAddress: ip, ... });
 * }
 * ```
 */
export async function getClientIP(): Promise<string | undefined> {
  try {
    const { headers } = await import('next/headers');
    const headersList = await headers();

    // Check common headers for IP
    const ipHeaders = [
      'x-forwarded-for',
      'x-real-ip',
      'cf-connecting-ip',
      'x-client-ip',
      'x-cluster-client-ip'
    ];

    for (const header of ipHeaders) {
      const value = headersList.get(header);
      if (value) {
        // x-forwarded-for can contain multiple IPs, take the first one
        return value.split(',')[0].trim();
      }
    }

    return undefined;
  } catch (error) {
    // headers() might not be available in all contexts
    return undefined;
  }
}

/**
 * Get user agent from Next.js server context
 *
 * Works in server actions and components.
 *
 * @returns User agent string
 */
export async function getUserAgent(): Promise<string | undefined> {
  try {
    const { headers } = await import('next/headers');
    const headersList = await headers();
    return headersList.get('user-agent') || undefined;
  } catch (error) {
    // headers() might not be available in all contexts
    return undefined;
  }
}

/**
 * Create audit context from Next.js server context
 *
 * Works in server actions and server components.
 *
 * @param userId - Optional user ID
 * @returns Audit context
 *
 * @example
 * ```typescript
 * 'use server'
 *
 * export async function updateProfile(data: FormData) {
 *   const session = await getServerSession();
 *   const context = await createAuditContextFromServer(session?.user.id);
 *
 *   await auditLog({
 *     ...context,
 *     action: AUDIT_ACTIONS.UPDATE_PROFILE,
 *     resource: 'profile',
 *     resourceId: session?.user.id
 *   });
 * }
 * ```
 */
export async function createAuditContextFromServer(userId?: string | null) {
  return {
    userId,
    ipAddress: await getClientIP(),
    userAgent: await getUserAgent()
  };
}

/**
 * Log audit event with automatic context detection
 *
 * Automatically detects IP and user agent from server context.
 *
 * @param entry - Audit log entry
 *
 * @example
 * ```typescript
 * 'use server'
 *
 * export async function deleteStudent(id: string) {
 *   const user = await getServerAuth();
 *
 *   await auditLogWithContext({
 *     userId: user.id,
 *     action: AUDIT_ACTIONS.DELETE_STUDENT,
 *     resource: 'student',
 *     resourceId: id
 *   });
 * }
 * ```
 */
export async function auditLogWithContext(
  entry: Omit<AuditLogEntry, 'ipAddress' | 'userAgent'>
): Promise<void> {
  const context = await createAuditContextFromServer(entry.userId);

  await auditLog({
    ...entry,
    ipAddress: context.ipAddress,
    userAgent: context.userAgent
  });
}

/**
 * Parse user agent string
 *
 * Extracts browser, OS, and device information from user agent.
 *
 * @param userAgent - User agent string
 * @returns Parsed user agent info
 */
export function parseUserAgent(userAgent: string): {
  browser: string;
  os: string;
  device: string;
} {
  const ua = userAgent.toLowerCase();

  // Detect browser
  let browser = 'Unknown';
  if (ua.includes('chrome')) browser = 'Chrome';
  else if (ua.includes('firefox')) browser = 'Firefox';
  else if (ua.includes('safari')) browser = 'Safari';
  else if (ua.includes('edge')) browser = 'Edge';
  else if (ua.includes('opera')) browser = 'Opera';

  // Detect OS
  let os = 'Unknown';
  if (ua.includes('windows')) os = 'Windows';
  else if (ua.includes('mac')) os = 'macOS';
  else if (ua.includes('linux')) os = 'Linux';
  else if (ua.includes('android')) os = 'Android';
  else if (ua.includes('ios') || ua.includes('iphone') || ua.includes('ipad')) os = 'iOS';

  // Detect device
  let device = 'Desktop';
  if (ua.includes('mobile') || ua.includes('android')) device = 'Mobile';
  else if (ua.includes('tablet') || ua.includes('ipad')) device = 'Tablet';

  return { browser, os, device };
}
