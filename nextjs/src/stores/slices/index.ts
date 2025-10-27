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
export { default as authReducer } from './authSlice';

export { usersReducer, usersSlice } from './usersSlice';

export { default as accessControlReducer } from './accessControlSlice';

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
export { districtsReducer } from './districtsSlice';
export { schoolsReducer } from './schoolsSlice';
export { settingsReducer } from './settingsSlice';
export { default as adminReducer } from './adminSlice';
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
export { default as inventoryReducer } from './inventorySlice';
export { reportsReducer } from './reportsSlice';
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
