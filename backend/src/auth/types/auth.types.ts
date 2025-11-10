/**
 * Authentication Type Definitions
 *
 * Centralized type definitions for authentication-related interfaces
 * to ensure type safety across the auth module.
 */

import { UserRole } from '@/database/types/user-role.enum';

/**
 * Safe user object returned from User.toSafeObject()
 * Excludes sensitive fields like passwords and secrets
 */
export interface SafeUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  lastLogin?: Date | null;
  schoolId?: string | null;
  districtId?: string | null;
  phone?: string | null;
  emailVerified: boolean;
  passwordChangedAt?: Date | null;
  twoFactorEnabled: boolean;
  failedLoginAttempts: number;
  lockoutUntil?: Date | null;
  lastPasswordChange?: Date | null;
  mustChangePassword: boolean;
  mfaEnabled: boolean;
  mfaEnabledAt?: Date | null;
  oauthProvider?: string | null;
  oauthProviderId?: string | null;
  profilePictureUrl?: string | null;
  isEmailVerified: boolean;
  emailVerifiedAt?: Date | null;
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Decoded JWT token payload structure
 */
export interface DecodedToken {
  sub?: string;
  id?: string;
  email?: string;
  iat?: number;
  exp?: number;
  [key: string]: unknown;
}

/**
 * HTTP Request with authorization headers
 */
export interface RequestWithAuth {
  headers: {
    authorization?: string;
    [key: string]: string | string[] | undefined;
  };
  user?: SafeUser;
  [key: string]: unknown;
}

/**
 * Google OAuth Profile from passport-google-oauth20
 */
export interface GooglePassportProfile {
  id: string;
  displayName: string;
  name?: {
    familyName?: string;
    givenName?: string;
  };
  emails?: Array<{ value: string; verified?: boolean }>;
  photos?: Array<{ value: string }>;
  provider: string;
  _raw?: string;
  _json?: Record<string, unknown>;
}

/**
 * Microsoft OAuth Profile from passport-microsoft
 */
export interface MicrosoftPassportProfile {
  id: string;
  displayName: string;
  name?: {
    familyName?: string;
    givenName?: string;
  };
  emails?: Array<{ value: string }>;
  photos?: Array<{ value: string }>;
  userPrincipalName?: string;
  provider: string;
  _raw?: string;
  _json?: Record<string, unknown>;
}

/**
 * Generic OAuth done callback
 */
export type OAuthDoneCallback = (error: Error | null, user?: unknown, info?: unknown) => void;

/**
 * Extend Express namespace to include our User type
 */
declare global {
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface User extends SafeUser {}
  }
}
