/**
 * LOC: DOCPERMGOV001
 * File: /reuse/document/composites/document-permission-governance-composite.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - sequelize-typescript
 *   - sequelize
 *   - crypto (Node.js built-in)
 *   - jsonwebtoken
 *   - ../document-permission-management-kit
 *   - ../document-security-kit
 *   - ../document-compliance-advanced-kit
 *   - ../document-audit-trail-advanced-kit
 *   - ../document-lifecycle-management-kit
 *
 * DOWNSTREAM (imported by):
 *   - Permission management services
 *   - Access control handlers
 *   - RBAC authorization modules
 *   - Share link services
 *   - Healthcare collaboration systems
 *   - Governance compliance dashboards
 */
/**
 * File: /reuse/document/composites/document-permission-governance-composite.ts
 * Locator: WC-PERMISSION-GOVERNANCE-COMPOSITE-001
 * Purpose: Comprehensive Permission & Governance Composite - Production-ready permission management, RBAC, governance, role-based access
 *
 * Upstream: Composed from document-permission-management-kit, document-security-kit, document-compliance-advanced-kit, document-audit-trail-advanced-kit, document-lifecycle-management-kit
 * Downstream: ../backend/*, Permission services, Access control, RBAC modules, Share link handlers, Governance systems
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/swagger, sequelize-typescript, jsonwebtoken 9.x
 * Exports: 46 utility functions for granular permissions, RBAC, share links, governance policies, permission inheritance, access analytics
 *
 * LLM Context: Enterprise-grade permission and governance composite for White Cross healthcare platform.
 * Provides comprehensive permission management including granular read/write/share/delete permissions, role-based
 * access control (RBAC) with custom roles, secure share link generation with expiration and password protection,
 * time-based permission expiration, hierarchical permission inheritance, governance policy enforcement, access
 * analytics and audit logging, permission templates, delegation workflows, emergency access override, break-glass
 * procedures, and HIPAA-compliant permission tracking. Exceeds Box and Dropbox capabilities with healthcare-specific
 * features including HIPAA minimum necessary access, clinical role definitions, patient consent management, and
 * regulatory compliance automation. Composes functions from permission-management, security, compliance, audit-trail,
 * and lifecycle-management kits to provide unified permission operations for healthcare team collaboration, patient
 * data access control, regulatory compliance, and enterprise authorization patterns.
 */
import { Model } from 'sequelize-typescript';
/**
 * Permission action types
 */
export declare enum PermissionAction {
    READ = "READ",
    WRITE = "WRITE",
    DELETE = "DELETE",
    SHARE = "SHARE",
    ADMIN = "ADMIN",
    DOWNLOAD = "DOWNLOAD",
    PRINT = "PRINT",
    COMMENT = "COMMENT",
    SIGN = "SIGN",
    APPROVE = "APPROVE"
}
/**
 * Permission grant types
 */
export declare enum PermissionGrantType {
    USER = "USER",
    ROLE = "ROLE",
    TEAM = "TEAM",
    ORGANIZATION = "ORGANIZATION",
    PUBLIC = "PUBLIC",
    DEPARTMENT = "DEPARTMENT"
}
/**
 * User roles for RBAC
 */
export declare enum UserRole {
    SUPER_ADMIN = "SUPER_ADMIN",
    ADMIN = "ADMIN",
    DOCTOR = "DOCTOR",
    NURSE = "NURSE",
    PHARMACIST = "PHARMACIST",
    LAB_TECHNICIAN = "LAB_TECHNICIAN",
    BILLING_STAFF = "BILLING_STAFF",
    STAFF = "STAFF",
    PATIENT = "PATIENT",
    VIEWER = "VIEWER",
    GUEST = "GUEST",
    AUDITOR = "AUDITOR"
}
/**
 * Share link access levels
 */
export declare enum ShareLinkAccessLevel {
    VIEW = "VIEW",
    COMMENT = "COMMENT",
    EDIT = "EDIT",
    FULL = "FULL"
}
/**
 * Permission inheritance strategies
 */
export declare enum InheritanceStrategy {
    CASCADE = "CASCADE",
    OVERRIDE = "OVERRIDE",
    MERGE = "MERGE",
    BLOCK = "BLOCK"
}
/**
 * Access decision result
 */
