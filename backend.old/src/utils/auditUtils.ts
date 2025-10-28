/**
 * @fileoverview Audit Logging Utilities for Security and Compliance
 * @module utils/auditUtils
 * @description Provides comprehensive audit logging functions for authentication,
 * authorization, and PHI access tracking. Essential for HIPAA compliance.
 *
 * SECURITY: Tracks all security-relevant events
 * HIPAA: Comprehensive audit trail for PHI access
 * SECURITY: Failed authentication and authorization logging
 *
 * @security Audit logging
 * @security HIPAA compliance
 * @security Security event tracking
 */

import { logger } from './logger';

/**
 * Audit event types
 */
export enum AuditEventType {
  // Authentication events
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',
  LOGIN_FAILED = 'LOGIN_FAILED',
  LOGOUT = 'LOGOUT',
  SESSION_TIMEOUT = 'SESSION_TIMEOUT',
  PASSWORD_CHANGE = 'PASSWORD_CHANGE',
  PASSWORD_RESET = 'PASSWORD_RESET',

  // Authorization events
  AUTHORIZATION_SUCCESS = 'AUTHORIZATION_SUCCESS',
  AUTHORIZATION_FAILED = 'AUTHORIZATION_FAILED',
  PERMISSION_DENIED = 'PERMISSION_DENIED',

  // PHI access events
  PHI_ACCESS = 'PHI_ACCESS',
  PHI_CREATE = 'PHI_CREATE',
  PHI_UPDATE = 'PHI_UPDATE',
  PHI_DELETE = 'PHI_DELETE',
  PHI_EXPORT = 'PHI_EXPORT',

  // Document events
  DOCUMENT_UPLOAD = 'DOCUMENT_UPLOAD',
  DOCUMENT_DOWNLOAD = 'DOCUMENT_DOWNLOAD',
  DOCUMENT_DELETE = 'DOCUMENT_DELETE',
  DOCUMENT_SHARE = 'DOCUMENT_SHARE',

  // Medication events
  MEDICATION_PRESCRIBED = 'MEDICATION_PRESCRIBED',
  MEDICATION_ADMINISTERED = 'MEDICATION_ADMINISTERED',
  MEDICATION_UPDATED = 'MEDICATION_UPDATED',
  MEDICATION_DISCONTINUED = 'MEDICATION_DISCONTINUED',

  // Security events
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  ACCOUNT_LOCKED = 'ACCOUNT_LOCKED',
  SUSPICIOUS_ACTIVITY = 'SUSPICIOUS_ACTIVITY',
  SECURITY_VIOLATION = 'SECURITY_VIOLATION',

  // Data events
  BULK_EXPORT = 'BULK_EXPORT',
  DATA_IMPORT = 'DATA_IMPORT',
  REPORT_GENERATED = 'REPORT_GENERATED'
}

/**
 * Resource types for audit logging
 */
export enum AuditResourceType {
  USER = 'USER',
  STUDENT = 'STUDENT',
  HEALTH_RECORD = 'HEALTH_RECORD',
  MEDICATION = 'MEDICATION',
  PRESCRIPTION = 'PRESCRIPTION',
  APPOINTMENT = 'APPOINTMENT',
  DOCUMENT = 'DOCUMENT',
  INCIDENT_REPORT = 'INCIDENT_REPORT',
  MESSAGE = 'MESSAGE',
  CONSENT_FORM = 'CONSENT_FORM',
  INVENTORY = 'INVENTORY',
  PURCHASE_ORDER = 'PURCHASE_ORDER'
}

/**
 * Audit log entry structure
 */
export interface AuditLogEntry {
  eventType: AuditEventType;
  userId?: string;
  userEmail?: string;
  userRole?: string;
  ipAddress?: string;
  userAgent?: string;
  resourceType?: AuditResourceType;
  resourceId?: string;
  action?: string;
  success: boolean;
  failureReason?: string;
  metadata?: Record<string, any>;
  timestamp: Date;
  isPHI: boolean;
}

/**
 * In-memory store for audit logs
 * TODO: In production, store in database or external audit logging service
 * TODO: Consider using separate audit database for compliance
 */
const auditLogs: AuditLogEntry[] = [];

/**
 * Base function to create audit log entry
 *
 * @param entry - Audit log entry
 * @private
 */
