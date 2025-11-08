/**
 * @fileoverview Enterprise RBAC & Permissions Management React Hooks Kit
 * @module reuse/frontend/permissions-roles-kit
 * @description Production-ready React hooks for role-based access control,
 * permissions management, access policies, and authorization workflows
 *
 * @example
 * ```tsx
 * import {
 *   usePermissions,
 *   useCanEdit,
 *   useRoleManager,
 *   PermissionChecker
 * } from '@/reuse/frontend/permissions-roles-kit';
 *
 * function DocumentEditor() {
 *   const canEdit = useCanEdit('documents', documentId);
 *   const { permissions, hasPermission } = usePermissions();
 *
 *   if (!canEdit) return <AccessDenied />;
 *   return <Editor />;
 * }
 * ```
 *
 * @author Enterprise Development Team
 * @version 1.0.0
 * @license MIT
 */

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';

/* ========================================================================
   TYPE DEFINITIONS
   ======================================================================== */

/**
 * Permission action types
 */
export type PermissionAction =
  | 'create'
  | 'read'
  | 'update'
  | 'delete'
  | 'publish'
  | 'approve'
  | 'execute'
  | 'manage'
  | 'admin'
  | string;

/**
 * Resource types for permission checks
 */
export type ResourceType =
  | 'documents'
  | 'users'
  | 'projects'
  | 'reports'
  | 'settings'
  | 'billing'
  | 'analytics'
  | string;

/**
 * Permission scope levels
 */
export type PermissionScope = 'global' | 'organization' | 'team' | 'project' | 'resource';

/**
 * Role hierarchy levels
 */
export type RoleLevel = 'super_admin' | 'admin' | 'manager' | 'member' | 'guest';

/**
 * Core permission definition
 */
