// Main API exports - provides both new modular API and backward compatibility

// Configuration and utilities
export {
  apiInstance,
  tokenUtils,
  API_CONFIG,
  API_ENDPOINTS
} from './config/apiConfig';

export {
  handleApiError,
  extractApiData,
  extractApiDataOptional,
  buildUrlParams,
  buildPaginationParams,
  formatDateForApi,
  parseDateFromApi,
  withRetry,
  createFormData,
  isApiResponse,
  isPaginatedResponse,
  apiCache,
  withCache,
  debounce
} from './utils/apiUtils';

// Export ApiError type from utils
export type { ApiError } from './utils/apiUtils';

// Type exports
export * from './types';

// Modular API exports
export { authApi } from './modules/authApi';
export type { LoginCredentials, RegisterData, AuthApi } from './modules/authApi';

export { studentsApi } from './modules/studentsApi';
export type { 
  StudentFilters, 
  StudentsApi 
} from './modules/studentsApi';

export { healthRecordsApi } from './modules/healthRecordsApi';
export type { 
  HealthRecordFilters,
  GrowthData,
  VaccinationRecord,
  HealthSummary,
  HealthRecordsApi 
} from './modules/healthRecordsApi';

export { medicationsApi } from './modules/medicationsApi';
export type { 
  MedicationFilters,
  StudentMedication,
  MedicationSchedule,
  MedicationsApi
} from './modules/medicationsApi';

export { documentsApi } from './modules/documentsApi';
export type { DocumentsApi } from './modules/documentsApi';

export { reportsApi } from './modules/reportsApi';
export type { ReportsApi } from './modules/reportsApi';

export { appointmentsApi } from './modules/appointmentsApi';
export type { IAppointmentsApi } from './modules/appointmentsApi';

export { communicationApi } from './modules/communicationApi';
export type { ICommunicationApi } from './modules/communicationApi';

export { accessControlApi } from './modules/accessControlApi';
export type { IAccessControlApi } from './modules/accessControlApi';

export { complianceApi } from './modules/complianceApi';
export type { IComplianceApi } from './modules/complianceApi';

export { emergencyContactsApi } from './modules/emergencyContactsApi';
export type { IEmergencyContactsApi } from './modules/emergencyContactsApi';

export { incidentReportsApi } from './modules/incidentReportsApi';
export type { IIncidentReportsApi } from './modules/incidentReportsApi';

// Backward compatibility - re-export the old api instance and legacy APIs
import { apiInstance } from './config/apiConfig';
import { authApi } from './modules/authApi';
import { studentsApi } from './modules/studentsApi';
import { healthRecordsApi } from './modules/healthRecordsApi';
import { medicationsApi } from './modules/medicationsApi';

// Legacy default export for backward compatibility
const api = apiInstance;
export default api;

// Legacy API object exports for backward compatibility
export {
  authApi as authApi_legacy,
  studentsApi as studentsApi_legacy
};

// Create a backward-compatible API object that matches the old structure
export const legacyApi = {
  // Auth API - matches old authApi structure
  authApi: {
    login: authApi.login.bind(authApi),
    register: authApi.register.bind(authApi),
    verifyToken: authApi.verifyToken.bind(authApi),
  },

  // Students API - matches old studentsApi structure  
  studentsApi: {
    getAll: (page = 1, limit = 10) => 
      studentsApi.getAll({ page, limit }),
    getById: studentsApi.getById.bind(studentsApi),
    create: studentsApi.create.bind(studentsApi),
    update: studentsApi.update.bind(studentsApi),
    delete: studentsApi.delete.bind(studentsApi),
    getAssignedStudents: studentsApi.getAssignedStudents.bind(studentsApi),
  },

  // Health Records API - matches old healthRecordApi structure
  healthRecordApi: {
    getStudentHealthRecords: (studentId: string, params?: any) =>
      healthRecordsApi.getStudentHealthRecords(studentId, params),
    createHealthRecord: healthRecordsApi.createHealthRecord.bind(healthRecordsApi),
    updateHealthRecord: healthRecordsApi.updateHealthRecord.bind(healthRecordsApi),
    getStudentAllergies: healthRecordsApi.getStudentAllergies.bind(healthRecordsApi),
    addAllergy: healthRecordsApi.addAllergy.bind(healthRecordsApi),
    updateAllergy: healthRecordsApi.updateAllergy.bind(healthRecordsApi),
    deleteAllergy: healthRecordsApi.deleteAllergy.bind(healthRecordsApi),
    getStudentChronicConditions: healthRecordsApi.getStudentChronicConditions.bind(healthRecordsApi),
    addChronicCondition: healthRecordsApi.addChronicCondition.bind(healthRecordsApi),
    updateChronicCondition: healthRecordsApi.updateChronicCondition.bind(healthRecordsApi),
    deleteChronicCondition: healthRecordsApi.deleteChronicCondition.bind(healthRecordsApi),
    getVaccinationRecords: healthRecordsApi.getVaccinationRecords.bind(healthRecordsApi),
    getGrowthChartData: healthRecordsApi.getGrowthChartData.bind(healthRecordsApi),
    getRecentVitals: healthRecordsApi.getRecentVitals.bind(healthRecordsApi),
    getHealthSummary: healthRecordsApi.getHealthSummary.bind(healthRecordsApi),
    searchHealthRecords: healthRecordsApi.searchHealthRecords.bind(healthRecordsApi),
    exportHealthHistory: healthRecordsApi.exportHealthHistory.bind(healthRecordsApi),
    importHealthRecords: healthRecordsApi.importHealthRecords.bind(healthRecordsApi),
  },

  // Medications API - matches old medicationsApi structure
  medicationsApi: {
    getAll: (page = 1, limit = 20, search?: string) =>
      medicationsApi.getAll({ page, limit, search }),
    create: medicationsApi.create.bind(medicationsApi),
    assignToStudent: medicationsApi.assignToStudent.bind(medicationsApi),
    logAdministration: medicationsApi.logAdministration.bind(medicationsApi),
    getStudentLogs: (studentId: string, page = 1, limit = 20) =>
      medicationsApi.getStudentLogs(studentId, { page, limit }),
    getInventory: medicationsApi.getInventory.bind(medicationsApi),
    getSchedule: (startDate?: Date, endDate?: Date, nurseId?: string) =>
      medicationsApi.getSchedule(
        startDate?.toISOString(),
        endDate?.toISOString(),
        nurseId
      ),
    getReminders: (date?: Date) =>
      medicationsApi.getReminders(date?.toISOString()),
    reportAdverseReaction: medicationsApi.reportAdverseReaction.bind(medicationsApi),
    getAdverseReactions: medicationsApi.getAdverseReactions.bind(medicationsApi),
    deactivateStudentMedication: medicationsApi.deactivateStudentMedication.bind(medicationsApi),
  }
};

// Individual legacy exports for direct import compatibility
export const {
  authApi: authApi_compat,
  studentsApi: studentsApi_compat,
  healthRecordApi,
  medicationsApi: medicationsApi_compat
} = legacyApi;
