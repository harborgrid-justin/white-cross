/**
 * WF-COMP-122 | integration.example.tsx - React component or utility module
 * Purpose: react component or utility module
 * Upstream: ./navigationGuards, ../services, ../components/Layout | Dependencies: react, react-router-dom, ./navigationGuards
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: constants, functions | Key Features: useState, useEffect, functional component
 * Last Updated: 2025-10-17 | File Type: .tsx
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

/**
 * Integration Examples
 *
 * Shows how to integrate the new navigation guard system with existing
 * React Router v6 routes in the White Cross platform.
 *
 * @module guards.integration
 */

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import {
  withAuthGuard,
  withRoleGuard,
  withPermissionGuard,
  withDataGuard,
  composeGuards,
  useUnsavedChanges,
  UnsavedChangesPrompt
} from './navigationGuards';
import { studentsApi, incidentReportsApi } from '../services';
import Layout from '../components/Layout';

// ============================================================================
// EXAMPLE 1: Migrating Existing ProtectedRoute to New Guards
// ============================================================================

/**
 * OLD WAY (from routes/index.tsx)
 */
/*
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  allowedRoles,
}) => {
  const { user, loading } = useAuthContext();

  if (loading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/login" />;
  if (requiredRole && user.role !== requiredRole) return <AccessDenied />;

  return <>{children}</>;
};
*/

/**
 * NEW WAY (using navigation guards)
 *
 * Benefits:
 * - More composable and reusable
 * - Better TypeScript support
 * - Automatic logging and analytics
 * - Consistent guard behavior
 */

// Simple page that only needs authentication
import Dashboard from '../pages/dashboard/Dashboard';
export const ProtectedDashboard = withAuthGuard(Dashboard);

// Page that needs role check
import Settings from '../pages/admin/Settings';
export const AdminSettings = withRoleGuard(['ADMIN'])(Settings);

// Page that needs both auth and role
export const NurseSettings = composeGuards([
  withAuthGuard,
  withRoleGuard(['NURSE', 'ADMIN'])
])(Settings);

// ============================================================================
// EXAMPLE 2: Converting Existing Routes to Use New Guards
// ============================================================================

/**
 * Example of how to convert the routes in routes/index.tsx
 */

// Import your page components
import Students from '../pages/students/Students';
import Medications from '../pages/health/Medications';
import IncidentReports from '../pages/incidents/IncidentReports';

// Apply guards at component level
const ProtectedStudents = composeGuards([
  withAuthGuard,
  withRoleGuard(['ADMIN', 'NURSE', 'COUNSELOR', 'READ_ONLY'])
])(Students);

const ProtectedMedications = composeGuards([
  withAuthGuard,
  withRoleGuard(['ADMIN', 'NURSE']),
  withPermissionGuard([
    { resource: 'medications', action: 'read' }
  ])
])(Medications);

const ProtectedIncidentReports = composeGuards([
  withAuthGuard,
  withRoleGuard(['ADMIN', 'NURSE', 'COUNSELOR']),
  withPermissionGuard([
    { resource: 'incident_reports', action: 'read' }
  ])
])(IncidentReports);

// Then use them in routes
export function ExampleRoutes() {
  return (
    <Routes>
      <Route path="/students/*" element={<ProtectedStudents />} />
      <Route path="/medications/*" element={<ProtectedMedications />} />
      <Route path="/incident-reports/*" element={<ProtectedIncidentReports />} />
    </Routes>
  );
}

// ============================================================================
// EXAMPLE 3: Detail Pages with Data Loading
// ============================================================================

/**
 * Student detail page that automatically loads student data
 */
interface StudentDetailProps {
  guardData: {
    student: any;
    healthRecords: any[];
  };
}

function StudentDetailPage({ guardData }: StudentDetailProps) {
  const { student, healthRecords } = guardData;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        {student.firstName} {student.lastName}
      </h1>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h2 className="font-semibold">Student Information</h2>
          <p>Student #: {student.studentNumber}</p>
          <p>Grade: {student.grade}</p>
          <p>DOB: {student.dateOfBirth}</p>
        </div>
        <div>
          <h2 className="font-semibold">Health Records</h2>
          <p>Total Records: {healthRecords.length}</p>
        </div>
      </div>
    </div>
  );
}

