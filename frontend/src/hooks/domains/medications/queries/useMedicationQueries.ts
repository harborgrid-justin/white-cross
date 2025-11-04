/**
 * Medication Query Hooks
 *
 * Enterprise-grade query hooks for medication data fetching with
 * HIPAA compliance, proper PHI handling, and healthcare-appropriate caching.
 *
 * This file serves as the central export point for all medication query hooks.
 * Implementation has been modularized into focused files:
 * - useMedicationCoreQueries: Core medication data (lists, details, student medications)
 * - useMedicationScheduleQueries: Reminders and administration scheduling
 * - useMedicationMonitoringQueries: Inventory, alerts, reactions, statistics
 * - useMedicationDashboard: Composite hook for dashboard views
 *
 * @module hooks/domains/medications/queries/useMedicationQueries
 * @author White Cross Healthcare Platform
 * @version 3.0.0
 */

// Core medication queries
export {
  useMedicationsList,
  useStudentMedications,
  useMedicationDetails,
} from './useMedicationCoreQueries';

// Schedule and reminder queries
export {
  useMedicationReminders,
  useUpcomingReminders,
  useAdministrationSchedule,
} from './useMedicationScheduleQueries';

// Monitoring and inventory queries
export {
  useMedicationInventory,
  useAdverseReactions,
  useMedicationAlerts,
  useMedicationStatistics,
} from './useMedicationMonitoringQueries';

// Dashboard composite hook
export {
  useMedicationDashboard,
} from './useMedicationDashboard';
