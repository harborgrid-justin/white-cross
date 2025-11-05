/**
 * @fileoverview Access Control Type Definitions
 * @module identity-access/types/access-control
 *
 * Comprehensive TypeScript type definitions for the access control system.
 * Replaces all 'any' types with proper type safety.
 */

// ==========================================
// ROLE TYPES
// ==========================================

/**
 * Role entity representing a user role with permissions
 */
export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  isActive: boolean;
  department?: string;
  hierarchy?: number; // For role precedence (e.g., Admin > Nurse > Student)
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}

/**
 * Role creation data (subset of Role)
 */
export interface CreateRoleData {
  name: string;
  description: string;
  permissions?: string[];
  isActive?: boolean;
  department?: string;
  hierarchy?: number;
}

/**
 * Role update data (partial Role)
 */
export interface UpdateRoleData {
  name?: string;
  description?: string;
  permissions?: string[];
  isActive?: boolean;
  department?: string;
  hierarchy?: number;
}

// ==========================================
// PERMISSION TYPES
// ==========================================

/**
 * Permission resource types
 */
export type PermissionResource =
  | 'patient_records'
  | 'health_records'
  | 'medications'
  | 'appointments'
  | 'students'
  | 'staff'
  | 'reports'
  | 'settings'
  | 'audit_logs'
  | 'roles'
  | 'permissions';

/**
 * Permission action types (CRUD + special actions)
 */
export type PermissionAction =
  | 'create'
  | 'read'
  | 'update'
  | 'delete'
  | 'export'
  | 'approve'
  | 'administer';

/**
 * Permission entity
 */
export interface Permission {
  id: string;
  resource: PermissionResource;
  action: PermissionAction;
  description: string;
  isSystem?: boolean; // System permissions cannot be deleted
  createdAt: string;
  updatedAt: string;
}

/**
 * Permission creation data
 */
export interface CreatePermissionData {
  resource: PermissionResource;
  action: PermissionAction;
  description: string;
  isSystem?: boolean;
}

/**
 * Role-Permission assignment
 */
export interface RolePermission {
  roleId: string;
  permissionId: string;
  assignedAt: string;
  assignedBy?: string;
}

/**
 * User-Role assignment
 */
export interface UserRole {
  userId: string;
  roleId: string;
  assignedAt: string;
  assignedBy?: string;
  expiresAt?: string; // Optional expiration for temporary roles
}

// ==========================================
// SECURITY INCIDENT TYPES
// ==========================================

/**
 * Security incident severity levels
 */
export type IncidentSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

/**
 * Security incident types
 */
export type IncidentType =
  | 'UNAUTHORIZED_ACCESS'
  | 'SUSPICIOUS_ACTIVITY'
  | 'POLICY_VIOLATION'
  | 'DATA_BREACH'
  | 'FAILED_LOGIN'
  | 'PRIVILEGE_ESCALATION'
  | 'UNUSUAL_PATTERN'
  | 'OTHER';

/**
 * Security incident status
 */
export type IncidentStatus =
  | 'OPEN'
  | 'INVESTIGATING'
  | 'RESOLVED'
  | 'DISMISSED'
  | 'ESCALATED';

/**
 * Security incident entity
 */
export interface SecurityIncident {
  id: string;
  type: IncidentType;
  severity: IncidentSeverity;
  status: IncidentStatus;
  userId: string;
  userName?: string; // Denormalized for display
  description: string;
  resourceAccessed: string;
  ipAddress: string;
  userAgent?: string;
  timestamp: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  resolvedBy?: string;
  resolutionNotes?: string;
  metadata?: Record<string, unknown>; // Additional context
}

/**
 * Security incident creation data
 */
