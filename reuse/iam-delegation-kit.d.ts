/**
 * LOC: IAM_DELEGATION_KIT_001
 * File: /reuse/iam-delegation-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - crypto
 *   - ./iam-types-kit
 *
 * DOWNSTREAM (imported by):
 *   - IAM delegation services
 *   - Permission delegation controllers
 *   - Temporary access management
 *   - Delegated administration systems
 *   - Authorization services
 */
import { UserId, ResourceId, PermissionAction } from './iam-types-kit';
/**
 * Delegation status
 */
export declare enum DelegationStatus {
    ACTIVE = "active",
    REVOKED = "revoked",
    EXPIRED = "expired",
    PENDING = "pending",
    SUSPENDED = "suspended"
}
/**
 * Delegation type
 */
export declare enum DelegationType {
    FULL_ACCESS = "full_access",
    SCOPED_PERMISSION = "scoped_permission",
    TEMPORARY_ROLE = "temporary_role",
    RESOURCE_SPECIFIC = "resource_specific",
    CONDITIONAL = "conditional"
}
/**
 * Delegation ID branded type
 */
export type DelegationId = string & {
    __brand: 'DelegationId';
};
/**
 * Delegation record
 */
export interface Delegation {
    readonly id: DelegationId;
    readonly delegator: UserId;
    readonly delegatee: UserId;
    readonly type: DelegationType;
    readonly permissions: PermissionAction[];
    readonly resources?: ResourceId[];
    readonly scope?: DelegationScope;
    readonly createdAt: Date;
    readonly expiresAt?: Date;
    readonly revokedAt?: Date;
    readonly status: DelegationStatus;
    readonly metadata: Record<string, unknown>;
    readonly reason?: string;
    readonly conditions?: DelegationCondition[];
}
/**
 * Delegation scope
 */
export interface DelegationScope {
    readonly resourceTypes?: string[];
    readonly resourceIds?: ResourceId[];
    readonly actions?: PermissionAction[];
    readonly maxUsageCount?: number;
    readonly usageCount?: number;
    readonly allowedIpRanges?: string[];
    readonly requiredMfa?: boolean;
}
/**
 * Delegation condition
 */
export interface DelegationCondition {
    readonly type: 'time' | 'location' | 'mfa' | 'usage' | 'custom';
    readonly operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'in' | 'not_in';
    readonly key: string;
    readonly value: unknown;
}
/**
 * Delegation chain
 */
export interface DelegationChain {
    readonly delegations: Delegation[];
    readonly depth: number;
    readonly rootDelegator: UserId;
    readonly finalDelegatee: UserId;
    readonly effectivePermissions: PermissionAction[];
}
/**
 * Delegation request
 */
export interface DelegationRequest {
    readonly delegatee: UserId;
    readonly type: DelegationType;
    readonly permissions: PermissionAction[];
    readonly resources?: ResourceId[];
    readonly scope?: DelegationScope;
    readonly expiresAt?: Date;
    readonly reason?: string;
    readonly conditions?: DelegationCondition[];
}
/**
 * Delegation audit entry
 */
export interface DelegationAuditEntry {
    readonly id: string;
    readonly delegationId: DelegationId;
    readonly action: 'created' | 'used' | 'revoked' | 'expired' | 'modified';
    readonly performedBy: UserId;
    readonly timestamp: Date;
    readonly ipAddress?: string;
    readonly userAgent?: string;
    readonly details: Record<string, unknown>;
}
/**
 * Delegation revocation result
 */
export interface DelegationRevocationResult {
    readonly delegationId: DelegationId;
    readonly revokedAt: Date;
    readonly revokedBy: UserId;
    readonly cascadeRevoked: DelegationId[];
    readonly reason?: string;
}
/**
 * Delegation validation result
 */
