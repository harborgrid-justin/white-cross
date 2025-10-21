/**
 * WF-COMP-062 | examples.tsx - React component or utility module
 * Purpose: react component or utility module
 * Upstream: ../../hooks/useRouteState, ../../contexts/AuthContext, ../../utils/navigationUtils | Dependencies: react, react-router-dom, ../../hooks/useRouteState
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: default export, functions | Key Features: useState, component, arrow component
 * Last Updated: 2025-10-17 | File Type: .tsx
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

/**
 * Navigation Components - Usage Examples
 *
 * This file demonstrates various ways to use the navigation components
 * and utilities in the White Cross Healthcare Platform.
 *
 * @module components/navigation/examples
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import BackButton, { IconBackButton, BackButtonWithConfirmation } from '../../BackButton';
import Breadcrumbs, { BreadcrumbItemComponent } from '../../Breadcrumbs';
import { useNavigationState } from '../../../hooks/useRouteState';
import { useAuthContext } from '../../../contexts/AuthContext';
import {
  canAccessNavigationItem,
  filterNavigationItems,
  getDisabledReasonMessage,
} from '../../../utils/navigationUtils';
import type { NavigationItem } from '../../../types/navigation';

// ============================================================================
// EXAMPLE 1: Basic Back Button
// ============================================================================

export function BasicBackButtonExample() {
  return (
    <div className="p-4 space-y-4">
      <h2 className="text-lg font-semibold">Basic Back Button</h2>

      {/* Default back button */}
      <BackButton />

      {/* With custom label */}
      <BackButton label="Return to List" />

      {/* With fallback path */}
      <BackButton fallbackPath="/students" label="Back to Students" />

      {/* Ghost variant */}
      <BackButton variant="ghost" />

      {/* Link variant */}
      <BackButton variant="link" label="Go Back" />
    </div>
  );
}

// ============================================================================
// EXAMPLE 2: Icon Back Button
// ============================================================================

export function IconBackButtonExample() {
  return (
    <div className="p-4 space-y-4">
      <h2 className="text-lg font-semibold">Icon Back Button</h2>

      {/* Small size */}
      <IconBackButton size="sm" title="Go back" />

      {/* Medium size (default) */}
      <IconBackButton size="md" title="Go back" />

      {/* Large size */}
      <IconBackButton size="lg" title="Go back" />
    </div>
  );
}

// ============================================================================
// EXAMPLE 3: Back Button with Unsaved Changes
// ============================================================================

export function UnsavedChangesBackButtonExample() {
  const [hasUnsavedChanges, setHasUnsavedChanges] = React.useState(true);

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-lg font-semibold">Back Button with Confirmation</h2>

      <div className="space-y-2">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={hasUnsavedChanges}
            onChange={(e) => setHasUnsavedChanges(e.target.checked)}
          />
          Has unsaved changes
        </label>

        <BackButtonWithConfirmation
          requireConfirmation={hasUnsavedChanges}
          confirmMessage="You have unsaved changes. Are you sure you want to go back?"
        />
      </div>
    </div>
  );
}

// ============================================================================
// EXAMPLE 4: Basic Breadcrumbs
// ============================================================================

export function BasicBreadcrumbsExample() {
  return (
    <div className="p-4 space-y-4">
      <h2 className="text-lg font-semibold">Basic Breadcrumbs</h2>

      {/* Auto-generated from route */}
      <Breadcrumbs />

      {/* With custom configuration */}
      <Breadcrumbs
        config={{
          showHomeIcon: true,
          maxItems: 4,
          showIcons: false,
        }}
      />

      {/* Show on mobile */}
      <Breadcrumbs showOnMobile />
    </div>
  );
}

// ============================================================================
// EXAMPLE 5: Custom Breadcrumbs
// ============================================================================

export function CustomBreadcrumbsExample() {
  const customBreadcrumbs = [
    { label: 'Home', path: '/', isActive: false, icon: 'Home' },
    { label: 'Students', path: '/students', isActive: false, icon: 'Users' },
    { label: 'John Doe', path: '/students/123', isActive: false },
    { label: 'Health Records', isActive: true },
  ];

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-lg font-semibold">Custom Breadcrumbs</h2>

      <Breadcrumbs items={customBreadcrumbs} />
    </div>
  );
}

// ============================================================================
// EXAMPLE 6: Navigation State Hook
// ============================================================================