// Apply guards with data loading
export const ProtectedStudentDetail = composeGuards([
  withAuthGuard,
  withRoleGuard(['ADMIN', 'NURSE', 'COUNSELOR']),
  withPermissionGuard([
    { resource: 'students', action: 'read' },
    { resource: 'health_records', action: 'read' }
  ]),
  withDataGuard(async (context) => {
    // Extract student ID from URL
    const pathParts = context.location.pathname.split('/');
    const studentId = pathParts[pathParts.length - 1];

    if (!studentId) {
      throw new Error('Student ID is required');
    }

    // Load student and health records in parallel
    const { healthRecordsApi } = await import('../services');
    const [student, healthRecords] = await Promise.all([
      studentsApi.getById(studentId),
      healthRecordsApi.getRecords(studentId)
    ]);

    return { student, healthRecords };
  })
])(StudentDetailPage);

// Use in route:
// <Route path="/students/:id" element={<ProtectedStudentDetail />} />

// ============================================================================
// EXAMPLE 4: Form Pages with Unsaved Changes Protection
// ============================================================================

/**
 * Incident report form with unsaved changes guard
 */
interface IncidentReportFormProps {
  guardData?: { report?: any };
}

function IncidentReportForm({ guardData }: IncidentReportFormProps) {
  const [formData, setFormData] = React.useState({
    type: '',
    severity: '',
    description: '',
    location: ''
  });
  const [isDirty, setIsDirty] = React.useState(false);

  const {
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
    if (guardData?.report) {
      await incidentReportsApi.update(guardData.report.id, formData);
    } else {
      await incidentReportsApi.create(formData);
    }
    setIsDirty(false);
    confirmNavigation();
  };

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    setIsDirty(true);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        {guardData?.report ? 'Edit' : 'Create'} Incident Report
      </h1>
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Type</label>
          <select
            value={formData.type}
            onChange={(e) => handleChange('type', e.target.value)}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Select type...</option>
            <option value="INJURY">Injury</option>
            <option value="ILLNESS">Illness</option>
            <option value="BEHAVIORAL">Behavioral</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Severity</label>
          <select
            value={formData.severity}
            onChange={(e) => handleChange('severity', e.target.value)}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Select severity...</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="CRITICAL">Critical</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            className="w-full border rounded px-3 py-2"
            rows={4}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Location</label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => handleChange('location', e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save Report
          </button>
          <button
            type="button"
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
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

// Create version - no data loading needed
export const CreateIncidentReport = composeGuards([
  withAuthGuard,
  withRoleGuard(['ADMIN', 'NURSE', 'COUNSELOR']),
  withPermissionGuard([
    { resource: 'incident_reports', action: 'create' }
  ])
])(IncidentReportForm);

// Edit version - load existing report
export const EditIncidentReport = composeGuards([
  withAuthGuard,
  withRoleGuard(['ADMIN', 'NURSE', 'COUNSELOR']),
  withPermissionGuard([
    { resource: 'incident_reports', action: 'update' }
  ]),
  withDataGuard(async (context) => {
    const pathParts = context.location.pathname.split('/');
    const reportId = pathParts[pathParts.length - 1];

    if (!reportId) {
      throw new Error('Report ID is required');
    }

    const { report } = await incidentReportsApi.getById(reportId);
    return { report };
  })
])(IncidentReportForm);

// ============================================================================
// EXAMPLE 5: Complete Application Routes with New Guards
// ============================================================================

/**
 * Example of how your main AppRoutes component could look
 * with the new guard system integrated
 */
export function NewAppRoutes() {
  // Import all protected pages
  const ProtectedDashboard = withAuthGuard(Dashboard);

  const ProtectedStudents = composeGuards([
    withAuthGuard,
    withRoleGuard(['ADMIN', 'NURSE', 'COUNSELOR', 'READ_ONLY'])
  ])(Students);

  const ProtectedMedications = composeGuards([
    withAuthGuard,
    withRoleGuard(['ADMIN', 'NURSE'])
  ])(Medications);

  const ProtectedSettings = composeGuards([
    withAuthGuard,
    withRoleGuard(['ADMIN'])
  ])(Settings);

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<div>Login Page</div>} />

      {/* Protected routes */}
      <Route
        path="/*"
        element={
          <Layout>
            <Routes>
              <Route path="/dashboard" element={<ProtectedDashboard />} />
              <Route path="/students/*" element={<ProtectedStudents />} />
              <Route path="/students/:id" element={<ProtectedStudentDetail />} />
              <Route path="/medications/*" element={<ProtectedMedications />} />
              <Route path="/incident-reports/new" element={<CreateIncidentReport />} />
              <Route path="/incident-reports/:id/edit" element={<EditIncidentReport />} />
              <Route path="/settings/*" element={<ProtectedSettings />} />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </Layout>
        }
      />
    </Routes>
  );
}

