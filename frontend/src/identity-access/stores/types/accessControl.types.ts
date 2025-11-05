/**
 * @fileoverview Type Definitions for Access Control Slice
 * @module stores/types/accessControl.types
 *
 * Comprehensive type definitions to replace 'any' types throughout
 * the access control slice. Ensures type safety and better IDE support.
 */

/**
 * Base entity interface with common fields
 */
interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Role entity representing a system role
 */
export interface Role extends BaseEntity {
  name: string;
  description: string;
  isActive: boolean;
  department?: string;
  permissions: string[];
}

/**
 * Permission entity
 */
export interface Permission extends BaseEntity {
  name: string;
  resource: string;
  action: string;
  description?: string;
  category?: string;
}

/**
 * Security incident entity
 */
export interface SecurityIncident extends BaseEntity {
  type: SecurityIncidentType;
  severity: SecurityIncidentSeverity;
  description: string;
  userId: string;
  resourceAccessed?: string;
  ipAddress?: string;
  userAgent?: string;
  status: SecurityIncidentStatus;
  resolvedAt?: string;
  resolvedBy?: string;
  notes?: string;
}

/**
 * Security incident types
 */
export type SecurityIncidentType =
  | 'UNAUTHORIZED_ACCESS'
  | 'FAILED_LOGIN'
  | 'SUSPICIOUS_ACTIVITY'
  | 'DATA_BREACH'
  | 'POLICY_VIOLATION'
  | 'MALWARE_DETECTED'
  | 'PHISHING_ATTEMPT'
  | 'OTHER';

/**
 * Security incident severity levels
 */
export type SecurityIncidentSeverity =
  | 'CRITICAL'
  | 'HIGH'
  | 'MEDIUM'
  | 'LOW'
  | 'INFO';

/**
 * Security incident status
 */
export type SecurityIncidentStatus =
  | 'OPEN'
  | 'INVESTIGATING'
  | 'RESOLVED'
  | 'CLOSED'
  | 'FALSE_POSITIVE';

/**
 * User session entity
 */
export interface UserSession extends BaseEntity {
  userId: string;
  token: string;
  ipAddress: string;
  userAgent: string;
  isActive: boolean;
  expiresAt: string;
  lastActivityAt: string;
}

/**
 * IP restriction entity
 */
export interface IpRestriction extends BaseEntity {
  ipRange: string;
  description: string;
  allowedRoles: string[];
  isActive: boolean;
}

/**
 * Role-permission assignment
 */
export interface RolePermission {
  roleId: string;
  permissionId: string;
  grantedAt: string;
  grantedBy?: string;
}

/**
 * User-role assignment
 */
export interface UserRole {
  userId: string;
  roleId: string;
  assignedAt: string;
  assignedBy?: string;
  startDate?: string;
  endDate?: string;
}

/**
 * Permission check result
 */
export interface PermissionCheckResult {
  userId: string;
  resource: string;
  action: string;
  hasPermission: boolean;
  reason?: string;
}

/**
 * Access control statistics
 */
export interface AccessControlStatistics {
  totalRoles: number;
  activeRoles: number;
  totalPermissions: number;
  totalUsers: number;
  activeUsers: number;
  recentIncidents: number;
  criticalIncidents: number;
  activeSessions: number;
  securityScore: number;
}

/**
 * Incident filters
 */
export interface IncidentFilters {
  severity?: SecurityIncidentSeverity;
  type?: SecurityIncidentType;
  userId?: string;
  startDate?: string;
  endDate?: string;
  status?: SecurityIncidentStatus;
}

/**
 * Session filters
 */
export interface SessionFilters {
  userId?: string;
  isActive?: boolean;
}

/**
 * Pagination info
 */
export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages?: number;
}

/**
 * Notification
 */
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  timestamp: string;
  read?: boolean;
}

/**
 * API response wrapper
 */
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
  success: boolean;
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
  items: T[];
  pagination: PaginationInfo;
}

/**
 * Role creation payload
 */
export interface CreateRolePayload {
  name: string;
  description: string;
  permissions?: string[];
  isActive?: boolean;
  department?: string;
}

/**
 * Role update payload
 */
export interface UpdateRolePayload {
  name?: string;
  description?: string;
  permissions?: string[];
  isActive?: boolean;
  department?: string;
}

/**
 * Permission creation payload
 */
export interface CreatePermissionPayload {
  name: string;
  resource: string;
  action: string;
  description?: string;
  category?: string;
}

/**
 * Security incident creation payload
 */
export interface CreateSecurityIncidentPayload {
  type: SecurityIncidentType;
  severity: SecurityIncidentSeverity;
  description: string;
  userId: string;
  resourceAccessed?: string;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Security incident update payload
 */
export interface UpdateSecurityIncidentPayload {
  status?: SecurityIncidentStatus;
  description?: string;
  notes?: string;
  resolvedBy?: string;
}

/**
 * IP restriction creation payload
 */
export interface CreateIpRestrictionPayload {
  ipRange: string;
  description: string;
  allowedRoles: string[];
  isActive?: boolean;
}

/**
 * Async thunk argument types
 */
export interface UpdateRoleArgs {
  id: string;
  updates: UpdateRolePayload;
}

export interface UpdateSecurityIncidentArgs {
  id: string;
  updates: UpdateSecurityIncidentPayload;
}

export interface AssignPermissionArgs {
  roleId: string;
  permissionId: string;
}

export interface RemovePermissionArgs {
  roleId: string;
  permissionId: string;
}

export interface AssignRoleArgs {
  userId: string;
  roleId: string;
}

export interface RemoveRoleArgs {
  userId: string;
  roleId: string;
}

export interface CheckPermissionArgs {
  userId: string;
  resource: string;
  action: string;
}

export interface SecurityIncidentQueryParams {
  severity?: SecurityIncidentSeverity;
  type?: SecurityIncidentType;
  status?: SecurityIncidentStatus;
  userId?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}
