/**
 * @fileoverview Authentication Types
 * @module lib/actions/auth.types
 *
 * Shared TypeScript types and interfaces for authentication-related operations.
 *
 * NOTE: This file contains only TypeScript types and interfaces.
 * Constants and validation schemas have been moved to auth.constants.ts
 * to avoid "use server" bundling restrictions.
 */

// ==========================================
// CORE TYPES
// ==========================================

/**
 * Generic action result wrapper
 */
export interface ActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * User entity
 */
export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  [key: string]: any;
}

/**
 * Authentication response from login endpoint
 */
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
  tokenType: string;
  expiresIn: number;
}

// ==========================================
// FORM STATE TYPES
// ==========================================

/**
 * Login form state for UI integration
 */
export interface LoginFormState {
  errors?: {
    email?: string[];
    password?: string[];
    _form?: string[];
  };
  success?: boolean;
}

/**
 * Change password form state for UI integration
 */
export interface ChangePasswordFormState {
  errors?: {
    currentPassword?: string[];
    newPassword?: string[];
    confirmPassword?: string[];
    _form?: string[];
  };
  success?: boolean;
  message?: string;
}
