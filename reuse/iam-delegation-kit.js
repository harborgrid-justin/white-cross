"use strict";
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.deserializeDelegation = exports.serializeDelegation = exports.compareDelegations = exports.mergeDelegationPermissions = exports.cloneDelegation = exports.getDelegationStats = exports.findActiveDelegations = exports.findDelegationsByDelegatee = exports.findDelegationsByDelegator = exports.autoExpireDelegations = exports.findExpiredDelegations = exports.getRemainingDelegationTime = exports.extendDelegation = exports.calculateDelegationExpiry = exports.logDelegationRevocation = exports.logDelegationUsage = exports.logDelegationCreation = exports.createDelegationAuditEntry = exports.incrementScopeUsage = exports.checkScopeActionAllowed = exports.checkScopeResourceAccess = exports.updateDelegationScope = exports.createDelegationScope = exports.revokeAllUserDelegations = exports.revokeDelegationChain = exports.revokeDelegation = exports.findDelegationPath = exports.getEffectivePermissions = exports.getChainDepth = exports.buildDelegationChain = exports.validateDelegationChain = exports.checkDelegationConditions = exports.isDelegationExpired = exports.isDelegationActive = exports.validateDelegation = exports.createResourceSpecificDelegation = exports.createScopedDelegation = exports.createTemporaryDelegation = exports.createDelegation = exports.createDelegationId = exports.DelegationType = exports.DelegationStatus = void 0;
/**
 * File: /reuse/iam-delegation-kit.ts
 * Locator: WC-IAM-DELEGATION-KIT-001
 * Purpose: Comprehensive IAM Delegation Kit - Enterprise-grade permission delegation toolkit
 *
 * Upstream: NestJS, crypto, TypeScript 5.x
 * Downstream: ../backend/iam/*, Delegation services, Access management
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common
 * Exports: 40 delegation functions for temporary access, delegation chains, scoped permissions
 *
 * LLM Context: Enterprise-grade permission delegation utilities for White Cross healthcare platform.
 * Provides comprehensive delegation mechanisms including temporary access grants, delegated
 * administration, delegation chains, scope-limited delegations, time-bounded access, delegation
 * audit trails, and cross-user delegation. HIPAA-compliant delegation patterns for secure
 * healthcare data access with full auditability and revocation capabilities.
 */
const crypto = __importStar(require("crypto"));
// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
/**
 * Delegation status
 */
var DelegationStatus;
(function (DelegationStatus) {
    DelegationStatus["ACTIVE"] = "active";
    DelegationStatus["REVOKED"] = "revoked";
    DelegationStatus["EXPIRED"] = "expired";
    DelegationStatus["PENDING"] = "pending";
    DelegationStatus["SUSPENDED"] = "suspended";
})(DelegationStatus || (exports.DelegationStatus = DelegationStatus = {}));
/**
 * Delegation type
 */
