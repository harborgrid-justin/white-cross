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

// Re-export all API modules - using explicit exports to avoid conflicts

// Appointments API
export * from './modules/appointmentsApi';

// Students API
export * from './modules/studentsApi';

// Medications API
export * from './modules/medicationsApi';

// Access Control API
export * from './modules/accessControlApi';

// Analytics API - Export only unique types to avoid conflicts
export {
  analyticsApi,
  AnalyticsApi,
  createAnalyticsApi,
  healthAnalytics,
  incidentAnalytics,
  medicationAnalytics,
  appointmentAnalytics,
  dashboardAnalytics,
  reportsAnalytics,
  advancedAnalytics,
  analyticsCache,
  CacheKeys,
  CacheTTL
} from './modules/analyticsApi';

// Audit API - Primary source for audit types
export {
  auditApi,
  AuditApi,
  createAuditApi,
  type AuditLog,
  type PHIAccessLog,
  type AuditStatistics,
  type UserActivity,
  type SecurityAnalysis,
  type ComplianceReport,
  type Anomaly,
  type SessionAudit,
  type DataAccessLog,
  type AuditFilters,
  type PHIAccessFilters
} from './modules/auditApi';

// Auth API
export * from './modules/authApi';

// Broadcasts API - Primary source for broadcast types
export {
  broadcastsApi,
  BroadcastsApi,
  createBroadcastsApi,
  type Broadcast,
  type CreateBroadcastRequest,
  type UpdateBroadcastRequest,
  type BroadcastDelivery,
  type BroadcastStatistics,
  type BroadcastFilters
} from './modules/broadcastsApi';

// Budget API
export * from './modules/budgetApi';

// Communication API
export * from './modules/communicationApi';

// Compliance API
export * from './modules/complianceApi';

// Contacts API
export * from './modules/contactsApi';

// Dashboard API
export * from './modules/dashboardApi';

// Documents API
export * from './modules/documentsApi';

// Emergency Contacts API
export * from './modules/emergencyContactsApi';

// Incidents API
export * from './modules/incidentsApi';

// Integration API - Primary source for integration types
export {
  integrationApi,
  IntegrationApi,
  createIntegrationApi,
  type Integration,
  type IntegrationType,
  type IntegrationStatus,
  type IntegrationLog,
  type CreateIntegrationRequest,
  type UpdateIntegrationRequest,
  type ConnectionTestResult,
  type SyncResult,
  type SyncStatus,
  type IntegrationStatistics,
  type IntegrationSettings,
  type LogFilters
} from './modules/integrationApi';

// Inventory API
export * from './modules/inventoryApi';

// Messages API - Primary source for message types
export {
  messagesApi,
  MessagesApi,
  createMessagesApi,
  type Message,
  type CreateMessageRequest,
  type UpdateMessageRequest,
  type MessageTemplate,
  type CreateTemplateRequest,
  type DeliveryStatus,
  type MessageStatistics,
  type MessageFilters,
  type MessagePriority,
  type RecipientType
} from './modules/messagesApi';

// MFA API
export * from './modules/mfaApi';

// Purchase Order API
export * from './modules/purchaseOrderApi';

// Reports API
export * from './modules/reportsApi';

// Student Management API
export * from './modules/studentManagementApi';

// System API
export * from './modules/systemApi';

// Users API
export * from './modules/usersApi';

// Vendor API
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
} from './modules/healthAssessments';

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

// Export refactored communications API - consolidated from communicationApi, messagesApi, broadcastsApi
// This is the new refactored version with sub-modules for better organization
export * from './modules/communicationsApi';

// Note: AdministrationService exports same classes as administrationApi, so we only export administrationApi to avoid ambiguity
// Note: communicationApi (singular) is deprecated - use communicationsApi (plural) for refactored version