function createAuditLog(entry: AuditLogEntry): void {
  auditLogs.push(entry);

  // Log to console/file based on severity
  const logData = {
    ...entry,
    timestamp: entry.timestamp.toISOString()
  };

  if (entry.isPHI) {
    // PHI access always logged as warn level for visibility
    logger.warn('[AUDIT:PHI]', logData);
  } else if (!entry.success) {
    // Failed events logged as warn
    logger.warn('[AUDIT:FAILED]', logData);
  } else {
    // Successful events logged as info
    logger.info('[AUDIT]', logData);
  }

  // TODO: Send to external audit service (Splunk, CloudWatch, etc.)
  // TODO: Store in audit database table
}

/**
 * Log successful authentication
 *
 * @param userId - Authenticated user ID
 * @param userEmail - User's email
 * @param userRole - User's role
 * @param ipAddress - Client IP address
 * @param userAgent - Client user agent
 *
 * @example
 * logSuccessfulAuthentication('user123', 'nurse@school.edu', 'NURSE', '192.168.1.1', 'Mozilla...');
 */
export function logSuccessfulAuthentication(
  userId: string,
  userEmail: string,
  userRole: string,
  ipAddress: string,
  userAgent?: string
): void {
  createAuditLog({
    eventType: AuditEventType.LOGIN_SUCCESS,
    userId,
    userEmail,
    userRole,
    ipAddress,
    userAgent,
    success: true,
    timestamp: new Date(),
    isPHI: false
  });
}

/**
 * Log failed authentication attempt
 *
 * @param email - Email used in login attempt
 * @param reason - Reason for failure
 * @param ipAddress - Client IP address
 * @param userAgent - Client user agent
 *
 * @example
 * logFailedAuthentication('user@example.com', 'Invalid password', '192.168.1.1', 'Mozilla...');
 */
export function logFailedAuthentication(
  email: string,
  reason: string,
  ipAddress: string,
  userAgent?: string
): void {
  createAuditLog({
    eventType: AuditEventType.LOGIN_FAILED,
    userEmail: email,
    ipAddress,
    userAgent,
    success: false,
    failureReason: reason,
    timestamp: new Date(),
    isPHI: false
  });
}

/**
 * Log user logout
 *
 * @param userId - User ID
 * @param userEmail - User's email
 * @param ipAddress - Client IP address
 *
 * @example
 * logLogout('user123', 'user@example.com', '192.168.1.1');
 */
export function logLogout(
  userId: string,
  userEmail: string,
  ipAddress: string
): void {
  createAuditLog({
    eventType: AuditEventType.LOGOUT,
    userId,
    userEmail,
    ipAddress,
    success: true,
    timestamp: new Date(),
    isPHI: false
  });
}

/**
 * Log session timeout
 *
 * @param userId - User ID
 * @param userEmail - User's email
 *
 * @example
 * logSessionTimeout('user123', 'user@example.com');
 */
export function logSessionTimeout(userId: string, userEmail: string): void {
  createAuditLog({
    eventType: AuditEventType.SESSION_TIMEOUT,
    userId,
    userEmail,
    success: true,
    timestamp: new Date(),
    isPHI: false
  });
}

/**
 * Log password change
 *
 * @param userId - User ID
 * @param userEmail - User's email
 * @param ipAddress - Client IP address
 * @param initiatedBy - Who initiated the change ('self' or admin user ID)
 *
 * @example
 * logPasswordChange('user123', 'user@example.com', '192.168.1.1', 'self');
 */
export function logPasswordChange(
  userId: string,
  userEmail: string,
  ipAddress: string,
  initiatedBy: string
): void {
  createAuditLog({
    eventType: AuditEventType.PASSWORD_CHANGE,
    userId,
    userEmail,
    ipAddress,
    success: true,
    metadata: { initiatedBy },
    timestamp: new Date(),
    isPHI: false
  });
}

/**
 * Log authorization failure
 *
 * @param userId - User ID who attempted action
 * @param userRole - User's role
 * @param action - Action that was attempted
 * @param resourceType - Type of resource
 * @param resourceId - ID of resource
 * @param reason - Reason for denial
 * @param ipAddress - Client IP address
 *
 * @example
 * logAuthorizationFailure('user123', 'PARENT', 'update', 'HEALTH_RECORD', 'rec456', 'Insufficient permissions', '192.168.1.1');
 */
export function logAuthorizationFailure(
  userId: string,
  userRole: string,
  action: string,
  resourceType: AuditResourceType,
  resourceId: string,
  reason: string,
  ipAddress: string
): void {
  createAuditLog({
    eventType: AuditEventType.AUTHORIZATION_FAILED,
    userId,
    userRole,
    action,
    resourceType,
    resourceId,
    ipAddress,
    success: false,
    failureReason: reason,
    timestamp: new Date(),
    isPHI: false
  });
}