export interface DelegationValidationResult {
    readonly isValid: boolean;
    readonly delegation?: Delegation;
    readonly errors: string[];
    readonly warnings: string[];
}
/**
 * @function createDelegationId
 * @description Generates a unique delegation ID
 * @returns {DelegationId} Unique delegation ID
 *
 * @example
 * ```typescript
 * const delegationId = createDelegationId();
 * ```
 */
export declare const createDelegationId: () => DelegationId;
/**
 * @function createDelegation
 * @description Creates a new delegation record
 * @param {UserId} delegator - User granting delegation
 * @param {DelegationRequest} request - Delegation request
 * @returns {Delegation} Created delegation
 *
 * @example
 * ```typescript
 * const delegation = createDelegation(delegatorId, {
 *   delegatee: delegateeId,
 *   type: DelegationType.SCOPED_PERMISSION,
 *   permissions: ['patient:read'],
 *   expiresAt: new Date(Date.now() + 86400000)
 * });
 * ```
 */
export declare const createDelegation: (delegator: UserId, request: DelegationRequest) => Delegation;
/**
 * @function createTemporaryDelegation
 * @description Creates a time-bounded delegation
 * @param {UserId} delegator - User granting delegation
 * @param {UserId} delegatee - User receiving delegation
 * @param {PermissionAction[]} permissions - Permissions to delegate
 * @param {number} durationMs - Duration in milliseconds
 * @returns {Delegation} Created delegation
 *
 * @example
 * ```typescript
 * const delegation = createTemporaryDelegation(
 *   delegatorId,
 *   delegateeId,
 *   ['patient:read', 'patient:update'],
 *   3600000 // 1 hour
 * );
 * ```
 */
export declare const createTemporaryDelegation: (delegator: UserId, delegatee: UserId, permissions: PermissionAction[], durationMs: number) => Delegation;
/**
 * @function createScopedDelegation
 * @description Creates a scope-limited delegation
 * @param {UserId} delegator - User granting delegation
 * @param {UserId} delegatee - User receiving delegation
 * @param {PermissionAction[]} permissions - Permissions to delegate
 * @param {DelegationScope} scope - Delegation scope
 * @returns {Delegation} Created delegation
 *
 * @example
 * ```typescript
 * const delegation = createScopedDelegation(delegatorId, delegateeId, ['patient:read'], {
 *   resourceIds: [patientId1, patientId2],
 *   maxUsageCount: 10
 * });
 * ```
 */
export declare const createScopedDelegation: (delegator: UserId, delegatee: UserId, permissions: PermissionAction[], scope: DelegationScope) => Delegation;
/**
 * @function createResourceSpecificDelegation
 * @description Creates a resource-specific delegation
 * @param {UserId} delegator - User granting delegation
 * @param {UserId} delegatee - User receiving delegation
 * @param {ResourceId[]} resources - Specific resources
 * @param {PermissionAction[]} permissions - Permissions to delegate
 * @returns {Delegation} Created delegation
 *
 * @example
 * ```typescript
 * const delegation = createResourceSpecificDelegation(
 *   delegatorId,
 *   delegateeId,
 *   [patientId],
 *   ['patient:read', 'patient:update']
 * );
 * ```
 */
export declare const createResourceSpecificDelegation: (delegator: UserId, delegatee: UserId, resources: ResourceId[], permissions: PermissionAction[]) => Delegation;
/**
 * @function validateDelegation
 * @description Validates if a delegation is currently valid
 * @param {Delegation} delegation - Delegation to validate
 * @returns {DelegationValidationResult} Validation result
 *
 * @example
 * ```typescript
 * const result = validateDelegation(delegation);
 * if (!result.isValid) {
 *   console.log('Errors:', result.errors);
 * }
 * ```
 */
export declare const validateDelegation: (delegation: Delegation) => DelegationValidationResult;
/**
 * @function isDelegationActive
 * @description Checks if delegation is currently active
 * @param {Delegation} delegation - Delegation to check
 * @returns {boolean} True if active
 *
 * @example
 * ```typescript
 * if (isDelegationActive(delegation)) {
 *   // Use delegation
 * }
 * ```
 */
