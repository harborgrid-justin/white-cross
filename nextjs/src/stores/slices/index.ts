/**
 * @fileoverview Redux Slices - Central export point for all Redux slices
 * @module stores/slices
 * @category Store
 *
 * Exports all Redux slices for easy import throughout the application.
 * Slices are organized by domain following Domain-Driven Design principles.
 */

// ============================================================
// CORE SLICES - Authentication & Authorization
// ============================================================
export { default as authReducer, authSlice } from './authSlice';
export type { AuthState } from './authSlice';

export { default as usersReducer, usersSlice } from './usersSlice';
export type { UsersState } from './usersSlice';

export { default as accessControlReducer, accessControlSlice } from './accessControlSlice';

// ============================================================
// DASHBOARD & OVERVIEW
// ============================================================
export { default as dashboardReducer } from './dashboardSlice';

// ============================================================
// HEALTHCARE DOMAIN
// ============================================================
export { default as healthRecordsReducer, healthRecordsSlice } from './healthRecordsSlice';
export type { HealthRecordsState } from './healthRecordsSlice';

export { default as medicationsReducer, medicationsSlice } from './medicationsSlice';
export type { MedicationsState } from './medicationsSlice';

export { default as appointmentsReducer, appointmentsSlice } from './appointmentsSlice';
export type { AppointmentsState } from './appointmentsSlice';

// ============================================================
// STUDENT MANAGEMENT
// ============================================================
export { default as studentsReducer, studentsSlice } from './studentsSlice';
export type { StudentsState } from './studentsSlice';

export { default as emergencyContactsReducer, emergencyContactsSlice } from './emergencyContactsSlice';
export type { EmergencyContactsState } from './emergencyContactsSlice';

// ============================================================
// INCIDENT MANAGEMENT
// ============================================================
export { default as incidentReportsReducer, incidentReportsSlice } from './incidentReportsSlice';
export type { IncidentReportsState } from './incidentReportsSlice';

// ============================================================
// ADMINISTRATION
// ============================================================
export { default as districtsReducer } from './districtsSlice';
export { default as schoolsReducer } from './schoolsSlice';
export { default as settingsReducer } from './settingsSlice';
export { default as adminReducer } from './adminSlice';
export { default as configurationReducer } from './configurationSlice';

// ============================================================
// COMMUNICATION & DOCUMENTATION
// ============================================================
export { default as communicationReducer } from './communicationSlice';
export { default as documentsReducer } from './documentsSlice';
export { default as contactsReducer } from './contactsSlice';

// ============================================================
// OPERATIONS & INVENTORY
// ============================================================
export { default as inventoryReducer } from './inventorySlice';
export { default as reportsReducer } from './reportsSlice';
export { default as budgetReducer } from './budgetSlice';
export { default as purchaseOrderReducer } from './purchaseOrderSlice';
export { default as vendorReducer } from './vendorSlice';
export { default as integrationReducer } from './integrationSlice';

// ============================================================
// COMPLIANCE & ACCESS CONTROL
// ============================================================
export { default as complianceReducer } from './complianceSlice';

// ============================================================
// UI PREFERENCES & NOTIFICATIONS (NEW)
// ============================================================
export { default as themeReducer } from './themeSlice';
export type { ThemeState, ThemeMode, ColorScheme, UIDensity } from './themeSlice';

export { default as notificationsReducer } from './notificationsSlice';
export type { NotificationsState, Notification, NotificationType, NotificationPriority } from './notificationsSlice';
