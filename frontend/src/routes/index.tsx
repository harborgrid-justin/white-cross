import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { PUBLIC_ROUTES, PROTECTED_ROUTES } from '../constants/routes';

// Layout components
import Layout from '../components/Layout';

// Page components
import Login from '../pages/Login';
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

// Route guard component
interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'ADMIN' | 'NURSE' | 'STAFF' | 'COUNSELOR' | 'READ_ONLY';
  allowedRoles?: Array<'ADMIN' | 'NURSE' | 'STAFF' | 'COUNSELOR' | 'READ_ONLY' | 'SCHOOL_ADMIN' | 'DISTRICT_ADMIN'>;
  requiredPermission?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  allowedRoles,
  requiredPermission,
}) => {
  const { user, loading } = useAuthContext();
  const location = useLocation();
  const isAuthenticated = !!user;

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  // Check if user role matches requiredRole or is in allowedRoles
  if (requiredRole && user?.role !== requiredRole) {
    return <AccessDenied />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role as any)) {
    return <AccessDenied />;
  }

  // Permission check can be expanded later if needed
  if (requiredPermission) {
    // For now, just check if user exists
    // TODO: Implement proper permission checking when permission system is defined
  }

  return <>{children}</>;
};

// Main routes component
export const AppRoutes: React.FC = () => {
  const { user } = useAuthContext();
  const isAuthenticated = !!user;

  return (
    <Routes>
      {/* Public routes */}
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

      {/* Protected routes */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <Layout>
              <Routes>
                {/* Dashboard - accessible to all authenticated users */}
                <Route
                  path={PROTECTED_ROUTES.DASHBOARD}
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />

                {/* Students - accessible to ADMIN, NURSE, COUNSELOR, and READ_ONLY */}
                <Route
                  path={`${PROTECTED_ROUTES.STUDENTS}/*`}
                  element={
                    <ProtectedRoute allowedRoles={['ADMIN', 'NURSE', 'COUNSELOR', 'READ_ONLY']}>
                      <Students />
                    </ProtectedRoute>
                  }
                />

                {/* Medications - accessible to NURSE, ADMIN, and READ_ONLY (view only) */}
                <Route
                  path={`${PROTECTED_ROUTES.MEDICATIONS}/*`}
                  element={
                    <ProtectedRoute allowedRoles={['ADMIN', 'NURSE', 'READ_ONLY', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN']}>
                      <Medications />
                    </ProtectedRoute>
                  }
                />

                {/* Appointments - accessible to NURSE, ADMIN, and READ_ONLY */}
                <Route
                  path={`${PROTECTED_ROUTES.APPOINTMENTS}/*`}
                  element={
                    <ProtectedRoute allowedRoles={['ADMIN', 'NURSE', 'READ_ONLY', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN']}>
                      <Appointments />
                    </ProtectedRoute>
                  }
                />

                {/* Health Records - accessible to NURSE, ADMIN, COUNSELOR, and READ_ONLY */}
                <Route
                  path={`${PROTECTED_ROUTES.HEALTH_RECORDS}/*`}
                  element={
                    <ProtectedRoute allowedRoles={['ADMIN', 'NURSE', 'COUNSELOR', 'READ_ONLY', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN']}>
                      <HealthRecords />
                    </ProtectedRoute>
                  }
                />

                {/* Incident Reports - accessible to NURSE, ADMIN, COUNSELOR, and READ_ONLY */}
                <Route
                  path={`${PROTECTED_ROUTES.INCIDENT_REPORTS}/*`}
                  element={
                    <ProtectedRoute allowedRoles={['ADMIN', 'NURSE', 'COUNSELOR', 'READ_ONLY', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN']}>
                      <IncidentReports />
                    </ProtectedRoute>
                  }
                />

                {/* Emergency Contacts - accessible to NURSE and ADMIN */}
                <Route
                  path={`${PROTECTED_ROUTES.EMERGENCY_CONTACTS}/*`}
                  element={
                    <ProtectedRoute requiredRole="NURSE">
                      <EmergencyContacts />
                    </ProtectedRoute>
                  }
                />

                {/* Communication - accessible to all authenticated users */}
                <Route
                  path={`${PROTECTED_ROUTES.COMMUNICATION}/*`}
                  element={
                    <ProtectedRoute>
                      <Communication />
                    </ProtectedRoute>
                  }
                />

                {/* Documents - accessible to NURSE and ADMIN */}
                <Route
                  path={`${PROTECTED_ROUTES.DOCUMENTS}/*`}
                  element={
                    <ProtectedRoute requiredRole="NURSE">
                      <Documents />
                    </ProtectedRoute>
                  }
                />

                {/* Inventory - accessible to NURSE and ADMIN */}
                <Route
                  path={`${PROTECTED_ROUTES.INVENTORY}/*`}
                  element={
                    <ProtectedRoute requiredRole="NURSE">
                      <Inventory />
                    </ProtectedRoute>
                  }
                />

                {/* Reports - accessible to all authenticated users */}
                <Route
                  path={`${PROTECTED_ROUTES.REPORTS}/*`}
                  element={
                    <ProtectedRoute allowedRoles={['ADMIN', 'NURSE', 'COUNSELOR', 'READ_ONLY', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN']}>
                      <Reports />
                    </ProtectedRoute>
                  }
                />

                {/* Settings - accessible to ADMIN only */}
                <Route
                  path={`${PROTECTED_ROUTES.SETTINGS}/*`}
                  element={
                    <ProtectedRoute requiredRole="ADMIN">
                      <Settings />
                    </ProtectedRoute>
                  }
                />

                {/* Default redirect */}
                <Route
                  path="/"
                  element={<Navigate to={PROTECTED_ROUTES.DASHBOARD} replace />}
                />

                {/* Catch all - 404 */}
                <Route
                  path="*"
                  element={<Navigate to={PROTECTED_ROUTES.DASHBOARD} replace />}
                />
              </Routes>
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