// ============================================================================
// EXAMPLE 6: Conditional Rendering Based on Permissions
// ============================================================================

/**
 * Action buttons that show/hide based on permissions
 */
import { checkPermission } from './navigationGuards';
import { useAuthContext } from '../contexts/AuthContext';

export function StudentActionButtons({ studentId }: { studentId: string }) {
  const { user } = useAuthContext();

  const canEdit = checkPermission(user, {
    resource: 'students',
    action: 'update'
  });

  const canDelete = checkPermission(user, {
    resource: 'students',
    action: 'delete'
  });

  const canViewHealth = checkPermission(user, {
    resource: 'health_records',
    action: 'read'
  });

  return (
    <div className="flex gap-2">
      <button className="btn-primary">View</button>

      {canEdit && (
        <button className="btn-secondary">Edit</button>
      )}

      {canViewHealth && (
        <button className="btn-secondary">Health Records</button>
      )}

      {canDelete && (
        <button className="btn-danger">Delete</button>
      )}
    </div>
  );
}

// ============================================================================
// MIGRATION GUIDE
// ============================================================================

/**
 * To migrate from the old ProtectedRoute pattern to new guards:
 *
 * STEP 1: Identify your current route protection pattern
 *
 * OLD:
 * <Route
 *   path="/students"
 *   element={
 *     <ProtectedRoute allowedRoles={['ADMIN', 'NURSE']}>
 *       <Students />
 *     </ProtectedRoute>
 *   }
 * />
 *
 * STEP 2: Create a protected component using guards
 *
 * const ProtectedStudents = composeGuards([
 *   withAuthGuard,
 *   withRoleGuard(['ADMIN', 'NURSE'])
 * ])(Students);
 *
 * STEP 3: Use the protected component in your route
 *
 * NEW:
 * <Route path="/students" element={<ProtectedStudents />} />
 *
 * BENEFITS:
 * - Component is reusable across different route configurations
 * - Guards can be tested independently
 * - Type-safe with full TypeScript support
 * - Consistent behavior across the application
 * - Easier to compose complex permission logic
 * - Better developer experience with clear error messages
 */

// ============================================================================
// BEST PRACTICES
// ============================================================================

/**
 * 1. Define protected components at the module level, not inline
 *
 * ✅ GOOD:
 * const ProtectedStudents = composeGuards([...])(Students);
 * export function Routes() {
 *   return <Route path="/students" element={<ProtectedStudents />} />;
 * }
 *
 * ❌ BAD:
 * export function Routes() {
 *   return (
 *     <Route
 *       path="/students"
 *       element={composeGuards([...])(Students)} // Creates new component on every render
 *     />
 *   );
 * }
 *
 * 2. Always start with withAuthGuard
 *
 * ✅ GOOD:
 * composeGuards([withAuthGuard, withRoleGuard([...])]);
 *
 * ❌ BAD:
 * composeGuards([withRoleGuard([...]), withAuthGuard]); // Role guard runs before auth
 *
 * 3. Use permission guards for granular control
 *
 * ✅ GOOD:
 * withPermissionGuard([{ resource: 'students', action: 'delete' }])
 *
 * ⚠️ ACCEPTABLE:
 * withRoleGuard(['ADMIN']) // Less granular
 *
 * 4. Load data in guards, not in components
 *
 * ✅ GOOD:
 * withDataGuard(async (context) => {
 *   const student = await studentsApi.getById(id);
 *   return { student };
 * })
 *
 * ❌ BAD:
 * useEffect(() => { loadStudent(); }, []); // In component
 *
 * 5. Use useUnsavedChanges for all forms
 *
 * ✅ GOOD:
 * const { setHasUnsavedChanges } = useUnsavedChanges();
 * useEffect(() => { setHasUnsavedChanges(isDirty); }, [isDirty]);
 *
 * 6. Check permissions in UI for conditional rendering
 *
 * ✅ GOOD:
 * const canEdit = checkPermission(user, { resource: 'students', action: 'update' });
 * {canEdit && <button>Edit</button>}
 */
