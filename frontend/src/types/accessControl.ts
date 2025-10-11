/**
 * Access Control & Security Types
 * Comprehensive type definitions for Role-Based Access Control (RBAC),
 * session management, security incidents, and IP restrictions
 */

// ============================================================================
// ENUMS - Security & Access Control
// ============================================================================

/**
 * Security incident types
 */
export enum SecurityIncidentType {
  UNAUTHORIZED_ACCESS = 'UNAUTHORIZED_ACCESS',
  DATA_BREACH = 'DATA_BREACH',
  FAILED_LOGIN_ATTEMPTS = 'FAILED_LOGIN_ATTEMPTS',
  SUSPICIOUS_ACTIVITY = 'SUSPICIOUS_ACTIVITY',
  MALWARE = 'MALWARE',
  PHISHING = 'PHISHING',
  POLICY_VIOLATION = 'POLICY_VIOLATION',
  OTHER = 'OTHER',
}

/**
 * Security incident severity levels
 */
export enum IncidentSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

/**
 * Security incident status
 */
export enum SecurityIncidentStatus {
  OPEN = 'OPEN',
  INVESTIGATING = 'INVESTIGATING',
  CONTAINED = 'CONTAINED',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
}

/**
 * IP restriction types (whitelist or blacklist)
 */
export enum IpRestrictionType {
  WHITELIST = 'WHITELIST',
  BLACKLIST = 'BLACKLIST',
}

/**
 * Session status
 */
export enum SessionStatus {
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  INVALIDATED = 'INVALIDATED',
}

// ============================================================================
// CORE RBAC TYPES
// ============================================================================

/**
 * Role - Represents a user role with associated permissions
 */
