/**
 * @fileoverview Main AdministrationApi service class for system administration
 * 
 * This module provides a unified interface for all administration operations by combining
 * core operations and specialized operations into a single, cohesive API service.
 * 
 * This class serves as the main entry point for system administration functionality,
 * maintaining backward compatibility while providing a clean, modular architecture.
 * 
 * @module services/modules/administrationApi/administrationApi
 */

import type { ApiClient } from '../../core/ApiClient';
import { AdministrationCoreOperations } from './core-operations';
import { AdministrationSpecializedOperations } from './specialized-operations';

// Import types for comprehensive interface
import type {
  User,
  District,
  School,
  SystemSettings,
  SystemSettingItem,
  SystemHealth,
  BackupLog,
  License,
  SystemConfiguration,
  PerformanceMetric,
  TrainingModule,
  TrainingCompletion,
  UserTrainingProgress,
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
  RecordMetricData,
  ConfigurationData,
  ConfigCategory,
  TrainingCategory,
  MetricFilters,
  UserQueryFilters,
  AuditLogQueryFilters,
  AdministrationApiOperations,
} from './types';

import type { PaginatedResponse } from '../../utils/apiUtils';

/**
 * Main AdministrationApi service class providing comprehensive system administration capabilities
 * 
 * This class combines core and specialized operations to provide a unified interface
 * for all system administration tasks including configuration management, user management,
 * district/school operations, license management, training modules, and audit logging.
 * 
 * ## Core Features:
 * - User management with RBAC enforcement
 * - District and school hierarchy management  
 * - System settings and configuration
 * - Health monitoring and diagnostics
 * 
 * ## Advanced Features:
 * - Backup management and scheduling
 * - License tier management and enforcement
 * - Performance metrics collection
 * - Training module management
 * - Comprehensive audit logging
 * 
 * @example Basic usage
 * ```typescript
 * import { AdministrationApi } from './administrationApi';
 * 
 * const adminApi = new AdministrationApi(apiClient);
 * 
 * // User management
 * const users = await adminApi.getUsers({ role: 'NURSE', isActive: true });
 * 
 * // District management
 * const district = await adminApi.createDistrict({
 *   name: 'Springfield School District',
 *   code: 'SSD-001'
 * });
 * 
 * // System configuration
 * await adminApi.setConfiguration({
 *   key: 'session.timeout',
 *   value: '3600',
 *   category: 'SESSION'
 * });
 * ```
 */
export class AdministrationApi implements AdministrationApiOperations {
  private readonly coreOperations: AdministrationCoreOperations;
  private readonly specializedOperations: AdministrationSpecializedOperations;

  constructor(private readonly client: ApiClient) {
    this.coreOperations = new AdministrationCoreOperations(client);
    this.specializedOperations = new AdministrationSpecializedOperations(client);
  }

  // ==================== System Settings (Core) ====================

  /**
   * Get system settings grouped by category
   */
  async getSettings(): Promise<SystemSettings> {
    return this.coreOperations.getSettings();
  }

  /**
   * Update system settings
   */
  async updateSettings(settings: SystemSettingItem[]): Promise<SystemSettingItem[]> {
    return this.coreOperations.updateSettings(settings);
  }

  // ==================== User Management (Core) ====================

  /**
   * Get users with filtering and pagination
   */
  async getUsers(filters?: UserQueryFilters): Promise<PaginatedResponse<User>> {
    return this.coreOperations.getUsers(filters);
  }

  /**
   * Create new user
   */
  async createUser(userData: CreateUserData): Promise<User> {
    return this.coreOperations.createUser(userData);
  }

  /**
   * Update user
   */
  async updateUser(id: string, userData: UpdateUserData): Promise<User> {
    return this.coreOperations.updateUser(id, userData);
  }

  /**
   * Delete (deactivate) user
   */
  async deleteUser(id: string): Promise<{ message: string }> {
    return this.coreOperations.deleteUser(id);
  }

  // ==================== District Management (Core) ====================

  /**
   * Get all districts with pagination
   */
  async getDistricts(page?: number, limit?: number): Promise<PaginatedResponse<District>> {
    return this.coreOperations.getDistricts(page, limit);
  }

  /**
   * Get district by ID
   */
  async getDistrictById(id: string): Promise<District> {
    return this.coreOperations.getDistrictById(id);
  }

  /**
   * Create district
   */
  async createDistrict(districtData: CreateDistrictData): Promise<District> {
    return this.coreOperations.createDistrict(districtData);
  }

  /**
   * Update district
   */
  async updateDistrict(id: string, districtData: Partial<District>): Promise<District> {
    return this.coreOperations.updateDistrict(id, districtData);
  }

  /**
   * Delete district
   */
  async deleteDistrict(id: string): Promise<{ message: string }> {
    return this.coreOperations.deleteDistrict(id);
  }

  // ==================== School Management (Core) ====================

  /**
   * Get all schools with pagination
   */
  async getSchools(page?: number, limit?: number, districtId?: string): Promise<PaginatedResponse<School>> {
    return this.coreOperations.getSchools(page, limit, districtId);
  }

  /**
   * Get school by ID
   */
  async getSchoolById(id: string): Promise<School> {
    return this.coreOperations.getSchoolById(id);
  }

  /**
   * Create school
   */
  async createSchool(schoolData: CreateSchoolData): Promise<School> {
    return this.coreOperations.createSchool(schoolData);
  }

