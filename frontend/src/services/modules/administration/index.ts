/**
 * @fileoverview Administration API - Main Entry Point
 * @module services/modules/administration
 * @category Services - Administration
 *
 * Unified administration API that aggregates all administration service modules:
 * - User Management - User CRUD operations with RBAC
 * - Organization Management - District and school hierarchy management
 * - License Management - Software licensing and entitlements
 * - Training Management - Educational content and progress tracking
 * - Configuration Management - System settings and configurations
 * - Monitoring Service - System health, backups, metrics, and audit logs
 *
 * This module provides both:
 * 1. Individual service exports for direct access to specific functionality
 * 2. Unified AdministrationApi class that composes all services (backward compatible)
 *
 * @example Using unified API
 * ```typescript
 * import { AdministrationApi } from '@/services/modules/administration';
 * import { apiClient } from '@/services/core/ApiClient';
 *
 * const adminApi = new AdministrationApi(apiClient);
 * const users = await adminApi.getUsers();
 * const districts = await adminApi.getDistricts();
 * ```
 *
 * @example Using individual services
 * ```typescript
 * import { UserManagementService, OrganizationManagementService } from '@/services/modules/administration';
 * import { apiClient } from '@/services/core/ApiClient';
 *
 * const userService = new UserManagementService(apiClient);
 * const orgService = new OrganizationManagementService(apiClient);
 * ```
 */

import type { ApiClient } from '../../core/ApiClient';
import { PaginatedResponse } from '../../utils/apiUtils';

// Import all service modules
import {
  UserManagementService,
  createUserManagementService,
  createUserSchema,
  updateUserSchema,
  type GetUsersFilters,
} from './UserManagement';

import {
  OrganizationManagementService,
  createOrganizationManagementService,
  createDistrictSchema,
  updateDistrictSchema,
  createSchoolSchema,
  updateSchoolSchema,
} from './OrganizationManagement';

import {
  LicenseManagementService,
  createLicenseManagementService,
  createLicenseSchema,
  updateLicenseSchema,
} from './LicenseManagement';

import {
  TrainingManagementService,
  createTrainingManagementService,
  createTrainingModuleSchema,
  updateTrainingModuleSchema,
} from './TrainingManagement';

import {
  ConfigurationManagementService,
  createConfigurationManagementService,
  configurationSchema,
  type SystemSettingsUpdateData,
} from './ConfigurationManagement';

import {
  MonitoringService,
  createMonitoringService,
  type AuditLogFilters,
} from './MonitoringService';

// Import domain types
import type {
  User,
  District,
  School,
  License,
  TrainingModule,
  TrainingCompletion,
  UserTrainingProgress,
  SystemConfiguration,
  SystemSettings,
  SystemSettingItem,
  SystemHealth,
  BackupLog,
  PerformanceMetric,
  AuditLog,
  CreateUserData,
  UpdateUserData,
  CreateDistrictData,
  UpdateDistrictData,
  CreateSchoolData,
  UpdateSchoolData,
  CreateLicenseData,
  UpdateLicenseData,
  CreateTrainingModuleData,
  UpdateTrainingModuleData,
  RecordTrainingCompletionData,
  ConfigurationData,
  RecordMetricData,
  MetricFilters,
  ConfigCategory,
  TrainingCategory,
} from '../../../types/domain/administration';

// ==================== EXPORTS ====================

// Export all validation schemas
export {
  createUserSchema,
  updateUserSchema,
  createDistrictSchema,
  updateDistrictSchema,
  createSchoolSchema,
  updateSchoolSchema,
  createLicenseSchema,
  updateLicenseSchema,
  createTrainingModuleSchema,
  updateTrainingModuleSchema,
  configurationSchema,
};

// Export all service classes
export {
  UserManagementService,
  OrganizationManagementService,
  LicenseManagementService,
  TrainingManagementService,
  ConfigurationManagementService,
  MonitoringService,
};

