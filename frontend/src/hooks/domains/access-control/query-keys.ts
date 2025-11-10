/**
 * @fileoverview Query keys for access control domain
 * @module hooks/domains/access-control/query-keys
 * @category Hooks - Access Control
 */

export const accessControlQueryKeys = {
  all: ['access-control'] as const,
  domain: ['access-control'] as const,

  // User permissions
  userPermissions: (userId: string) =>
    [...accessControlQueryKeys.domain, 'user', userId, 'permissions'] as const,

  // Roles
  roles: ['access-control', 'roles'] as const,
  role: (roleId: string) =>
    [...accessControlQueryKeys.domain, 'role', roleId] as const,

  // Permission checks
  permissionCheck: (permission: string, resourceId?: string) =>
    resourceId
      ? ([...accessControlQueryKeys.domain, 'check', permission, resourceId] as const)
      : ([...accessControlQueryKeys.domain, 'check', permission] as const),

  multiplePermissionChecks: (permissions: string[]) =>
    [...accessControlQueryKeys.domain, 'check-multiple', ...permissions.sort()] as const,

  hasAnyPermission: (permissions: string[]) =>
    [...accessControlQueryKeys.domain, 'has-any', ...permissions.sort()] as const,

  hasAllPermissions: (permissions: string[]) =>
    [...accessControlQueryKeys.domain, 'has-all', ...permissions.sort()] as const,

  // Legacy support
  permissions: {
    all: () => [...accessControlQueryKeys.domain, 'permissions'] as const,
    byUser: (userId: string) =>
      [...accessControlQueryKeys.domain, 'permissions', 'user', userId] as const,
    byRole: (roleId: string) =>
      [...accessControlQueryKeys.domain, 'permissions', 'role', roleId] as const,
  },
} as const;
