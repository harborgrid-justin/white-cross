/**
 * @fileoverview Core Middleware Public API
 * @module middleware/core
 * @description Barrel export for all core middleware components.
 */

// Module
export { CoreMiddlewareModule } from './core-middleware.module';

// Guards
export { PermissionsGuard } from './guards/permissions.guard';
export { RbacGuard } from './guards/rbac.guard';

// Pipes
export {
  HealthcareValidationPipe,
  createHealthcareValidationPipe,
  createAdminValidationPipe,
} from './pipes/validation.pipe';

// Middleware
export {
  SessionMiddleware,
  MemorySessionStore,
  createHealthcareSessionMiddleware,
  createAdminSessionMiddleware,
} from './middleware/session.middleware';

// Decorators
export {
  RequirePermissions,
  RequirePermission,
  PERMISSIONS_KEY,
  PERMISSIONS_MODE_KEY,
  type PermissionsMode,
} from './decorators/permissions.decorator';

// Types - RBAC
export {
  UserRole,
  Permission,
  ROLE_HIERARCHY,
  ROLE_PERMISSIONS,
  type AuthorizationResult,
  type RbacConfig,
  type UserProfile,
} from './types/rbac.types';

// Types - Validation
export {
  HEALTHCARE_PATTERNS,
  VALIDATION_CONFIGS,
  type ValidationErrorDetail,
  type ValidationResult,
  type ValidationConfig,
} from './types/validation.types';

// Types - Session
export {
  SESSION_CONFIGS,
  type SessionConfig,
  type SessionData,
  type SessionResult,
  type SessionStore,
} from './types/session.types';
