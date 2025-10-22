import React from 'react';
import { RouteObject } from 'react-router-dom';
import { ProtectedRoute } from '../../routes';
import { Appointments, HealthRecords, Medications } from './components';

export const healthRoutes: RouteObject[] = [
  {
    path: 'health',
    children: [
      {
        path: 'appointments',
        element: (
          <ProtectedRoute allowedRoles={['ADMIN', 'NURSE', 'STAFF']}>
            <Appointments />
          </ProtectedRoute>
        ),
      },
      {
        path: 'records',
        element: (
          <ProtectedRoute allowedRoles={['ADMIN', 'NURSE']}>
            <HealthRecords />
          </ProtectedRoute>
        ),
      },
      {
        path: 'medications',
        element: (
          <ProtectedRoute allowedRoles={['ADMIN', 'NURSE']}>
            <Medications />
          </ProtectedRoute>
        ),
      },
    ],
  },
];
