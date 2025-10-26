/**
 * @fileoverview Administration domain configuration, types, query keys, and cache management
 * @module hooks/domains/administration/config
 * @category Hooks - Administration
 *
 * Comprehensive configuration for the administration domain including:
 * - Type definitions for users, departments, settings, audit logs, notifications, and system health
 * - TanStack Query key factories for hierarchical cache management
 * - Cache configuration with optimized stale times per data type
 * - Utility functions for cache invalidation
 *
 * This configuration supports enterprise-grade administration features:
 * - User lifecycle management (CRUD, activation, deactivation)
 * - Role-Based Access Control (RBAC) with permissions
 * - Department and organizational hierarchy management
 * - System-wide configuration and settings
 * - HIPAA-compliant audit logging
 * - Multi-channel notification system
 * - Real-time system health monitoring
 *
 * @remarks
 * **Cache Strategy:**
 * - Users: 15 minute stale time - moderately dynamic data
 * - Departments: 30 minute stale time - rarely changes
 * - Settings: 60 minute stale time - very stable configuration
 * - Audit Logs: 2 minute stale time - highly dynamic for compliance
 * - Notifications: 1 minute stale time - needs freshness
 *
 * **RBAC Considerations:**
 * - Most operations require admin-level permissions
 * - Permission checks should use access-control domain hooks
 * - Audit logging is mandatory for HIPAA compliance
 *
 * **Query Key Hierarchy:**
 * Query keys follow a hierarchical structure enabling precise cache invalidation:
 * - `['administration', 'users']` - All user queries
 * - `['administration', 'users', 'list', filters]` - Filtered lists
 * - `['administration', 'users', 'detail', id]` - Specific entities
 *
 * @example
 * ```typescript
 * import {
 *   ADMINISTRATION_QUERY_KEYS,
 *   ADMINISTRATION_CACHE_CONFIG,
 *   AdminUser,
 *   invalidateUserQueries
 * } from './config';
 *
 * // Use query keys in hooks
 * const queryKey = ADMINISTRATION_QUERY_KEYS.usersList({ role: 'NURSE' });
 *
 * // Use cache config for custom stale times
 * const staleTime = ADMINISTRATION_CACHE_CONFIG.USERS_STALE_TIME;
 *
 * // Invalidate after mutation
 * invalidateUserQueries(queryClient);
 * ```
 *
 * @see {@link useUsers} for user querying
 * @see {@link useCreateUser} for user creation
 * @see {@link useUserPermissions} for permission management
 */

import { QueryClient } from '@tanstack/react-query';

/**
 * Hierarchical query keys for TanStack Query cache management.
 *
 * Provides factory functions for generating consistent query keys across
 * the administration domain. The hierarchical structure enables efficient
 * cache invalidation at any level of specificity.
 *
 * @remarks
 * - All keys start with ['administration'] for domain isolation
 * - List keys include filters for cache differentiation
 * - Detail keys include entity IDs for specific cache entries
 * - Related entity keys (e.g., userRoles) are nested under parent
 *
 * @example
 * ```typescript
 * // Generate query keys
 * const allUsersKey = ADMINISTRATION_QUERY_KEYS.users;
 * const filteredUsersKey = ADMINISTRATION_QUERY_KEYS.usersList({ role: 'NURSE', isActive: true });
 * const userDetailKey = ADMINISTRATION_QUERY_KEYS.userDetails('user-123');
 * const userRolesKey = ADMINISTRATION_QUERY_KEYS.userRoles('user-123');
 *
 * // Use in query
 * useQuery({
 *   queryKey: filteredUsersKey,
 *   queryFn: () => fetchUsers({ role: 'NURSE', isActive: true })
 * });
 * ```
 */