  /**
   * Update school
   */
  async updateSchool(id: string, schoolData: Partial<School>): Promise<School> {
    return this.coreOperations.updateSchool(id, schoolData);
  }

  /**
   * Delete school
   */
  async deleteSchool(id: string): Promise<{ message: string }> {
    return this.coreOperations.deleteSchool(id);
  }

  // ==================== System Health (Core) ====================

  /**
   * Get system health metrics
   */
  async getSystemHealth(): Promise<SystemHealth> {
    return this.coreOperations.getSystemHealth();
  }

  // ==================== Backup Management (Specialized) ====================

  /**
   * Get backup logs with pagination
   */
  async getBackupLogs(page?: number, limit?: number): Promise<PaginatedResponse<BackupLog>> {
    return this.specializedOperations.getBackupLogs(page, limit);
  }

  /**
   * Create manual backup
   */
  async createBackup(): Promise<BackupLog> {
    return this.specializedOperations.createBackup();
  }

  // ==================== License Management (Specialized) ====================

  /**
   * Get licenses with pagination
   */
  async getLicenses(page?: number, limit?: number): Promise<PaginatedResponse<License>> {
    return this.specializedOperations.getLicenses(page, limit);
  }

  /**
   * Get license by ID
   */
  async getLicenseById(id: string): Promise<License> {
    return this.specializedOperations.getLicenseById(id);
  }

  /**
   * Create license
   */
  async createLicense(licenseData: CreateLicenseData): Promise<License> {
    return this.specializedOperations.createLicense(licenseData);
  }

  /**
   * Update license
   */
  async updateLicense(id: string, data: UpdateLicenseData): Promise<License> {
    return this.specializedOperations.updateLicense(id, data);
  }

  /**
   * Deactivate license
   */
  async deactivateLicense(id: string): Promise<License> {
    return this.specializedOperations.deactivateLicense(id);
  }

  // ==================== System Configuration (Specialized) ====================

  /**
   * Get all system configurations
   */
  async getConfigurations(category?: ConfigCategory): Promise<SystemConfiguration[]> {
    return this.specializedOperations.getConfigurations(category);
  }

  /**
   * Get configuration by key
   */
  async getConfigurationByKey(key: string): Promise<SystemConfiguration> {
    return this.specializedOperations.getConfigurationByKey(key);
  }

  /**
   * Set/update configuration
   */
  async setConfiguration(configData: ConfigurationData, changedBy?: string): Promise<SystemConfiguration> {
    return this.specializedOperations.setConfiguration(configData, changedBy);
  }

  /**
   * Delete configuration
   */
  async deleteConfiguration(key: string): Promise<{ message: string }> {
    return this.specializedOperations.deleteConfiguration(key);
  }

  // ==================== Performance Metrics (Specialized) ====================

  /**
   * Get performance metrics
   */
  async getMetrics(filters?: MetricFilters): Promise<PerformanceMetric[]> {
    return this.specializedOperations.getMetrics(filters);
  }

  /**
   * Record a performance metric
   */
  async recordMetric(metricData: RecordMetricData): Promise<PerformanceMetric> {
    return this.specializedOperations.recordMetric(metricData);
  }

  // ==================== Training Management (Specialized) ====================

  /**
   * Get all training modules
   */
  async getTrainingModules(category?: TrainingCategory): Promise<TrainingModule[]> {
    return this.specializedOperations.getTrainingModules(category);
  }

  /**
   * Get training module by ID
   */
  async getTrainingModuleById(id: string): Promise<TrainingModule> {
    return this.specializedOperations.getTrainingModuleById(id);
  }

  /**
   * Create training module
   */
  async createTrainingModule(moduleData: CreateTrainingModuleData): Promise<TrainingModule> {
    return this.specializedOperations.createTrainingModule(moduleData);
  }

  /**
   * Update training module
   */
  async updateTrainingModule(id: string, moduleData: UpdateTrainingModuleData): Promise<TrainingModule> {
    return this.specializedOperations.updateTrainingModule(id, moduleData);
  }

  /**
   * Delete training module
   */
  async deleteTrainingModule(id: string): Promise<{ message: string }> {
    return this.specializedOperations.deleteTrainingModule(id);
  }

  /**
   * Record training completion
   */
  async recordTrainingCompletion(moduleId: string, completionData?: RecordTrainingCompletionData): Promise<TrainingCompletion> {
    return this.specializedOperations.recordTrainingCompletion(moduleId, completionData);
  }

  /**
   * Get user training progress
   */
  async getUserTrainingProgress(userId: string): Promise<UserTrainingProgress> {
    return this.specializedOperations.getUserTrainingProgress(userId);
  }

  // ==================== Audit Logs (Specialized) ====================

  /**
   * Get audit logs with filtering and pagination
   */
  async getAuditLogs(filters?: AuditLogQueryFilters): Promise<PaginatedResponse<AuditLog>> {
    return this.specializedOperations.getAuditLogs(filters);
  }
}

/**
 * Factory function to create AdministrationApi instance
 * @param client - ApiClient instance with authentication and resilience patterns
 * @returns Configured AdministrationApi instance
 */
export function createAdministrationApi(client: ApiClient): AdministrationApi {
  return new AdministrationApi(client);
}

// Default export for convenience
export default AdministrationApi;
