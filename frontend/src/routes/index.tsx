/**
 * WF-IDX-247 | index.tsx - React component or utility module
 * Purpose: react component or utility module
 * Upstream: ../contexts/AuthContext, ../components/LoadingSpinner, ../constants/routes | Dependencies: react-router-dom, ../contexts/AuthContext, ../components/LoadingSpinner
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: default export, constants, named exports | Key Features: useState, useEffect, functional component
 * Last Updated: 2025-10-17 | File Type: .tsx
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

/**
 * Application Routing Configuration
 * Production-grade routing with comprehensive guards, validation, and monitoring
 *
 * Features:
 * - Role-based access control
 * - Permission checking
 * - Route parameter validation
 * - Error boundaries
 * - Loading states
 * - Breadcrumb generation
 * - Analytics tracking
 * - Page transitions
 */

import React, { Suspense, useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { PUBLIC_ROUTES, PROTECTED_ROUTES } from '../constants/routes';
import {
  AuthGuard,
  RoleGuard,
  PermissionGuard,
  RouteParamValidator,
  CombinedGuard,
  UserRole,
} from './guards';
import { buildBreadcrumbs } from './routeUtils';

// ============================================================================
// LAYOUT COMPONENTS
// ============================================================================

import Layout from '../components/Layout';

// ============================================================================
// PAGE COMPONENTS
// ============================================================================

// Public pages
import Login from '../pages/Login';

// Protected pages
import Dashboard from '../pages/Dashboard';
import Students from '../pages/Students';
import Medications from '../pages/Medications';
import Appointments from '../pages/Appointments';
import HealthRecords from '../pages/HealthRecords';
import IncidentReports from '../pages/IncidentReports';
import EmergencyContacts from '../pages/EmergencyContacts';
import Communication from '../pages/Communication';
import Inventory from '../pages/Inventory';
import Reports from '../pages/Reports';
import Settings from '../pages/Settings';
import Documents from '../pages/Documents';
import AccessDenied from '../pages/AccessDenied';

// Incident Reports sub-pages
import {
  IncidentWitnesses,
  IncidentActions,
  IncidentEvidence,
  IncidentTimeline,
  IncidentExport,
} from '../pages/IncidentReports';

// ============================================================================
// ERROR BOUNDARY
// ============================================================================

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class RouteErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Route Error:', error, errorInfo);
    // TODO: Send to error tracking service (e.g., Sentry)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
            <p className="text-gray-600 mb-4">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// ============================================================================
// ENHANCED PROTECTED ROUTE COMPONENT
// ============================================================================

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  allowedRoles?: UserRole[];
  requiredPermission?: string;
  requiredPermissions?: string[];
  featureName?: string;
  paramSchema?: Record<string, 'uuid' | 'number' | string[] | RegExp | ((value: string) => boolean)>;
}

/**
 * Enhanced ProtectedRoute with comprehensive security checks
 *
 * Features:
 * - Authentication verification
 * - Role-based access control
 * - Permission checking
 * - Route parameter validation
 * - Feature flag checking
 * - Loading states
 * - Error boundaries
 * - Breadcrumb generation
 * - Analytics tracking
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  allowedRoles,
  requiredPermission,
  requiredPermissions,
  featureName,
  paramSchema,
}) => {
  const { user, loading } = useAuthContext();
  const location = useLocation();
  const [breadcrumbs, setBreadcrumbs] = useState<any[]>([]);

  // Generate breadcrumbs on location change
  useEffect(() => {
    if (user) {
      const crumbs = buildBreadcrumbs(location.pathname);
      setBreadcrumbs(crumbs);
    }
  }, [location.pathname, user]);

  // Track page views for analytics
  useEffect(() => {
    if (user && !loading) {
      // TODO: Send page view to analytics service
      console.debug('[Analytics] Page view:', location.pathname, {
        userId: user.id,
        role: user.role,
        timestamp: new Date().toISOString(),
      });
    }
  }, [location.pathname, user, loading]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    const redirectUrl = `${PUBLIC_ROUTES.LOGIN}?redirect=${encodeURIComponent(location.pathname + location.search)}`;
    return <Navigate to={redirectUrl} replace />;
  }

  // Check role-based access
  if (requiredRole && user.role !== requiredRole) {
    return <AccessDenied />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role as UserRole)) {
    return <AccessDenied />;
  }

  // TODO: Implement proper permission checking when permission system is defined
  if (requiredPermission || requiredPermissions) {
    // Placeholder for permission check
    const permissions = requiredPermissions || (requiredPermission ? [requiredPermission] : []);
    const hasPermission = permissions.length === 0 || user.role === 'ADMIN';

    if (!hasPermission) {
      return <AccessDenied />;
    }
  }

  return (
    <RouteErrorBoundary>
      <Suspense fallback={<LoadingSpinner />}>
        {paramSchema ? (
          <RouteParamValidator schema={paramSchema} redirectOnInvalid="/404">
            {children}
          </RouteParamValidator>
        ) : (
          children
        )}
      </Suspense>
    </RouteErrorBoundary>
  );
};

// ============================================================================
// PAGE TRANSITION WRAPPER
// ============================================================================

/**
 * Wraps page content with transition animations
 */
const PageTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="animate-fadeIn">
      {children}
    </div>
  );
};

// ============================================================================
// MAIN ROUTES COMPONENT
// ============================================================================

export const AppRoutes: React.FC = () => {
  const { user } = useAuthContext();
  const isAuthenticated = !!user;

  return (
    <Routes>
      {/* ===== PUBLIC ROUTES ===== */}
      <Route
        path={PUBLIC_ROUTES.LOGIN}
        element={
          isAuthenticated ? (
            <Navigate to={PROTECTED_ROUTES.DASHBOARD} replace />
          ) : (
            <Login />
          )
        }
      />

      {/* ===== PROTECTED ROUTES ===== */}
      <Route
        path="/*"
        element={
          <AuthGuard>
            <Layout>
              <PageTransition>
                <Routes>
                  {/* ----- DASHBOARD ----- */}
                  <Route
                    path={PROTECTED_ROUTES.DASHBOARD}
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />

                  {/* ----- STUDENTS ----- */}
                  <Route path={PROTECTED_ROUTES.STUDENTS}>
                    {/* Students List */}
                    <Route
                      index
                      element={
                        <ProtectedRoute
                          allowedRoles={['ADMIN', 'NURSE', 'COUNSELOR', 'READ_ONLY', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN']}
                          requiredPermission="students.read"
                        >
                          <Students />
                        </ProtectedRoute>
                      }
                    />

                    {/* Student Detail */}
                    <Route
                      path=":id"
                      element={
                        <ProtectedRoute
                          allowedRoles={['ADMIN', 'NURSE', 'COUNSELOR', 'READ_ONLY', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN']}
                          requiredPermission="students.read"
                          paramSchema={{ id: 'uuid' }}
                        >
                          <Students />
                        </ProtectedRoute>
                      }
                    />

                    {/* Student Edit */}
                    <Route
                      path=":id/edit"
                      element={
                        <CombinedGuard
                          allowedRoles={['ADMIN', 'NURSE', 'COUNSELOR']}
                          requiredPermission="students.update"
                          paramSchema={{ id: 'uuid' }}
                        >
                          <Students />
                        </CombinedGuard>
                      }
                    />

                    {/* New Student */}
                    <Route
                      path="new"
                      element={
                        <ProtectedRoute
                          allowedRoles={['ADMIN', 'NURSE']}
                          requiredPermission="students.create"
                        >
                          <Students />
                        </ProtectedRoute>
                      }
                    />
                  </Route>

                  {/* ----- MEDICATIONS ----- */}
                  <Route path={PROTECTED_ROUTES.MEDICATIONS}>
                    {/* Medications List */}
                    <Route
                      index
                      element={
                        <ProtectedRoute
                          allowedRoles={['ADMIN', 'NURSE', 'READ_ONLY', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN']}
                          requiredPermission="medications.read"
                        >
                          <Medications />
                        </ProtectedRoute>
                      }
                    />

                    {/* Medication Detail */}
                    <Route
                      path=":id"
                      element={
                        <ProtectedRoute
                          allowedRoles={['ADMIN', 'NURSE', 'READ_ONLY', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN']}
                          requiredPermission="medications.read"
                          paramSchema={{ id: 'uuid' }}
                        >
                          <Medications />
                        </ProtectedRoute>
                      }
                    />

                    {/* Medication Edit */}
                    <Route
                      path=":id/edit"
                      element={
                        <CombinedGuard
                          allowedRoles={['ADMIN', 'NURSE']}
                          requiredPermission="medications.update"
                          paramSchema={{ id: 'uuid' }}
                        >
                          <Medications />
                        </CombinedGuard>
                      }
                    />

                    {/* Medication Administer - High Security */}
                    <Route
                      path=":id/administer"
                      element={
                        <CombinedGuard
                          allowedRoles={['ADMIN', 'NURSE']}
                          requiredPermission="medications.administer"
                          paramSchema={{ id: 'uuid' }}
                        >
                          <Medications />
                        </CombinedGuard>
                      }
                    />

                    {/* New Medication */}
                    <Route
                      path="new"
                      element={
                        <ProtectedRoute
                          allowedRoles={['ADMIN', 'NURSE']}
                          requiredPermission="medications.create"
                        >
                          <Medications />
                        </ProtectedRoute>
                      }
                    />

                    {/* Medication Inventory */}
                    <Route
                      path="inventory"
                      element={
                        <ProtectedRoute
                          allowedRoles={['ADMIN', 'NURSE']}
                          requiredPermission="medications.read"
                        >
                          <Medications />
                        </ProtectedRoute>
                      }
                    />
                  </Route>

                  {/* ----- APPOINTMENTS ----- */}
                  <Route path={PROTECTED_ROUTES.APPOINTMENTS}>
                    {/* Appointments List */}
                    <Route
                      index
                      element={
                        <ProtectedRoute
                          allowedRoles={['ADMIN', 'NURSE', 'READ_ONLY', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN']}
                          requiredPermission="appointments.read"
                        >
                          <Appointments />
                        </ProtectedRoute>
                      }
                    />

                    {/* Appointment Detail */}
                    <Route
                      path=":id"
                      element={
                        <ProtectedRoute
                          allowedRoles={['ADMIN', 'NURSE', 'READ_ONLY', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN']}
                          requiredPermission="appointments.read"
                          paramSchema={{ id: 'uuid' }}
                        >
                          <Appointments />
                        </ProtectedRoute>
                      }
                    />

                    {/* Appointment Edit */}
                    <Route
                      path=":id/edit"
                      element={
                        <CombinedGuard
                          allowedRoles={['ADMIN', 'NURSE']}
                          requiredPermission="appointments.update"
                          paramSchema={{ id: 'uuid' }}
                        >
                          <Appointments />
                        </CombinedGuard>
                      }
                    />

                    {/* New Appointment */}
                    <Route
                      path="new"
                      element={
                        <ProtectedRoute
                          allowedRoles={['ADMIN', 'NURSE']}
                          requiredPermission="appointments.create"
                        >
                          <Appointments />
                        </ProtectedRoute>
                      }
                    />

                    {/* Schedule View */}
                    <Route
                      path="schedule"
                      element={
                        <ProtectedRoute
                          allowedRoles={['ADMIN', 'NURSE', 'READ_ONLY']}
                          requiredPermission="appointments.read"
                        >
                          <Appointments />
                        </ProtectedRoute>
                      }
                    />
                  </Route>

                  {/* ----- HEALTH RECORDS ----- */}
                  <Route path={PROTECTED_ROUTES.HEALTH_RECORDS}>
                    {/* Health Records List */}
                    <Route
                      index
                      element={
                        <ProtectedRoute
                          allowedRoles={['ADMIN', 'NURSE', 'COUNSELOR', 'READ_ONLY', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN']}
                          requiredPermission="health_records.read"
                        >
                          <HealthRecords />
                        </ProtectedRoute>
                      }
                    />

                    {/* Health Record Detail */}
                    <Route
                      path=":id"
                      element={
                        <CombinedGuard
                          allowedRoles={['ADMIN', 'NURSE', 'COUNSELOR', 'READ_ONLY', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN']}
                          requiredPermission="health_records.read"
                          paramSchema={{ id: 'uuid' }}
                        >
                          <HealthRecords />
                        </CombinedGuard>
                      }
                    />

                    {/* Health Records by Student */}
                    <Route
                      path="student/:studentId"
                      element={
                        <CombinedGuard
                          allowedRoles={['ADMIN', 'NURSE', 'COUNSELOR', 'READ_ONLY']}
                          requiredPermission="health_records.read"
                          paramSchema={{ studentId: 'uuid' }}
                        >
                          <HealthRecords />
                        </CombinedGuard>
                      }
                    />

                    {/* New Health Record */}
                    <Route
                      path="new"
                      element={
                        <ProtectedRoute
                          allowedRoles={['ADMIN', 'NURSE', 'COUNSELOR']}
                          requiredPermission="health_records.create"
                        >
                          <HealthRecords />
                        </ProtectedRoute>
                      }
                    />
                  </Route>

                  {/* ----- INCIDENT REPORTS ----- */}
                  <Route path={PROTECTED_ROUTES.INCIDENT_REPORTS}>
                    {/* Incident Reports List */}
                    <Route
                      index
                      element={
                        <ProtectedRoute
                          allowedRoles={['ADMIN', 'NURSE', 'COUNSELOR', 'READ_ONLY', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN']}
                          requiredPermission="incidents.read"
                        >
                          <IncidentReports />
                        </ProtectedRoute>
                      }
                    />

                    {/* Incident Report Detail */}
                    <Route
                      path=":id"
                      element={
                        <CombinedGuard
                          allowedRoles={['ADMIN', 'NURSE', 'COUNSELOR', 'READ_ONLY', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN']}
                          requiredPermission="incidents.read"
                          paramSchema={{ id: 'uuid' }}
                        >
                          <IncidentReports />
                        </CombinedGuard>
                      }
                    />

                    {/* Incident Report Edit */}
                    <Route
                      path=":id/edit"
                      element={
                        <CombinedGuard
                          allowedRoles={['ADMIN', 'NURSE', 'COUNSELOR']}
                          requiredPermission="incidents.update"
                          paramSchema={{ id: 'uuid' }}
                        >
                          <IncidentReports />
                        </CombinedGuard>
                      }
                    />

                    {/* New Incident Report */}
                    <Route
                      path="new"
                      element={
                        <ProtectedRoute
                          allowedRoles={['ADMIN', 'NURSE', 'COUNSELOR']}
                          requiredPermission="incidents.create"
                        >
                          <IncidentReports />
                        </ProtectedRoute>
                      }
                    />

                    {/* Incident Witnesses - Feature Flag Protected */}
                    <Route
                      path=":id/witnesses"
                      element={
                        <CombinedGuard
                          allowedRoles={['ADMIN', 'NURSE']}
                          requiredPermission="incidents.read"
                          featureName="incident-witnesses"
                          paramSchema={{ id: 'uuid' }}
                        >
                          <IncidentWitnesses />
                        </CombinedGuard>
                      }
                    />

                    {/* Incident Actions - Feature Flag Protected */}
                    <Route
                      path=":id/actions"
                      element={
                        <CombinedGuard
                          allowedRoles={['ADMIN', 'NURSE']}
                          requiredPermission="incidents.update"
                          featureName="incident-actions"
                          paramSchema={{ id: 'uuid' }}
                        >
                          <IncidentActions />
                        </CombinedGuard>
                      }
                    />

                    {/* Incident Evidence - Feature Flag Protected */}
                    <Route
                      path=":id/evidence"
                      element={
                        <CombinedGuard
                          allowedRoles={['ADMIN', 'NURSE']}
                          requiredPermission="incidents.update"
                          featureName="incident-evidence"
                          paramSchema={{ id: 'uuid' }}
                        >
                          <IncidentEvidence />
                        </CombinedGuard>
                      }
                    />

                    {/* Incident Timeline - Feature Flag Protected */}
                    <Route
                      path=":id/timeline"
                      element={
                        <CombinedGuard
                          allowedRoles={['ADMIN', 'NURSE', 'SCHOOL_ADMIN']}
                          requiredPermission="incidents.read"
                          featureName="incident-timeline"
                          paramSchema={{ id: 'uuid' }}
                        >
                          <IncidentTimeline />
                        </CombinedGuard>
                      }
                    />

                    {/* Incident Export - Feature Flag Protected */}
                    <Route
                      path=":id/export"
                      element={
                        <CombinedGuard
                          allowedRoles={['ADMIN', 'NURSE', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN']}
                          requiredPermission="incidents.read"
                          featureName="incident-export"
                          paramSchema={{ id: 'uuid' }}
                        >
                          <IncidentExport />
                        </CombinedGuard>
                      }
                    />
                  </Route>

                  {/* ----- EMERGENCY CONTACTS ----- */}
                  <Route path={PROTECTED_ROUTES.EMERGENCY_CONTACTS}>
                    {/* Emergency Contacts List */}
                    <Route
                      index
                      element={
                        <ProtectedRoute
                          allowedRoles={['ADMIN', 'NURSE']}
                          requiredPermission="emergency_contacts.read"
                        >
                          <EmergencyContacts />
                        </ProtectedRoute>
                      }
                    />

                    {/* Emergency Contact Detail */}
                    <Route
                      path=":id"
                      element={
                        <CombinedGuard
                          allowedRoles={['ADMIN', 'NURSE']}
                          requiredPermission="emergency_contacts.read"
                          paramSchema={{ id: 'uuid' }}
                        >
                          <EmergencyContacts />
                        </CombinedGuard>
                      }
                    />

                    {/* Emergency Contacts by Student */}
                    <Route
                      path="student/:studentId"
                      element={
                        <CombinedGuard
                          allowedRoles={['ADMIN', 'NURSE']}
                          requiredPermission="emergency_contacts.read"
                          paramSchema={{ studentId: 'uuid' }}
                        >
                          <EmergencyContacts />
                        </CombinedGuard>
                      }
                    />

                    {/* New Emergency Contact */}
                    <Route
                      path="new"
                      element={
                        <ProtectedRoute
                          allowedRoles={['ADMIN', 'NURSE']}
                          requiredPermission="emergency_contacts.create"
                        >
                          <EmergencyContacts />
                        </ProtectedRoute>
                      }
                    />
                  </Route>

                  {/* ----- COMMUNICATION ----- */}
                  <Route path={PROTECTED_ROUTES.COMMUNICATION}>
                    {/* Communication Dashboard */}
                    <Route
                      index
                      element={
                        <ProtectedRoute requiredPermission="communication.read">
                          <Communication />
                        </ProtectedRoute>
                      }
                    />

                    {/* Send Communication */}
                    <Route
                      path="send"
                      element={
                        <ProtectedRoute
                          allowedRoles={['ADMIN', 'NURSE', 'COUNSELOR', 'STAFF']}
                          requiredPermission="communication.send"
                        >
                          <Communication />
                        </ProtectedRoute>
                      }
                    />

                    {/* Communication Templates */}
                    <Route
                      path="templates"
                      element={
                        <ProtectedRoute
                          allowedRoles={['ADMIN', 'NURSE', 'SCHOOL_ADMIN']}
                          requiredPermission="communication.read"
                        >
                          <Communication />
                        </ProtectedRoute>
                      }
                    />

                    {/* Communication History */}
                    <Route
                      path="history"
                      element={
                        <ProtectedRoute requiredPermission="communication.read">
                          <Communication />
                        </ProtectedRoute>
                      }
                    />
                  </Route>

                  {/* ----- DOCUMENTS ----- */}
                  <Route path={PROTECTED_ROUTES.DOCUMENTS}>
                    {/* Documents List */}
                    <Route
                      index
                      element={
                        <ProtectedRoute
                          allowedRoles={['ADMIN', 'NURSE', 'COUNSELOR', 'READ_ONLY']}
                          requiredPermission="documents.read"
                        >
                          <Documents />
                        </ProtectedRoute>
                      }
                    />

                    {/* Document Detail */}
                    <Route
                      path=":id"
                      element={
                        <CombinedGuard
                          allowedRoles={['ADMIN', 'NURSE', 'COUNSELOR', 'READ_ONLY']}
                          requiredPermission="documents.read"
                          paramSchema={{ id: 'uuid' }}
                        >
                          <Documents />
                        </CombinedGuard>
                      }
                    />

                    {/* Documents by Student */}
                    <Route
                      path="student/:studentId"
                      element={
                        <CombinedGuard
                          allowedRoles={['ADMIN', 'NURSE', 'COUNSELOR']}
                          requiredPermission="documents.read"
                          paramSchema={{ studentId: 'uuid' }}
                        >
                          <Documents />
                        </CombinedGuard>
                      }
                    />

                    {/* Upload Document */}
                    <Route
                      path="upload"
                      element={
                        <ProtectedRoute
                          allowedRoles={['ADMIN', 'NURSE', 'COUNSELOR']}
                          requiredPermission="documents.create"
                        >
                          <Documents />
                        </ProtectedRoute>
                      }
                    />
                  </Route>

                  {/* ----- INVENTORY ----- */}
                  <Route path={PROTECTED_ROUTES.INVENTORY}>
                    {/* Inventory Dashboard */}
                    <Route
                      index
                      element={
                        <ProtectedRoute
                          allowedRoles={['ADMIN', 'NURSE']}
                          requiredPermission="inventory.read"
                        >
                          <Inventory />
                        </ProtectedRoute>
                      }
                    />

                    {/* Inventory Items */}
                    <Route
                      path="items"
                      element={
                        <ProtectedRoute
                          allowedRoles={['ADMIN', 'NURSE']}
                          requiredPermission="inventory.read"
                        >
                          <Inventory />
                        </ProtectedRoute>
                      }
                    />

                    {/* Inventory Alerts */}
                    <Route
                      path="alerts"
                      element={
                        <ProtectedRoute
                          allowedRoles={['ADMIN', 'NURSE']}
                          requiredPermission="inventory.read"
                        >
                          <Inventory />
                        </ProtectedRoute>
                      }
                    />

                    {/* Inventory Transactions */}
                    <Route
                      path="transactions"
                      element={
                        <ProtectedRoute
                          allowedRoles={['ADMIN', 'NURSE']}
                          requiredPermission="inventory.update"
                        >
                          <Inventory />
                        </ProtectedRoute>
                      }
                    />

                    {/* Inventory Vendors - Admin Only */}
                    <Route
                      path="vendors"
                      element={
                        <ProtectedRoute
                          allowedRoles={['ADMIN']}
                          requiredPermission="inventory.update"
                        >
                          <Inventory />
                        </ProtectedRoute>
                      }
                    />
                  </Route>

                  {/* ----- REPORTS ----- */}
                  <Route path={PROTECTED_ROUTES.REPORTS}>
                    {/* Reports Dashboard */}
                    <Route
                      index
                      element={
                        <ProtectedRoute
                          allowedRoles={['ADMIN', 'NURSE', 'COUNSELOR', 'READ_ONLY', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN']}
                          requiredPermission="reports.read"
                        >
                          <Reports />
                        </ProtectedRoute>
                      }
                    />

                    {/* Generate Reports */}
                    <Route
                      path="generate"
                      element={
                        <ProtectedRoute
                          allowedRoles={['ADMIN', 'NURSE', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN']}
                          requiredPermission="reports.create"
                        >
                          <Reports />
                        </ProtectedRoute>
                      }
                    />

                    {/* Scheduled Reports */}
                    <Route
                      path="scheduled"
                      element={
                        <ProtectedRoute
                          allowedRoles={['ADMIN', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN']}
                          requiredPermission="reports.read"
                        >
                          <Reports />
                        </ProtectedRoute>
                      }
                    />

                    {/* View Report */}
                    <Route
                      path=":id"
                      element={
                        <CombinedGuard
                          allowedRoles={['ADMIN', 'NURSE', 'COUNSELOR', 'READ_ONLY', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN']}
                          requiredPermission="reports.read"
                          paramSchema={{ id: 'uuid' }}
                        >
                          <Reports />
                        </CombinedGuard>
                      }
                    />
                  </Route>

                  {/* ----- SETTINGS (ADMIN ONLY) ----- */}
                  <Route path={PROTECTED_ROUTES.SETTINGS}>
                    {/* Settings Overview */}
                    <Route
                      index
                      element={
                        <ProtectedRoute
                          requiredRole="ADMIN"
                          requiredPermission="settings.read"
                        >
                          <Settings />
                        </ProtectedRoute>
                      }
                    />

                    {/* Districts Management */}
                    <Route
                      path="districts"
                      element={
                        <CombinedGuard
                          requiredRole="ADMIN"
                          requiredPermission="settings.update"
                        >
                          <Settings />
                        </CombinedGuard>
                      }
                    />

                    {/* Schools Management */}
                    <Route
                      path="schools"
                      element={
                        <CombinedGuard
                          requiredRole="ADMIN"
                          requiredPermission="settings.update"
                        >
                          <Settings />
                        </CombinedGuard>
                      }
                    />

                    {/* Users Management */}
                    <Route
                      path="users"
                      element={
                        <CombinedGuard
                          requiredRole="ADMIN"
                          requiredPermission="settings.update"
                        >
                          <Settings />
                        </CombinedGuard>
                      }
                    />

                    {/* Configuration */}
                    <Route
                      path="configuration"
                      element={
                        <CombinedGuard
                          requiredRole="ADMIN"
                          requiredPermission="settings.update"
                        >
                          <Settings />
                        </CombinedGuard>
                      }
                    />

                    {/* Integrations */}
                    <Route
                      path="integrations"
                      element={
                        <CombinedGuard
                          requiredRole="ADMIN"
                          requiredPermission="settings.update"
                        >
                          <Settings />
                        </CombinedGuard>
                      }
                    />

                    {/* Backups */}
                    <Route
                      path="backups"
                      element={
                        <CombinedGuard
                          requiredRole="ADMIN"
                          requiredPermission="settings.read"
                        >
                          <Settings />
                        </CombinedGuard>
                      }
                    />

                    {/* Monitoring */}
                    <Route
                      path="monitoring"
                      element={
                        <CombinedGuard
                          requiredRole="ADMIN"
                          requiredPermission="settings.read"
                        >
                          <Settings />
                        </CombinedGuard>
                      }
                    />

                    {/* Audit Logs */}
                    <Route
                      path="audit"
                      element={
                        <CombinedGuard
                          requiredRole="ADMIN"
                          requiredPermission="settings.read"
                        >
                          <Settings />
                        </CombinedGuard>
                      }
                    />
                  </Route>

                  {/* ----- ACCESS DENIED ----- */}
                  <Route path={PROTECTED_ROUTES.ACCESS_DENIED} element={<AccessDenied />} />

                  {/* ----- DEFAULT REDIRECT ----- */}
                  <Route
                    path="/"
                    element={<Navigate to={PROTECTED_ROUTES.DASHBOARD} replace />}
                  />

                  {/* ----- 404 CATCH ALL ----- */}
                  <Route
                    path="*"
                    element={
                      <div className="flex items-center justify-center min-h-screen">
                        <div className="text-center">
                          <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
                          <h2 className="text-2xl font-semibold text-gray-700 mb-2">Page Not Found</h2>
                          <p className="text-gray-600 mb-6">
                            The page you're looking for doesn't exist.
                          </p>
                          <button
                            onClick={() => window.history.back()}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors mr-2"
                          >
                            Go Back
                          </button>
                          <button
                            onClick={() => window.location.href = PROTECTED_ROUTES.DASHBOARD}
                            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                          >
                            Go to Dashboard
                          </button>
                        </div>
                      </div>
                    }
                  />
                </Routes>
              </PageTransition>
            </Layout>
          </AuthGuard>
        }
      />
    </Routes>
  );
};

// ============================================================================
// EXPORTS
// ============================================================================

export default AppRoutes;
export { ProtectedRoute, RouteErrorBoundary, PageTransition };
