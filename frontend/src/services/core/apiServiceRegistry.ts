/**
 * @fileoverview API Service Registry for Backward Compatibility
 * @module services/core/apiServiceRegistry
 * @category Services
 *
 * Simple service registry that provides lazy instantiation of all API services
 * for backward compatibility during migration from singletons to ServiceManager.
 *
 * This is a TEMPORARY compatibility layer that will be deprecated once all code
 * migrates to use ServiceManager directly.
 *
 * Features:
 * - Lazy instantiation (services created on first access)
 * - Singleton instances per registry
 * - Backward compatible with existing imports
 * - Type-safe service access
 *
 * Usage Pattern:
 * ```typescript
 * // Old pattern (still works via barrel exports)
 * import { authApi, studentsApi } from '@/services';
 *
 * // New pattern (recommended)
 * import { apiServiceRegistry } from '@/services/core/apiServiceRegistry';
 * const authApi = apiServiceRegistry.authApi;
 *
 * // Best practice (use ServiceManager)
 * const serviceManager = ServiceManager.getInstance();
 * await serviceManager.initialize();
 * const apiClient = serviceManager.get('apiClient');
 * ```
 *
 * @example
 * ```typescript
 * // Access services from registry
 * const services = apiServiceRegistry;
 * await services.authApi.login({ email, password });
 * const students = await services.studentsApi.getAll({ page: 1 });
 * ```
 */

// Import singleton instances from API modules
// These are the existing exports that we're providing backward compatibility for
import { appointmentsApi } from '../modules/appointmentsApi';
import { accessControlApi } from '../modules/accessControlApi';
import { administrationApi } from '../modules/administrationApi';
import { analyticsApi } from '../modules/analyticsApi';
import { auditApi } from '../modules/auditApi';
import { authApi } from '../modules/authApi';
import { broadcastsApi } from '../modules/broadcastsApi';
import { communicationApi } from '../modules/communicationApi';
import { complianceApi } from '../modules/complianceApi';
import { dashboardApi } from '../modules/dashboardApi';
import { documentsApi } from '../modules/documentsApi';
import { emergencyContactsApi } from '../modules/emergencyContactsApi';
import { healthAssessmentsApi } from '../modules/healthAssessmentsApi';
import { healthRecordsApi } from '../modules/healthRecordsApi';
import { incidentsApi } from '../modules/incidentsApi';
import { integrationApi } from '../modules/integrationApi';
import { messagesApi } from '../modules/messagesApi';
import { reportsApi } from '../modules/reportsApi';
import { studentManagementApi } from '../modules/studentManagementApi';
import { studentsApi } from '../modules/studentsApi';
import { usersApi } from '../modules/usersApi';

// Import medication module APIs
import {
  medicationFormularyApi,
  prescriptionApi,
  administrationApi as medicationAdministrationApi,
  medicationApi,
} from '../modules/medication/api';

// Import legacy APIs
import { medicationsApi } from '../modules/medicationsApi';

// Import types for type safety
import type { IAppointmentsApi } from '../modules/appointmentsApi';
import type { IAccessControlApi } from '../modules/accessControlApi';
import type { AdministrationApi as IAdministrationApi } from '../modules/administrationApi';
import type { AnalyticsApi } from '../modules/analyticsApi';
import type { AuditApi } from '../modules/auditApi';
import type { AuthApi } from '../modules/authApi';
import type { BroadcastsApi } from '../modules/broadcastsApi';
import type { ICommunicationApi } from '../modules/communicationApi';
import type { IComplianceApi } from '../modules/complianceApi';
import type { DashboardApi } from '../modules/dashboardApi';
import type { DocumentsApi } from '../modules/documentsApi';
import type { IEmergencyContactsApi } from '../modules/emergencyContactsApi';
import type { HealthAssessmentsApi } from '../modules/healthAssessmentsApi';
import type { HealthRecordsApi } from '../modules/healthRecordsApi';
import type { IIncidentsApi } from '../modules/incidentsApi';
import type { IntegrationApi } from '../modules/integrationApi';
import type { MessagesApi } from '../modules/messagesApi';
import type { ReportsApi } from '../modules/reportsApi';
import type { StudentManagementApi } from '../modules/studentManagementApi';
import type { StudentsApi } from '../modules/studentsApi';
import type { UsersApi } from '../modules/usersApi';
import type { MedicationsApi } from '../modules/medicationsApi';

/**
 * API Service Registry
 *
 * Provides centralized access to all API services with lazy instantiation.
 * This is a compatibility layer during migration to ServiceManager.
 *
 * @class
 * @classdesc Simple registry that exposes all API services as properties
 */
