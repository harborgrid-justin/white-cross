/**
 * @fileoverview Access Control Type Definitions
 * @module stores/types/accessControl
 * 
 * Comprehensive type definitions for the access control system including
 * RBAC, permissions, security incidents, and session management.
 * 
 * Enterprise-grade type safety for healthcare compliance and security.
 */

// ==========================================
// CORE DOMAIN TYPES
// ==========================================

/**
 * User role enumeration matching backend RBAC system
 */
export type UserRole =
  | 'SUPER_ADMIN'
  | 'ADMIN'
  | 'DISTRICT_ADMIN'
  | 'SCHOOL_ADMIN'
  | 'SCHOOL_NURSE'
  | 'NURSE'
  | 'OFFICE_STAFF'
  | 'STAFF'
  | 'COUNSELOR'
  | 'VIEWER';

/**
 * Security incident severity levels
 */
export type IncidentSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

/**
 * Security incident types
 */
export type IncidentType =
  | 'UNAUTHORIZED_ACCESS'
  | 'FAILED_LOGIN'
  | 'PRIVILEGE_ESCALATION'
  | 'DATA_BREACH'
  | 'POLICY_VIOLATION'
  | 'SUSPICIOUS_ACTIVITY'
  | 'SYSTEM_COMPROMISE'
  | 'MALWARE_DETECTION';

/**
 * Notification types
 */
export type NotificationType = 'success' | 'error' | 'warning' | 'info';

// ==========================================
// ENTITY INTERFACES
// ==========================================

/**
 * Role entity representing a collection of permissions
 */
export interface Role {
  readonly id: string;
  name: string;
  description: string;
  permissions: string[];
  isActive: boolean;
  readonly isSystem: boolean;
  department?: string;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly createdBy: string;
  readonly updatedBy: string;
}

/**
 * Permission entity representing a specific access right
 */
export interface Permission {
  readonly id: string;
  name: string;
  readonly resource: string;
  readonly action: string;
  description: string;
  isActive: boolean;
  readonly createdAt: string;
  readonly updatedAt: string;
}

/**
 * Security incident entity for audit and compliance
 */
export interface SecurityIncident {
  readonly id: string;
  readonly type: IncidentType;
  severity: IncidentSeverity;
  readonly description: string;
  readonly userId: string;
  readonly userEmail?: string;
  readonly resourceAccessed?: string;
  readonly ipAddress: string;
  readonly userAgent?: string;
  readonly location?: string;
  isResolved: boolean;
  resolvedBy?: string;
  resolvedAt?: string;
  notes?: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}

/**
 * User session entity for session management
 */
export interface UserSession {
  readonly id: string;
  readonly userId: string;
  readonly userEmail: string;
  readonly token: string;
  readonly ipAddress: string;
  readonly userAgent: string;
  readonly location?: string;
  readonly isActive: boolean;
  readonly lastActivityAt: string;
  readonly expiresAt: string;
  readonly createdAt: string;
}

/**
 * IP restriction entity for network-based access control
 */
export interface IpRestriction {
  readonly id: string;
  readonly ipRange: string;
  description: string;
  allowedRoles: UserRole[];
  isActive: boolean;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly createdBy: string;
}

/**
 * Role-Permission relationship entity
 */
export interface RolePermission {
  readonly id: string;
  readonly roleId: string;
  readonly permissionId: string;
  readonly grantedAt: string;
  readonly grantedBy: string;
}

/**
 * User-Role relationship entity
 */
export interface UserRoleAssignment {
  readonly id: string;
  readonly userId: string;
  readonly roleId: string;
  readonly assignedAt: string; 
  readonly assignedBy: string;
  readonly expiresAt?: string;
}

/**
 * Access control statistics for dashboard
 */
export interface AccessControlStatistics {
  readonly totalUsers: number;
  readonly activeUsers: number;
  readonly totalRoles: number;
  readonly activeRoles: number;
  readonly totalPermissions: number;
  readonly totalIncidents: number;
  readonly criticalIncidents: number;
  readonly recentIncidents: number;
  readonly activeSessions: number;
  readonly ipRestrictions: number;
  readonly lastUpdated: string;
}

/**
 * Notification entity for user feedback
 */
export interface Notification {
  readonly id: string;
  readonly type: NotificationType;
  readonly title: string;
  readonly message: string;
  readonly timestamp: string;
  readonly isRead?: boolean;
  readonly actionUrl?: string;
  readonly actionLabel?: string;
}

