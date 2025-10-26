/**
 * White Cross Healthcare Platform - Pages Index
 * Centralized page component exports following enterprise SOA principles
 * 
 * @fileoverview Main index file for all page components
 * @module pages
 * @version 1.0.0
 */

// ============================================================================
// AUTHENTICATION PAGES
// ============================================================================

export { default as Login } from './auth/Login';
export { default as AccessDenied } from './auth/AccessDenied';

// ============================================================================
// CORE PAGES
// ============================================================================

export { default as Dashboard } from './dashboard/Dashboard';

// ============================================================================
// STUDENT MANAGEMENT
// ============================================================================

export { default as Students } from './students/Students';
export { default as StudentHealthRecords } from './students/StudentHealthRecords';

// ============================================================================
// HEALTH & MEDICAL
// ============================================================================

export { default as HealthRecords } from './health/HealthRecords';
export { default as Medications } from './health/Medications';
export { default as Appointments } from './health/Appointments';

// ============================================================================
// APPOINTMENTS
// ============================================================================

export { default as AppointmentCreate } from './appointments/AppointmentCreate';
export { default as AppointmentDetail } from './appointments/AppointmentDetail';
export { default as AppointmentSchedule } from './appointments/AppointmentSchedule';
export { default as AppointmentsList } from './appointments/Appointments';

// ============================================================================
// INCIDENT MANAGEMENT
// ============================================================================

export { default as IncidentReports } from './incidents/IncidentReports';
export { default as IncidentReportDetail } from './incidents/IncidentReportDetail';

// ============================================================================
// INVENTORY MANAGEMENT
// ============================================================================

export { default as InventoryItems } from './inventory/InventoryItems';
export { default as InventoryAlerts } from './inventory/InventoryAlerts';
export { default as InventoryTransactions } from './inventory/InventoryTransactions';
export { default as InventoryVendors } from './inventory/InventoryVendors';

// ============================================================================
// REPORTS & ANALYTICS
// ============================================================================

export { default as ReportsGenerate } from './reports/ReportsGenerate';
export { default as ScheduledReports } from './reports/ScheduledReports';

// ============================================================================
// BUDGET MANAGEMENT
// ============================================================================

export { default as BudgetOverview } from './budget/BudgetOverview';
export { default as BudgetPlanning } from './budget/BudgetPlanning';
export { default as BudgetTracking } from './budget/BudgetTracking';
export { default as BudgetReports } from './budget/BudgetReports';

// ============================================================================
// ADMINISTRATION
// ============================================================================

export { default as Users } from './admin/Users';
export { default as Roles } from './admin/Roles';
export { default as Permissions } from './admin/Permissions';
export { default as Inventory } from './admin/Inventory';
export { default as Reports } from './admin/Reports';
export { default as Settings } from './admin/Settings';

// ============================================================================
// COMMUNICATION & DOCUMENTS
// ============================================================================

export { default as Communication } from './communication/Communication';
export { default as Documents } from './documents/Documents';
export { default as EmergencyContacts } from './contacts/EmergencyContacts';

// ============================================================================
// ROUTE MAPPING
// ============================================================================

/**
 * Page component route mapping for type-safe routing
 * Maps route constants to page components based on actual file structure
 */
export const PAGE_COMPONENTS = {
  // Auth
  LOGIN: 'Login',
  ACCESS_DENIED: 'AccessDenied',
  
  // Core
  DASHBOARD: 'Dashboard',
  
  // Students
  STUDENTS: 'Students',
  STUDENT_HEALTH_RECORDS: 'StudentHealthRecords',
  
  // Health & Medical
  HEALTH_RECORDS: 'HealthRecords',
  MEDICATIONS: 'Medications',
  APPOINTMENTS: 'Appointments',
  
  // Appointments Management
  APPOINTMENT_CREATE: 'AppointmentCreate',
  APPOINTMENT_DETAIL: 'AppointmentDetail',
  APPOINTMENT_SCHEDULE: 'AppointmentSchedule',
  
  // Incidents
  INCIDENT_REPORTS: 'IncidentReports',
  INCIDENT_REPORT_DETAIL: 'IncidentReportDetail',
  
  // Inventory
  INVENTORY_ITEMS: 'InventoryItems',
  INVENTORY_ALERTS: 'InventoryAlerts',
  INVENTORY_TRANSACTIONS: 'InventoryTransactions',
  INVENTORY_VENDORS: 'InventoryVendors',
  
  // Reports
  REPORTS_GENERATE: 'ReportsGenerate',
  SCHEDULED_REPORTS: 'ScheduledReports',
  
  // Budget
  BUDGET_OVERVIEW: 'BudgetOverview',
  BUDGET_PLANNING: 'BudgetPlanning',
  BUDGET_TRACKING: 'BudgetTracking',
  BUDGET_REPORTS: 'BudgetReports',
  
  // Admin
  ADMIN_USERS: 'Users',
  ADMIN_ROLES: 'Roles',
  ADMIN_PERMISSIONS: 'Permissions',
  ADMIN_INVENTORY: 'Inventory',
  ADMIN_REPORTS: 'Reports',
  ADMIN_SETTINGS: 'Settings',
  
  // Communication
  COMMUNICATION: 'Communication',
  DOCUMENTS: 'Documents',
  EMERGENCY_CONTACTS: 'EmergencyContacts',
} as const;
