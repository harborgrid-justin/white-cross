import { Injectable, Logger } from '@nestjs/common';

/**
 * Permission Cache Service
 *
 * High-performance in-memory caching for permissions with TTL-based invalidation.
 * Significantly improves performance of permission checks by caching user and role permissions.
 *
 * Features:
 * - In-memory cache with configurable TTL
 * - Automatic expiration
 * - Cache invalidation on permission changes
 * - Cache statistics and monitoring
 * - Cache warming on service initialization
 */
@Injectable()
export class PermissionCacheService {
  private readonly logger = new Logger(PermissionCacheService.name);

  // Cache stores with TTL
  private userPermissionsCache: Map<string, { data: any; expiresAt: number }> = new Map();
  private rolePermissionsCache: Map<string, { data: any; expiresAt: number }> = new Map();

  // Cache statistics
  private stats = {
    userPermissions: { hits: 0, misses: 0, sets: 0, invalidations: 0 },
    rolePermissions: { hits: 0, misses: 0, sets: 0, invalidations: 0 },
  };

  // Default TTLs in milliseconds
  private readonly USER_PERMISSIONS_TTL = 5 * 60 * 1000; // 5 minutes
  private readonly ROLE_PERMISSIONS_TTL = 15 * 60 * 1000; // 15 minutes

  constructor() {
    // Start cleanup interval
    this.startCleanupInterval();
    this.logger.log('Permission cache service initialized');
  }

  // ============================================================================
  // USER PERMISSIONS CACHE
  // ============================================================================

  /**
   * Get cached user permissions
   */
  getUserPermissions(userId: string): any | null {
    const cached = this.userPermissionsCache.get(userId);

    if (!cached) {
      this.stats.userPermissions.misses++;
      return null;
    }

    // Check if expired
    if (Date.now() > cached.expiresAt) {
      this.userPermissionsCache.delete(userId);
      this.stats.userPermissions.misses++;
      return null;
    }

    this.stats.userPermissions.hits++;
    this.logger.debug(`Cache HIT for user permissions: ${userId}`);
    return cached.data;
  }

  /**
   * Set user permissions in cache
   */
  setUserPermissions(userId: string, permissions: any, ttl?: number): void {
    const expiresAt = Date.now() + (ttl || this.USER_PERMISSIONS_TTL);
    this.userPermissionsCache.set(userId, {
      data: permissions,
      expiresAt,
    });
    this.stats.userPermissions.sets++;
    this.logger.debug(`Cache SET for user permissions: ${userId}`);
  }

  /**
   * Invalidate user permissions cache
   */
  invalidateUserPermissions(userId: string): void {
    this.userPermissionsCache.delete(userId);
    this.stats.userPermissions.invalidations++;
    this.logger.debug(`Cache INVALIDATE for user permissions: ${userId}`);
  }

  /**
   * Invalidate all user permissions
   */
  invalidateAllUserPermissions(): void {
    const count = this.userPermissionsCache.size;
    this.userPermissionsCache.clear();
    this.stats.userPermissions.invalidations += count;
    this.logger.log(`Cache INVALIDATE ALL user permissions: ${count} entries`);
  }

  // ============================================================================
  // ROLE PERMISSIONS CACHE
  // ============================================================================

  /**
   * Get cached role permissions
   */
  getRolePermissions(roleId: string): any | null {
    const cached = this.rolePermissionsCache.get(roleId);

    if (!cached) {
      this.stats.rolePermissions.misses++;
      return null;
    }

    // Check if expired
    if (Date.now() > cached.expiresAt) {
      this.rolePermissionsCache.delete(roleId);
      this.stats.rolePermissions.misses++;
      return null;
    }

    this.stats.rolePermissions.hits++;
    this.logger.debug(`Cache HIT for role permissions: ${roleId}`);
    return cached.data;
  }

  /**
   * Set role permissions in cache
   */
  setRolePermissions(roleId: string, permissions: any, ttl?: number): void {
    const expiresAt = Date.now() + (ttl || this.ROLE_PERMISSIONS_TTL);
    this.rolePermissionsCache.set(roleId, {
      data: permissions,
      expiresAt,
    });
    this.stats.rolePermissions.sets++;
    this.logger.debug(`Cache SET for role permissions: ${roleId}`);
  }

