/**
 * Permission Delegation Interface
 *
 * Represents a temporary delegation of permissions from one user to another.
 * Delegations are time-limited, revocable, and fully audit-logged.
 */
export interface PermissionDelegation {
  id: string;
  fromUserId: string;
  toUserId: string;
  permissions: string[]; // Array of permission IDs
  reason?: string;
  expiresAt: Date;
  isActive: boolean;
  createdAt: Date;
  revokedAt?: Date;
  revokedBy?: string;
}

/**
 * Delegation Check Result
 */
export interface DelegationCheckResult {
  hasDelegation: boolean;
  delegation?: PermissionDelegation;
  isExpired?: boolean;
}
