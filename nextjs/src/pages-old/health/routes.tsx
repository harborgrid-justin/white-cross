/**
 * Health module routing configuration.
 *
 * @module pages/health/routes
 *
 * @description
 * Defines protected routes for the health management module including appointments,
 * health records, and medication management. All routes implement role-based access
 * control (RBAC) to ensure only authorized healthcare personnel can access sensitive
 * patient health information.
 *
 * @remarks
 * - **HIPAA Compliance**: All routes require authentication and proper role authorization
 * - **RBAC Implementation**: Routes are protected with role-specific access controls
 * - **Healthcare Personnel Only**: Appointments accessible by ADMIN, NURSE, STAFF
 * - **Protected Health Information**: Health records and medications restricted to ADMIN, NURSE only
 * - **Security**: ProtectedRoute wrapper ensures authentication and authorization
 *
 * @see {@link Appointments} for appointment scheduling and management
 * @see {@link HealthRecords} for comprehensive health records management
 * @see {@link Medications} for medication tracking and inventory
 * @see {@link ProtectedRoute} for authentication and authorization wrapper
 *
 * @example
 * ```tsx
 * // Import and use in main router configuration
 * import { healthRoutes } from '@/pages/health/routes';
 *
 * const router = createBrowserRouter([
 *   {
 *     path: '/',
 *     element: <Layout />,
 *     children: [...healthRoutes, ...otherRoutes]
 *   }
 * ]);
 * ```
 */

import React from 'react';
import { RouteObject } from 'react-router-dom';
import { ProtectedRoute } from '../../routes';
import Appointments from './Appointments';
import HealthRecords from './HealthRecords';
import Medications from './Medications';

/**
 * Health module route configuration array.
 *
 * @remarks
 * Routes are structured as:
 * - `/health/appointments` - Appointment scheduling (ADMIN, NURSE, STAFF)
 * - `/health/records` - Health records management (ADMIN, NURSE)
 * - `/health/medications` - Medication management (ADMIN, NURSE)
 *
 * Each route implements HIPAA-compliant access controls and audit logging.
 */
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