export declare const isDelegationActive: (delegation: Delegation) => boolean;
/**
 * @function isDelegationExpired
 * @description Checks if delegation has expired
 * @param {Delegation} delegation - Delegation to check
 * @returns {boolean} True if expired
 *
 * @example
 * ```typescript
 * if (isDelegationExpired(delegation)) {
 *   // Clean up expired delegation
 * }
 * ```
 */
export declare const isDelegationExpired: (delegation: Delegation) => boolean;
/**
 * @function checkDelegationConditions
 * @description Validates delegation conditions against context
 * @param {Delegation} delegation - Delegation to check
 * @param {Record<string, unknown>} context - Evaluation context
 * @returns {boolean} True if conditions are met
 *
 * @example
 * ```typescript
 * const conditionsMet = checkDelegationConditions(delegation, {
 *   ipAddress: '192.168.1.1',
 *   mfaVerified: true
 * });
 * ```
 */
export declare const checkDelegationConditions: (delegation: Delegation, context: Record<string, unknown>) => boolean;
/**
 * @function validateDelegationChain
 * @description Validates an entire delegation chain
 * @param {Delegation[]} delegations - Chain of delegations
 * @returns {boolean} True if chain is valid
 *
 * @example
 * ```typescript
 * const isValid = validateDelegationChain([delegation1, delegation2]);
 * ```
 */
export declare const validateDelegationChain: (delegations: Delegation[]) => boolean;
/**
 * @function buildDelegationChain
 * @description Builds a complete delegation chain
 * @param {Delegation[]} delegations - Array of delegations
 * @returns {DelegationChain} Delegation chain
 *
 * @example
 * ```typescript
 * const chain = buildDelegationChain([delegation1, delegation2, delegation3]);
 * ```
 */
export declare const buildDelegationChain: (delegations: Delegation[]) => DelegationChain;
/**
 * @function getChainDepth
 * @description Calculates delegation chain depth
 * @param {DelegationChain} chain - Delegation chain
 * @returns {number} Chain depth
 *
 * @example
 * ```typescript
 * const depth = getChainDepth(chain);
 * ```
 */
export declare const getChainDepth: (chain: DelegationChain) => number;
/**
 * @function getEffectivePermissions
 * @description Gets effective permissions from delegation chain
 * @param {DelegationChain} chain - Delegation chain
 * @returns {PermissionAction[]} Effective permissions
 *
 * @example
 * ```typescript
 * const permissions = getEffectivePermissions(chain);
 * ```
 */
export declare const getEffectivePermissions: (chain: DelegationChain) => PermissionAction[];
/**
 * @function findDelegationPath
 * @description Finds delegation path between two users
 * @param {UserId} from - Starting user
 * @param {UserId} to - Target user
 * @param {Delegation[]} allDelegations - All available delegations
 * @returns {Delegation[] | null} Path or null if not found
 *
 * @example
 * ```typescript
 * const path = findDelegationPath(userId1, userId2, allDelegations);
 * ```
 */
export declare const findDelegationPath: (from: UserId, to: UserId, allDelegations: Delegation[]) => Delegation[] | null;
/**
 * @function revokeDelegation
 * @description Revokes a delegation
 * @param {Delegation} delegation - Delegation to revoke
 * @param {UserId} revokedBy - User revoking delegation
 * @param {string} reason - Revocation reason
 * @returns {Delegation} Revoked delegation
 *
 * @example
 * ```typescript
 * const revoked = revokeDelegation(delegation, adminId, 'Security concern');
 * ```
 */
export declare const revokeDelegation: (delegation: Delegation, revokedBy: UserId, reason?: string) => Delegation;
/**
 * @function revokeDelegationChain
 * @description Revokes entire delegation chain
 * @param {DelegationChain} chain - Chain to revoke
 * @param {UserId} revokedBy - User revoking chain
 * @param {string} reason - Revocation reason
 * @returns {DelegationRevocationResult} Revocation result
 *
 * @example
 * ```typescript
 * const result = revokeDelegationChain(chain, adminId, 'Security audit');
 * ```
 */
