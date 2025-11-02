/**
 * Centralized Server Actions Export
 *
 * All server actions are organized in this directory following Next.js best practices.
 * Import server actions from this barrel export for cleaner imports.
 *
 * @example
 * ```typescript
 * import { getStudents, createStudent } from '@/lib/actions';
 * ```
 */

// Student Management
export * from './students.actions';

// Health Records
export * from './health-records.actions';

// Medications
export * from './medications.actions';

// Immunizations
export * from './immunizations.actions';

// Appointments
export * from './appointments.actions';

// Incidents
export * from './incidents.actions';

// Inventory
export * from './inventory.actions';

// Communications
export * from './communications.actions';
export * from './messages.actions';
export * from './broadcasts.actions';
export * from './notifications.actions';

// Analytics & Reporting
export * from './analytics.actions';
export * from './reports.actions';
export * from './dashboard.actions';

// Administration
export * from './admin.actions';
export * from './settings.actions';
export * from './alerts.actions';

// User Management
export * from './auth.actions';
export * from './login.actions';
export * from './profile.actions';

// Data Management
export * from './import.actions';
export * from './export.actions';
export * from './documents.actions';
export * from './forms.actions';

// Financial
export * from './billing.actions';
export * from './budget.actions';
export * from './transactions.actions';
export * from './purchase-orders.actions';
export * from './vendors.actions';

// Compliance
export * from './compliance.actions';

// Utilities
export * from './reminders.actions';
