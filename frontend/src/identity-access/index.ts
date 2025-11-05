/**
 * @fileoverview Identity Access - Main Barrel Export
 * @module identity-access
 * 
 * Centralized exports for all identity, access control, authentication,
 * authorization, RBAC, and token management functionality.
 * 
 * ## Organization
 * - **stores/**: Redux slices for auth state management
 * - **services/**: API services for authentication
 * - **contexts/**: React context providers for auth and session
 * - **actions/**: Server actions for login, logout, password management
 * - **hooks/**: Custom hooks for auth, permissions, and guards
 * - **utils/**: Token security and permission utilities
 * - **middleware/**: Auth, RBAC, and withAuth HOCs
 * - **schemas/**: Zod validation schemas for roles and permissions
 * - **lib/**: Core permission checking logic and session management
 * 
 * @example
 * ```typescript
 * // Import auth actions
 * import { loginUser, logoutUser } from '@/identity-access';
 * 
 * // Import permission hooks
 * import { usePermissions, useAuthGuard } from '@/identity-access';
 * 
 * // Import token utilities
 * import { validateTokenFormat, isTokenExpired } from '@/identity-access';
 * ```
 */

// ============================================================================
// STORES - Redux State Management
// ============================================================================
export * from './stores/authSlice';

// ============================================================================
// SERVICES - API Integration
// ============================================================================
export * from './services/authApi';

// ============================================================================
// CONTEXTS - React Context Providers
// ============================================================================
export * from './contexts/AuthContext';

// ============================================================================
// ACTIONS - Server Actions
// ============================================================================
export * as AuthActions from './actions';

// ============================================================================
// HOOKS - Custom React Hooks (Namespace Exports to Avoid Conflicts)
// ============================================================================
export * as AuthGuards from './hooks/auth-guards';
export * as AuthPermissions from './hooks/auth-permissions';
export * as AuthPermissionHooks from './hooks/auth-permission-hooks';
export * as PermissionHooks from './hooks/permissions';
export * as PermissionChecks from './hooks/permission-checks';
export * as RoleHooks from './hooks/roles';

// ============================================================================
// UTILS - Utilities (Namespace Exports)
// ============================================================================
export * as TokenSecurity from './utils/tokenSecurity';
export * as TokenValidation from './utils/tokenSecurity.validation';
export * as TokenStorage from './utils/tokenSecurity.storage';
export * as TokenEncryption from './utils/tokenSecurity.encryption';
export * as NavigationPermissions from './utils/navigationUtils.permissions';

// ============================================================================
// MIDDLEWARE - Request/Response Processing
// ============================================================================
export * as RBACMiddleware from './middleware/rbac';

// ============================================================================
// SCHEMAS - Validation Schemas
// ============================================================================
export * as RoleSchemas from './schemas/role.schemas';
export * as RoleCrudSchemas from './schemas/role.crud.schemas';
export * as RoleOperationsSchemas from './schemas/role.operations.schemas';
export * as RolePermissionsSchemas from './schemas/role.permissions.schemas';
export * as UserRoleSchemas from './schemas/user.role.schemas';

// ============================================================================
// LIB - Core Permission Logic
// ============================================================================
export * as PermissionLib from './lib/permissions';