export declare const revokeDelegationChain: (chain: DelegationChain, revokedBy: UserId, reason?: string) => DelegationRevocationResult;
/**
 * @function revokeAllUserDelegations
 * @description Revokes all delegations for a user
 * @param {UserId} userId - User whose delegations to revoke
 * @param {Delegation[]} delegations - All delegations
 * @param {UserId} revokedBy - User performing revocation
 * @returns {DelegationId[]} Array of revoked delegation IDs
 *
 * @example
 * ```typescript
 * const revoked = revokeAllUserDelegations(userId, allDelegations, adminId);
 * ```
 */
export declare const revokeAllUserDelegations: (userId: UserId, delegations: Delegation[], revokedBy: UserId) => DelegationId[];
/**
 * @function createDelegationScope
 * @description Creates a delegation scope
 * @param {Partial<DelegationScope>} scope - Scope parameters
 * @returns {DelegationScope} Created scope
 *
 * @example
 * ```typescript
 * const scope = createDelegationScope({
 *   resourceTypes: ['patient'],
 *   maxUsageCount: 50,
 *   requiredMfa: true
 * });
 * ```
 */
export declare const createDelegationScope: (scope: Partial<DelegationScope>) => DelegationScope;
/**
 * @function updateDelegationScope
 * @description Updates a delegation's scope
 * @param {Delegation} delegation - Delegation to update
 * @param {Partial<DelegationScope>} newScope - New scope parameters
 * @returns {Delegation} Updated delegation
 *
 * @example
 * ```typescript
 * const updated = updateDelegationScope(delegation, {
 *   maxUsageCount: 100
 * });
 * ```
 */
export declare const updateDelegationScope: (delegation: Delegation, newScope: Partial<DelegationScope>) => Delegation;
/**
 * @function checkScopeResourceAccess
 * @description Checks if resource is in delegation scope
 * @param {DelegationScope} scope - Delegation scope
 * @param {ResourceId} resourceId - Resource to check
 * @returns {boolean} True if resource is accessible
 *
 * @example
 * ```typescript
 * if (checkScopeResourceAccess(delegation.scope, resourceId)) {
 *   // Access granted
 * }
 * ```
 */
export declare const checkScopeResourceAccess: (scope: DelegationScope | undefined, resourceId: ResourceId) => boolean;
/**
 * @function checkScopeActionAllowed
 * @description Checks if action is allowed in scope
 * @param {DelegationScope} scope - Delegation scope
 * @param {PermissionAction} action - Action to check
 * @returns {boolean} True if action is allowed
 *
 * @example
 * ```typescript
 * if (checkScopeActionAllowed(delegation.scope, 'patient:read')) {
 *   // Action allowed
 * }
 * ```
 */
export declare const checkScopeActionAllowed: (scope: DelegationScope | undefined, action: PermissionAction) => boolean;
/**
 * @function incrementScopeUsage
 * @description Increments delegation usage count
 * @param {Delegation} delegation - Delegation to update
 * @returns {Delegation} Updated delegation
 *
 * @example
 * ```typescript
 * const updated = incrementScopeUsage(delegation);
 * ```
 */
export declare const incrementScopeUsage: (delegation: Delegation) => Delegation;
/**
 * @function createDelegationAuditEntry
 * @description Creates an audit entry for delegation action
 * @param {DelegationId} delegationId - Delegation ID
 * @param {string} action - Action performed
 * @param {UserId} performedBy - User who performed action
 * @param {Record<string, unknown>} details - Additional details
 * @returns {DelegationAuditEntry} Audit entry
 *
 * @example
 * ```typescript
 * const audit = createDelegationAuditEntry(
 *   delegationId,
 *   'used',
 *   userId,
 *   { resource: patientId }
 * );
 * ```
 */
