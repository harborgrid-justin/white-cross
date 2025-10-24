import React from 'react';
import { RouteObject } from 'react-router-dom';
import { ProtectedRoute } from '../../routes';
import ReportsGenerate from './ReportsGenerate';
import ScheduledReports from './ScheduledReports';

export const reportsRoutes: RouteObject[] = [
  {
    path: 'reports',
    children: [
      {
        path: '',
        element: (
          <ProtectedRoute allowedRoles={['ADMIN', 'NURSE', 'SCHOOL_ADMIN']}>
            <ReportsGenerate />
          </ProtectedRoute>
        ),
      },
      {
        path: 'generate',
        element: (
          <ProtectedRoute allowedRoles={['ADMIN', 'NURSE', 'SCHOOL_ADMIN']}>
            <ReportsGenerate />
          </ProtectedRoute>
        ),
      },
      {
        path: 'scheduled',
        element: (
          <ProtectedRoute allowedRoles={['ADMIN', 'SCHOOL_ADMIN']}>
            <ScheduledReports />
          </ProtectedRoute>
        ),
      },
    ],
  },
];
