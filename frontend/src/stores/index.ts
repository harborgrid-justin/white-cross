/**
 * Redux Store - Central Export Module
 *
 * This module provides a clean, centralized export interface for the Redux store,
 * making it easy to import store-related utilities throughout the application.
 *
 * Usage:
 * ```typescript
 * // Import hooks
 * import { useAppDispatch, useAppSelector, useAuthActions, useIncidentActions } from '@/stores';
 *
 * // Import types
 * import type { RootState, AppDispatch } from '@/stores';
 *
 * // Import store instance (rarely needed in components)
 * import { store } from '@/stores';
 * ```
 *
 * @module stores
 */

// =====================
// STORE INSTANCE
// =====================

export { store, default as reduxStore } from './reduxStore';

// =====================
// TYPE EXPORTS
// =====================

export type { RootState, AppDispatch } from './reduxStore';

// =====================
// HOOKS - ALL EXPORTS FROM HOOKS DIRECTORY
// =====================

export * from './hooks';

// =====================
// AUTH SLICE EXPORTS
// =====================

export {
  loginUser,
  registerUser,
  logoutUser,
  refreshUser,
  clearError as clearAuthError,
  setUser,
} from './slices/authSlice';

// =====================
// INCIDENT REPORTS SLICE EXPORTS
// =====================

// Async Thunks
export {
  fetchIncidentReports,
  fetchIncidentReportById,
  createIncidentReport,
  updateIncidentReport,
  deleteIncidentReport,
  searchIncidentReports,
  fetchWitnessStatements,
  createWitnessStatement,
  fetchFollowUpActions,
  createFollowUpAction,
} from './slices/incidentReportsSlice';

// Synchronous Actions
export {
  setFilters,
  setSearchQuery,
  setSelectedIncidentReport,
  clearSelectedIncident,
  setSortOrder,
  setViewMode,
  clearErrors as clearIncidentErrors,
  clearError as clearIncidentError,
  resetState as resetIncidentState,
  invalidateCache as invalidateIncidentCache,
  optimisticUpdateReport,
} from './slices/incidentReportsSlice';

// Selectors
export {
  selectIncidentReports,
  selectCurrentIncident,
  selectWitnessStatements,
  selectFollowUpActions,
  selectSearchResults,
  selectPagination,
  selectFilters,
  selectSearchQuery,
  selectSortConfig,
  selectViewMode,
  selectLoadingStates,
  selectIsLoading,
  selectErrorStates,
  selectError,
  selectIsCacheInvalidated,
  selectLastFetched,
  selectFilteredAndSortedReports,
  selectIncidentsByType,
  selectIncidentsBySeverity,
  selectIncidentsByStatus,
  selectIncidentsRequiringFollowUp,
  selectIncidentsWithUnnotifiedParents,
  selectCriticalIncidents,
  selectReportStatistics,
} from './slices/incidentReportsSlice';

// =====================
// USERS SLICE EXPORTS
// =====================

export {
  usersSlice,
  usersActions,
  usersThunks,
  usersSelectors,
  selectUsersByRole,
  selectActiveUsers,
  selectUsersBySchool,
  selectUsersByDistrict,
} from './slices/usersSlice';

// =====================
// STUDENTS SLICE EXPORTS
// =====================

export {
  studentsSlice,
  studentsActions,
  studentsThunks,
  studentsSelectors,
  selectActiveStudents,
  selectStudentsByGrade,
  selectStudentsByNurse,
  selectStudentsWithAllergies,
  selectStudentsWithMedications,
  selectStudentByNumber,
} from './slices/studentsSlice';

// =====================
// HEALTH RECORDS SLICE EXPORTS
// =====================

export {
  healthRecordsSlice,
  healthRecordsActions,
  healthRecordsThunks,
  healthRecordsSelectors,
  selectHealthRecordsByStudent,
  selectHealthRecordsByType,
  selectRecentHealthRecords,
} from './slices/healthRecordsSlice';

// =====================
// MEDICATIONS SLICE EXPORTS
// =====================

export {
  medicationsSlice,
  medicationsActions,
  medicationsThunks,
  medicationsSelectors,
  selectActiveMedications,
  selectMedicationsByStudent,
  selectMedicationsDueToday,
} from './slices/medicationsSlice';

// =====================
// APPOINTMENTS SLICE EXPORTS
// =====================

export {
  appointmentsSlice,
  appointmentsActions,
  appointmentsThunks,
  appointmentsSelectors,
  selectUpcomingAppointments,
  selectAppointmentsByStudent,
  selectAppointmentsByDate,
} from './slices/appointmentsSlice';

// =====================
// EMERGENCY CONTACTS SLICE EXPORTS
// =====================

export {
  emergencyContactsSlice,
  emergencyContactsActions,
  emergencyContactsThunks,
  emergencyContactsSelectors,
  selectContactsByStudent,
  selectPrimaryContacts,
} from './slices/emergencyContactsSlice';

// =====================
// DOCUMENTS SLICE EXPORTS
// =====================

export {
  documentsSlice,
  documentsActions,
  documentsThunks,
  documentsSelectors,
  selectDocumentsByStudent,
  selectDocumentsByType,
} from './slices/documentsSlice';

// =====================
// COMMUNICATION SLICE EXPORTS
// =====================

export {
  communicationSlice,
  communicationActions,
  communicationThunks,
  communicationSelectors,
  selectUnreadMessages,
  selectMessagesByThread,
} from './slices/communicationSlice';

// =====================
// INVENTORY SLICE EXPORTS
// =====================

export {
  inventorySlice,
  inventoryActions,
  inventoryThunks,
  inventorySelectors,
  selectLowStockItems,
  selectExpiredItems,
} from './slices/inventorySlice';

// =====================
// REPORTS SLICE EXPORTS
// =====================

export {
  reportsSlice,
  reportsActions,
  reportsThunks,
  reportsSelectors,
  selectReportsByType,
  selectRecentReports,
} from './slices/reportsSlice';

// =====================
// SETTINGS SLICE EXPORTS
// =====================

export {
  settingsSlice,
  settingsActions,
  settingsThunks,
  settingsSelectors,
} from './slices/settingsSlice';

// =====================
// DISTRICTS SLICE EXPORTS
// =====================

export {
  districtsSlice,
  districtsActions,
  districtsThunks,
  districtsSelectors,
  selectActiveDistricts,
} from './slices/districtsSlice';

// =====================
// SCHOOLS SLICE EXPORTS
// =====================

export {
  schoolsSlice,
  schoolsActions,
  schoolsThunks,
  schoolsSelectors,
  selectSchoolsByDistrict,
  selectActiveSchools,
} from './slices/schoolsSlice';

// =====================
// UTILITY EXPORTS
// =====================

export {
  clearPersistedState,
  getStorageStats,
} from './reduxStore';