export const ADMINISTRATION_QUERY_KEYS = {
  // Users
  users: ['administration', 'users'] as const,
  usersList: (filters?: any) => [...ADMINISTRATION_QUERY_KEYS.users, 'list', filters] as const,
  userDetails: (id: string) => [...ADMINISTRATION_QUERY_KEYS.users, 'detail', id] as const,
  userRoles: (userId: string) => [...ADMINISTRATION_QUERY_KEYS.users, userId, 'roles'] as const,
  userPermissions: (userId: string) => [...ADMINISTRATION_QUERY_KEYS.users, userId, 'permissions'] as const,
  
  // Departments
  departments: ['administration', 'departments'] as const,
  departmentsList: (filters?: any) => [...ADMINISTRATION_QUERY_KEYS.departments, 'list', filters] as const,
  departmentDetails: (id: string) => [...ADMINISTRATION_QUERY_KEYS.departments, 'detail', id] as const,
  departmentStaff: (deptId: string) => [...ADMINISTRATION_QUERY_KEYS.departments, deptId, 'staff'] as const,
  
  // Settings
  settings: ['administration', 'settings'] as const,
  settingsList: (category?: string) => [...ADMINISTRATION_QUERY_KEYS.settings, 'list', category] as const,
  settingsDetails: (key: string) => [...ADMINISTRATION_QUERY_KEYS.settings, 'detail', key] as const,
  
  // System Configuration
  systemConfig: ['administration', 'system-config'] as const,
  systemConfigList: () => [...ADMINISTRATION_QUERY_KEYS.systemConfig, 'list'] as const,
  systemConfigDetails: (module: string) => [...ADMINISTRATION_QUERY_KEYS.systemConfig, 'detail', module] as const,
  
  // Audit Logs
  auditLogs: ['administration', 'audit-logs'] as const,
  auditLogsList: (filters?: any) => [...ADMINISTRATION_QUERY_KEYS.auditLogs, 'list', filters] as const,
  auditLogDetails: (id: string) => [...ADMINISTRATION_QUERY_KEYS.auditLogs, 'detail', id] as const,
  
  // Notifications
  notifications: ['administration', 'notifications'] as const,
  notificationsList: (filters?: any) => [...ADMINISTRATION_QUERY_KEYS.notifications, 'list', filters] as const,
  notificationDetails: (id: string) => [...ADMINISTRATION_QUERY_KEYS.notifications, 'detail', id] as const,
  userNotifications: (userId: string) => [...ADMINISTRATION_QUERY_KEYS.notifications, 'user', userId] as const,
} as const;

/**
 * Cache configuration constants for TanStack Query.
 *
 * Defines stale times (in milliseconds) for different data types based on
 * their update frequency and importance. Longer stale times reduce API calls
 * for stable data, while shorter times ensure freshness for dynamic data.
 *
 * @remarks
 * **Stale Time Strategy:**
 * - **Users (15 min):** User data changes moderately through admin actions
 * - **Departments (30 min):** Organizational structure is very stable
 * - **Settings (60 min):** System configuration rarely changes
 * - **Audit Logs (2 min):** Must stay fresh for compliance and security monitoring
 * - **Notifications (1 min):** Users expect near real-time notification updates
 *
 * **Cache vs Stale Time:**
 * - `staleTime`: How long data is considered fresh (no refetch on mount)
 * - `cacheTime`: How long unused data stays in memory (default: 5 minutes)
 *
 * **Performance Impact:**
 * - Longer stale times reduce server load and improve perceived performance
 * - Shorter stale times ensure data accuracy for critical operations
 * - Balance between freshness and performance based on use case
 *
 * @example
 * ```typescript
 * import { ADMINISTRATION_CACHE_CONFIG } from './config';
 *
 * // Use in custom query
 * useQuery({
 *   queryKey: ['custom-admin-query'],
 *   queryFn: fetchData,
 *   staleTime: ADMINISTRATION_CACHE_CONFIG.DEFAULT_STALE_TIME
 * });
 *
 * // Override for specific needs
 * useQuery({
 *   queryKey: ['realtime-data'],
 *   queryFn: fetchRealtimeData,
 *   staleTime: 0, // Always fetch fresh
 *   cacheTime: ADMINISTRATION_CACHE_CONFIG.DEFAULT_CACHE_TIME
 * });
 * ```
 */
