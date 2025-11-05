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
// MOVED: authReducer → @/identity-access/stores/authSlice
// MOVED: accessControlReducer → @/identity-access/stores/accessControlSlice

export { usersReducer, usersSlice } from './usersSlice';

// ============================================================
// DASHBOARD & OVERVIEW
// ============================================================
export { default as dashboardReducer } from './dashboardSlice';

// ============================================================
// HEALTHCARE DOMAIN
// ============================================================
export { healthRecordsReducer, healthRecordsSlice } from './healthRecordsSlice';

export { medicationsReducer, medicationsSlice } from './medicationsSlice';

export { appointmentsReducer, appointmentsSlice } from './appointmentsSlice';

// ============================================================
// STUDENT MANAGEMENT
// ============================================================
export { studentsReducer, studentsSlice } from './studentsSlice';

export { emergencyContactsReducer, emergencyContactsSlice } from './emergencyContactsSlice';

// ============================================================
// INCIDENT MANAGEMENT
// ============================================================
export { default as incidentReportsReducer } from './incidentReportsSlice';

// ============================================================
// ADMINISTRATION
// ============================================================
// REMOVED: districtsReducer - Unused, legacy pages-old only
// REMOVED: schoolsReducer - Unused, legacy pages-old only
export { settingsReducer } from './settingsSlice';
// REMOVED: adminReducer - Unused, 43KB removed
export { default as configurationReducer } from './configurationSlice';

// ============================================================
// COMMUNICATION & DOCUMENTATION
// ============================================================
export { communicationReducer } from './communicationSlice';
export { documentsReducer } from './documentsSlice';
export { default as contactsReducer } from './contactsSlice';

// ============================================================
// OPERATIONS & INVENTORY
// ============================================================
// REMOVED: inventoryReducer - Unused, legacy pages-old only (24KB)
// REMOVED: reportsReducer - Unused, legacy pages-old only
// REMOVED: budgetReducer - Unused, legacy pages-old only
// REMOVED: purchaseOrderReducer - Unused, legacy pages-old only (25KB)
// REMOVED: vendorReducer - Unused, legacy pages-old only (18KB)
// REMOVED: integrationReducer - Unused, legacy pages-old only (32KB)

// ============================================================
// COMPLIANCE & ACCESS CONTROL
// ============================================================
// REMOVED: complianceReducer - Unused, legacy pages-old only (25KB)

// ============================================================
// UI PREFERENCES & NOTIFICATIONS (NEW)
// ============================================================
export { default as themeReducer } from './themeSlice';
export type { ThemeState, ThemeMode, ColorScheme, UIDensity } from './themeSlice';

export { default as notificationsReducer } from './notificationsSlice';
export type { NotificationsState, Notification, NotificationType, NotificationPriority } from './notificationsSlice';