export declare enum AccessDecision {
    ALLOW = "ALLOW",
    DENY = "DENY",
    ABSTAIN = "ABSTAIN"
}
/**
 * Permission condition types
 */
export interface PermissionCondition {
    type: 'time' | 'location' | 'ip' | 'device' | 'mfa' | 'consent';
    operator: 'equals' | 'contains' | 'in_range' | 'matches';
    value: any;
}
/**
 * Granular permission configuration
 */
export interface PermissionConfig {
    id: string;
    actions: PermissionAction[];
    grantType: PermissionGrantType;
    granteeId: string;
    resourceId: string;
    resourceType: string;
    expiresAt?: Date;
    conditions?: PermissionCondition[];
    inheritanceStrategy?: InheritanceStrategy;
    metadata?: Record<string, any>;
}
/**
 * Share link configuration
 */
export interface ShareLinkConfig {
    id: string;
    resourceId: string;
    resourceType: string;
    accessLevel: ShareLinkAccessLevel;
    token: string;
    createdBy: string;
    expiresAt?: Date;
    password?: string;
    maxDownloads?: number;
    currentDownloads: number;
    enabled: boolean;
    metadata?: Record<string, any>;
}
/**
 * Access request
 */
export interface AccessRequest {
    userId: string;
    resourceId: string;
    resourceType: string;
    action: PermissionAction;
    context?: {
        ipAddress?: string;
        location?: string;
        device?: string;
        timestamp: Date;
    };
}
/**
 * Access decision result
 */
export interface AccessDecisionResult {
    decision: AccessDecision;
    userId: string;
    resourceId: string;
    action: PermissionAction;
    reason?: string;
    appliedPermissions: PermissionConfig[];
    evaluatedAt: Date;
}
/**
 * Role definition
 */
export interface RoleDefinition {
    id: string;
    name: UserRole;
    displayName: string;
    description: string;
    permissions: PermissionAction[];
    inheritsFrom?: UserRole[];
    isSystem: boolean;
    metadata?: Record<string, any>;
}
/**
 * Governance policy
 */
export interface GovernancePolicy {
    id: string;
    name: string;
    description: string;
    policyType: 'access' | 'retention' | 'sharing' | 'classification';
    rules: PolicyRule[];
    enforcementLevel: 'advisory' | 'warning' | 'blocking';
    enabled: boolean;
    metadata?: Record<string, any>;
}
/**
 * Policy rule
 */
export interface PolicyRule {
    id: string;
    condition: string;
    action: string;
    priority: number;
}
/**
 * Access analytics
 */
export interface AccessAnalytics {
    resourceId: string;
    totalAccessAttempts: number;
    successfulAccess: number;
    deniedAccess: number;
    uniqueUsers: number;
    topUsers: Array<{
        userId: string;
        accessCount: number;
    }>;
    accessByAction: Record<PermissionAction, number>;
    accessByTime: Record<string, number>;
}
/**
 * Permission delegation
 */
export interface PermissionDelegation {
    id: string;
    delegatorId: string;
    delegateeId: string;
    resourceId: string;
    permissions: PermissionAction[];
    expiresAt: Date;
    isRevocable: boolean;
    metadata?: Record<string, any>;
}
/**
 * Permission Model
 * Stores granular permission configurations
 */
export declare class PermissionModel extends Model {
    id: string;
    actions: PermissionAction[];
    grantType: PermissionGrantType;
    granteeId: string;
    resourceId: string;
    resourceType: string;
    expiresAt?: Date;
    conditions?: PermissionCondition[];
    inheritanceStrategy?: InheritanceStrategy;
    metadata?: Record<string, any>;
}
/**
 * Share Link Model
 * Stores secure share link configurations
 */
export declare class ShareLinkModel extends Model {
    id: string;
    resourceId: string;
    resourceType: string;
    accessLevel: ShareLinkAccessLevel;
    token: string;
    createdBy: string;
    expiresAt?: Date;
    passwordHash?: string;
    maxDownloads?: number;
    currentDownloads: number;
    enabled: boolean;
    metadata?: Record<string, any>;
}
/**
 * Role Model
 * Stores RBAC role definitions
 */
