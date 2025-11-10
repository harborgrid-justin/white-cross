/**
 * LOC: PERMMGMT001
 * File: /reuse/document/composites/downstream/permission-management-services.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - crypto (Node.js built-in)
 *   - ../document-security-encryption-composite
 *
 * DOWNSTREAM (imported by):
 *   - Access control services
 *   - Authorization services
 *   - Delegation services
 */

import { Injectable, BadRequestException, ForbiddenException, Logger } from '@nestjs/common';
import * as crypto from 'crypto';

/**
 * Permission types
 */
export enum PermissionType {
  READ = 'READ',
  WRITE = 'WRITE',
  DELETE = 'DELETE',
  SHARE = 'SHARE',
  DELEGATE = 'DELEGATE',
  AUDIT = 'AUDIT',
  ADMIN = 'ADMIN',
}

/**
 * Grant type
 */
export enum GrantType {
  DIRECT = 'DIRECT',
  INHERITED = 'INHERITED',
  DELEGATED = 'DELEGATED',
  TEMPORARY = 'TEMPORARY',
}

/**
 * Permission grant
 */
export interface PermissionGrant {
  grantId: string;
  grantor: string;
  grantee: string;
  resource: string;
  permissions: PermissionType[];
  grantType: GrantType;
  grantedAt: Date;
  expiresAt?: Date;
  conditions?: { type: string; value: any }[];
  revokedAt?: Date;
  status: 'ACTIVE' | 'EXPIRED' | 'REVOKED';
}

/**
 * Permission delegation
 */
export interface PermissionDelegation {
  delegationId: string;
  delegator: string;
  delegatee: string;
  originalGrant: PermissionGrant;
  delegatedPermissions: PermissionType[];
  delegatedAt: Date;
  expiresAt?: Date;
  canRedelegate: boolean;
  status: 'ACTIVE' | 'REVOKED' | 'EXPIRED';
}

/**
 * Permission management service
 * Manages user permissions, delegation, and enforcement
 */
@Injectable()
export class PermissionManagementService {
  private readonly logger = new Logger(PermissionManagementService.name);
  private grants: Map<string, PermissionGrant> = new Map();
  private delegations: Map<string, PermissionDelegation> = new Map();
  private permissionLog: { grantId: string; action: string; timestamp: Date }[] = [];

  /**
   * Grants permissions to user
   * @param grantor - User granting permission
   * @param grantee - User receiving permission
   * @param resource - Resource identifier
   * @param permissions - Permissions to grant
   * @param expiresAt - Optional expiration date
   * @returns Permission grant
   */
  async grantPermissions(
    grantor: string,
    grantee: string,
    resource: string,
    permissions: PermissionType[],
    expiresAt?: Date
  ): Promise<PermissionGrant> {
    try {
      // Check if grantor has permission to grant
      const grantorCan = await this.canGrant(grantor, resource);
      if (!grantorCan) {
        throw new ForbiddenException('Not authorized to grant permissions');
      }

      const grantId = crypto.randomUUID();

      const grant: PermissionGrant = {
        grantId,
        grantor,
        grantee,
        resource,
        permissions,
        grantType: GrantType.DIRECT,
        grantedAt: new Date(),
        expiresAt,
        status: 'ACTIVE'
      };

      this.grants.set(grantId, grant);

      await this.logPermissionAction(grantId, 'GRANTED');

      this.logger.log(`Permissions granted: ${grantee} on ${resource}`);

      return grant;
    } catch (error) {
      this.logger.error(`Failed to grant permissions: ${error.message}`);
      throw new BadRequestException('Failed to grant permissions');
    }
  }

  /**
   * Revokes permissions from user
   * @param grantId - Grant identifier to revoke
   * @param revokedBy - User revoking permission
   * @returns Revocation result
   */
  async revokePermissions(grantId: string, revokedBy: string): Promise<{ revoked: boolean; timestamp: Date }> {
    const grant = this.grants.get(grantId);
    if (!grant) {
      throw new BadRequestException('Grant not found');
    }

    // Verify revoker authority
    if (grant.grantor !== revokedBy && revokedBy !== 'ADMIN') {
      throw new ForbiddenException('Not authorized to revoke this permission');
    }

    grant.status = 'REVOKED';
    grant.revokedAt = new Date();

    await this.logPermissionAction(grantId, 'REVOKED');

    this.logger.log(`Permissions revoked: ${grant.grantee} on ${grant.resource}`);

    return {
      revoked: true,
      timestamp: new Date()
    };
  }