export const ADMINISTRATION_CACHE_CONFIG = {
  // Standard cache times
  DEFAULT_STALE_TIME: 5 * 60 * 1000, // 5 minutes
  DEFAULT_CACHE_TIME: 10 * 60 * 1000, // 10 minutes
  
  // Specific configurations
  USERS_STALE_TIME: 15 * 60 * 1000, // 15 minutes
  DEPARTMENTS_STALE_TIME: 30 * 60 * 1000, // 30 minutes
  SETTINGS_STALE_TIME: 60 * 60 * 1000, // 1 hour
  AUDIT_LOGS_STALE_TIME: 2 * 60 * 1000, // 2 minutes (more dynamic)
  NOTIFICATIONS_STALE_TIME: 1 * 60 * 1000, // 1 minute
} as const;

// ===========================================
// TYPE DEFINITIONS
// ===========================================

/**
 * Administrator or system user entity.
 *
 * Represents a user account with full profile information, roles, permissions,
 * and organizational affiliations. Used throughout the administration domain
 * for user management, RBAC, and audit tracking.
 *
 * @property {string} id - Unique user identifier (UUID)
 * @property {string} username - Unique username for login
 * @property {string} email - User's email address (unique, required for auth)
 * @property {string} firstName - User's first name
 * @property {string} lastName - User's last name
 * @property {string} displayName - Formatted display name (typically "firstName lastName")
 * @property {string} [avatar] - URL to user's avatar/profile image
 * @property {'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'PENDING'} status - Account status
 * @property {UserRole[]} roles - Assigned roles with permissions
 * @property {string[]} permissions - Direct permission grants (beyond roles)
 * @property {string[]} departments - Department IDs user belongs to
 * @property {string} [lastLoginAt] - ISO timestamp of last successful login
 * @property {string} createdAt - ISO timestamp of account creation
 * @property {string} updatedAt - ISO timestamp of last update
 * @property {UserProfile} profile - Extended user profile information
 *
 * @remarks
 * **Status States:**
 * - `ACTIVE`: User can log in and access assigned resources
 * - `INACTIVE`: User deactivated, cannot log in (soft delete)
 * - `SUSPENDED`: Temporarily suspended, typically for security reasons
 * - `PENDING`: New account awaiting activation/verification
 *
 * **RBAC Integration:**
 * - Roles provide bulk permission grants
 * - Direct permissions supplement role permissions
 * - Permission checking should combine both sources
 *
 * **HIPAA Compliance:**
 * - User actions must be logged in audit trail
 * - Access to PHI requires specific permissions
 * - Profile data should be encrypted at rest
 *
 * @example
 * ```typescript
 * const user: AdminUser = {
 *   id: 'usr-123',
 *   username: 'jsmith',
 *   email: 'jsmith@school.edu',
 *   firstName: 'Jane',
 *   lastName: 'Smith',
 *   displayName: 'Jane Smith',
 *   avatar: 'https://cdn.example.com/avatars/jsmith.jpg',
 *   status: 'ACTIVE',
 *   roles: [{
 *     id: 'role-1',
 *     name: 'SCHOOL_NURSE',
 *     description: 'School nurse with medication administration rights',
 *     permissions: ['administer_medication', 'view_health_records'],
 *     isSystem: true
 *   }],
 *   permissions: ['manage_inventory'],
 *   departments: ['dept-nursing'],
 *   lastLoginAt: '2025-10-26T08:30:00Z',
 *   createdAt: '2025-01-15T10:00:00Z',
 *   updatedAt: '2025-10-26T08:30:00Z',
 *   profile: {
 *     phoneNumber: '+1-555-0123',
 *     preferences: {
 *       theme: 'light',
 *       language: 'en',
 *       timezone: 'America/New_York',
 *       notifications: {
 *         email: true,
 *         sms: false,
 *         push: true,
 *         categories: { 'medication_alerts': true }
 *       }
 *     }
 *   }
 * };
 * ```
 *
 * @see {@link UserRole} for role structure
 * @see {@link UserProfile} for profile details
 * @see {@link useUserDetails} for fetching user data
 * @see {@link useUpdateUser} for updating user information
 */
export interface AdminUser {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  avatar?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'PENDING';
  roles: UserRole[];
  permissions: string[];
  departments: string[];
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
  profile: UserProfile;
}

/**
 * Role definition for RBAC system.
 *
 * @property {string} id - Unique role identifier
 * @property {string} name - Role name (e.g., 'SCHOOL_NURSE', 'ADMIN')
 * @property {string} description - Human-readable role description
 * @property {string[]} permissions - Array of permission strings granted by this role
 * @property {boolean} isSystem - Whether this is a system-defined role (cannot be deleted)
 *
 * @remarks
 * System roles are predefined and cannot be modified or deleted to ensure
 * application security. Custom roles can be created for organization-specific needs.
 */
