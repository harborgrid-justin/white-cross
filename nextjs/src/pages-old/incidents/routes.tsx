/**
 * Incidents Page Routes Configuration
 *
 * Comprehensive route configuration for enterprise-grade incident management
 * and emergency response tracking in school healthcare settings.
 *
 * @module pages/incidents/routes
 *
 * @remarks
 * This module configures all routing for the incident management system, including:
 *
 * **Route Categories:**
 * - Dashboard and analytics views
 * - Incident report CRUD operations
 * - Witness statement collection and management
 * - Follow-up action tracking and assignment
 * - Timeline and history visualization
 * - Document and evidence management
 * - Parent/guardian notification workflows
 * - Search and filtering interfaces
 * - Statistics and compliance reporting
 * - Print and export functionality
 *
 * **Role-Based Access Control:**
 * - **ADMIN**: Full access to all incident features
 * - **NURSE**: Create, edit, and manage incidents
 * - **COUNSELOR**: Create, edit, and manage incidents
 * - **SCHOOL_ADMIN**: View-only access to incidents and reports
 * - **DISTRICT_ADMIN**: Access to statistics and exports
 *
 * **Emergency Response Workflows:**
 * - Severity-based routing to appropriate views
 * - Critical incident fast-path routes
 * - Pending incident review queues
 * - Follow-up required incident tracking
 * - Unnotified parent alert routing
 *
 * **HIPAA Compliance:**
 * All routes enforce authentication via ProtectedRoute wrapper.
 * Access to PHI-containing incident data is logged for audit purposes.
 *
 * **Accessibility:**
 * - Semantic route structure for screen readers
 * - Logical navigation hierarchy
 * - Consistent URL patterns for predictable navigation
 *
 * @example
 * ```tsx
 * // In main app router
 * import { IncidentRoutes } from '@/pages/incidents/routes';
 *
 * function AppRouter() {
 *   return (
 *     <Routes>
 *       {IncidentRoutes()}
 *       // ... other routes
 *     </Routes>
 *   );
 * }
 * ```
 *
 * @see {@link ProtectedRoute} for authentication and authorization
 * @see {@link IncidentsDashboard} for dashboard component
 * @see {@link IncidentReportsList} for list view
 */

import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '../../routes';
import {
  IncidentsDashboard,
  IncidentReportsList,
  IncidentReportDetails,
  CreateIncidentForm,
  EditIncidentForm,
  IncidentReportForm,
  WitnessStatementsList,
  WitnessStatementForm,
  FollowUpActionsList,
  FollowUpActionForm,
  IncidentStatistics,
  IncidentSearch,
  PrintIncidentReport,
  ExportIncidentData,
  IncidentHistory,
  ParentNotificationPanel,
  IncidentTimeline,
  IncidentDocuments,
} from './components';

/**
 * Incident Routes Component
 *
 * Renders all route definitions for the incident management module with
 * role-based access control and emergency response workflows.
 *
 * @component
 * @returns {JSX.Element} React Router route configuration
 */
