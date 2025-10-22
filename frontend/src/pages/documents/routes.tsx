import React from 'react';
import { RouteObject } from 'react-router-dom';
import { ProtectedRoute } from '../../routes';
import { Documents } from './components';

export const documentsRoutes: RouteObject[] = [
  {
    path: 'documents',
    children: [
      {
        path: '',
        element: (
          <ProtectedRoute allowedRoles={['ADMIN', 'NURSE', 'COUNSELOR']}>
            <Documents />
          </ProtectedRoute>
        ),
      },
    ],
  },
];
