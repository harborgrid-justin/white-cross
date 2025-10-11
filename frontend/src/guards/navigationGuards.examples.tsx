/**
 * Navigation Guards - Usage Examples
 *
 * Comprehensive examples demonstrating how to use the navigation guard system
 * in various scenarios throughout the White Cross healthcare platform.
 *
 * @module navigationGuards.examples
 */

import React, { useState } from 'react';
import {
  withAuthGuard,
  withRoleGuard,
  withPermissionGuard,
  withDataGuard,
  withFeatureGuard,
  composeGuards,
  useUnsavedChanges,
  UnsavedChangesPrompt,
  navigationInterceptorManager,
  EnsureStudentLoaded,
  EnsureIncidentReportLoaded,
  EnsureMedicationLoaded,
  EnsureEntityLoaded,
  RouteMetadata,
  hasAccessToRoute,
  checkPermission,
  checkAllPermissions,
  PermissionCheck
} from './navigationGuards';
import { studentsApi, healthRecordsApi } from '../services';

// ============================================================================
// EXAMPLE 1: Basic Auth Guard
// ============================================================================

/**
 * Simple protected page that requires authentication
 */
function DashboardPage() {
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Only authenticated users can see this.</p>
    </div>
  );
}

// Wrap with auth guard
export const ProtectedDashboard = withAuthGuard(DashboardPage);

// ============================================================================
// EXAMPLE 2: Role-Based Access
// ============================================================================

/**
 * Admin-only settings page
 */
function AdminSettingsPage() {
  return (
    <div>
      <h1>Admin Settings</h1>
      <p>Only admins can access this page.</p>
    </div>
  );
}

// Wrap with role guard
export const AdminSettings = withRoleGuard(['ADMIN', 'DISTRICT_ADMIN'])(AdminSettingsPage);

// ============================================================================
// EXAMPLE 3: Nurse-Specific Pages
// ============================================================================

/**
 * Medication management page for nurses
 */
function MedicationManagementPage() {
  return (
    <div>
      <h1>Medication Management</h1>
      <p>Manage student medications.</p>
    </div>
  );
}

export const MedicationManagement = withRoleGuard(['NURSE', 'ADMIN'])(
  MedicationManagementPage
);

// ============================================================================
// EXAMPLE 4: Permission-Based Access
// ============================================================================

/**
 * Student edit page with permission check
 */
function StudentEditPage() {
  return (
    <div>
      <h1>Edit Student</h1>
      <p>Edit student information.</p>
    </div>
  );
}

export const StudentEdit = withPermissionGuard([
  { resource: 'students', action: 'update' }
])(StudentEditPage);

// ============================================================================
// EXAMPLE 5: Multiple Permission Checks
// ============================================================================

/**
 * Health records page requiring multiple permissions
 */
function HealthRecordsAdminPage() {
  return (
    <div>
      <h1>Health Records Administration</h1>
      <p>Manage all health records.</p>
    </div>
  );
}

export const HealthRecordsAdmin = withPermissionGuard([
  { resource: 'health_records', action: 'read' },
  { resource: 'health_records', action: 'update' },
  { resource: 'health_records', action: 'delete' }
])(HealthRecordsAdminPage);

// ============================================================================
// EXAMPLE 6: Data Loading Guard
// ============================================================================

/**
 * Student detail page with automatic data loading
 */
interface StudentDetailProps {
  guardData: { student: any };
}

function StudentDetailPage({ guardData }: StudentDetailProps) {
  const { student } = guardData;

  return (
    <div>
      <h1>{student.firstName} {student.lastName}</h1>
      <p>Student Number: {student.studentNumber}</p>
      <p>Grade: {student.grade}</p>
    </div>
  );
}

// Create a HOC that loads student data before rendering
export const StudentDetail = withDataGuard<StudentDetailProps, { student: any }>(
  async (context) => {
    // Extract student ID from location or props
    const studentId = context.location.pathname.split('/').pop();
    if (!studentId) {
      throw new Error('Student ID is required');
    }

    const student = await studentsApi.getById(studentId);
    return { student };
  }
)(StudentDetailPage);

