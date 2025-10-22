/**
 * WF-COMP-273 | routes.tsx - Admin page routes
 * Purpose: Admin route configuration with role-based protection
 * Related: ProtectedRoute, admin components
 * Last Updated: 2025-10-21 | File Type: .tsx
 */

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '../../routes';
import {
  AdminInventory,
  AdminPermissions,
  AdminReports,
  AdminRoles,
  AdminSettings,
  AdminUsers,
} from './components';

export const AdminRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Admin Users Management */}
      <Route 
        path="/users" 
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'DISTRICT_ADMIN']}>
            <AdminUsers />
          </ProtectedRoute>
        } 
      />

      {/* Admin Roles Management */}
      <Route 
        path="/roles" 
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'DISTRICT_ADMIN']}>
            <AdminRoles />
          </ProtectedRoute>
        } 
      />

      {/* Admin Permissions Management */}
      <Route 
        path="/permissions" 
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminPermissions />
          </ProtectedRoute>
        } 
      />

      {/* Admin Settings */}
      <Route 
        path="/settings" 
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminSettings />
          </ProtectedRoute>
        } 
      />

      {/* Admin Inventory Management */}
      <Route 
        path="/inventory" 
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'DISTRICT_ADMIN', 'SCHOOL_ADMIN']}>
            <AdminInventory />
          </ProtectedRoute>
        } 
      />

      {/* Admin Reports */}
      <Route 
        path="/reports" 
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'DISTRICT_ADMIN', 'SCHOOL_ADMIN']}>
            <AdminReports />
          </ProtectedRoute>
        } 
      />

      {/* Default redirect to users */}
      <Route 
        path="/" 
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'DISTRICT_ADMIN']}>
            <AdminUsers />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
};

export default AdminRoutes;
