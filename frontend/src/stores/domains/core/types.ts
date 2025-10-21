/**
 * Core Domain Types
 * 
 * Type definitions specific to the core domain including authentication,
 * user management, and system configuration types.
 */

// ==========================================
// USER AUTHENTICATION TYPES
// ==========================================

/**
 * User role enumeration
 */
export type UserRole = 
  | 'guest'
  | 'parent'
  | 'teacher'
  | 'nurse'
  | 'head_nurse'
  | 'admin'
  | 'district_admin'
  | 'super_admin';

/**
 * Authentication status
 */
export type AuthStatus = 
  | 'loading'
  | 'authenticated'
  | 'unauthenticated'
  | 'error';

/**
 * User permission level
 */
export interface UserPermission {
  resource: string;
  actions: string[];
  conditions?: Record<string, any>;
}

/**
 * User profile information
 */
export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  role: UserRole;
  schoolId?: string;
  avatar?: string;
}

/**
 * Authentication state summary
 */
export interface AuthStatusSummary {
  isAuthenticated: boolean;
  isLoading: boolean;
  hasError: boolean;
  error: string | null;
  status: AuthStatus;
}

// ==========================================
// ROLE-BASED ACCESS CONTROL TYPES
// ==========================================

/**
 * Resource access configuration
 */
export interface ResourceAccess {
  resource: string;
  allowedRoles: UserRole[];
  conditions?: Record<string, any>;
}

/**
 * Role hierarchy level
 */
export interface RoleHierarchy {
  role: UserRole;
  level: number;
  inheritsFrom?: UserRole[];
}

/**
 * Access control result
 */
export interface AccessControlResult {
  granted: boolean;
  reason?: string;
  requiredRole?: UserRole;
  userRole?: UserRole;
}

// ==========================================
// SYSTEM CONFIGURATION TYPES
// ==========================================

/**
 * System settings category
 */
export type SettingsCategory = 
  | 'general'
  | 'security'
  | 'notifications'
  | 'integrations'
  | 'compliance';

/**
 * System setting definition
 */
export interface SystemSetting {
  key: string;
  value: any;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  category: SettingsCategory;
  description?: string;
  validation?: {
    required?: boolean;
    min?: number;
    max?: number;
    pattern?: string;
  };
}

/**
 * Settings group
 */
export interface SettingsGroup {
  category: SettingsCategory;
  label: string;
  description?: string;
  settings: SystemSetting[];
}

// ==========================================
// SESSION MANAGEMENT TYPES
// ==========================================

/**
 * Session information
 */
export interface SessionInfo {
  sessionId: string;
  userId: string;
  startTime: Date;
  lastActivity: Date;
  expiresAt: Date;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Session timeout configuration
 */
export interface SessionTimeout {
  warningMinutes: number;
  timeoutMinutes: number;
  extendable: boolean;
}

// ==========================================
// AUDIT AND LOGGING TYPES
// ==========================================

/**
 * Audit event type
 */
export type AuditEventType = 
  | 'login'
  | 'logout'
  | 'password_change'
  | 'role_change'
  | 'permission_grant'
  | 'permission_revoke'
  | 'settings_change'
  | 'data_access'
  | 'data_modification';

/**
 * Audit log entry
 */
export interface AuditLogEntry {
  id: string;
  userId: string;
  eventType: AuditEventType;
  resource?: string;
  action: string;
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, any>;
}

// ==========================================
// API RESPONSE TYPES
// ==========================================

/**
 * Login response
 */
export interface LoginResponse {
  user: UserProfile;
  token: string;
  refreshToken: string;
  expiresAt: string;
}

/**
 * User creation/update payload
 */
export interface UserPayload {
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  schoolId?: string;
  password?: string;
}

/**
 * Settings update payload
 */
export interface SettingsPayload {
  category: SettingsCategory;
  settings: Record<string, any>;
}

// ==========================================
// HOOK RETURN TYPES
// ==========================================

/**
 * Authentication hook return type
 */
export interface UseAuthReturn {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  status: AuthStatusSummary;
  login: (credentials: any) => Promise<any>;
  register: (data: any) => Promise<any>;
  logout: () => void;
  refresh: () => Promise<any>;
}

/**
 * Role access hook return type
 */
export interface UseRoleAccessReturn {
  role: UserRole | null;
  isAdmin: boolean;
  isNurse: boolean;
  hasRole: (requiredRole: string) => boolean;
  canAccess: (resource: string) => boolean;
}

/**
 * Authenticated user hook return type
 */
export interface UseAuthenticatedUserReturn extends UseAuthReturn, UseRoleAccessReturn {
  isReady: boolean;
}

/**
 * Require auth hook return type
 */
export interface UseRequireAuthReturn {
  isAuthenticated: boolean;
  hasPermission: boolean;
  isLoading: boolean;
  canAccess: boolean;
  shouldRedirect: boolean;
}