var DelegationType;
(function (DelegationType) {
    DelegationType["FULL_ACCESS"] = "full_access";
    DelegationType["SCOPED_PERMISSION"] = "scoped_permission";
    DelegationType["TEMPORARY_ROLE"] = "temporary_role";
    DelegationType["RESOURCE_SPECIFIC"] = "resource_specific";
    DelegationType["CONDITIONAL"] = "conditional";
})(DelegationType || (exports.DelegationType = DelegationType = {}));
// ============================================================================
// DELEGATION CREATION AND MANAGEMENT
// ============================================================================
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
const createDelegationId = () => {
    return `del_${crypto.randomUUID()}`;
};
exports.createDelegationId = createDelegationId;
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
const createDelegation = (delegator, request) => {
    return {
        id: (0, exports.createDelegationId)(),
        delegator,
        delegatee: request.delegatee,
        type: request.type,
        permissions: request.permissions,
        resources: request.resources,
        scope: request.scope,
        createdAt: new Date(),
        expiresAt: request.expiresAt,
        status: DelegationStatus.ACTIVE,
        metadata: {},
        reason: request.reason,
        conditions: request.conditions,
    };
};
exports.createDelegation = createDelegation;
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
const createTemporaryDelegation = (delegator, delegatee, permissions, durationMs) => {
    return (0, exports.createDelegation)(delegator, {
        delegatee,
        type: DelegationType.TEMPORARY_ROLE,
        permissions,
        expiresAt: new Date(Date.now() + durationMs),
    });
};
exports.createTemporaryDelegation = createTemporaryDelegation;
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
const createScopedDelegation = (delegator, delegatee, permissions, scope) => {
    return (0, exports.createDelegation)(delegator, {
        delegatee,
        type: DelegationType.SCOPED_PERMISSION,
        permissions,
        scope,
    });
};
exports.createScopedDelegation = createScopedDelegation;
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
const createResourceSpecificDelegation = (delegator, delegatee, resources, permissions) => {
    return (0, exports.createDelegation)(delegator, {
        delegatee,
        type: DelegationType.RESOURCE_SPECIFIC,
        permissions,
        resources,
    });
};
exports.createResourceSpecificDelegation = createResourceSpecificDelegation;
// ============================================================================
// DELEGATION VALIDATION
// ============================================================================
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
const validateDelegation = (delegation) => {
    const errors = [];
    const warnings = [];
    // Check status
    if (delegation.status !== DelegationStatus.ACTIVE) {
        errors.push(`Delegation is ${delegation.status}`);
    }
    // Check expiration
    if (delegation.expiresAt && delegation.expiresAt < new Date()) {
        errors.push('Delegation has expired');
    }
    // Check revocation
    if (delegation.revokedAt) {
        errors.push('Delegation has been revoked');
    }
    // Check usage limits
    if (delegation.scope?.maxUsageCount && delegation.scope?.usageCount) {
        if (delegation.scope.usageCount >= delegation.scope.maxUsageCount) {
            errors.push('Delegation usage limit exceeded');
        }
        else if (delegation.scope.usageCount >= delegation.scope.maxUsageCount * 0.9) {
            warnings.push('Delegation usage limit nearly exceeded');
        }
    }
    return {
        isValid: errors.length === 0,
        delegation: errors.length === 0 ? delegation : undefined,
        errors,
        warnings,
    };
};
exports.validateDelegation = validateDelegation;
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
const isDelegationActive = (delegation) => {
    return (0, exports.validateDelegation)(delegation).isValid;
};
exports.isDelegationActive = isDelegationActive;
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
const isDelegationExpired = (delegation) => {
    if (!delegation.expiresAt)
        return false;
    return delegation.expiresAt < new Date();
};
exports.isDelegationExpired = isDelegationExpired;
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
const checkDelegationConditions = (delegation, context) => {
    if (!delegation.conditions || delegation.conditions.length === 0) {
        return true;
    }
    return delegation.conditions.every(condition => {
        const contextValue = context[condition.key];
        switch (condition.operator) {
            case 'equals':
                return contextValue === condition.value;
            case 'not_equals':
                return contextValue !== condition.value;
            case 'greater_than':
                return Number(contextValue) > Number(condition.value);
            case 'less_than':
                return Number(contextValue) < Number(condition.value);
            case 'in':
                return Array.isArray(condition.value) && condition.value.includes(contextValue);
            case 'not_in':
                return Array.isArray(condition.value) && !condition.value.includes(contextValue);
            default:
                return false;
        }
    });
};
exports.checkDelegationConditions = checkDelegationConditions;
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
const validateDelegationChain = (delegations) => {
    if (delegations.length === 0)
        return false;
    // Validate each delegation
    for (const delegation of delegations) {
        if (!(0, exports.isDelegationActive)(delegation)) {
            return false;
        }
    }
    // Validate chain continuity
    for (let i = 0; i < delegations.length - 1; i++) {
        if (delegations[i].delegatee !== delegations[i + 1].delegator) {
            return false;
        }
    }
    return true;
};
exports.validateDelegationChain = validateDelegationChain;
// ============================================================================
// DELEGATION CHAINS
// ============================================================================
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
const buildDelegationChain = (delegations) => {
    if (delegations.length === 0) {
        throw new Error('Cannot build chain from empty delegation array');
    }
    // Calculate effective permissions (intersection of all permissions in chain)
    const effectivePermissions = delegations.reduce((acc, delegation) => {
        if (acc.length === 0)
            return delegation.permissions;
        return acc.filter(perm => delegation.permissions.includes(perm));
    }, []);
    return {
        delegations,
        depth: delegations.length,
        rootDelegator: delegations[0].delegator,
        finalDelegatee: delegations[delegations.length - 1].delegatee,
        effectivePermissions,
    };
};
exports.buildDelegationChain = buildDelegationChain;
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
const getChainDepth = (chain) => {
    return chain.depth;
};
exports.getChainDepth = getChainDepth;
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
const getEffectivePermissions = (chain) => {
    return chain.effectivePermissions;
};
exports.getEffectivePermissions = getEffectivePermissions;
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
const findDelegationPath = (from, to, allDelegations) => {
    // Simple BFS to find path
    const queue = [{ user: from, path: [] }];
    const visited = new Set([from]);
    while (queue.length > 0) {
        const { user, path } = queue.shift();
        if (user === to) {
            return path;
        }
        // Find delegations from current user
        const nextDelegations = allDelegations.filter(d => d.delegator === user && (0, exports.isDelegationActive)(d));
        for (const delegation of nextDelegations) {
            if (!visited.has(delegation.delegatee)) {
                visited.add(delegation.delegatee);
                queue.push({
                    user: delegation.delegatee,
                    path: [...path, delegation],
                });
            }
        }
    }
    return null;
};
exports.findDelegationPath = findDelegationPath;
// ============================================================================
// DELEGATION REVOCATION
// ============================================================================
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
const revokeDelegation = (delegation, revokedBy, reason) => {
    return {
        ...delegation,
        status: DelegationStatus.REVOKED,
        revokedAt: new Date(),
        metadata: {
            ...delegation.metadata,
            revokedBy,
            revocationReason: reason,
        },
    };
};
exports.revokeDelegation = revokeDelegation;
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
const revokeDelegationChain = (chain, revokedBy, reason) => {
    const revokedAt = new Date();
    const cascadeRevoked = [];
    for (const delegation of chain.delegations) {
        cascadeRevoked.push(delegation.id);
    }
    return {
        delegationId: chain.delegations[0].id,
        revokedAt,
        revokedBy,
        cascadeRevoked,
        reason,
    };
};
exports.revokeDelegationChain = revokeDelegationChain;
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
const revokeAllUserDelegations = (userId, delegations, revokedBy) => {
    return delegations
        .filter(d => d.delegator === userId || d.delegatee === userId)
        .filter(d => d.status === DelegationStatus.ACTIVE)
        .map(d => d.id);
};
exports.revokeAllUserDelegations = revokeAllUserDelegations;
// ============================================================================
// DELEGATION SCOPE MANAGEMENT
// ============================================================================
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
const createDelegationScope = (scope) => {
    return {
        resourceTypes: scope.resourceTypes,
        resourceIds: scope.resourceIds,
        actions: scope.actions,
        maxUsageCount: scope.maxUsageCount,
        usageCount: scope.usageCount || 0,
        allowedIpRanges: scope.allowedIpRanges,
        requiredMfa: scope.requiredMfa || false,
    };
};
exports.createDelegationScope = createDelegationScope;
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
const updateDelegationScope = (delegation, newScope) => {
    return {
        ...delegation,
        scope: {
            ...delegation.scope,
            ...newScope,
        },
    };
};
exports.updateDelegationScope = updateDelegationScope;
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
const checkScopeResourceAccess = (scope, resourceId) => {
    if (!scope)
        return true;
    if (!scope.resourceIds || scope.resourceIds.length === 0)
        return true;
    return scope.resourceIds.includes(resourceId);
};
exports.checkScopeResourceAccess = checkScopeResourceAccess;
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
const checkScopeActionAllowed = (scope, action) => {
    if (!scope)
        return true;
    if (!scope.actions || scope.actions.length === 0)
        return true;
    return scope.actions.includes(action);
};
exports.checkScopeActionAllowed = checkScopeActionAllowed;
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
const incrementScopeUsage = (delegation) => {
    if (!delegation.scope)
        return delegation;
    return {
        ...delegation,
        scope: {
            ...delegation.scope,
            usageCount: (delegation.scope.usageCount || 0) + 1,
        },
    };
};
exports.incrementScopeUsage = incrementScopeUsage;
// ============================================================================
// DELEGATION AUDIT TRAIL
// ============================================================================
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
const createDelegationAuditEntry = (delegationId, action, performedBy, details = {}) => {
    return {
        id: crypto.randomUUID(),
        delegationId,
        action,
        performedBy,
        timestamp: new Date(),
        details,
    };
};
exports.createDelegationAuditEntry = createDelegationAuditEntry;
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
const logDelegationCreation = (delegation) => {
    return (0, exports.createDelegationAuditEntry)(delegation.id, 'created', delegation.delegator, {
        delegatee: delegation.delegatee,
        type: delegation.type,
        permissions: delegation.permissions,
        expiresAt: delegation.expiresAt,
    });
};
exports.logDelegationCreation = logDelegationCreation;
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
const logDelegationUsage = (delegation, usedBy, resource) => {
    return (0, exports.createDelegationAuditEntry)(delegation.id, 'used', usedBy, {
        resource,
        timestamp: new Date(),
    });
};
exports.logDelegationUsage = logDelegationUsage;
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
const logDelegationRevocation = (delegation, revokedBy, reason) => {
    return (0, exports.createDelegationAuditEntry)(delegation.id, 'revoked', revokedBy, {
        reason,
        originalDelegator: delegation.delegator,
        originalDelegatee: delegation.delegatee,
    });
};
exports.logDelegationRevocation = logDelegationRevocation;
// ============================================================================
// DELEGATION EXPIRATION MANAGEMENT
// ============================================================================
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
const calculateDelegationExpiry = (durationMs) => {
    return new Date(Date.now() + durationMs);
};
exports.calculateDelegationExpiry = calculateDelegationExpiry;
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
const extendDelegation = (delegation, extensionMs) => {
    const currentExpiry = delegation.expiresAt || new Date();
    return {
        ...delegation,
        expiresAt: new Date(currentExpiry.getTime() + extensionMs),
    };
};
exports.extendDelegation = extendDelegation;
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
const getRemainingDelegationTime = (delegation) => {
    if (!delegation.expiresAt)
        return Infinity;
    const remaining = delegation.expiresAt.getTime() - Date.now();
    return Math.max(0, remaining);
};
exports.getRemainingDelegationTime = getRemainingDelegationTime;
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
const findExpiredDelegations = (delegations) => {
    return delegations.filter(d => (0, exports.isDelegationExpired)(d));
};
exports.findExpiredDelegations = findExpiredDelegations;
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
const autoExpireDelegations = (delegations) => {
    return delegations.map(delegation => {
        if ((0, exports.isDelegationExpired)(delegation) && delegation.status === DelegationStatus.ACTIVE) {
            return {
                ...delegation,
                status: DelegationStatus.EXPIRED,
            };
        }
        return delegation;
    });
};
exports.autoExpireDelegations = autoExpireDelegations;
// ============================================================================
// DELEGATION QUERIES
// ============================================================================
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
const findDelegationsByDelegator = (delegatorId, delegations) => {
    return delegations.filter(d => d.delegator === delegatorId);
};
exports.findDelegationsByDelegator = findDelegationsByDelegator;
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
const findDelegationsByDelegatee = (delegateeId, delegations) => {
    return delegations.filter(d => d.delegatee === delegateeId);
};
exports.findDelegationsByDelegatee = findDelegationsByDelegatee;
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
const findActiveDelegations = (delegations) => {
    return delegations.filter(d => (0, exports.isDelegationActive)(d));
};
exports.findActiveDelegations = findActiveDelegations;
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
const getDelegationStats = (delegations) => {
    const stats = {
        total: delegations.length,
        active: 0,
        expired: 0,
        revoked: 0,
        byType: {
            [DelegationType.FULL_ACCESS]: 0,
            [DelegationType.SCOPED_PERMISSION]: 0,
            [DelegationType.TEMPORARY_ROLE]: 0,
            [DelegationType.RESOURCE_SPECIFIC]: 0,
            [DelegationType.CONDITIONAL]: 0,
        },
    };
    for (const delegation of delegations) {
        if (delegation.status === DelegationStatus.ACTIVE)
            stats.active++;
        if (delegation.status === DelegationStatus.EXPIRED)
            stats.expired++;
        if (delegation.status === DelegationStatus.REVOKED)
            stats.revoked++;
        stats.byType[delegation.type]++;
    }
    return stats;
};
exports.getDelegationStats = getDelegationStats;
// ============================================================================
// DELEGATION UTILITIES
// ============================================================================
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
const cloneDelegation = (delegation, newDelegatee) => {
    return {
        ...delegation,
        id: (0, exports.createDelegationId)(),
        delegatee: newDelegatee,
        createdAt: new Date(),
        status: DelegationStatus.ACTIVE,
    };
};
exports.cloneDelegation = cloneDelegation;
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
const mergeDelegationPermissions = (delegations) => {
    const allPermissions = delegations.flatMap(d => d.permissions);
    return [...new Set(allPermissions)];
};
exports.mergeDelegationPermissions = mergeDelegationPermissions;
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
const compareDelegations = (a, b) => {
    return (a.delegator === b.delegator &&
        a.delegatee === b.delegatee &&
        a.type === b.type &&
        JSON.stringify(a.permissions) === JSON.stringify(b.permissions));
};
exports.compareDelegations = compareDelegations;
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
const serializeDelegation = (delegation) => {
    return JSON.stringify(delegation);
};
exports.serializeDelegation = serializeDelegation;
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
const deserializeDelegation = (json) => {
    const obj = JSON.parse(json);
    return {
        ...obj,
        createdAt: new Date(obj.createdAt),
        expiresAt: obj.expiresAt ? new Date(obj.expiresAt) : undefined,
        revokedAt: obj.revokedAt ? new Date(obj.revokedAt) : undefined,
    };
};
exports.deserializeDelegation = deserializeDelegation;
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
    // Creation
    createDelegationId: exports.createDelegationId,
    createDelegation: exports.createDelegation,
    createTemporaryDelegation: exports.createTemporaryDelegation,
    createScopedDelegation: exports.createScopedDelegation,
    createResourceSpecificDelegation: exports.createResourceSpecificDelegation,
    // Validation
    validateDelegation: exports.validateDelegation,
    isDelegationActive: exports.isDelegationActive,
    isDelegationExpired: exports.isDelegationExpired,
    checkDelegationConditions: exports.checkDelegationConditions,
    validateDelegationChain: exports.validateDelegationChain,
    // Chains
    buildDelegationChain: exports.buildDelegationChain,
    getChainDepth: exports.getChainDepth,
    getEffectivePermissions: exports.getEffectivePermissions,
    findDelegationPath: exports.findDelegationPath,
    // Revocation
    revokeDelegation: exports.revokeDelegation,
    revokeDelegationChain: exports.revokeDelegationChain,
    revokeAllUserDelegations: exports.revokeAllUserDelegations,
    // Scope
    createDelegationScope: exports.createDelegationScope,
    updateDelegationScope: exports.updateDelegationScope,
    checkScopeResourceAccess: exports.checkScopeResourceAccess,
    checkScopeActionAllowed: exports.checkScopeActionAllowed,
    incrementScopeUsage: exports.incrementScopeUsage,
    // Audit
    createDelegationAuditEntry: exports.createDelegationAuditEntry,
    logDelegationCreation: exports.logDelegationCreation,
    logDelegationUsage: exports.logDelegationUsage,
    logDelegationRevocation: exports.logDelegationRevocation,
    // Expiration
    calculateDelegationExpiry: exports.calculateDelegationExpiry,
    extendDelegation: exports.extendDelegation,
    getRemainingDelegationTime: exports.getRemainingDelegationTime,
    findExpiredDelegations: exports.findExpiredDelegations,
    autoExpireDelegations: exports.autoExpireDelegations,
    // Queries
    findDelegationsByDelegator: exports.findDelegationsByDelegator,
    findDelegationsByDelegatee: exports.findDelegationsByDelegatee,
    findActiveDelegations: exports.findActiveDelegations,
    getDelegationStats: exports.getDelegationStats,
    // Utilities
    cloneDelegation: exports.cloneDelegation,
    mergeDelegationPermissions: exports.mergeDelegationPermissions,
    compareDelegations: exports.compareDelegations,
    serializeDelegation: exports.serializeDelegation,
    deserializeDelegation: exports.deserializeDelegation,
};
//# sourceMappingURL=iam-delegation-kit.js.map