  /**
   * Delegates permissions to another user
   * @param grantId - Grant identifier to delegate
   * @param delegator - User delegating
   * @param delegatee - User receiving delegation
   * @param permissions - Permissions to delegate
   * @param expiresAt - Delegation expiration
   * @returns Permission delegation
   */
  async delegatePermissions(
    grantId: string,
    delegator: string,
    delegatee: string,
    permissions: PermissionType[],
    expiresAt?: Date
  ): Promise<PermissionDelegation> {
    try {
      const grant = this.grants.get(grantId);
      if (!grant) {
        throw new BadRequestException('Grant not found');
      }

      // Verify delegator has DELEGATE permission
      const canDelegate = grant.permissions.includes(PermissionType.DELEGATE) && grant.grantee === delegator;
      if (!canDelegate) {
        throw new ForbiddenException('Not authorized to delegate permissions');
      }

      // Verify delegating subset of permissions
      const invalidPermissions = permissions.filter(p => !grant.permissions.includes(p));
      if (invalidPermissions.length > 0) {
        throw new BadRequestException('Cannot delegate permissions not possessed');
      }

      const delegationId = crypto.randomUUID();

      const delegation: PermissionDelegation = {
        delegationId,
        delegator,
        delegatee,
        originalGrant: grant,
        delegatedPermissions: permissions,
        delegatedAt: new Date(),
        expiresAt,
        canRedelegate: true,
        status: 'ACTIVE'
      };

      this.delegations.set(delegationId, delegation);

      await this.logPermissionAction(delegationId, 'DELEGATED');

      this.logger.log(`Permissions delegated: ${delegatee} from ${delegator}`);

      return delegation;
    } catch (error) {
      this.logger.error(`Failed to delegate permissions: ${error.message}`);
      throw new BadRequestException('Failed to delegate permissions');
    }
  }

  /**
   * Checks if user has specific permission
   * @param userId - User identifier
   * @param resource - Resource identifier
   * @param permission - Permission to check
   * @returns Permission status
   */
  async hasPermission(
    userId: string,
    resource: string,
    permission: PermissionType
  ): Promise<boolean> {
    // Check direct grants
    const directGrants = Array.from(this.grants.values()).filter(g =>
      g.grantee === userId &&
      g.resource === resource &&
      g.status === 'ACTIVE' &&
      (!g.expiresAt || g.expiresAt > new Date()) &&
      g.permissions.includes(permission)
    );

    if (directGrants.length > 0) {
      return true;
    }

    // Check delegated permissions
    const delegations = Array.from(this.delegations.values()).filter(d =>
      d.delegatee === userId &&
      d.originalGrant.resource === resource &&
      d.status === 'ACTIVE' &&
      (!d.expiresAt || d.expiresAt > new Date()) &&
      d.delegatedPermissions.includes(permission)
    );

    return delegations.length > 0;
  }

  /**
   * Gets user permissions
   * @param userId - User identifier
   * @param resource - Resource identifier
   * @returns List of permissions
   */
  async getUserPermissions(userId: string, resource: string): Promise<{
    permissions: PermissionType[];
    grants: PermissionGrant[];
    delegations: PermissionDelegation[];
  }> {
    const grants = Array.from(this.grants.values()).filter(g =>
      g.grantee === userId &&
      g.resource === resource &&
      g.status === 'ACTIVE' &&
      (!g.expiresAt || g.expiresAt > new Date())
    );

    const delegations = Array.from(this.delegations.values()).filter(d =>
      d.delegatee === userId &&
      d.originalGrant.resource === resource &&
      d.status === 'ACTIVE' &&
      (!d.expiresAt || d.expiresAt > new Date())
    );

    const allPermissions = new Set<PermissionType>();
    grants.forEach(g => g.permissions.forEach(p => allPermissions.add(p)));
    delegations.forEach(d => d.delegatedPermissions.forEach(p => allPermissions.add(p)));

    return {
      permissions: Array.from(allPermissions),
      grants,
      delegations
    };
  }

  /**
   * Expires permission grant
   * @param grantId - Grant identifier
   * @returns Expiration result
   */
  async expireGrant(grantId: string): Promise<{ expired: boolean; timestamp: Date }> {
    const grant = this.grants.get(grantId);
    if (!grant) {
      throw new BadRequestException('Grant not found');
    }

    grant.expiresAt = new Date();
    grant.status = 'EXPIRED';

    await this.logPermissionAction(grantId, 'EXPIRED');

    this.logger.log(`Permission grant expired: ${grantId}`);

    return {
      expired: true,
      timestamp: new Date()
    };
  }

  /**
   * Gets permission audit log
   * @param filters - Filter criteria
   * @returns Audit log entries
   */
  async getPermissionLog(filters?: {
    grantId?: string;
    action?: string;
    startDate?: Date;
    endDate?: Date;
  }): Promise<any[]> {
    let log = [...this.permissionLog];

    if (filters?.grantId) {
      log = log.filter(l => l.grantId === filters.grantId);
    }
    if (filters?.action) {
      log = log.filter(l => l.action === filters.action);
    }
    if (filters?.startDate) {
      log = log.filter(l => l.timestamp >= filters.startDate);
    }
    if (filters?.endDate) {
      log = log.filter(l => l.timestamp <= filters.endDate);
    }

    return log;
  }

  /**
   * Checks if user can grant permissions
   */
  private async canGrant(userId: string, resource: string): Promise<boolean> {
    return await this.hasPermission(userId, resource, PermissionType.ADMIN);
  }

  /**
   * Logs permission action
   */
  private async logPermissionAction(grantId: string, action: string): Promise<void> {
    this.permissionLog.push({
      grantId,
      action,
      timestamp: new Date()
    });

    if (this.permissionLog.length > 10000) {
      this.permissionLog = this.permissionLog.slice(-10000);
    }
  }
}

export default PermissionManagementService;