export interface CreateSecurityIncidentData {
  type: IncidentType;
  severity: IncidentSeverity;
  userId: string;
  description: string;
  resourceAccessed: string;
  ipAddress: string;
  userAgent?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Security incident update data
 */
export interface UpdateSecurityIncidentData {
  status?: IncidentStatus;
  severity?: IncidentSeverity;
  resolutionNotes?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Security incident filters
 */
export interface SecurityIncidentFilters {
  severity?: IncidentSeverity;
  type?: IncidentType;
  status?: IncidentStatus;
  userId?: string;
  startDate?: string;
  endDate?: string;
}

// ==========================================
// SESSION TYPES
// ==========================================

/**
 * User session entity
 */
export interface UserSession {
  id: string;
  token: string; // Session token (hashed)
  userId: string;
  userName?: string; // Denormalized for display
  ipAddress: string;
  userAgent: string;
  isActive: boolean;
  lastActivityAt: string;
  expiresAt: string;
  createdAt: string;
  deviceInfo?: {
    browser?: string;
    os?: string;
    device?: string;
  };
}

/**
 * Session filters
 */
export interface SessionFilters {
  userId?: string;
  isActive?: boolean;
  ipAddress?: string;
}

// ==========================================
// IP RESTRICTION TYPES
// ==========================================

/**
 * IP restriction entity
 */
export interface IpRestriction {
  id: string;
  ipRange: string; // CIDR notation (e.g., "10.0.0.0/24")
  description: string;
  allowedRoles: string[]; // Role IDs that can access from this IP range
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
}

/**
 * IP restriction creation data
 */
export interface CreateIpRestrictionData {
  ipRange: string;
  description: string;
  allowedRoles: string[];
  isActive?: boolean;
}

// ==========================================
// STATISTICS & METRICS TYPES
// ==========================================

/**
 * Access control statistics
 */
export interface AccessControlStatistics {
  totalRoles: number;
  activeRoles: number;
  totalPermissions: number;
  totalUsers: number;
  activeSessions: number;
  incidentSummary: {
    total: number;
    open: number;
    critical: number;
    last24Hours: number;
  };
  sessionSummary: {
    total: number;
    active: number;
    averageDuration: number; // in minutes
  };
  permissionSummary: {
    mostUsed: Array<{ permission: string; count: number }>;
    leastUsed: Array<{ permission: string; count: number }>;
  };
  securityScore: number; // 0-100 health score
  lastUpdated: string;
}

// ==========================================
// PAGINATION TYPES
// ==========================================

/**
 * Pagination parameters
 */
export interface PaginationParams {
  page: number;
  limit: number;
  total: number;
}

/**
 * Paginated response wrapper
 */
export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// ==========================================
// API RESPONSE TYPES
// ==========================================

/**
 * Standard API response
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Role API responses
 */
export interface RolesResponse {
  roles: Role[];
  total?: number;
}

export interface RoleResponse {
  role: Role;
}

/**
 * Permission API responses
 */
export interface PermissionsResponse {
  permissions: Permission[];
  total?: number;
}

export interface PermissionResponse {
  permission: Permission;
}

/**
 * Security incident API responses
 */
export interface SecurityIncidentsResponse {
  incidents: SecurityIncident[];
  pagination?: PaginationParams;
  total?: number;
}

export interface SecurityIncidentResponse {
  incident: SecurityIncident;
}

/**
 * Session API responses
 */
export interface SessionsResponse {
  sessions: UserSession[];
  total?: number;
}

/**
 * IP restriction API responses
 */
export interface IpRestrictionsResponse {
  restrictions: IpRestriction[];
  total?: number;
}

export interface IpRestrictionResponse {
  restriction: IpRestriction;
}

/**
 * Statistics API response
 */
export interface StatisticsResponse extends AccessControlStatistics {}

/**
 * User permissions response
 */
export interface UserPermissionsResponse {
  userId: string;
  permissions: string[];
  roles: Role[];
}

/**
 * Permission check response
 */
export interface PermissionCheckResponse {
  userId: string;
  resource: string;
  action: string;
  hasPermission: boolean;
  reason?: string; // Why permission was granted/denied
}

// ==========================================
// NOTIFICATION TYPES
// ==========================================

/**
 * Notification types
 */
export type NotificationType = 'success' | 'error' | 'warning' | 'info';

/**
 * Notification entity
 */
export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  timestamp: string;
  read?: boolean;
  actions?: Array<{
    label: string;
    action: string;
  }>;
}

// ==========================================
// PERMISSION CHECK TYPES
// ==========================================

/**
 * Permission check request
 */
export interface PermissionCheckRequest {
  userId: string;
  resource: PermissionResource;
  action: PermissionAction;
}

/**
 * Role assignment request
 */
export interface RoleAssignmentRequest {
  userId: string;
  roleId: string;
  expiresAt?: string;
}

/**
 * Permission assignment request
 */
export interface PermissionAssignmentRequest {
  roleId: string;
  permissionId: string;
}