export const IncidentRoutes = () => (
  <>
    {/* Default redirect to dashboard */}
    <Route
      path="/incidents"
      element={<Navigate to="/incidents/dashboard" replace />}
    />

    {/* ==================== DASHBOARD ==================== */}
    <Route
      path="/incidents/dashboard"
      element={
        <ProtectedRoute allowedRoles={['ADMIN', 'NURSE', 'COUNSELOR', 'SCHOOL_ADMIN']}>
          <IncidentsDashboard />
        </ProtectedRoute>
      }
    />

    {/* ==================== INCIDENT REPORTS LIST ==================== */}
    <Route
      path="/incidents/list"
      element={
        <ProtectedRoute allowedRoles={['ADMIN', 'NURSE', 'COUNSELOR', 'SCHOOL_ADMIN']}>
          <IncidentReportsList />
        </ProtectedRoute>
      }
    />

    {/* ==================== CREATE INCIDENT ==================== */}
    <Route
      path="/incidents/create"
      element={
        <ProtectedRoute allowedRoles={['ADMIN', 'NURSE', 'COUNSELOR']}>
          <CreateIncidentForm />
        </ProtectedRoute>
      }
    />

    <Route
      path="/incidents/new"
      element={
        <ProtectedRoute allowedRoles={['ADMIN', 'NURSE', 'COUNSELOR']}>
          <IncidentReportForm />
        </ProtectedRoute>
      }
    />

    {/* ==================== INCIDENT DETAILS ==================== */}
    <Route
      path="/incidents/:id"
      element={
        <ProtectedRoute allowedRoles={['ADMIN', 'NURSE', 'COUNSELOR', 'SCHOOL_ADMIN']}>
          <IncidentReportDetails />
        </ProtectedRoute>
      }
    />

    <Route
      path="/incidents/:id/details"
      element={
        <ProtectedRoute allowedRoles={['ADMIN', 'NURSE', 'COUNSELOR', 'SCHOOL_ADMIN']}>
          <IncidentReportDetails />
        </ProtectedRoute>
      }
    />

    {/* ==================== EDIT INCIDENT ==================== */}
    <Route
      path="/incidents/:id/edit"
      element={
        <ProtectedRoute allowedRoles={['ADMIN', 'NURSE', 'COUNSELOR']}>
          <EditIncidentForm />
        </ProtectedRoute>
      }
    />

    {/* ==================== WITNESS STATEMENTS ==================== */}
    <Route
      path="/incidents/:id/witnesses"
      element={
        <ProtectedRoute allowedRoles={['ADMIN', 'NURSE', 'COUNSELOR']}>
          <WitnessStatementsList />
        </ProtectedRoute>
      }
    />

    <Route
      path="/incidents/:id/witnesses/add"
      element={
        <ProtectedRoute allowedRoles={['ADMIN', 'NURSE', 'COUNSELOR']}>
          <WitnessStatementForm />
        </ProtectedRoute>
      }
    />

    {/* ==================== FOLLOW-UP ACTIONS ==================== */}
    <Route
      path="/incidents/:id/follow-ups"
      element={
        <ProtectedRoute allowedRoles={['ADMIN', 'NURSE', 'COUNSELOR']}>
          <FollowUpActionsList />
        </ProtectedRoute>
      }
    />

    <Route
      path="/incidents/:id/follow-ups/add"
      element={
        <ProtectedRoute allowedRoles={['ADMIN', 'NURSE', 'COUNSELOR']}>
          <FollowUpActionForm />
        </ProtectedRoute>
      }
    />

    {/* ==================== TIMELINE ==================== */}
    <Route
      path="/incidents/:id/timeline"
      element={
        <ProtectedRoute allowedRoles={['ADMIN', 'NURSE', 'COUNSELOR', 'SCHOOL_ADMIN']}>
          <IncidentTimeline />
        </ProtectedRoute>
      }
    />

    {/* ==================== HISTORY ==================== */}
    <Route
      path="/incidents/:id/history"
      element={
        <ProtectedRoute allowedRoles={['ADMIN', 'NURSE', 'COUNSELOR', 'SCHOOL_ADMIN']}>
          <IncidentHistory />
        </ProtectedRoute>
      }
    />

    {/* ==================== DOCUMENTS ==================== */}
    <Route
      path="/incidents/:id/documents"
      element={
        <ProtectedRoute allowedRoles={['ADMIN', 'NURSE', 'COUNSELOR', 'SCHOOL_ADMIN']}>
          <IncidentDocuments />
        </ProtectedRoute>
      }
    />

    {/* ==================== NOTIFICATIONS ==================== */}
    <Route
      path="/incidents/:id/notifications"
      element={
        <ProtectedRoute allowedRoles={['ADMIN', 'NURSE', 'COUNSELOR']}>
          <ParentNotificationPanel />
        </ProtectedRoute>
      }
    />

    {/* ==================== SEARCH ==================== */}
    <Route
      path="/incidents/search"
      element={
        <ProtectedRoute allowedRoles={['ADMIN', 'NURSE', 'COUNSELOR', 'SCHOOL_ADMIN']}>
          <IncidentSearch />
        </ProtectedRoute>
      }
    />

    {/* ==================== STATISTICS & REPORTS ==================== */}
    <Route
      path="/incidents/statistics"
      element={
        <ProtectedRoute allowedRoles={['ADMIN', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN']}>
          <IncidentStatistics />
        </ProtectedRoute>
      }
    />

    <Route
      path="/incidents/reports"
      element={
        <ProtectedRoute allowedRoles={['ADMIN', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN']}>
          <IncidentStatistics />
        </ProtectedRoute>
      }
    />

    {/* ==================== PRINT & EXPORT ==================== */}
    <Route
      path="/incidents/:id/print"
      element={
        <ProtectedRoute allowedRoles={['ADMIN', 'NURSE', 'COUNSELOR', 'SCHOOL_ADMIN']}>
          <PrintIncidentReport />
        </ProtectedRoute>
      }
    />

    <Route
      path="/incidents/export"
      element={
        <ProtectedRoute allowedRoles={['ADMIN', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN']}>
          <ExportIncidentData />
        </ProtectedRoute>
      }
    />

    {/* ==================== FILTERED VIEWS ==================== */}
    <Route
      path="/incidents/critical"
      element={
        <ProtectedRoute allowedRoles={['ADMIN', 'NURSE', 'COUNSELOR', 'SCHOOL_ADMIN']}>
          <IncidentReportsList />
        </ProtectedRoute>
      }
    />

    <Route
      path="/incidents/pending"
      element={
        <ProtectedRoute allowedRoles={['ADMIN', 'NURSE', 'COUNSELOR']}>
          <IncidentReportsList />
        </ProtectedRoute>
      }
    />

    <Route
      path="/incidents/follow-up-required"
      element={
        <ProtectedRoute allowedRoles={['ADMIN', 'NURSE', 'COUNSELOR']}>
          <IncidentReportsList />
        </ProtectedRoute>
      }
    />

    <Route
      path="/incidents/unnotified-parents"
      element={
        <ProtectedRoute allowedRoles={['ADMIN', 'NURSE', 'COUNSELOR']}>
          <IncidentReportsList />
        </ProtectedRoute>
      }
    />
  </>
);
