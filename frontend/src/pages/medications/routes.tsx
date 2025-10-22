/**
 * Medications Page Routes
 * 
 * Route configuration specific to medication management functionality.
 */

import React from 'react';
import { Route } from 'react-router-dom';
import { ProtectedRoute } from '../../routes';
import Medications from './Medications';

export const MedicationRoutes = () => (
  <>
    <Route
      path="/medications"
      element={
        <ProtectedRoute allowedRoles={['ADMIN', 'NURSE']}>
          <Medications />
        </ProtectedRoute>
      }
    />
    <Route
      path="/medications/:studentId"
      element={
        <ProtectedRoute allowedRoles={['ADMIN', 'NURSE', 'COUNSELOR']}>
          <Medications />
        </ProtectedRoute>
      }
    />
  </>
);