export declare class RoleModel extends Model {
    id: string;
    name: UserRole;
    displayName: string;
    description?: string;
    permissions: PermissionAction[];
    inheritsFrom?: UserRole[];
    isSystem: boolean;
    metadata?: Record<string, any>;
}
/**
 * Governance Policy Model
 * Stores governance policy configurations
 */
export declare class GovernancePolicyModel extends Model {
    id: string;
    name: string;
    description?: string;
    policyType: string;
    rules: PolicyRule[];
    enforcementLevel: string;
    enabled: boolean;
    metadata?: Record<string, any>;
}
/**
 * Grants permission to user, role, or team.
 * Supports granular action-based permissions with conditions.
 *
 * @param {PermissionConfig} config - Permission configuration
 * @returns {Promise<PermissionConfig>} Created permission
 *
 * @example
 * REST API: POST /api/v1/permissions/grant
 * Request:
 * {
 *   "resourceId": "doc123",
 *   "resourceType": "document",
 *   "grantType": "USER",
 *   "granteeId": "user456",
 *   "actions": ["READ", "WRITE"],
 *   "expiresAt": "2025-12-31T23:59:59Z"
 * }
 * Response: 201 Created
 * {
 *   "id": "perm_uuid",
 *   "actions": ["READ", "WRITE"],
 *   "expiresAt": "2025-12-31T23:59:59Z"
 * }
 */
export declare const grantPermission: (config: PermissionConfig) => Promise<PermissionConfig>;
/**
 * Revokes permission from grantee.
 *
 * @param {string} permissionId - Permission identifier
 * @returns {Promise<void>}
 */
export declare const revokePermission: (permissionId: string) => Promise<void>;
/**
 * Checks if user has permission for action on resource.
 *
 * @param {AccessRequest} request - Access request
 * @returns {Promise<AccessDecisionResult>} Access decision
 */
export declare const checkPermission: (request: AccessRequest) => Promise<AccessDecisionResult>;
/**
 * Evaluates permission with conditions.
 *
 * @param {PermissionConfig} permission - Permission configuration
 * @param {AccessRequest} request - Access request
 * @returns {boolean} Whether conditions are satisfied
 */
export declare const evaluatePermissionConditions: (permission: PermissionConfig, request: AccessRequest) => boolean;
/**
 * Creates secure share link for resource.
 *
 * @param {string} resourceId - Resource identifier
 * @param {ShareLinkAccessLevel} accessLevel - Access level
 * @param {string} createdBy - Creator user ID
 * @param {Partial<ShareLinkConfig>} options - Additional options
 * @returns {Promise<ShareLinkConfig>} Created share link
 */
export declare const createShareLink: (resourceId: string, accessLevel: ShareLinkAccessLevel, createdBy: string, options?: Partial<ShareLinkConfig>) => Promise<ShareLinkConfig>;
/**
 * Validates share link token and access.
 *
 * @param {string} token - Share link token
 * @param {string} password - Optional password
 * @returns {Promise<ShareLinkConfig | null>} Share link if valid
 */
export declare const validateShareLink: (token: string, password?: string) => Promise<ShareLinkConfig | null>;
/**
 * Revokes share link.
 *
 * @param {string} linkId - Share link identifier
 * @returns {Promise<void>}
 */
export declare const revokeShareLink: (linkId: string) => Promise<void>;
/**
 * Retrieves permissions for resource.
 *
 * @param {string} resourceId - Resource identifier
 * @returns {Promise<PermissionConfig[]>} Resource permissions
 */
export declare const getResourcePermissions: (resourceId: string) => Promise<PermissionConfig[]>;
/**
 * Retrieves user effective permissions.
 *
 * @param {string} userId - User identifier
 * @param {string} resourceId - Resource identifier
 * @returns {Promise<PermissionAction[]>} Effective actions
 */
export declare const getUserEffectivePermissions: (userId: string, resourceId: string) => Promise<PermissionAction[]>;
/**
 * Creates custom role with permissions.
 *
 * @param {string} name - Role name
 * @param {PermissionAction[]} permissions - Role permissions
 * @param {string} displayName - Display name
 * @returns {Promise<RoleDefinition>} Created role
 */
export declare const createCustomRole: (name: UserRole, permissions: PermissionAction[], displayName: string) => Promise<RoleDefinition>;
/**
 * Assigns role to user.
 *
 * @param {string} userId - User identifier
 * @param {UserRole} role - Role to assign
 * @returns {Promise<void>}
 */
