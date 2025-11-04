/**
 * @fileoverview Query keys for access control domain
 * @module hooks/domains/access-control/query-keys
 * @category Hooks - Access Control
 */

export const accessControlQueryKeys = {
  domain: ['access-control'] as const,
  permissions: {
    all: () => [...accessControlQueryKeys.domain, 'permissions'] as const,
    byUser: (userId: string) =>
      [...accessControlQueryKeys.permissions.all(), 'user', userId] as const,
    byRole: (roleId: string) =>
      [...accessControlQueryKeys.permissions.all(), 'role', roleId] as const,
  },
  roles: {
    all: () => [...accessControlQueryKeys.domain, 'roles'] as const,
  },
} as const;
