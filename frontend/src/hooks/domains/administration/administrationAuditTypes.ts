/**
 * @fileoverview Administration domain audit and logging type definitions
 * @module hooks/domains/administration/administrationAuditTypes
 * @category Hooks - Administration
 *
 * Type definitions for audit logs, compliance tracking, and security monitoring.
 *
 * @remarks
 * **HIPAA Compliance:**
 * - All PHI access must be logged with severity MEDIUM or higher
 * - Logs must be retained for minimum 6 years
 * - Logs must include sufficient detail for audit trail
 * - Access to logs themselves must be audited
 *
 * **Severity Levels:**
 * - `LOW`: Routine operations (e.g., list views)
 * - `MEDIUM`: Data access or modifications
 * - `HIGH`: Sensitive operations (e.g., permission changes)
 * - `CRITICAL`: Security events (e.g., unauthorized access attempts)
 */

import { AdminUser } from './administrationUserTypes';

/**
 * Audit log entry for HIPAA compliance and security monitoring.
 *
 * Comprehensive audit trail record capturing user actions, resource access,
 * and system events. Essential for HIPAA compliance, security auditing,
 * and incident investigation.
 *
 * @property {string} id - Unique audit log entry identifier
 * @property {string} [userId] - ID of user who performed action (null for system actions)
 * @property {AdminUser} [user] - Full user object (populated when needed)
 * @property {string} action - Action performed (e.g., 'CREATE', 'UPDATE', 'DELETE', 'VIEW')
 * @property {string} resource - Resource type (e.g., 'User', 'Student', 'Medication')
 * @property {string} [resourceId] - ID of specific resource accessed
 * @property {AuditDetails} details - Detailed information about the action
 * @property {string} ipAddress - IP address of the client
 * @property {string} userAgent - Browser/client user agent string
 * @property {string} [sessionId] - Session identifier for correlation
 * @property {string} timestamp - ISO timestamp when action occurred
 * @property {'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'} severity - Event severity level
 * @property {'AUTH' | 'DATA' | 'SYSTEM' | 'SECURITY' | 'ADMIN'} category - Event category
 *
 * @remarks
 * **HIPAA Compliance:**
 * - All PHI access must be logged with severity MEDIUM or higher
 * - Logs must be retained for minimum 6 years
 * - Logs must include sufficient detail for audit trail
 * - Access to logs themselves must be audited
 *
 * **Severity Levels:**
 * - `LOW`: Routine operations (e.g., list views)
 * - `MEDIUM`: Data access or modifications
 * - `HIGH`: Sensitive operations (e.g., permission changes)
 * - `CRITICAL`: Security events (e.g., unauthorized access attempts)
 *
 * **Categories:**
 * - `AUTH`: Authentication and authorization events
 * - `DATA`: Data CRUD operations
 * - `SYSTEM`: System configuration changes
 * - `SECURITY`: Security-related events
 * - `ADMIN`: Administrative actions
 *
 * @example
 * ```typescript
 * const auditEntry: AuditLog = {
 *   id: 'audit-123',
 *   userId: 'usr-456',
 *   user: { ...adminUserObject },
 *   action: 'UPDATE',
 *   resource: 'Student',
 *   resourceId: 'stu-789',
 *   details: {
 *     before: { status: 'ACTIVE' },
 *     after: { status: 'INACTIVE' },
 *     changes: {
 *       status: { from: 'ACTIVE', to: 'INACTIVE' }
 *     },
 *     reason: 'Student transferred to another district'
 *   },
 *   ipAddress: '192.168.1.100',
 *   userAgent: 'Mozilla/5.0...',
 *   sessionId: 'sess-abc123',
 *   timestamp: '2025-10-26T14:30:00Z',
 *   severity: 'MEDIUM',
 *   category: 'DATA'
 * };
 * ```
 *
 * @see {@link AuditDetails} for detailed change tracking
 * @see {@link useAuditLogs} for querying audit logs
 */
export interface AuditLog {
  id: string;
  userId?: string;
  user?: AdminUser;
  action: string;
  resource: string;
  resourceId?: string;
  details: AuditDetails;
  ipAddress: string;
  userAgent: string;
  sessionId?: string;
  timestamp: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  category: 'AUTH' | 'DATA' | 'SYSTEM' | 'SECURITY' | 'ADMIN';
}

export interface AuditDetails {
  before?: any;
  after?: any;
  changes?: Record<string, { from: any; to: any }>;
  metadata?: Record<string, any>;
  reason?: string;
}
