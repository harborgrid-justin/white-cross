/**
 * @fileoverview Authentication Types and Schemas
 * @module lib/actions/auth.types
 *
 * Shared TypeScript types, interfaces, and validation schemas
 * for authentication-related operations.
 *
 * Features:
 * - Type-safe interfaces for authentication data
 * - Zod validation schemas for form inputs
 * - Cache tag constants
 * - Form state types for UI integration
 */

import { z } from 'zod';

// ==========================================
// CACHE TAGS
// ==========================================

/**
 * Cache tags for authentication operations
 */
export const AUTH_CACHE_TAGS = {
  AUTH: 'auth-data',
} as const;

// ==========================================
// VALIDATION SCHEMAS
// ==========================================

/**
 * Login form validation schema
 */
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

/**
 * Change password form validation schema
 */
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(1, 'Password confirmation is required'),
}).refine((data: { currentPassword: string; newPassword: string; confirmPassword: string }) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

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
