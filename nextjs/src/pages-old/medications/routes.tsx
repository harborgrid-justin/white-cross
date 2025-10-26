/**
 * Medications Routes Configuration
 * Purpose: Comprehensive medication management route configuration with role-based protection
 * Related: ProtectedRoute, medication components
 */

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '../../routes';
import {
  // Core Components
  MedicationsList,
  MedicationDetails,
  MedicationsDashboard,
  MedicationForm,
  MedicationCard,
  MedicationFilters,
  MedicationHistory,
  MedicationTimeline,
  MedicationNotes,
  
  // Administration Components
  MedicationAdministration,
  AdministrationSchedule,
  AdministrationLog,
  MissedDoseHandler,
  AdministrationReminders,
  
  // Prescription Components
  PrescriptionsList,
  PrescriptionCard,
  PrescriptionDetails,
  PrescriptionForm,
  RefillManager,
  PrescriptionScanner,
  
  // Inventory Components
  MedicationInventory,
  InventoryCard,
  StockLevelMonitor,
  ExpirationTracker,
  InventoryAdjustment,
  
  // Interaction Components
  InteractionChecker,
  InteractionAlerts,
  ContraindicationsList,
  
  // Education Components
  MedicationEducation,
  SideEffectsGuide,
  AdministrationInstructions,
  
  // Compliance Components
  AdherenceTracker,
  AdherenceChart,
  ComplianceReport,
  MedicationAuditLog,
  
  // Statistics Components
  MedicationStatistics,
  MedicationMetricsChart,
  DueNowWidget,
  
  // Shared Components
  MedicationStatusBadge,
  MedicationSearchBar,
  DrugLookup,
  MedicationExportModal,
  MedicationPrintView,
  MedicationHelpModal,
  EmergencyMedicationPanel,
  
  // Schedule Components
  MedicationScheduleForm,
  QuickMedicationForm
} from './components';

