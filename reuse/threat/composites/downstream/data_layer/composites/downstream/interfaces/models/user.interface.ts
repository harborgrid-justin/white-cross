/**
 * @fileoverview User and Authentication Interfaces
 * @module interfaces/models/user
 * @description User account and authentication data models
 */

import { IBaseEntity } from './base-entity.interface';
import { UserRole, AccountStatus } from '../enums/common-types.enum';

/**
 * User interface
 */
export interface IUser extends IBaseEntity {
  /** Username (unique) */
  username: string;

  /** Email address (unique) */
  email: string;

  /** Password hash (never store plain text) */
  passwordHash: string;

  /** First name */
  firstName: string;

  /** Last name */
  lastName: string;

  /** Full name (computed) */
  fullName?: string;

  /** User role */
  role: UserRole;

  /** Additional roles (multi-role support) */
  roles?: UserRole[];

  /** Account status */
  status: AccountStatus;

  /** Email verified */
  emailVerified: boolean;

  /** Email verification token */
  emailVerificationToken?: string;

  /** Phone number */
  phone?: string;

  /** Phone verified */
  phoneVerified?: boolean;

  /** Department */
  department?: string;

  /** Job title */
  jobTitle?: string;

  /** Organization/company */
  organization?: string;

  /** Avatar URL */
  avatarUrl?: string;

  /** Timezone */
  timezone?: string;

  /** Locale/language */
  locale?: string;

  /** Two-factor authentication enabled */
  twoFactorEnabled: boolean;

  /** Two-factor secret */
  twoFactorSecret?: string;

  /** Backup codes for 2FA */
  backupCodes?: string[];

  /** Last login timestamp */
  lastLoginAt?: Date;

  /** Last login IP address */
  lastLoginIp?: string;

  /** Failed login attempts */
  failedLoginAttempts?: number;

  /** Account locked until */
  lockedUntil?: Date;

  /** Password changed at */
  passwordChangedAt?: Date;

  /** Password reset token */
  passwordResetToken?: string;

  /** Password reset expiry */
  passwordResetExpiry?: Date;

  /** Permissions (granular) */
  permissions?: string[];

  /** API keys */
  apiKeys?: IApiKey[];

  /** Sessions */
  sessions?: IUserSession[];

  /** Preferences */
  preferences?: IUserPreferences;

  /** Notification settings */
  notificationSettings?: INotificationSettings;

  /** Security settings */
  securitySettings?: ISecuritySettings;

  /** Profile metadata */
  profile?: Record<string, any>;
}

/**
 * API Key for programmatic access
 */
export interface IApiKey {
  /** API key ID */
  id: string;

  /** Key name/description */
  name: string;

  /** Hashed key value */
  keyHash: string;

  /** Key prefix (for display) */
  keyPrefix: string;

  /** Created at */
  createdAt: Date;

  /** Expires at */
  expiresAt?: Date;

  /** Last used at */
  lastUsedAt?: Date;

  /** Is active */
  active: boolean;

  /** Scopes/permissions */
  scopes?: string[];

  /** IP whitelist */
  ipWhitelist?: string[];
}

/**
 * User session
 */
export interface IUserSession {
  /** Session ID */
  id: string;

  /** Session token (hashed) */
  tokenHash: string;

  /** User agent */
  userAgent: string;

  /** IP address */
  ipAddress: string;

  /** Created at */
  createdAt: Date;

  /** Expires at */
  expiresAt: Date;

  /** Last activity */
  lastActivityAt: Date;

  /** Is active */
  active: boolean;

  /** Device info */
  device?: IDeviceInfo;
}

/**
 * Device information
 */
export interface IDeviceInfo {
  /** Device type */
  type: 'DESKTOP' | 'MOBILE' | 'TABLET' | 'OTHER';

  /** Operating system */
  os?: string;

  /** Browser */
  browser?: string;

  /** Device ID (fingerprint) */
  deviceId?: string;
}

/**
 * User preferences
 */
export interface IUserPreferences {
  /** Theme */
  theme?: 'LIGHT' | 'DARK' | 'AUTO';

  /** Dashboard layout */
  dashboardLayout?: string;

  /** Default page size */
  defaultPageSize?: number;

  /** Date format */
  dateFormat?: string;

  /** Time format */
  timeFormat?: '12h' | '24h';

  /** Language */
  language?: string;

  /** Sidebar collapsed */
  sidebarCollapsed?: boolean;

  /** Custom preferences */
  custom?: Record<string, any>;
}

/**
 * Notification settings
 */
export interface INotificationSettings {
  /** Email notifications enabled */
  emailEnabled: boolean;

  /** SMS notifications enabled */
  smsEnabled?: boolean;

  /** Push notifications enabled */
  pushEnabled?: boolean;

  /** Notification types to receive */
  notificationTypes?: {
    security: boolean;
    incidents: boolean;
    threats: boolean;
    vulnerabilities: boolean;
    reports: boolean;
    system: boolean;
  };

  /** Notification frequency */
  frequency?: 'REALTIME' | 'HOURLY' | 'DAILY' | 'WEEKLY';

  /** Quiet hours */
  quietHours?: {
    enabled: boolean;
    start: string; // HH:mm
    end: string; // HH:mm
  };
}

/**
 * Security settings
 */
export interface ISecuritySettings {
  /** Password expiry days */
  passwordExpiryDays?: number;

  /** Session timeout (minutes) */
  sessionTimeout?: number;

  /** IP whitelist */
  ipWhitelist?: string[];

  /** Allowed authentication methods */
  allowedAuthMethods?: ('PASSWORD' | 'SSO' | 'MFA' | 'API_KEY')[];

  /** Login notification */
  loginNotification?: boolean;

  /** Suspicious activity alerts */
  suspiciousActivityAlerts?: boolean;
}

/**
 * User activity log
 */
export interface IUserActivity {
  /** Activity ID */
  id: string;

  /** User ID */
  userId: string;

  /** Activity type */
  type: string;

  /** Activity description */
  description: string;

  /** Timestamp */
  timestamp: Date;

  /** IP address */
  ipAddress?: string;

  /** User agent */
  userAgent?: string;

  /** Resource affected */
  resource?: string;

  /** Resource ID */
  resourceId?: string;

  /** Action result */
  result?: 'SUCCESS' | 'FAILURE';

  /** Additional metadata */
  metadata?: Record<string, any>;
}