// ============================================================================
// EXAMPLE 7: Composed Guards (Multiple Guards)
// ============================================================================

/**
 * Incident report edit page with multiple guards
 */
interface IncidentReportEditProps {
  guardData: { incidentReport: any };
}

function IncidentReportEditPage({ guardData }: IncidentReportEditProps) {
  const { incidentReport } = guardData;

  return (
    <div>
      <h1>Edit Incident Report #{incidentReport.id}</h1>
      <p>Type: {incidentReport.type}</p>
      <p>Severity: {incidentReport.severity}</p>
    </div>
  );
}

// Compose multiple guards: auth + role + permission + data loading
export const IncidentReportEdit = composeGuards([
  withAuthGuard,
  withRoleGuard(['NURSE', 'ADMIN', 'COUNSELOR']),
  withPermissionGuard([
    { resource: 'incident_reports', action: 'update' }
  ]),
  withDataGuard(async (context) => {
    const { incidentReportsApi } = await import('../services');
    const reportId = context.location.pathname.split('/').pop();
    if (!reportId) {
      throw new Error('Incident report ID is required');
    }

    const { report } = await incidentReportsApi.getById(reportId);
    return { incidentReport: report };
  })
])(IncidentReportEditPage);

// ============================================================================
// EXAMPLE 8: Feature Flag Guard
// ============================================================================

/**
 * Beta feature page
 */
function BetaAnalyticsPage() {
  return (
    <div>
      <h1>Advanced Analytics (Beta)</h1>
      <p>This feature is in beta.</p>
    </div>
  );
}

export const BetaAnalytics = withFeatureGuard('advanced-analytics')(BetaAnalyticsPage);

// ============================================================================
// EXAMPLE 9: Unsaved Changes Hook
// ============================================================================

/**
 * Form page with unsaved changes protection
 */
export function StudentFormPage() {
  const [formData, setFormData] = useState({ name: '', grade: '' });
  const [isDirty, setIsDirty] = useState(false);
  const {
    hasUnsavedChanges,
    setHasUnsavedChanges,
    showPrompt,
    confirmNavigation,
    cancelNavigation
  } = useUnsavedChanges();

  // Track form changes
  React.useEffect(() => {
    setHasUnsavedChanges(isDirty);
  }, [isDirty, setHasUnsavedChanges]);

  const handleSave = async () => {
    // Save form data
    await studentsApi.create(formData as any);
    setIsDirty(false);
    confirmNavigation(); // Continue navigation after save
  };

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    setIsDirty(true);
  };

  return (
    <div>
      <h1>Student Form</h1>
      <form>
        <input
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="Name"
        />
        <input
          value={formData.grade}
          onChange={(e) => handleChange('grade', e.target.value)}
          placeholder="Grade"
        />
        <button type="button" onClick={handleSave}>Save</button>
      </form>

      <UnsavedChangesPrompt
        isOpen={showPrompt}
        onSave={handleSave}
        onDiscard={confirmNavigation}
        onCancel={cancelNavigation}
      />
    </div>
  );
}

// ============================================================================
// EXAMPLE 10: Specialized Data Guards
// ============================================================================

/**
 * Using specialized data loading guards
 */
interface StudentProfileProps {
  student: any;
}

function StudentProfilePage({ student }: StudentProfileProps) {
  return (
    <div>
      <h1>Student Profile</h1>
      <p>{student.firstName} {student.lastName}</p>
    </div>
  );
}

// Use specialized student loader
export const StudentProfile = EnsureStudentLoaded(StudentProfilePage as any);

// Usage in route:
// <Route path="/students/:studentId" element={<StudentProfile studentId={params.studentId} />} />

// ============================================================================
// EXAMPLE 11: Generic Entity Loader
// ============================================================================

/**
 * Generic entity loading example
 */
interface HealthRecordDetailProps {
  healthRecord: any;
}

function HealthRecordDetailPage({ healthRecord }: HealthRecordDetailProps) {
  return (
    <div>
      <h1>Health Record</h1>
      <p>Type: {healthRecord.type}</p>
      <p>Date: {healthRecord.date}</p>
    </div>
  );
}