export declare const createDelegationAuditEntry: (delegationId: DelegationId, action: "created" | "used" | "revoked" | "expired" | "modified", performedBy: UserId, details?: Record<string, unknown>) => DelegationAuditEntry;
/**
 * @function logDelegationCreation
 * @description Logs delegation creation
 * @param {Delegation} delegation - Created delegation
 * @returns {DelegationAuditEntry} Audit entry
 *
 * @example
 * ```typescript
 * const audit = logDelegationCreation(delegation);
 * ```
 */
export declare const logDelegationCreation: (delegation: Delegation) => DelegationAuditEntry;
/**
 * @function logDelegationUsage
 * @description Logs delegation usage
 * @param {Delegation} delegation - Used delegation
 * @param {UserId} usedBy - User who used delegation
 * @param {string} resource - Resource accessed
 * @returns {DelegationAuditEntry} Audit entry
 *
 * @example
 * ```typescript
 * const audit = logDelegationUsage(delegation, userId, 'patient:123');
 * ```
 */
export declare const logDelegationUsage: (delegation: Delegation, usedBy: UserId, resource?: string) => DelegationAuditEntry;
/**
 * @function logDelegationRevocation
 * @description Logs delegation revocation
 * @param {Delegation} delegation - Revoked delegation
 * @param {UserId} revokedBy - User who revoked
 * @param {string} reason - Revocation reason
 * @returns {DelegationAuditEntry} Audit entry
 *
 * @example
 * ```typescript
 * const audit = logDelegationRevocation(delegation, adminId, 'Security concern');
 * ```
 */
export declare const logDelegationRevocation: (delegation: Delegation, revokedBy: UserId, reason?: string) => DelegationAuditEntry;
/**
 * @function calculateDelegationExpiry
 * @description Calculates expiration date for delegation
 * @param {number} durationMs - Duration in milliseconds
 * @returns {Date} Expiration date
 *
 * @example
 * ```typescript
 * const expiresAt = calculateDelegationExpiry(86400000); // 24 hours
 * ```
 */
export declare const calculateDelegationExpiry: (durationMs: number) => Date;
/**
 * @function extendDelegation
 * @description Extends delegation expiration
 * @param {Delegation} delegation - Delegation to extend
 * @param {number} extensionMs - Extension duration in milliseconds
 * @returns {Delegation} Extended delegation
 *
 * @example
 * ```typescript
 * const extended = extendDelegation(delegation, 3600000); // Add 1 hour
 * ```
 */
export declare const extendDelegation: (delegation: Delegation, extensionMs: number) => Delegation;
/**
 * @function getRemainingDelegationTime
 * @description Gets remaining time for delegation
 * @param {Delegation} delegation - Delegation to check
 * @returns {number} Remaining milliseconds (0 if expired)
 *
 * @example
 * ```typescript
 * const remaining = getRemainingDelegationTime(delegation);
 * console.log(`Delegation expires in ${remaining / 1000} seconds`);
 * ```
 */
export declare const getRemainingDelegationTime: (delegation: Delegation) => number;
/**
 * @function findExpiredDelegations
 * @description Finds all expired delegations
 * @param {Delegation[]} delegations - Delegations to check
 * @returns {Delegation[]} Expired delegations
 *
 * @example
 * ```typescript
 * const expired = findExpiredDelegations(allDelegations);
 * ```
 */
export declare const findExpiredDelegations: (delegations: Delegation[]) => Delegation[];
/**
 * @function autoExpireDelegations
 * @description Marks expired delegations as expired
 * @param {Delegation[]} delegations - Delegations to process
 * @returns {Delegation[]} Updated delegations
 *
 * @example
 * ```typescript
 * const updated = autoExpireDelegations(allDelegations);
 * ```
 */