export declare const assignRoleToUser: (userId: string, role: UserRole) => Promise<void>;
/**
 * Removes role from user.
 *
 * @param {string} userId - User identifier
 * @param {UserRole} role - Role to remove
 * @returns {Promise<void>}
 */
export declare const removeRoleFromUser: (userId: string, role: UserRole) => Promise<void>;
/**
 * Retrieves user roles.
 *
 * @param {string} userId - User identifier
 * @returns {Promise<UserRole[]>} User roles
 */
export declare const getUserRoles: (userId: string) => Promise<UserRole[]>;
/**
 * Resolves role hierarchy and inherited permissions.
 *
 * @param {UserRole[]} roles - User roles
 * @returns {Promise<PermissionAction[]>} All permissions
 */
export declare const resolveRoleHierarchy: (roles: UserRole[]) => Promise<PermissionAction[]>;
/**
 * Applies permission inheritance from parent resource.
 *
 * @param {string} parentResourceId - Parent resource identifier
 * @param {string} childResourceId - Child resource identifier
 * @param {InheritanceStrategy} strategy - Inheritance strategy
 * @returns {Promise<void>}
 */
export declare const applyPermissionInheritance: (parentResourceId: string, childResourceId: string, strategy: InheritanceStrategy) => Promise<void>;
/**
 * Delegates permissions to another user.
 *
 * @param {string} delegatorId - Delegator user ID
 * @param {string} delegateeId - Delegatee user ID
 * @param {string} resourceId - Resource identifier
 * @param {PermissionAction[]} permissions - Permissions to delegate
 * @param {Date} expiresAt - Delegation expiration
 * @returns {Promise<PermissionDelegation>} Delegation record
 */
export declare const delegatePermissions: (delegatorId: string, delegateeId: string, resourceId: string, permissions: PermissionAction[], expiresAt: Date) => Promise<PermissionDelegation>;
/**
 * Revokes permission delegation.
 *
 * @param {string} delegationId - Delegation identifier
 * @returns {Promise<void>}
 */
export declare const revokeDelegation: (delegationId: string) => Promise<void>;
/**
 * Creates governance policy.
 *
 * @param {GovernancePolicy} policy - Policy configuration
 * @returns {Promise<GovernancePolicy>} Created policy
 */
export declare const createGovernancePolicy: (policy: GovernancePolicy) => Promise<GovernancePolicy>;
/**
 * Enforces governance policy on access request.
 *
 * @param {AccessRequest} request - Access request
 * @param {GovernancePolicy[]} policies - Active policies
 * @returns {Promise<AccessDecisionResult>} Policy enforcement result
 */
export declare const enforceGovernancePolicy: (request: AccessRequest, policies: GovernancePolicy[]) => Promise<AccessDecisionResult>;
/**
 * Audits permission changes.
 *
 * @param {string} resourceId - Resource identifier
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Promise<any[]>} Permission change audit trail
 */
export declare const auditPermissionChanges: (resourceId: string, startDate: Date, endDate: Date) => Promise<any[]>;
/**
 * Generates access analytics report.
 *
 * @param {string} resourceId - Resource identifier
 * @param {Date} startDate - Report start date
 * @param {Date} endDate - Report end date
 * @returns {Promise<AccessAnalytics>} Access analytics
 */
export declare const generateAccessAnalytics: (resourceId: string, startDate: Date, endDate: Date) => Promise<AccessAnalytics>;
/**
 * Implements emergency access override (break-glass).
 *
 * @param {string} userId - User identifier
 * @param {string} resourceId - Resource identifier
 * @param {string} reason - Emergency reason
 * @returns {Promise<string>} Override session token
 */
export declare const createEmergencyAccessOverride: (userId: string, resourceId: string, reason: string) => Promise<string>;
/**
 * Validates emergency access session for break-glass scenarios.
 * Verifies token validity, expiration, and logging requirements.
 *
 * @param {string} sessionToken - Emergency access session token
 * @returns {Promise<boolean>} Whether emergency access session is valid
 * @throws {Error} If session token is invalid or expired
 *
 * @example
 * ```typescript
 * const isValid = await validateEmergencyAccess('emerg_abc123xyz');
 * if (isValid) {
 *   console.log('Emergency access granted - logged and audited');
 * }
 * ```
 */