class ApiServiceRegistry {
  /**
   * Appointments API
   * Manages appointment scheduling, cancellation, and retrieval
   */
  get appointmentsApi(): IAppointmentsApi {
    return appointmentsApi;
  }

  /**
   * Access Control API
   * Manages role-based access control and permissions
   */
  get accessControlApi(): IAccessControlApi {
    return accessControlApi;
  }

  /**
   * Administration API
   * System administration and configuration management
   */
  get administrationApi(): IAdministrationApi {
    return administrationApi;
  }

  /**
   * Analytics API
   * Health metrics, trends, and reporting
   */
  get analyticsApi(): AnalyticsApi {
    return analyticsApi;
  }

  /**
   * Audit API
   * Audit logs, PHI access tracking, and compliance reporting
   */
  get auditApi(): AuditApi {
    return auditApi;
  }

  /**
   * Auth API
   * Authentication and authorization
   */
  get authApi(): AuthApi {
    return authApi;
  }

  /**
   * Broadcasts API
   * Mass communication and broadcast messaging
   */
  get broadcastsApi(): BroadcastsApi {
    return broadcastsApi;
  }

  /**
   * Communication API
   * Direct messaging and communication management
   */
  get communicationApi(): ICommunicationApi {
    return communicationApi;
  }

  /**
   * Compliance API
   * Regulatory compliance and audit trails
   */
  get complianceApi(): IComplianceApi {
    return complianceApi;
  }

  /**
   * Dashboard API
   * Dashboard data and statistics
   */
  get dashboardApi(): DashboardApi {
    return dashboardApi;
  }

  /**
   * Documents API
   * Document upload, storage, and retrieval
   */
  get documentsApi(): DocumentsApi {
    return documentsApi;
  }

  /**
   * Emergency Contacts API
   * Emergency contact management
   */
  get emergencyContactsApi(): IEmergencyContactsApi {
    return emergencyContactsApi;
  }

  /**
   * Health Assessments API
   * Health risk assessments and screenings
   */
  get healthAssessmentsApi(): HealthAssessmentsApi {
    return healthAssessmentsApi;
  }

  /**
   * Health Records API
   * Student health records, allergies, conditions, vaccinations
   */
  get healthRecordsApi(): HealthRecordsApi {
    return healthRecordsApi;
  }

  /**
   * Incidents API
   * Incident reporting and tracking
   */
  get incidentsApi(): IIncidentsApi {
    return incidentsApi;
  }

  /**
   * Integration API
   * Third-party system integrations
   */
  get integrationApi(): IntegrationApi {
    return integrationApi;
  }

  /**
   * Messages API
   * Message management and delivery
   */
  get messagesApi(): MessagesApi {
    return messagesApi;
  }

  /**
   * Reports API
   * Report generation and export
   */
  get reportsApi(): ReportsApi {
    return reportsApi;
  }

  /**
   * Student Management API
   * Student photos, transcripts, waitlists, barcodes
   */
  get studentManagementApi(): StudentManagementApi {
    return studentManagementApi;
  }

  /**
   * Students API
   * Core student data management
   */
  get studentsApi(): StudentsApi {
    return studentsApi;
  }

  /**
   * Users API
   * User management, authentication, and authorization
   */
  get usersApi(): UsersApi {
    return usersApi;
  }

  /**
   * Medication Formulary API
   * Drug database, NDC lookup, interaction checking
   */
  get medicationFormularyApi() {
    return medicationFormularyApi;
  }

  /**
   * Prescription API
   * Prescription management, verification, and history
   */
  get prescriptionApi() {
    return prescriptionApi;
  }

  /**
   * Medication Administration API
   * Five Rights verification, administration logging, witness signatures
   */
  get medicationAdministrationApi() {
    return medicationAdministrationApi;
  }

  /**
   * Consolidated Medication API
   * Aggregates all medication sub-APIs
   */
  get medicationApi() {
    return medicationApi;
  }

  /**
   * Legacy Medications API
   *
   * @deprecated Use medicationApi instead
   */
  get medicationsApi(): MedicationsApi {
    return medicationsApi;
  }
}

/**
 * Singleton API service registry instance
 *
 * @example
 * ```typescript
 * import { apiServiceRegistry } from '@/services/core/apiServiceRegistry';
 *
 * const students = await apiServiceRegistry.studentsApi.getAll();
 * await apiServiceRegistry.authApi.login({ email, password });
 * ```
 */
export const apiServiceRegistry = new ApiServiceRegistry();

/**
 * Default export for convenience
 */
export default apiServiceRegistry;
