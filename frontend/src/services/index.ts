/**
 * WF-IDX-267 | index.ts - React component or utility module
 * Purpose: react component or utility module
 * Upstream: ./config/apiConfig, ./modules/authApi, ./modules/studentsApi | Dependencies: ./config/apiConfig, ./modules/authApi, ./modules/studentsApi
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: default export, constants, types, named exports | Key Features: Standard module
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

// Main API exports - provides both new modular API and backward compatibility

// ==========================================
// NEW PATTERN - ServiceManager Integration  
// ==========================================

/**
 * Service Registry (NEW - Recommended)
 * Provides centralized access to all API services with lazy instantiation.
 * @example
 * import { apiServiceRegistry } from '@/services';
 * const students = await apiServiceRegistry.studentsApi.getAll();
 */
export { apiServiceRegistry } from './core/apiServiceRegistry';
export { default as serviceRegistry } from './core/apiServiceRegistry';

/**
 * Service Initialization (NEW - Required)
 * Initialize and cleanup services via ServiceManager.
 * Call initializeServices() in main.tsx before React rendering.
 * @example
 * import { initializeServices } from '@/services';
 * await initializeServices();
 */
export {
  initializeServices,
  cleanupServices,
  reinitializeServices,
  isServicesInitialized,
  getInitializationStatus,
} from './core/initialize';

/**
 * ServiceManager (NEW - Best Practice)
 * Direct access to ServiceManager for advanced lifecycle management.
 * @example
 * import { ServiceManager } from '@/services';
 * const sm = ServiceManager.getInstance();
 * await sm.initialize();
 */
export { ServiceManager, getServiceManager, serviceManager } from './core/ServiceManager';
export type {
  ServiceInitializationOptions,
  ServiceHealth,
  ServiceManagerStatus,
  ServiceLifecycleHooks,
} from './core/ServiceManager';

// ==========================================
// BACKWARD COMPATIBILITY - Legacy Exports
// ==========================================

/**
 * Individual service exports (LEGACY - Maintained for backward compatibility)
 * @deprecated Use apiServiceRegistry or ServiceManager instead
 * These exports will be removed in a future version.
 */


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
export type { StudentsApi } from './modules/studentsApi';

export { healthRecordsApi } from './modules/healthRecordsApi';
export type { 
  HealthRecordFilters,
  VaccinationRecord,
  HealthSummary,
  HealthRecordsApi 
} from './modules/healthRecordsApi';

