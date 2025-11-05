/**
 * @fileoverview Authentication Server Actions - Barrel Export File
 * @module lib/actions/auth.actions
 *
 * Central export point for all authentication-related server actions.
 * This file re-exports functionality from specialized modules:
 * - auth.types: TypeScript types
 * - auth.constants: Constants and validation schemas
 * - auth.login: Login operations and session creation (marked with 'use server')
 * - auth.password: Password change and reset operations (marked with 'use server')
 * - auth.session: Session verification and logout (marked with 'use server')
 *
 * Features:
 * - HIPAA-compliant server actions
 * - Next.js cache integration with revalidateTag/revalidatePath
 * - Comprehensive audit logging
 * - Type-safe operations
 * - Form data handling for UI integration
 *
 * NOTE: This file does NOT have 'use server' at the file level to allow imports
 * from both Client and Server Components. Individual modules have their own
 * 'use server' directives to mark functions as server actions.
 *
 * Usage:
 * ```typescript
 * // Import server actions and types
 * import { loginAction, logoutAction, type User } from '@/lib/actions/auth.actions';
 * 
 * // Import constants and schemas separately for client components
 * import { AUTH_CACHE_TAGS, loginSchema } from '@/lib/actions/auth.constants';
 * ```
 */

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

// NOTE: Constants and schemas are NOT re-exported to avoid "use server" restrictions.
// Import directly from './auth.constants' when needed:
// import { AUTH_CACHE_TAGS, loginSchema, changePasswordSchema } from '@/lib/actions/auth.constants';

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
