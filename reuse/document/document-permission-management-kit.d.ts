/**
 * LOC: DOC-PERM-001
 * File: /reuse/document/document-permission-management-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/core
 *   - crypto (Node.js)
 *   - sequelize (v6.x)
 *   - jsonwebtoken (v9.x)
 *
 * DOWNSTREAM (imported by):
 *   - Document permission controllers
 *   - Access control services
 *   - Share link management modules
 *   - Healthcare collaboration services
 *   - RBAC authorization handlers
 */
/**
 * File: /reuse/document/document-permission-management-kit.ts
 * Locator: WC-UTL-DOCPERM-001
 * Purpose: Enterprise Document Permission Management Kit - Granular permissions, RBAC, share links, expiration, inheritance, analytics
 *
 * Upstream: @nestjs/common, @nestjs/core, crypto, sequelize, jsonwebtoken
 * Downstream: Permission controllers, access control services, share link modules, collaboration handlers
 * Dependencies: NestJS 10.x, Sequelize 6.x, TypeScript 5.x, jsonwebtoken 9.x
 * Exports: 40 utility functions for granular permissions, role-based access, share links, time-based expiration, permission inheritance, access analytics
 *
 * LLM Context: Production-grade document permission management for White Cross healthcare platform.
 * Provides granular read/write/share/delete permissions, role-based access control (RBAC), secure share link
 * generation with expiration, time-based permission expiration, hierarchical permission inheritance, access
 * analytics and audit logging. Essential for HIPAA-compliant document sharing, healthcare team collaboration,
 * patient data access control, and regulatory compliance. Supports NestJS guards, custom decorators, and
 * enterprise authorization patterns.
 */
import { Sequelize, Transaction } from 'sequelize';
/**
 * Permission action types
 */
export type PermissionAction = 'read' | 'write' | 'delete' | 'share' | 'admin';
/**
 * Permission grant types
 */
export type PermissionGrantType = 'user' | 'role' | 'team' | 'organization' | 'public';
/**
 * User roles for RBAC
 */
export type UserRole = 'super_admin' | 'admin' | 'doctor' | 'nurse' | 'staff' | 'patient' | 'viewer' | 'guest';
/**
 * Share link access levels
 */
export type ShareLinkAccessLevel = 'view' | 'comment' | 'edit' | 'full';
/**
 * Permission inheritance strategies
 */
export type InheritanceStrategy = 'cascade' | 'override' | 'merge' | 'block';
/**
 * Granular permission configuration
 */
export interface PermissionConfig {
    actions: PermissionAction[];
    grantType: PermissionGrantType;
    granteeId: string;
    resourceId: string;
    resourceType: string;
    expiresAt?: Date;
    conditions?: PermissionCondition[];
    metadata?: Record<string, any>;
}
/**
 * Permission conditions for dynamic access control
 */
export interface PermissionCondition {
    field: string;
    operator: 'eq' | 'ne' | 'gt' | 'lt' | 'in' | 'contains' | 'regex';
    value: any;
    type?: 'time' | 'ip' | 'location' | 'attribute';
}
/**
 * Access control list entry
 */
export interface ACLEntry {
    id: string;
    resourceId: string;
    resourceType: string;
    granteeId: string;
    granteeType: PermissionGrantType;
    actions: PermissionAction[];
    granted: boolean;
    expiresAt?: Date;
    inheritedFrom?: string;
    conditions?: PermissionCondition[];
    priority: number;
}
/**
 * Share link configuration
 */
export interface ShareLinkConfig {
    resourceId: string;
    resourceType: string;
    accessLevel: ShareLinkAccessLevel;
    password?: string;
    expiresAt?: Date;
    maxUses?: number;
    allowedEmails?: string[];
    allowedDomains?: string[];
    requireAuthentication?: boolean;
    notifyOwner?: boolean;
    customMessage?: string;
}
/**
 * Share link validation result
 */
export interface ShareLinkValidation {
    valid: boolean;
    expired?: boolean;
    maxUsesReached?: boolean;
    passwordRequired?: boolean;
    authenticationRequired?: boolean;
    emailNotAllowed?: boolean;
    errors?: string[];
    accessLevel?: ShareLinkAccessLevel;
    resourceId?: string;
}
/**
 * Permission inheritance configuration
 */
export interface InheritanceConfig {
    parentResourceId: string;
    childResourceId: string;
    strategy: InheritanceStrategy;
    includeActions?: PermissionAction[];
    excludeActions?: PermissionAction[];
    cascade?: boolean;
}
/**
 * Permission check result
 */
export interface PermissionCheckResult {
    granted: boolean;
    actions: PermissionAction[];
    denyReasons?: string[];
    appliedRules?: string[];
    expiresAt?: Date;
    inheritedFrom?: string;
}
/**
 * Access analytics data
 */
export interface AccessAnalytics {
    resourceId: string;
    totalAccesses: number;
    uniqueUsers: number;
    accessesByAction: Record<PermissionAction, number>;
    accessesByUser: Record<string, number>;
    recentAccesses: AccessLogEntry[];
    averageAccessDuration?: number;
    peakAccessTimes?: Date[];
}
/**
 * Access log entry
 */
