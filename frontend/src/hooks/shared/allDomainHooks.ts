/**
 * Comprehensive Domain-Specific Redux Hooks
 *
 * Specialized hooks for all domain slices in the application.
 * These hooks provide convenient access to domain-specific state and actions.
 *
 * @module allDomainHooks
 */

// Re-export all domain hooks from modular files

// Users and Students hooks
export {
  useUsersActions,
  useUsers,
  useUserById,
  useUsersByRole,
  useActiveUsers,
  useStudentsActions,
  useStudents,
  useStudentById,
  useActiveStudents,
  useStudentsByGrade,
  useStudentsWithAllergies,
} from './domainHooks.users';

// Health Management hooks
export {
  useHealthRecordsActions,
  useHealthRecords,
  useHealthRecordsByStudent,
  useMedicationsActions,
  useMedications,
  useActiveMedications,
  useMedicationsByStudent,
  useMedicationsDueToday,
  useAppointmentsActions,
  useAppointments,
  useUpcomingAppointments,
  useAppointmentsByStudent,
} from './domainHooks.health';

// Communication & Contacts hooks
export {
  useEmergencyContactsActions,
  useEmergencyContacts,
  useContactsByStudent,
  useDocumentsActions,
  useDocuments,
  useDocumentsByStudent,
  useCommunicationActions,
  useMessages,
  useUnreadMessages,
} from './domainHooks.communication';

// Operations hooks
export {
  useInventoryActions,
  useInventoryItems,
  useLowStockItems,
  useExpiredItems,
  useReportsActions,
  useReports,
  useSettingsActions,
  useSettings,
} from './domainHooks.operations';

// Organization hooks
export {
  useDistrictsActions,
  useDistricts,
  useActiveDistricts,
  useSchoolsActions,
  useSchools,
  useSchoolsByDistrict,
  useActiveSchools,
} from './domainHooks.organization';