// Create a custom entity loader
export const HealthRecordDetail = EnsureEntityLoaded<any, HealthRecordDetailProps>(
  'healthRecord',
  async (id: string) => {
    const records = await healthRecordsApi.getRecords(id);
    return records[0]; // Return first record
  }
)(HealthRecordDetailPage as any);

// ============================================================================
// EXAMPLE 12: Navigation Interceptors
// ============================================================================

/**
 * Set up global navigation interceptors
 */
export function setupNavigationInterceptors() {
  // Before navigation - log analytics
  navigationInterceptorManager.beforeNavigate((to, from, next) => {
    console.log('Navigating from', from.pathname, 'to', to.pathname);
    // Track page view
    // analytics.pageView(to.pathname);
    next();
  });

  // After navigation - scroll to top
  navigationInterceptorManager.afterNavigate(() => {
    window.scrollTo(0, 0);
  });

  // On error - log to monitoring service
  navigationInterceptorManager.onNavigationError((error) => {
    console.error('Navigation error:', error);
    // Send to error tracking service
    // Sentry.captureException(error);
  });

  // On cancelled - log analytics
  navigationInterceptorManager.onNavigationCancelled(() => {
    console.log('Navigation was cancelled');
  });
}

// ============================================================================
// EXAMPLE 13: Route Metadata and Access Checks
// ============================================================================

/**
 * Define route metadata for access control
 */
export const routeMetadata: Record<string, RouteMetadata> = {
  '/dashboard': {
    requiresAuth: true,
    title: 'Dashboard',
    breadcrumbs: [{ label: 'Home', path: '/' }, { label: 'Dashboard' }]
  },
  '/students': {
    requiresAuth: true,
    roles: ['ADMIN', 'NURSE', 'COUNSELOR', 'READ_ONLY'],
    permissions: [{ resource: 'students', action: 'read' }],
    title: 'Students',
    breadcrumbs: [{ label: 'Home', path: '/' }, { label: 'Students' }]
  },
  '/students/:id/edit': {
    requiresAuth: true,
    roles: ['ADMIN', 'NURSE'],
    permissions: [
      { resource: 'students', action: 'read' },
      { resource: 'students', action: 'update' }
    ],
    title: 'Edit Student',
    breadcrumbs: [
      { label: 'Home', path: '/' },
      { label: 'Students', path: '/students' },
      { label: 'Edit' }
    ]
  },
  '/medications': {
    requiresAuth: true,
    roles: ['ADMIN', 'NURSE'],
    permissions: [{ resource: 'medications', action: 'read' }],
    title: 'Medications',
    breadcrumbs: [{ label: 'Home', path: '/' }, { label: 'Medications' }]
  },
  '/settings': {
    requiresAuth: true,
    roles: ['ADMIN'],
    permissions: [{ resource: 'system', action: 'configure' }],
    title: 'System Settings',
    breadcrumbs: [{ label: 'Home', path: '/' }, { label: 'Settings' }]
  },
  '/beta/analytics': {
    requiresAuth: true,
    features: ['advanced-analytics'],
    title: 'Advanced Analytics (Beta)',
    breadcrumbs: [{ label: 'Home', path: '/' }, { label: 'Analytics' }]
  }
};

/**
 * Check if user can access a route
 */
export function useRouteAccess(path: string) {
  const { user } = require('../contexts/AuthContext').useAuthContext();
  const metadata = routeMetadata[path];

  if (!metadata) {
    return { hasAccess: true }; // Unknown routes are accessible by default
  }

  const hasAccess = hasAccessToRoute(user, metadata);

  return {
    hasAccess,
    metadata,
    title: metadata.title,
    breadcrumbs: metadata.breadcrumbs
  };
}

// ============================================================================
// EXAMPLE 14: Programmatic Permission Checks
// ============================================================================

/**
 * Component with inline permission checks
 */
