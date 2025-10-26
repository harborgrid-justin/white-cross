/**
 * @fileoverview Communication module route configuration with role-based access control
 * @module pages/communication/routes
 */

import React from 'react';
import { RouteObject } from 'react-router-dom';
import { ProtectedRoute } from '../../routes';
import Communication from './Communication';

/**
 * Communication module routes with role-based access control.
 *
 * Provides routing configuration for the communication management system,
 * restricting access to ADMIN, NURSE, and STAFF roles only. All routes
 * render the main Communication component with different URL paths for
 * bookmarking and navigation flexibility.
 *
 * @remarks
 * ## Route Structure
 * - `/communication` - Main communication hub (compose, history, templates)
 * - `/communication/messages` - Direct link to messages (same component)
 *
 * ## Access Control
 * - Allowed Roles: ADMIN, NURSE, STAFF
 * - Parents and students cannot access communication management interface
 * - Role validation enforced via ProtectedRoute wrapper
 *
 * ## Integration
 * - Routes registered in main app router configuration
 * - Uses React Router 7 RouteObject type for type safety
 * - ProtectedRoute component handles authentication and authorization
 *
 * @example
 * ```tsx
 * // Import in main router configuration
 * import { communicationRoutes } from './pages/communication/routes';
 *
 * const router = createBrowserRouter([
 *   {
 *     path: '/',
 *     element: <Layout />,
 *     children: [
 *       ...communicationRoutes,
 *       // other routes
 *     ]
 *   }
 * ]);
 * ```
 *
 * @see {@link Communication} for main component
 * @see {@link ProtectedRoute} for access control implementation
 */
export const communicationRoutes: RouteObject[] = [
  {
    path: 'communication',
    children: [
      {
        path: '',
        element: (
          <ProtectedRoute allowedRoles={['ADMIN', 'NURSE', 'STAFF']}>
            <Communication />
          </ProtectedRoute>
        ),
      },
      {
        path: 'messages',
        element: (
          <ProtectedRoute allowedRoles={['ADMIN', 'NURSE', 'STAFF']}>
            <Communication />
          </ProtectedRoute>
        ),
      },
    ],
  },
];
