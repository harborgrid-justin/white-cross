/**
 * ASSET SECURITY COMMAND FUNCTIONS
 *
 * Enterprise-grade asset security management system providing comprehensive
 * functionality for access control, role-based access (RBAC), audit logging,
 * encryption, SOX compliance, field-level security, data masking, incident
 * tracking, and security policy enforcement. Competes with Okta and
 * CyberArk solutions.
 *
 * Features:
 * - Role-based access control (RBAC)
 * - Granular permission management
 * - Asset-level security policies
 * - Field-level encryption and masking
 * - Comprehensive audit logging
 * - SOX compliance tracking
 * - Security incident management
 * - Access certification and reviews
 * - Multi-factor authentication (MFA)
 * - Session management and monitoring
 *
 * @module AssetSecurityCommands
 * @version 1.0.0
 * @requires @nestjs/common ^11.1.8
 * @requires @nestjs/swagger ^8.0.7
 * @requires @nestjs/sequelize ^10.0.1
 * @requires sequelize ^6.37.5
 * @requires sequelize-typescript ^2.1.6
 * @requires class-validator ^0.14.1
 * @requires class-transformer ^0.5.1
 *
 * @example
 * ```typescript
 * import {
 *   createSecurityRole,
 *   assignRoleToUser,
 *   checkPermission,
 *   logSecurityEvent,
 *   PermissionAction,
 *   SecurityEventType
 * } from './asset-security-commands';
 *
 * // Create security role
 * const role = await createSecurityRole({
 *   name: 'Asset Manager',
 *   description: 'Can manage all assets',
 *   permissions: ['asset:read', 'asset:write', 'asset:delete']
 * });
 *
 * // Check permission
 * const hasAccess = await checkPermission('user-123', 'asset:write', 'asset-456');
 * ```
 */
import { Model } from 'sequelize-typescript';
import { Transaction } from 'sequelize';
/**
 * Permission Action
 */
export declare enum PermissionAction {
    READ = "read",
    WRITE = "write",
    DELETE = "delete",
    APPROVE = "approve",
    EXPORT = "export",
    ADMIN = "admin"
}
/**
 * Security Event Type
 */
export declare enum SecurityEventType {
    LOGIN = "login",
    LOGOUT = "logout",
    LOGIN_FAILED = "login_failed",
    ACCESS_GRANTED = "access_granted",
    ACCESS_DENIED = "access_denied",
    PERMISSION_CHANGED = "permission_changed",
    ROLE_ASSIGNED = "role_assigned",
    ROLE_REVOKED = "role_revoked",
    DATA_ACCESSED = "data_accessed",
    DATA_MODIFIED = "data_modified",
    DATA_DELETED = "data_deleted",
    SECURITY_INCIDENT = "security_incident",
    POLICY_VIOLATION = "policy_violation",
    MFA_ENABLED = "mfa_enabled",
    MFA_DISABLED = "mfa_disabled",
    PASSWORD_CHANGED = "password_changed"
}
/**
 * Incident Severity
 */
export declare enum IncidentSeverity {
    CRITICAL = "critical",
    HIGH = "high",
    MEDIUM = "medium",
    LOW = "low",
    INFO = "info"
}
/**
 * Incident Status
 */
export declare enum IncidentStatus {
    OPEN = "open",
    INVESTIGATING = "investigating",
    CONTAINED = "contained",
    RESOLVED = "resolved",
    CLOSED = "closed"
}
/**
 * Access Review Status
 */
export declare enum AccessReviewStatus {
    PENDING = "pending",
    IN_PROGRESS = "in_progress",
    COMPLETED = "completed",
    OVERDUE = "overdue"
}
/**
 * Data Classification
 */
export declare enum DataClassification {
    PUBLIC = "public",
    INTERNAL = "internal",
    CONFIDENTIAL = "confidential",
    RESTRICTED = "restricted",
    TOP_SECRET = "top_secret"
}
/**
 * Security Role Data
 */
export interface SecurityRoleData {
    name: string;
    description?: string;
    permissions: string[];
    isSystemRole?: boolean;
    parentRoleId?: string;
    metadata?: Record<string, any>;
}
/**
 * Role Assignment Data
 */