export interface UserRole {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  isSystem: boolean;
}

export interface UserProfile {
  phoneNumber?: string;
  address?: Address;
  emergencyContact?: EmergencyContact;
  preferences: UserPreferences;
  metadata?: Record<string, any>;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phoneNumber: string;
  email?: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  timezone: string;
  notifications: NotificationPreferences;
  accessibility?: AccessibilitySettings;
}

export interface NotificationPreferences {
  email: boolean;
  sms: boolean;
  push: boolean;
  categories: Record<string, boolean>;
}

export interface AccessibilitySettings {
  highContrast: boolean;
  largeText: boolean;
  screenReader: boolean;
}

/**
 * Department or organizational unit entity.
 *
 * Represents a department within the school/district organizational hierarchy.
 * Used for staff organization, budget tracking, and access control.
 *
 * @property {string} id - Unique department identifier
 * @property {string} name - Department display name
 * @property {string} description - Detailed department description
 * @property {string} code - Short department code (e.g., 'NURS', 'ADMIN')
 * @property {string} [parentId] - Parent department ID for hierarchical structure
 * @property {string} [managerId] - User ID of department manager
 * @property {DepartmentStaff[]} staff - Staff members assigned to department
 * @property {DepartmentBudget} [budget] - Department budget allocation
 * @property {string} [location] - Physical location or building
 * @property {ContactInfo} contactInfo - Department contact information
 * @property {boolean} isActive - Whether department is currently active
 * @property {string} createdAt - ISO timestamp of creation
 * @property {string} updatedAt - ISO timestamp of last update
 *
 * @remarks
 * **Hierarchical Structure:**
 * Departments can be nested using parentId to create organizational trees.
 * Root departments have null/undefined parentId.
 *
 * **Budget Tracking:**
 * Optional budget field enables financial management and reporting per department.
 *
 * @example
 * ```typescript
 * const nursingDept: Department = {
 *   id: 'dept-nursing',
 *   name: 'School Nursing',
 *   description: 'Nursing staff responsible for student health',
 *   code: 'NURS',
 *   parentId: 'dept-health-services',
 *   managerId: 'usr-head-nurse',
 *   staff: [],
 *   budget: {
 *     allocated: 50000,
 *     spent: 32000,
 *     remaining: 18000,
 *     fiscalYear: '2025',
 *     currency: 'USD'
 *   },
 *   location: 'Building A, Room 105',
 *   contactInfo: {
 *     email: 'nursing@school.edu',
 *     phoneNumber: '+1-555-0199',
 *     extension: '105'
 *   },
 *   isActive: true,
 *   createdAt: '2025-01-01T00:00:00Z',
 *   updatedAt: '2025-10-26T12:00:00Z'
 * };
 * ```
 *
 * @see {@link DepartmentStaff} for staff assignment structure
 * @see {@link DepartmentBudget} for budget details
 * @see {@link useDepartments} for querying departments
 */
