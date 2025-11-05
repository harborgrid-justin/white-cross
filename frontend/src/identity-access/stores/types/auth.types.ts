/**
 * @fileoverview Authentication Type Definitions
 * @module stores/types/auth
 * 
 * Comprehensive type definitions for the authentication system including
 * user credentials, session management, and authentication responses.
 * 
 * Enterprise-grade type safety for healthcare compliance and security.
 */

// ==========================================
// CORE AUTHENTICATION TYPES
// ==========================================

/**
 * User role enumeration for role-based access control
 * Aligned with global UserRole type from types/core/common.ts
 */
export type UserRole = 'ADMIN' | 'NURSE' | 'SCHOOL_ADMIN' | 'DISTRICT_ADMIN' | 'VIEWER' | 'COUNSELOR';

/**
 * User entity representing an authenticated user
 * Aligned with global User interface from types/core/common.ts for WritableDraft compatibility
 */
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  permissions?: string[]; // Optional array for RBAC, compatible with WritableDraft
  user?: unknown; // Optional nested user data for complex authentication scenarios
  isActive: boolean;
  lastLogin?: string;
  schoolId?: string;
  districtId?: string;
  phone?: string;
  emailVerified: boolean; // Aligned with global User (not isEmailVerified)  
  twoFactorEnabled: boolean;
  lockoutUntil?: string;
  lastPasswordChange?: string;
  mustChangePassword: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Login credentials interface
 */
export interface LoginCredentials {
  readonly email: string;
  readonly password: string;
  readonly rememberMe?: boolean;
}

/**
 * Registration data interface
 */
export interface RegisterData {
  readonly email: string;
  readonly password: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly role: UserRole;
  readonly schoolId?: string;
  readonly districtId?: string;
  readonly phone?: string;
}

/**
 * Authentication response from login/register
 */
export interface AuthResponse {
  readonly user: User;
  readonly token: string;
  readonly refreshToken: string;
  readonly expiresIn: number;
}

/**
 * Token refresh response
 */
export interface RefreshTokenResponse {
  readonly token: string;
  readonly refreshToken: string;
  readonly expiresIn: number;
}

/**
 * Password reset request
 */
export interface ForgotPasswordRequest {
  readonly email: string;
}

/**
 * Password reset data
 */
export interface ResetPasswordData {
  readonly token: string;
  readonly password: string;
  readonly confirmPassword: string;
}

/**
 * Change password data
 */
export interface ChangePasswordData {
  readonly currentPassword: string;
  readonly newPassword: string;
  readonly confirmPassword: string;
}

/**
 * Email verification data
 */
export interface EmailVerificationData {
  readonly token: string;
}

/**
 * Multi-factor authentication data
 */
export interface MfaData {
  readonly code: string;
  readonly method: 'sms' | 'email' | 'totp';
}

/**
 * OAuth login response
 */
export interface OAuthResponse {
  readonly provider: 'google' | 'microsoft';
  readonly user: User;
  readonly token: string;
  readonly refreshToken: string;
  readonly expiresIn: number;
}

// ==========================================
// STATE MANAGEMENT TYPES
// ==========================================

/**
 * Authentication state interface
 */
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  sessionExpiresAt: number | null;
}

/**
 * Authentication action payloads
 */
export interface LoginPayload {
  readonly user: User;
  readonly token: string;
  readonly expiresIn: number;
}

export interface RegisterPayload {
  readonly user: User;
  readonly token: string;
  readonly expiresIn: number;
}

export interface RefreshPayload {
  readonly user: User;
  readonly token: string;
  readonly expiresIn: number;
}

// ==========================================
// API RESPONSE TYPES
// ==========================================

/**
 * Generic API response wrapper
 */
export interface ApiResponse<T> {
  readonly success: boolean;
  readonly data: T;
  readonly message?: string;
  readonly error?: string;
}

/**
 * Login API response
 */
export interface LoginApiResponse {
  readonly user: User;
  readonly accessToken: string;
  readonly refreshToken: string;
  readonly tokenType: string;
  readonly expiresIn: number;
}

/**
 * Register API response
 */
export interface RegisterApiResponse {
  readonly user: User;
  readonly accessToken: string;
  readonly refreshToken: string;
  readonly tokenType: string;
  readonly expiresIn: number;
}

/**
 * Token verification response
 */
export interface VerifyTokenResponse {
  readonly user: User;
  readonly isValid: boolean;
  readonly expiresAt: number;
}

/**
 * Refresh token API response
 */
export interface RefreshTokenApiResponse {
  readonly accessToken: string;
  readonly refreshToken: string;
  readonly tokenType: string;
  readonly expiresIn: number;
}

/**
 * Password reset request response
 */
export interface ForgotPasswordResponse {
  readonly message: string;
  readonly resetTokenExpires: number;
}

/**
 * Password reset response
 */
export interface ResetPasswordResponse {
  readonly message: string;
  readonly success: boolean;
}

/**
 * User profile response
 */
export interface UserProfileResponse {
  readonly user: User;
}

/**
 * Development users response (dev environment only)
 */
export interface DevUsersResponse {
  readonly users: Array<{
    readonly id: string;
    readonly email: string;
    readonly firstName: string;
    readonly lastName: string;
    readonly role: UserRole;
    readonly password: string;
    readonly displayName: string;
  }>;
}

// ==========================================
// UTILITY TYPES
// ==========================================

/**
 * Extract user fields that can be updated
 */
export type UpdatableUserFields = keyof Pick<User, 'firstName' | 'lastName' | 'email' | 'phone'>;

/**
 * Public user information (no sensitive data)
 */
export type PublicUser = Pick<User, 'id' | 'firstName' | 'lastName' | 'role' | 'isActive'>;

/**
 * User profile form data
 */
export type UserProfileFormData = Pick<User, 'firstName' | 'lastName' | 'email' | 'phone'>;

/**
 * Create a mutable version of readonly types for form handling
 */
export type Mutable<T> = {
  -readonly [K in keyof T]: T[K];
};

/**
 * Extract the data type from an API response
 */
export type ExtractApiData<T> = T extends ApiResponse<infer U> ? U : never;

/**
 * Make specific fields optional
 */
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * Make specific fields required
 */
export type Required<T, K extends keyof T> = T & {
  [P in K]-?: T[P];
};

// ==========================================
// TYPE GUARDS
// ==========================================

/**
 * Type guard for User
 */
export function isUser(obj: unknown): obj is User {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof (obj as User).id === 'string' &&
    typeof (obj as User).email === 'string' &&
    typeof (obj as User).firstName === 'string' &&
    typeof (obj as User).lastName === 'string' &&
    typeof (obj as User).role === 'string' &&
    typeof (obj as User).isActive === 'boolean'
  );
}

/**
 * Type guard for AuthResponse
 */
export function isAuthResponse(obj: unknown): obj is AuthResponse {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    isUser((obj as AuthResponse).user) &&
    typeof (obj as AuthResponse).token === 'string' &&
    typeof (obj as AuthResponse).refreshToken === 'string' &&
    typeof (obj as AuthResponse).expiresIn === 'number'
  );
}

/**
 * Type guard for LoginCredentials
 */
export function isLoginCredentials(obj: unknown): obj is LoginCredentials {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof (obj as LoginCredentials).email === 'string' &&
    typeof (obj as LoginCredentials).password === 'string'
  );
}

/**
 * Type guard for UserRole
 */
export function isUserRole(role: string): role is UserRole {
  return [
    'ADMIN',
    'NURSE',
    'SCHOOL_ADMIN',
    'DISTRICT_ADMIN',
    'VIEWER',
    'COUNSELOR'
  ].includes(role);
}