export declare const validateEmergencyAccess: (sessionToken: string) => Promise<boolean>;
/**
 * Bulk grants permissions to multiple users.
 *
 * @param {string[]} userIds - User identifiers
 * @param {string} resourceId - Resource identifier
 * @param {PermissionAction[]} actions - Permission actions
 * @returns {Promise<PermissionConfig[]>} Created permissions
 */
export declare const bulkGrantPermissions: (userIds: string[], resourceId: string, actions: PermissionAction[]) => Promise<PermissionConfig[]>;
/**
 * Bulk revokes permissions from multiple users.
 *
 * @param {string[]} permissionIds - Permission identifiers
 * @returns {Promise<number>} Number of revoked permissions
 */
export declare const bulkRevokePermissions: (permissionIds: string[]) => Promise<number>;
/**
 * Checks HIPAA minimum necessary access compliance.
 *
 * @param {string} userId - User identifier
 * @param {string} resourceId - Resource identifier
 * @param {PermissionAction} action - Requested action
 * @returns {Promise<boolean>} Whether access meets minimum necessary
 */
export declare const validateMinimumNecessaryAccess: (userId: string, resourceId: string, action: PermissionAction) => Promise<boolean>;
/**
 * Retrieves user permission history.
 *
 * @param {string} userId - User identifier
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Promise<any[]>} Permission history
 */
export declare const getUserPermissionHistory: (userId: string, startDate: Date, endDate: Date) => Promise<any[]>;
/**
 * Applies time-based permission expiration.
 *
 * @param {string} permissionId - Permission identifier
 * @param {Date} expiresAt - Expiration date
 * @returns {Promise<void>}
 */
export declare const setPermissionExpiration: (permissionId: string, expiresAt: Date) => Promise<void>;
/**
 * Processes cleanup of expired permissions.
 * Identifies and removes permissions past their expiration date.
 *
 * @returns {Promise<number>} Number of permissions cleaned up
 * @throws {Error} If cleanup process fails
 *
 * @example
 * ```typescript
 * const cleaned = await cleanupExpiredPermissions();
 * console.log('Cleaned up', cleaned, 'expired permissions');
 * ```
 */
export declare const cleanupExpiredPermissions: () => Promise<number>;
/**
 * Creates permission template for reuse.
 *
 * @param {string} name - Template name
 * @param {PermissionConfig} template - Permission template
 * @returns {Promise<any>} Created template
 */
export declare const createPermissionTemplate: (name: string, template: PermissionConfig) => Promise<any>;
/**
 * Applies permission template to resource.
 *
 * @param {string} templateId - Template identifier
 * @param {string} resourceId - Resource identifier
 * @returns {Promise<PermissionConfig[]>} Applied permissions
 */
export declare const applyPermissionTemplate: (templateId: string, resourceId: string) => Promise<PermissionConfig[]>;
/**
 * Transfers resource ownership.
 *
 * @param {string} resourceId - Resource identifier
 * @param {string} newOwnerId - New owner user ID
 * @returns {Promise<void>}
 */
export declare const transferResourceOwnership: (resourceId: string, newOwnerId: string) => Promise<void>;
/**
 * Validates if a user has permission to assign a specific role.
 * Checks role hierarchy to prevent privilege escalation.
 *
 * @param {string} userId - User identifier requesting role assignment
 * @param {UserRole} role - Role to be assigned
 * @returns {Promise<boolean>} Whether user has permission to assign the role
 * @throws {Error} If validation fails or user/role not found
 *
 * @example
 * ```typescript
 * const canAssign = await validateRoleAssignmentPermission('user123', UserRole.DOCTOR);
 * if (canAssign) {
 *   console.log('User can assign DOCTOR role');
 * }
 * ```
 */
export declare const validateRoleAssignmentPermission: (userId: string, role: UserRole) => Promise<boolean>;
/**
 * Generates permission compliance report.
 *
 * @param {Date} startDate - Report start date
 * @param {Date} endDate - Report end date
 * @returns {Promise<any>} Compliance report
 */