export interface AccessLogEntry {
    id: string;
    resourceId: string;
    resourceType: string;
    userId: string;
    action: PermissionAction;
    granted: boolean;
    deniedReason?: string;
    ipAddress?: string;
    userAgent?: string;
    timestamp: Date;
    duration?: number;
    metadata?: Record<string, any>;
}
/**
 * Role definition for RBAC
 */
export interface RoleDefinition {
    name: UserRole;
    displayName: string;
    permissions: PermissionAction[];
    inheritsFrom?: UserRole[];
    priority: number;
    conditions?: PermissionCondition[];
}
/**
 * Bulk permission operation
 */
export interface BulkPermissionOperation {
    operation: 'grant' | 'revoke' | 'update';
    resourceIds: string[];
    granteeIds: string[];
    actions: PermissionAction[];
    expiresAt?: Date;
}
/**
 * Permission audit report
 */
export interface PermissionAuditReport {
    resourceId: string;
    totalPermissions: number;
    activePermissions: number;
    expiredPermissions: number;
    permissionsByType: Record<PermissionGrantType, number>;
    permissionsByAction: Record<PermissionAction, number>;
    unusedPermissions: string[];
    riskAssessment: {
        overPrivilegedUsers: string[];
        publicAccess: boolean;
        expiringPermissions: number;
        orphanedPermissions: number;
    };
}
/**
 * Permission model attributes
 */
