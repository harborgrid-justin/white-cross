import React from 'react';
import { Navigate } from 'react-router-dom';
import { ProtectedRoute } from '../../routes';
import { UserRole } from '../../types/common';

// Configuration Management Components (placeholders)
const ConfigurationDashboard = React.lazy(() => import('./components/ConfigurationDashboard'));
const ConfigurationList = React.lazy(() => import('./components/ConfigurationList'));
const ConfigurationEditor = React.lazy(() => import('./components/ConfigurationEditor'));
const ConfigurationHistory = React.lazy(() => import('./components/ConfigurationHistory'));
const ConfigurationImportExport = React.lazy(() => import('./components/ConfigurationImportExport'));
const PublicConfigurationViewer = React.lazy(() => import('./components/PublicConfigurationViewer'));
const ConfigurationTemplates = React.lazy(() => import('./components/ConfigurationTemplates'));
const ConfigurationValidator = React.lazy(() => import('./components/ConfigurationValidator'));
const ConfigurationBackup = React.lazy(() => import('./components/ConfigurationBackup'));
const SecurityAudit = React.lazy(() => import('./components/SecurityAudit'));

const configurationRoutes = [
  {
    path: '/configuration',
    element: <Navigate to="/configuration/dashboard" replace />,
  },
  {
    path: '/configuration/dashboard',
    element: (
      <ProtectedRoute allowedRoles={['ADMIN', 'DISTRICT_ADMIN', 'SCHOOL_ADMIN'] as UserRole[]}>
        <ConfigurationDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/configuration/list',
    element: (
      <ProtectedRoute allowedRoles={['ADMIN', 'DISTRICT_ADMIN', 'SCHOOL_ADMIN'] as UserRole[]}>
        <ConfigurationList />
      </ProtectedRoute>
    ),
  },
  {
    path: '/configuration/editor',
    element: (
      <ProtectedRoute allowedRoles={['ADMIN', 'DISTRICT_ADMIN'] as UserRole[]}>
        <ConfigurationEditor />
      </ProtectedRoute>
    ),
  },
  {
    path: '/configuration/editor/:id',
    element: (
      <ProtectedRoute allowedRoles={['ADMIN', 'DISTRICT_ADMIN'] as UserRole[]}>
        <ConfigurationEditor />
      </ProtectedRoute>
    ),
  },
  {
    path: '/configuration/history',
    element: (
      <ProtectedRoute allowedRoles={['ADMIN', 'DISTRICT_ADMIN', 'SCHOOL_ADMIN'] as UserRole[]}>
        <ConfigurationHistory />
      </ProtectedRoute>
    ),
  },
  {
    path: '/configuration/history/:id',
    element: (
      <ProtectedRoute allowedRoles={['ADMIN', 'DISTRICT_ADMIN', 'SCHOOL_ADMIN'] as UserRole[]}>
        <ConfigurationHistory />
      </ProtectedRoute>
    ),
  },
  {
    path: '/configuration/import-export',
    element: (
      <ProtectedRoute allowedRoles={['ADMIN', 'DISTRICT_ADMIN'] as UserRole[]}>
        <ConfigurationImportExport />
      </ProtectedRoute>
    ),
  },
  {
    path: '/configuration/public',
    element: (
      <ProtectedRoute allowedRoles={['ADMIN', 'DISTRICT_ADMIN', 'SCHOOL_ADMIN', 'NURSE', 'COUNSELOR', 'READ_ONLY'] as UserRole[]}>
        <PublicConfigurationViewer />
      </ProtectedRoute>
    ),
  },
  {
    path: '/configuration/templates',
    element: (
      <ProtectedRoute allowedRoles={['ADMIN', 'DISTRICT_ADMIN'] as UserRole[]}>
        <ConfigurationTemplates />
      </ProtectedRoute>
    ),
  },
  {
    path: '/configuration/validator',
    element: (
      <ProtectedRoute allowedRoles={['ADMIN', 'DISTRICT_ADMIN'] as UserRole[]}>
        <ConfigurationValidator />
      </ProtectedRoute>
    ),
  },
  {
    path: '/configuration/backup',
    element: (
      <ProtectedRoute allowedRoles={['ADMIN', 'DISTRICT_ADMIN'] as UserRole[]}>
        <ConfigurationBackup />
      </ProtectedRoute>
    ),
  },
  {
    path: '/configuration/security-audit',
    element: (
      <ProtectedRoute allowedRoles={['ADMIN', 'DISTRICT_ADMIN'] as UserRole[]}>
        <SecurityAudit />
      </ProtectedRoute>
    ),
  },
];

export default configurationRoutes;