export interface Role {
  id: string;
  name: string;
  description?: string;
  isSystem: boolean;
  permissions?: RolePermission[];
  userRoles?: UserRoleAssignment[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Permission - Represents a specific permission for a resource action
 */
export interface Permission {
  id: string;
  resource: string;
  action: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * RolePermission - Junction table linking roles to permissions
 */
export interface RolePermission {
  id: string;
  roleId: string;
  permissionId: string;
  role?: Role;
  permission?: Permission;
  createdAt: string;
  updatedAt: string;
}

/**
 * UserRoleAssignment - Assigns roles to users
 */
export interface UserRoleAssignment {
  id: string;
  userId: string;
  roleId: string;
  role?: Role;
  assignedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// SESSION MANAGEMENT TYPES
// ============================================================================

/**
 * Session - Represents an active user session
 */
export interface Session {
  id: string;
  userId: string;
  token: string;
  ipAddress?: string;
  userAgent?: string;
  expiresAt: string;
  lastActivity: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * LoginAttempt - Tracks login attempts for security monitoring
 */
export interface LoginAttempt {
  id: string;
  email: string;
  success: boolean;
  ipAddress?: string;
  userAgent?: string;
  failureReason?: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// SECURITY INCIDENT TYPES
// ============================================================================

/**
 * SecurityIncident - Represents a security incident or breach
 */
export interface SecurityIncident {
  id: string;
  type: SecurityIncidentType | string;
  severity: IncidentSeverity | string;
  description: string;
  affectedResources: string[];
  detectedBy?: string;
  status: SecurityIncidentStatus | string;
  resolvedAt?: string;
  resolvedBy?: string;
  resolution?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * IpRestriction - IP address whitelist or blacklist entry
 */
export interface IpRestriction {
  id: string;
  ipAddress: string;
  type: IpRestrictionType | string;
  reason?: string;
  isActive: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// INPUT/CREATE DATA TYPES
// ============================================================================

/**
 * CreateRoleData - Data required to create a new role
 */
export interface CreateRoleData {
  name: string;
  description?: string;
}

/**
 * UpdateRoleData - Data for updating an existing role
 */
export interface UpdateRoleData {
  name?: string;
  description?: string;
}

/**
 * CreatePermissionData - Data required to create a new permission
 */
export interface CreatePermissionData {
  resource: string;
  action: string;
  description?: string;
}

/**
 * CreateSessionData - Data required to create a new session
 */
export interface CreateSessionData {
  userId: string;
  token: string;
  ipAddress?: string;
  userAgent?: string;
  expiresAt: Date | string;
}

/**
 * LogLoginAttemptData - Data for logging a login attempt
 */
export interface LogLoginAttemptData {
  email: string;
  success: boolean;
  ipAddress?: string;
  userAgent?: string;
  failureReason?: string;
}

/**
 * CreateSecurityIncidentData - Data required to create a security incident
 */
export interface CreateSecurityIncidentData {
  type: SecurityIncidentType | string;
  severity: IncidentSeverity | string;
  description: string;
  affectedResources?: string[];
  detectedBy?: string;
}

/**
 * UpdateSecurityIncidentData - Data for updating a security incident
 */
export interface UpdateSecurityIncidentData {
  status?: SecurityIncidentStatus | string;
  resolution?: string;
  resolvedBy?: string;
}

/**
 * AddIpRestrictionData - Data required to add an IP restriction
 */
export interface AddIpRestrictionData {
  ipAddress: string;
  type: IpRestrictionType | string;
  reason?: string;
  createdBy: string;
}

// ============================================================================
// FILTER & QUERY TYPES
// ============================================================================

/**
 * SecurityIncidentFilters - Filters for querying security incidents
 */
export interface SecurityIncidentFilters {
  type?: SecurityIncidentType | string;
  severity?: IncidentSeverity | string;
  status?: SecurityIncidentStatus | string;
  page?: number;
  limit?: number;
}

// ============================================================================
// RESULT & RESPONSE TYPES
// ============================================================================

/**
 * IpRestrictionCheckResult - Result of checking if an IP is restricted
 */
export interface IpRestrictionCheckResult {
  isRestricted: boolean;
  type?: IpRestrictionType | string;
  reason?: string;
}

/**
 * UserPermissionsResult - User's roles and permissions
 */
export interface UserPermissionsResult {
  roles: Role[];
  permissions: Permission[];
}

/**
 * SecurityStatistics - Comprehensive security statistics
 */
export interface SecurityStatistics {
  incidents: {
    total: number;
    open: number;
    critical: number;
  };
  authentication: {
    recentFailedLogins: number;
    activeSessions: number;
  };
  ipRestrictions: number;
}

/**
 * SecurityIncidentsPaginatedResponse - Paginated security incidents response
 */
export interface SecurityIncidentsPaginatedResponse {
  incidents: SecurityIncident[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

/**
 * RoleResponse - API response for single role
 */
export interface RoleResponse {
  role: Role;
}

/**
 * RolesResponse - API response for multiple roles
 */
export interface RolesResponse {
  roles: Role[];
}

/**
 * PermissionResponse - API response for single permission
 */
export interface PermissionResponse {
  permission: Permission;
}

/**
 * PermissionsResponse - API response for multiple permissions
 */
export interface PermissionsResponse {
  permissions: Permission[];
}

/**
 * RolePermissionResponse - API response for role-permission assignment
 */
export interface RolePermissionResponse {
  rolePermission: RolePermission;
}

/**
 * UserRoleAssignmentResponse - API response for user-role assignment
 */
export interface UserRoleAssignmentResponse {
  userRole: UserRoleAssignment;
}

/**
 * SessionResponse - API response for single session
 */
export interface SessionResponse {
  session: Session;
}

/**
 * SessionsResponse - API response for multiple sessions
 */
export interface SessionsResponse {
  sessions: Session[];
}

/**
 * SecurityIncidentResponse - API response for single security incident
 */
export interface SecurityIncidentResponse {
  incident: SecurityIncident;
}

/**
 * IpRestrictionResponse - API response for single IP restriction
 */
export interface IpRestrictionResponse {
  restriction: IpRestriction;
}

/**
 * IpRestrictionsResponse - API response for multiple IP restrictions
 */
export interface IpRestrictionsResponse {
  restrictions: IpRestriction[];
}

/**
 * DeleteResponse - Generic delete operation response
 */
export interface DeleteResponse {
  success: boolean;
  message?: string;
}

/**
 * DeleteSessionsResponse - Response for deleting multiple sessions
 */
export interface DeleteSessionsResponse {
  deleted: number;
}

/**
 * PermissionCheckResponse - Response for permission check
 */
export interface PermissionCheckResponse {
  hasPermission: boolean;
}

/**
 * StatisticsResponse - Response for security statistics
 */
export interface StatisticsResponse extends SecurityStatistics {}

// ============================================================================
// UTILITY TYPES
// ============================================================================

/**
 * PermissionKey - String representation of a permission (resource.action)
 */
export type PermissionKey = `${string}.${string}`;

/**
 * Common permission resources
 */
export type PermissionResource =
  | 'students'
  | 'medications'
  | 'health_records'
  | 'reports'
  | 'users'
  | 'system'
  | 'security'
  | string;

/**
 * Common permission actions
 */
export type PermissionAction =
  | 'read'
  | 'create'
  | 'update'
  | 'delete'
  | 'manage'
  | 'administer'
  | 'configure'
  | string;

// ============================================================================
// TYPE GUARDS
// ============================================================================

/**
 * Type guard to check if a value is a SecurityIncidentType
 */
export function isSecurityIncidentType(value: string): value is SecurityIncidentType {
  return Object.values(SecurityIncidentType).includes(value as SecurityIncidentType);
}

/**
 * Type guard to check if a value is an IncidentSeverity
 */
export function isIncidentSeverity(value: string): value is IncidentSeverity {
  return Object.values(IncidentSeverity).includes(value as IncidentSeverity);
}

/**
 * Type guard to check if a value is a SecurityIncidentStatus
 */
export function isSecurityIncidentStatus(value: string): value is SecurityIncidentStatus {
  return Object.values(SecurityIncidentStatus).includes(value as SecurityIncidentStatus);
}

/**
 * Type guard to check if a value is an IpRestrictionType
 */
export function isIpRestrictionType(value: string): value is IpRestrictionType {
  return Object.values(IpRestrictionType).includes(value as IpRestrictionType);
}
