/**
 * WF-COMP-278 | routes.tsx - Budget page routes
 * Purpose: Budget route configuration with role-based protection
 * Related: ProtectedRoute, budget components
 * Last Updated: 2025-10-21 | File Type: .tsx
 */

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '../../routes';
import {
  BudgetOverview,
  BudgetPlanning,
  BudgetReports,
  BudgetTracking,
} from './components';

export const BudgetRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Budget Overview */}
      <Route 
        path="/overview" 
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'DISTRICT_ADMIN', 'SCHOOL_ADMIN']}>
            <BudgetOverview />
          </ProtectedRoute>
        } 
      />

      {/* Budget Planning */}
      <Route 
        path="/planning" 
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'DISTRICT_ADMIN', 'SCHOOL_ADMIN']}>
            <BudgetPlanning />
          </ProtectedRoute>
        } 
      />

      {/* Budget Tracking */}
      <Route 
        path="/tracking" 
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'DISTRICT_ADMIN', 'SCHOOL_ADMIN']}>
            <BudgetTracking />
          </ProtectedRoute>
        } 
      />

      {/* Budget Reports */}
      <Route 
        path="/reports" 
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'DISTRICT_ADMIN', 'SCHOOL_ADMIN']}>
            <BudgetReports />
          </ProtectedRoute>
        } 
      />

      {/* Default redirect to overview */}
      <Route 
        path="/" 
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'DISTRICT_ADMIN', 'SCHOOL_ADMIN']}>
            <BudgetOverview />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
};

export default BudgetRoutes;