/**
 * Log successful authorization
 *
 * @param userId - User ID
 * @param userRole - User's role
 * @param action - Action performed
 * @param resourceType - Type of resource
 * @param resourceId - ID of resource
 * @param ipAddress - Client IP address
 *
 * @example
 * logAuthorizationSuccess('user123', 'NURSE', 'read', 'HEALTH_RECORD', 'rec456', '192.168.1.1');
 */
export function logAuthorizationSuccess(
  userId: string,
  userRole: string,
  action: string,
  resourceType: AuditResourceType,
  resourceId: string,
  ipAddress: string
): void {
  createAuditLog({
    eventType: AuditEventType.AUTHORIZATION_SUCCESS,
    userId,
    userRole,
    action,
    resourceType,
    resourceId,
    ipAddress,
    success: true,
    timestamp: new Date(),
    isPHI: false
  });
}

/**
 * Log PHI access (READ operation)
 * CRITICAL for HIPAA compliance
 *
 * @param userId - User accessing PHI
 * @param userRole - User's role
 * @param resourceType - Type of PHI resource
 * @param resourceId - ID of PHI resource
 * @param studentId - ID of student whose PHI is accessed
 * @param ipAddress - Client IP address
 * @param purpose - Purpose of access (optional but recommended)
 *
 * @example
 * logPHIAccess('nurse123', 'NURSE', 'HEALTH_RECORD', 'rec456', 'student789', '192.168.1.1', 'Routine checkup review');
 */
export function logPHIAccess(
  userId: string,
  userRole: string,
  resourceType: AuditResourceType,
  resourceId: string,
  studentId: string,
  ipAddress: string,
  purpose?: string
): void {
  createAuditLog({
    eventType: AuditEventType.PHI_ACCESS,
    userId,
    userRole,
    action: 'read',
    resourceType,
    resourceId,
    ipAddress,
    success: true,
    metadata: {
      studentId,
      purpose: purpose || 'Not specified'
    },
    timestamp: new Date(),
    isPHI: true
  });
}

/**
 * Log PHI creation
 *
 * @param userId - User creating PHI
 * @param userRole - User's role
 * @param resourceType - Type of PHI resource
 * @param resourceId - ID of created resource
 * @param studentId - ID of student
 * @param ipAddress - Client IP address
 *
 * @example
 * logPHICreate('doctor123', 'DOCTOR', 'HEALTH_RECORD', 'rec456', 'student789', '192.168.1.1');
 */
export function logPHICreate(
  userId: string,
  userRole: string,
  resourceType: AuditResourceType,
  resourceId: string,
  studentId: string,
  ipAddress: string
): void {
  createAuditLog({
    eventType: AuditEventType.PHI_CREATE,
    userId,
    userRole,
    action: 'create',
    resourceType,
    resourceId,
    ipAddress,
    success: true,
    metadata: { studentId },
    timestamp: new Date(),
    isPHI: true
  });
}

/**
 * Log PHI update
 *
 * @param userId - User updating PHI
 * @param userRole - User's role
 * @param resourceType - Type of PHI resource
 * @param resourceId - ID of updated resource
 * @param studentId - ID of student
 * @param ipAddress - Client IP address
 * @param changedFields - Fields that were changed
 *
 * @example
 * logPHIUpdate('nurse123', 'NURSE', 'HEALTH_RECORD', 'rec456', 'student789', '192.168.1.1', ['bloodPressure', 'temperature']);
 */
export function logPHIUpdate(
  userId: string,
  userRole: string,
  resourceType: AuditResourceType,
  resourceId: string,
  studentId: string,
  ipAddress: string,
  changedFields?: string[]
): void {
  createAuditLog({
    eventType: AuditEventType.PHI_UPDATE,
    userId,
    userRole,
    action: 'update',
    resourceType,
    resourceId,
    ipAddress,
    success: true,
    metadata: {
      studentId,
      changedFields: changedFields || []
    },
    timestamp: new Date(),
    isPHI: true
  });
}

/**
 * Log PHI deletion
 *
 * @param userId - User deleting PHI
 * @param userRole - User's role
 * @param resourceType - Type of PHI resource
 * @param resourceId - ID of deleted resource
 * @param studentId - ID of student
 * @param ipAddress - Client IP address
 * @param reason - Reason for deletion
 *
 * @example
 * logPHIDelete('admin123', 'ADMIN', 'HEALTH_RECORD', 'rec456', 'student789', '192.168.1.1', 'Data correction per parent request');
 */