export { medicationsApi } from './modules/medicationsApi';
export type { 
  MedicationFilters,
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

export { integrationApi } from './modules/integrationApi';
export type {
  IntegrationApi,
  Integration,
  IntegrationType,
  IntegrationStatus,
  IntegrationLog,
  CreateIntegrationRequest,
  UpdateIntegrationRequest,
  ConnectionTestResult,
  SyncResult,
  IntegrationStatistics
} from './modules/integrationApi';

export { dashboardApi } from './modules/dashboardApi';
export type { DashboardApi } from './modules/dashboardApi';

export { administrationApi } from './modules/administrationApi';
export type { AdministrationApi } from './modules/administrationApi';

export { configurationApi } from './configurationApi';
export type { 
  SystemConfiguration,
  ConfigurationFilter,
  ConfigurationUpdate,
  CreateConfigurationPayload
} from './configurationApi';

// Analytics API exports
export { analyticsApi } from './modules/analyticsApi';
export type {
  HealthMetrics,
  HealthTrends,
  IncidentTrends,
  IncidentLocationData,
  MedicationUsage,
  MedicationAdherence,
  AppointmentTrends,
  NoShowRate,
  DashboardData,
  AnalyticsSummary,
  CustomReport,
  CustomReportRequest,
  AnalyticsApi
} from './modules/analyticsApi';

// Audit API exports
export { auditApi } from './modules/auditApi';
export type {
  AuditLog,
  PHIAccessLog,
  AuditStatistics,
  UserActivity,
  SecurityAnalysis,
  ComplianceReport,
  Anomaly,
  SessionAudit,
  DataAccessLog,
  AuditFilters,
  PHIAccessFilters,
  AuditApi
} from './modules/auditApi';

// Users API exports
export { usersApi } from './modules/usersApi';
export type {
  CreateUserRequest,
  UpdateUserRequest,
  ChangePasswordRequest,
  ResetPasswordRequest,
  UserStatistics,
  AvailableNurse,
  UserFilters,
  UsersApi
} from './modules/usersApi';

// Messages API exports
export { messagesApi } from './modules/messagesApi';
export type {
  Message,
  CreateMessageRequest,
  UpdateMessageRequest,
  MessageTemplate,
  CreateTemplateRequest,
  DeliveryStatus,
  MessageStatistics,
  MessageFilters,
  MessagesApi
} from './modules/messagesApi';

// Broadcasts API exports
export { broadcastsApi } from './modules/broadcastsApi';
export type {
  Broadcast,
  CreateBroadcastRequest,
  UpdateBroadcastRequest,
  BroadcastDelivery,
  BroadcastStatistics,
  BroadcastFilters,
  BroadcastsApi
} from './modules/broadcastsApi';

// Student Management API exports
export { studentManagementApi } from './modules/studentManagementApi';
export type {
  StudentPhoto,
  AcademicTranscript,
  GradeTransition,
  BarcodeData,
  WaitlistEntry,
  CreateWaitlistRequest,
  UpdateWaitlistRequest,
  StudentManagementApi
} from './modules/studentManagementApi';

// Health Assessments API exports
export { healthAssessmentsApi } from './modules/healthAssessmentsApi';
export type {
  HealthRiskAssessment,
  CreateRiskAssessmentRequest,
  HealthScreening,
  CreateScreeningRequest,
  GrowthTracking,
  CreateGrowthTrackingRequest,
  ImmunizationForecast,
  EmergencyNotification,
  CreateEmergencyNotificationRequest,
  HealthAssessmentsApi
} from './modules/healthAssessmentsApi';

// Medication module API exports
export { 
  medicationFormularyApi, 
  prescriptionApi, 
  administrationApi as medicationAdministrationApi,
  medicationApi 
} from './modules/medication/api';
export type {
  // Formulary types
  Medication,
  MedicationForm,
  AdministrationRoute,
  FormularyFilters,
  DrugInteraction,
  DrugMonograph,
  BarcodeResult,
  LASAMedication,
  // Prescription types
  Prescription,
  PrescriptionFrequency,
  Allergy,
  AllergyWarning,
  PrescriptionFilters,
  CreatePrescriptionRequest,
  UpdatePrescriptionRequest,
  VerificationResult,
  PrescriptionHistory,
  // Administration types
  AdministrationSession,
  FiveRightsData,
  FiveRightsVerificationResult,
  AdministrationRecord,
  AdministrationLog,
  WitnessSignature,
  AdministrationHistoryFilters,
  MedicationReminder
} from './modules/medication/api';

// Additional API exports for backward compatibility and enterprise features
export const inventoryApi = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    category?: string;
    supplier?: string;
    location?: string;
    lowStock?: boolean;
    needsMaintenance?: boolean;
    isActive?: boolean;
  }) => {
    const response = await apiInstance.get('/api/inventory', { params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await apiInstance.get(`/api/inventory/${id}`);
    return response.data;
  },

  create: async (item: any) => {
    const response = await apiInstance.post('/api/inventory', item);
    return response.data;
  },

  update: async (id: string, item: any) => {
    const response = await apiInstance.put(`/api/inventory/${id}`, item);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await apiInstance.delete(`/api/inventory/${id}`);
    return response.data;
  },

  getAlerts: async () => {
    const response = await apiInstance.get('/api/inventory/alerts');
    return response.data;
  },

  getStats: async () => {
    const response = await apiInstance.get('/api/inventory/stats');
    return response.data;
  },

  getCurrentStock: async (id: string) => {
    const response = await apiInstance.get(`/api/inventory/${id}/stock`);
    return response.data;
  },

  adjustStock: async (id: string, quantity: number, reason: string) => {
    const response = await apiInstance.post(`/api/inventory/${id}/adjust`, {
      quantity,
      reason
    });
    return response.data;
  },

  getStockHistory: async (id: string, page?: number, limit?: number) => {
    const response = await apiInstance.get(`/api/inventory/${id}/history`, {
      params: { page, limit }
    });
    return response.data;
  },

  createTransaction: async (transaction: {
    inventoryItemId: string;
    type: 'PURCHASE' | 'USAGE' | 'ADJUSTMENT' | 'TRANSFER' | 'DISPOSAL';
    quantity: number;
    unitCost?: number;
    reason?: string;
    batchNumber?: string;
    expirationDate?: string;
    notes?: string;
  }) => {
    const response = await apiInstance.post('/api/inventory/transactions', transaction);
    return response.data;
  },

  createMaintenanceLog: async (maintenance: {
    inventoryItemId: string;
    type: 'ROUTINE' | 'REPAIR' | 'CALIBRATION' | 'INSPECTION' | 'CLEANING';
    description: string;
    cost?: number;
    nextMaintenanceDate?: string;
    vendor?: string;
    notes?: string;
  }) => {
    const response = await apiInstance.post('/api/inventory/maintenance', maintenance);
    return response.data;
  },

  getMaintenanceSchedule: async (startDate?: string, endDate?: string) => {
    const response = await apiInstance.get('/api/inventory/maintenance/schedule', {
      params: { startDate, endDate }
    });
    return response.data;
  },

  generatePurchaseOrder: async (items: Array<{ inventoryItemId: string; quantity: number }>) => {
    const response = await apiInstance.post('/api/inventory/purchase-order', { items });
    return response.data;
  },

  getValuation: async () => {
    const response = await apiInstance.get('/api/inventory/valuation');
    return response.data;
  },

  getUsageAnalytics: async (startDate?: string, endDate?: string) => {
    const response = await apiInstance.get('/api/inventory/analytics/usage', {
      params: { startDate, endDate }
    });
    return response.data;
  },

  getSupplierPerformance: async () => {
    const response = await apiInstance.get('/api/inventory/analytics/suppliers');
    return response.data;
  },

  search: async (query: string, limit?: number) => {
    const response = await apiInstance.get(`/api/inventory/search/${query}`, {
      params: { limit }
    });
    return response.data;
  }
};

export const vendorApi = {
  getAll: async () => ({ success: true, data: [] }),
  create: async (vendor: any) => ({
    success: true,
    data: {
      ...vendor,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  }),
  update: async (id: string, vendor: any) => ({
    success: true,
    data: {
      id,
      name: vendor.name || '',
      isActive: vendor.isActive ?? true,
      createdAt: vendor.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...vendor
    }
  })
};

export const purchaseOrderApi = {
  getAll: async () => ({ success: true, data: [] }),
  create: async (order: any) => ({
    success: true,
    data: {
      ...order,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  }),
  update: async (id: string, order: any) => ({
    success: true,
    data: {
      id,
      orderNumber: order.orderNumber || '',
      status: order.status || 'PENDING',
      orderDate: order.orderDate || new Date().toISOString(),
      subtotal: order.subtotal || 0,
      tax: order.tax || 0,
      shipping: order.shipping || 0,
      total: order.total || 0,
      vendor: order.vendor || {
        id: '',
        name: '',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      items: order.items || [],
      createdAt: order.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...order
    }
  })
};

export const budgetApi = {
  getBudget: async () => ({
    success: true,
    data: {
      total: 0,
      spent: 0,
      remaining: 0,
      utilizationPercentage: 0,
      categories: []
    }
  }),
  updateBudget: async (budget: any) => ({
    success: true,
    data: {
      total: budget.categories.reduce((sum: number, cat: any) => sum + cat.allocatedAmount, 0),
      spent: 0,
      remaining: budget.categories.reduce((sum: number, cat: any) => sum + cat.allocatedAmount, 0),
      utilizationPercentage: 0,
      categories: budget.categories.map((cat: any) => ({
        id: cat.id || crypto.randomUUID(),
        name: cat.name,
        fiscalYear: budget.fiscalYear,
        allocatedAmount: cat.allocatedAmount,
        spentAmount: 0,
        remainingAmount: cat.allocatedAmount,
        utilizationPercentage: 0,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }))
    }
  })
};

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
      healthRecordsApi.getRecords(studentId, params),
    createHealthRecord: healthRecordsApi.createRecord.bind(healthRecordsApi),
    updateHealthRecord: healthRecordsApi.updateRecord.bind(healthRecordsApi),
    getStudentAllergies: healthRecordsApi.getAllergies.bind(healthRecordsApi),
    addAllergy: healthRecordsApi.createAllergy.bind(healthRecordsApi),
    updateAllergy: healthRecordsApi.updateAllergy.bind(healthRecordsApi),
    deleteAllergy: healthRecordsApi.deleteAllergy.bind(healthRecordsApi),
    getStudentChronicConditions: healthRecordsApi.getConditions.bind(healthRecordsApi),
    addChronicCondition: healthRecordsApi.createCondition.bind(healthRecordsApi),
    updateChronicCondition: healthRecordsApi.updateCondition.bind(healthRecordsApi),
    deleteChronicCondition: healthRecordsApi.deleteCondition.bind(healthRecordsApi),
    getVaccinationRecords: healthRecordsApi.getVaccinations.bind(healthRecordsApi),
    getGrowthChartData: healthRecordsApi.getGrowthMeasurements.bind(healthRecordsApi),
    getRecentVitals: (studentId: string, limit?: number) =>
      healthRecordsApi.getVitalSigns(studentId, { limit }),
    getHealthSummary: healthRecordsApi.getSummary.bind(healthRecordsApi),
    searchHealthRecords: healthRecordsApi.searchRecords.bind(healthRecordsApi),
    exportHealthHistory: healthRecordsApi.exportRecords.bind(healthRecordsApi),
    importHealthRecords: healthRecordsApi.importRecords.bind(healthRecordsApi),
  },

  // Medications API - matches old medicationsApi structure
  medicationsApi: {
    getAll: (page = 1, limit = 20, search?: string) =>
      medicationsApi.getAll({ page, limit, search }),
    create: medicationsApi.create.bind(medicationsApi),
    assignToStudent: medicationsApi.assignToStudent.bind(medicationsApi),
    logAdministration: medicationsApi.logAdministration.bind(medicationsApi),
    getStudentLogs: (studentId: string, page = 1, limit = 20) =>
      medicationsApi.getStudentLogs(studentId, page, limit),
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