// Export all factory functions
export {
  createUserManagementService,
  createOrganizationManagementService,
  createLicenseManagementService,
  createTrainingManagementService,
  createConfigurationManagementService,
  createMonitoringService,
};

// Export type aliases
export type {
  GetUsersFilters,
  SystemSettingsUpdateData,
  AuditLogFilters,
};

// ==================== UNIFIED ADMINISTRATION API ====================

/**
 * Unified Administration API class that composes all administration service modules.
 * Provides backward compatibility with the original AdministrationService interface
 * while delegating to specialized service modules.
 *
 * @example
 * ```typescript
 * const adminApi = new AdministrationApi(apiClient);
 *
 * // User management
 * const users = await adminApi.getUsers({ role: 'ADMIN' });
 *
 * // Organization management
 * const districts = await adminApi.getDistricts();
 *
 * // License management
 * const licenses = await adminApi.getLicenses();
 *
 * // Training management
 * const modules = await adminApi.getTrainingModules();
 *
 * // Configuration management
 * const settings = await adminApi.getSettings();
 *
 * // Monitoring
 * const health = await adminApi.getSystemHealth();
 * ```
 */
export class AdministrationApi {
  private readonly userService: UserManagementService;
  private readonly orgService: OrganizationManagementService;
  private readonly licenseService: LicenseManagementService;
  private readonly trainingService: TrainingManagementService;
  private readonly configService: ConfigurationManagementService;
  private readonly monitoringService: MonitoringService;

  constructor(client: ApiClient) {
    this.userService = createUserManagementService(client);
    this.orgService = createOrganizationManagementService(client);
    this.licenseService = createLicenseManagementService(client);
    this.trainingService = createTrainingManagementService(client);
    this.configService = createConfigurationManagementService(client);
    this.monitoringService = createMonitoringService(client);
  }

  // ==================== USER MANAGEMENT DELEGATION ====================

  async getUsers(filters: GetUsersFilters = {}): Promise<PaginatedResponse<User>> {
    return this.userService.getUsers(filters);
  }

  async createUser(userData: CreateUserData): Promise<User> {
    return this.userService.createUser(userData);
  }

  async updateUser(id: string, userData: UpdateUserData): Promise<User> {
    return this.userService.updateUser(id, userData);
  }

  async deleteUser(id: string): Promise<{ message: string }> {
    return this.userService.deleteUser(id);
  }

  // ==================== ORGANIZATION MANAGEMENT DELEGATION ====================

  async getDistricts(page?: number, limit?: number): Promise<PaginatedResponse<District>> {
    return this.orgService.getDistricts(page, limit);
  }

  async getDistrictById(id: string): Promise<District> {
    return this.orgService.getDistrictById(id);
  }

  async createDistrict(districtData: CreateDistrictData): Promise<District> {
    return this.orgService.createDistrict(districtData);
  }

  async updateDistrict(id: string, districtData: UpdateDistrictData): Promise<District> {
    return this.orgService.updateDistrict(id, districtData);
  }

  async deleteDistrict(id: string): Promise<{ message: string }> {
    return this.orgService.deleteDistrict(id);
  }

  async getSchools(page?: number, limit?: number, districtId?: string): Promise<PaginatedResponse<School>> {
    return this.orgService.getSchools(page, limit, districtId);
  }

  async getSchoolById(id: string): Promise<School> {
    return this.orgService.getSchoolById(id);
  }

  async createSchool(schoolData: CreateSchoolData): Promise<School> {
    return this.orgService.createSchool(schoolData);
  }

  async updateSchool(id: string, schoolData: UpdateSchoolData): Promise<School> {
    return this.orgService.updateSchool(id, schoolData);
  }

  async deleteSchool(id: string): Promise<{ message: string }> {
    return this.orgService.deleteSchool(id);
  }

  // ==================== LICENSE MANAGEMENT DELEGATION ====================

