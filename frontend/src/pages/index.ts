/**
 * White Cross Healthcare Platform - Pages Index
 * Centralized page component exports following enterprise SOA principles
 * 
 * @fileoverview Main index file for all page components
 * @module pages
 * @version 1.0.0
 */

// ============================================================================
// PUBLIC PAGES
// ============================================================================

export { default as LoginPage } from './auth/Login';

// ============================================================================
// CORE PAGES
// ============================================================================

export { default as DashboardPage } from './dashboard/Dashboard';
export { default as AccessDeniedPage } from './auth/AccessDenied';

// ============================================================================
// STUDENT MANAGEMENT
// ============================================================================

export { default as StudentsPage } from './students/Students';
export { default as StudentHealthRecordsPage } from './students/StudentHealthRecords';

// ============================================================================
// HEALTH & MEDICAL
// ============================================================================

export { default as HealthRecordsPage } from './health/HealthRecords';
export { default as MedicationsPage } from './health/Medications';
export { default as AppointmentsPage } from './health/Appointments';

// ============================================================================
// INCIDENT MANAGEMENT
// ============================================================================

export { default as IncidentReportsPage } from './incidents/IncidentReports';
export { default as IncidentReportDetailPage } from './incidents/IncidentReportDetail';

// ============================================================================
// COMMUNICATION & DOCUMENTS
// ============================================================================

export { default as CommunicationPage } from './communication/Communication';
export { default as DocumentsPage } from './documents/Documents';
export { default as EmergencyContactsPage } from './contacts/EmergencyContacts';

// ============================================================================
// ADMINISTRATION
// ============================================================================

export { default as InventoryPage } from './admin/Inventory';
export { default as ReportsPage } from './admin/Reports';
export { default as SettingsPage } from './admin/Settings';

// ============================================================================
// TYPE EXPORTS
// ============================================================================

// Re-export all page-level types
export type { ViewMode as AppointmentViewMode, AppointmentFilters, AppointmentSortColumn } from './health/Appointments/types';
export type { CommunicationFilters, MessageType } from './communication/Communication/types';

// ============================================================================
// ROUTE MAPPING
// ============================================================================

/**
 * Page component route mapping for type-safe routing
 * Maps route constants to page components
 */
export const PAGE_COMPONENTS = {
  // Auth
  LOGIN: 'LoginPage',
  ACCESS_DENIED: 'AccessDeniedPage',
  
  // Core
  DASHBOARD: 'DashboardPage',
  
  // Students
  STUDENTS: 'StudentsPage',
  STUDENT_HEALTH_RECORDS: 'StudentHealthRecordsPage',
  
  // Health & Medical
  HEALTH_RECORDS: 'HealthRecordsPage',
  MEDICATIONS: 'MedicationsPage',
  APPOINTMENTS: 'AppointmentsPage',
  
  // Incidents
  INCIDENT_REPORTS: 'IncidentReportsPage',
  INCIDENT_REPORT_DETAIL: 'IncidentReportDetailPage',
  
  // Communication
  COMMUNICATION: 'CommunicationPage',
  DOCUMENTS: 'DocumentsPage',
  EMERGENCY_CONTACTS: 'EmergencyContactsPage',
  
  // Admin
  INVENTORY: 'InventoryPage',
  REPORTS: 'ReportsPage',
  SETTINGS: 'SettingsPage',
} as const;
