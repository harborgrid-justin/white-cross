/**
 * Incidents Page Routes
 * 
 * Comprehensive route configuration for incident management functionality.
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
 * Defines all routes for the incident management module
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
