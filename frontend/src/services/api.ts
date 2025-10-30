/**
 * Services API - Unified Export
 *
 * Central export point for all API services. This module re-exports
 * all API modules from the services/modules directory for convenient access.
 *
 * @module services/api
 * @author White Cross Healthcare Platform
 * @version 1.0.0
 *
 * @example
 * \`\`\`typescript
 * import { appointmentsApi, studentsApi, medicationsApi } from '@/services/api';
 * \`\`\`
 */

// Re-export all API modules - using wildcards except where conflicts occur
export * from './modules/appointmentsApi';
export * from './modules/studentsApi';
export * from './modules/medicationsApi';
export * from './modules/accessControlApi';
export * from './modules/analyticsApi';
export * from './modules/auditApi';
export * from './modules/authApi';
export * from './modules/broadcastsApi';
export * from './modules/budgetApi';
export * from './modules/communicationApi';
export * from './modules/complianceApi';
export * from './modules/dashboardApi';
export * from './modules/documentsApi';
export * from './modules/emergencyContactsApi';
export * from './modules/incidentsApi';
export * from './modules/integrationApi';
export * from './modules/inventoryApi';
export * from './modules/messagesApi';
export * from './modules/purchaseOrderApi';
export * from './modules/reportsApi';
export * from './modules/studentManagementApi';
export * from './modules/usersApi';
export * from './modules/vendorApi';

// Export main API services, but avoid duplicate type exports
export { 
  administrationApi,
  AdministrationApi,
  createAdministrationApi
} from './modules/administrationApi';

// Export health records API - primary source for health record types
export {
  healthRecordsApi,
  HealthRecordsApi,
  createHealthRecordsApi,
  type HealthRecord,
  type HealthRecordCreate,
  type HealthRecordUpdate,
  type Allergy,
  type AllergyCreate,
  type AllergyUpdate,
  type ChronicCondition,
  type ChronicConditionCreate,
  type ChronicConditionUpdate,
  type Vaccination,
  type VaccinationCreate,
  type VaccinationUpdate,
  type VitalSigns,
  type VitalSignsCreate,
  type VitalSignsUpdate,
  type Screening,
  type ScreeningCreate,
  type ScreeningUpdate,
  type GrowthMeasurement,
  type GrowthMeasurementCreate,
  type GrowthMeasurementUpdate,
  AllergyType,
  AllergySeverity,
  ConditionSeverity,
  ConditionStatus,
  type HealthRecordType,
  ScreeningType,
  ScreeningOutcome,
  VaccinationStatus
} from './modules/healthRecordsApi';

// Export health assessments API - avoiding conflicts with healthRecordsApi
export {
  healthAssessmentsApi,
  HealthAssessmentsApi,
  createHealthAssessmentsApi,
  type HealthRiskAssessment,
  type HighRiskStudent,
  type HealthScreening,
  type CreateScreeningRequest,
  // GrowthMeasurement already exported from healthRecordsApi
  type CreateGrowthMeasurementRequest,
  type GrowthAnalysis,
  type ImmunizationForecast,
  type EmergencyNotification,
  type CreateEmergencyNotificationRequest,
  type MedicationInteraction,
  type MedicationInteractionCheck,
  type CheckNewMedicationRequest,
  // ScreeningType already exported from healthRecordsApi
  type ScreeningResult,
  type EmergencyType,
  type EmergencySeverity
} from './modules/healthAssessmentsApi';

// Export billing API service
export {
  billingApi,
  BillingApi,
  createBillingApi,
  type BillingInvoice,
  type InvoiceLineItem,
  type PaymentRecord,
  type BillingAnalytics,
  type BillingSettings,
  type CreateInvoiceRequest,
  type UpdateInvoiceRequest,
  type CreatePaymentRequest,
  type ProcessRefundRequest,
  type InvoiceFilters,
  type PaymentFilters,
  type InvoiceStatus,
  type InvoicePriority,
  type PaymentMethod,
  type PaymentStatus,
  type PaymentType,
  type ServiceCategory
} from './modules/billingApi';

// Note: AdministrationService exports same classes as administrationApi, so we only export administrationApi to avoid ambiguity
