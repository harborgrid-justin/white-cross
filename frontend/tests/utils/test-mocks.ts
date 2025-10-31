/**
 * Common Test Mocks for White Cross Healthcare Platform
 *
 * Provides reusable mock objects and helper functions for testing including:
 * - AuthContext mocks
 * - Router mocks
 * - API response mocks
 *
 * @module tests/utils/test-mocks
 */

import type { User } from '@/stores/slices/authSlice';

/**
 * AuthContextValue type matching the actual context interface
 */
export interface MockAuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  sessionExpiresAt: number | null;
  lastActivityAt: number;
  login: jest.Mock<Promise<void>, [email: string, password: string, rememberMe?: boolean]>;
  logout: jest.Mock<Promise<void>, []>;
  refreshToken: jest.Mock<Promise<void>, []>;
  clearError: jest.Mock<void, []>;
  updateActivity: jest.Mock<void, []>;
  checkSession: jest.Mock<boolean, []>;
  hasRole: jest.Mock<boolean, [role: string | string[]]>;
  hasPermission: jest.Mock<boolean, [permission: string]>;
}

/**
 * Creates a complete mock AuthContext value with all required properties
 *
 * @param overrides - Partial mock properties to override defaults
 * @returns Complete mock AuthContext value
 *
 * @example
 * ```typescript
 * const authContext = createMockAuthContext({
 *   hasPermission: jest.fn((perm) => perm === 'students:edit'),
 *   isAuthenticated: true
 * });
 * ```
 */
export function createMockAuthContext(
  overrides: Partial<MockAuthContextValue> = {}
): MockAuthContextValue {
  return {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    sessionExpiresAt: null,
    lastActivityAt: Date.now(),
    login: jest.fn<Promise<void>, [string, string, boolean?]>(),
    logout: jest.fn<Promise<void>, []>(),
    refreshToken: jest.fn<Promise<void>, []>(),
    clearError: jest.fn<void, []>(),
    updateActivity: jest.fn<void, []>(),
    checkSession: jest.fn<boolean, []>(() => true),
    hasRole: jest.fn<boolean, [string | string[]]>(() => false),
    hasPermission: jest.fn<boolean, [string]>(() => false),
    ...overrides,
  };
}

/**
 * Creates a mock authenticated user
 *
 * @param overrides - Partial user properties to override defaults
 * @returns Mock user object
 */
export function createMockUser(overrides: Partial<User> = {}): User {
  return {
    id: '123e4567-e89b-12d3-a456-426614174000',
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    role: 'nurse',
    permissions: ['students:view', 'medications:administer'],
    ...overrides,
  };
}