export interface Permission {
  id: string;
  name: string;
  description?: string;
  action: PermissionAction;
  resource: ResourceType;
  scope: PermissionScope;
  conditions?: PermissionCondition[];
  metadata?: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Permission condition for dynamic access control
 */
export interface PermissionCondition {
  field: string;
  operator: 'equals' | 'notEquals' | 'contains' | 'greaterThan' | 'lessThan' | 'in' | 'notIn';
  value: any;
  logic?: 'AND' | 'OR';
}

/**
 * Role definition with permissions
 */
export interface Role {
  id: string;
  name: string;
  description?: string;
  level: RoleLevel;
  permissions: Permission[];
  inheritsFrom?: string[]; // Parent role IDs
  isSystemRole?: boolean;
  isActive?: boolean;
  metadata?: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * User role assignment
 */
export interface RoleAssignment {
  id: string;
  userId: string;
  roleId: string;
  scope: PermissionScope;
  scopeId?: string; // e.g., organizationId, teamId
  grantedBy?: string;
  grantedAt: Date;
  expiresAt?: Date;
  isActive: boolean;
  metadata?: Record<string, any>;
}

/**
 * Access policy for fine-grained control
 */
export interface AccessPolicy {
  id: string;
  name: string;
  description?: string;
  effect: 'allow' | 'deny';
  priority: number;
  conditions: PermissionCondition[];
  permissions: Permission[];
  roles?: string[];
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Permission check context
 */
export interface PermissionContext {
  userId: string;
  roles: Role[];
  assignments: RoleAssignment[];
  policies: AccessPolicy[];
  resourceOwnership?: Record<string, string>; // resourceId -> ownerId
  teamMemberships?: string[];
  departmentId?: string;
  organizationId?: string;
  metadata?: Record<string, any>;
}

/**
 * Permission check result
 */
export interface PermissionCheckResult {
  allowed: boolean;
  reason?: string;
  matchedPermission?: Permission;
  matchedRole?: Role;
  matchedPolicy?: AccessPolicy;
  denyReasons?: string[];
}

/**
 * Temporary access grant
 */
export interface TemporaryAccess {
  id: string;
  userId: string;
  permissions: Permission[];
  grantedBy: string;
  grantedAt: Date;
  expiresAt: Date;
  reason?: string;
  isActive: boolean;
  revokedAt?: Date;
  revokedBy?: string;
}

/**
 * Permission audit log entry
 */
export interface PermissionAuditLog {
  id: string;
  userId: string;
  action: 'grant' | 'revoke' | 'check' | 'deny';
  permission?: Permission;
  role?: Role;
  resource?: string;
  result: 'success' | 'failure';
  reason?: string;
  metadata?: Record<string, any>;
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Permission group for bulk operations
 */
export interface PermissionGroup {
  id: string;
  name: string;
  description?: string;
  permissions: Permission[];
  category?: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Resource permission matrix
 */
export interface ResourcePermissionMatrix {
  resourceType: ResourceType;
  resourceId: string;
  permissions: {
    role: string;
    actions: PermissionAction[];
    conditions?: PermissionCondition[];
  }[];
}

/**
 * Hook options for permission checks
 */
export interface UsePermissionOptions {
  enableCaching?: boolean;
  cacheTTL?: number; // milliseconds
  enableAudit?: boolean;
  throwOnDeny?: boolean;
  fallbackAllowed?: boolean;
}

/**
 * Hook return type for permissions
 */
export interface UsePermissionsReturn {
  permissions: Permission[];
  roles: Role[];
  hasPermission: (action: PermissionAction, resource: ResourceType, resourceId?: string) => boolean;
  hasAnyPermission: (permissions: Array<{ action: PermissionAction; resource: ResourceType }>) => boolean;
  hasAllPermissions: (permissions: Array<{ action: PermissionAction; resource: ResourceType }>) => boolean;
  checkPermission: (action: PermissionAction, resource: ResourceType, resourceId?: string) => PermissionCheckResult;
  isLoading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
}

/**
 * Hook return type for role management
 */
export interface UseRoleReturn {
  role: Role | null;
  permissions: Permission[];
  hasRole: (roleId: string) => boolean;
  isLoading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
}

/* ========================================================================
   CORE PERMISSION HOOKS
   ======================================================================== */

/**
 * Hook to access user permissions and perform permission checks
 *
 * @param userId - User ID to check permissions for
 * @param options - Configuration options
 * @returns Permission checking utilities
 *
 * @example
 * ```tsx
 * function Dashboard() {
 *   const { permissions, hasPermission, checkPermission } = usePermissions('user-123');
 *
 *   const canEditReports = hasPermission('update', 'reports');
 *   const result = checkPermission('delete', 'documents', 'doc-456');
 *
 *   return (
 *     <div>
 *       {canEditReports && <ReportEditor />}
 *       {result.allowed && <DeleteButton />}
 *     </div>
 *   );
 * }
 * ```
 */
export function usePermissions(
  userId?: string,
  options: UsePermissionOptions = {}
): UsePermissionsReturn {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const cacheRef = useRef<Map<string, { result: boolean; timestamp: number }>>(new Map());

  const {
    enableCaching = true,
    cacheTTL = 60000, // 1 minute default
    enableAudit = false,
    throwOnDeny = false,
    fallbackAllowed = false,
  } = options;

  const fetchPermissions = useCallback(async () => {
    if (!userId) {
      setPermissions([]);
      setRoles([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Fetch user roles and permissions from API
      const response = await fetch(`/api/users/${userId}/permissions`);
      if (!response.ok) throw new Error('Failed to fetch permissions');

      const data = await response.json();
      setPermissions(data.permissions || []);
      setRoles(data.roles || []);
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error('Unknown error');
      setError(errorObj);
      if (throwOnDeny) throw errorObj;
    } finally {
      setIsLoading(false);
    }
  }, [userId, throwOnDeny]);

  useEffect(() => {
    fetchPermissions();
  }, [fetchPermissions]);

  const getCacheKey = useCallback(
    (action: PermissionAction, resource: ResourceType, resourceId?: string) => {
      return `${action}:${resource}:${resourceId || '*'}`;
    },
    []
  );

  const checkPermission = useCallback(
    (action: PermissionAction, resource: ResourceType, resourceId?: string): PermissionCheckResult => {
      const cacheKey = getCacheKey(action, resource, resourceId);

      // Check cache if enabled
      if (enableCaching) {
        const cached = cacheRef.current.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < cacheTTL) {
          return {
            allowed: cached.result,
            reason: 'cached',
          };
        }
      }

      // Check permissions
      const matchedPermission = permissions.find(
        (p) => p.action === action && p.resource === resource
      );

      const allowed = !!matchedPermission || fallbackAllowed;

      // Update cache
      if (enableCaching) {
        cacheRef.current.set(cacheKey, { result: allowed, timestamp: Date.now() });
      }

      // Audit if enabled
      if (enableAudit) {
        // Log permission check (implement audit logging)
        console.debug('Permission check:', { action, resource, resourceId, allowed });
      }

      return {
        allowed,
        matchedPermission,
        reason: allowed ? 'permission_granted' : 'permission_denied',
      };
    },
    [permissions, enableCaching, cacheTTL, enableAudit, getCacheKey, fallbackAllowed]
  );

  const hasPermission = useCallback(
    (action: PermissionAction, resource: ResourceType, resourceId?: string): boolean => {
      return checkPermission(action, resource, resourceId).allowed;
    },
    [checkPermission]
  );

  const hasAnyPermission = useCallback(
    (requiredPermissions: Array<{ action: PermissionAction; resource: ResourceType }>): boolean => {
      return requiredPermissions.some((p) => hasPermission(p.action, p.resource));
    },
    [hasPermission]
  );

  const hasAllPermissions = useCallback(
    (requiredPermissions: Array<{ action: PermissionAction; resource: ResourceType }>): boolean => {
      return requiredPermissions.every((p) => hasPermission(p.action, p.resource));
    },
    [hasPermission]
  );

  return {
    permissions,
    roles,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    checkPermission,
    isLoading,
    error,
    refresh: fetchPermissions,
  };
}

/**
 * Hook to check user's role
 *
 * @param userId - User ID
 * @param roleId - Specific role ID to check (optional)
 * @returns Role information and utilities
 *
 * @example
 * ```tsx
 * function AdminPanel() {
 *   const { role, hasRole, permissions } = useRole('user-123');
 *
 *   if (!hasRole('admin')) {
 *     return <AccessDenied />;
 *   }
 *
 *   return <AdminDashboard permissions={permissions} />;
 * }
 * ```
 */
export function useRole(userId?: string, roleId?: string): UseRoleReturn {
  const [role, setRole] = useState<Role | null>(null);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchRole = useCallback(async () => {
    if (!userId) {
      setRole(null);
      setPermissions([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const endpoint = roleId
        ? `/api/users/${userId}/roles/${roleId}`
        : `/api/users/${userId}/primary-role`;

      const response = await fetch(endpoint);
      if (!response.ok) throw new Error('Failed to fetch role');

      const data = await response.json();
      setRole(data.role);
      setPermissions(data.role?.permissions || []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  }, [userId, roleId]);

  useEffect(() => {
    fetchRole();
  }, [fetchRole]);

  const hasRole = useCallback(
    (checkRoleId: string): boolean => {
      return role?.id === checkRoleId || role?.name === checkRoleId;
    },
    [role]
  );

  return {
    role,
    permissions,
    hasRole,
    isLoading,
    error,
    refresh: fetchRole,
  };
}

/**
 * Hook for general access control checks
 *
 * @param resource - Resource type
 * @param action - Action to perform
 * @param resourceId - Specific resource ID (optional)
 * @returns Access allowed boolean
 *
 * @example
 * ```tsx
 * function DocumentActions({ documentId }) {
 *   const canEdit = useAccess('documents', 'update', documentId);
 *   const canDelete = useAccess('documents', 'delete', documentId);
 *
 *   return (
 *     <div>
 *       {canEdit && <EditButton />}
 *       {canDelete && <DeleteButton />}
 *     </div>
 *   );
 * }
 * ```
 */
export function useAccess(
  resource: ResourceType,
  action: PermissionAction,
  resourceId?: string,
  userId?: string
): boolean {
  const { hasPermission, isLoading } = usePermissions(userId);

  const canAccess = useMemo(() => {
    if (isLoading) return false;
    return hasPermission(action, resource, resourceId);
  }, [hasPermission, action, resource, resourceId, isLoading]);

  return canAccess;
}

/* ========================================================================
   SPECIFIC ACTION PERMISSION HOOKS
   ======================================================================== */

/**
 * Hook to check edit permissions
 *
 * @example
 * ```tsx
 * function Editor({ documentId }) {
 *   const canEdit = useCanEdit('documents', documentId);
 *   if (!canEdit) return <ReadOnlyView />;
 *   return <EditableView />;
 * }
 * ```
 */
export function useCanEdit(resource: ResourceType, resourceId?: string, userId?: string): boolean {
  return useAccess(resource, 'update', resourceId, userId);
}

/**
 * Hook to check delete permissions
 *
 * @example
 * ```tsx
 * function DeleteAction({ itemId }) {
 *   const canDelete = useCanDelete('documents', itemId);
 *   return canDelete ? <DeleteButton /> : null;
 * }
 * ```
 */
export function useCanDelete(resource: ResourceType, resourceId?: string, userId?: string): boolean {
  return useAccess(resource, 'delete', resourceId, userId);
}

/**
 * Hook to check publish permissions
 *
 * @example
 * ```tsx
 * function PublishButton({ contentId }) {
 *   const canPublish = useCanPublish('content', contentId);
 *   return canPublish ? <button>Publish</button> : null;
 * }
 * ```
 */
export function useCanPublish(resource: ResourceType, resourceId?: string, userId?: string): boolean {
  return useAccess(resource, 'publish', resourceId, userId);
}

/**
 * Hook to check create permissions
 *
 * @example
 * ```tsx
 * function CreateButton() {
 *   const canCreate = useCanCreate('projects');
 *   return canCreate ? <button>New Project</button> : null;
 * }
 * ```
 */
export function useCanCreate(resource: ResourceType, userId?: string): boolean {
  return useAccess(resource, 'create', undefined, userId);
}

/**
 * Hook to check read permissions
 *
 * @example
 * ```tsx
 * function DocumentViewer({ documentId }) {
 *   const canRead = useCanRead('documents', documentId);
 *   if (!canRead) return <AccessDenied />;
 *   return <DocumentContent />;
 * }
 * ```
 */
export function useCanRead(resource: ResourceType, resourceId?: string, userId?: string): boolean {
  return useAccess(resource, 'read', resourceId, userId);
}

/**
 * Hook to check approve permissions
 *
 * @example
 * ```tsx
 * function ApprovalQueue({ requestId }) {
 *   const canApprove = useCanApprove('requests', requestId);
 *   return canApprove ? <ApproveButton /> : <ViewOnlyRequest />;
 * }
 * ```
 */
export function useCanApprove(resource: ResourceType, resourceId?: string, userId?: string): boolean {
  return useAccess(resource, 'approve', resourceId, userId);
}

/**
 * Hook to check manage permissions (admin-level)
 *
 * @example
 * ```tsx
 * function SettingsPanel() {
 *   const canManage = useCanManage('settings');
 *   if (!canManage) return <AccessDenied />;
 *   return <AdminSettings />;
 * }
 * ```
 */
export function useCanManage(resource: ResourceType, resourceId?: string, userId?: string): boolean {
  return useAccess(resource, 'manage', resourceId, userId);
}

/* ========================================================================
   PERMISSION CHECKER COMPONENTS & UTILITIES
   ======================================================================== */

/**
 * Permission checker component props
 */
export interface PermissionCheckerProps {
  action: PermissionAction;
  resource: ResourceType;
  resourceId?: string;
  userId?: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onDenied?: () => void;
}

/**
 * Component to conditionally render based on permissions
 *
 * @example
 * ```tsx
 * <PermissionChecker
 *   action="update"
 *   resource="documents"
 *   resourceId={docId}
 *   fallback={<AccessDenied />}
 * >
 *   <DocumentEditor />
 * </PermissionChecker>
 * ```
 */
export function PermissionChecker({
  action,
  resource,
  resourceId,
  userId,
  children,
  fallback = null,
  onDenied,
}: PermissionCheckerProps): JSX.Element | null {
  const hasAccess = useAccess(resource, action, resourceId, userId);

  useEffect(() => {
    if (!hasAccess && onDenied) {
      onDenied();
    }
  }, [hasAccess, onDenied]);

  if (!hasAccess) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

/**
 * Access control component props
 */
export interface AccessControlProps {
  permissions: Array<{ action: PermissionAction; resource: ResourceType }>;
  requireAll?: boolean;
  userId?: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Component for complex access control with multiple permissions
 *
 * @example
 * ```tsx
 * <AccessControl
 *   permissions={[
 *     { action: 'update', resource: 'documents' },
 *     { action: 'publish', resource: 'content' }
 *   ]}
 *   requireAll={false}
 *   fallback={<LimitedView />}
 * >
 *   <FullAccessView />
 * </AccessControl>
 * ```
 */
export function AccessControl({
  permissions: requiredPermissions,
  requireAll = false,
  userId,
  children,
  fallback = null,
}: AccessControlProps): JSX.Element | null {
  const { hasAnyPermission, hasAllPermissions } = usePermissions(userId);

  const hasAccess = requireAll
    ? hasAllPermissions(requiredPermissions)
    : hasAnyPermission(requiredPermissions);

  if (!hasAccess) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

/**
 * Role guard component props
 */
export interface RoleGuardProps {
  roles: string[];
  requireAll?: boolean;
  userId?: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Component to guard content based on user roles
 *
 * @example
 * ```tsx
 * <RoleGuard
 *   roles={['admin', 'manager']}
 *   fallback={<AccessDenied />}
 * >
 *   <AdminPanel />
 * </RoleGuard>
 * ```
 */
export function RoleGuard({
  roles: requiredRoles,
  requireAll = false,
  userId,
  children,
  fallback = null,
}: RoleGuardProps): JSX.Element | null {
  const { roles } = usePermissions(userId);

  const hasRole = useMemo(() => {
    const userRoleIds = roles.map((r) => r.id);
    const userRoleNames = roles.map((r) => r.name);

    if (requireAll) {
      return requiredRoles.every(
        (role) => userRoleIds.includes(role) || userRoleNames.includes(role)
      );
    }

    return requiredRoles.some(
      (role) => userRoleIds.includes(role) || userRoleNames.includes(role)
    );
  }, [roles, requiredRoles, requireAll]);

  if (!hasRole) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

/* ========================================================================
   ROLE MANAGEMENT HOOKS
   ======================================================================== */

/**
 * Hook for comprehensive role management
 *
 * @example
 * ```tsx
 * function RoleManagement() {
 *   const {
 *     roles,
 *     createRole,
 *     updateRole,
 *     deleteRole,
 *     assignRole,
 *     revokeRole
 *   } = useRoleManager();
 *
 *   const handleCreate = async () => {
 *     await createRole({
 *       name: 'Content Editor',
 *       permissions: editorPermissions
 *     });
 *   };
 * }
 * ```
 */
export function useRoleManager() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchRoles = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/roles');
      if (!response.ok) throw new Error('Failed to fetch roles');
      const data = await response.json();
      setRoles(data.roles || []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  const createRole = useCallback(async (roleData: Omit<Role, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/roles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(roleData),
      });

      if (!response.ok) throw new Error('Failed to create role');

      const newRole = await response.json();
      setRoles((prev) => [...prev, newRole]);
      return newRole;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateRole = useCallback(async (roleId: string, updates: Partial<Role>) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/roles/${roleId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (!response.ok) throw new Error('Failed to update role');

      const updatedRole = await response.json();
      setRoles((prev) => prev.map((r) => (r.id === roleId ? updatedRole : r)));
      return updatedRole;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteRole = useCallback(async (roleId: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/roles/${roleId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete role');

      setRoles((prev) => prev.filter((r) => r.id !== roleId));
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const assignRole = useCallback(async (userId: string, roleId: string, scope?: PermissionScope, scopeId?: string) => {
    try {
      const response = await fetch(`/api/users/${userId}/roles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roleId, scope, scopeId }),
      });

      if (!response.ok) throw new Error('Failed to assign role');

      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      throw err;
    }
  }, []);

  const revokeRole = useCallback(async (userId: string, roleId: string) => {
    try {
      const response = await fetch(`/api/users/${userId}/roles/${roleId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to revoke role');
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      throw err;
    }
  }, []);

  return {
    roles,
    isLoading,
    error,
    fetchRoles,
    createRole,
    updateRole,
    deleteRole,
    assignRole,
    revokeRole,
  };
}

/**
 * Hook for managing role assignments
 *
 * @example
 * ```tsx
 * function UserRoleAssignment({ userId }) {
 *   const { assignments, assign, revoke, isLoading } = useRoleAssignment(userId);
 *
 *   return (
 *     <div>
 *       {assignments.map(a => (
 *         <RoleCard key={a.id} assignment={a} onRevoke={() => revoke(a.id)} />
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
export function useRoleAssignment(userId?: string) {
  const [assignments, setAssignments] = useState<RoleAssignment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchAssignments = useCallback(async () => {
    if (!userId) return;

    try {
      setIsLoading(true);
      const response = await fetch(`/api/users/${userId}/role-assignments`);
      if (!response.ok) throw new Error('Failed to fetch assignments');
      const data = await response.json();
      setAssignments(data.assignments || []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  const assign = useCallback(
    async (roleId: string, scope: PermissionScope = 'global', scopeId?: string, expiresAt?: Date) => {
      if (!userId) throw new Error('User ID required');

      try {
        setIsLoading(true);
        const response = await fetch(`/api/users/${userId}/role-assignments`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ roleId, scope, scopeId, expiresAt }),
        });

        if (!response.ok) throw new Error('Failed to assign role');

        const newAssignment = await response.json();
        setAssignments((prev) => [...prev, newAssignment]);
        return newAssignment;
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [userId]
  );

  const revoke = useCallback(
    async (assignmentId: string) => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/role-assignments/${assignmentId}`, {
          method: 'DELETE',
        });

        if (!response.ok) throw new Error('Failed to revoke assignment');

        setAssignments((prev) => prev.filter((a) => a.id !== assignmentId));
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return {
    assignments,
    isLoading,
    error,
    fetchAssignments,
    assign,
    revoke,
  };
}

/**
 * Hook for role inheritance management
 *
 * @example
 * ```tsx
 * function RoleHierarchy({ roleId }) {
 *   const { parentRoles, childRoles, addParent, removeParent } = useRoleInheritance(roleId);
 *
 *   return (
 *     <div>
 *       <h3>Inherits from:</h3>
 *       {parentRoles.map(role => <RoleBadge key={role.id} role={role} />)}
 *     </div>
 *   );
 * }
 * ```
 */
export function useRoleInheritance(roleId?: string) {
  const [parentRoles, setParentRoles] = useState<Role[]>([]);
  const [childRoles, setChildRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchInheritance = useCallback(async () => {
    if (!roleId) return;

    try {
      setIsLoading(true);
      const response = await fetch(`/api/roles/${roleId}/inheritance`);
      if (!response.ok) throw new Error('Failed to fetch role inheritance');
      const data = await response.json();
      setParentRoles(data.parentRoles || []);
      setChildRoles(data.childRoles || []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  }, [roleId]);

  useEffect(() => {
    fetchInheritance();
  }, [fetchInheritance]);

  const addParent = useCallback(
    async (parentRoleId: string) => {
      if (!roleId) throw new Error('Role ID required');

      try {
        const response = await fetch(`/api/roles/${roleId}/parents`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ parentRoleId }),
        });

        if (!response.ok) throw new Error('Failed to add parent role');
        await fetchInheritance();
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
        throw err;
      }
    },
    [roleId, fetchInheritance]
  );

  const removeParent = useCallback(
    async (parentRoleId: string) => {
      if (!roleId) throw new Error('Role ID required');

      try {
        const response = await fetch(`/api/roles/${roleId}/parents/${parentRoleId}`, {
          method: 'DELETE',
        });

        if (!response.ok) throw new Error('Failed to remove parent role');
        await fetchInheritance();
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
        throw err;
      }
    },
    [roleId, fetchInheritance]
  );

  return {
    parentRoles,
    childRoles,
    isLoading,
    error,
    fetchInheritance,
    addParent,
    removeParent,
  };
}

/* ========================================================================
   PERMISSION EDITOR & MATRIX HOOKS
   ======================================================================== */

/**
 * Hook for permission matrix management
 *
 * @example
 * ```tsx
 * function PermissionMatrix({ resourceType }) {
 *   const { matrix, updateMatrix, isLoading } = usePermissionMatrix(resourceType);
 *
 *   return (
 *     <table>
 *       {matrix.permissions.map(p => (
 *         <PermissionRow key={p.role} permission={p} />
 *       ))}
 *     </table>
 *   );
 * }
 * ```
 */
export function usePermissionMatrix(resourceType: ResourceType, resourceId?: string) {
  const [matrix, setMatrix] = useState<ResourcePermissionMatrix | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchMatrix = useCallback(async () => {
    try {
      setIsLoading(true);
      const url = resourceId
        ? `/api/permissions/matrix/${resourceType}/${resourceId}`
        : `/api/permissions/matrix/${resourceType}`;

      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch permission matrix');

      const data = await response.json();
      setMatrix(data.matrix);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  }, [resourceType, resourceId]);

  useEffect(() => {
    fetchMatrix();
  }, [fetchMatrix]);

  const updateMatrix = useCallback(
    async (updates: Partial<ResourcePermissionMatrix>) => {
      try {
        setIsLoading(true);
        const url = resourceId
          ? `/api/permissions/matrix/${resourceType}/${resourceId}`
          : `/api/permissions/matrix/${resourceType}`;

        const response = await fetch(url, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates),
        });

        if (!response.ok) throw new Error('Failed to update matrix');

        const updatedMatrix = await response.json();
        setMatrix(updatedMatrix);
        return updatedMatrix;
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [resourceType, resourceId]
  );

  return {
    matrix,
    isLoading,
    error,
    fetchMatrix,
    updateMatrix,
  };
}

/**
 * Hook for permission editor functionality
 *
 * @example
 * ```tsx
 * function PermissionEditor({ roleId }) {
 *   const { permissions, addPermission, removePermission } = usePermissionEditor(roleId);
 *
 *   return (
 *     <PermissionList
 *       permissions={permissions}
 *       onAdd={addPermission}
 *       onRemove={removePermission}
 *     />
 *   );
 * }
 * ```
 */
export function usePermissionEditor(roleId?: string) {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchPermissions = useCallback(async () => {
    if (!roleId) return;

    try {
      setIsLoading(true);
      const response = await fetch(`/api/roles/${roleId}/permissions`);
      if (!response.ok) throw new Error('Failed to fetch permissions');
      const data = await response.json();
      setPermissions(data.permissions || []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  }, [roleId]);

  useEffect(() => {
    fetchPermissions();
  }, [fetchPermissions]);

  const addPermission = useCallback(
    async (permission: Omit<Permission, 'id' | 'createdAt' | 'updatedAt'>) => {
      if (!roleId) throw new Error('Role ID required');

      try {
        setIsLoading(true);
        const response = await fetch(`/api/roles/${roleId}/permissions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(permission),
        });

        if (!response.ok) throw new Error('Failed to add permission');

        const newPermission = await response.json();
        setPermissions((prev) => [...prev, newPermission]);
        return newPermission;
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [roleId]
  );

  const removePermission = useCallback(
    async (permissionId: string) => {
      if (!roleId) throw new Error('Role ID required');

      try {
        setIsLoading(true);
        const response = await fetch(`/api/roles/${roleId}/permissions/${permissionId}`, {
          method: 'DELETE',
        });

        if (!response.ok) throw new Error('Failed to remove permission');

        setPermissions((prev) => prev.filter((p) => p.id !== permissionId));
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [roleId]
  );

  const updatePermission = useCallback(
    async (permissionId: string, updates: Partial<Permission>) => {
      if (!roleId) throw new Error('Role ID required');

      try {
        setIsLoading(true);
        const response = await fetch(`/api/roles/${roleId}/permissions/${permissionId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates),
        });

        if (!response.ok) throw new Error('Failed to update permission');

        const updatedPermission = await response.json();
        setPermissions((prev) =>
          prev.map((p) => (p.id === permissionId ? updatedPermission : p))
        );
        return updatedPermission;
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [roleId]
  );

  return {
    permissions,
    isLoading,
    error,
    fetchPermissions,
    addPermission,
    removePermission,
    updatePermission,
  };
}

/* ========================================================================
   CRUD OPERATIONS FOR ROLES
   ======================================================================== */

/**
 * Hook to create a new role
 *
 * @example
 * ```tsx
 * function CreateRoleForm() {
 *   const { createRole, isLoading, error } = useCreateRole();
 *
 *   const handleSubmit = async (data) => {
 *     const newRole = await createRole(data);
 *     console.log('Created:', newRole);
 *   };
 * }
 * ```
 */
export function useCreateRole() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createRole = useCallback(async (roleData: Omit<Role, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/roles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(roleData),
      });

      if (!response.ok) throw new Error('Failed to create role');

      return await response.json();
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { createRole, isLoading, error };
}

/**
 * Hook to update an existing role
 *
 * @example
 * ```tsx
 * function EditRoleForm({ roleId }) {
 *   const { updateRole, isLoading } = useUpdateRole();
 *
 *   const handleSave = async (updates) => {
 *     await updateRole(roleId, updates);
 *   };
 * }
 * ```
 */
export function useUpdateRole() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const updateRole = useCallback(async (roleId: string, updates: Partial<Role>) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/roles/${roleId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (!response.ok) throw new Error('Failed to update role');

      return await response.json();
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { updateRole, isLoading, error };
}

/**
 * Hook to delete a role
 *
 * @example
 * ```tsx
 * function DeleteRoleButton({ roleId }) {
 *   const { deleteRole, isLoading } = useDeleteRole();
 *
 *   const handleDelete = async () => {
 *     if (confirm('Are you sure?')) {
 *       await deleteRole(roleId);
 *     }
 *   };
 * }
 * ```
 */
export function useDeleteRole() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const deleteRole = useCallback(async (roleId: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/roles/${roleId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete role');
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { deleteRole, isLoading, error };
}

/* ========================================================================
   PERMISSION GRANT & REVOKE HOOKS
   ======================================================================== */

/**
 * Hook to grant permissions
 *
 * @example
 * ```tsx
 * function GrantPermissionButton({ userId, permission }) {
 *   const { grantPermission, isLoading } = useGrantPermission();
 *
 *   const handleGrant = async () => {
 *     await grantPermission(userId, permission);
 *   };
 * }
 * ```
 */
export function useGrantPermission() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const grantPermission = useCallback(
    async (userId: string, permission: Permission, expiresAt?: Date) => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`/api/users/${userId}/permissions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ permission, expiresAt }),
        });

        if (!response.ok) throw new Error('Failed to grant permission');

        return await response.json();
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error');
        setError(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return { grantPermission, isLoading, error };
}

/**
 * Hook to revoke permissions
 *
 * @example
 * ```tsx
 * function RevokePermissionButton({ userId, permissionId }) {
 *   const { revokePermission, isLoading } = useRevokePermission();
 *
 *   const handleRevoke = async () => {
 *     await revokePermission(userId, permissionId);
 *   };
 * }
 * ```
 */
export function useRevokePermission() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const revokePermission = useCallback(async (userId: string, permissionId: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/users/${userId}/permissions/${permissionId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to revoke permission');
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { revokePermission, isLoading, error };
}

/* ========================================================================
   RESOURCE & ACTION PERMISSION HOOKS
   ======================================================================== */

/**
 * Hook for resource-specific permissions
 *
 * @example
 * ```tsx
 * function DocumentPermissions({ documentId }) {
 *   const { permissions, canEdit, canDelete } = useResourcePermissions('documents', documentId);
 *
 *   return (
 *     <div>
 *       {canEdit && <EditButton />}
 *       {canDelete && <DeleteButton />}
 *     </div>
 *   );
 * }
 * ```
 */
export function useResourcePermissions(resource: ResourceType, resourceId: string, userId?: string) {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchResourcePermissions = useCallback(async () => {
    try {
      setIsLoading(true);
      const userParam = userId ? `?userId=${userId}` : '';
      const response = await fetch(`/api/resources/${resource}/${resourceId}/permissions${userParam}`);
      if (!response.ok) throw new Error('Failed to fetch resource permissions');

      const data = await response.json();
      setPermissions(data.permissions || []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  }, [resource, resourceId, userId]);

  useEffect(() => {
    fetchResourcePermissions();
  }, [fetchResourcePermissions]);

  const hasAction = useCallback(
    (action: PermissionAction): boolean => {
      return permissions.some((p) => p.action === action);
    },
    [permissions]
  );

  return {
    permissions,
    isLoading,
    error,
    refresh: fetchResourcePermissions,
    canCreate: hasAction('create'),
    canRead: hasAction('read'),
    canEdit: hasAction('update'),
    canDelete: hasAction('delete'),
    canPublish: hasAction('publish'),
    canApprove: hasAction('approve'),
    canManage: hasAction('manage'),
    hasAction,
  };
}

/**
 * Hook for action-based permissions across resources
 *
 * @example
 * ```tsx
 * function ActionPermissions() {
 *   const { resources, canPerformOn } = useActionPermissions('delete');
 *
 *   return (
 *     <div>
 *       Can delete: {resources.join(', ')}
 *     </div>
 *   );
 * }
 * ```
 */
export function useActionPermissions(action: PermissionAction, userId?: string) {
  const { permissions, isLoading, error } = usePermissions(userId);

  const resources = useMemo(() => {
    return permissions
      .filter((p) => p.action === action)
      .map((p) => p.resource);
  }, [permissions, action]);

  const canPerformOn = useCallback(
    (resource: ResourceType): boolean => {
      return resources.includes(resource);
    },
    [resources]
  );

  return {
    resources,
    isLoading,
    error,
    canPerformOn,
  };
}

/* ========================================================================
   TEAM & DEPARTMENT PERMISSION HOOKS
   ======================================================================== */

/**
 * Hook for team-based permissions
 *
 * @example
 * ```tsx
 * function TeamDashboard({ teamId }) {
 *   const { permissions, members, canManageTeam } = useTeamPermissions(teamId);
 *
 *   if (!canManageTeam) return <TeamViewOnly />;
 *   return <TeamManagement />;
 * }
 * ```
 */
export function useTeamPermissions(teamId: string, userId?: string) {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [members, setMembers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchTeamPermissions = useCallback(async () => {
    try {
      setIsLoading(true);
      const userParam = userId ? `?userId=${userId}` : '';
      const response = await fetch(`/api/teams/${teamId}/permissions${userParam}`);
      if (!response.ok) throw new Error('Failed to fetch team permissions');

      const data = await response.json();
      setPermissions(data.permissions || []);
      setMembers(data.members || []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  }, [teamId, userId]);

  useEffect(() => {
    fetchTeamPermissions();
  }, [fetchTeamPermissions]);

  const canManageTeam = useMemo(() => {
    return permissions.some((p) => p.action === 'manage' && p.scope === 'team');
  }, [permissions]);

  const canInviteMembers = useMemo(() => {
    return permissions.some((p) => p.action === 'create' && p.resource === 'users');
  }, [permissions]);

  return {
    permissions,
    members,
    isLoading,
    error,
    refresh: fetchTeamPermissions,
    canManageTeam,
    canInviteMembers,
  };
}

/**
 * Hook for department-level roles and permissions
 *
 * @example
 * ```tsx
 * function DepartmentRoles({ departmentId }) {
 *   const { roles, assignRole, revokeRole } = useDepartmentRoles(departmentId);
 *
 *   return (
 *     <RolesList
 *       roles={roles}
 *       onAssign={assignRole}
 *       onRevoke={revokeRole}
 *     />
 *   );
 * }
 * ```
 */
export function useDepartmentRoles(departmentId: string) {
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchDepartmentRoles = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/departments/${departmentId}/roles`);
      if (!response.ok) throw new Error('Failed to fetch department roles');

      const data = await response.json();
      setRoles(data.roles || []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  }, [departmentId]);

  useEffect(() => {
    fetchDepartmentRoles();
  }, [fetchDepartmentRoles]);

  const assignRole = useCallback(
    async (userId: string, roleId: string) => {
      try {
        const response = await fetch(`/api/departments/${departmentId}/role-assignments`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, roleId }),
        });

        if (!response.ok) throw new Error('Failed to assign department role');
        return await response.json();
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
        throw err;
      }
    },
    [departmentId]
  );

  const revokeRole = useCallback(
    async (userId: string, roleId: string) => {
      try {
        const response = await fetch(
          `/api/departments/${departmentId}/role-assignments/${userId}/${roleId}`,
          { method: 'DELETE' }
        );

        if (!response.ok) throw new Error('Failed to revoke department role');
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
        throw err;
      }
    },
    [departmentId]
  );

  return {
    roles,
    isLoading,
    error,
    refresh: fetchDepartmentRoles,
    assignRole,
    revokeRole,
  };
}

/* ========================================================================
   OWNERSHIP & CREATOR PERMISSION HOOKS
   ======================================================================== */

/**
 * Hook to check ownership-based permissions
 *
 * @example
 * ```tsx
 * function DocumentActions({ documentId, creatorId }) {
 *   const isOwner = useOwnershipCheck(documentId, creatorId);
 *
 *   return (
 *     <div>
 *       {isOwner && <OwnerControls />}
 *       <ViewControls />
 *     </div>
 *   );
 * }
 * ```
 */
export function useOwnershipCheck(
  resourceId: string,
  ownerId: string,
  userId?: string
): boolean {
  const [isOwner, setIsOwner] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkOwnership = async () => {
      try {
        const userParam = userId ? `?userId=${userId}` : '';
        const response = await fetch(
          `/api/resources/${resourceId}/ownership${userParam}`
        );

        if (!response.ok) throw new Error('Failed to check ownership');

        const data = await response.json();
        setIsOwner(data.isOwner || data.ownerId === ownerId);
      } catch (err) {
        console.error('Ownership check failed:', err);
        setIsOwner(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkOwnership();
  }, [resourceId, ownerId, userId]);

  return isOwner && !isLoading;
}

/**
 * Hook for creator-specific permissions
 *
 * @example
 * ```tsx
 * function CreatorControls({ resourceId }) {
 *   const { isCreator, creatorPermissions } = useCreatorPermissions(resourceId);
 *
 *   if (!isCreator) return null;
 *   return <CreatorMenu permissions={creatorPermissions} />;
 * }
 * ```
 */
export function useCreatorPermissions(resourceId: string, userId?: string) {
  const [isCreator, setIsCreator] = useState(false);
  const [creatorPermissions, setCreatorPermissions] = useState<Permission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCreatorStatus = async () => {
      try {
        setIsLoading(true);
        const userParam = userId ? `?userId=${userId}` : '';
        const response = await fetch(
          `/api/resources/${resourceId}/creator-permissions${userParam}`
        );

        if (!response.ok) throw new Error('Failed to fetch creator permissions');

        const data = await response.json();
        setIsCreator(data.isCreator || false);
        setCreatorPermissions(data.permissions || []);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchCreatorStatus();
  }, [resourceId, userId]);

  return {
    isCreator,
    creatorPermissions,
    isLoading,
    error,
  };
}

/* ========================================================================
   TEMPORARY & TIME-BASED PERMISSION HOOKS
   ======================================================================== */

/**
 * Hook for managing temporary access grants
 *
 * @example
 * ```tsx
 * function TemporaryAccessManager({ userId }) {
 *   const { grants, grantTemporaryAccess, revokeAccess } = useTemporaryAccess(userId);
 *
 *   const handleGrant = async () => {
 *     await grantTemporaryAccess(
 *       [readPermission, updatePermission],
 *       new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
 *     );
 *   };
 * }
 * ```
 */
export function useTemporaryAccess(userId?: string) {
  const [grants, setGrants] = useState<TemporaryAccess[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchGrants = useCallback(async () => {
    if (!userId) return;

    try {
      setIsLoading(true);
      const response = await fetch(`/api/users/${userId}/temporary-access`);
      if (!response.ok) throw new Error('Failed to fetch temporary access');

      const data = await response.json();
      setGrants(data.grants || []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchGrants();
  }, [fetchGrants]);

  const grantTemporaryAccess = useCallback(
    async (permissions: Permission[], expiresAt: Date, reason?: string) => {
      if (!userId) throw new Error('User ID required');

      try {
        setIsLoading(true);
        const response = await fetch(`/api/users/${userId}/temporary-access`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ permissions, expiresAt, reason }),
        });

        if (!response.ok) throw new Error('Failed to grant temporary access');

        const newGrant = await response.json();
        setGrants((prev) => [...prev, newGrant]);
        return newGrant;
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [userId]
  );

  const revokeAccess = useCallback(async (grantId: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/temporary-access/${grantId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to revoke temporary access');

      setGrants((prev) => prev.filter((g) => g.id !== grantId));
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const activeGrants = useMemo(() => {
    const now = new Date();
    return grants.filter((g) => g.isActive && new Date(g.expiresAt) > now);
  }, [grants]);

  return {
    grants,
    activeGrants,
    isLoading,
    error,
    refresh: fetchGrants,
    grantTemporaryAccess,
    revokeAccess,
  };
}

/**
 * Hook for time-based permission checks
 *
 * @example
 * ```tsx
 * function ScheduledContent({ contentId }) {
 *   const canPublish = useTimeBasedPermission(
 *     'publish',
 *     'content',
 *     contentId,
 *     { afterTime: new Date('2024-01-01'), beforeTime: new Date('2024-12-31') }
 *   );
 *
 *   return canPublish ? <PublishButton /> : <ScheduledBadge />;
 * }
 * ```
 */
export function useTimeBasedPermission(
  action: PermissionAction,
  resource: ResourceType,
  resourceId?: string,
  timeConstraints?: { afterTime?: Date; beforeTime?: Date },
  userId?: string
): boolean {
  const { hasPermission, permissions } = usePermissions(userId);
  const [isAllowed, setIsAllowed] = useState(false);

  useEffect(() => {
    const checkTimeBasedPermission = () => {
      const now = new Date();
      const basePermission = hasPermission(action, resource, resourceId);

      if (!basePermission) {
        setIsAllowed(false);
        return;
      }

      if (!timeConstraints) {
        setIsAllowed(true);
        return;
      }

      const { afterTime, beforeTime } = timeConstraints;

      const afterCheck = !afterTime || now >= afterTime;
      const beforeCheck = !beforeTime || now <= beforeTime;

      setIsAllowed(afterCheck && beforeCheck);
    };

    checkTimeBasedPermission();

    // Re-check periodically if time constraints exist
    if (timeConstraints) {
      const interval = setInterval(checkTimeBasedPermission, 60000); // Check every minute
      return () => clearInterval(interval);
    }
  }, [hasPermission, action, resource, resourceId, timeConstraints, permissions]);

  return isAllowed;
}

/* ========================================================================
   PERMISSION GROUPS & BULK OPERATIONS
   ======================================================================== */

/**
 * Hook for managing permission groups
 *
 * @example
 * ```tsx
 * function PermissionGroupManager() {
 *   const { groups, createGroup, assignGroup, removeGroup } = usePermissionGroups();
 *
 *   const handleCreateEditorGroup = async () => {
 *     await createGroup({
 *       name: 'Content Editors',
 *       permissions: editorPermissions,
 *       category: 'content'
 *     });
 *   };
 * }
 * ```
 */
export function usePermissionGroups() {
  const [groups, setGroups] = useState<PermissionGroup[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchGroups = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/permission-groups');
      if (!response.ok) throw new Error('Failed to fetch permission groups');

      const data = await response.json();
      setGroups(data.groups || []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  const createGroup = useCallback(
    async (groupData: Omit<PermissionGroup, 'id' | 'createdAt' | 'updatedAt'>) => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/permission-groups', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(groupData),
        });

        if (!response.ok) throw new Error('Failed to create permission group');

        const newGroup = await response.json();
        setGroups((prev) => [...prev, newGroup]);
        return newGroup;
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const assignGroup = useCallback(async (userId: string, groupId: string) => {
    try {
      const response = await fetch(`/api/users/${userId}/permission-groups`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ groupId }),
      });

      if (!response.ok) throw new Error('Failed to assign permission group');
      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      throw err;
    }
  }, []);

  const removeGroup = useCallback(async (userId: string, groupId: string) => {
    try {
      const response = await fetch(`/api/users/${userId}/permission-groups/${groupId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to remove permission group');
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      throw err;
    }
  }, []);

  return {
    groups,
    isLoading,
    error,
    refresh: fetchGroups,
    createGroup,
    assignGroup,
    removeGroup,
  };
}

/**
 * Hook for bulk permission operations
 *
 * @example
 * ```tsx
 * function BulkPermissionEditor() {
 *   const { grantBulkPermissions, revokeBulkPermissions, isLoading } = useBulkPermissions();
 *
 *   const handleBulkGrant = async (userIds: string[]) => {
 *     await grantBulkPermissions(userIds, [readPermission, updatePermission]);
 *   };
 * }
 * ```
 */
export function useBulkPermissions() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [results, setResults] = useState<{ success: string[]; failed: string[] }>({
    success: [],
    failed: [],
  });

  const grantBulkPermissions = useCallback(async (userIds: string[], permissions: Permission[]) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/permissions/bulk-grant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userIds, permissions }),
      });

      if (!response.ok) throw new Error('Failed to grant bulk permissions');

      const data = await response.json();
      setResults(data.results || { success: [], failed: [] });
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const revokeBulkPermissions = useCallback(
    async (userIds: string[], permissionIds: string[]) => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch('/api/permissions/bulk-revoke', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userIds, permissionIds }),
        });

        if (!response.ok) throw new Error('Failed to revoke bulk permissions');

        const data = await response.json();
        setResults(data.results || { success: [], failed: [] });
        return data;
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const assignBulkRoles = useCallback(async (userIds: string[], roleId: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/roles/bulk-assign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userIds, roleId }),
      });

      if (!response.ok) throw new Error('Failed to assign bulk roles');

      const data = await response.json();
      setResults(data.results || { success: [], failed: [] });
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    results,
    grantBulkPermissions,
    revokeBulkPermissions,
    assignBulkRoles,
  };
}

/* ========================================================================
   AUDIT & PERMISSION HISTORY HOOKS
   ======================================================================== */

/**
 * Hook for auditing permission checks and changes
 *
 * @example
 * ```tsx
 * function PermissionAuditLog({ userId }) {
 *   const { logs, isLoading } = useAuditPermissions(userId);
 *
 *   return (
 *     <AuditLogTable
 *       logs={logs}
 *       columns={['timestamp', 'action', 'permission', 'result']}
 *     />
 *   );
 * }
 * ```
 */
export function useAuditPermissions(userId?: string, options?: { limit?: number; offset?: number }) {
  const [logs, setLogs] = useState<PermissionAuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [total, setTotal] = useState(0);

  const fetchAuditLogs = useCallback(async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (userId) params.append('userId', userId);
      if (options?.limit) params.append('limit', options.limit.toString());
      if (options?.offset) params.append('offset', options.offset.toString());

      const response = await fetch(`/api/permissions/audit?${params}`);
      if (!response.ok) throw new Error('Failed to fetch audit logs');

      const data = await response.json();
      setLogs(data.logs || []);
      setTotal(data.total || 0);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  }, [userId, options?.limit, options?.offset]);

  useEffect(() => {
    fetchAuditLogs();
  }, [fetchAuditLogs]);

  const logPermissionCheck = useCallback(
    async (
      action: PermissionAction,
      resource: ResourceType,
      result: 'success' | 'failure',
      reason?: string
    ) => {
      try {
        await fetch('/api/permissions/audit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            action: 'check',
            permission: { action, resource },
            result,
            reason,
            timestamp: new Date(),
          }),
        });
      } catch (err) {
        console.error('Failed to log permission check:', err);
      }
    },
    [userId]
  );

  return {
    logs,
    total,
    isLoading,
    error,
    refresh: fetchAuditLogs,
    logPermissionCheck,
  };
}

/**
 * Hook for viewing permission change history
 *
 * @example
 * ```tsx
 * function PermissionHistory({ userId }) {
 *   const { history, isLoading } = usePermissionHistory(userId);
 *
 *   return (
 *     <Timeline>
 *       {history.map(entry => (
 *         <TimelineEntry key={entry.id} entry={entry} />
 *       ))}
 *     </Timeline>
 *   );
 * }
 * ```
 */
export function usePermissionHistory(userId?: string, resourceId?: string) {
  const [history, setHistory] = useState<PermissionAuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchHistory = useCallback(async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (userId) params.append('userId', userId);
      if (resourceId) params.append('resourceId', resourceId);

      const response = await fetch(`/api/permissions/history?${params}`);
      if (!response.ok) throw new Error('Failed to fetch permission history');

      const data = await response.json();
      setHistory(data.history || []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  }, [userId, resourceId]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const grantEvents = useMemo(() => {
    return history.filter((h) => h.action === 'grant');
  }, [history]);

  const revokeEvents = useMemo(() => {
    return history.filter((h) => h.action === 'revoke');
  }, [history]);

  return {
    history,
    grantEvents,
    revokeEvents,
    isLoading,
    error,
    refresh: fetchHistory,
  };
}

/* ========================================================================
   UTILITY FUNCTIONS
   ======================================================================== */

/**
 * Evaluate permission conditions
 *
 * @param conditions - Array of permission conditions
 * @param context - Context object with values to check
 * @returns Whether all conditions are met
 *
 * @example
 * ```ts
 * const allowed = evaluatePermissionConditions(
 *   [{ field: 'department', operator: 'equals', value: 'engineering' }],
 *   { department: 'engineering' }
 * );
 * ```
 */
export function evaluatePermissionConditions(
  conditions: PermissionCondition[],
  context: Record<string, any>
): boolean {
  if (!conditions || conditions.length === 0) return true;

  return conditions.every((condition, index) => {
    const { field, operator, value, logic = 'AND' } = condition;
    const contextValue = context[field];

    let result = false;

    switch (operator) {
      case 'equals':
        result = contextValue === value;
        break;
      case 'notEquals':
        result = contextValue !== value;
        break;
      case 'contains':
        result = Array.isArray(contextValue) ? contextValue.includes(value) : false;
        break;
      case 'greaterThan':
        result = contextValue > value;
        break;
      case 'lessThan':
        result = contextValue < value;
        break;
      case 'in':
        result = Array.isArray(value) ? value.includes(contextValue) : false;
        break;
      case 'notIn':
        result = Array.isArray(value) ? !value.includes(contextValue) : true;
        break;
      default:
        result = false;
    }

    // Handle logic for chaining conditions
    if (index > 0 && logic === 'OR') {
      return result; // OR logic - any true condition passes
    }

    return result; // AND logic - all conditions must pass
  });
}

/**
 * Merge permissions from multiple roles
 *
 * @param roles - Array of roles to merge
 * @returns Deduplicated array of permissions
 *
 * @example
 * ```ts
 * const allPermissions = mergeRolePermissions([adminRole, editorRole]);
 * ```
 */
export function mergeRolePermissions(roles: Role[]): Permission[] {
  const permissionMap = new Map<string, Permission>();

  roles.forEach((role) => {
    role.permissions.forEach((permission) => {
      const key = `${permission.action}:${permission.resource}:${permission.scope}`;
      if (!permissionMap.has(key)) {
        permissionMap.set(key, permission);
      }
    });
  });

  return Array.from(permissionMap.values());
}

/**
 * Check if a role has a specific permission
 *
 * @param role - Role to check
 * @param action - Action to check for
 * @param resource - Resource to check for
 * @returns Whether the role has the permission
 *
 * @example
 * ```ts
 * const canEdit = roleHasPermission(editorRole, 'update', 'documents');
 * ```
 */
export function roleHasPermission(
  role: Role,
  action: PermissionAction,
  resource: ResourceType
): boolean {
  return role.permissions.some((p) => p.action === action && p.resource === resource);
}

/**
 * Get the highest priority role from an array
 *
 * @param roles - Array of roles
 * @returns Role with highest level
 *
 * @example
 * ```ts
 * const primaryRole = getHighestPriorityRole(userRoles);
 * ```
 */
export function getHighestPriorityRole(roles: Role[]): Role | null {
  if (roles.length === 0) return null;

  const roleLevelPriority: Record<RoleLevel, number> = {
    super_admin: 5,
    admin: 4,
    manager: 3,
    member: 2,
    guest: 1,
  };

  return roles.reduce((highest, current) => {
    const highestPriority = roleLevelPriority[highest.level] || 0;
    const currentPriority = roleLevelPriority[current.level] || 0;
    return currentPriority > highestPriority ? current : highest;
  });
}

/**
 * Format permission for display
 *
 * @param permission - Permission to format
 * @returns Human-readable permission string
 *
 * @example
 * ```ts
 * const display = formatPermission(permission);
 * // "Can update documents at team level"
 * ```
 */
export function formatPermission(permission: Permission): string {
  const { action, resource, scope } = permission;
  return `Can ${action} ${resource} at ${scope} level`;
}

/**
 * Check if a permission is expired
 *
 * @param assignment - Role assignment to check
 * @returns Whether the assignment is expired
 *
 * @example
 * ```ts
 * if (isPermissionExpired(assignment)) {
 *   console.log('Permission has expired');
 * }
 * ```
 */
export function isPermissionExpired(assignment: RoleAssignment | TemporaryAccess): boolean {
  if (!assignment.expiresAt) return false;
  return new Date(assignment.expiresAt) < new Date();
}

/* ========================================================================
   EXPORT ALL
   ======================================================================== */

export default {
  // Core hooks
  usePermissions,
  useRole,
  useAccess,

  // Action permission hooks
  useCanEdit,
  useCanDelete,
  useCanPublish,
  useCanCreate,
  useCanRead,
  useCanApprove,
  useCanManage,

  // Components
  PermissionChecker,
  AccessControl,
  RoleGuard,

  // Role management
  useRoleManager,
  useRoleAssignment,
  useRoleInheritance,

  // Permission management
  usePermissionMatrix,
  usePermissionEditor,

  // CRUD operations
  useCreateRole,
  useUpdateRole,
  useDeleteRole,

  // Grant/Revoke
  useGrantPermission,
  useRevokePermission,

  // Resource & Action permissions
  useResourcePermissions,
  useActionPermissions,

  // Team & Department
  useTeamPermissions,
  useDepartmentRoles,

  // Ownership
  useOwnershipCheck,
  useCreatorPermissions,

  // Temporary & Time-based
  useTemporaryAccess,
  useTimeBasedPermission,

  // Groups & Bulk
  usePermissionGroups,
  useBulkPermissions,

  // Audit & History
  useAuditPermissions,
  usePermissionHistory,

  // Utilities
  evaluatePermissionConditions,
  mergeRolePermissions,
  roleHasPermission,
  getHighestPriorityRole,
  formatPermission,
  isPermissionExpired,
};