// ==========================================
// PAGINATION & FILTERING
// ==========================================

/**
 * Pagination information
 */
export interface PaginationInfo {
  readonly page: number;
  readonly limit: number;
  readonly total: number;
  readonly totalPages?: number;
}

/**
 * Security incident filters
 */
export interface IncidentFilters {
  readonly severity?: IncidentSeverity;
  readonly type?: IncidentType;
  readonly userId?: string;
  readonly startDate?: string;
  readonly endDate?: string;
  readonly isResolved?: boolean;
}

/**
 * Session filters
 */
export interface SessionFilters {
  readonly userId?: string;
  readonly isActive?: boolean;
  readonly ipAddress?: string;
  readonly startDate?: string;
  readonly endDate?: string;
}

// ==========================================
// API PAYLOAD TYPES
// ==========================================

/**
 * Role creation payload
 */
export interface CreateRolePayload {
  readonly name: string;
  readonly description: string;
  readonly permissions?: string[];
  readonly isActive?: boolean;
  readonly department?: string;
}

/**
 * Role update payload
 */
export interface UpdateRolePayload {
  readonly name?: string;
  readonly description?: string;
  readonly permissions?: string[];
  readonly isActive?: boolean;
  readonly department?: string;
}

/**
 * Permission creation payload
 */
export interface CreatePermissionPayload {
  readonly name: string;
  readonly resource: string;
  readonly action: string;
  readonly description: string;
  readonly isActive?: boolean;
}

/**
 * Security incident creation payload
 */
export interface CreateSecurityIncidentPayload {
  readonly type: IncidentType;
  readonly severity: IncidentSeverity;
  readonly description: string;
  readonly userId: string;
  readonly resourceAccessed?: string;
  readonly ipAddress: string;
  readonly userAgent?: string;
  readonly location?: string;
}

/**
 * Security incident update payload
 */
export interface UpdateSecurityIncidentPayload {
  readonly isResolved?: boolean;
  readonly notes?: string;
  readonly severity?: IncidentSeverity;
}

/**
 * IP restriction creation payload
 */
export interface CreateIpRestrictionPayload {
  readonly ipRange: string;
  readonly description: string;
  readonly allowedRoles: UserRole[];
  readonly isActive?: boolean;
}

// ==========================================
// THUNK ARGUMENT TYPES
// ==========================================

/**
 * Update role arguments
 */
export interface UpdateRoleArgs {
  readonly id: string;
  readonly updates: UpdateRolePayload;
}

/**
 * Update security incident arguments
 */
export interface UpdateSecurityIncidentArgs {
  readonly id: string;
  readonly updates: UpdateSecurityIncidentPayload;
}

/**
 * Assign permission to role arguments
 */
export interface AssignPermissionArgs {
  readonly roleId: string;
  readonly permissionId: string;
}

/**
 * Remove permission from role arguments
 */
export interface RemovePermissionArgs {
  readonly roleId: string;
  readonly permissionId: string;
}

/**
 * Assign role to user arguments
 */
export interface AssignRoleArgs {
  readonly userId: string;
  readonly roleId: string;
  readonly expiresAt?: string;
}

/**
 * Remove role from user arguments
 */
export interface RemoveRoleArgs {
  readonly userId: string;
  readonly roleId: string;
}

/**
 * Check permission arguments
 */
export interface CheckPermissionArgs {
  readonly userId: string;
  readonly resource: string;
  readonly action: string;
}

/**
 * Permission check result
 */
export interface PermissionCheckResult {
  readonly userId: string;
  readonly resource: string;
  readonly action: string;
  readonly hasPermission: boolean;
}

/**
 * Security incident query parameters
 */
export interface SecurityIncidentQueryParams {
  readonly page?: number;
  readonly limit?: number;
  readonly severity?: IncidentSeverity;
  readonly type?: IncidentType;
  readonly userId?: string;
  readonly startDate?: string;
  readonly endDate?: string;
  readonly isResolved?: boolean;
}

// ==========================================
// API RESPONSE TYPES
// ==========================================

/**
 * Generic API response wrapper
 */
export interface ApiResponse<T> {
  readonly success: boolean;
  readonly data: T;
  readonly message?: string;
  readonly error?: string;
}

/**
 * Paginated API response
 */
export interface PaginatedResponse<T> {
  readonly data: readonly T[];
  readonly pagination: PaginationInfo;
  readonly success: boolean;
  readonly message?: string;
}

/**
 * Roles API response
 */
