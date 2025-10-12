/**
 * Administration Service - Modular Implementation
 *
 * Enterprise-grade administration service managing districts, schools, licenses,
 * system configuration, backups, performance monitoring, and training modules.
 *
 * @module services/administration
 */

// Export types
export * from './types';

// Export district operations
export {
  createDistrict,
  getDistricts,
  getDistrictById,
  updateDistrict,
  deleteDistrict
} from './districtOperations';

// Export school operations
export {
  createSchool,
  getSchools,
  getSchoolById,
  updateSchool,
  deleteSchool
} from './schoolOperations';

// Export configuration operations
export {
  getConfiguration,
  getAllConfigurations,
  setConfiguration,
  deleteConfiguration,
  getConfigurationHistory
} from './configurationOperations';

// Export settings operations
export {
  getSystemSettings,
  updateSystemSettings
} from './settingsOperations';

// Export backup operations
export {
  createBackup,
  getBackupLogs,
  getBackupById
} from './backupOperations';

// Export performance operations
export {
  recordMetric,
  getMetrics
} from './performanceOperations';

// Export system health operations
export {
  getSystemHealth
} from './systemHealthOperations';

// Export license operations
export {
  createLicense,
  getLicenses,
  getLicenseById,
  updateLicense,
  deactivateLicense
} from './licenseOperations';

// Export training operations
export {
  createTrainingModule,
  getTrainingModules,
  getTrainingModuleById,
  updateTrainingModule,
  deleteTrainingModule,
  recordTrainingCompletion,
  getUserTrainingProgress
} from './trainingOperations';

// Export audit operations
export {
  createAuditLog,
  getAuditLogs
} from './auditOperations';

// Export user management operations
export {
  getUsers,
  createUser,
  updateUser,
  deleteUser
} from './userManagementOperations';

/**
 * AdministrationService class for backwards compatibility
 * This maintains the same API as the original monolithic service
 */
export class AdministrationService {
  // System Settings Management
  static async getSystemSettings() {
    const { getSystemSettings } = require('./settingsOperations');
    return getSystemSettings();
  }

  static async updateSystemSettings(settings: any[], changedBy?: string) {
    const { updateSystemSettings } = require('./settingsOperations');
    return updateSystemSettings(settings, changedBy);
  }

  // District Management
  static async createDistrict(data: any) {
    const { createDistrict } = require('./districtOperations');
    return createDistrict(data);
  }

  static async getDistricts(page?: number, limit?: number) {
    const { getDistricts } = require('./districtOperations');
    return getDistricts(page, limit);
  }

  static async getDistrictById(id: string) {
    const { getDistrictById } = require('./districtOperations');
    return getDistrictById(id);
  }

  static async updateDistrict(id: string, data: any) {
    const { updateDistrict } = require('./districtOperations');
    return updateDistrict(id, data);
  }

  static async deleteDistrict(id: string) {
    const { deleteDistrict } = require('./districtOperations');
    return deleteDistrict(id);
  }

  // School Management
  static async createSchool(data: any) {
    const { createSchool } = require('./schoolOperations');
    return createSchool(data);
  }

  static async getSchools(page?: number, limit?: number, districtId?: string) {
    const { getSchools } = require('./schoolOperations');
    return getSchools(page, limit, districtId);
  }

  static async getSchoolById(id: string) {
    const { getSchoolById } = require('./schoolOperations');
    return getSchoolById(id);
  }

  static async updateSchool(id: string, data: any) {
    const { updateSchool } = require('./schoolOperations');
    return updateSchool(id, data);
  }

  static async deleteSchool(id: string) {
    const { deleteSchool } = require('./schoolOperations');
    return deleteSchool(id);
  }

  // System Configuration
  static async getConfiguration(key: string) {
    const { getConfiguration } = require('./configurationOperations');
    return getConfiguration(key);
  }

  static async getAllConfigurations(category?: any) {
    const { getAllConfigurations } = require('./configurationOperations');
    return getAllConfigurations(category);
  }

  static async setConfiguration(data: any, changedBy?: string) {
    const { setConfiguration } = require('./configurationOperations');
    return setConfiguration(data, changedBy);
  }

  static async deleteConfiguration(key: string) {
    const { deleteConfiguration } = require('./configurationOperations');
    return deleteConfiguration(key);
  }