export const MedicationRoutes: React.FC = () => {
  return (
    <Routes>
      {/* ============================================== */}
      {/* DASHBOARD & OVERVIEW ROUTES */}
      {/* ============================================== */}
      
      {/* Root redirect to dashboard */}
      <Route path="/" element={<Navigate to="/medications/dashboard" replace />} />

      {/* Main Dashboard */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'NURSE', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN']}>
            <MedicationsDashboard />
          </ProtectedRoute>
        }
      />

      {/* Dashboard Statistics */}
      <Route
        path="/dashboard/statistics"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'NURSE', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN']}>
            <MedicationStatistics />
          </ProtectedRoute>
        }
      />

      {/* Due Now Widget/View */}
      <Route
        path="/dashboard/due-now"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'NURSE']}>
            <DueNowWidget />
          </ProtectedRoute>
        }
      />

      {/* ============================================== */}
      {/* MEDICATION LIST & SEARCH ROUTES */}
      {/* ============================================== */}

      {/* Medications List */}
      <Route
        path="/list"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'NURSE', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN', 'COUNSELOR']}>
            <MedicationsList />
          </ProtectedRoute>
        }
      />

      {/* Search Medications */}
      <Route
        path="/search"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'NURSE', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN', 'COUNSELOR']}>
            <MedicationSearchBar />
          </ProtectedRoute>
        }
      />

      {/* Drug Lookup/Database Search */}
      <Route
        path="/lookup"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'NURSE', 'COUNSELOR']}>
            <DrugLookup />
          </ProtectedRoute>
        }
      />

      {/* ============================================== */}
      {/* MEDICATION MANAGEMENT ROUTES */}
      {/* ============================================== */}

      {/* Create New Medication */}
      <Route
        path="/new"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'NURSE']}>
            <MedicationForm />
          </ProtectedRoute>
        }
      />

      {/* Quick Entry Form */}
      <Route
        path="/quick-add"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'NURSE']}>
            <QuickMedicationForm />
          </ProtectedRoute>
        }
      />

      {/* Edit Medication */}
      <Route
        path="/:id/edit"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'NURSE']}>
            <MedicationForm />
          </ProtectedRoute>
        }
      />

      {/* Configure Schedule */}
      <Route
        path="/:id/schedule"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'NURSE']}>
            <MedicationScheduleForm />
          </ProtectedRoute>
        }
      />

      {/* ============================================== */}
      {/* STUDENT-SPECIFIC ROUTES */}
      {/* ============================================== */}

      {/* Student's Medications List */}
      <Route
        path="/student/:studentId"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'NURSE', 'SCHOOL_ADMIN', 'COUNSELOR']}>
            <MedicationsList />
          </ProtectedRoute>
        }
      />

      {/* Student's Active Medications */}
      <Route
        path="/student/:studentId/active"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'NURSE', 'SCHOOL_ADMIN', 'COUNSELOR']}>
            <MedicationsList />
          </ProtectedRoute>
        }
      />

      {/* Add Medication for Student */}
      <Route
        path="/student/:studentId/add"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'NURSE']}>
            <MedicationForm />
          </ProtectedRoute>
        }
      />

      {/* Student's Medication Schedule */}
      <Route
        path="/student/:studentId/schedule"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'NURSE', 'COUNSELOR']}>
            <AdministrationSchedule />
          </ProtectedRoute>
        }
      />

      {/* Student's Administration History */}
      <Route
        path="/student/:studentId/history"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'NURSE', 'SCHOOL_ADMIN', 'COUNSELOR']}>
            <MedicationHistory />
          </ProtectedRoute>
        }
      />

      {/* ============================================== */}
      {/* MEDICATION DETAILS ROUTES */}
      {/* ============================================== */}

      {/* Medication Details */}
      <Route
        path="/:id"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'NURSE', 'SCHOOL_ADMIN', 'COUNSELOR']}>
            <MedicationDetails />
          </ProtectedRoute>
        }
      />

      {/* Medication History */}
      <Route
        path="/:id/history"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'NURSE', 'SCHOOL_ADMIN', 'COUNSELOR']}>
            <MedicationHistory />
          </ProtectedRoute>
        }
      />

      {/* Medication Timeline */}
      <Route
        path="/:id/timeline"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'NURSE', 'SCHOOL_ADMIN', 'COUNSELOR']}>
            <MedicationTimeline />
          </ProtectedRoute>
        }
      />

      {/* Medication Notes */}
      <Route
        path="/:id/notes"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'NURSE', 'COUNSELOR']}>
            <MedicationNotes />
          </ProtectedRoute>
        }
      />

      {/* ============================================== */}
      {/* ADMINISTRATION ROUTES */}
      {/* ============================================== */}

      {/* Administer Medication */}
      <Route
        path="/:id/administer"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'NURSE']}>
            <MedicationAdministration />
          </ProtectedRoute>
        }
      />

      {/* Administration Schedule */}
      <Route
        path="/schedule"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'NURSE']}>
            <AdministrationSchedule />
          </ProtectedRoute>
        }
      />

      {/* Administration Log */}
      <Route
        path="/administration-log"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'NURSE', 'SCHOOL_ADMIN']}>
            <AdministrationLog />
          </ProtectedRoute>
        }
      />

      {/* Medication Administration Log for specific med */}
      <Route
        path="/:id/administration-log"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'NURSE', 'SCHOOL_ADMIN']}>
            <AdministrationLog />
          </ProtectedRoute>
        }
      />

      {/* Missed Doses */}
      <Route
        path="/missed-doses"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'NURSE']}>
            <MissedDoseHandler />
          </ProtectedRoute>
        }
      />

      {/* Handle specific missed dose */}
      <Route
        path="/:id/missed-dose"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'NURSE']}>
            <MissedDoseHandler />
          </ProtectedRoute>
        }
      />

      {/* Administration Reminders */}
      <Route
        path="/reminders"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'NURSE']}>
            <AdministrationReminders />
          </ProtectedRoute>
        }
      />

      {/* ============================================== */}
      {/* PRESCRIPTION ROUTES */}
      {/* ============================================== */}

      {/* Prescriptions List */}
      <Route
        path="/prescriptions"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'NURSE', 'SCHOOL_ADMIN']}>
            <PrescriptionsList />
          </ProtectedRoute>
        }
      />

      {/* Create New Prescription */}
      <Route
        path="/prescriptions/new"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'NURSE']}>
            <PrescriptionForm />
          </ProtectedRoute>
        }
      />

      {/* Prescription Details */}
      <Route
        path="/prescriptions/:prescriptionId"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'NURSE', 'SCHOOL_ADMIN']}>
            <PrescriptionDetails />
          </ProtectedRoute>
        }
      />

      {/* Edit Prescription */}
      <Route
        path="/prescriptions/:prescriptionId/edit"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'NURSE']}>
            <PrescriptionForm />
          </ProtectedRoute>
        }
      />

      {/* Refill Management */}
      <Route
        path="/prescriptions/:prescriptionId/refills"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'NURSE']}>
            <RefillManager />
          </ProtectedRoute>
        }
      />

      {/* Scan Prescription */}
      <Route
        path="/prescriptions/scan"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'NURSE']}>
            <PrescriptionScanner />
          </ProtectedRoute>
        }
      />

      {/* Student's Prescriptions */}
      <Route
        path="/student/:studentId/prescriptions"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'NURSE', 'SCHOOL_ADMIN']}>
            <PrescriptionsList />
          </ProtectedRoute>
        }
      />

      {/* ============================================== */}
      {/* INVENTORY ROUTES */}
      {/* ============================================== */}

      {/* Medication Inventory */}
      <Route
        path="/inventory"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'NURSE', 'SCHOOL_ADMIN']}>
            <MedicationInventory />
          </ProtectedRoute>
        }
      />

      {/* Stock Level Monitoring */}
      <Route
        path="/inventory/stock-levels"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'NURSE', 'SCHOOL_ADMIN']}>
            <StockLevelMonitor />
          </ProtectedRoute>
        }
      />

      {/* Expiration Tracking */}
      <Route
        path="/inventory/expiration"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'NURSE', 'SCHOOL_ADMIN']}>
            <ExpirationTracker />
          </ProtectedRoute>
        }
      />

      {/* Inventory Adjustment */}
      <Route
        path="/inventory/adjust"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'NURSE']}>
            <InventoryAdjustment />
          </ProtectedRoute>
        }
      />

      {/* Specific Medication Inventory */}
      <Route
        path="/:id/inventory"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'NURSE', 'SCHOOL_ADMIN']}>
            <InventoryCard />
          </ProtectedRoute>
        }
      />

      {/* ============================================== */}
      {/* DRUG INTERACTION ROUTES */}
      {/* ============================================== */}

      {/* Interaction Checker */}
      <Route
        path="/interactions/check"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'NURSE']}>
            <InteractionChecker />
          </ProtectedRoute>
        }
      />

      {/* Interaction Alerts */}
      <Route
        path="/interactions/alerts"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'NURSE']}>
            <InteractionAlerts />
          </ProtectedRoute>
        }
      />

      {/* Contraindications */}
      <Route
        path="/contraindications"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'NURSE', 'COUNSELOR']}>
            <ContraindicationsList />
          </ProtectedRoute>
        }
      />

      {/* Check interactions for specific medication */}
      <Route
        path="/:id/interactions"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'NURSE']}>
            <InteractionChecker />
          </ProtectedRoute>
        }
      />

      {/* ============================================== */}
      {/* EDUCATION & RESOURCES ROUTES */}
      {/* ============================================== */}

      {/* Medication Education */}
      <Route
        path="/education"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'NURSE', 'SCHOOL_ADMIN', 'COUNSELOR']}>
            <MedicationEducation />
          </ProtectedRoute>
        }
      />

      {/* Side Effects Guide */}
      <Route
        path="/education/side-effects"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'NURSE', 'COUNSELOR']}>
            <SideEffectsGuide />
          </ProtectedRoute>
        }
      />

      {/* Administration Instructions */}
      <Route
        path="/education/instructions"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'NURSE', 'COUNSELOR']}>
            <AdministrationInstructions />
          </ProtectedRoute>
        }
      />

      {/* Education for specific medication */}
      <Route
        path="/:id/education"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'NURSE', 'SCHOOL_ADMIN', 'COUNSELOR']}>
            <MedicationEducation />
          </ProtectedRoute>
        }
      />

      {/* Help/Documentation */}
      <Route
        path="/help"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'NURSE', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN', 'COUNSELOR']}>
            <MedicationHelpModal />
          </ProtectedRoute>
        }
      />

      {/* ============================================== */}
      {/* COMPLIANCE & REPORTING ROUTES */}
      {/* ============================================== */}

      {/* Adherence Tracking */}
      <Route
        path="/adherence"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'NURSE', 'SCHOOL_ADMIN']}>
            <AdherenceTracker />
          </ProtectedRoute>
        }
      />

      {/* Adherence Charts */}
      <Route
        path="/adherence/charts"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'NURSE', 'SCHOOL_ADMIN']}>
            <AdherenceChart />
          </ProtectedRoute>
        }
      />

      {/* Student Adherence Tracking */}
      <Route
        path="/student/:studentId/adherence"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'NURSE', 'SCHOOL_ADMIN']}>
            <AdherenceTracker />
          </ProtectedRoute>
        }
      />

      {/* Compliance Reports */}
      <Route
        path="/compliance"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'NURSE', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN']}>
            <ComplianceReport />
          </ProtectedRoute>
        }
      />

      {/* Audit Log */}
      <Route
        path="/audit-log"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN']}>
            <MedicationAuditLog />
          </ProtectedRoute>
        }
      />

      {/* Audit Log for specific medication */}
      <Route
        path="/:id/audit-log"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN']}>
            <MedicationAuditLog />
          </ProtectedRoute>
        }
      />

      {/* ============================================== */}
      {/* STATISTICS & ANALYTICS ROUTES */}
      {/* ============================================== */}

      {/* Statistics Overview */}
      <Route
        path="/statistics"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'NURSE', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN']}>
            <MedicationStatistics />
          </ProtectedRoute>
        }
      />

      {/* Metrics Charts */}
      <Route
        path="/metrics"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'NURSE', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN']}>
            <MedicationMetricsChart />
          </ProtectedRoute>
        }
      />

      {/* ============================================== */}
      {/* EMERGENCY MEDICATION ROUTES */}
      {/* ============================================== */}

      {/* Emergency Medications Panel */}
      <Route
        path="/emergency"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'NURSE', 'SCHOOL_ADMIN']}>
            <EmergencyMedicationPanel />
          </ProtectedRoute>
        }
      />

      {/* ============================================== */}
      {/* EXPORT & PRINT ROUTES */}
      {/* ============================================== */}

      {/* Export Medications Data */}
      <Route
        path="/export"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'NURSE', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN']}>
            <MedicationExportModal />
          </ProtectedRoute>
        }
      />

      {/* Print View */}
      <Route
        path="/print/:id"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'NURSE', 'SCHOOL_ADMIN']}>
            <MedicationPrintView />
          </ProtectedRoute>
        }
      />

      {/* Print MAR (Medication Administration Record) */}
      <Route
        path="/print/mar/:studentId"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'NURSE', 'SCHOOL_ADMIN']}>
            <MedicationPrintView />
          </ProtectedRoute>
        }
      />

      {/* ============================================== */}
      {/* CATCH-ALL ROUTE */}
      {/* ============================================== */}

      {/* Redirect any unmatched routes to dashboard */}
      <Route path="*" element={<Navigate to="/medications/dashboard" replace />} />
    </Routes>
  );
};

export default MedicationRoutes;