export function NavigationStateExample() {
  const {
    previousPath,
    previousState,
    navigateBack,
    navigateWithState,
    canGoBack,
    currentScroll,
  } = useNavigationState();

  const navigate = useNavigate();

  const handleNavigateToStudent = () => {
    navigateWithState('/students/123', {
      from: 'list',
      filters: { grade: '5' },
    });
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-lg font-semibold">Navigation State</h2>

      <div className="bg-gray-50 p-4 rounded space-y-2">
        <p><strong>Previous Path:</strong> {previousPath || 'None'}</p>
        <p><strong>Can Go Back:</strong> {canGoBack ? 'Yes' : 'No'}</p>
        <p><strong>Scroll Position:</strong> X: {currentScroll.x}, Y: {currentScroll.y}</p>
        <p><strong>Previous State:</strong> {JSON.stringify(previousState)}</p>
      </div>

      <div className="space-x-2">
        <button
          onClick={handleNavigateToStudent}
          className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
        >
          Navigate with State
        </button>

        <button
          onClick={() => navigateBack('/')}
          disabled={!canGoBack}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50"
        >
          Navigate Back
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// EXAMPLE 7: Permission Checking
// ============================================================================

export function PermissionCheckingExample() {
  const { user } = useAuthContext();

  const navigationItems: NavigationItem[] = [
    {
      id: 'students',
      name: 'Students',
      path: '/students',
      icon: 'Users',
      roles: ['ADMIN', 'NURSE'],
      permissions: [{ resource: 'students', action: 'read' }],
    },
    {
      id: 'medications',
      name: 'Medications',
      path: '/medications',
      icon: 'Pill',
      roles: ['ADMIN', 'NURSE'],
      permissions: [{ resource: 'medications', action: 'read' }],
    },
    {
      id: 'admin',
      name: 'Administration',
      path: '/admin',
      icon: 'Settings',
      roles: ['ADMIN'],
      permissions: [{ resource: 'system', action: 'manage' }],
    },
  ];

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-lg font-semibold">Permission Checking</h2>

      <div className="bg-gray-50 p-4 rounded">
        <p className="mb-2"><strong>Current User:</strong> {user?.firstName} {user?.lastName}</p>
        <p className="mb-4"><strong>Role:</strong> {user?.role}</p>

        <div className="space-y-2">
          {navigationItems.map(item => {
            const { hasAccess, reason } = canAccessNavigationItem(item, user);
            const message = getDisabledReasonMessage(reason, item);

            return (
              <div
                key={item.id}
                className={`p-3 rounded border ${
                  hasAccess
                    ? 'bg-green-50 border-green-200'
                    : 'bg-red-50 border-red-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{item.name}</span>
                  <span className={`text-sm ${hasAccess ? 'text-green-700' : 'text-red-700'}`}>
                    {hasAccess ? 'Accessible' : 'Denied'}
                  </span>
                </div>
                {!hasAccess && (
                  <p className="text-sm text-red-600 mt-1">{message}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// EXAMPLE 8: Filtered Navigation Menu
// ============================================================================

export function FilteredNavigationExample() {
  const { user } = useAuthContext();

  const navigationItems: NavigationItem[] = [
    {
      id: 'dashboard',
      name: 'Dashboard',
      path: '/dashboard',
      icon: 'Home',
      roles: ['ADMIN', 'NURSE', 'SCHOOL_ADMIN', 'READ_ONLY'],
    },
    {
      id: 'students',
      name: 'Students',
      path: '/students',
      icon: 'Users',
      roles: ['ADMIN', 'NURSE', 'SCHOOL_ADMIN'],
      permissions: [{ resource: 'students', action: 'read' }],
    },
    {
      id: 'medications',
      name: 'Medications',
      path: '/medications',
      icon: 'Pill',
      roles: ['ADMIN', 'NURSE'],
      permissions: [{ resource: 'medications', action: 'read' }],
    },
    {
      id: 'reports',
      name: 'Reports',
      path: '/reports',
      icon: 'BarChart',
      roles: ['ADMIN', 'NURSE', 'SCHOOL_ADMIN', 'READ_ONLY'],
      permissions: [{ resource: 'reports', action: 'read' }],
    },
    {
      id: 'admin',
      name: 'Administration',
      path: '/admin',
      icon: 'Settings',
      roles: ['ADMIN'],
      permissions: [{ resource: 'system', action: 'manage' }],
    },
  ];

  const filteredItems = filterNavigationItems(navigationItems, user);

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-lg font-semibold">Filtered Navigation Menu</h2>

      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <p className="mb-4 text-sm text-gray-600">
          Only showing navigation items accessible to <strong>{user?.role}</strong>
        </p>

        <nav className="space-y-1">
          {filteredItems.map(item => (
            <div
              key={item.id}
              className="flex items-center justify-between p-2 rounded hover:bg-gray-50"
            >
              <span>{item.name}</span>
              {item.hasAccess && (
                <span className="text-xs text-green-600">✓ Accessible</span>
              )}
            </div>
          ))}
        </nav>

        {filteredItems.length === 0 && (
          <p className="text-sm text-gray-500 italic">No accessible navigation items</p>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// EXAMPLE 9: Complete Page with Navigation Components
// ============================================================================

export function CompletePageExample() {
  const { user } = useAuthContext();
  const { navigateBack } = useNavigationState();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with breadcrumbs */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <BackButton variant="ghost" />
              <div>
                <Breadcrumbs />
                <h1 className="text-2xl font-bold text-gray-900 mt-1">
                  Student Details
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">
                {user?.firstName} {user?.lastName}
              </span>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                {user?.role}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white shadow rounded-lg p-6">
          <p className="text-gray-600">Page content goes here...</p>
        </div>
      </main>
    </div>
  );
}

// ============================================================================
// EXAMPLE 10: Navigation Guards in Component
// ============================================================================

export function NavigationGuardsExample() {
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const checkAndNavigate = (path: string, requiredRoles: string[]) => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!requiredRoles.includes(user.role)) {
      alert(`Access denied. This page requires one of these roles: ${requiredRoles.join(', ')}`);
      return;
    }

    navigate(path);
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-lg font-semibold">Navigation Guards</h2>

      <div className="space-x-2">
        <button
          onClick={() => checkAndNavigate('/admin', ['ADMIN'])}
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          Admin Panel (ADMIN only)
        </button>

        <button
          onClick={() => checkAndNavigate('/medications', ['ADMIN', 'NURSE'])}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Medications (ADMIN/NURSE)
        </button>

        <button
          onClick={() => checkAndNavigate('/reports', ['ADMIN', 'NURSE', 'SCHOOL_ADMIN'])}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Reports (Multiple roles)
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// EXPORT ALL EXAMPLES
// ============================================================================

export default {
  BasicBackButtonExample,
  IconBackButtonExample,
  UnsavedChangesBackButtonExample,
  BasicBreadcrumbsExample,
  CustomBreadcrumbsExample,
  NavigationStateExample,
  PermissionCheckingExample,
  FilteredNavigationExample,
  CompletePageExample,
  NavigationGuardsExample,
};