export declare const generateComplianceReport: (startDate: Date, endDate: Date) => Promise<any>;
/**
 * Validates patient consent for data access.
 *
 * @param {string} patientId - Patient identifier
 * @param {string} userId - User identifier
 * @param {string} resourceId - Resource identifier
 * @returns {Promise<boolean>} Whether consent exists
 */
export declare const validatePatientConsent: (patientId: string, userId: string, resourceId: string) => Promise<boolean>;
/**
 * Retrieves share link analytics.
 *
 * @param {string} linkId - Share link identifier
 * @returns {Promise<any>} Share link analytics
 */
export declare const getShareLinkAnalytics: (linkId: string) => Promise<any>;
/**
 * Implements permission approval workflow.
 *
 * @param {string} requesterId - Requester user ID
 * @param {string} resourceId - Resource identifier
 * @param {PermissionAction[]} requestedActions - Requested actions
 * @returns {Promise<string>} Approval request ID
 */
export declare const requestPermissionApproval: (requesterId: string, resourceId: string, requestedActions: PermissionAction[]) => Promise<string>;
/**
 * Approves permission request.
 *
 * @param {string} requestId - Request identifier
 * @param {string} approverId - Approver user ID
 * @returns {Promise<PermissionConfig>} Approved permission
 */
export declare const approvePermissionRequest: (requestId: string, approverId: string) => Promise<PermissionConfig>;
/**
 * Rejects permission request.
 *
 * @param {string} requestId - Request identifier
 * @param {string} approverId - Approver user ID
 * @param {string} reason - Rejection reason
 * @returns {Promise<void>}
 */
export declare const rejectPermissionRequest: (requestId: string, approverId: string, reason: string) => Promise<void>;
/**
 * Validates permission scope for action.
 *
 * @param {PermissionConfig} permission - Permission configuration
 * @param {PermissionAction} action - Requested action
 * @returns {boolean} Whether permission includes action
 */
export declare const validatePermissionScope: (permission: PermissionConfig, action: PermissionAction) => boolean;
/**
 * Retrieves organization-wide permission statistics.
 *
 * @returns {Promise<any>} Permission statistics
 */
export declare const getPermissionStatistics: () => Promise<any>;
/**
 * Monitors permission anomalies.
 *
 * @returns {Promise<any[]>} Detected anomalies
 */
export declare const monitorPermissionAnomalies: () => Promise<any[]>;
/**
 * Generates share link URL.
 *
 * @param {string} token - Share link token
 * @returns {string} Full share link URL
 */
export declare const generateShareLinkUrl: (token: string) => string;
/**
 * Validates IP-based access restrictions for a resource.
 * Checks if the client IP address is in the allowed list for the resource.
 *
 * @param {string} ipAddress - Client IP address
 * @param {string} resourceId - Resource identifier
 * @returns {Promise<boolean>} Whether IP address is allowed to access resource
 * @throws {Error} If validation fails or parameters are invalid
 *
 * @example
 * ```typescript
 * const allowed = await validateIPRestriction('192.168.1.100', 'doc123');
 * if (!allowed) {
 *   throw new Error('Access denied from this IP address');
 * }
 * ```
 */
export declare const validateIPRestriction: (ipAddress: string, resourceId: string) => Promise<boolean>;
/**
 * PermissionGovernanceService
 *
 * Production-ready NestJS service for comprehensive permission management and governance.
 * Provides RBAC, share links, permission templates, governance policies, and compliance
 * features for healthcare access control.
 *
 * @example
 * ```typescript
 * @Controller('permissions')
 * export class PermissionController {
 *   constructor(private readonly permService: PermissionGovernanceService) {}
 *
 *   @Post('grant')
 *   async grant(@Body() dto: PermissionConfigDto) {
 *     return this.permService.grantPermission(dto);
 *   }
 *
 *   @Get('check')
 *   async check(@Body() dto: AccessRequestDto) {
 *     return this.permService.checkPermission(dto);
 *   }
 * }
 * ```
 */
