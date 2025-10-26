/**
 * Appointments Page Routes
 * 
 * Route configuration specific to appointment management functionality.
 */

import React from 'react';
import { Route } from 'react-router-dom';
import { ProtectedRoute } from '../../routes';
import AppointmentSchedule from './AppointmentSchedule';
import AppointmentCreate from './AppointmentCreate';
import AppointmentDetail from './AppointmentDetail';
import AppointmentEdit from './AppointmentEdit';

export const AppointmentRoutes = () => (
  <>
    <Route
      path="/appointments"
      element={
        <ProtectedRoute allowedRoles={['ADMIN', 'NURSE']}>
          <AppointmentSchedule />
        </ProtectedRoute>
      }
    />
    <Route
      path="/appointments/create"
      element={
        <ProtectedRoute allowedRoles={['ADMIN', 'NURSE']}>
          <AppointmentCreate />
        </ProtectedRoute>
      }
    />
    <Route
      path="/appointments/:id"
      element={
        <ProtectedRoute allowedRoles={['ADMIN', 'NURSE', 'COUNSELOR']}>
          <AppointmentDetail />
        </ProtectedRoute>
      }
    />
    <Route
      path="/appointments/:id/edit"
      element={
        <ProtectedRoute allowedRoles={['ADMIN', 'NURSE']}>
          <AppointmentEdit />
        </ProtectedRoute>
      }
    />
  </>
);