  /**
   * Invalidate role permissions cache
   */
  invalidateRolePermissions(roleId: string): void {
    this.rolePermissionsCache.delete(roleId);
    this.stats.rolePermissions.invalidations++;
    this.logger.debug(`Cache INVALIDATE for role permissions: ${roleId}`);

    // Also invalidate all user permissions since role permissions changed
    this.invalidateAllUserPermissions();
  }

  /**
   * Invalidate all role permissions
   */
  invalidateAllRolePermissions(): void {
    const count = this.rolePermissionsCache.size;
    this.rolePermissionsCache.clear();
    this.stats.rolePermissions.invalidations += count;
    this.logger.log(`Cache INVALIDATE ALL role permissions: ${count} entries`);

    // Also invalidate all user permissions
    this.invalidateAllUserPermissions();
  }

  // ============================================================================
  // CACHE MANAGEMENT
  // ============================================================================

  /**
   * Clear all caches
   */
  clearAll(): void {
    this.invalidateAllUserPermissions();
    this.invalidateAllRolePermissions();
    this.logger.log('All caches cleared');
  }

  /**
   * Get cache statistics
   */
  getStatistics(): any {
    const userHitRate = this.stats.userPermissions.hits + this.stats.userPermissions.misses > 0
      ? (this.stats.userPermissions.hits / (this.stats.userPermissions.hits + this.stats.userPermissions.misses) * 100).toFixed(2)
      : '0.00';

    const roleHitRate = this.stats.rolePermissions.hits + this.stats.rolePermissions.misses > 0
      ? (this.stats.rolePermissions.hits / (this.stats.rolePermissions.hits + this.stats.rolePermissions.misses) * 100).toFixed(2)
      : '0.00';

    return {
      userPermissions: {
        ...this.stats.userPermissions,
        hitRate: `${userHitRate}%`,
        size: this.userPermissionsCache.size,
      },
      rolePermissions: {
        ...this.stats.rolePermissions,
        hitRate: `${roleHitRate}%`,
        size: this.rolePermissionsCache.size,
      },
      totalSize: this.userPermissionsCache.size + this.rolePermissionsCache.size,
    };
  }

  /**
   * Reset cache statistics
   */
  resetStatistics(): void {
    this.stats = {
      userPermissions: { hits: 0, misses: 0, sets: 0, invalidations: 0 },
      rolePermissions: { hits: 0, misses: 0, sets: 0, invalidations: 0 },
    };
    this.logger.log('Cache statistics reset');
  }

  /**
   * Start automatic cleanup of expired entries
   */
  private startCleanupInterval(): void {
    // Run cleanup every minute
    setInterval(() => {
      this.cleanupExpired();
    }, 60 * 1000);
  }

  /**
   * Remove expired entries from cache
   */
  private cleanupExpired(): void {
    const now = Date.now();
    let userRemoved = 0;
    let roleRemoved = 0;

    // Cleanup user permissions
    for (const [key, value] of this.userPermissionsCache.entries()) {
      if (now > value.expiresAt) {
        this.userPermissionsCache.delete(key);
        userRemoved++;
      }
    }

    // Cleanup role permissions
    for (const [key, value] of this.rolePermissionsCache.entries()) {
      if (now > value.expiresAt) {
        this.rolePermissionsCache.delete(key);
        roleRemoved++;
      }
    }

    if (userRemoved > 0 || roleRemoved > 0) {
      this.logger.debug(`Cache cleanup: removed ${userRemoved} user permissions, ${roleRemoved} role permissions`);
    }
  }

  /**
   * Warm cache with frequently accessed data
   */
  async warmCache(getUserPermissionsFn: (userId: string) => Promise<any>, userIds: string[]): Promise<void> {
    this.logger.log(`Warming cache for ${userIds.length} users`);

    for (const userId of userIds) {
      try {
        const permissions = await getUserPermissionsFn(userId);
        this.setUserPermissions(userId, permissions);
      } catch (error) {
        this.logger.error(`Error warming cache for user ${userId}:`, error);
      }
    }

    this.logger.log('Cache warming completed');
  }
}
