/**
 * WF-COMP-124 | navigationGuards.test.tsx - React component or utility module
 * Purpose: react component or utility module
 * Upstream: ./navigationGuards, ../contexts/AuthContext, ../types | Dependencies: react, @testing-library/react, react-router-dom
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: React components/utilities | Key Features: arrow component
 * Last Updated: 2025-10-17 | File Type: .tsx
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

/**
 * Navigation Guards - Test Suite
 *
 * Comprehensive tests for navigation guard system
 *
 * @module navigationGuards.test
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  withAuthGuard,
  withRoleGuard,
  withPermissionGuard,
  withDataGuard,
  withFeatureGuard,
  composeGuards,
  checkPermission,
  checkAnyPermission,
  checkAllPermissions,
  checkRolePermission,
  hasAccessToRoute,
  useUnsavedChanges,
  navigationInterceptorManager,
  RouteMetadata,
  PermissionCheck
} from './navigationGuards';
import { AuthProvider } from '../contexts/AuthContext';
import { User } from '../types';

// Mock components
const TestComponent = () => <div>Test Component</div>;

// Mock user data
const mockAdminUser: User = {
  id: '1',
  email: 'admin@test.com',
  firstName: 'Admin',
  lastName: 'User',
  role: 'ADMIN',
  isActive: true,
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01'
};

const mockNurseUser: User = {
  id: '2',
  email: 'nurse@test.com',
  firstName: 'Nurse',
  lastName: 'User',
  role: 'NURSE',
  isActive: true,
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01'
};

const mockReadOnlyUser: User = {
  id: '3',
  email: 'readonly@test.com',
  firstName: 'ReadOnly',
  lastName: 'User',
  role: 'READ_ONLY',
  isActive: true,
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01'
};

// Mock AuthContext
vi.mock('../contexts/AuthContext', () => ({
  useAuthContext: vi.fn(),
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>
}));

// Mock LoadingSpinner
vi.mock('../components/LoadingSpinner', () => ({
  default: () => <div>Loading...</div>
}));

// Mock AccessDenied
vi.mock('../pages/AccessDenied', () => ({
  default: ({ message }: { message?: string }) => (
    <div>Access Denied{message ? `: ${message}` : ''}</div>
  )
}));

describe('Navigation Guards', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  // ============================================================================
  // AUTH GUARD TESTS
  // ============================================================================

  describe('withAuthGuard', () => {
    it('should render component when user is authenticated', () => {
      const { useAuthContext } = require('../contexts/AuthContext');
      useAuthContext.mockReturnValue({
        user: mockAdminUser,
        loading: false
      });

      const ProtectedComponent = withAuthGuard(TestComponent);

      render(
        <MemoryRouter>
          <ProtectedComponent />
        </MemoryRouter>
      );

      expect(screen.getByText('Test Component')).toBeInTheDocument();
    });

    it('should show loading spinner while loading', () => {
      const { useAuthContext } = require('../contexts/AuthContext');
      useAuthContext.mockReturnValue({
        user: null,
        loading: true
      });

      const ProtectedComponent = withAuthGuard(TestComponent);

      render(
        <MemoryRouter>
          <ProtectedComponent />
        </MemoryRouter>
      );

      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should redirect to login when user is not authenticated', () => {
      const { useAuthContext } = require('../contexts/AuthContext');
      const mockNavigate = vi.fn();

      useAuthContext.mockReturnValue({
        user: null,
        loading: false
      });

      vi.mock('react-router-dom', async () => {
        const actual = await vi.importActual('react-router-dom');
        return {
          ...actual,
          useNavigate: () => mockNavigate
        };
      });

      const ProtectedComponent = withAuthGuard(TestComponent);

      render(
        <MemoryRouter>
          <ProtectedComponent />
        </MemoryRouter>
      );

      // Component should not render
      expect(screen.queryByText('Test Component')).not.toBeInTheDocument();
    });
  });

  // ============================================================================
  // ROLE GUARD TESTS
  // ============================================================================

  describe('withRoleGuard', () => {
    it('should render component when user has required role', () => {
      const { useAuthContext } = require('../contexts/AuthContext');
      useAuthContext.mockReturnValue({
        user: mockAdminUser,
        loading: false
      });

      const ProtectedComponent = withRoleGuard(['ADMIN'])(TestComponent);

      render(
        <MemoryRouter>
          <ProtectedComponent />
        </MemoryRouter>
      );

      expect(screen.getByText('Test Component')).toBeInTheDocument();
    });

    it('should show access denied when user lacks required role', () => {
      const { useAuthContext } = require('../contexts/AuthContext');
      useAuthContext.mockReturnValue({
        user: mockReadOnlyUser,
        loading: false
      });

      const ProtectedComponent = withRoleGuard(['ADMIN'])(TestComponent);

      render(
        <MemoryRouter>
          <ProtectedComponent />
        </MemoryRouter>
      );

      expect(screen.getByText(/Access Denied/)).toBeInTheDocument();
    });

    it('should allow access when user has one of multiple allowed roles', () => {
      const { useAuthContext } = require('../contexts/AuthContext');
      useAuthContext.mockReturnValue({
        user: mockNurseUser,
        loading: false
      });

      const ProtectedComponent = withRoleGuard(['ADMIN', 'NURSE'])(TestComponent);

      render(
        <MemoryRouter>
          <ProtectedComponent />
        </MemoryRouter>
      );

      expect(screen.getByText('Test Component')).toBeInTheDocument();
    });
  });

  // ============================================================================
  // PERMISSION GUARD TESTS
  // ============================================================================

  describe('withPermissionGuard', () => {
    it('should render component when user has required permissions', () => {
      const { useAuthContext } = require('../contexts/AuthContext');
      useAuthContext.mockReturnValue({
        user: mockAdminUser,
        loading: false
      });

      const ProtectedComponent = withPermissionGuard([
        { resource: 'students', action: 'read' }
      ])(TestComponent);

      render(
        <MemoryRouter>
          <ProtectedComponent />
        </MemoryRouter>
      );

      expect(screen.getByText('Test Component')).toBeInTheDocument();
    });

    it('should show access denied when user lacks permissions', () => {
      const { useAuthContext } = require('../contexts/AuthContext');
      useAuthContext.mockReturnValue({
        user: mockReadOnlyUser,
        loading: false
      });

      const ProtectedComponent = withPermissionGuard([
        { resource: 'students', action: 'delete' }
      ])(TestComponent);

      render(
        <MemoryRouter>
          <ProtectedComponent />
        </MemoryRouter>
      );

      expect(screen.getByText(/Access Denied/)).toBeInTheDocument();
    });
  });

  // ============================================================================
  // DATA GUARD TESTS
  // ============================================================================

  describe('withDataGuard', () => {
    it('should load data and render component', async () => {
      const { useAuthContext } = require('../contexts/AuthContext');
      useAuthContext.mockReturnValue({
        user: mockAdminUser,
        loading: false
      });

      const mockData = { name: 'Test Data' };
      const mockLoader = vi.fn().mockResolvedValue(mockData);

      const ComponentWithData = ({ guardData }: { guardData: any }) => (
        <div>Data: {guardData.name}</div>
      );

      const ProtectedComponent = withDataGuard(mockLoader)(ComponentWithData);

      render(
        <MemoryRouter>
          <ProtectedComponent />
        </MemoryRouter>
      );

      // Should show loading initially
      expect(screen.getByText('Loading...')).toBeInTheDocument();

      // Wait for data to load
      await waitFor(() => {
        expect(screen.getByText('Data: Test Data')).toBeInTheDocument();
      });
    });

    it('should show error when data loading fails', async () => {
      const { useAuthContext } = require('../contexts/AuthContext');
      useAuthContext.mockReturnValue({
        user: mockAdminUser,
        loading: false
      });

      const mockLoader = vi.fn().mockRejectedValue(new Error('Load failed'));

      const ComponentWithData = ({ guardData }: { guardData: any }) => (
        <div>Data: {guardData.name}</div>
      );

      const ProtectedComponent = withDataGuard(mockLoader)(ComponentWithData);

      render(
        <MemoryRouter>
          <ProtectedComponent />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText(/Data Loading Error/)).toBeInTheDocument();
      });
    });
  });

  // ============================================================================
  // FEATURE GUARD TESTS
  // ============================================================================

  describe('withFeatureGuard', () => {
    it('should render component when feature is enabled', () => {
      const { useAuthContext } = require('../contexts/AuthContext');
      useAuthContext.mockReturnValue({
        user: mockAdminUser,
        loading: false
      });

      // Enable feature flag
      localStorage.setItem('featureFlags', JSON.stringify({
        'test-feature': true
      }));

      const ProtectedComponent = withFeatureGuard('test-feature')(TestComponent);

      render(
        <MemoryRouter>
          <ProtectedComponent />
        </MemoryRouter>
      );

      expect(screen.getByText('Test Component')).toBeInTheDocument();
    });

    it('should show feature not available when feature is disabled', () => {
      const { useAuthContext } = require('../contexts/AuthContext');
      useAuthContext.mockReturnValue({
        user: mockAdminUser,
        loading: false
      });

      // Feature flag not set (disabled by default)
      const ProtectedComponent = withFeatureGuard('test-feature')(TestComponent);

      render(
        <MemoryRouter>
          <ProtectedComponent />
        </MemoryRouter>
      );

      expect(screen.getByText(/Feature Not Available/)).toBeInTheDocument();
    });
  });

  // ============================================================================
  // COMPOSE GUARDS TESTS
  // ============================================================================

  describe('composeGuards', () => {
    it('should apply multiple guards in sequence', () => {
      const { useAuthContext } = require('../contexts/AuthContext');
      useAuthContext.mockReturnValue({
        user: mockAdminUser,
        loading: false
      });

      const ProtectedComponent = composeGuards([
        withAuthGuard,
        withRoleGuard(['ADMIN'])
      ])(TestComponent);

      render(
        <MemoryRouter>
          <ProtectedComponent />
        </MemoryRouter>
      );

      expect(screen.getByText('Test Component')).toBeInTheDocument();
    });

    it('should fail if any guard fails', () => {
      const { useAuthContext } = require('../contexts/AuthContext');
      useAuthContext.mockReturnValue({
        user: mockReadOnlyUser,
        loading: false
      });

      const ProtectedComponent = composeGuards([
        withAuthGuard,
        withRoleGuard(['ADMIN']) // This will fail
      ])(TestComponent);

      render(
        <MemoryRouter>
          <ProtectedComponent />
        </MemoryRouter>
      );

      expect(screen.getByText(/Access Denied/)).toBeInTheDocument();
    });
  });

  // ============================================================================
  // PERMISSION CHECKING TESTS
  // ============================================================================

  describe('Permission Checking Functions', () => {
    describe('checkPermission', () => {
      it('should return true for admin users', () => {
        const result = checkPermission(mockAdminUser, {
          resource: 'students',
          action: 'delete'
        });
        expect(result).toBe(true);
      });

      it('should return true when user has specific permission', () => {
        const result = checkPermission(mockNurseUser, {
          resource: 'medications',
          action: 'read'
        });
        expect(result).toBe(true);
      });

      it('should return false when user lacks permission', () => {
        const result = checkPermission(mockReadOnlyUser, {
          resource: 'students',
          action: 'delete'
        });
        expect(result).toBe(false);
      });

      it('should return false for null user', () => {
        const result = checkPermission(null, {
          resource: 'students',
          action: 'read'
        });
        expect(result).toBe(false);
      });
    });

    describe('checkAnyPermission', () => {
      it('should return true when user has at least one permission', () => {
        const permissions: PermissionCheck[] = [
          { resource: 'students', action: 'delete' },
          { resource: 'medications', action: 'read' }
        ];
        const result = checkAnyPermission(mockNurseUser, permissions);
        expect(result).toBe(true);
      });

      it('should return false when user has none of the permissions', () => {
        const permissions: PermissionCheck[] = [
          { resource: 'students', action: 'delete' },
          { resource: 'system', action: 'administer' }
        ];
        const result = checkAnyPermission(mockReadOnlyUser, permissions);
        expect(result).toBe(false);
      });
    });

    describe('checkAllPermissions', () => {
      it('should return true when user has all permissions', () => {
        const permissions: PermissionCheck[] = [
          { resource: 'students', action: 'read' },
          { resource: 'medications', action: 'read' }
        ];
        const result = checkAllPermissions(mockAdminUser, permissions);
        expect(result).toBe(true);
      });

      it('should return false when user lacks any permission', () => {
        const permissions: PermissionCheck[] = [
          { resource: 'medications', action: 'read' },
          { resource: 'students', action: 'delete' }
        ];
        const result = checkAllPermissions(mockReadOnlyUser, permissions);
        expect(result).toBe(false);
      });
    });

    describe('checkRolePermission', () => {
      it('should return true when role has permission', () => {
        const result = checkRolePermission('NURSE', {
          resource: 'medications',
          action: 'create'
        });
        expect(result).toBe(true);
      });

      it('should return false when role lacks permission', () => {
        const result = checkRolePermission('READ_ONLY', {
          resource: 'students',
          action: 'delete'
        });
        expect(result).toBe(false);
      });
    });

    describe('hasAccessToRoute', () => {
      it('should return true when user meets all requirements', () => {
        const metadata: RouteMetadata = {
          requiresAuth: true,
          roles: ['ADMIN', 'NURSE'],
          permissions: [
            { resource: 'students', action: 'read' }
          ]
        };
        const result = hasAccessToRoute(mockNurseUser, metadata);
        expect(result).toBe(true);
      });

      it('should return false when user lacks required role', () => {
        const metadata: RouteMetadata = {
          requiresAuth: true,
          roles: ['ADMIN']
        };
        const result = hasAccessToRoute(mockNurseUser, metadata);
        expect(result).toBe(false);
      });

      it('should return false when user lacks required permission', () => {
        const metadata: RouteMetadata = {
          requiresAuth: true,
          permissions: [
            { resource: 'students', action: 'delete' }
          ]
        };
        const result = hasAccessToRoute(mockReadOnlyUser, metadata);
        expect(result).toBe(false);
      });

      it('should return false when user is null and auth is required', () => {
        const metadata: RouteMetadata = {
          requiresAuth: true
        };
        const result = hasAccessToRoute(null, metadata);
        expect(result).toBe(false);
      });

      it('should check feature flags', () => {
        localStorage.setItem('featureFlags', JSON.stringify({
          'test-feature': false
        }));

        const metadata: RouteMetadata = {
          requiresAuth: true,
          features: ['test-feature']
        };
        const result = hasAccessToRoute(mockAdminUser, metadata);
        expect(result).toBe(false);
      });
    });
  });

  // ============================================================================
  // NAVIGATION INTERCEPTOR TESTS
  // ============================================================================

  describe('Navigation Interceptor Manager', () => {
    it('should run before navigate callbacks', async () => {
      const callback = vi.fn();
      const unsubscribe = navigationInterceptorManager.beforeNavigate(
        (to, from, next) => {
          callback(to.pathname);
          next();
        }
      );

      const mockLocation = { pathname: '/test' } as any;
      await navigationInterceptorManager.triggerBeforeNavigate(
        mockLocation,
        mockLocation
      );

      expect(callback).toHaveBeenCalledWith('/test');
      unsubscribe();
    });

    it('should run after navigate callbacks', () => {
      const callback = vi.fn();
      const unsubscribe = navigationInterceptorManager.afterNavigate(callback);

      const mockLocation = { pathname: '/test' } as any;
      navigationInterceptorManager.triggerAfterNavigate(mockLocation, mockLocation);

      expect(callback).toHaveBeenCalledWith(mockLocation, mockLocation);
      unsubscribe();
    });

    it('should run error callbacks', () => {
      const callback = vi.fn();
      const unsubscribe = navigationInterceptorManager.onNavigationError(callback);

      const error = new Error('Test error');
      // Trigger error through interceptor
      navigationInterceptorManager.addInterceptor(() => {
        throw error;
      });

      unsubscribe();
    });

    it('should allow unsubscribing from callbacks', () => {
      const callback = vi.fn();
      const unsubscribe = navigationInterceptorManager.afterNavigate(callback);

      unsubscribe();

      const mockLocation = { pathname: '/test' } as any;
      navigationInterceptorManager.triggerAfterNavigate(mockLocation, mockLocation);

      expect(callback).not.toHaveBeenCalled();
    });
  });
});
