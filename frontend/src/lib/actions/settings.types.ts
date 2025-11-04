/**
 * @fileoverview Type Definitions for Settings Actions
 * @module lib/actions/settings.types
 *
 * Shared TypeScript types and interfaces for settings management.
 * These types ensure type safety across all settings-related actions.
 */

/**
 * Standard result type for server actions
 * Follows Next.js v16 App Router conventions for form actions
 */
export interface ActionResult<T = unknown> {
  /** Indicates if the action was successful */
  success?: boolean;
  /** Optional data payload returned from the action */
  data?: T;
  /** Field-level validation errors */
  errors?: Record<string, string[]> & {
    /** Form-level errors not tied to specific fields */
    _form?: string[];
  };
  /** Human-readable message about the action result */
  message?: string;
}

/**
 * Authenticated user session data
 * Contains essential user information from the auth token
 */
export interface AuthenticatedUser {
  /** Unique user identifier */
  id: string;
  /** User's email address */
  email: string;
  /** User's role in the system */
  role: string;
  /** Whether MFA is enabled for this user */
  mfaEnabled: boolean;
}

/**
 * Audit context for tracking user actions
 * Used for HIPAA compliance and security auditing
 */
export interface AuditContext {
  /** User ID performing the action */
  userId: string | null;
  /** IP address of the request */
  ipAddress: string | null;
  /** User agent string from the request */
  userAgent: string | null;
}

/**
 * Re-export schema types for convenience
 * These are imported from the schemas module
 */
export type {
  UpdateProfileInput,
  ChangePasswordInput,
} from '@/schemas/settings.schemas';