export interface RoleAssignmentData {
    userId: string;
    roleId: string;
    assignedBy: string;
    expiresAt?: Date;
    justification?: string;
}
/**
 * Permission Data
 */
export interface PermissionData {
    resource: string;
    action: PermissionAction;
    description?: string;
    conditions?: Record<string, any>;
}
/**
 * Security Policy Data
 */
export interface SecurityPolicyData {
    name: string;
    description?: string;
    policyType: string;
    rules: PolicyRule[];
    isActive?: boolean;
    effectiveDate?: Date;
    expirationDate?: Date;
}
/**
 * Policy Rule
 */
export interface PolicyRule {
    condition: string;
    action: string;
    severity: IncidentSeverity;
    notification?: string[];
}
/**
 * Security Event Data
 */
export interface SecurityEventData {
    eventType: SecurityEventType;
    userId?: string;
    resourceType?: string;
    resourceId?: string;
    action?: string;
    result: 'success' | 'failure';
    ipAddress?: string;
    userAgent?: string;
    metadata?: Record<string, any>;
}
/**
 * Security Incident Data
 */
export interface SecurityIncidentData {
    title: string;
    description: string;
    severity: IncidentSeverity;
    incidentType: string;
    affectedAssets?: string[];
    reportedBy: string;
    assignedTo?: string;
}
/**
 * Access Review Data
 */
export interface AccessReviewData {
    reviewerIds: string[];
    targetRoleId?: string;
    targetUserId?: string;
    dueDate: Date;
    scope: string;
}
/**
 * Field Security Data
 */
export interface FieldSecurityData {
    tableName: string;
    fieldName: string;
    classification: DataClassification;
    encryptionRequired: boolean;
    maskingRequired: boolean;
    maskingPattern?: string;
    allowedRoles?: string[];
}
/**
 * Security Role Model
 */
export declare class SecurityRole extends Model {
    id: string;
    name: string;
    description?: string;
    permissions: string[];
    isSystemRole: boolean;
    parentRoleId?: string;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    parentRole?: SecurityRole;
    childRoles?: SecurityRole[];
    userAssignments?: UserRoleAssignment[];
}
/**
 * User Role Assignment Model
 */
export declare class UserRoleAssignment extends Model {
    id: string;
    userId: string;
    roleId: string;
    assignedBy: string;
    assignedAt: Date;
    expiresAt?: Date;
    isActive: boolean;
    revokedBy?: string;
    revokedAt?: Date;
    justification?: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    role?: SecurityRole;
}
/**
 * Permission Model
 */
