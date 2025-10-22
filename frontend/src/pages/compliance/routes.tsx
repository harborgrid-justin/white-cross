/**
 * WF-ROU-016 | routes.tsx - Compliance Routes Configuration
 * Purpose: Route definitions for compliance management
 * Dependencies: React Router, ProtectedRoute, compliance components
 * Features: Protected routes with role-based access control
 */

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '../../components/auth/ProtectedRoute';
import {
  // Reports Components
  ComplianceReportsList,
  ComplianceReportForm,
  ComplianceReportDetails,
  ReportGeneratorModal,
  
  // Consent Forms Components  
  ConsentFormsList,
  ConsentFormBuilder,
  ConsentFormDetails,
  ConsentSigningInterface,
  StudentConsentHistory,
  
  // Policy Components
  PoliciesList,
  PolicyForm,
  PolicyDetails,
  PolicyAcknowledgmentInterface,
  PolicyAcknowledgmentHistory,
  
  // Audit Components
  AuditLogsList,
  AuditLogDetails,
  AuditTrail,
  
  // Dashboard Components
  ComplianceDashboard,
  ComplianceStatistics,
} from './components';

/**
 * ComplianceRoutes - Main routing component for compliance module
 * Implements role-based access control for different compliance functions
 */
export const ComplianceRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Dashboard Route */}
      <Route
        path="/"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'COMPLIANCE_OFFICER', 'NURSE', 'AUDITOR']}>
            <ComplianceDashboard />
          </ProtectedRoute>
        }
      />

      {/* Statistics Route */}
      <Route
        path="/statistics"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'COMPLIANCE_OFFICER', 'AUDITOR']}>
            <ComplianceStatistics />
          </ProtectedRoute>
        }
      />

      {/* ========================================================================== */}
      {/* COMPLIANCE REPORTS ROUTES */}
      {/* ========================================================================== */}

      {/* Reports List */}
      <Route
        path="/reports"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'COMPLIANCE_OFFICER', 'NURSE', 'AUDITOR']}>
            <ComplianceReportsList />
          </ProtectedRoute>
        }
      />

      {/* Create Report */}
      <Route
        path="/reports/new"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'COMPLIANCE_OFFICER', 'NURSE']}>
            <ComplianceReportForm />
          </ProtectedRoute>
        }
      />

      {/* Edit Report */}
      <Route
        path="/reports/:id/edit"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'COMPLIANCE_OFFICER', 'NURSE']}>
            <ComplianceReportForm />
          </ProtectedRoute>
        }
      />

      {/* View Report Details */}
      <Route
        path="/reports/:id"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'COMPLIANCE_OFFICER', 'NURSE', 'AUDITOR']}>
            <ComplianceReportDetails />
          </ProtectedRoute>
        }
      />

      {/* Generate Report */}
      <Route
        path="/reports/generate"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'COMPLIANCE_OFFICER']}>
            <ReportGeneratorModal />
          </ProtectedRoute>
        }
      />

      {/* ========================================================================== */}
      {/* CONSENT FORMS ROUTES */}
      {/* ========================================================================== */}

      {/* Consent Forms List */}
      <Route
        path="/consent/forms"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'COMPLIANCE_OFFICER', 'NURSE', 'COUNSELOR']}>
            <ConsentFormsList />
          </ProtectedRoute>
        }
      />

      {/* Create Consent Form */}
      <Route
        path="/consent/forms/new"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'COMPLIANCE_OFFICER']}>
            <ConsentFormBuilder />
          </ProtectedRoute>
        }
      />

      {/* Edit Consent Form */}
      <Route
        path="/consent/forms/:id/edit"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'COMPLIANCE_OFFICER']}>
            <ConsentFormBuilder />
          </ProtectedRoute>
        }
      />

      {/* View Consent Form Details */}
      <Route
        path="/consent/forms/:id"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'COMPLIANCE_OFFICER', 'NURSE', 'COUNSELOR']}>
            <ConsentFormDetails />
          </ProtectedRoute>
        }
      />

      {/* Sign Consent Form */}
      <Route
        path="/consent/sign/:formId"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'COMPLIANCE_OFFICER', 'NURSE', 'COUNSELOR']}>
            <ConsentSigningInterface />
          </ProtectedRoute>
        }
      />

      {/* Student Consent History */}
      <Route
        path="/consent/student/:studentId"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'COMPLIANCE_OFFICER', 'NURSE', 'COUNSELOR']}>
            <StudentConsentHistory />
          </ProtectedRoute>
        }
      />

      {/* ========================================================================== */}
      {/* POLICY DOCUMENTS ROUTES */}
      {/* ========================================================================== */}

      {/* Policies List */}
      <Route
        path="/policies"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'COMPLIANCE_OFFICER', 'NURSE', 'COUNSELOR', 'TEACHER']}>
            <PoliciesList />
          </ProtectedRoute>
        }
      />

      {/* Create Policy */}
      <Route
        path="/policies/new"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'COMPLIANCE_OFFICER']}>
            <PolicyForm />
          </ProtectedRoute>
        }
      />

      {/* Edit Policy */}
      <Route
        path="/policies/:id/edit"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'COMPLIANCE_OFFICER']}>
            <PolicyForm />
          </ProtectedRoute>
        }
      />

      {/* View Policy Details */}
      <Route
        path="/policies/:id"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'COMPLIANCE_OFFICER', 'NURSE', 'COUNSELOR', 'TEACHER']}>
            <PolicyDetails />
          </ProtectedRoute>
        }
      />

      {/* Acknowledge Policy */}
      <Route
        path="/policies/:id/acknowledge"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'COMPLIANCE_OFFICER', 'NURSE', 'COUNSELOR', 'TEACHER']}>
            <PolicyAcknowledgmentInterface />
          </ProtectedRoute>
        }
      />

      {/* Policy Acknowledgment History */}
      <Route
        path="/policies/:id/acknowledgments"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'COMPLIANCE_OFFICER', 'AUDITOR']}>
            <PolicyAcknowledgmentHistory />
          </ProtectedRoute>
        }
      />

      {/* ========================================================================== */}
      {/* AUDIT LOGS ROUTES */}
      {/* ========================================================================== */}

      {/* Audit Logs List */}
      <Route
        path="/audit"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'COMPLIANCE_OFFICER', 'AUDITOR']}>
            <AuditLogsList />
          </ProtectedRoute>
        }
      />

      {/* View Audit Log Details */}
      <Route
        path="/audit/:id"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'COMPLIANCE_OFFICER', 'AUDITOR']}>
            <AuditLogDetails />
          </ProtectedRoute>
        }
      />

      {/* Audit Trail for Entity */}
      <Route
        path="/audit/trail/:entityType/:entityId"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'COMPLIANCE_OFFICER', 'AUDITOR']}>
            <AuditTrail />
          </ProtectedRoute>
        }
      />

      {/* ========================================================================== */}
      {/* CATCH-ALL ROUTE */}
      {/* ========================================================================== */}

      {/* Redirect unknown routes to dashboard */}
      <Route
        path="*"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'COMPLIANCE_OFFICER', 'NURSE', 'AUDITOR']}>
            <ComplianceDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default ComplianceRoutes;
