/**
 * @fileoverview User validation schemas barrel export
 * @module schemas/user
 *
 * Central export point for all user-related Zod validation schemas.
 * This file maintains backward compatibility by re-exporting all schemas
 * from their respective modular files.
 *
 * Module organization:
 * - user.base.schemas: Core primitives (email, password, enums)
 * - user.create.schemas: User creation and deletion
 * - user.profile.schemas: Profile updates and status management
 * - user.auth.schemas: Authentication, MFA, sessions, IP restrictions
 * - user.role.schemas: Role and permission management
 * - user.query.schemas: Search, filtering, bulk ops, exports
 */

// ==========================================
// BASE SCHEMAS & PRIMITIVES
// ==========================================

export {
  // Primitive validation schemas
  passwordSchema,
  emailSchema,
  phoneSchema,
  ipAddressSchema,

  // Enum schemas
  userRoleEnum,
  userStatusEnum,
  mfaMethodEnum,

  // Base types
  type UserRole,
  type UserStatus,
  type MFAMethod,
} from './user.base.schemas';

// ==========================================
// USER CREATION & DELETION SCHEMAS
// ==========================================

export {
  // Create user
  createUserSchema,
  type CreateUserInput,

  // Delete user
  deleteUserSchema,
  type DeleteUserInput,

  // Bulk delete
  bulkDeleteUsersSchema,
  type BulkDeleteUsersInput,
} from './user.create.schemas';

// ==========================================
// USER PROFILE & STATUS SCHEMAS
// ==========================================

export {
  // Update user
  updateUserSchema,
  type UpdateUserInput,

  // Status management
  toggleUserStatusSchema,
  type ToggleUserStatusInput,
  suspendUserSchema,
  type SuspendUserInput,

  // Bulk updates
  bulkUpdateUsersSchema,
  type BulkUpdateUsersInput,
} from './user.profile.schemas';

// ==========================================
// AUTHENTICATION & SECURITY SCHEMAS
// ==========================================

export {
  // Password management
  resetUserPasswordSchema,
  type ResetUserPasswordInput,
  resetPasswordSchema,
  type ResetPasswordInput,

  // MFA schemas
  setupMFASchema,
  type SetupMFAInput,
  enableMFASchema,
  type EnableMFAInput,
  verifyMFASchema,
  type VerifyMFAInput,
  disableMFASchema,
  type DisableMFAInput,

  // IP restrictions
  updateIPRestrictionsSchema,
  type UpdateIPRestrictionsInput,
  removeIPRestrictionsSchema,
  type RemoveIPRestrictionsInput,

  // Session management
  getUserSessionsSchema,
  type GetUserSessionsInput,
  revokeUserSessionSchema,
  type RevokeUserSessionInput,
  revokeAllUserSessionsSchema,
  type RevokeAllUserSessionsInput,
} from './user.auth.schemas';

// ==========================================
// ROLE & PERMISSION SCHEMAS
// ==========================================

export {
  // Role assignment
  assignRoleSchema,
  type AssignRoleInput,
  removeRoleSchema,
  type RemoveRoleInput,

  // Permissions
  permissionSchema,
  type Permission,
  updateUserPermissionsSchema,
  type UpdateUserPermissionsInput,

  // Permission enums
  permissionActionEnum,
  permissionScopeEnum,
  type PermissionAction,
  type PermissionScope,
} from './user.role.schemas';

// ==========================================
// QUERY, SEARCH & EXPORT SCHEMAS
// ==========================================

export {
  // Search and filter
  searchUsersSchema,
  type SearchUsersInput,
  userSortFieldEnum,
  sortOrderEnum,
  type UserSortField,
  type SortOrder,

  // Activity logs
  getUserActivitySchema,
  type GetUserActivityInput,

  // Export
  exportUsersSchema,
  type ExportUsersInput,
  exportFormatEnum,
  type ExportFormat,
} from './user.query.schemas';
