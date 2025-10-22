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
// DOMAIN-BASED ORGANIZATION (NEW ENTERPRISE STRUCTURE)
// =====================

// Domain exports for enterprise-grade organization
export * from './domains';

// Shared utilities and cross-cutting concerns
export * from './shared';

// Domain-specific hooks and selectors available via domain imports
// Example: import { useAuth, useHealthAlerts } from '@/stores/domains/core';
//          import { useNurseDashboard } from '@/stores/domains/healthcare';
//          import { enterpriseFeatures } from '@/stores/shared/enterprise';

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
// INCIDENT REPORTS SLICE EXPORTS (MOVED TO PAGES)
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
} from '../pages/incidents/store/incidentReportsSlice';

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
} from '../pages/incidents/store/incidentReportsSlice';

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
} from '../pages/incidents/store/incidentReportsSlice';

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
// STUDENTS SLICE EXPORTS (MOVED TO PAGES)
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
} from '../pages/students/store/studentsSlice';

// =====================
// HEALTH RECORDS SLICE EXPORTS (MOVED TO PAGES)
// =====================

export {
  healthRecordsSlice,
  healthRecordsActions,
  healthRecordsThunks,
  healthRecordsSelectors,
  selectHealthRecordsByStudent,
  selectHealthRecordsByType,
  selectRecentHealthRecords,
} from '../pages/students/store/healthRecordsSlice';

// =====================
// MEDICATIONS SLICE EXPORTS (MOVED TO PAGES)
// =====================

export {
  medicationsSlice,
  medicationsActions,
  medicationsThunks,
  medicationsSelectors,
  selectActiveMedications,
  selectMedicationsByStudent,
  selectActiveMedicationsByStudent,
} from '../pages/medications/store/medicationsSlice';

// =====================
// APPOINTMENTS SLICE EXPORTS (MOVED TO PAGES)
// =====================

export {
  appointmentsSlice,
  appointmentsActions,
  appointmentsThunks,
  appointmentsSelectors,
  selectUpcomingAppointments,
  selectAppointmentsByStudent,
  selectAppointmentsByType,
} from '../pages/appointments/store/appointmentsSlice';

// =====================
// EMERGENCY CONTACTS SLICE EXPORTS (MOVED TO PAGES)
// =====================

export {
  emergencyContactsSlice,
  emergencyContactsActions,
  emergencyContactsThunks,
  emergencyContactsSelectors,
  selectContactsByStudent,
  selectPrimaryContacts,
} from '../pages/students/store/emergencyContactsSlice';

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
  selectSentMessages,
  selectMessagesByType,
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
  selectExpiringItems,
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