export function logPHIDelete(
  userId: string,
  userRole: string,
  resourceType: AuditResourceType,
  resourceId: string,
  studentId: string,
  ipAddress: string,
  reason?: string
): void {
  createAuditLog({
    eventType: AuditEventType.PHI_DELETE,
    userId,
    userRole,
    action: 'delete',
    resourceType,
    resourceId,
    ipAddress,
    success: true,
    metadata: {
      studentId,
      reason: reason || 'Not specified'
    },
    timestamp: new Date(),
    isPHI: true
  });
}

/**
 * Log PHI export/download
 *
 * @param userId - User exporting PHI
 * @param userRole - User's role
 * @param exportType - Type of export (PDF, CSV, etc.)
 * @param studentIds - Array of student IDs whose data was exported
 * @param recordCount - Number of records exported
 * @param ipAddress - Client IP address
 *
 * @example
 * logPHIExport('nurse123', 'NURSE', 'PDF', ['student789'], 5, '192.168.1.1');
 */
export function logPHIExport(
  userId: string,
  userRole: string,
  exportType: string,
  studentIds: string[],
  recordCount: number,
  ipAddress: string
): void {
  createAuditLog({
    eventType: AuditEventType.PHI_EXPORT,
    userId,
    userRole,
    action: 'export',
    ipAddress,
    success: true,
    metadata: {
      exportType,
      studentIds,
      recordCount
    },
    timestamp: new Date(),
    isPHI: true
  });
}

/**
 * Log medication administration
 *
 * @param nurseId - Nurse ID who administered medication
 * @param studentId - Student ID
 * @param medicationId - Medication ID
 * @param dosage - Dosage administered
 * @param ipAddress - Client IP address
 *
 * @example
 * logMedicationAdministration('nurse123', 'student789', 'med456', '500mg', '192.168.1.1');
 */
export function logMedicationAdministration(
  nurseId: string,
  studentId: string,
  medicationId: string,
  dosage: string,
  ipAddress: string
): void {
  createAuditLog({
    eventType: AuditEventType.MEDICATION_ADMINISTERED,
    userId: nurseId,
    userRole: 'NURSE',
    action: 'administer',
    resourceType: AuditResourceType.MEDICATION,
    resourceId: medicationId,
    ipAddress,
    success: true,
    metadata: {
      studentId,
      dosage
    },
    timestamp: new Date(),
    isPHI: true
  });
}

/**
 * Log medication prescription
 *
 * @param doctorId - Doctor ID who prescribed medication
 * @param studentId - Student ID
 * @param prescriptionId - Prescription ID
 * @param medicationName - Name of medication
 * @param ipAddress - Client IP address
 *
 * @example
 * logMedicationPrescription('doctor123', 'student789', 'rx456', 'Amoxicillin', '192.168.1.1');
 */
export function logMedicationPrescription(
  doctorId: string,
  studentId: string,
  prescriptionId: string,
  medicationName: string,
  ipAddress: string
): void {
  createAuditLog({
    eventType: AuditEventType.MEDICATION_PRESCRIBED,
    userId: doctorId,
    userRole: 'DOCTOR',
    action: 'prescribe',
    resourceType: AuditResourceType.PRESCRIPTION,
    resourceId: prescriptionId,
    ipAddress,
    success: true,
    metadata: {
      studentId,
      medicationName
    },
    timestamp: new Date(),
    isPHI: true
  });
}

/**
 * Log document download
 *
 * @param userId - User downloading document
 * @param userRole - User's role
 * @param documentId - Document ID
 * @param documentName - Document name
 * @param studentId - Student ID (if PHI document)
 * @param ipAddress - Client IP address
 * @param isPHI - Whether document contains PHI
 *
 * @example
 * logDocumentDownload('parent123', 'PARENT', 'doc456', 'immunization_record.pdf', 'student789', '192.168.1.1', true);
 */
export function logDocumentDownload(
  userId: string,
  userRole: string,
  documentId: string,
  documentName: string,
  studentId: string | undefined,
  ipAddress: string,
  isPHI: boolean
): void {
  createAuditLog({
    eventType: AuditEventType.DOCUMENT_DOWNLOAD,
    userId,
    userRole,
    action: 'download',
    resourceType: AuditResourceType.DOCUMENT,
    resourceId: documentId,
    ipAddress,
    success: true,
    metadata: {
      documentName,
      studentId
    },
    timestamp: new Date(),
    isPHI
  });
}

/**
 * Log rate limit exceeded event
 *
 * @param identifier - User email or IP address
 * @param attemptType - Type of attempt (login, api, etc.)
 * @param ipAddress - Client IP address
 *
 * @example
 * logRateLimitExceeded('user@example.com', 'login', '192.168.1.1');
 */