export declare class PermissionGovernanceService {
    /**
     * Grants a permission to a user, role, or team.
     *
     * @param {PermissionConfig} config - Permission configuration
     * @returns {Promise<PermissionConfig>} Granted permission
     * @throws {Error} If permission grant fails
     */
    grantPermission(config: PermissionConfig): Promise<PermissionConfig>;
    /**
     * Revokes a permission.
     *
     * @param {string} permissionId - Permission identifier
     * @returns {Promise<void>}
     */
    revokePermission(permissionId: string): Promise<void>;
    /**
     * Checks if a user has permission for an action.
     *
     * @param {AccessRequest} request - Access request
     * @returns {Promise<AccessDecisionResult>} Access decision
     */
    checkPermission(request: AccessRequest): Promise<AccessDecisionResult>;
    /**
     * Creates a secure share link.
     *
     * @param {Partial<ShareLinkConfig>} config - Share link configuration
     * @returns {Promise<ShareLinkConfig>} Created share link
     */
    createShareLink(config: Partial<ShareLinkConfig>): Promise<ShareLinkConfig>;
    /**
     * Validates a share link token.
     *
     * @param {string} token - Share link token
     * @returns {Promise<ShareLinkValidation>} Validation result
     */
    validateShareLink(token: string): Promise<ShareLinkValidation>;
    /**
     * Gets all permissions for a resource.
     *
     * @param {string} resourceId - Resource identifier
     * @returns {Promise<PermissionConfig[]>} Resource permissions
     */
    getResourcePermissions(resourceId: string): Promise<PermissionConfig[]>;
    /**
     * Gets effective permissions for a user.
     *
     * @param {string} userId - User identifier
     * @param {string} resourceId - Resource identifier
     * @returns {Promise<PermissionAction[]>} Effective permissions
     */
    getUserEffectivePermissions(userId: string, resourceId: string): Promise<PermissionAction[]>;
    /**
     * Assigns a role to a user.
     *
     * @param {string} userId - User identifier
     * @param {UserRole} role - Role to assign
     * @returns {Promise<void>}
     */
    assignRole(userId: string, role: UserRole): Promise<void>;
    /**
     * Gets all roles for a user.
     *
     * @param {string} userId - User identifier
     * @returns {Promise<UserRole[]>} User roles
     */
    getUserRoles(userId: string): Promise<UserRole[]>;
    /**
     * Creates a custom role.
     *
     * @param {string} name - Role name
     * @param {PermissionAction[]} permissions - Role permissions
     * @returns {Promise<any>} Created role
     */
    createCustomRole(name: string, permissions: PermissionAction[]): Promise<any>;
    /**
     * Creates a governance policy.
     *
     * @param {GovernancePolicy} policy - Policy configuration
     * @returns {Promise<GovernancePolicy>} Created policy
     */
    createGovernancePolicy(policy: GovernancePolicy): Promise<GovernancePolicy>;
    /**
     * Enforces governance policies on an action.
     *
     * @param {string} resourceId - Resource identifier
     * @param {string} action - Action to enforce
     * @returns {Promise<boolean>} Whether action is allowed by policies
     */
    enforceGovernancePolicy(resourceId: string, action: string): Promise<boolean>;
    /**
     * Creates emergency access override.
     *
     * @param {string} userId - User identifier
     * @param {string} resourceId - Resource identifier
     * @param {string} reason - Override reason
     * @returns {Promise<string>} Emergency access token
     */
    createEmergencyAccess(userId: string, resourceId: string, reason: string): Promise<string>;
    /**
     * Validates emergency access.
     *
     * @param {string} sessionToken - Emergency session token
     * @returns {Promise<boolean>} Whether session is valid
     */
    validateEmergencyAccess(sessionToken: string): Promise<boolean>;
    /**
     * Cleans up expired permissions.
     *
     * @returns {Promise<number>} Number cleaned
     */
    cleanupExpiredPermissions(): Promise<number>;
    /**
     * Generates compliance report.
     *
     * @param {Date} startDate - Start date
     * @param {Date} endDate - End date
     * @returns {Promise<any>} Compliance report
     */
    generateComplianceReport(startDate: Date, endDate: Date): Promise<any>;
}
declare const _default: {
    PermissionModel: typeof PermissionModel;
    ShareLinkModel: typeof ShareLinkModel;
    RoleModel: typeof RoleModel;
    GovernancePolicyModel: typeof GovernancePolicyModel;
    grantPermission: (config: PermissionConfig) => Promise<PermissionConfig>;
    revokePermission: (permissionId: string) => Promise<void>;
    checkPermission: (request: AccessRequest) => Promise<AccessDecisionResult>;
    evaluatePermissionConditions: (permission: PermissionConfig, request: AccessRequest) => boolean;
    createShareLink: (resourceId: string, accessLevel: ShareLinkAccessLevel, createdBy: string, options?: Partial<ShareLinkConfig>) => Promise<ShareLinkConfig>;
    validateShareLink: (token: string, password?: string) => Promise<ShareLinkConfig | null>;
    revokeShareLink: (linkId: string) => Promise<void>;
    getResourcePermissions: (resourceId: string) => Promise<PermissionConfig[]>;
    getUserEffectivePermissions: (userId: string, resourceId: string) => Promise<PermissionAction[]>;
    createCustomRole: (name: UserRole, permissions: PermissionAction[], displayName: string) => Promise<RoleDefinition>;
    assignRoleToUser: (userId: string, role: UserRole) => Promise<void>;
    removeRoleFromUser: (userId: string, role: UserRole) => Promise<void>;
    getUserRoles: (userId: string) => Promise<UserRole[]>;
    resolveRoleHierarchy: (roles: UserRole[]) => Promise<PermissionAction[]>;
    applyPermissionInheritance: (parentResourceId: string, childResourceId: string, strategy: InheritanceStrategy) => Promise<void>;
    delegatePermissions: (delegatorId: string, delegateeId: string, resourceId: string, permissions: PermissionAction[], expiresAt: Date) => Promise<PermissionDelegation>;
    revokeDelegation: (delegationId: string) => Promise<void>;
    createGovernancePolicy: (policy: GovernancePolicy) => Promise<GovernancePolicy>;
    enforceGovernancePolicy: (request: AccessRequest, policies: GovernancePolicy[]) => Promise<AccessDecisionResult>;
    auditPermissionChanges: (resourceId: string, startDate: Date, endDate: Date) => Promise<any[]>;
    generateAccessAnalytics: (resourceId: string, startDate: Date, endDate: Date) => Promise<AccessAnalytics>;
    createEmergencyAccessOverride: (userId: string, resourceId: string, reason: string) => Promise<string>;
    validateEmergencyAccess: (sessionToken: string) => Promise<boolean>;
    bulkGrantPermissions: (userIds: string[], resourceId: string, actions: PermissionAction[]) => Promise<PermissionConfig[]>;
    bulkRevokePermissions: (permissionIds: string[]) => Promise<number>;
    validateMinimumNecessaryAccess: (userId: string, resourceId: string, action: PermissionAction) => Promise<boolean>;
    getUserPermissionHistory: (userId: string, startDate: Date, endDate: Date) => Promise<any[]>;
    setPermissionExpiration: (permissionId: string, expiresAt: Date) => Promise<void>;
    cleanupExpiredPermissions: () => Promise<number>;
    createPermissionTemplate: (name: string, template: PermissionConfig) => Promise<any>;
    applyPermissionTemplate: (templateId: string, resourceId: string) => Promise<PermissionConfig[]>;
    transferResourceOwnership: (resourceId: string, newOwnerId: string) => Promise<void>;
    validateRoleAssignmentPermission: (userId: string, role: UserRole) => Promise<boolean>;
    generateComplianceReport: (startDate: Date, endDate: Date) => Promise<any>;
    validatePatientConsent: (patientId: string, userId: string, resourceId: string) => Promise<boolean>;
    getShareLinkAnalytics: (linkId: string) => Promise<any>;
    requestPermissionApproval: (requesterId: string, resourceId: string, requestedActions: PermissionAction[]) => Promise<string>;
    approvePermissionRequest: (requestId: string, approverId: string) => Promise<PermissionConfig>;
    rejectPermissionRequest: (requestId: string, approverId: string, reason: string) => Promise<void>;
    validatePermissionScope: (permission: PermissionConfig, action: PermissionAction) => boolean;
    getPermissionStatistics: () => Promise<any>;
    monitorPermissionAnomalies: () => Promise<any[]>;
    generateShareLinkUrl: (token: string) => string;
    validateIPRestriction: (ipAddress: string, resourceId: string) => Promise<boolean>;
    PermissionGovernanceService: typeof PermissionGovernanceService;
};
export default _default;
//# sourceMappingURL=document-permission-governance-composite.d.ts.map