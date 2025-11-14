/**
 * WF-COMP-319 | system-types.ts - System and Infrastructure Type Definitions
 * Purpose: System configuration, audit, security, and integration types
 * Upstream: Backend system services | Dependencies: base-entities
 * Downstream: Admin features, audit logs, integrations | Called by: System components
 * Related: Base entities, user types
 * Exports: AuditLog, PermissionCheck, SystemSettings, IntegrationStatus | Key Features: System management
 * Last Updated: 2025-11-12 | File Type: .ts
 * Critical Path: User action → Audit capture → Permission check → Action execution
 * LLM Context: System infrastructure types, part of type system refactoring
 */

/**
 * System Types Module
 *
 * Defines types for system infrastructure including audit logging,
 * permissions, configuration, and external integrations.
 *
 * @module types/core/system-types
 * @category Types
 */

import type { BaseEntity } from './base-entities';

/**
 * Audit log entry for security and compliance tracking.
 *
 * Records all significant user actions for security auditing,
 * compliance reporting, and troubleshooting.
 *
 * **Compliance Note**: Audit logs are essential for HIPAA compliance
 * and must be retained according to organizational policy.
 *
 * @extends {BaseEntity}
 * @property {string} userId - UUID of user who performed the action
 * @property {string} action - Action performed (e.g., 'CREATE', 'UPDATE', 'DELETE', 'VIEW')
 * @property {string} resourceType - Type of resource affected (e.g., 'Student', 'Medication', 'HealthRecord')
 * @property {string} [resourceId] - UUID of the specific resource (if applicable)
 * @property {Record<string, unknown>} [details] - Additional context about the action
 * @property {string} [ipAddress] - IP address of the user
 * @property {string} [userAgent] - Browser/client user agent string
 *
 * @example
 * ```typescript
 * const auditLog: AuditLog = {
 *   id: 'log-uuid',
 *   userId: 'nurse-user-uuid',
 *   action: 'UPDATE',
 *   resourceType: 'Student',
 *   resourceId: 'student-uuid',
 *   details: {
 *     fieldChanged: 'emergencyContacts',
 *     previousValue: '[...]',
 *     newValue: '[...]'
 *   },
 *   ipAddress: '192.168.1.100',
 *   userAgent: 'Mozilla/5.0...',
 *   createdAt: '2025-11-12T10:00:00Z',
 *   updatedAt: '2025-11-12T10:00:00Z'
 * };
 * ```
 */
export interface AuditLog extends BaseEntity {
  userId: string;
  action: string;
  resourceType: string;
  resourceId?: string;
  details?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Permission check request for RBAC authorization.
 *
 * Used to verify if a user has permission to perform a specific
 * action on a resource. Part of the authorization system.
 *
 * @property {string} resource - Resource type being accessed
 * @property {string} action - Action being attempted
 * @property {Record<string, unknown>} [context] - Additional context for permission evaluation
 *
 * @example
 * ```typescript
 * const permCheck: PermissionCheck = {
 *   resource: 'Student',
 *   action: 'UPDATE',
 *   context: {
 *     studentId: 'student-uuid',
 *     schoolId: 'school-uuid',
 *     fieldBeingUpdated: 'medications'
 *   }
 * };
 * ```
 */
export interface PermissionCheck {
  resource: string;
  action: string;
  context?: Record<string, unknown>;
}

/**
 * System configuration setting.
 *
 * Stores configurable system settings and feature flags.
 * Settings can be public (visible to clients) or private (server-only).
 *
 * @property {string} key - Unique setting identifier (dot notation recommended, e.g., 'email.smtp.host')
 * @property {string} value - Setting value (stored as string, parse according to type)
 * @property {string} [description] - Human-readable description of the setting
 * @property {'STRING' | 'NUMBER' | 'BOOLEAN' | 'JSON'} type - Data type for parsing value
 * @property {boolean} isPublic - Whether setting can be exposed to frontend
 * @property {string} [category] - Logical grouping category (e.g., 'email', 'security', 'features')
 *
 * @example
 * ```typescript
 * const setting: SystemSettings = {
 *   key: 'notifications.sms.enabled',
 *   value: 'true',
 *   description: 'Enable SMS notifications',
 *   type: 'BOOLEAN',
 *   isPublic: true,
 *   category: 'notifications'
 * };
 * ```
 */
export interface SystemSettings {
  key: string;
  value: string;
  description?: string;
  type: 'STRING' | 'NUMBER' | 'BOOLEAN' | 'JSON';
  isPublic: boolean;
  category?: string;
}

/**
 * External integration status tracking.
 *
 * Monitors the health and synchronization status of external
 * system integrations (SIS, EHR, notification services, etc.).
 *
 * @property {string} name - Integration name/identifier (e.g., 'PowerSchool', 'Twilio')
 * @property {'CONNECTED' | 'DISCONNECTED' | 'ERROR' | 'SYNCING'} status - Current connection status
 * @property {string} [lastSync] - ISO 8601 timestamp of last successful sync
 * @property {string} [errorMessage] - Error description if status is ERROR
 * @property {string} [nextSync] - ISO 8601 timestamp of next scheduled sync
 *
 * @example
 * ```typescript
 * const integration: IntegrationStatus = {
 *   name: 'PowerSchool SIS',
 *   status: 'CONNECTED',
 *   lastSync: '2025-11-12T06:00:00Z',
 *   nextSync: '2025-11-12T18:00:00Z'
 * };
 * ```
 */
export interface IntegrationStatus {
  name: string;
  status: 'CONNECTED' | 'DISCONNECTED' | 'ERROR' | 'SYNCING';
  lastSync?: string;
  errorMessage?: string;
  nextSync?: string;
}
