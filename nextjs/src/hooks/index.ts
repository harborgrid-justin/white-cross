/**
 * Main Hooks Export Hub
 *
 * Centralized export module for all domain-specific React hooks in the White Cross
 * Healthcare Platform. This module provides a unified import interface for accessing
 * hooks across all healthcare domains including medications, students, appointments,
 * compliance, and more.
 *
 * @module hooks/index
 * @author White Cross Healthcare Platform
 * @version 3.0.0
 *
 * @remarks
 * **Architecture**:
 * - Domain-driven organization (medications/, students/, health/, etc.)
 * - Separation of concerns (queries/, mutations/, composites/)
 * - Selective exports to avoid naming conflicts
 * - Type-safe exports with TypeScript
 *
 * **Domain Organization**:
 * - **Administration**: User management, departments, system configuration
 * - **Appointments**: Appointment scheduling and management
 * - **Budgets**: Budget tracking and financial management
 * - **Compliance**: HIPAA compliance, audit logs, policies
 * - **Dashboard**: Statistics, metrics, analytics
 * - **Documents**: Document management, templates, signatures
 * - **Emergency**: Emergency contacts and protocols
 * - **Health**: Health records, vital signs, immunizations
 * - **Incidents**: Incident reporting and tracking
 * - **Inventory**: Medical supply inventory management
 * - **Medications**: Medication administration and tracking
 * - **Purchase Orders**: Vendor purchase order management
 * - **Reports**: Healthcare reporting and analytics
 * - **Students**: Student information and management
 * - **Vendors**: Vendor management
 *
 * **Naming Conflict Resolution**:
 * ```typescript
 * // useUserPermissions renamed to useAdminUserPermissions to avoid conflicts
 * export { useUserPermissions as useAdminUserPermissions } from './domains/administration';
 * ```
 *
 * **Import Patterns**:
 * ```typescript
 * // Import specific hooks
 * import { useStudents, useMedications } from '@/hooks';
 *
 * // Import domain-specific hooks
 * import { useComplianceQueries } from '@/hooks';
 *
 * // Import utilities
 * import type { QueryClient } from '@/hooks';
 * ```
 *
 * @example
 * ```typescript
 * // Example 1: Using student hooks
 * import { useStudents, useStudentDetails } from '@/hooks';
 *
 * function StudentProfile({ studentId }: { studentId: string }) {
 *   const { data: student, isLoading } = useStudentDetails(studentId);
 *
 *   if (isLoading) return <div>Loading...</div>;
 *   return <div>{student.name}</div>;
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Example 2: Using multiple domain hooks
 * import {
 *   useStudents,
 *   useMedications,
 *   useAppointments
 * } from '@/hooks';
 *
 * function DashboardView() {
 *   const students = useStudents();
 *   const medications = useMedications();
 *   const appointments = useAppointments();
 *
 *   return (
 *     <div>
 *       <StudentList data={students.data} />
 *       <MedicationList data={medications.data} />
 *       <AppointmentList data={appointments.data} />
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Example 3: Using administration hooks with renamed exports
 * import {
 *   useUsers,
 *   useAdminUserPermissions, // Renamed from useUserPermissions
 *   useAuditLogs
 * } from '@/hooks';
 *
 * function AdminPanel() {
 *   const users = useUsers();
 *   const permissions = useAdminUserPermissions('user-123');
 *   const auditLogs = useAuditLogs();
 *
 *   return <AdminDashboard {...{ users, permissions, auditLogs}} />;
 * }
 * ```
 *
 * @see {@link ./domains} for individual domain hook implementations
 * @see {@link ./shared} for shared utility hooks
 * @see {@link ./utilities} for infrastructure utility hooks
 *
 * @since 1.0.0
 */

// Main Hooks Export Module
// Centralized exports for all domain hooks

// New Domain Exports - Generated Hooks
export * from './domains/compliance';
export * from './domains/documents';
export * from './domains/budgets';
export * from './domains/vendors';
export * from './domains/purchase-orders';

// Administration Domain (selective export to avoid useUserPermissions conflict)
export {
  // User Management Queries
  useUsers,
  useUserDetails,
  useUserRoles,
  // Renamed to avoid conflict: useUserPermissions -> useAdminUserPermissions
  useUserPermissions as useAdminUserPermissions,
  
  // Department Management
  useDepartments,
  useDepartmentDetails,
  useDepartmentStaff,
  
  // Settings & Configuration
  useSettings,
  useSettingDetails,
  useSystemConfigurations,
  useSystemConfiguration,
  
  // Audit & Notifications
  useAuditLogs,
  useAuditLogDetails,
  useNotifications,
  useNotificationDetails,
  useUserNotifications,
  
  // System Health & Activity
  useSystemHealth,
  useUserActivity,
  
  // Dashboard & Reports
  useAdministrationDashboard,
  useAdministrationStats,
  useAdministrationReports,
} from './domains/administration';

// Existing Domains
export * from './domains/appointments';
export * from './domains/medications';
export * from './domains/access-control';
export * from './domains/communication';
export * from './domains/reports';
export * from './domains/health';
export * from './domains/emergency';
export * from './domains/incidents';
export * from './domains/inventory';

// Dashboard Domain (corrected exports)
export { 
  useDashboardStatistics,
  useDashboardMetrics,
  useDashboardOverview,
  useDashboardAnalytics,
  useDashboardCharts,
  useDashboardAlerts,
  useDashboardActivities,
  // Statistics hooks
  useAppointmentStatistics,
  useStudentStatistics,
  useHealthRecordsStatistics,
  useMedicationStatistics,
  useInventoryStatistics,
  useIncidentStatistics,
  // Mutations
  useDashboardMutations,
  useUpdateDashboardLayout,
  useExportDashboardData,
  useRefreshDashboard,
  // Composites
  useDashboardData,
  useDashboardManagement,
} from './domains/dashboard';

// Note: Purchase Orders domain is available at './domains/purchase-orders'
// Additional domains can be imported individually as needed

// Utility exports for common patterns
export type { QueryClient } from '@tanstack/react-query';