export declare const autoExpireDelegations: (delegations: Delegation[]) => Delegation[];
/**
 * @function findDelegationsByDelegator
 * @description Finds all delegations created by user
 * @param {UserId} delegatorId - Delegator user ID
 * @param {Delegation[]} delegations - All delegations
 * @returns {Delegation[]} Matching delegations
 *
 * @example
 * ```typescript
 * const userDelegations = findDelegationsByDelegator(userId, allDelegations);
 * ```
 */
export declare const findDelegationsByDelegator: (delegatorId: UserId, delegations: Delegation[]) => Delegation[];
/**
 * @function findDelegationsByDelegatee
 * @description Finds all delegations received by user
 * @param {UserId} delegateeId - Delegatee user ID
 * @param {Delegation[]} delegations - All delegations
 * @returns {Delegation[]} Matching delegations
 *
 * @example
 * ```typescript
 * const receivedDelegations = findDelegationsByDelegatee(userId, allDelegations);
 * ```
 */
export declare const findDelegationsByDelegatee: (delegateeId: UserId, delegations: Delegation[]) => Delegation[];
/**
 * @function findActiveDelegations
 * @description Finds all active delegations
 * @param {Delegation[]} delegations - All delegations
 * @returns {Delegation[]} Active delegations
 *
 * @example
 * ```typescript
 * const active = findActiveDelegations(allDelegations);
 * ```
 */
export declare const findActiveDelegations: (delegations: Delegation[]) => Delegation[];
/**
 * @function getDelegationStats
 * @description Gets delegation statistics
 * @param {Delegation[]} delegations - Delegations to analyze
 * @returns {object} Statistics
 *
 * @example
 * ```typescript
 * const stats = getDelegationStats(allDelegations);
 * console.log(`Active: ${stats.active}, Expired: ${stats.expired}`);
 * ```
 */
export declare const getDelegationStats: (delegations: Delegation[]) => {
    total: number;
    active: number;
    expired: number;
    revoked: number;
    byType: Record<DelegationType, number>;
};
/**
 * @function cloneDelegation
 * @description Creates a copy of delegation with new ID
 * @param {Delegation} delegation - Delegation to clone
 * @param {UserId} newDelegatee - New delegatee user ID
 * @returns {Delegation} Cloned delegation
 *
 * @example
 * ```typescript
 * const cloned = cloneDelegation(delegation, newUserId);
 * ```
 */
export declare const cloneDelegation: (delegation: Delegation, newDelegatee: UserId) => Delegation;
/**
 * @function mergeDelegationPermissions
 * @description Merges permissions from multiple delegations
 * @param {Delegation[]} delegations - Delegations to merge
 * @returns {PermissionAction[]} Merged unique permissions
 *
 * @example
 * ```typescript
 * const permissions = mergeDelegationPermissions([delegation1, delegation2]);
 * ```
 */
export declare const mergeDelegationPermissions: (delegations: Delegation[]) => PermissionAction[];
/**
 * @function compareDelegations
 * @description Compares two delegations for equality
 * @param {Delegation} a - First delegation
 * @param {Delegation} b - Second delegation
 * @returns {boolean} True if delegations are equivalent
 *
 * @example
 * ```typescript
 * if (compareDelegations(delegation1, delegation2)) {
 *   console.log('Delegations are identical');
 * }
 * ```
 */
export declare const compareDelegations: (a: Delegation, b: Delegation) => boolean;
/**
 * @function serializeDelegation
 * @description Serializes delegation to JSON string
 * @param {Delegation} delegation - Delegation to serialize
 * @returns {string} JSON string
 *
 * @example
 * ```typescript
 * const json = serializeDelegation(delegation);
 * ```
 */
export declare const serializeDelegation: (delegation: Delegation) => string;
/**
 * @function deserializeDelegation
 * @description Deserializes delegation from JSON string
 * @param {string} json - JSON string
 * @returns {Delegation} Delegation object
 *
 * @example
 * ```typescript
 * const delegation = deserializeDelegation(jsonString);
 * ```
 */
