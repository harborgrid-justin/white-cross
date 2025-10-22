import React from 'react';
import { Navigate } from 'react-router-dom';
import { ProtectedRoute } from '../../routes';
import { UserRole } from '../../types/common';

// Vendor Management Components (placeholders)
const VendorDashboard = React.lazy(() => import('./components/VendorDashboard'));
const VendorList = React.lazy(() => import('./components/VendorList'));
const VendorDetails = React.lazy(() => import('./components/VendorDetails'));
const VendorForm = React.lazy(() => import('./components/VendorForm'));
const VendorEditor = React.lazy(() => import('./components/VendorEditor'));
const VendorComparison = React.lazy(() => import('./components/VendorComparison'));
const VendorAnalytics = React.lazy(() => import('./components/VendorAnalytics'));
const VendorStatistics = React.lazy(() => import('./components/VendorStatistics'));
const TopVendors = React.lazy(() => import('./components/TopVendors'));
const VendorPerformanceMetrics = React.lazy(() => import('./components/VendorPerformanceMetrics'));
const VendorImportExport = React.lazy(() => import('./components/VendorImportExport'));
const VendorCompliance = React.lazy(() => import('./components/VendorCompliance'));

const vendorRoutes = [
  {
    path: '/vendor',
    element: <Navigate to="/vendor/dashboard" replace />,
  },
  {
    path: '/vendor/dashboard',
    element: (
      <ProtectedRoute allowedRoles={['ADMIN', 'DISTRICT_ADMIN', 'SCHOOL_ADMIN'] as UserRole[]}>
        <VendorDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/vendor/list',
    element: (
      <ProtectedRoute allowedRoles={['ADMIN', 'DISTRICT_ADMIN', 'SCHOOL_ADMIN', 'NURSE'] as UserRole[]}>
        <VendorList />
      </ProtectedRoute>
    ),
  },
  {
    path: '/vendor/create',
    element: (
      <ProtectedRoute allowedRoles={['ADMIN', 'DISTRICT_ADMIN'] as UserRole[]}>
        <VendorForm />
      </ProtectedRoute>
    ),
  },
  {
    path: '/vendor/edit/:id',
    element: (
      <ProtectedRoute allowedRoles={['ADMIN', 'DISTRICT_ADMIN'] as UserRole[]}>
        <VendorEditor />
      </ProtectedRoute>
    ),
  },
  {
    path: '/vendor/details/:id',
    element: (
      <ProtectedRoute allowedRoles={['ADMIN', 'DISTRICT_ADMIN', 'SCHOOL_ADMIN', 'NURSE'] as UserRole[]}>
        <VendorDetails />
      </ProtectedRoute>
    ),
  },
  {
    path: '/vendor/performance/:id',
    element: (
      <ProtectedRoute allowedRoles={['ADMIN', 'DISTRICT_ADMIN', 'SCHOOL_ADMIN'] as UserRole[]}>
        <VendorPerformanceMetrics />
      </ProtectedRoute>
    ),
  },
  {
    path: '/vendor/comparison',
    element: (
      <ProtectedRoute allowedRoles={['ADMIN', 'DISTRICT_ADMIN', 'SCHOOL_ADMIN'] as UserRole[]}>
        <VendorComparison />
      </ProtectedRoute>
    ),
  },
  {
    path: '/vendor/analytics',
    element: (
      <ProtectedRoute allowedRoles={['ADMIN', 'DISTRICT_ADMIN', 'SCHOOL_ADMIN'] as UserRole[]}>
        <VendorAnalytics />
      </ProtectedRoute>
    ),
  },
  {
    path: '/vendor/statistics',
    element: (
      <ProtectedRoute allowedRoles={['ADMIN', 'DISTRICT_ADMIN', 'SCHOOL_ADMIN'] as UserRole[]}>
        <VendorStatistics />
      </ProtectedRoute>
    ),
  },
  {
    path: '/vendor/top-performers',
    element: (
      <ProtectedRoute allowedRoles={['ADMIN', 'DISTRICT_ADMIN', 'SCHOOL_ADMIN'] as UserRole[]}>
        <TopVendors />
      </ProtectedRoute>
    ),
  },
  {
    path: '/vendor/import-export',
    element: (
      <ProtectedRoute allowedRoles={['ADMIN', 'DISTRICT_ADMIN'] as UserRole[]}>
        <VendorImportExport />
      </ProtectedRoute>
    ),
  },
  {
    path: '/vendor/compliance',
    element: (
      <ProtectedRoute allowedRoles={['ADMIN', 'DISTRICT_ADMIN'] as UserRole[]}>
        <VendorCompliance />
      </ProtectedRoute>
    ),
  },
];

export default vendorRoutes;