export interface Department {
  id: string;
  name: string;
  description: string;
  code: string;
  parentId?: string;
  managerId?: string;
  staff: DepartmentStaff[];
  budget?: DepartmentBudget;
  location?: string;
  contactInfo: ContactInfo;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DepartmentStaff {
  userId: string;
  user: AdminUser;
  position: string;
  startDate: string;
  endDate?: string;
  isManager: boolean;
}

export interface DepartmentBudget {
  allocated: number;
  spent: number;
  remaining: number;
  fiscalYear: string;
  currency: string;
}

export interface ContactInfo {
  email?: string;
  phoneNumber?: string;
  extension?: string;
  address?: Address;
}

/**
 * System-wide configuration setting.
 *
 * Represents a single configuration value that controls system behavior.
 * Settings can be public (visible to all users) or private (admin-only),
 * and can be read-only to prevent accidental modification.
 *
 * @property {string} id - Unique setting identifier
 * @property {string} key - Setting key (dot notation, e.g., 'app.timezone')
 * @property {any} value - Setting value (type determined by 'type' field)
 * @property {string} category - Setting category for organization (e.g., 'general', 'security')
 * @property {'string' | 'number' | 'boolean' | 'json' | 'array'} type - Data type of value
 * @property {string} description - Human-readable description of setting purpose
 * @property {boolean} isReadOnly - Whether setting can be modified via UI
 * @property {boolean} isPublic - Whether setting is visible to non-admin users
 * @property {SettingValidation} [validation] - Validation rules for value
 * @property {string} createdAt - ISO timestamp of creation
 * @property {string} updatedAt - ISO timestamp of last update
 *
 * @remarks
 * **Read-Only Settings:**
 * System-critical settings should be marked read-only to prevent
 * accidental modification that could break the application.
 *
 * **Public vs Private:**
 * Public settings are accessible via API without admin auth.
 * Use carefully to avoid exposing sensitive configuration.
 *
 * **Validation:**
 * Optional validation rules enforce data integrity and prevent
 * invalid configuration values.
 *
 * @example
 * ```typescript
 * const timezoneSetting: SystemSetting = {
 *   id: 'set-123',
 *   key: 'app.timezone',
 *   value: 'America/New_York',
 *   category: 'general',
 *   type: 'string',
 *   description: 'Default timezone for the application',
 *   isReadOnly: false,
 *   isPublic: true,
 *   validation: {
 *     required: true,
 *     pattern: '^[A-Za-z]+/[A-Za-z_]+$'
 *   },
 *   createdAt: '2025-01-01T00:00:00Z',
 *   updatedAt: '2025-10-26T12:00:00Z'
 * };
 * ```
 *
 * @see {@link SettingValidation} for validation rules
 * @see {@link useSettings} for querying settings
 * @see {@link useUpdateSetting} for updating settings
 */
export interface SystemSetting {
  id: string;
  key: string;
  value: any;
  category: string;
  type: 'string' | 'number' | 'boolean' | 'json' | 'array';
  description: string;
  isReadOnly: boolean;
  isPublic: boolean;
  validation?: SettingValidation;
  createdAt: string;
  updatedAt: string;
}

export interface SettingValidation {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: string;
  allowedValues?: any[];
}

export interface SystemConfiguration {
  module: string;
  name: string;
  description: string;
  settings: SystemSetting[];
  isEnabled: boolean;
  version: string;
  dependencies?: string[];
  lastUpdated: string;
}

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

export interface AdminNotification {
  id: string;
  title: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR' | 'ALERT';
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
  category: string;
  recipients: NotificationRecipient[];
  channels: NotificationChannel[];
  status: 'DRAFT' | 'SENT' | 'DELIVERED' | 'READ' | 'FAILED';
  scheduledAt?: string;
  sentAt?: string;
  expiresAt?: string;
  actions?: NotificationAction[];
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationRecipient {
  userId: string;
  user?: AdminUser;
  status: 'PENDING' | 'SENT' | 'DELIVERED' | 'READ' | 'FAILED';
  readAt?: string;
  deliveredAt?: string;
}

export interface NotificationChannel {
  type: 'email' | 'sms' | 'push' | 'in-app';
  config?: Record<string, any>;
  status: 'PENDING' | 'SENT' | 'DELIVERED' | 'FAILED';
}

export interface NotificationAction {
  id: string;
  label: string;
  type: 'button' | 'link';
  url?: string;
  action?: string;
  style?: 'primary' | 'secondary' | 'danger';
}

export interface UserActivity {
  id: string;
  userId: string;
  sessionId: string;
  action: string;
  resource?: string;
  duration?: number;
  ipAddress: string;
  userAgent: string;
  location?: string;
  timestamp: string;
}

/**
 * System health monitoring information.
 *
 * Comprehensive health check data including overall system status,
 * individual service health, and performance metrics. Used for
 * monitoring dashboards and alerting.
 *
 * @property {'HEALTHY' | 'WARNING' | 'ERROR' | 'CRITICAL'} status - Overall system health status
 * @property {number} uptime - System uptime in seconds
 * @property {string} version - Application version string
 * @property {string} environment - Environment name ('production', 'staging', 'development')
 * @property {ServiceHealth[]} services - Health status of individual services
 * @property {SystemMetrics} metrics - Current system performance metrics
 * @property {string} lastChecked - ISO timestamp of last health check
 *
 * @remarks
 * **Status Levels:**
 * - `HEALTHY`: All services operational, metrics within normal range
 * - `WARNING`: Some services degraded or metrics approaching limits
 * - `ERROR`: One or more services down but system partially functional
 * - `CRITICAL`: System-wide failure or multiple critical services down
 *
 * **Monitoring Strategy:**
 * - Poll health endpoint every 30-60 seconds for dashboards
 * - Trigger alerts on WARNING or higher status
 * - Log all health checks for historical analysis
 * - Monitor trends in response times and error rates
 *
 * **Service Dependencies:**
 * Critical services (database, authentication) should trigger
 * ERROR/CRITICAL status when down. Non-critical services (email)
 * should trigger WARNING.
 *
 * @example
 * ```typescript
 * const health: SystemHealth = {
 *   status: 'HEALTHY',
 *   uptime: 8640000, // 100 days in seconds
 *   version: '2.5.0',
 *   environment: 'production',
 *   services: [
 *     {
 *       name: 'database',
 *       status: 'UP',
 *       responseTime: 15,
 *       errorRate: 0.001,
 *       lastChecked: '2025-10-26T14:30:00Z'
 *     },
 *     {
 *       name: 'authentication',
 *       status: 'UP',
 *       responseTime: 45,
 *       errorRate: 0.002,
 *       lastChecked: '2025-10-26T14:30:00Z'
 *     }
 *   ],
 *   metrics: {
 *     cpu: 45.2,
 *     memory: 68.5,
 *     disk: 72.0,
 *     network: {
 *       bytesIn: 1024000,
 *       bytesOut: 2048000
 *     },
 *     database: {
 *       connections: 25,
 *       responseTime: 12
 *     }
 *   },
 *   lastChecked: '2025-10-26T14:30:00Z'
 * };
 * ```
 *
 * @see {@link ServiceHealth} for individual service health
 * @see {@link SystemMetrics} for performance metrics
 * @see {@link useSystemHealth} for querying health status
 */
export interface SystemHealth {
  status: 'HEALTHY' | 'WARNING' | 'ERROR' | 'CRITICAL';
  uptime: number;
  version: string;
  environment: string;
  services: ServiceHealth[];
  metrics: SystemMetrics;
  lastChecked: string;
}

export interface ServiceHealth {
  name: string;
  status: 'UP' | 'DOWN' | 'DEGRADED';
  responseTime?: number;
  errorRate?: number;
  lastChecked: string;
  details?: Record<string, any>;
}

export interface SystemMetrics {
  cpu: number;
  memory: number;
  disk: number;
  network: {
    bytesIn: number;
    bytesOut: number;
  };
  database: {
    connections: number;
    responseTime: number;
  };
}

// ===========================================
// CACHE INVALIDATION UTILITIES
// ===========================================

/**
 * Invalidates all administration domain queries.
 *
 * Triggers refetch for all queries under the 'administration' domain.
 * Use this after bulk operations or when you need to refresh all admin data.
 *
 * @param {QueryClient} queryClient - TanStack Query client instance
 *
 * @remarks
 * This is a broad invalidation that affects all admin queries including
 * users, departments, settings, audit logs, and notifications. Use more
 * specific invalidation functions when possible for better performance.
 *
 * @example
 * ```typescript
 * import { useQueryClient } from '@tanstack/react-query';
 * import { invalidateAdministrationQueries } from './config';
 *
 * function BulkAdminOperation() {
 *   const queryClient = useQueryClient();
 *
 *   const handleBulkUpdate = async () => {
 *     await performBulkOperation();
 *     // Invalidate all admin data
 *     invalidateAdministrationQueries(queryClient);
 *   };
 * }
 * ```
 *
 * @see {@link invalidateUserQueries} for user-specific invalidation
 * @see {@link invalidateDepartmentQueries} for department-specific invalidation
 */
export const invalidateAdministrationQueries = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: ['administration'] });
};

