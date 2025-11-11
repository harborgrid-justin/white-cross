/**
 * @fileoverview Type definitions for administration and system management operations
 * 
 * This module provides comprehensive type definitions for all administration
 * operations including user management, district/school management, licensing,
 * training modules, system configuration, and health monitoring.
 * 
 * @module services/modules/administrationApi/types
 */

// Import and re-export all types from the domain administration types
import type {
  District,
  School,
  SystemConfiguration,
  SystemSettings,
  SystemSettingItem,
  BackupLog,
  License,
  PerformanceMetric,
  SystemHealth,
  TrainingModule,
  TrainingCompletion,
  UserTrainingProgress,
  User,
  AuditLog,
  CreateDistrictData,
  UpdateDistrictData,
  CreateSchoolData,
  UpdateSchoolData,
  ConfigurationData,
  CreateLicenseData,
  UpdateLicenseData,
  CreateBackupData,
  CreateTrainingModuleData,
  UpdateTrainingModuleData,
  RecordTrainingCompletionData,
  RecordMetricData,
  CreateUserData,
  UpdateUserData,
  UserFilters,
  AuditLogFilters,
  MetricFilters,
  ConfigCategory,
  TrainingCategory,
  MetricType,
} from '../../../types/domain/administration';

import type { PaginatedResponse } from '../../utils/apiUtils';

// Re-export all imported types
export type {
  District,
  School,
  SystemConfiguration,
  SystemSettings,
  SystemSettingItem,
  BackupLog,
  License,
  PerformanceMetric,
  SystemHealth,
  TrainingModule,
  TrainingCompletion,
  UserTrainingProgress,
  User,
  AuditLog,
  CreateDistrictData,
  UpdateDistrictData,
  CreateSchoolData,
  UpdateSchoolData,
  ConfigurationData,
  CreateLicenseData,
  UpdateLicenseData,
  CreateBackupData,
  CreateTrainingModuleData,
  UpdateTrainingModuleData,
  RecordTrainingCompletionData,
  RecordMetricData,
  CreateUserData,
  UpdateUserData,
  UserFilters,
  AuditLogFilters,
  MetricFilters,
  ConfigCategory,
  TrainingCategory,
  MetricType,
};

// Additional types specific to the API operations

export interface UserQueryFilters {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  isActive?: boolean;
}

export interface AuditLogQueryFilters {
  page?: number;
  limit?: number;
  userId?: string;
  entityType?: string;
  entityId?: string;
  action?: string;
  startDate?: string;
  endDate?: string;
}

export interface AdministrationApiOperations {
  // System Settings
  getSettings(): Promise<SystemSettings>;
  updateSettings(settings: SystemSettingItem[]): Promise<SystemSettingItem[]>;

  // User Management
  getUsers(filters?: UserQueryFilters): Promise<PaginatedResponse<User>>;
  createUser(userData: CreateUserData): Promise<User>;
  updateUser(id: string, userData: UpdateUserData): Promise<User>;
  deleteUser(id: string): Promise<{ message: string }>;

  // District Management
  getDistricts(page?: number, limit?: number): Promise<PaginatedResponse<District>>;
  getDistrictById(id: string): Promise<District>;
  createDistrict(districtData: CreateDistrictData): Promise<District>;
  updateDistrict(id: string, districtData: Partial<District>): Promise<District>;
  deleteDistrict(id: string): Promise<{ message: string }>;

  // School Management
  getSchools(page?: number, limit?: number, districtId?: string): Promise<PaginatedResponse<School>>;
  getSchoolById(id: string): Promise<School>;
  createSchool(schoolData: CreateSchoolData): Promise<School>;
  updateSchool(id: string, schoolData: Partial<School>): Promise<School>;
  deleteSchool(id: string): Promise<{ message: string }>;

  // System Health
  getSystemHealth(): Promise<SystemHealth>;

  // Backup Management
  getBackupLogs(page?: number, limit?: number): Promise<PaginatedResponse<BackupLog>>;
  createBackup(): Promise<BackupLog>;

  // License Management
  getLicenses(page?: number, limit?: number): Promise<PaginatedResponse<License>>;
  getLicenseById(id: string): Promise<License>;
  createLicense(licenseData: CreateLicenseData): Promise<License>;
  updateLicense(id: string, data: UpdateLicenseData): Promise<License>;
  deactivateLicense(id: string): Promise<License>;

  // Configuration Management
  getConfigurations(category?: ConfigCategory): Promise<SystemConfiguration[]>;
  getConfigurationByKey(key: string): Promise<SystemConfiguration>;
  setConfiguration(configData: ConfigurationData, changedBy?: string): Promise<SystemConfiguration>;
  deleteConfiguration(key: string): Promise<{ message: string }>;

  // Performance Metrics
  getMetrics(filters?: MetricFilters): Promise<PerformanceMetric[]>;
  recordMetric(metricData: RecordMetricData): Promise<PerformanceMetric>;

  // Training Management
  getTrainingModules(category?: TrainingCategory): Promise<TrainingModule[]>;
  getTrainingModuleById(id: string): Promise<TrainingModule>;
  createTrainingModule(moduleData: CreateTrainingModuleData): Promise<TrainingModule>;
  updateTrainingModule(id: string, moduleData: UpdateTrainingModuleData): Promise<TrainingModule>;
  deleteTrainingModule(id: string): Promise<{ message: string }>;
  recordTrainingCompletion(moduleId: string, completionData?: RecordTrainingCompletionData): Promise<TrainingCompletion>;
  getUserTrainingProgress(userId: string): Promise<UserTrainingProgress>;

  // Audit Logs
  getAuditLogs(filters?: AuditLogQueryFilters): Promise<PaginatedResponse<AuditLog>>;
}
