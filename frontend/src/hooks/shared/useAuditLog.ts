/**
 * Enterprise Audit Logging Hook
 * 
 * HIPAA-compliant audit logging hook for healthcare applications.
 * Provides centralized audit event tracking with proper security and compliance.
 * 
 * @module hooks/shared/useAuditLog
 * @author White Cross Healthcare Platform
 * @version 3.0.0
 */

import { useCallback } from 'react';
import { useAuthContext } from '../utilities/AuthContext';

/**
 * Audit event severity levels
 */
export type AuditSeverity = 'low' | 'medium' | 'high' | 'critical';

/**
 * Audit event types for healthcare applications
 */
export type AuditEventType = 
  | 'api_error'
  | 'data_access' 
  | 'data_modification'
  | 'authentication'
  | 'authorization'
  | 'phi_access'
  | 'system_error'
  | 'compliance_violation';

/**
 * Audit event interface
 */
export interface AuditEvent {
  event: AuditEventType;
  context: string;
  severity: AuditSeverity;
  details?: Record<string, unknown>;
  timestamp: Date;
  userId?: string;
  sessionId?: string;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Audit log hook options
 */
export interface UseAuditLogOptions {
  enableConsoleLog?: boolean;
  enableRemoteLog?: boolean;
  context?: string;
}

/**
 * Enterprise Audit Logging Hook
 */
export function useAuditLog(options: UseAuditLogOptions = {}) {
  const {
    enableConsoleLog = process.env.NODE_ENV === 'development',
    enableRemoteLog = process.env.NODE_ENV === 'production',
    context = 'unknown'
  } = options;

  const { user } = useAuthContext();

  /**
   * Log an audit event
   */
  const logAuditEvent = useCallback(async (event: Omit<AuditEvent, 'userId' | 'sessionId' | 'ipAddress' | 'userAgent'>) => {
    const enhancedEvent: AuditEvent = {
      ...event,
      userId: user?.id || 'anonymous',
      sessionId: user?.sessionId || 'unknown',
      ipAddress: await getUserIP(),
      userAgent: navigator.userAgent,
    };

    // Console logging for development
    if (enableConsoleLog) {
      console.group(`🔍 Audit Event: ${enhancedEvent.event}`);
      console.log('Severity:', enhancedEvent.severity);
      console.log('Context:', enhancedEvent.context);
      console.log('Timestamp:', enhancedEvent.timestamp.toISOString());
      console.log('User ID:', enhancedEvent.userId);
      console.log('Details:', enhancedEvent.details);
      console.groupEnd();
    }

    // Remote logging for production
    if (enableRemoteLog) {
      try {
        await sendAuditLog(enhancedEvent);
      } catch (error) {
        console.error('Failed to send audit log:', error);
        // Fallback to local storage for critical events
        if (enhancedEvent.severity === 'critical') {
          storeAuditLogLocally(enhancedEvent);
        }
      }
    }
  }, [user, enableConsoleLog, enableRemoteLog]);

  /**
   * Log data access events (HIPAA requirement)
   */
  const logDataAccess = useCallback(async (
    resource: string, 
    action: 'read' | 'write' | 'delete',
    details?: Record<string, unknown>
  ) => {
    await logAuditEvent({
      event: 'data_access',
      context: `${action}_${resource}`,
      severity: action === 'delete' ? 'high' : 'medium',
      details: {
        resource,
        action,
        ...details,
      },
      timestamp: new Date(),
    });
  }, [logAuditEvent]);

  /**
   * Log PHI access events (HIPAA critical)
   */
  const logPHIAccess = useCallback(async (
    patientId: string,
    dataType: string,
    action: 'view' | 'edit' | 'export' | 'print',
    details?: Record<string, unknown>
  ) => {
    await logAuditEvent({
      event: 'phi_access',
      context: `phi_${action}_${dataType}`,
      severity: 'critical',
      details: {
        patientId: hashPHI(patientId), // Hash for security
        dataType,
        action,
        ...details,
      },
      timestamp: new Date(),
    });
  }, [logAuditEvent]);

  /**
   * Log authentication events
   */
  const logAuthentication = useCallback(async (
    action: 'login' | 'logout' | 'failed_login' | 'password_reset',
    details?: Record<string, unknown>
  ) => {
    await logAuditEvent({
      event: 'authentication',
      context: `auth_${action}`,
      severity: action === 'failed_login' ? 'medium' : 'low',
      details,
      timestamp: new Date(),
    });
  }, [logAuditEvent]);

  /**
   * Log compliance violations
   */
  const logComplianceViolation = useCallback(async (
    violationType: string,
    description: string,
    details?: Record<string, unknown>
  ) => {
    await logAuditEvent({
      event: 'compliance_violation',
      context: `compliance_${violationType}`,
      severity: 'critical',
      details: {
        violationType,
        description,
        ...details,
      },
      timestamp: new Date(),
    });
  }, [logAuditEvent]);

  return {
    logAuditEvent,
    logDataAccess,
    logPHIAccess,
    logAuthentication,
    logComplianceViolation,
  };
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get user IP address (with privacy considerations)
 */
async function getUserIP(): Promise<string> {
  try {
    // In a real application, this would be handled by the backend
    // to avoid exposing user IP directly to the frontend
    return 'masked'; // Placeholder for security
  } catch {
    return 'unknown';
  }
}

/**
 * Send audit log to remote service
 */
async function sendAuditLog(event: AuditEvent): Promise<void> {
  // In a real application, this would send to a secure audit logging service
  // For now, we'll simulate the call
  const response = await fetch('/api/audit/log', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(event),
  });

  if (!response.ok) {
    throw new Error('Failed to send audit log');
  }
}

/**
 * Store audit log locally as fallback
 */
function storeAuditLogLocally(event: AuditEvent): void {
  try {
    const existingLogs = JSON.parse(localStorage.getItem('audit_logs') || '[]');
    existingLogs.push(event);
    
    // Keep only the last 100 logs to prevent storage overflow
    const trimmedLogs = existingLogs.slice(-100);
    
    localStorage.setItem('audit_logs', JSON.stringify(trimmedLogs));
  } catch (error) {
    console.error('Failed to store audit log locally:', error);
  }
}

/**
 * Hash PHI for audit logs (HIPAA compliance)
 */
function hashPHI(data: string): string {
  // In a real application, use a proper cryptographic hash
  // This is a simplified example
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return `hashed_${Math.abs(hash).toString(16)}`;
}