export declare class Permission extends Model {
    id: string;
    resource: string;
    action: PermissionAction;
    description?: string;
    conditions?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Security Policy Model
 */
export declare class SecurityPolicy extends Model {
    id: string;
    name: string;
    description?: string;
    policyType: string;
    rules: PolicyRule[];
    isActive: boolean;
    effectiveDate?: Date;
    expirationDate?: Date;
    violationCount: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
/**
 * Security Audit Log Model
 */
export declare class SecurityAuditLog extends Model {
    id: string;
    eventType: SecurityEventType;
    userId?: string;
    resourceType?: string;
    resourceId?: string;
    action?: string;
    result: string;
    ipAddress?: string;
    userAgent?: string;
    timestamp: Date;
    metadata?: Record<string, any>;
    sessionId?: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Security Incident Model
 */
export declare class SecurityIncident extends Model {
    id: string;
    incidentNumber: string;
    title: string;
    description: string;
    severity: IncidentSeverity;
    status: IncidentStatus;
    incidentType: string;
    affectedAssets?: string[];
    reportedBy: string;
    reportedAt: Date;
    assignedTo?: string;
    resolvedAt?: Date;
    resolvedBy?: string;
    resolutionNotes?: string;
    rootCause?: string;
    preventiveActions?: string;
    attachments?: string[];
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    static generateIncidentNumber(instance: SecurityIncident): Promise<void>;
}
/**
 * Access Review Model
 */
export declare class AccessReview extends Model {
    id: string;
    reviewerIds: string[];
    targetRoleId?: string;
    targetUserId?: string;
    status: AccessReviewStatus;
    scope: string;
    dueDate: Date;
    startedAt?: Date;
    completedAt?: Date;
    findings?: Record<string, any>[];
    recommendations?: string;
    createdAt: Date;
    updatedAt: Date;
    targetRole?: SecurityRole;
}
/**
 * Field Security Model
 */
export declare class FieldSecurity extends Model {
    id: string;
    tableName: string;
    fieldName: string;
    classification: DataClassification;
    encryptionRequired: boolean;
    maskingRequired: boolean;
    maskingPattern?: string;
    allowedRoles?: string[];
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Creates security role
 *
 * @param data - Role data
 * @param transaction - Optional database transaction
 * @returns Created role
 *
 * @example
 * ```typescript
 * const role = await createSecurityRole({
 *   name: 'Asset Manager',
 *   description: 'Full access to asset management',
 *   permissions: ['asset:read', 'asset:write', 'asset:delete', 'asset:approve'],
 *   parentRoleId: 'base-role-123'
 * });
 * ```
 */
export declare function createSecurityRole(data: SecurityRoleData, transaction?: Transaction): Promise<SecurityRole>;
/**
 * Assigns role to user
 *
 * @param data - Assignment data
 * @param transaction - Optional database transaction
 * @returns Role assignment
 *
 * @example
 * ```typescript
 * await assignRoleToUser({
 *   userId: 'user-123',
 *   roleId: 'role-456',
 *   assignedBy: 'admin-789',
 *   expiresAt: new Date('2025-12-31'),
 *   justification: 'Promoted to asset manager position'
 * });
 * ```
 */
export declare function assignRoleToUser(data: RoleAssignmentData, transaction?: Transaction): Promise<UserRoleAssignment>;
/**
 * Revokes role from user
 *
 * @param assignmentId - Assignment ID
 * @param revokedBy - User revoking
 * @param transaction - Optional database transaction
 * @returns Updated assignment
 *
 * @example
 * ```typescript
 * await revokeRoleFromUser('assignment-123', 'admin-456');
 * ```
 */
export declare function revokeRoleFromUser(assignmentId: string, revokedBy: string, transaction?: Transaction): Promise<UserRoleAssignment>;
/**
 * Checks permission
 *
 * @param userId - User ID
 * @param permission - Permission string
 * @param resourceId - Optional resource ID
 * @returns Has permission
 *
 * @example
 * ```typescript
 * const canWrite = await checkPermission('user-123', 'asset:write', 'asset-456');
 * if (!canWrite) {
 *   throw new ForbiddenException('Access denied');
 * }
 * ```
 */
export declare function checkPermission(userId: string, permission: string, resourceId?: string): Promise<boolean>;
/**
 * Gets user permissions
 *
 * @param userId - User ID
 * @returns User permissions
 *
 * @example
 * ```typescript
 * const permissions = await getUserPermissions('user-123');
 * ```
 */
export declare function getUserPermissions(userId: string): Promise<string[]>;
/**
 * Gets user roles
 *
 * @param userId - User ID
 * @returns Active roles
 *
 * @example
 * ```typescript
 * const roles = await getUserRoles('user-123');
 * ```
 */
export declare function getUserRoles(userId: string): Promise<SecurityRole[]>;
/**
 * Logs security event
 *
 * @param data - Event data
 * @param transaction - Optional database transaction
 * @returns Audit log entry
 *
 * @example
 * ```typescript
 * await logSecurityEvent({
 *   eventType: SecurityEventType.ACCESS_GRANTED,
 *   userId: 'user-123',
 *   resourceType: 'asset',
 *   resourceId: 'asset-456',
 *   action: 'read',
 *   result: 'success',
 *   ipAddress: '192.168.1.100',
 *   metadata: { location: 'warehouse-a' }
 * });
 * ```
 */
export declare function logSecurityEvent(data: SecurityEventData, transaction?: Transaction): Promise<SecurityAuditLog>;
/**
 * Gets audit logs
 *
 * @param filters - Filter options
 * @param limit - Maximum logs
 * @returns Audit logs
 *
 * @example
 * ```typescript
 * const logs = await getAuditLogs({
 *   userId: 'user-123',
 *   eventType: SecurityEventType.ACCESS_DENIED,
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-12-31')
 * }, 1000);
 * ```
 */
export declare function getAuditLogs(filters: {
    userId?: string;
    eventType?: SecurityEventType;
    resourceType?: string;
    resourceId?: string;
    result?: string;
    startDate?: Date;
    endDate?: Date;
}, limit?: number): Promise<SecurityAuditLog[]>;
/**
 * Generates audit report
 *
 * @param startDate - Start date
 * @param endDate - End date
 * @param groupBy - Grouping field
 * @returns Audit report
 *
 * @example
 * ```typescript
 * const report = await generateAuditReport(
 *   new Date('2024-01-01'),
 *   new Date('2024-12-31'),
 *   'eventType'
 * );
 * ```
 */
export declare function generateAuditReport(startDate: Date, endDate: Date, groupBy?: 'eventType' | 'userId' | 'resourceType'): Promise<Record<string, number>>;
/**
 * Creates security policy
 *
 * @param data - Policy data
 * @param transaction - Optional database transaction
 * @returns Created policy
 *
 * @example
 * ```typescript
 * const policy = await createSecurityPolicy({
 *   name: 'Asset Access Policy',
 *   policyType: 'access_control',
 *   rules: [
 *     {
 *       condition: 'after_hours_access',
 *       action: 'require_approval',
 *       severity: IncidentSeverity.MEDIUM,
 *       notification: ['security-team@example.com']
 *     }
 *   ],
 *   isActive: true
 * });
 * ```
 */
export declare function createSecurityPolicy(data: SecurityPolicyData, transaction?: Transaction): Promise<SecurityPolicy>;
/**
 * Evaluates policy compliance
 *
 * @param policyId - Policy ID
 * @param context - Evaluation context
 * @returns Compliance result
 *
 * @example
 * ```typescript
 * const result = await evaluatePolicyCompliance('policy-123', {
 *   userId: 'user-456',
 *   action: 'access_sensitive_data',
 *   time: new Date()
 * });
 * ```
 */
export declare function evaluatePolicyCompliance(policyId: string, context: Record<string, any>): Promise<{
    compliant: boolean;
    violations: string[];
}>;
/**
 * Creates security incident
 *
 * @param data - Incident data
 * @param transaction - Optional database transaction
 * @returns Created incident
 *
 * @example
 * ```typescript
 * const incident = await createSecurityIncident({
 *   title: 'Unauthorized Access Attempt',
 *   description: 'Multiple failed login attempts detected',
 *   severity: IncidentSeverity.HIGH,
 *   incidentType: 'access_violation',
 *   affectedAssets: ['asset-123', 'asset-456'],
 *   reportedBy: 'security-system',
 *   assignedTo: 'security-analyst-789'
 * });
 * ```
 */
export declare function createSecurityIncident(data: SecurityIncidentData, transaction?: Transaction): Promise<SecurityIncident>;
/**
 * Updates incident status
 *
 * @param incidentId - Incident ID
 * @param status - New status
 * @param userId - User updating
 * @param notes - Update notes
 * @param transaction - Optional database transaction
 * @returns Updated incident
 *
 * @example
 * ```typescript
 * await updateIncidentStatus(
 *   'incident-123',
 *   IncidentStatus.RESOLVED,
 *   'analyst-456',
 *   'False positive - authorized test'
 * );
 * ```
 */
export declare function updateIncidentStatus(incidentId: string, status: IncidentStatus, userId: string, notes?: string, transaction?: Transaction): Promise<SecurityIncident>;
/**
 * Gets open incidents
 *
 * @param severity - Optional severity filter
 * @returns Open incidents
 *
 * @example
 * ```typescript
 * const criticalIncidents = await getOpenIncidents(IncidentSeverity.CRITICAL);
 * ```
 */
export declare function getOpenIncidents(severity?: IncidentSeverity): Promise<SecurityIncident[]>;
/**
 * Creates access review
 *
 * @param data - Review data
 * @param transaction - Optional database transaction
 * @returns Created review
 *
 * @example
 * ```typescript
 * const review = await createAccessReview({
 *   reviewerIds: ['manager-123', 'security-456'],
 *   targetRoleId: 'admin-role-789',
 *   dueDate: new Date('2024-12-31'),
 *   scope: 'Quarterly admin role review'
 * });
 * ```
 */
export declare function createAccessReview(data: AccessReviewData, transaction?: Transaction): Promise<AccessReview>;
/**
 * Completes access review
 *
 * @param reviewId - Review ID
 * @param findings - Review findings
 * @param recommendations - Recommendations
 * @param transaction - Optional database transaction
 * @returns Updated review
 *
 * @example
 * ```typescript
 * await completeAccessReview('review-123', findings, 'Revoke unused permissions');
 * ```
 */
export declare function completeAccessReview(reviewId: string, findings: Record<string, any>[], recommendations?: string, transaction?: Transaction): Promise<AccessReview>;
/**
 * Gets pending reviews
 *
 * @param reviewerId - Optional reviewer filter
 * @returns Pending reviews
 *
 * @example
 * ```typescript
 * const myReviews = await getPendingReviews('reviewer-123');
 * ```
 */
export declare function getPendingReviews(reviewerId?: string): Promise<AccessReview[]>;
/**
 * Configures field security
 *
 * @param data - Field security data
 * @param transaction - Optional database transaction
 * @returns Field security config
 *
 * @example
 * ```typescript
 * await configureFieldSecurity({
 *   tableName: 'assets',
 *   fieldName: 'acquisition_cost',
 *   classification: DataClassification.CONFIDENTIAL,
 *   encryptionRequired: true,
 *   maskingRequired: true,
 *   maskingPattern: '***',
 *   allowedRoles: ['finance-role', 'admin-role']
 * });
 * ```
 */
export declare function configureFieldSecurity(data: FieldSecurityData, transaction?: Transaction): Promise<FieldSecurity>;
/**
 * Masks field value
 *
 * @param tableName - Table name
 * @param fieldName - Field name
 * @param value - Original value
 * @param userId - User requesting
 * @returns Masked or original value
 *
 * @example
 * ```typescript
 * const cost = await maskFieldValue('assets', 'acquisition_cost', '50000', 'user-123');
 * // Returns '***' if user doesn't have access, '50000' if they do
 * ```
 */
export declare function maskFieldValue(tableName: string, fieldName: string, value: any, userId: string): Promise<any>;
/**
 * User Session Model
 */
export declare class UserSession extends Model {
    id: string;
    userId: string;
    sessionToken: string;
    ipAddress?: string;
    userAgent?: string;
    isActive: boolean;
    lastActivity: Date;
    expiresAt: Date;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Creates user session
 *
 * @param userId - User ID
 * @param ipAddress - IP address
 * @param userAgent - User agent
 * @param expirationHours - Expiration in hours
 * @param transaction - Optional database transaction
 * @returns Created session
 *
 * @example
 * ```typescript
 * const session = await createUserSession('user-123', '192.168.1.1', 'Chrome', 24);
 * ```
 */
export declare function createUserSession(userId: string, ipAddress?: string, userAgent?: string, expirationHours?: number, transaction?: Transaction): Promise<UserSession>;
/**
 * Validates user session
 *
 * @param sessionToken - Session token
 * @param transaction - Optional database transaction
 * @returns Session if valid
 *
 * @example
 * ```typescript
 * const session = await validateUserSession('token-123');
 * if (!session) throw new UnauthorizedException('Invalid session');
 * ```
 */
export declare function validateUserSession(sessionToken: string, transaction?: Transaction): Promise<UserSession | null>;
/**
 * Expires user session
 *
 * @param sessionToken - Session token
 * @param transaction - Optional database transaction
 * @returns Updated session
 *
 * @example
 * ```typescript
 * await expireUserSession('token-123');
 * ```
 */
export declare function expireUserSession(sessionToken: string, transaction?: Transaction): Promise<UserSession>;
/**
 * Expires all user sessions
 *
 * @param userId - User ID
 * @param transaction - Optional database transaction
 * @returns Expired count
 *
 * @example
 * ```typescript
 * await expireAllUserSessions('user-123');
 * ```
 */
export declare function expireAllUserSessions(userId: string, transaction?: Transaction): Promise<number>;
/**
 * Password Policy Model
 */
export declare class PasswordPolicy extends Model {
    id: string;
    name: string;
    minLength: number;
    requireUppercase: boolean;
    requireLowercase: boolean;
    requireNumbers: boolean;
    requireSpecialChars: boolean;
    maxAgeDays?: number;
    preventReuseCount: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Validates password strength
 *
 * @param password - Password to validate
 * @param policyId - Optional policy ID
 * @returns Validation result
 *
 * @example
 * ```typescript
 * const result = validatePassword('MyP@ssw0rd123');
 * if (!result.valid) throw new BadRequestException(result.errors.join(', '));
 * ```
 */
export declare function validatePassword(password: string, policyId?: string): Promise<{
    valid: boolean;
    errors: string[];
}>;
/**
 * Checks password strength score
 *
 * @param password - Password to check
 * @returns Strength score 0-100
 *
 * @example
 * ```typescript
 * const strength = checkPasswordStrength('MyP@ssw0rd123');
 * // Returns: 85
 * ```
 */
export declare function checkPasswordStrength(password: string): number;
/**
 * Forces password reset
 *
 * @param userId - User ID
 * @param reason - Reset reason
 * @param transaction - Optional database transaction
 * @returns Success status
 *
 * @example
 * ```typescript
 * await forcePasswordReset('user-123', 'Policy violation detected');
 * ```
 */
export declare function forcePasswordReset(userId: string, reason: string, transaction?: Transaction): Promise<boolean>;
/**
 * MFA Configuration Model
 */
export declare class MfaConfiguration extends Model {
    id: string;
    userId: string;
    isEnabled: boolean;
    method: string;
    secretKey?: string;
    backupCodes?: string[];
    lastUsedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Enables MFA for user
 *
 * @param userId - User ID
 * @param method - MFA method (totp, sms, email)
 * @param transaction - Optional database transaction
 * @returns MFA configuration
 *
 * @example
 * ```typescript
 * const mfa = await enableMfa('user-123', 'totp');
 * ```
 */
export declare function enableMfa(userId: string, method: string, transaction?: Transaction): Promise<MfaConfiguration>;
/**
 * Verifies MFA code
 *
 * @param userId - User ID
 * @param code - MFA code
 * @param transaction - Optional database transaction
 * @returns Verification result
 *
 * @example
 * ```typescript
 * const valid = await verifyMfaCode('user-123', '123456');
 * if (!valid) throw new UnauthorizedException('Invalid MFA code');
 * ```
 */
export declare function verifyMfaCode(userId: string, code: string, transaction?: Transaction): Promise<boolean>;
/**
 * Generates backup codes
 *
 * @returns Array of backup codes
 *
 * @example
 * ```typescript
 * const codes = generateBackupCodes();
 * ```
 */
export declare function generateBackupCodes(): string[];
/**
 * Security Group Model
 */
export declare class SecurityGroup extends Model {
    id: string;
    name: string;
    description?: string;
    groupType: string;
    memberIds: string[];
    roleIds: string[];
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
/**
 * Creates security group
 *
 * @param name - Group name
 * @param groupType - Group type
 * @param description - Optional description
 * @param transaction - Optional database transaction
 * @returns Created group
 *
 * @example
 * ```typescript
 * const group = await createSecurityGroup('Finance Team', 'department', 'Finance department users');
 * ```
 */
export declare function createSecurityGroup(name: string, groupType: string, description?: string, transaction?: Transaction): Promise<SecurityGroup>;
/**
 * Adds user to security group
 *
 * @param groupId - Group ID
 * @param userId - User ID
 * @param transaction - Optional database transaction
 * @returns Updated group
 *
 * @example
 * ```typescript
 * await addUserToSecurityGroup('group-123', 'user-456');
 * ```
 */
export declare function addUserToSecurityGroup(groupId: string, userId: string, transaction?: Transaction): Promise<SecurityGroup>;
/**
 * Assigns role to security group
 *
 * @param groupId - Group ID
 * @param roleId - Role ID
 * @param transaction - Optional database transaction
 * @returns Updated group
 *
 * @example
 * ```typescript
 * await assignRoleToSecurityGroup('group-123', 'role-456');
 * ```
 */
export declare function assignRoleToSecurityGroup(groupId: string, roleId: string, transaction?: Transaction): Promise<SecurityGroup>;
/**
 * Generates SOX compliance report
 *
 * @param startDate - Start date
 * @param endDate - End date
 * @returns Compliance report
 *
 * @example
 * ```typescript
 * const report = await generateSoxComplianceReport(
 *   new Date('2024-01-01'),
 *   new Date('2024-12-31')
 * );
 * ```
 */
export declare function generateSoxComplianceReport(startDate: Date, endDate: Date): Promise<Record<string, any>>;
/**
 * Generates security metrics
 *
 * @param period - Period in days
 * @returns Security metrics
 *
 * @example
 * ```typescript
 * const metrics = await generateSecurityMetrics(30);
 * ```
 */
export declare function generateSecurityMetrics(period?: number): Promise<Record<string, any>>;
/**
 * Gets active user sessions
 *
 * @param userId - User ID
 * @returns Active sessions
 *
 * @example
 * ```typescript
 * const sessions = await getActiveUserSessions('user-123');
 * ```
 */
export declare function getActiveUserSessions(userId: string): Promise<UserSession[]>;
declare const _default: {
    SecurityRole: typeof SecurityRole;
    UserRoleAssignment: typeof UserRoleAssignment;
    Permission: typeof Permission;
    SecurityPolicy: typeof SecurityPolicy;
    SecurityAuditLog: typeof SecurityAuditLog;
    SecurityIncident: typeof SecurityIncident;
    AccessReview: typeof AccessReview;
    FieldSecurity: typeof FieldSecurity;
    UserSession: typeof UserSession;
    PasswordPolicy: typeof PasswordPolicy;
    MfaConfiguration: typeof MfaConfiguration;
    SecurityGroup: typeof SecurityGroup;
    createSecurityRole: typeof createSecurityRole;
    assignRoleToUser: typeof assignRoleToUser;
    revokeRoleFromUser: typeof revokeRoleFromUser;
    checkPermission: typeof checkPermission;
    getUserPermissions: typeof getUserPermissions;
    getUserRoles: typeof getUserRoles;
    logSecurityEvent: typeof logSecurityEvent;
    getAuditLogs: typeof getAuditLogs;
    generateAuditReport: typeof generateAuditReport;
    createSecurityPolicy: typeof createSecurityPolicy;
    evaluatePolicyCompliance: typeof evaluatePolicyCompliance;
    createSecurityIncident: typeof createSecurityIncident;
    updateIncidentStatus: typeof updateIncidentStatus;
    getOpenIncidents: typeof getOpenIncidents;
    createAccessReview: typeof createAccessReview;
    completeAccessReview: typeof completeAccessReview;
    getPendingReviews: typeof getPendingReviews;
    configureFieldSecurity: typeof configureFieldSecurity;
    maskFieldValue: typeof maskFieldValue;
    createUserSession: typeof createUserSession;
    validateUserSession: typeof validateUserSession;
    expireUserSession: typeof expireUserSession;
    expireAllUserSessions: typeof expireAllUserSessions;
    getActiveUserSessions: typeof getActiveUserSessions;
    validatePassword: typeof validatePassword;
    checkPasswordStrength: typeof checkPasswordStrength;
    forcePasswordReset: typeof forcePasswordReset;
    enableMfa: typeof enableMfa;
    verifyMfaCode: typeof verifyMfaCode;
    generateBackupCodes: typeof generateBackupCodes;
    createSecurityGroup: typeof createSecurityGroup;
    addUserToSecurityGroup: typeof addUserToSecurityGroup;
    assignRoleToSecurityGroup: typeof assignRoleToSecurityGroup;
    generateSoxComplianceReport: typeof generateSoxComplianceReport;
    generateSecurityMetrics: typeof generateSecurityMetrics;
};
export default _default;
//# sourceMappingURL=asset-security-commands.d.ts.map