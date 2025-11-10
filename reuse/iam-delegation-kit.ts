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

import * as crypto from 'crypto';
import { Injectable } from '@nestjs/common';
import {
  UserId,
  RoleId,
  PermissionId,
  ResourceId,
  PolicyDocument,
  PolicyStatement,
  PermissionAction,
} from './iam-types-kit';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Delegation status
 */
export enum DelegationStatus {
  ACTIVE = 'active',
  REVOKED = 'revoked',
  EXPIRED = 'expired',
  PENDING = 'pending',
  SUSPENDED = 'suspended',
}

/**
 * Delegation type
 */
export enum DelegationType {
  FULL_ACCESS = 'full_access',
  SCOPED_PERMISSION = 'scoped_permission',
  TEMPORARY_ROLE = 'temporary_role',
  RESOURCE_SPECIFIC = 'resource_specific',
  CONDITIONAL = 'conditional',
}

/**
 * Delegation ID branded type
 */
export type DelegationId = string & { __brand: 'DelegationId' };

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
export const createDelegationId = (): DelegationId => {
  return `del_${crypto.randomUUID()}` as DelegationId;
};

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
export const createDelegation = (
  delegator: UserId,
  request: DelegationRequest,
): Delegation => {
  return {
    id: createDelegationId(),
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
export const createTemporaryDelegation = (
  delegator: UserId,
  delegatee: UserId,
  permissions: PermissionAction[],
  durationMs: number,
): Delegation => {
  return createDelegation(delegator, {
    delegatee,
    type: DelegationType.TEMPORARY_ROLE,
    permissions,
    expiresAt: new Date(Date.now() + durationMs),
  });
};

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
export const createScopedDelegation = (
  delegator: UserId,
  delegatee: UserId,
  permissions: PermissionAction[],
  scope: DelegationScope,
): Delegation => {
  return createDelegation(delegator, {
    delegatee,
    type: DelegationType.SCOPED_PERMISSION,
    permissions,
    scope,
  });
};

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
export const createResourceSpecificDelegation = (
  delegator: UserId,
  delegatee: UserId,
  resources: ResourceId[],
  permissions: PermissionAction[],
): Delegation => {
  return createDelegation(delegator, {
    delegatee,
    type: DelegationType.RESOURCE_SPECIFIC,
    permissions,
    resources,
  });
};

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
export const validateDelegation = (delegation: Delegation): DelegationValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

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
    } else if (delegation.scope.usageCount >= delegation.scope.maxUsageCount * 0.9) {
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
export const isDelegationActive = (delegation: Delegation): boolean => {
  return validateDelegation(delegation).isValid;
};

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
export const isDelegationExpired = (delegation: Delegation): boolean => {
  if (!delegation.expiresAt) return false;
  return delegation.expiresAt < new Date();
};

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
export const checkDelegationConditions = (
  delegation: Delegation,
  context: Record<string, unknown>,
): boolean => {
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
export const validateDelegationChain = (delegations: Delegation[]): boolean => {
  if (delegations.length === 0) return false;

  // Validate each delegation
  for (const delegation of delegations) {
    if (!isDelegationActive(delegation)) {
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
export const buildDelegationChain = (delegations: Delegation[]): DelegationChain => {
  if (delegations.length === 0) {
    throw new Error('Cannot build chain from empty delegation array');
  }

  // Calculate effective permissions (intersection of all permissions in chain)
  const effectivePermissions = delegations.reduce<PermissionAction[]>(
    (acc, delegation) => {
      if (acc.length === 0) return delegation.permissions;
      return acc.filter(perm => delegation.permissions.includes(perm));
    },
    [],
  );

  return {
    delegations,
    depth: delegations.length,
    rootDelegator: delegations[0].delegator,
    finalDelegatee: delegations[delegations.length - 1].delegatee,
    effectivePermissions,
  };
};

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
export const getChainDepth = (chain: DelegationChain): number => {
  return chain.depth;
};

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
export const getEffectivePermissions = (chain: DelegationChain): PermissionAction[] => {
  return chain.effectivePermissions;
};

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
export const findDelegationPath = (
  from: UserId,
  to: UserId,
  allDelegations: Delegation[],
): Delegation[] | null => {
  // Simple BFS to find path
  const queue: { user: UserId; path: Delegation[] }[] = [{ user: from, path: [] }];
  const visited = new Set<UserId>([from]);

  while (queue.length > 0) {
    const { user, path } = queue.shift()!;

    if (user === to) {
      return path;
    }

    // Find delegations from current user
    const nextDelegations = allDelegations.filter(
      d => d.delegator === user && isDelegationActive(d),
    );

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
export const revokeDelegation = (
  delegation: Delegation,
  revokedBy: UserId,
  reason?: string,
): Delegation => {
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
export const revokeDelegationChain = (
  chain: DelegationChain,
  revokedBy: UserId,
  reason?: string,
): DelegationRevocationResult => {
  const revokedAt = new Date();
  const cascadeRevoked: DelegationId[] = [];

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
export const revokeAllUserDelegations = (
  userId: UserId,
  delegations: Delegation[],
  revokedBy: UserId,
): DelegationId[] => {
  return delegations
    .filter(d => d.delegator === userId || d.delegatee === userId)
    .filter(d => d.status === DelegationStatus.ACTIVE)
    .map(d => d.id);
};

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
export const createDelegationScope = (scope: Partial<DelegationScope>): DelegationScope => {
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
export const updateDelegationScope = (
  delegation: Delegation,
  newScope: Partial<DelegationScope>,
): Delegation => {
  return {
    ...delegation,
    scope: {
      ...delegation.scope,
      ...newScope,
    },
  };
};

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
export const checkScopeResourceAccess = (
  scope: DelegationScope | undefined,
  resourceId: ResourceId,
): boolean => {
  if (!scope) return true;
  if (!scope.resourceIds || scope.resourceIds.length === 0) return true;
  return scope.resourceIds.includes(resourceId);
};

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
export const checkScopeActionAllowed = (
  scope: DelegationScope | undefined,
  action: PermissionAction,
): boolean => {
  if (!scope) return true;
  if (!scope.actions || scope.actions.length === 0) return true;
  return scope.actions.includes(action);
};

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
export const incrementScopeUsage = (delegation: Delegation): Delegation => {
  if (!delegation.scope) return delegation;

  return {
    ...delegation,
    scope: {
      ...delegation.scope,
      usageCount: (delegation.scope.usageCount || 0) + 1,
    },
  };
};

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
export const createDelegationAuditEntry = (
  delegationId: DelegationId,
  action: 'created' | 'used' | 'revoked' | 'expired' | 'modified',
  performedBy: UserId,
  details: Record<string, unknown> = {},
): DelegationAuditEntry => {
  return {
    id: crypto.randomUUID(),
    delegationId,
    action,
    performedBy,
    timestamp: new Date(),
    details,
  };
};

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
export const logDelegationCreation = (delegation: Delegation): DelegationAuditEntry => {
  return createDelegationAuditEntry(delegation.id, 'created', delegation.delegator, {
    delegatee: delegation.delegatee,
    type: delegation.type,
    permissions: delegation.permissions,
    expiresAt: delegation.expiresAt,
  });
};

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
export const logDelegationUsage = (
  delegation: Delegation,
  usedBy: UserId,
  resource?: string,
): DelegationAuditEntry => {
  return createDelegationAuditEntry(delegation.id, 'used', usedBy, {
    resource,
    timestamp: new Date(),
  });
};

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
export const logDelegationRevocation = (
  delegation: Delegation,
  revokedBy: UserId,
  reason?: string,
): DelegationAuditEntry => {
  return createDelegationAuditEntry(delegation.id, 'revoked', revokedBy, {
    reason,
    originalDelegator: delegation.delegator,
    originalDelegatee: delegation.delegatee,
  });
};

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
export const calculateDelegationExpiry = (durationMs: number): Date => {
  return new Date(Date.now() + durationMs);
};

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
export const extendDelegation = (delegation: Delegation, extensionMs: number): Delegation => {
  const currentExpiry = delegation.expiresAt || new Date();
  return {
    ...delegation,
    expiresAt: new Date(currentExpiry.getTime() + extensionMs),
  };
};

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
export const getRemainingDelegationTime = (delegation: Delegation): number => {
  if (!delegation.expiresAt) return Infinity;
  const remaining = delegation.expiresAt.getTime() - Date.now();
  return Math.max(0, remaining);
};

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
export const findExpiredDelegations = (delegations: Delegation[]): Delegation[] => {
  return delegations.filter(d => isDelegationExpired(d));
};

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
export const autoExpireDelegations = (delegations: Delegation[]): Delegation[] => {
  return delegations.map(delegation => {
    if (isDelegationExpired(delegation) && delegation.status === DelegationStatus.ACTIVE) {
      return {
        ...delegation,
        status: DelegationStatus.EXPIRED,
      };
    }
    return delegation;
  });
};

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
export const findDelegationsByDelegator = (
  delegatorId: UserId,
  delegations: Delegation[],
): Delegation[] => {
  return delegations.filter(d => d.delegator === delegatorId);
};

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
export const findDelegationsByDelegatee = (
  delegateeId: UserId,
  delegations: Delegation[],
): Delegation[] => {
  return delegations.filter(d => d.delegatee === delegateeId);
};

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
export const findActiveDelegations = (delegations: Delegation[]): Delegation[] => {
  return delegations.filter(d => isDelegationActive(d));
};

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
export const getDelegationStats = (
  delegations: Delegation[],
): {
  total: number;
  active: number;
  expired: number;
  revoked: number;
  byType: Record<DelegationType, number>;
} => {
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
    if (delegation.status === DelegationStatus.ACTIVE) stats.active++;
    if (delegation.status === DelegationStatus.EXPIRED) stats.expired++;
    if (delegation.status === DelegationStatus.REVOKED) stats.revoked++;
    stats.byType[delegation.type]++;
  }

  return stats;
};

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
export const cloneDelegation = (
  delegation: Delegation,
  newDelegatee: UserId,
): Delegation => {
  return {
    ...delegation,
    id: createDelegationId(),
    delegatee: newDelegatee,
    createdAt: new Date(),
    status: DelegationStatus.ACTIVE,
  };
};

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
export const mergeDelegationPermissions = (
  delegations: Delegation[],
): PermissionAction[] => {
  const allPermissions = delegations.flatMap(d => d.permissions);
  return [...new Set(allPermissions)];
};

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
export const compareDelegations = (a: Delegation, b: Delegation): boolean => {
  return (
    a.delegator === b.delegator &&
    a.delegatee === b.delegatee &&
    a.type === b.type &&
    JSON.stringify(a.permissions) === JSON.stringify(b.permissions)
  );
};

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
export const serializeDelegation = (delegation: Delegation): string => {
  return JSON.stringify(delegation);
};

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
export const deserializeDelegation = (json: string): Delegation => {
  const obj = JSON.parse(json);
  return {
    ...obj,
    createdAt: new Date(obj.createdAt),
    expiresAt: obj.expiresAt ? new Date(obj.expiresAt) : undefined,
    revokedAt: obj.revokedAt ? new Date(obj.revokedAt) : undefined,
  };
};

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Creation
  createDelegationId,
  createDelegation,
  createTemporaryDelegation,
  createScopedDelegation,
  createResourceSpecificDelegation,

  // Validation
  validateDelegation,
  isDelegationActive,
  isDelegationExpired,
  checkDelegationConditions,
  validateDelegationChain,

  // Chains
  buildDelegationChain,
  getChainDepth,
  getEffectivePermissions,
  findDelegationPath,

  // Revocation
  revokeDelegation,
  revokeDelegationChain,
  revokeAllUserDelegations,

  // Scope
  createDelegationScope,
  updateDelegationScope,
  checkScopeResourceAccess,
  checkScopeActionAllowed,
  incrementScopeUsage,

  // Audit
  createDelegationAuditEntry,
  logDelegationCreation,
  logDelegationUsage,
  logDelegationRevocation,

  // Expiration
  calculateDelegationExpiry,
  extendDelegation,
  getRemainingDelegationTime,
  findExpiredDelegations,
  autoExpireDelegations,

  // Queries
  findDelegationsByDelegator,
  findDelegationsByDelegatee,
  findActiveDelegations,
  getDelegationStats,

  // Utilities
  cloneDelegation,
  mergeDelegationPermissions,
  compareDelegations,
  serializeDelegation,
  deserializeDelegation,
};
