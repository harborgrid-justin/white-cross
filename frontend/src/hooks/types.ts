/**
 * Hooks Type Definitions
 *
 * Central type definitions for React hooks used throughout the application.
 * Re-exports entity types and shared types while providing core authentication types.
 *
 * @module hooks/types
 *
 * @remarks
 * This file serves as the main entry point for hook-related types. It aggregates
 * types from various sources to provide a single import location for consumers.
 *
 * @example
 * ```typescript
 * import { User, AuthState } from '@/hooks/types';
 *
 * const user: User = {
 *   id: 'user-123',
 *   email: 'nurse@school.edu',
 *   name: 'Jane Doe, RN',
 *   role: 'SCHOOL_NURSE',
 *   permissions: ['students.read', 'medications.admin']
 * };
 * ```
 *
 * @see {@link ./types/entityTypes} for domain entity types
 * @see {@link ./shared/types} for shared utility types
 *
 * @since 1.0.0
 */

// Re-export entity types (students, medications, etc.)
export * from './types/entityTypes';

// Re-export shared utility types
export * from './shared/types';

/**
 * User entity representing an authenticated application user.
 *
 * @interface User
 *
 * @property {string} id - Unique user identifier
 * @property {string} email - User's email address (used for authentication)
 * @property {string} name - User's full name (e.g., "Jane Doe, RN")
 * @property {string} role - User's role (SCHOOL_NURSE, ADMIN, DISTRICT_ADMIN)
 * @property {string[]} permissions - Array of permission strings for RBAC
 *
 * @example
 * ```typescript
 * const nurse: User = {
 *   id: 'user-abc123',
 *   email: 'jane.doe@school.edu',
 *   name: 'Jane Doe, RN',
 *   role: 'SCHOOL_NURSE',
 *   permissions: [
 *     'students.read',
 *     'students.write',
 *     'medications.read',
 *     'medications.admin',
 *     'health_records.read',
 *     'health_records.write'
 *   ]
 * };
 * ```
 *
 * @remarks
 * **HIPAA Compliance**:
 * - User data is considered PHI and must be handled securely
 * - Access is logged for audit trails
 * - User permissions control access to sensitive healthcare data
 *
 * **Role-Based Access Control (RBAC)**:
 * - Permissions are granular (e.g., 'students.read', 'medications.admin')
 * - Roles determine default permission sets
 * - Custom permissions can be assigned per user
 *
 * @see {@link AuthState} for authentication state including user
 */
export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  permissions: string[];
}

/**
 * Authentication state for the application.
 *
 * Represents the current authentication status including the authenticated user,
 * loading states, and JWT token. Used by authentication hooks and Redux store.
 *
 * @interface AuthState
 *
 * @property {User | null} user - Currently authenticated user (null if not authenticated)
 * @property {boolean} isAuthenticated - True if user is authenticated with valid token
 * @property {boolean} isLoading - True while checking authentication status or logging in
 * @property {string} [token] - JWT authentication token (stored securely)
 *
 * @example
 * ```typescript
 * // Initial state - not authenticated
 * const initialState: AuthState = {
 *   user: null,
 *   isAuthenticated: false,
 *   isLoading: false,
 *   token: undefined
 * };
 *
 * // Loading state - checking authentication
 * const loadingState: AuthState = {
 *   user: null,
 *   isAuthenticated: false,
 *   isLoading: true,
 *   token: undefined
 * };
 *
 * // Authenticated state
 * const authenticatedState: AuthState = {
 *   user: {
 *     id: 'user-123',
 *     email: 'nurse@school.edu',
 *     name: 'Jane Doe, RN',
 *     role: 'SCHOOL_NURSE',
 *     permissions: ['students.read', 'medications.admin']
 *   },
 *   isAuthenticated: true,
 *   isLoading: false,
 *   token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
 * };
 * ```
 *
 * @example
 * ```typescript
 * // Using in authentication hook
 * function useAuth(): AuthState {
 *   const user = useAppSelector((state) => state.auth.user);
 *   const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
 *   const isLoading = useAppSelector((state) => state.auth.isLoading);
 *   const token = useAppSelector((state) => state.auth.token);
 *
 *   return { user, isAuthenticated, isLoading, token };
 * }
 * ```
 *
 * @remarks
 * **State Management**:
 * - Stored in Redux for global access
 * - Token persisted to localStorage (encrypted)
 * - User data cached but not persisted (security)
 *
 * **Security**:
 * - Token is JWT with expiration
 * - Token validated on each protected API request
 * - Automatic logout on token expiration
 * - User re-authenticated on app reload if token valid
 *
 * @see {@link User} for user entity structure
 * @see {@link useAuth} for authentication hook
 */
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token?: string;
}