export interface RolesResponse {
  readonly roles: readonly Role[];
  readonly total?: number;
}

/**
 * Single role API response
 */
export interface RoleResponse {
  readonly role: Role;
}

/**
 * Permissions API response
 */
export interface PermissionsResponse {
  readonly permissions: readonly Permission[];
  readonly total?: number;
}

/**
 * Single permission API response
 */
export interface PermissionResponse {
  readonly permission: Permission;
}

/**
 * Security incidents API response
 */
export interface SecurityIncidentsResponse {
  readonly incidents: readonly SecurityIncident[];
  readonly pagination?: PaginationInfo;
  readonly total?: number;
}

/**
 * Single security incident API response
 */
export interface SecurityIncidentResponse {
  readonly incident: SecurityIncident;
}

/**
 * User sessions API response
 */
export interface UserSessionsResponse {
  readonly sessions: readonly UserSession[];
  readonly total?: number;
}

/**
 * IP restrictions API response
 */
export interface IpRestrictionsResponse {
  readonly restrictions: readonly IpRestriction[];
  readonly total?: number;
}

/**
 * Single IP restriction API response
 */
export interface IpRestrictionResponse {
  readonly restriction: IpRestriction;
}

/**
 * User permissions API response
 */
export interface UserPermissionsResponse {
  readonly permissions: readonly string[];
  readonly roles: readonly string[];
  readonly userId: string;
}

/**
 * Permission check API response
 */
export interface PermissionCheckResponse {
  readonly hasPermission: boolean;
  readonly reason?: string;
}

/**
 * Role permission assignment response
 */
export interface RolePermissionResponse {
  readonly rolePermission: RolePermission;
}

/**
 * User role assignment response
 */
export interface UserRoleResponse {
  readonly userRole: UserRoleAssignment;
}

/**
 * Statistics API response
 */
export interface StatisticsResponse {
  readonly statistics: AccessControlStatistics;
  readonly success: boolean;
  readonly message?: string;
}

/**
 * Initialize default roles response
 */
export interface InitializeDefaultRolesResponse {
  readonly roles: readonly Role[];
  readonly message: string;
}

// ==========================================
// TYPE GUARDS
// ==========================================

/**
 * Type guard for Role
 */
export function isRole(obj: unknown): obj is Role {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof (obj as Role).id === 'string' &&
    typeof (obj as Role).name === 'string' &&
    typeof (obj as Role).isActive === 'boolean'
  );
}

/**
 * Type guard for Permission
 */
export function isPermission(obj: unknown): obj is Permission {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof (obj as Permission).id === 'string' &&
    typeof (obj as Permission).name === 'string' &&
    typeof (obj as Permission).resource === 'string' &&
    typeof (obj as Permission).action === 'string'
  );
}

/**
 * Type guard for SecurityIncident
 */
export function isSecurityIncident(obj: unknown): obj is SecurityIncident {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof (obj as SecurityIncident).id === 'string' &&
    typeof (obj as SecurityIncident).type === 'string' &&
    typeof (obj as SecurityIncident).severity === 'string' &&
    typeof (obj as SecurityIncident).userId === 'string'
  );
}

/**
 * Type guard for UserSession
 */
export function isUserSession(obj: unknown): obj is UserSession {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof (obj as UserSession).id === 'string' &&
    typeof (obj as UserSession).userId === 'string' &&
    typeof (obj as UserSession).token === 'string' &&
    typeof (obj as UserSession).isActive === 'boolean'
  );
}

// ==========================================
// UTILITY TYPES
// ==========================================

/**
 * Extract keys from Role that can be updated
 */
export type UpdatableRoleFields = keyof Pick<Role, 'name' | 'description' | 'isActive' | 'department'>;

/**
 * Extract keys from SecurityIncident that can be updated
 */
export type UpdatableIncidentFields = keyof Pick<SecurityIncident, 'isResolved' | 'notes' | 'severity'>;

/**
 * Create a partial type for filters
 */
export type PartialFilters<T> = {
  readonly [K in keyof T]?: T[K];
};

/**
 * Create a mutable version of readonly types for form handling
 */
export type Mutable<T> = {
  -readonly [K in keyof T]: T[K];
};

/**
 * Extract the data type from an API response
 */
export type ExtractApiData<T> = T extends ApiResponse<infer U> ? U : never;

/**
 * Make specific fields optional
 */
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * Make specific fields required
 */
export type Required<T, K extends keyof T> = T & {
  [P in K]-?: T[P];
};
