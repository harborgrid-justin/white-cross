/**
 * Students Page Routes
 * 
 * Route configuration specific to student management functionality.
 */

import React from 'react';
import { Route } from 'react-router-dom';
import { ProtectedRoute } from '../../routes';
import Students from './Students';
import StudentHealthRecords from './StudentHealthRecords';

export const StudentRoutes = () => (
  <>
    <Route
      path="/students"
      element={
        <ProtectedRoute allowedRoles={['ADMIN', 'NURSE', 'COUNSELOR', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN']}>
          <Students />
        </ProtectedRoute>
      }
    />
    <Route
      path="/students/:id/health"
      element={
        <ProtectedRoute allowedRoles={['ADMIN', 'NURSE', 'COUNSELOR']}>
          <StudentHealthRecords />
        </ProtectedRoute>
      }
    />
  </>
);
