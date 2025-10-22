/**
 * WF-ROU-011 | routes.tsx - Access Control Routes
 * Purpose: Define protected routes for access control management
 * Dependencies: react-router-dom, ProtectedRoute component
 */

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '../../components/auth/ProtectedRoute';
import {
  RolesList,
  RoleForm,
  RoleDetails,
  PermissionsList,
  PermissionForm,
  PermissionMatrix,
  UserRoleAssignment,
  UserPermissionCheck,
  ActiveSessionsList,
  SessionManagement,
  SecurityIncidentsList,
  SecurityIncidentForm,
  SecurityIncidentDetails,
  IpRestrictionsList,
  IpRestrictionForm,
  AuditLog,
  SecurityDashboard,
  AccessControlStatistics
} from './components';

// Main Access Control Routes Component
const AccessControlRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Dashboard - Security Overview */}
      <Route
        path="/"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'SECURITY_MANAGER']}>
            <SecurityDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'SECURITY_MANAGER']}>
            <SecurityDashboard />
          </ProtectedRoute>
        }
      />

      {/* Role Management Routes */}
      <Route
        path="/roles"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'SECURITY_MANAGER']}>
            <RolesList />
          </ProtectedRoute>
        }
      />

      <Route
        path="/roles/new"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <RoleForm />
          </ProtectedRoute>
        }
      />

      <Route
        path="/roles/:id"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'SECURITY_MANAGER']}>
            <RoleDetails />
          </ProtectedRoute>
        }
      />

      <Route
        path="/roles/:id/edit"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <RoleForm />
          </ProtectedRoute>
        }
      />

      {/* Permission Management Routes */}
      <Route
        path="/permissions"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'SECURITY_MANAGER']}>
            <PermissionsList />
          </ProtectedRoute>
        }
      />

      <Route
        path="/permissions/new"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <PermissionForm />
          </ProtectedRoute>
        }
      />

      <Route
        path="/permissions/matrix"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'SECURITY_MANAGER']}>
            <PermissionMatrix />
          </ProtectedRoute>
        }
      />

      {/* User Access Control Routes */}
      <Route
        path="/user-roles"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'SECURITY_MANAGER']}>
            <UserRoleAssignment />
          </ProtectedRoute>
        }
      />

      <Route
        path="/user-permissions"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'SECURITY_MANAGER']}>
            <UserPermissionCheck />
          </ProtectedRoute>
        }
      />

      {/* Session Management Routes */}
      <Route
        path="/sessions"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'SECURITY_MANAGER']}>
            <ActiveSessionsList />
          </ProtectedRoute>
        }
      />

      <Route
        path="/sessions/manage"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'SECURITY_MANAGER']}>
            <SessionManagement />
          </ProtectedRoute>
        }
      />

      {/* Security Incident Routes */}
      <Route
        path="/incidents"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'SECURITY_MANAGER', 'SECURITY_ANALYST']}>
            <SecurityIncidentsList />
          </ProtectedRoute>
        }
      />

      <Route
        path="/incidents/new"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'SECURITY_MANAGER', 'SECURITY_ANALYST']}>
            <SecurityIncidentForm />
          </ProtectedRoute>
        }
      />

      <Route
        path="/incidents/:id"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'SECURITY_MANAGER', 'SECURITY_ANALYST']}>
            <SecurityIncidentDetails />
          </ProtectedRoute>
        }
      />

      <Route
        path="/incidents/:id/edit"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'SECURITY_MANAGER']}>
            <SecurityIncidentForm />
          </ProtectedRoute>
        }
      />

      {/* IP Restriction Routes */}
      <Route
        path="/ip-restrictions"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'SECURITY_MANAGER']}>
            <IpRestrictionsList />
          </ProtectedRoute>
        }
      />

      <Route
        path="/ip-restrictions/new"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <IpRestrictionForm />
          </ProtectedRoute>
        }
      />

      {/* Audit and Monitoring Routes */}
      <Route
        path="/audit-log"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'SECURITY_MANAGER', 'AUDITOR']}>
            <AuditLog />
          </ProtectedRoute>
        }
      />

      <Route
        path="/statistics"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'SECURITY_MANAGER']}>
            <AccessControlStatistics />
          </ProtectedRoute>
        }
      />

      {/* Fallback route for unmatched paths */}
      <Route
        path="*"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'SECURITY_MANAGER']}>
            <SecurityDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AccessControlRoutes;

// Export route configuration for external use
export const accessControlRouteConfig = {
  basePath: '/access-control',
  routes: [
    { path: '/', component: 'SecurityDashboard', roles: ['ADMIN', 'SECURITY_MANAGER'] },
    { path: '/dashboard', component: 'SecurityDashboard', roles: ['ADMIN', 'SECURITY_MANAGER'] },
    { path: '/roles', component: 'RolesList', roles: ['ADMIN', 'SECURITY_MANAGER'] },
    { path: '/roles/new', component: 'RoleForm', roles: ['ADMIN'] },
    { path: '/roles/:id', component: 'RoleDetails', roles: ['ADMIN', 'SECURITY_MANAGER'] },
    { path: '/roles/:id/edit', component: 'RoleForm', roles: ['ADMIN'] },
    { path: '/permissions', component: 'PermissionsList', roles: ['ADMIN', 'SECURITY_MANAGER'] },
    { path: '/permissions/new', component: 'PermissionForm', roles: ['ADMIN'] },
    { path: '/permissions/matrix', component: 'PermissionMatrix', roles: ['ADMIN', 'SECURITY_MANAGER'] },
    { path: '/user-roles', component: 'UserRoleAssignment', roles: ['ADMIN', 'SECURITY_MANAGER'] },
    { path: '/user-permissions', component: 'UserPermissionCheck', roles: ['ADMIN', 'SECURITY_MANAGER'] },
    { path: '/sessions', component: 'ActiveSessionsList', roles: ['ADMIN', 'SECURITY_MANAGER'] },
    { path: '/sessions/manage', component: 'SessionManagement', roles: ['ADMIN', 'SECURITY_MANAGER'] },
    { path: '/incidents', component: 'SecurityIncidentsList', roles: ['ADMIN', 'SECURITY_MANAGER', 'SECURITY_ANALYST'] },
    { path: '/incidents/new', component: 'SecurityIncidentForm', roles: ['ADMIN', 'SECURITY_MANAGER', 'SECURITY_ANALYST'] },
    { path: '/incidents/:id', component: 'SecurityIncidentDetails', roles: ['ADMIN', 'SECURITY_MANAGER', 'SECURITY_ANALYST'] },
    { path: '/incidents/:id/edit', component: 'SecurityIncidentForm', roles: ['ADMIN', 'SECURITY_MANAGER'] },
    { path: '/ip-restrictions', component: 'IpRestrictionsList', roles: ['ADMIN', 'SECURITY_MANAGER'] },
    { path: '/ip-restrictions/new', component: 'IpRestrictionForm', roles: ['ADMIN'] },
    { path: '/audit-log', component: 'AuditLog', roles: ['ADMIN', 'SECURITY_MANAGER', 'AUDITOR'] },
    { path: '/statistics', component: 'AccessControlStatistics', roles: ['ADMIN', 'SECURITY_MANAGER'] }
  ]
};
