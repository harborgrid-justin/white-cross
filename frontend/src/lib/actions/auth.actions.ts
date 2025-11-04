/**
 * @fileoverview Authentication Server Actions - Barrel Export File
 * @module lib/actions/auth.actions
 *
 * Central export point for all authentication-related server actions.
 * This file re-exports functionality from specialized modules:
 * - auth.types: TypeScript types and validation schemas
 * - auth.login: Login operations and session creation
 * - auth.password: Password change and reset operations
 * - auth.session: Session verification and logout
 *
 * Features:
 * - HIPAA-compliant server actions
 * - Next.js cache integration with revalidateTag/revalidatePath
 * - Comprehensive audit logging
 * - Type-safe operations
 * - Form data handling for UI integration
 *
 * Usage:
 * Import any authentication function or type from this file:
 * ```typescript
 * import { loginAction, logoutAction, type User } from '@/lib/actions/auth.actions';
 * ```
 */

'use server';

// ==========================================
// TYPE EXPORTS
// ==========================================

export type {
  ActionResult,
  User,
  AuthResponse,
  LoginFormState,
  ChangePasswordFormState,
} from './auth.types';

export {
  AUTH_CACHE_TAGS,
  loginSchema,
  changePasswordSchema,
} from './auth.types';

// ==========================================
// LOGIN EXPORTS
// ==========================================

export {
  loginAction,
  handleLoginSubmission,
  clearLoginForm,
} from './auth.login';

// ==========================================
// PASSWORD MANAGEMENT EXPORTS
// ==========================================

export {
  changePasswordAction,
  requestPasswordResetAction,
} from './auth.password';

// ==========================================
// SESSION MANAGEMENT EXPORTS
// ==========================================

export {
  logoutAction,
  verifySessionAction,
} from './auth.session';
