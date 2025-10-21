/**
 * Healthcare Domain Store
 * 
 * Handles all medical and health-related state including student health records,
 * medications, appointments, incident reports, and emergency contacts.
 * This domain represents the core healthcare functionality of the platform.
 * 
 * @domain healthcare
 */

// Re-export existing health-related slices with domain organization
export {
  // Health Records slice - medical history and examinations
  healthRecordsSlice,
  healthRecordsActions,
  healthRecordsThunks,
  healthRecordsSelectors,
  selectHealthRecordsByStudent,
  selectHealthRecordsByType,
  selectRecentHealthRecords,
} from '../../slices/healthRecordsSlice';

export {
  // Medications slice - medication management and administration
  medicationsSlice,
  medicationsActions,
  medicationsThunks,
  medicationsSelectors,
  selectActiveMedications,
  selectMedicationsByStudent,
  selectActiveMedicationsByStudent,
  selectMedicationsRequiringConsent,
  selectMedicationsByRoute,
  selectExpiringMedications,
} from '../../slices/medicationsSlice';

export {
  // Appointments slice - medical appointments and scheduling
  appointmentsSlice,
  appointmentsActions,
  appointmentsThunks,
  appointmentsSelectors,
  selectUpcomingAppointments,
  selectAppointmentsByStudent,
} from '../../slices/appointmentsSlice';

export {
  // Incident Reports slice - injury and incident documentation
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
} from '../../slices/incidentReportsSlice';

export {
  // Emergency Contacts slice - emergency contact management
  emergencyContactsSlice,
  emergencyContactsActions,
  emergencyContactsThunks,
  emergencyContactsSelectors,
  selectContactsByStudent,
  selectPrimaryContacts,
} from '../../slices/emergencyContactsSlice';

export {
  // Students slice - student information related to healthcare
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
} from '../../slices/studentsSlice';

// Domain-specific selectors and hooks
export * from './selectors';
export * from './hooks';
export * from './types';

// Healthcare workflows
export * from './workflows';