/**
 * Invalidates all user-related queries.
 *
 * Triggers refetch for user lists, user details, roles, and permissions.
 * Call this after user CRUD operations to ensure UI reflects latest data.
 *
 * @param {QueryClient} queryClient - TanStack Query client instance
 *
 * @remarks
 * Invalidates queries with keys starting with ['administration', 'users'].
 * This includes user lists with various filters, individual user details,
 * user roles, and user permissions.
 *
 * @example
 * ```typescript
 * const { mutate: updateUser } = useUpdateUser({
 *   onSuccess: (data) => {
 *     invalidateUserQueries(queryClient);
 *     toast.success('User updated successfully');
 *   }
 * });
 * ```
 *
 * @see {@link useUsers} for user list queries
 * @see {@link useUserDetails} for individual user queries
 */
export const invalidateUserQueries = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: ADMINISTRATION_QUERY_KEYS.users });
};

/**
 * Invalidates all department-related queries.
 *
 * Triggers refetch for department lists, department details, and staff assignments.
 * Call this after department CRUD operations or staff changes.
 *
 * @param {QueryClient} queryClient - TanStack Query client instance
 *
 * @remarks
 * Invalidates queries with keys starting with ['administration', 'departments'].
 * This includes filtered department lists, individual department details,
 * and department staff assignments.
 *
 * @example
 * ```typescript
 * const { mutate: updateDepartment } = useUpdateDepartment({
 *   onSuccess: () => {
 *     invalidateDepartmentQueries(queryClient);
 *   }
 * });
 * ```
 *
 * @see {@link useDepartments} for department list queries
 * @see {@link useDepartmentDetails} for individual department queries
 */
