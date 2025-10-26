/**
 * Students Page Routes - White Cross Healthcare Platform
 *
 * Route configuration for student management functionality with role-based access control.
 * Defines protected routes for student list management and individual health records viewing.
 *
 * @fileoverview Student module routing with FERPA and HIPAA compliance
 * @module pages/students/routes
 * @version 1.0.0
 */

import React from 'react';
import { Route } from 'react-router-dom';
import { ProtectedRoute } from '../../routes';
import Students from './Students';
import StudentHealthRecords from './StudentHealthRecords';

/**
 * Student Routes Component.
 *
 * Configures protected routes for student management features with appropriate
 * role-based access control. All routes are wrapped with ProtectedRoute to ensure
 * only authorized users can access student data.
 *
 * @component
 * @returns {React.ReactElement} Route configuration for student module
 *
 * @remarks
 * **Route Definitions:**
 *
 * 1. **Student List** (`/students`):
 *    - Allowed Roles: ADMIN, NURSE, COUNSELOR, SCHOOL_ADMIN, DISTRICT_ADMIN
 *    - Component: Students
 *    - Purpose: View, create, edit, and manage student records
 *    - FERPA Compliance: All student data access is logged and audited
 *
 * 2. **Student Health Records** (`/students/:id/health`):
 *    - Allowed Roles: ADMIN, NURSE, COUNSELOR (more restrictive than student list)
 *    - Component: StudentHealthRecords
 *    - Purpose: View and manage comprehensive health records for a specific student
 *    - HIPAA Compliance: PHI access requires additional logging and consent tracking
 *    - URL Parameter: `:id` - Student identifier
 *
 * **Access Control:**
 * - Routes use ProtectedRoute wrapper for authentication and authorization
 * - Role checking happens at route level before component renders
 * - Unauthorized access redirects to login or access denied page
 * - Health records require stricter role permissions (no SCHOOL_ADMIN or DISTRICT_ADMIN)
 *
 * **FERPA Compliance:**
 * - All student record access is subject to Family Educational Rights and Privacy Act
 * - Ensure audit logging is enabled for all route access
 * - Student records must only be accessible to educators with legitimate educational interest
 *
 * **HIPAA Compliance:**
 * - Health records contain Protected Health Information (PHI)
 * - Access restricted to healthcare professionals (NURSE, medical ADMIN, COUNSELOR)
 * - Additional consent verification may be required for sensitive records
 * - All PHI access must be logged with timestamp, user, and reason
 *
 * @example
 * ```tsx
 * // Usage in main router
 * import { StudentRoutes } from '@/pages/students/routes';
 *
 * function AppRouter() {
 *   return (
 *     <Routes>
 *       <Route path="/dashboard" element={<Dashboard />} />
 *       {StudentRoutes()}
 *       <Route path="/medications" element={<Medications />} />
 *     </Routes>
 *   );
 * }
 * ```
 *
 * @see {@link Students} for student list management component
 * @see {@link StudentHealthRecords} for health records component
 * @see {@link ProtectedRoute} for authentication/authorization wrapper
 */
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
