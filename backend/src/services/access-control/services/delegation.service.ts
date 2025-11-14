import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { DelegationCheckResult, PermissionDelegation } from '../interfaces/permission-delegation.interface';

import { BaseService } from '@/common/base';
/**
 * Permission Delegation Service
 *
 * Manages temporary delegation of permissions between users.
 * Supports time-limited delegations with audit trails.
 *
 * Features:
 * - Create time-limited delegations
 * - Revoke delegations before expiry
 * - Check delegation validity
 * - Automatic expiration handling
 * - Full audit trail
 */
@Injectable()
export class DelegationService extends BaseService {
  // In-memory delegation storage (in production, use database)
  private delegations: Map<string, PermissionDelegation> = new Map();

  constructor() {
    super("DelegationService");
    this.logInfo('Permission Delegation Service initialized');
    this.startCleanupInterval();
  }

  /**
   * Create a new permission delegation
   */
  async createDelegation(
    fromUserId: string,
    toUserId: string,
    permissions: string[],
    expiresAt: Date,
    reason?: string,
  ): Promise<PermissionDelegation> {
    // Validation
    if (fromUserId === toUserId) {
      throw new BadRequestException('Cannot delegate permissions to yourself');
    }

    if (permissions.length === 0) {
      throw new BadRequestException(
        'Must specify at least one permission to delegate',
      );
    }

    if (new Date(expiresAt) <= new Date()) {
      throw new BadRequestException('Expiration date must be in the future');
    }

    const id = `delegation_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const delegation: PermissionDelegation = {
      id,
      fromUserId,
      toUserId,
      permissions,
      reason,
      expiresAt: new Date(expiresAt),
      isActive: true,
      createdAt: new Date(),
    };

    this.delegations.set(id, delegation);
    this.logInfo(
      `Created delegation: ${fromUserId} -> ${toUserId} (${permissions.length} permissions)`,
    );

    return delegation;
  }

  /**
   * Revoke a delegation
   */
  async revokeDelegation(
    delegationId: string,
    revokedBy: string,
    reason?: string,
  ): Promise<PermissionDelegation> {
    const delegation = this.delegations.get(delegationId);

    if (!delegation) {
      throw new NotFoundException('Delegation not found');
    }

    if (!delegation.isActive) {
      throw new BadRequestException('Delegation is already revoked');
    }

    delegation.isActive = false;
    delegation.revokedAt = new Date();
    delegation.revokedBy = revokedBy;

    if (reason) {
      delegation.reason = `${delegation.reason || ''} | Revoked: ${reason}`;
    }

    this.delegations.set(delegationId, delegation);
    this.logInfo(`Revoked delegation: ${delegationId} by ${revokedBy}`);

    return delegation;
  }

  /**
   * Get all delegations for a user (received or given)
   */
  async getUserDelegations(
    userId: string,
    type: 'received' | 'given' | 'all' = 'all',
  ): Promise<PermissionDelegation[]> {
    const allDelegations = Array.from(this.delegations.values());

    let filtered = allDelegations;

    if (type === 'received') {
      filtered = allDelegations.filter((d) => d.toUserId === userId);
    } else if (type === 'given') {
      filtered = allDelegations.filter((d) => d.fromUserId === userId);
    } else {
      filtered = allDelegations.filter(
        (d) => d.toUserId === userId || d.fromUserId === userId,
      );
    }

    return filtered.filter(
      (d) => d.isActive && new Date(d.expiresAt) > new Date(),
    );
  }

  /**
   * Check if user has delegated permission
   */
  async checkDelegation(
    userId: string,
    permissionId: string,
  ): Promise<DelegationCheckResult> {
    const userDelegations = await this.getUserDelegations(userId, 'received');

    for (const delegation of userDelegations) {
      if (delegation.permissions.includes(permissionId)) {
        const isExpired = new Date(delegation.expiresAt) <= new Date();

        return {
          hasDelegation: !isExpired,
          delegation,
          isExpired,
        };
      }
    }

    return {
      hasDelegation: false,
    };
  }

  /**
   * Get delegation by ID
   */
  async getDelegation(delegationId: string): Promise<PermissionDelegation> {
    const delegation = this.delegations.get(delegationId);

    if (!delegation) {
      throw new NotFoundException('Delegation not found');
    }

    return delegation;
  }

  /**
   * Get all active delegations
   */
  async getAllDelegations(): Promise<PermissionDelegation[]> {
    return Array.from(this.delegations.values()).filter(
      (d) => d.isActive && new Date(d.expiresAt) > new Date(),
    );
  }

  /**
   * Clean up expired delegations
   */
  private cleanupExpired(): void {
    const now = new Date();
    let cleaned = 0;

    for (const [id, delegation] of this.delegations.entries()) {
      if (delegation.isActive && new Date(delegation.expiresAt) <= now) {
        delegation.isActive = false;
        this.delegations.set(id, delegation);
        cleaned++;
      }
    }

    if (cleaned > 0) {
      this.logInfo(`Cleaned up ${cleaned} expired delegations`);
    }
  }

  /**
   * Start periodic cleanup of expired delegations
   */
  private startCleanupInterval(): void {
    // Run cleanup every 5 minutes
    setInterval(
      () => {
        this.cleanupExpired();
      },
      5 * 60 * 1000,
    );
  }
}
