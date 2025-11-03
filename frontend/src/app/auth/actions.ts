/**
 * @fileoverview Authentication Server Actions - App Router Re-exports
 * @module app/auth/actions
 *
 * This file re-exports authentication server actions from the centralized
 * auth actions module to maintain compatibility with app router structure
 * while following DRY principles and the gold standard architecture.
 *
 * **Architecture Pattern:**
 * - Centralized logic in `/lib/actions/auth.actions.ts`
 * - App router compatibility via re-exports
 * - Single source of truth for authentication
 * - Consistent API across the application
 *
 * **Usage:**
 * ```typescript
 * import { loginAction, logoutAction } from '@/app/auth/actions';
 * // OR
 * import { loginAction, logoutAction } from '@/lib/actions/auth.actions';
 * ```
 */

'use server';

// Re-export all authentication server actions from the centralized module
export {
  // Main authentication actions
  loginAction,
  logoutAction,
  changePasswordAction,
  requestPasswordResetAction,
  verifySessionAction,
  
  // Types for form state management
  type ActionResult,
  type User,
  type AuthResponse,
  type LoginFormState,
  type ChangePasswordFormState,
} from '@/lib/actions/auth.actions';