export function logRateLimitExceeded(
  identifier: string,
  attemptType: string,
  ipAddress: string
): void {
  createAuditLog({
    eventType: AuditEventType.RATE_LIMIT_EXCEEDED,
    ipAddress,
    success: false,
    failureReason: `Rate limit exceeded for ${attemptType}`,
    metadata: {
      identifier,
      attemptType
    },
    timestamp: new Date(),
    isPHI: false
  });
}

/**
 * Log account lockout
 *
 * @param userId - User ID
 * @param userEmail - User's email
 * @param reason - Reason for lockout
 * @param ipAddress - Client IP address
 *
 * @example
 * logAccountLocked('user123', 'user@example.com', 'Too many failed login attempts', '192.168.1.1');
 */
export function logAccountLocked(
  userId: string,
  userEmail: string,
  reason: string,
  ipAddress: string
): void {
  createAuditLog({
    eventType: AuditEventType.ACCOUNT_LOCKED,
    userId,
    userEmail,
    ipAddress,
    success: false,
    failureReason: reason,
    timestamp: new Date(),
    isPHI: false
  });
}

/**
 * Log suspicious activity
 *
 * @param userId - User ID (if known)
 * @param activityType - Type of suspicious activity
 * @param description - Description of activity
 * @param ipAddress - Client IP address
 * @param metadata - Additional metadata
 *
 * @example
 * logSuspiciousActivity('user123', 'ABNORMAL_ACCESS_PATTERN', 'Accessing 100+ records in 1 minute', '192.168.1.1', { recordCount: 150 });
 */
export function logSuspiciousActivity(
  userId: string | undefined,
  activityType: string,
  description: string,
  ipAddress: string,
  metadata?: Record<string, any>
): void {
  createAuditLog({
    eventType: AuditEventType.SUSPICIOUS_ACTIVITY,
    userId,
    ipAddress,
    success: false,
    failureReason: description,
    metadata: {
      activityType,
      ...metadata
    },
    timestamp: new Date(),
    isPHI: false
  });
}

/**
 * Get all audit logs (for admin reporting)
 *
 * @param filters - Optional filters
 * @returns Array of audit log entries
 *
 * @example
 * const logs = getAuditLogs({ userId: 'user123', isPHI: true });
 */
export function getAuditLogs(filters?: {
  userId?: string;
  eventType?: AuditEventType;
  isPHI?: boolean;
  startDate?: Date;
  endDate?: Date;
}): AuditLogEntry[] {
  let filtered = [...auditLogs];

  if (filters) {
    if (filters.userId) {
      filtered = filtered.filter(log => log.userId === filters.userId);
    }
    if (filters.eventType) {
      filtered = filtered.filter(log => log.eventType === filters.eventType);
    }
    if (filters.isPHI !== undefined) {
      filtered = filtered.filter(log => log.isPHI === filters.isPHI);
    }
    if (filters.startDate) {
      filtered = filtered.filter(log => log.timestamp >= filters.startDate!);
    }
    if (filters.endDate) {
      filtered = filtered.filter(log => log.timestamp <= filters.endDate!);
    }
  }

  return filtered;
}

/**
 * Get audit log statistics
 *
 * @returns Statistics about audit logs
 *
 * @example
 * const stats = getAuditStats();
 */
export function getAuditStats(): {
  totalEvents: number;
  phiEvents: number;
  failedEvents: number;
  recentEvents: number;
} {
  const now = new Date();
  const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  return {
    totalEvents: auditLogs.length,
    phiEvents: auditLogs.filter(log => log.isPHI).length,
    failedEvents: auditLogs.filter(log => !log.success).length,
    recentEvents: auditLogs.filter(log => log.timestamp >= last24Hours).length
  };
}

/**
 * Clear audit logs (for testing only - never use in production)
 * @private
 */
export function clearAuditLogs(): void {
  auditLogs.length = 0;
  logger.warn('[AUDIT] Audit logs cleared - should only happen in testing');
}

/**
 * Export all audit utilities
 */
export default {
  AuditEventType,
  AuditResourceType,
  logSuccessfulAuthentication,
  logFailedAuthentication,
  logLogout,
  logSessionTimeout,
  logPasswordChange,
  logAuthorizationFailure,
  logAuthorizationSuccess,
  logPHIAccess,
  logPHICreate,
  logPHIUpdate,
  logPHIDelete,
  logPHIExport,
  logMedicationAdministration,
  logMedicationPrescription,
  logDocumentDownload,
  logRateLimitExceeded,
  logAccountLocked,
  logSuspiciousActivity,
  getAuditLogs,
  getAuditStats,
  clearAuditLogs
};