export declare const deserializeDelegation: (json: string) => Delegation;
declare const _default: {
    createDelegationId: () => DelegationId;
    createDelegation: (delegator: UserId, request: DelegationRequest) => Delegation;
    createTemporaryDelegation: (delegator: UserId, delegatee: UserId, permissions: PermissionAction[], durationMs: number) => Delegation;
    createScopedDelegation: (delegator: UserId, delegatee: UserId, permissions: PermissionAction[], scope: DelegationScope) => Delegation;
    createResourceSpecificDelegation: (delegator: UserId, delegatee: UserId, resources: ResourceId[], permissions: PermissionAction[]) => Delegation;
    validateDelegation: (delegation: Delegation) => DelegationValidationResult;
    isDelegationActive: (delegation: Delegation) => boolean;
    isDelegationExpired: (delegation: Delegation) => boolean;
    checkDelegationConditions: (delegation: Delegation, context: Record<string, unknown>) => boolean;
    validateDelegationChain: (delegations: Delegation[]) => boolean;
    buildDelegationChain: (delegations: Delegation[]) => DelegationChain;
    getChainDepth: (chain: DelegationChain) => number;
    getEffectivePermissions: (chain: DelegationChain) => PermissionAction[];
    findDelegationPath: (from: UserId, to: UserId, allDelegations: Delegation[]) => Delegation[] | null;
    revokeDelegation: (delegation: Delegation, revokedBy: UserId, reason?: string) => Delegation;
    revokeDelegationChain: (chain: DelegationChain, revokedBy: UserId, reason?: string) => DelegationRevocationResult;
    revokeAllUserDelegations: (userId: UserId, delegations: Delegation[], revokedBy: UserId) => DelegationId[];
    createDelegationScope: (scope: Partial<DelegationScope>) => DelegationScope;
    updateDelegationScope: (delegation: Delegation, newScope: Partial<DelegationScope>) => Delegation;
    checkScopeResourceAccess: (scope: DelegationScope | undefined, resourceId: ResourceId) => boolean;
    checkScopeActionAllowed: (scope: DelegationScope | undefined, action: PermissionAction) => boolean;
    incrementScopeUsage: (delegation: Delegation) => Delegation;
    createDelegationAuditEntry: (delegationId: DelegationId, action: "created" | "used" | "revoked" | "expired" | "modified", performedBy: UserId, details?: Record<string, unknown>) => DelegationAuditEntry;
    logDelegationCreation: (delegation: Delegation) => DelegationAuditEntry;
    logDelegationUsage: (delegation: Delegation, usedBy: UserId, resource?: string) => DelegationAuditEntry;
    logDelegationRevocation: (delegation: Delegation, revokedBy: UserId, reason?: string) => DelegationAuditEntry;
    calculateDelegationExpiry: (durationMs: number) => Date;
    extendDelegation: (delegation: Delegation, extensionMs: number) => Delegation;
    getRemainingDelegationTime: (delegation: Delegation) => number;
    findExpiredDelegations: (delegations: Delegation[]) => Delegation[];
    autoExpireDelegations: (delegations: Delegation[]) => Delegation[];
    findDelegationsByDelegator: (delegatorId: UserId, delegations: Delegation[]) => Delegation[];
    findDelegationsByDelegatee: (delegateeId: UserId, delegations: Delegation[]) => Delegation[];
    findActiveDelegations: (delegations: Delegation[]) => Delegation[];
    getDelegationStats: (delegations: Delegation[]) => {
        total: number;
        active: number;
        expired: number;
        revoked: number;
        byType: Record<DelegationType, number>;
    };
    cloneDelegation: (delegation: Delegation, newDelegatee: UserId) => Delegation;
    mergeDelegationPermissions: (delegations: Delegation[]) => PermissionAction[];
    compareDelegations: (a: Delegation, b: Delegation) => boolean;
    serializeDelegation: (delegation: Delegation) => string;
    deserializeDelegation: (json: string) => Delegation;
};
export default _default;
//# sourceMappingURL=iam-delegation-kit.d.ts.map