export interface PermissionAttributes {
    id: string;
    resourceId: string;
    resourceType: string;
    granteeId: string;
    granteeType: PermissionGrantType;
    actions: PermissionAction[];
    granted: boolean;
    expiresAt?: Date;
    inheritedFrom?: string;
    parentPermissionId?: string;
    conditions?: Record<string, any>[];
    priority: number;
    revokedAt?: Date;
    revokedBy?: string;
    revokedReason?: string;
    metadata?: Record<string, any>;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Share link model attributes
 */
export interface ShareLinkAttributes {
    id: string;
    token: string;
    resourceId: string;
    resourceType: string;
    accessLevel: ShareLinkAccessLevel;
    password?: string;
    expiresAt?: Date;
    maxUses?: number;
    currentUses: number;
    allowedEmails?: string[];
    allowedDomains?: string[];
    requireAuthentication: boolean;
    notifyOwner: boolean;
    customMessage?: string;
    isActive: boolean;
    lastAccessedAt?: Date;
    lastAccessedBy?: string;
    revokedAt?: Date;
    revokedBy?: string;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Access control model attributes
 */
export interface AccessControlAttributes {
    id: string;
    resourceId: string;
    resourceType: string;
    userId: string;
    action: PermissionAction;
    granted: boolean;
    deniedReason?: string;
    permissionId?: string;
    shareLinkId?: string;
    ipAddress?: string;
    userAgent?: string;
    location?: string;
    duration?: number;
    metadata?: Record<string, any>;
    timestamp: Date;
    createdAt: Date;
}
/**
 * Creates Permission model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<PermissionAttributes>>} Permission model
 *
 * @example
 * ```typescript
 * const PermissionModel = createPermissionModel(sequelize);
 * const permission = await PermissionModel.create({
 *   resourceId: 'doc-uuid',
 *   resourceType: 'document',
 *   granteeId: 'user-uuid',
 *   granteeType: 'user',
 *   actions: ['read', 'write'],
 *   granted: true,
 *   priority: 10,
 *   createdBy: 'admin-uuid'
 * });
 * ```
 */
export declare const createPermissionModel: (sequelize: Sequelize) => any;
/**
 * Creates ShareLink model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<ShareLinkAttributes>>} ShareLink model
 *
 * @example
 * ```typescript
 * const ShareLinkModel = createShareLinkModel(sequelize);
 * const shareLink = await ShareLinkModel.create({
 *   token: 'abc123xyz',
 *   resourceId: 'doc-uuid',
 *   resourceType: 'document',
 *   accessLevel: 'view',
 *   expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
 *   maxUses: 10,
 *   currentUses: 0,
 *   requireAuthentication: false,
 *   notifyOwner: true,
 *   isActive: true,
 *   createdBy: 'user-uuid'
 * });
 * ```
 */
export declare const createShareLinkModel: (sequelize: Sequelize) => any;
/**
 * Creates AccessControl model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<AccessControlAttributes>>} AccessControl model
 *
 * @example
 * ```typescript
 * const AccessControlModel = createAccessControlModel(sequelize);
 * const log = await AccessControlModel.create({
 *   resourceId: 'doc-uuid',
 *   resourceType: 'document',
 *   userId: 'user-uuid',
 *   action: 'read',
 *   granted: true,
 *   permissionId: 'perm-uuid',
 *   ipAddress: '192.168.1.1',
 *   timestamp: new Date()
 * });
 * ```
 */
export declare const createAccessControlModel: (sequelize: Sequelize) => any;
/**
 * 1. Grants granular permission to user or role.
 *
 * @param {PermissionConfig} config - Permission configuration
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<ACLEntry>} Created permission entry
 *
 * @example
 * ```typescript
 * const permission = await grantPermission({
 *   actions: ['read', 'write'],
 *   grantType: 'user',
 *   granteeId: 'user-123',
 *   resourceId: 'doc-456',
 *   resourceType: 'document',
 *   expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
 * });
 * ```
 */
export declare const grantPermission: (config: PermissionConfig, transaction?: Transaction) => Promise<ACLEntry>;
/**
 * 2. Revokes permission from user or role.
 *
 * @param {string} permissionId - Permission ID to revoke
 * @param {string} revokedBy - User revoking permission
 * @param {string} [reason] - Revocation reason
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await revokePermission('perm-123', 'admin-456', 'User left team');
 * ```
 */
export declare const revokePermission: (permissionId: string, revokedBy: string, reason?: string, transaction?: Transaction) => Promise<void>;
/**
 * 3. Checks if user has specific permission.
 *
 * @param {string} userId - User ID to check
 * @param {string} resourceId - Resource ID
 * @param {PermissionAction} action - Action to check
 * @param {Record<string, any>} [context] - Additional context for conditions
 * @returns {Promise<PermissionCheckResult>} Permission check result
 *
 * @example
 * ```typescript
 * const result = await checkPermission('user-123', 'doc-456', 'write', {
 *   ipAddress: '192.168.1.1',
 *   timestamp: new Date()
 * });
 * if (result.granted) {
 *   // Allow write access
 * }
 * ```
 */
export declare const checkPermission: (userId: string, resourceId: string, action: PermissionAction, context?: Record<string, any>) => Promise<PermissionCheckResult>;
/**
 * 4. Lists all permissions for a resource.
 *
 * @param {string} resourceId - Resource ID
 * @param {string} [resourceType] - Optional resource type filter
 * @param {boolean} [includeExpired] - Include expired permissions
 * @returns {Promise<ACLEntry[]>} List of permissions
 *
 * @example
 * ```typescript
 * const permissions = await listResourcePermissions('doc-123', 'document', false);
 * console.log(`Total permissions: ${permissions.length}`);
 * ```
 */
export declare const listResourcePermissions: (resourceId: string, resourceType?: string, includeExpired?: boolean) => Promise<ACLEntry[]>;
/**
 * 5. Lists all permissions for a user.
 *
 * @param {string} userId - User ID
 * @param {string} [resourceType] - Optional resource type filter
 * @param {PermissionAction[]} [actions] - Optional action filter
 * @returns {Promise<ACLEntry[]>} List of user permissions
 *
 * @example
 * ```typescript
 * const userPerms = await listUserPermissions('user-123', 'document', ['read', 'write']);
 * ```
 */
export declare const listUserPermissions: (userId: string, resourceType?: string, actions?: PermissionAction[]) => Promise<ACLEntry[]>;
/**
 * 6. Updates existing permission.
 *
 * @param {string} permissionId - Permission ID to update
 * @param {Partial<PermissionConfig>} updates - Permission updates
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<ACLEntry>} Updated permission
 *
 * @example
 * ```typescript
 * const updated = await updatePermission('perm-123', {
 *   actions: ['read', 'write', 'share'],
 *   expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)
 * });
 * ```
 */
export declare const updatePermission: (permissionId: string, updates: Partial<PermissionConfig>, transaction?: Transaction) => Promise<ACLEntry>;
/**
 * 7. Bulk grants permissions to multiple users.
 *
 * @param {BulkPermissionOperation} operation - Bulk operation config
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<{ success: number; failed: number; errors: string[] }>} Bulk operation result
 *
 * @example
 * ```typescript
 * const result = await bulkGrantPermissions({
 *   operation: 'grant',
 *   resourceIds: ['doc-1', 'doc-2', 'doc-3'],
 *   granteeIds: ['user-1', 'user-2'],
 *   actions: ['read', 'write'],
 *   expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
 * });
 * console.log(`Granted ${result.success} permissions`);
 * ```
 */
export declare const bulkGrantPermissions: (operation: BulkPermissionOperation, transaction?: Transaction) => Promise<{
    success: number;
    failed: number;
    errors: string[];
}>;
/**
 * 8. Checks multiple permissions at once.
 *
 * @param {string} userId - User ID
 * @param {string[]} resourceIds - Resource IDs to check
 * @param {PermissionAction[]} actions - Actions to check
 * @returns {Promise<Record<string, Record<PermissionAction, boolean>>>} Permission matrix
 *
 * @example
 * ```typescript
 * const matrix = await checkMultiplePermissions('user-123', ['doc-1', 'doc-2'], ['read', 'write']);
 * console.log('Can read doc-1:', matrix['doc-1']['read']);
 * ```
 */
export declare const checkMultiplePermissions: (userId: string, resourceIds: string[], actions: PermissionAction[]) => Promise<Record<string, Record<PermissionAction, boolean>>>;
/**
 * 9. Defines a role with permissions.
 *
 * @param {RoleDefinition} role - Role definition
 * @returns {Promise<RoleDefinition>} Created role
 *
 * @example
 * ```typescript
 * const role = await defineRole({
 *   name: 'doctor',
 *   displayName: 'Medical Doctor',
 *   permissions: ['read', 'write', 'share'],
 *   priority: 100,
 *   inheritsFrom: ['staff']
 * });
 * ```
 */
export declare const defineRole: (role: RoleDefinition) => Promise<RoleDefinition>;
/**
 * 10. Assigns role to user for a resource.
 *
 * @param {string} userId - User ID
 * @param {UserRole} role - Role to assign
 * @param {string} resourceId - Resource ID
 * @param {string} resourceType - Resource type
 * @param {Date} [expiresAt] - Optional expiration
 * @returns {Promise<ACLEntry>} Role assignment
 *
 * @example
 * ```typescript
 * const assignment = await assignRoleToUser('user-123', 'doctor', 'doc-456', 'document');
 * ```
 */
export declare const assignRoleToUser: (userId: string, role: UserRole, resourceId: string, resourceType: string, expiresAt?: Date) => Promise<ACLEntry>;
/**
 * 11. Removes role from user.
 *
 * @param {string} userId - User ID
 * @param {UserRole} role - Role to remove
 * @param {string} resourceId - Resource ID
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await removeRoleFromUser('user-123', 'doctor', 'doc-456');
 * ```
 */
export declare const removeRoleFromUser: (userId: string, role: UserRole, resourceId: string) => Promise<void>;
/**
 * 12. Gets permissions for a role.
 *
 * @param {UserRole} role - Role name
 * @returns {Promise<RoleDefinition>} Role definition with permissions
 *
 * @example
 * ```typescript
 * const rolePerms = await getRolePermissions('doctor');
 * console.log('Doctor can:', rolePerms.permissions);
 * ```
 */
export declare const getRolePermissions: (role: UserRole) => Promise<RoleDefinition>;
/**
 * 13. Checks if user has role for resource.
 *
 * @param {string} userId - User ID
 * @param {UserRole} role - Role to check
 * @param {string} resourceId - Resource ID
 * @returns {Promise<boolean>} True if user has role
 *
 * @example
 * ```typescript
 * const hasRole = await hasRole('user-123', 'doctor', 'doc-456');
 * ```
 */
export declare const hasRole: (userId: string, role: UserRole, resourceId: string) => Promise<boolean>;
/**
 * 14. Lists all roles for a user.
 *
 * @param {string} userId - User ID
 * @param {string} [resourceId] - Optional resource filter
 * @returns {Promise<UserRole[]>} List of user roles
 *
 * @example
 * ```typescript
 * const roles = await listUserRoles('user-123', 'doc-456');
 * console.log('User roles:', roles);
 * ```
 */
export declare const listUserRoles: (userId: string, resourceId?: string) => Promise<UserRole[]>;
/**
 * 15. Resolves effective permissions from multiple roles.
 *
 * @param {UserRole[]} roles - User roles
 * @returns {Promise<{ actions: PermissionAction[]; highestRole: UserRole }>} Resolved permissions
 *
 * @example
 * ```typescript
 * const effective = await resolveRolePermissions(['doctor', 'staff']);
 * console.log('Effective permissions:', effective.actions);
 * ```
 */
export declare const resolveRolePermissions: (roles: UserRole[]) => Promise<{
    actions: PermissionAction[];
    highestRole: UserRole;
}>;
/**
 * 16. Generates secure share link for resource.
 *
 * @param {ShareLinkConfig} config - Share link configuration
 * @returns {Promise<{ token: string; url: string; shareLink: ShareLinkAttributes }>} Share link data
 *
 * @example
 * ```typescript
 * const shareLink = await generateShareLink({
 *   resourceId: 'doc-123',
 *   resourceType: 'document',
 *   accessLevel: 'view',
 *   expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
 *   maxUses: 10,
 *   password: 'secret123',
 *   requireAuthentication: false
 * });
 * console.log('Share URL:', shareLink.url);
 * ```
 */
export declare const generateShareLink: (config: ShareLinkConfig) => Promise<{
    token: string;
    url: string;
    shareLink: ShareLinkAttributes;
}>;
/**
 * 17. Validates share link token.
 *
 * @param {string} token - Share link token
 * @param {string} [password] - Optional password for protected links
 * @param {string} [email] - Optional email for restricted links
 * @returns {Promise<ShareLinkValidation>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateShareLink('abc123xyz', 'password', 'user@example.com');
 * if (validation.valid) {
 *   console.log('Access level:', validation.accessLevel);
 * }
 * ```
 */
export declare const validateShareLink: (token: string, password?: string, email?: string) => Promise<ShareLinkValidation>;
/**
 * 18. Revokes share link.
 *
 * @param {string} token - Share link token
 * @param {string} revokedBy - User revoking link
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await revokeShareLink('abc123xyz', 'admin-456');
 * ```
 */
export declare const revokeShareLink: (token: string, revokedBy: string) => Promise<void>;
/**
 * 19. Lists all share links for resource.
 *
 * @param {string} resourceId - Resource ID
 * @param {boolean} [includeRevoked] - Include revoked links
 * @returns {Promise<ShareLinkAttributes[]>} List of share links
 *
 * @example
 * ```typescript
 * const links = await listShareLinks('doc-123', false);
 * console.log(`Active share links: ${links.length}`);
 * ```
 */
export declare const listShareLinks: (resourceId: string, includeRevoked?: boolean) => Promise<ShareLinkAttributes[]>;
/**
 * 20. Records share link access.
 *
 * @param {string} token - Share link token
 * @param {string} [userId] - Optional user ID
 * @param {string} [ipAddress] - IP address
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await recordShareLinkAccess('abc123xyz', 'user-123', '192.168.1.1');
 * ```
 */
export declare const recordShareLinkAccess: (token: string, userId?: string, ipAddress?: string) => Promise<void>;
/**
 * 21. Updates share link configuration.
 *
 * @param {string} token - Share link token
 * @param {Partial<ShareLinkConfig>} updates - Configuration updates
 * @returns {Promise<ShareLinkAttributes>} Updated share link
 *
 * @example
 * ```typescript
 * const updated = await updateShareLink('abc123xyz', {
 *   expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
 *   maxUses: 20
 * });
 * ```
 */
export declare const updateShareLink: (token: string, updates: Partial<ShareLinkConfig>) => Promise<ShareLinkAttributes>;
/**
 * 22. Generates password-protected share link.
 *
 * @param {ShareLinkConfig} config - Share link configuration with password
 * @returns {Promise<{ token: string; url: string; password: string }>} Protected share link
 *
 * @example
 * ```typescript
 * const protected = await generateProtectedShareLink({
 *   resourceId: 'doc-123',
 *   resourceType: 'document',
 *   accessLevel: 'edit',
 *   password: 'SecurePass123!'
 * });
 * ```
 */
export declare const generateProtectedShareLink: (config: ShareLinkConfig) => Promise<{
    token: string;
    url: string;
    password: string;
}>;
/**
 * 23. Sets expiration for permission.
 *
 * @param {string} permissionId - Permission ID
 * @param {Date} expiresAt - Expiration date
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await setPermissionExpiration('perm-123', new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));
 * ```
 */
export declare const setPermissionExpiration: (permissionId: string, expiresAt: Date) => Promise<void>;
/**
 * 24. Extends permission expiration.
 *
 * @param {string} permissionId - Permission ID
 * @param {number} extensionMs - Extension time in milliseconds
 * @returns {Promise<Date>} New expiration date
 *
 * @example
 * ```typescript
 * const newExpiry = await extendPermission('perm-123', 30 * 24 * 60 * 60 * 1000); // 30 days
 * ```
 */
export declare const extendPermission: (permissionId: string, extensionMs: number) => Promise<Date>;
/**
 * 25. Removes expiration from permission (makes permanent).
 *
 * @param {string} permissionId - Permission ID
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await makePermissionPermanent('perm-123');
 * ```
 */
export declare const makePermissionPermanent: (permissionId: string) => Promise<void>;
/**
 * 26. Lists expiring permissions.
 *
 * @param {number} daysUntilExpiry - Number of days until expiry
 * @param {string} [resourceId] - Optional resource filter
 * @returns {Promise<ACLEntry[]>} Expiring permissions
 *
 * @example
 * ```typescript
 * const expiring = await listExpiringPermissions(7, 'doc-123');
 * console.log(`${expiring.length} permissions expiring in 7 days`);
 * ```
 */
export declare const listExpiringPermissions: (daysUntilExpiry: number, resourceId?: string) => Promise<ACLEntry[]>;
/**
 * 27. Cleans up expired permissions.
 *
 * @param {boolean} [dryRun] - If true, returns count without deleting
 * @returns {Promise<{ removed: number; permissions: string[] }>} Cleanup result
 *
 * @example
 * ```typescript
 * const result = await cleanupExpiredPermissions(false);
 * console.log(`Removed ${result.removed} expired permissions`);
 * ```
 */
export declare const cleanupExpiredPermissions: (dryRun?: boolean) => Promise<{
    removed: number;
    permissions: string[];
}>;
/**
 * 28. Sets auto-renewal for permission.
 *
 * @param {string} permissionId - Permission ID
 * @param {number} renewalPeriodMs - Renewal period in milliseconds
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await setAutoRenewal('perm-123', 30 * 24 * 60 * 60 * 1000); // Auto-renew every 30 days
 * ```
 */
export declare const setAutoRenewal: (permissionId: string, renewalPeriodMs: number) => Promise<void>;
/**
 * 29. Notifies users of expiring permissions.
 *
 * @param {number} daysBeforeExpiry - Days before expiry to notify
 * @returns {Promise<{ notified: number; users: string[] }>} Notification result
 *
 * @example
 * ```typescript
 * const result = await notifyExpiringPermissions(3);
 * console.log(`Notified ${result.notified} users`);
 * ```
 */
export declare const notifyExpiringPermissions: (daysBeforeExpiry: number) => Promise<{
    notified: number;
    users: string[];
}>;
/**
 * 30. Sets up permission inheritance from parent to child.
 *
 * @param {InheritanceConfig} config - Inheritance configuration
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await setupPermissionInheritance({
 *   parentResourceId: 'folder-123',
 *   childResourceId: 'doc-456',
 *   strategy: 'cascade',
 *   includeActions: ['read', 'write'],
 *   cascade: true
 * });
 * ```
 */
export declare const setupPermissionInheritance: (config: InheritanceConfig) => Promise<void>;
/**
 * 31. Propagates permissions to child resources.
 *
 * @param {string} parentResourceId - Parent resource ID
 * @param {InheritanceStrategy} strategy - Propagation strategy
 * @returns {Promise<{ propagated: number; children: string[] }>} Propagation result
 *
 * @example
 * ```typescript
 * const result = await propagatePermissions('folder-123', 'cascade');
 * console.log(`Propagated to ${result.propagated} children`);
 * ```
 */
export declare const propagatePermissions: (parentResourceId: string, strategy: InheritanceStrategy) => Promise<{
    propagated: number;
    children: string[];
}>;
/**
 * 32. Removes inherited permissions from child.
 *
 * @param {string} childResourceId - Child resource ID
 * @param {string} parentResourceId - Parent resource ID
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await removeInheritedPermissions('doc-456', 'folder-123');
 * ```
 */
export declare const removeInheritedPermissions: (childResourceId: string, parentResourceId: string) => Promise<void>;
/**
 * 33. Gets effective permissions with inheritance.
 *
 * @param {string} userId - User ID
 * @param {string} resourceId - Resource ID
 * @returns {Promise<{ direct: PermissionAction[]; inherited: PermissionAction[]; effective: PermissionAction[] }>} Effective permissions
 *
 * @example
 * ```typescript
 * const perms = await getEffectivePermissions('user-123', 'doc-456');
 * console.log('Effective actions:', perms.effective);
 * ```
 */
export declare const getEffectivePermissions: (userId: string, resourceId: string) => Promise<{
    direct: PermissionAction[];
    inherited: PermissionAction[];
    effective: PermissionAction[];
}>;
/**
 * 34. Lists all inherited permissions for resource.
 *
 * @param {string} resourceId - Resource ID
 * @returns {Promise<ACLEntry[]>} Inherited permissions
 *
 * @example
 * ```typescript
 * const inherited = await listInheritedPermissions('doc-456');
 * ```
 */
export declare const listInheritedPermissions: (resourceId: string) => Promise<ACLEntry[]>;
/**
 * 35. Overrides inherited permission with explicit permission.
 *
 * @param {string} resourceId - Resource ID
 * @param {string} granteeId - Grantee ID
 * @param {PermissionAction[]} actions - Actions to override
 * @returns {Promise<ACLEntry>} Override permission
 *
 * @example
 * ```typescript
 * const override = await overrideInheritedPermission('doc-456', 'user-123', ['read']);
 * ```
 */
export declare const overrideInheritedPermission: (resourceId: string, granteeId: string, actions: PermissionAction[]) => Promise<ACLEntry>;
/**
 * 36. Records access attempt in audit log.
 *
 * @param {Omit<AccessLogEntry, 'id' | 'timestamp'>} log - Access log data
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await logAccessAttempt({
 *   resourceId: 'doc-123',
 *   resourceType: 'document',
 *   userId: 'user-456',
 *   action: 'read',
 *   granted: true,
 *   ipAddress: '192.168.1.1',
 *   duration: 5000
 * });
 * ```
 */
export declare const logAccessAttempt: (log: Omit<AccessLogEntry, "id" | "timestamp">) => Promise<void>;
/**
 * 37. Gets access analytics for resource.
 *
 * @param {string} resourceId - Resource ID
 * @param {Date} [startDate] - Start date for analytics
 * @param {Date} [endDate] - End date for analytics
 * @returns {Promise<AccessAnalytics>} Access analytics
 *
 * @example
 * ```typescript
 * const analytics = await getAccessAnalytics('doc-123', new Date('2024-01-01'), new Date());
 * console.log(`Total accesses: ${analytics.totalAccesses}`);
 * console.log(`Unique users: ${analytics.uniqueUsers}`);
 * ```
 */
export declare const getAccessAnalytics: (resourceId: string, startDate?: Date, endDate?: Date) => Promise<AccessAnalytics>;
/**
 * 38. Generates permission audit report.
 *
 * @param {string} resourceId - Resource ID
 * @returns {Promise<PermissionAuditReport>} Audit report
 *
 * @example
 * ```typescript
 * const report = await generatePermissionAuditReport('doc-123');
 * console.log('Risk assessment:', report.riskAssessment);
 * ```
 */
export declare const generatePermissionAuditReport: (resourceId: string) => Promise<PermissionAuditReport>;
/**
 * 39. Lists denied access attempts.
 *
 * @param {string} [resourceId] - Optional resource filter
 * @param {Date} [startDate] - Start date
 * @param {Date} [endDate] - End date
 * @returns {Promise<AccessLogEntry[]>} Denied access attempts
 *
 * @example
 * ```typescript
 * const denied = await listDeniedAccessAttempts('doc-123', new Date('2024-01-01'));
 * console.log(`${denied.length} denied attempts`);
 * ```
 */
export declare const listDeniedAccessAttempts: (resourceId?: string, startDate?: Date, endDate?: Date) => Promise<AccessLogEntry[]>;
/**
 * 40. Exports access log for compliance.
 *
 * @param {string} resourceId - Resource ID
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {string} [format] - Export format (json, csv)
 * @returns {Promise<string>} Exported access log
 *
 * @example
 * ```typescript
 * const log = await exportAccessLog('doc-123', new Date('2024-01-01'), new Date(), 'json');
 * await fs.writeFile('access-log.json', log);
 * ```
 */
export declare const exportAccessLog: (resourceId: string, startDate: Date, endDate: Date, format?: string) => Promise<string>;
/**
 * NestJS guard for checking document permissions.
 *
 * @example
 * ```typescript
 * @Injectable()
 * export class DocumentPermissionGuard implements CanActivate {
 *   async canActivate(context: ExecutionContext): Promise<boolean> {
 *     const request = context.switchToHttp().getRequest();
 *     const userId = request.user.id;
 *     const documentId = request.params.id;
 *     const action = this.getActionFromMethod(request.method);
 *
 *     const result = await checkPermission(userId, documentId, action);
 *     return result.granted;
 *   }
 * }
 * ```
 */
export declare const DocumentPermissionGuardExample = "\nimport { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';\nimport { Reflector } from '@nestjs/core';\nimport { checkPermission } from './document-permission-management-kit';\n\n@Injectable()\nexport class DocumentPermissionGuard implements CanActivate {\n  constructor(private reflector: Reflector) {}\n\n  async canActivate(context: ExecutionContext): Promise<boolean> {\n    const request = context.switchToHttp().getRequest();\n    const userId = request.user?.id;\n\n    if (!userId) {\n      throw new ForbiddenException('User not authenticated');\n    }\n\n    const resourceId = request.params.id || request.body.documentId;\n    const requiredAction = this.reflector.get<string>('requiredAction', context.getHandler()) || 'read';\n\n    const result = await checkPermission(userId, resourceId, requiredAction as any);\n\n    if (!result.granted) {\n      throw new ForbiddenException(\n        result.denyReasons?.join(', ') || 'Permission denied'\n      );\n    }\n\n    return true;\n  }\n}\n";
/**
 * NestJS decorator for requiring specific permissions.
 *
 * @example
 * ```typescript
 * import { SetMetadata } from '@nestjs/common';
 *
 * export const RequirePermission = (action: PermissionAction) =>
 *   SetMetadata('requiredAction', action);
 *
 * // Usage in controller
 * @Controller('documents')
 * @UseGuards(JwtAuthGuard, DocumentPermissionGuard)
 * export class DocumentsController {
 *   @Get(':id')
 *   @RequirePermission('read')
 *   async getDocument(@Param('id') id: string) {
 *     return this.documentsService.findOne(id);
 *   }
 *
 *   @Put(':id')
 *   @RequirePermission('write')
 *   async updateDocument(@Param('id') id: string, @Body() data: any) {
 *     return this.documentsService.update(id, data);
 *   }
 *
 *   @Delete(':id')
 *   @RequirePermission('delete')
 *   async deleteDocument(@Param('id') id: string) {
 *     return this.documentsService.delete(id);
 *   }
 * }
 * ```
 */
export declare const RequirePermissionDecoratorExample = "\nimport { SetMetadata } from '@nestjs/common';\nimport { PermissionAction } from './document-permission-management-kit';\n\nexport const PERMISSION_KEY = 'requiredAction';\nexport const RequirePermission = (action: PermissionAction) =>\n  SetMetadata(PERMISSION_KEY, action);\n";
/**
 * NestJS role-based authorization guard.
 *
 * @example
 * ```typescript
 * @Injectable()
 * export class RolesGuard implements CanActivate {
 *   constructor(private reflector: Reflector) {}
 *
 *   async canActivate(context: ExecutionContext): Promise<boolean> {
 *     const requiredRoles = this.reflector.get<UserRole[]>('roles', context.getHandler());
 *     if (!requiredRoles) {
 *       return true;
 *     }
 *
 *     const request = context.switchToHttp().getRequest();
 *     const userId = request.user.id;
 *     const resourceId = request.params.id;
 *
 *     const userRoles = await listUserRoles(userId, resourceId);
 *     return requiredRoles.some(role => userRoles.includes(role));
 *   }
 * }
 * ```
 */
export declare const RolesGuardExample = "\nimport { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';\nimport { Reflector } from '@nestjs/core';\nimport { listUserRoles, UserRole } from './document-permission-management-kit';\n\n@Injectable()\nexport class RolesGuard implements CanActivate {\n  constructor(private reflector: Reflector) {}\n\n  async canActivate(context: ExecutionContext): Promise<boolean> {\n    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>('roles', [\n      context.getHandler(),\n      context.getClass(),\n    ]);\n\n    if (!requiredRoles) {\n      return true;\n    }\n\n    const request = context.switchToHttp().getRequest();\n    const userId = request.user?.id;\n    const resourceId = request.params.id;\n\n    if (!userId) {\n      return false;\n    }\n\n    const userRoles = await listUserRoles(userId, resourceId);\n    return requiredRoles.some(role => userRoles.includes(role));\n  }\n}\n";
declare const _default: {
    createPermissionModel: (sequelize: Sequelize) => any;
    createShareLinkModel: (sequelize: Sequelize) => any;
    createAccessControlModel: (sequelize: Sequelize) => any;
    grantPermission: (config: PermissionConfig, transaction?: Transaction) => Promise<ACLEntry>;
    revokePermission: (permissionId: string, revokedBy: string, reason?: string, transaction?: Transaction) => Promise<void>;
    checkPermission: (userId: string, resourceId: string, action: PermissionAction, context?: Record<string, any>) => Promise<PermissionCheckResult>;
    listResourcePermissions: (resourceId: string, resourceType?: string, includeExpired?: boolean) => Promise<ACLEntry[]>;
    listUserPermissions: (userId: string, resourceType?: string, actions?: PermissionAction[]) => Promise<ACLEntry[]>;
    updatePermission: (permissionId: string, updates: Partial<PermissionConfig>, transaction?: Transaction) => Promise<ACLEntry>;
    bulkGrantPermissions: (operation: BulkPermissionOperation, transaction?: Transaction) => Promise<{
        success: number;
        failed: number;
        errors: string[];
    }>;
    checkMultiplePermissions: (userId: string, resourceIds: string[], actions: PermissionAction[]) => Promise<Record<string, Record<PermissionAction, boolean>>>;
    defineRole: (role: RoleDefinition) => Promise<RoleDefinition>;
    assignRoleToUser: (userId: string, role: UserRole, resourceId: string, resourceType: string, expiresAt?: Date) => Promise<ACLEntry>;
    removeRoleFromUser: (userId: string, role: UserRole, resourceId: string) => Promise<void>;
    getRolePermissions: (role: UserRole) => Promise<RoleDefinition>;
    hasRole: (userId: string, role: UserRole, resourceId: string) => Promise<boolean>;
    listUserRoles: (userId: string, resourceId?: string) => Promise<UserRole[]>;
    resolveRolePermissions: (roles: UserRole[]) => Promise<{
        actions: PermissionAction[];
        highestRole: UserRole;
    }>;
    generateShareLink: (config: ShareLinkConfig) => Promise<{
        token: string;
        url: string;
        shareLink: ShareLinkAttributes;
    }>;
    validateShareLink: (token: string, password?: string, email?: string) => Promise<ShareLinkValidation>;
    revokeShareLink: (token: string, revokedBy: string) => Promise<void>;
    listShareLinks: (resourceId: string, includeRevoked?: boolean) => Promise<ShareLinkAttributes[]>;
    recordShareLinkAccess: (token: string, userId?: string, ipAddress?: string) => Promise<void>;
    updateShareLink: (token: string, updates: Partial<ShareLinkConfig>) => Promise<ShareLinkAttributes>;
    generateProtectedShareLink: (config: ShareLinkConfig) => Promise<{
        token: string;
        url: string;
        password: string;
    }>;
    setPermissionExpiration: (permissionId: string, expiresAt: Date) => Promise<void>;
    extendPermission: (permissionId: string, extensionMs: number) => Promise<Date>;
    makePermissionPermanent: (permissionId: string) => Promise<void>;
    listExpiringPermissions: (daysUntilExpiry: number, resourceId?: string) => Promise<ACLEntry[]>;
    cleanupExpiredPermissions: (dryRun?: boolean) => Promise<{
        removed: number;
        permissions: string[];
    }>;
    setAutoRenewal: (permissionId: string, renewalPeriodMs: number) => Promise<void>;
    notifyExpiringPermissions: (daysBeforeExpiry: number) => Promise<{
        notified: number;
        users: string[];
    }>;
    setupPermissionInheritance: (config: InheritanceConfig) => Promise<void>;
    propagatePermissions: (parentResourceId: string, strategy: InheritanceStrategy) => Promise<{
        propagated: number;
        children: string[];
    }>;
    removeInheritedPermissions: (childResourceId: string, parentResourceId: string) => Promise<void>;
    getEffectivePermissions: (userId: string, resourceId: string) => Promise<{
        direct: PermissionAction[];
        inherited: PermissionAction[];
        effective: PermissionAction[];
    }>;
    listInheritedPermissions: (resourceId: string) => Promise<ACLEntry[]>;
    overrideInheritedPermission: (resourceId: string, granteeId: string, actions: PermissionAction[]) => Promise<ACLEntry>;
    logAccessAttempt: (log: Omit<AccessLogEntry, "id" | "timestamp">) => Promise<void>;
    getAccessAnalytics: (resourceId: string, startDate?: Date, endDate?: Date) => Promise<AccessAnalytics>;
    generatePermissionAuditReport: (resourceId: string) => Promise<PermissionAuditReport>;
    listDeniedAccessAttempts: (resourceId?: string, startDate?: Date, endDate?: Date) => Promise<AccessLogEntry[]>;
    exportAccessLog: (resourceId: string, startDate: Date, endDate: Date, format?: string) => Promise<string>;
};
export default _default;
//# sourceMappingURL=document-permission-management-kit.d.ts.map