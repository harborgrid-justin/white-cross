/**
 * Incidents Page Routes
 * 
 * Route configuration specific to incident management functionality.
 */

import React from 'react';
import { Route } from 'react-router-dom';
import { ProtectedRoute } from '../../routes';
import Incidents from './Incidents';

export const IncidentRoutes = () => (
  <>
    <Route
      path="/incidents"
      element={
        <ProtectedRoute allowedRoles={['ADMIN', 'NURSE', 'COUNSELOR']}>
          <Incidents />
        </ProtectedRoute>
      }
    />
    <Route
      path="/incidents/:id"
      element={
        <ProtectedRoute allowedRoles={['ADMIN', 'NURSE', 'COUNSELOR']}>
          <Incidents />
        </ProtectedRoute>
      }
    />
  </>
);
