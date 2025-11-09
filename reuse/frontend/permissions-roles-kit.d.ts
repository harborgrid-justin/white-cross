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
/**
 * Permission action types
 */
export type PermissionAction = 'create' | 'read' | 'update' | 'delete' | 'publish' | 'approve' | 'execute' | 'manage' | 'admin' | string;
/**
 * Resource types for permission checks
 */
export type ResourceType = 'documents' | 'users' | 'projects' | 'reports' | 'settings' | 'billing' | 'analytics' | string;
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
    inheritsFrom?: string[];
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
    scopeId?: string;
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
    resourceOwnership?: Record<string, string>;
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
    cacheTTL?: number;
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
    hasAnyPermission: (permissions: Array<{
        action: PermissionAction;
        resource: ResourceType;
    }>) => boolean;
    hasAllPermissions: (permissions: Array<{
        action: PermissionAction;
        resource: ResourceType;
    }>) => boolean;
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
export declare function usePermissions(userId?: string, options?: UsePermissionOptions): UsePermissionsReturn;
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
export declare function useRole(userId?: string, roleId?: string): UseRoleReturn;
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
export declare function useAccess(resource: ResourceType, action: PermissionAction, resourceId?: string, userId?: string): boolean;
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
export declare function useCanEdit(resource: ResourceType, resourceId?: string, userId?: string): boolean;
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
export declare function useCanDelete(resource: ResourceType, resourceId?: string, userId?: string): boolean;
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
export declare function useCanPublish(resource: ResourceType, resourceId?: string, userId?: string): boolean;
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
export declare function useCanCreate(resource: ResourceType, userId?: string): boolean;
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
export declare function useCanRead(resource: ResourceType, resourceId?: string, userId?: string): boolean;
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
export declare function useCanApprove(resource: ResourceType, resourceId?: string, userId?: string): boolean;
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
export declare function useCanManage(resource: ResourceType, resourceId?: string, userId?: string): boolean;
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
export declare function PermissionChecker({ action, resource, resourceId, userId, children, fallback, onDenied, }: PermissionCheckerProps): JSX.Element | null;
/**
 * Access control component props
 */