export function StudentActionsMenu({ studentId }: { studentId: string }) {
  const { user } = require('../contexts/AuthContext').useAuthContext();

  const canEdit = checkPermission(user, {
    resource: 'students',
    action: 'update'
  });

  const canDelete = checkPermission(user, {
    resource: 'students',
    action: 'delete'
  });

  const canManageHealth = checkAllPermissions(user, [
    { resource: 'health_records', action: 'read' },
    { resource: 'health_records', action: 'update' }
  ]);

  return (
    <div className="flex gap-2">
      {canEdit && (
        <button className="btn-primary">Edit Student</button>
      )}
      {canDelete && (
        <button className="btn-danger">Delete Student</button>
      )}
      {canManageHealth && (
        <button className="btn-secondary">Manage Health Records</button>
      )}
    </div>
  );
}

// ============================================================================
// EXAMPLE 15: Advanced Composed Guards
// ============================================================================

/**
 * Complex page with all guard types
 */
interface ComplexPageProps {
  guardData: {
    student: any;
    healthRecords: any[];
    medications: any[];
  };
}

function ComplexHealthManagementPage({ guardData }: ComplexPageProps) {
  const { student, healthRecords, medications } = guardData;

  return (
    <div>
      <h1>Comprehensive Health Management</h1>
      <section>
        <h2>Student: {student.firstName} {student.lastName}</h2>
      </section>
      <section>
        <h3>Health Records ({healthRecords.length})</h3>
      </section>
      <section>
        <h3>Medications ({medications.length})</h3>
      </section>
    </div>
  );
}

// Ultimate guard composition
export const ComplexHealthManagement = composeGuards([
  // 1. Ensure user is authenticated
  withAuthGuard,
  // 2. Check user has appropriate role
  withRoleGuard(['NURSE', 'ADMIN']),
  // 3. Verify specific permissions
  withPermissionGuard([
    { resource: 'students', action: 'read' },
    { resource: 'health_records', action: 'read' },
    { resource: 'medications', action: 'read' }
  ]),
  // 4. Check feature flag
  withFeatureGuard('comprehensive-health-view'),
  // 5. Load all required data
  withDataGuard(async (context) => {
    const studentId = context.location.pathname.split('/')[2];

    // Load multiple data sources in parallel
    const [student, healthRecords, medications] = await Promise.all([
      studentsApi.getById(studentId),
      healthRecordsApi.getRecords(studentId),
      (await import('../services')).medicationsApi.getStudentMedications(studentId)
    ]);

    return { student, healthRecords, medications };
  })
])(ComplexHealthManagementPage);

// ============================================================================
// EXAMPLE 16: Custom Guard Function
// ============================================================================

/**
 * Create a custom business logic guard
 */
function withBusinessHoursGuard<P extends object>(
  Component: ComponentType<P>
): ComponentType<P> {
  return function BusinessHoursGuardedComponent(props: P) {
    const hour = new Date().getHours();
    const isBusinessHours = hour >= 8 && hour < 18;

    if (!isBusinessHours) {
      return (
        <div className="p-8 text-center">
          <div className="inline-block p-6 bg-yellow-50 rounded-lg">
            <h2 className="text-xl font-semibold text-yellow-900 mb-2">
              Outside Business Hours
            </h2>
            <p className="text-yellow-700">
              This feature is only available during business hours (8 AM - 6 PM).
            </p>
          </div>
        </div>
      );
    }

    return <Component {...props} />;
  };
}

// Use custom guard
function EmergencyDispatchPage() {
  return <div>Emergency Dispatch System</div>;
}

export const EmergencyDispatch = withBusinessHoursGuard(EmergencyDispatchPage);

// ============================================================================
// EXAMPLE 17: Conditional Guard Application
// ============================================================================

/**
 * Apply guards conditionally based on environment
 */
export function createConditionalGuard<P extends object>(
  Component: ComponentType<P>
): ComponentType<P> {
  // In development, skip all guards for easier testing
  if (import.meta.env.DEV) {
    return Component;
  }

  // In production, apply full guard stack
  return composeGuards([
    withAuthGuard,
    withRoleGuard(['ADMIN', 'NURSE']),
    withPermissionGuard([{ resource: 'system', action: 'administer' }])
  ])(Component);
}