  async getLicenses(page?: number, limit?: number): Promise<PaginatedResponse<License>> {
    return this.licenseService.getLicenses(page, limit);
  }

  async getLicenseById(id: string): Promise<License> {
    return this.licenseService.getLicenseById(id);
  }

  async createLicense(licenseData: CreateLicenseData): Promise<License> {
    return this.licenseService.createLicense(licenseData);
  }

  async updateLicense(id: string, data: UpdateLicenseData): Promise<License> {
    return this.licenseService.updateLicense(id, data);
  }

  async deactivateLicense(id: string): Promise<License> {
    return this.licenseService.deactivateLicense(id);
  }

  // ==================== TRAINING MANAGEMENT DELEGATION ====================

  async getTrainingModules(category?: TrainingCategory): Promise<TrainingModule[]> {
    return this.trainingService.getTrainingModules(category);
  }

  async getTrainingModuleById(id: string): Promise<TrainingModule> {
    return this.trainingService.getTrainingModuleById(id);
  }

  async createTrainingModule(moduleData: CreateTrainingModuleData): Promise<TrainingModule> {
    return this.trainingService.createTrainingModule(moduleData);
  }

  async updateTrainingModule(id: string, moduleData: UpdateTrainingModuleData): Promise<TrainingModule> {
    return this.trainingService.updateTrainingModule(id, moduleData);
  }

  async deleteTrainingModule(id: string): Promise<{ message: string }> {
    return this.trainingService.deleteTrainingModule(id);
  }

  async recordTrainingCompletion(
    moduleId: string,
    completionData?: RecordTrainingCompletionData
  ): Promise<TrainingCompletion> {
    return this.trainingService.recordTrainingCompletion(moduleId, completionData);
  }

  async getUserTrainingProgress(userId: string): Promise<UserTrainingProgress> {
    return this.trainingService.getUserTrainingProgress(userId);
  }

  // ==================== CONFIGURATION MANAGEMENT DELEGATION ====================

  async getSettings(): Promise<SystemSettings> {
    return this.configService.getSettings();
  }

  async updateSettings(settings: SystemSettingItem[]): Promise<SystemSettingItem[]> {
    return this.configService.updateSettings(settings);
  }

  async getConfigurations(category?: ConfigCategory): Promise<SystemConfiguration[]> {
    return this.configService.getConfigurations(category);
  }

  async getConfigurationByKey(key: string): Promise<SystemConfiguration> {
    return this.configService.getConfigurationByKey(key);
  }

  async setConfiguration(configData: ConfigurationData, changedBy?: string): Promise<SystemConfiguration> {
    return this.configService.setConfiguration(configData, changedBy);
  }

  async deleteConfiguration(key: string): Promise<{ message: string }> {
    return this.configService.deleteConfiguration(key);
  }

  // ==================== MONITORING SERVICE DELEGATION ====================

  async getSystemHealth(): Promise<SystemHealth> {
    return this.monitoringService.getSystemHealth();
  }

  async getBackupLogs(page?: number, limit?: number): Promise<PaginatedResponse<BackupLog>> {
    return this.monitoringService.getBackupLogs(page, limit);
  }

  async createBackup(): Promise<BackupLog> {
    return this.monitoringService.createBackup();
  }

  async getMetrics(filters?: MetricFilters): Promise<PerformanceMetric[]> {
    return this.monitoringService.getMetrics(filters);
  }

  async recordMetric(metricData: RecordMetricData): Promise<PerformanceMetric> {
    return this.monitoringService.recordMetric(metricData);
  }

  async getAuditLogs(filters?: AuditLogFilters): Promise<PaginatedResponse<AuditLog>> {
    return this.monitoringService.getAuditLogs(filters);
  }
}

/**
 * Factory function to create an AdministrationApi instance
 * @param client - ApiClient instance
 * @returns AdministrationApi instance with all administration services
 */
export function createAdministrationApi(client: ApiClient): AdministrationApi {
  return new AdministrationApi(client);
}