export interface AccessControlProps {
    permissions: Array<{
        action: PermissionAction;
        resource: ResourceType;
    }>;
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
export declare function AccessControl({ permissions: requiredPermissions, requireAll, userId, children, fallback, }: AccessControlProps): JSX.Element | null;
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
export declare function RoleGuard({ roles: requiredRoles, requireAll, userId, children, fallback, }: RoleGuardProps): JSX.Element | null;
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
export declare function useRoleManager(): {
    roles: any;
    isLoading: any;
    error: any;
    fetchRoles: any;
    createRole: any;
    updateRole: any;
    deleteRole: any;
    assignRole: any;
    revokeRole: any;
};
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
export declare function useRoleAssignment(userId?: string): {
    assignments: any;
    isLoading: any;
    error: any;
    fetchAssignments: any;
    assign: any;
    revoke: any;
};
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
export declare function useRoleInheritance(roleId?: string): {
    parentRoles: any;
    childRoles: any;
    isLoading: any;
    error: any;
    fetchInheritance: any;
    addParent: any;
    removeParent: any;
};
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
export declare function usePermissionMatrix(resourceType: ResourceType, resourceId?: string): {
    matrix: any;
    isLoading: any;
    error: any;
    fetchMatrix: any;
    updateMatrix: any;
};
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
export declare function usePermissionEditor(roleId?: string): {
    permissions: any;
    isLoading: any;
    error: any;
    fetchPermissions: any;
    addPermission: any;
    removePermission: any;
    updatePermission: any;
};
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
export declare function useCreateRole(): {
    createRole: any;
    isLoading: any;
    error: any;
};
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
export declare function useUpdateRole(): {
    updateRole: any;
    isLoading: any;
    error: any;
};
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
export declare function useDeleteRole(): {
    deleteRole: any;
    isLoading: any;
    error: any;
};
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
export declare function useGrantPermission(): {
    grantPermission: any;
    isLoading: any;
    error: any;
};
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
export declare function useRevokePermission(): {
    revokePermission: any;
    isLoading: any;
    error: any;
};
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
export declare function useResourcePermissions(resource: ResourceType, resourceId: string, userId?: string): {
    permissions: any;
    isLoading: any;
    error: any;
    refresh: any;
    canCreate: any;
    canRead: any;
    canEdit: any;
    canDelete: any;
    canPublish: any;
    canApprove: any;
    canManage: any;
    hasAction: any;
};
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
export declare function useActionPermissions(action: PermissionAction, userId?: string): {
    resources: any;
    isLoading: boolean;
    error: Error | null;
    canPerformOn: any;
};
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
export declare function useTeamPermissions(teamId: string, userId?: string): {
    permissions: any;
    members: any;
    isLoading: any;
    error: any;
    refresh: any;
    canManageTeam: any;
    canInviteMembers: any;
};
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
export declare function useDepartmentRoles(departmentId: string): {
    roles: any;
    isLoading: any;
    error: any;
    refresh: any;
    assignRole: any;
    revokeRole: any;
};
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
export declare function useOwnershipCheck(resourceId: string, ownerId: string, userId?: string): boolean;
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
export declare function useCreatorPermissions(resourceId: string, userId?: string): {
    isCreator: any;
    creatorPermissions: any;
    isLoading: any;
    error: any;
};
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
export declare function useTemporaryAccess(userId?: string): {
    grants: any;
    activeGrants: any;
    isLoading: any;
    error: any;
    refresh: any;
    grantTemporaryAccess: any;
    revokeAccess: any;
};
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
export declare function useTimeBasedPermission(action: PermissionAction, resource: ResourceType, resourceId?: string, timeConstraints?: {
    afterTime?: Date;
    beforeTime?: Date;
}, userId?: string): boolean;
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
export declare function usePermissionGroups(): {
    groups: any;
    isLoading: any;
    error: any;
    refresh: any;
    createGroup: any;
    assignGroup: any;
    removeGroup: any;
};
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
export declare function useBulkPermissions(): {
    isLoading: any;
    error: any;
    results: any;
    grantBulkPermissions: any;
    revokeBulkPermissions: any;
    assignBulkRoles: any;
};
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
export declare function useAuditPermissions(userId?: string, options?: {
    limit?: number;
    offset?: number;
}): {
    logs: any;
    total: any;
    isLoading: any;
    error: any;
    refresh: any;
    logPermissionCheck: any;
};
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
export declare function usePermissionHistory(userId?: string, resourceId?: string): {
    history: any;
    grantEvents: any;
    revokeEvents: any;
    isLoading: any;
    error: any;
    refresh: any;
};
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
export declare function evaluatePermissionConditions(conditions: PermissionCondition[], context: Record<string, any>): boolean;
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
export declare function mergeRolePermissions(roles: Role[]): Permission[];
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
export declare function roleHasPermission(role: Role, action: PermissionAction, resource: ResourceType): boolean;
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
export declare function getHighestPriorityRole(roles: Role[]): Role | null;
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
export declare function formatPermission(permission: Permission): string;
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
export declare function isPermissionExpired(assignment: RoleAssignment | TemporaryAccess): boolean;
declare const _default: {
    usePermissions: typeof usePermissions;
    useRole: typeof useRole;
    useAccess: typeof useAccess;
    useCanEdit: typeof useCanEdit;
    useCanDelete: typeof useCanDelete;
    useCanPublish: typeof useCanPublish;
    useCanCreate: typeof useCanCreate;
    useCanRead: typeof useCanRead;
    useCanApprove: typeof useCanApprove;
    useCanManage: typeof useCanManage;
    PermissionChecker: typeof PermissionChecker;
    AccessControl: typeof AccessControl;
    RoleGuard: typeof RoleGuard;
    useRoleManager: typeof useRoleManager;
    useRoleAssignment: typeof useRoleAssignment;
    useRoleInheritance: typeof useRoleInheritance;
    usePermissionMatrix: typeof usePermissionMatrix;
    usePermissionEditor: typeof usePermissionEditor;
    useCreateRole: typeof useCreateRole;
    useUpdateRole: typeof useUpdateRole;
    useDeleteRole: typeof useDeleteRole;
    useGrantPermission: typeof useGrantPermission;
    useRevokePermission: typeof useRevokePermission;
    useResourcePermissions: typeof useResourcePermissions;
    useActionPermissions: typeof useActionPermissions;
    useTeamPermissions: typeof useTeamPermissions;
    useDepartmentRoles: typeof useDepartmentRoles;
    useOwnershipCheck: typeof useOwnershipCheck;
    useCreatorPermissions: typeof useCreatorPermissions;
    useTemporaryAccess: typeof useTemporaryAccess;
    useTimeBasedPermission: typeof useTimeBasedPermission;
    usePermissionGroups: typeof usePermissionGroups;
    useBulkPermissions: typeof useBulkPermissions;
    useAuditPermissions: typeof useAuditPermissions;
    usePermissionHistory: typeof usePermissionHistory;
    evaluatePermissionConditions: typeof evaluatePermissionConditions;
    mergeRolePermissions: typeof mergeRolePermissions;
    roleHasPermission: typeof roleHasPermission;
    getHighestPriorityRole: typeof getHighestPriorityRole;
    formatPermission: typeof formatPermission;
    isPermissionExpired: typeof isPermissionExpired;
};
export default _default;
//# sourceMappingURL=permissions-roles-kit.d.ts.map