  static async getConfigurationHistory(configKey: string, limit?: number) {
    const { getConfigurationHistory } = require('./configurationOperations');
    return getConfigurationHistory(configKey, limit);
  }

  // Backup & Recovery
  static async createBackup(data: any) {
    const { createBackup } = require('./backupOperations');
    return createBackup(data);
  }

  static async getBackupLogs(page?: number, limit?: number) {
    const { getBackupLogs } = require('./backupOperations');
    return getBackupLogs(page, limit);
  }

  static async getBackupById(id: string) {
    const { getBackupById } = require('./backupOperations');
    return getBackupById(id);
  }

  // Performance Monitoring
  static async recordMetric(metricType: any, value: number, unit?: string, context?: any) {
    const { recordMetric } = require('./performanceOperations');
    return recordMetric(metricType, value, unit, context);
  }

  static async getMetrics(metricType?: any, startDate?: Date, endDate?: Date, limit?: number) {
    const { getMetrics } = require('./performanceOperations');
    return getMetrics(metricType, startDate, endDate, limit);
  }

  static async getSystemHealth() {
    const { getSystemHealth } = require('./systemHealthOperations');
    return getSystemHealth();
  }

  // License Management
  static async createLicense(data: any) {
    const { createLicense } = require('./licenseOperations');
    return createLicense(data);
  }

  static async getLicenses(page?: number, limit?: number) {
    const { getLicenses } = require('./licenseOperations');
    return getLicenses(page, limit);
  }

  static async getLicenseById(id: string) {
    const { getLicenseById } = require('./licenseOperations');
    return getLicenseById(id);
  }

  static async updateLicense(id: string, data: any) {
    const { updateLicense } = require('./licenseOperations');
    return updateLicense(id, data);
  }

  static async deactivateLicense(id: string) {
    const { deactivateLicense } = require('./licenseOperations');
    return deactivateLicense(id);
  }

  // Training Module Management
  static async createTrainingModule(data: any) {
    const { createTrainingModule } = require('./trainingOperations');
    return createTrainingModule(data);
  }

  static async getTrainingModules(category?: any) {
    const { getTrainingModules } = require('./trainingOperations');
    return getTrainingModules(category);
  }

  static async getTrainingModuleById(id: string) {
    const { getTrainingModuleById } = require('./trainingOperations');
    return getTrainingModuleById(id);
  }

  static async updateTrainingModule(id: string, data: any) {
    const { updateTrainingModule } = require('./trainingOperations');
    return updateTrainingModule(id, data);
  }

  static async deleteTrainingModule(id: string) {
    const { deleteTrainingModule } = require('./trainingOperations');
    return deleteTrainingModule(id);
  }

  static async recordTrainingCompletion(moduleId: string, userId: string, score?: number) {
    const { recordTrainingCompletion } = require('./trainingOperations');
    return recordTrainingCompletion(moduleId, userId, score);
  }

  static async getUserTrainingProgress(userId: string) {
    const { getUserTrainingProgress } = require('./trainingOperations');
    return getUserTrainingProgress(userId);
  }

  // Audit Logging
  static async createAuditLog(
    action: any,
    entityType: string,
    entityId?: string,
    userId?: string,
    changes?: any,
    ipAddress?: string,
    userAgent?: string
  ) {
    const { createAuditLog } = require('./auditOperations');
    return createAuditLog(action, entityType, entityId, userId, changes, ipAddress, userAgent);
  }

  static async getAuditLogs(page?: number, limit?: number, filters?: any) {
    const { getAuditLogs } = require('./auditOperations');
    return getAuditLogs(page, limit, filters);
  }

  // User Management
  static async getUsers(filters?: any) {
    const { getUsers } = require('./userManagementOperations');
    return getUsers(filters);
  }

  static async createUser(userData: any) {
    const { createUser } = require('./userManagementOperations');
    return createUser(userData);
  }

  static async updateUser(id: string, userData: any) {
    const { updateUser } = require('./userManagementOperations');
    return updateUser(id, userData);
  }

  static async deleteUser(id: string) {
    const { deleteUser } = require('./userManagementOperations');
    return deleteUser(id);
  }
}

export default AdministrationService;
