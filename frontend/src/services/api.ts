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
 * ```typescript
 * import { appointmentsApi, studentsApi, medicationsApi } from '@/services/api';
 * ```
 */

// Re-export all API modules
export * from './modules/appointmentsApi';
export * from './modules/studentsApi';
export * from './modules/medicationsApi';
export * from './modules/healthRecordsApi';
export * from './modules/accessControlApi';
export * from './modules/administrationApi';
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
export * from './modules/healthAssessmentsApi';
export * from './modules/incidentReportsApi';
export * from './modules/integrationApi';
export * from './modules/inventoryApi';
export * from './modules/messagesApi';
export * from './modules/purchaseOrderApi';
export * from './modules/reportsApi';
export * from './modules/studentManagementApi';
export * from './modules/usersApi';
export * from './modules/vendorApi';

// Re-export services
export * from './modules/AdministrationService';
