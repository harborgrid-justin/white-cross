/**
 * @fileoverview Common Type Enumerations
 * @module interfaces/enums/common-types
 * @description Shared enumerations used across multiple domains
 */

/**
 * User roles in the system
 */
export enum UserRole {
  /** System administrator with full access */
  ADMIN = 'ADMIN',

  /** Security analyst */
  ANALYST = 'ANALYST',

  /** Incident responder */
  RESPONDER = 'RESPONDER',

  /** Security manager/supervisor */
  MANAGER = 'MANAGER',

  /** Read-only user */
  VIEWER = 'VIEWER',

  /** API user/service account */
  API_USER = 'API_USER',

  /** Auditor with compliance access */
  AUDITOR = 'AUDITOR'
}

/**
 * User account status
 */
export enum AccountStatus {
  /** Active account */
  ACTIVE = 'ACTIVE',

  /** Inactive account */
  INACTIVE = 'INACTIVE',

  /** Suspended account */
  SUSPENDED = 'SUSPENDED',

  /** Locked account (too many failed logins) */
  LOCKED = 'LOCKED',

  /** Pending activation */
  PENDING = 'PENDING',

  /** Deleted account */
  DELETED = 'DELETED'
}

/**
 * Audit action types
 */
export enum AuditAction {
  CREATE = 'CREATE',
  READ = 'READ',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  FAILED_LOGIN = 'FAILED_LOGIN',
  PASSWORD_CHANGE = 'PASSWORD_CHANGE',
  PERMISSION_CHANGE = 'PERMISSION_CHANGE',
  EXPORT = 'EXPORT',
  IMPORT = 'IMPORT',
  APPROVE = 'APPROVE',
  REJECT = 'REJECT',
  ESCALATE = 'ESCALATE'
}

/**
 * Entity lifecycle status
 */
export enum EntityStatus {
  /** Draft/not yet active */
  DRAFT = 'DRAFT',

  /** Active and operational */
  ACTIVE = 'ACTIVE',

  /** Pending approval */
  PENDING = 'PENDING',

  /** Approved */
  APPROVED = 'APPROVED',

  /** Rejected */
  REJECTED = 'REJECTED',

  /** Suspended */
  SUSPENDED = 'SUSPENDED',

  /** Archived */
  ARCHIVED = 'ARCHIVED',

  /** Soft deleted */
  DELETED = 'DELETED'
}

/**
 * Sort order
 */
export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC'
}

/**
 * Data export formats
 */
export enum ExportFormat {
  CSV = 'CSV',
  JSON = 'JSON',
  XML = 'XML',
  PDF = 'PDF',
  EXCEL = 'EXCEL',
  STIX = 'STIX'
}

/**
 * Notification priority
 */
export enum NotificationPriority {
  LOW = 'LOW',
  NORMAL = 'NORMAL',
  HIGH = 'HIGH',
  URGENT = 'URGENT'
}

/**
 * Notification channel
 */
export enum NotificationChannel {
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  PUSH = 'PUSH',
  WEBHOOK = 'WEBHOOK',
  SLACK = 'SLACK',
  TEAMS = 'TEAMS'
}
