import React from 'react';
import { RouteObject } from 'react-router-dom';
import { ProtectedRoute } from '../../routes';
import Appointments from './Appointments';
import HealthRecords from './HealthRecords';
import Medications from './Medications';

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
