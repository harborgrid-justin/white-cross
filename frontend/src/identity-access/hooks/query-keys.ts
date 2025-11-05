/**
 * @fileoverview Query keys for access control hooks
 * @module identity-access/hooks/query-keys
 * 
 * Centralized query keys for TanStack Query caching.
 * Follows best practices for cache invalidation and key management.
 */

/**
 * Access control query keys factory
 * Provides hierarchical query keys for consistent caching
 */
export const accessControlQueryKeys = {
  // Domain key
  domain: ['access-control'] as const,
  
  // Permissions
  permissions: {
    all: () => [...accessControlQueryKeys.domain, 'permissions'] as const,
    byUser: (userId: string) => [...accessControlQueryKeys.permissions.all(), 'user', userId] as const,
    check: (permission: string, resourceId?: string) => [
      ...accessControlQueryKeys.domain, 
      'check', 
      permission, 
      resourceId
    ] as const,
  },
  
  // Roles
  roles: {
    all: () => [...accessControlQueryKeys.domain, 'roles'] as const,
    byId: (roleId: string) => [...accessControlQueryKeys.roles.all(), roleId] as const,
  },
  
  // Users (for role assignments)
  users: {
    all: () => [...accessControlQueryKeys.domain, 'users'] as const,
    byId: (userId: string) => [...accessControlQueryKeys.users.all(), userId] as const,
    withRoles: (userId: string) => [...accessControlQueryKeys.users.byId(userId), 'roles'] as const,
  },
} as const;
