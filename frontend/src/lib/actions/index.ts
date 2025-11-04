/**
 * Healthcare Platform Actions - Selective Barrel Export
 *
 * This barrel provides access to the most commonly used server actions from
 * core healthcare domains without conflicts. The platform has 30 action modules
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
 * COMPLETE ACTION MODULES REFERENCE (30 modules):
 *
 * For full access to all actions in each domain, import directly:
 *
 * Core Domains (7 modules):
 * 1. Authentication: '@/lib/actions/auth.actions'
 * 2. Students: '@/lib/actions/students.actions'
 * 3. Health Records: '@/lib/actions/health-records.actions'
 * 4. Medications: '@/lib/actions/medications.actions'
 * 5. Communications: '@/lib/actions/communications.actions'
 * 6. Appointments: '@/lib/actions/appointments.actions'
 * 7. Dashboard: '@/lib/actions/dashboard.actions'
 *
 * Administrative & Operations (6 modules):
 * 8. Admin: '@/lib/actions/admin.actions'
 * 9. Incidents: '@/lib/actions/incidents.actions'
 * 10. Reports: '@/lib/actions/reports.actions'
 * 11. Notifications: '@/lib/actions/notifications.actions'
 * 12. Settings: '@/lib/actions/settings.actions'
 * 13. Profile: '@/lib/actions/profile.actions'
 *
 * Healthcare & Compliance (4 modules):
 * 14. Immunizations: '@/lib/actions/immunizations.actions'
 * 15. Compliance: '@/lib/actions/compliance.actions'
 * 16. Forms: '@/lib/actions/forms.actions'
 * 17. Documents: '@/lib/actions/documents.actions'
 *
 * Financial & Inventory (6 modules):
 * 18. Budget: '@/lib/actions/budget.actions'
 * 19. Billing: '@/lib/actions/billing.actions'
 * 20. Inventory: '@/lib/actions/inventory.actions'
 * 21. Purchase Orders: '@/lib/actions/purchase-orders.actions'
 * 22. Transactions: '@/lib/actions/transactions.actions'
 * 23. Vendors: '@/lib/actions/vendors.actions'
 *
 * Communications & Analytics (5 modules):
 * 24. Messages: '@/lib/actions/messages.actions'
 * 25. Broadcasts: '@/lib/actions/broadcasts.actions'
 * 26. Reminders: '@/lib/actions/reminders.actions'
 * 27. Alerts: '@/lib/actions/alerts.actions'
 * 28. Analytics: '@/lib/actions/analytics.actions'
 *
 * Data Management (2 modules):
 * 29. Import: '@/lib/actions/import.actions'
 * 30. Export: '@/lib/actions/export.actions'
 *
 * This approach provides better TypeScript support, tree-shaking,
 * and avoids the complexity of resolving export conflicts across
 * 30 action modules.
 */
