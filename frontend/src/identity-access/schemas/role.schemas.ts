/**
 * @fileoverview Validation schemas for role and permission management
 * @module schemas/role
 *
 * Barrel export for role CRUD, permission assignment, hierarchy management,
 * and bulk operations.
 */

// Base schemas and enums
export {
  permissionResourceEnum,
  permissionActionEnum,
  permissionScopeEnum,
  permissionSchema,
  roleTypeEnum,
  roleStatusEnum,
  type Permission,
} from './role.base.schemas';

// CRUD operations
export {
  createRoleSchema,
  updateRoleSchema,
  deleteRoleSchema,
  cloneRoleSchema,
  type CreateRoleInput,
  type UpdateRoleInput,
  type DeleteRoleInput,
  type CloneRoleInput,
} from './role.crud.schemas';

// Permission management
export {
  assignPermissionsSchema,
  removePermissionsSchema,
  getEffectivePermissionsSchema,
  validatePermissionSchema,
  createCustomPermissionSchema,
  detectPermissionConflictsSchema,
  getPermissionMatrixSchema,
  type AssignPermissionsInput,
  type RemovePermissionsInput,
  type GetEffectivePermissionsInput,
  type ValidatePermissionInput,
  type CreateCustomPermissionInput,
  type DetectPermissionConflictsInput,
  type GetPermissionMatrixInput,
} from './role.permissions.schemas';

// Operations and utilities
export {
  updateRoleHierarchySchema,
  getRoleHierarchySchema,
  searchRolesSchema,
  getRoleUsersSchema,
  bulkAssignRoleSchema,
  bulkRemoveRoleSchema,
  exportRolesSchema,
  exportPermissionsSchema,
  type UpdateRoleHierarchyInput,
  type GetRoleHierarchyInput,
  type SearchRolesInput,
  type GetRoleUsersInput,
  type BulkAssignRoleInput,
  type BulkRemoveRoleInput,
  type ExportRolesInput,
  type ExportPermissionsInput,
} from './role.operations.schemas';