export const invalidateDepartmentQueries = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: ADMINISTRATION_QUERY_KEYS.departments });
};

/**
 * Invalidates all settings and configuration queries.
 *
 * Triggers refetch for system settings and module configurations.
 * Call this after updating settings to ensure UI reflects changes.
 *
 * @param {QueryClient} queryClient - TanStack Query client instance
 *
 * @remarks
 * Invalidates queries with keys starting with ['administration', 'settings'].
 * This includes settings lists by category, individual settings by key,
 * and system configurations by module.
 *
 * @example
 * ```typescript
 * const { mutate: updateSetting } = useUpdateSetting({
 *   onSuccess: () => {
 *     invalidateSettingsQueries(queryClient);
 *   }
 * });
 * ```
 *
 * @see {@link useSettings} for settings list queries
 * @see {@link useSettingDetails} for individual setting queries
 */
export const invalidateSettingsQueries = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: ADMINISTRATION_QUERY_KEYS.settings });
};

/**
 * Invalidates all audit log queries.
 *
 * Triggers refetch for audit log lists and details. Generally not needed
 * as audit logs are append-only, but useful after bulk operations or
 * when needing to ensure latest compliance data is visible.
 *
 * @param {QueryClient} queryClient - TanStack Query client instance
 *
 * @remarks
 * Audit logs have a short stale time (2 minutes) by default for compliance.
 * This function is rarely needed as queries auto-refetch frequently.
 *
 * @example
 * ```typescript
 * // Refresh audit logs after security event
 * const handleSecurityEvent = async () => {
 *   await logSecurityEvent();
 *   invalidateAuditLogQueries(queryClient);
 * };
 * ```
 *
 * @see {@link useAuditLogs} for audit log queries
 */
export const invalidateAuditLogQueries = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: ADMINISTRATION_QUERY_KEYS.auditLogs });
};

/**
 * Invalidates all notification queries.
 *
 * Triggers refetch for notification lists and user-specific notifications.
 * Call this after creating, updating, or sending notifications.
 *
 * @param {QueryClient} queryClient - TanStack Query client instance
 *
 * @remarks
 * Notifications have a short stale time (1 minute) for freshness.
 * Invalidate after notification mutations to immediately reflect changes.
 *
 * @example
 * ```typescript
 * const { mutate: sendNotification } = useSendNotification({
 *   onSuccess: () => {
 *     invalidateNotificationQueries(queryClient);
 *     toast.success('Notification sent successfully');
 *   }
 * });
 * ```
 *
 * @see {@link useNotifications} for notification list queries
 * @see {@link useUserNotifications} for user-specific notifications
 */
export const invalidateNotificationQueries = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: ADMINISTRATION_QUERY_KEYS.notifications });
};
