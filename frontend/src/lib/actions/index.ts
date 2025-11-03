/**
 * Healthcare Platform Actions - Selective Barrel Export
 *
 * This barrel provides access to the most commonly used server actions from
 * core healthcare domains without conflicts. The platform has 31+ action modules
 * with overlapping names (ActionResult, create*, get*, etc.), so we export
 * only the essential functions to avoid TypeScript conflicts.
 * 
 * **Scope**: Core healthcare operations (auth, students, medications, incidents)
 * **Coverage**: ~200+ functions available across all domains
 *
 * **Recommendation**: Import directly from specific action files for better
 * tree-shaking and to avoid conflicts:
 * 
 * @example
 * ```typescript
 * // Preferred approach - direct imports
 * import { getStudents, createStudent } from '@/lib/actions/students.actions';
 * import { loginAction, logoutAction } from '@/lib/actions/auth.actions';
 * 
 * // Alternative - barrel imports (limited set)
 * import { getStudents, loginAction } from '@/lib/actions';
 * ```
 *
 * **Note**: For full access to all actions and types, import from specific
 * action files to avoid naming conflicts between modules.
 */

// ==========================================
// CORE ACTIONS (CONFLICT-FREE EXPORTS)
// ==========================================

// Authentication - Most commonly used
export { 
  loginAction, 
  logoutAction, 
  verifySessionAction 
} from './auth.actions';

// Students - Core student management
export { 
  getStudents, 
  getStudent, 
  createStudent, 
  updateStudent 
} from './students.actions';

// Dashboard - Essential dashboard data
export { 
  getDashboardData, 
  getDashboardStats 
} from './dashboard.actions';

// Health Records - Key health operations
export { 
  getHealthRecordsAction, 
  createHealthRecordAction 
} from './health-records.actions';

// Appointments - Scheduling essentials  
export { 
  getAppointments, 
  createAppointment 
} from './appointments.actions';

// Medications - Core medication management
export { 
  getMedications, 
  getMedication, 
  getStudentMedications,
  createMedication,
  administerMedication 
} from './medications.actions';

// Communications - Essential messaging
export { 
  getMessages, 
  createMessage, 
  markMessageAsRead 
} from './communications.actions';

// Notifications - Key notification functions
export { 
  getNotifications, 
  getNotificationPreferences,
  createNotificationAction 
} from './notifications.actions';

// Incidents - Critical incident management
export { 
  getIncidents, 
  getIncident, 
  createIncident 
} from './incidents.actions';

// Reports - Essential reporting
export { 
  getReports, 
  getReport, 
  createReportAction 
} from './reports.actions';

// ==========================================
// TYPE RE-EXPORTS (SINGLE SOURCE)
// ==========================================

// Export ActionResult from a single source to avoid conflicts
export type { ActionResult } from './auth.actions';

// Export commonly used types
export type { 
  LoginFormState, 
  User, 
  AuthResponse 
} from './auth.actions';

// ==========================================
// USAGE NOTES
// ==========================================

/**
 * COMPLETE ACTION MODULES REFERENCE:
 * 
 * For full access to all actions in each domain, import directly:
 * 
 * Core Domains:
 * - Authentication: '@/lib/actions/auth.actions'
 * - Students: '@/lib/actions/students.actions' 
 * - Health Records: '@/lib/actions/health-records.actions'
 * - Medications: '@/lib/actions/medications.actions'
 * - Communications: '@/lib/actions/communications.actions'
 * - Appointments: '@/lib/actions/appointments.actions'
 * - Dashboard: '@/lib/actions/dashboard.actions'
 * 
 * Administrative & Operations:
 * - Admin: '@/lib/actions/admin.actions'
 * - Incidents: '@/lib/actions/incidents.actions'
 * - Reports: '@/lib/actions/reports.actions'
 * - Notifications: '@/lib/actions/notifications.actions'
 * - Settings: '@/lib/actions/settings.actions'
 * - Profile: '@/lib/actions/profile.actions'
 * 
 * Healthcare & Compliance:
 * - Immunizations: '@/lib/actions/immunizations.actions'
 * - Compliance: '@/lib/actions/compliance.actions'
 * - Forms: '@/lib/actions/forms.actions'
 * - Documents: '@/lib/actions/documents.actions'
 * 
 * Financial & Inventory:
 * - Budget: '@/lib/actions/budget.actions'
 * - Billing: '@/lib/actions/billing.actions'
 * - Inventory: '@/lib/actions/inventory.actions'
 * - Purchase Orders: '@/lib/actions/purchase-orders.actions'
 * - Transactions: '@/lib/actions/transactions.actions'
 * - Vendors: '@/lib/actions/vendors.actions'
 * 
 * Communications & Analytics:
 * - Messages: '@/lib/actions/messages.actions'
 * - Broadcasts: '@/lib/actions/broadcasts.actions'
 * - Reminders: '@/lib/actions/reminders.actions'
 * - Alerts: '@/lib/actions/alerts.actions'
 * - Analytics: '@/lib/actions/analytics.actions'
 * 
 * Data Management:
 * - Import: '@/lib/actions/import.actions'
 * - Export: '@/lib/actions/export.actions'
 * 
 * This approach provides better TypeScript support, tree-shaking,
 * and avoids the complexity of resolving export conflicts across
 * 31+ action modules.
 */
