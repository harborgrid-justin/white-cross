/**
 * Administration Service Type Definitions
 *
 * @module services/administration/types
 */

import {
  ConfigCategory,
  ConfigValueType,
  ConfigScope,
  BackupType,
  TrainingCategory
} from '../../database/types/enums';

/**
 * District Creation Data Interface
 */
export interface CreateDistrictData {
  name: string;
  code: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  phone?: string;
  email?: string;
}

/**
 * District Update Data Interface
 */
export interface UpdateDistrictData {
  name?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  phone?: string;
  email?: string;
  isActive?: boolean;
}

/**
 * School Creation Data Interface
 */
export interface CreateSchoolData {
  name: string;
  code: string;
  districtId: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  phone?: string;
  email?: string;
  principal?: string;
  totalEnrollment?: number;
}

/**
 * School Update Data Interface
 */
export interface UpdateSchoolData {
  name?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  phone?: string;
  email?: string;
  principal?: string;
  totalEnrollment?: number;
  isActive?: boolean;
}

/**
 * System Configuration Data Interface
 */
export interface ConfigurationData {
  key: string;
  value: string;
  category: ConfigCategory;
  valueType?: ConfigValueType;
  subCategory?: string;
  description?: string;
  isPublic?: boolean;
  isEditable?: boolean;
  requiresRestart?: boolean;
  scope?: ConfigScope;
  scopeId?: string;
  tags?: string[];
  sortOrder?: number;
}

/**
 * Backup Creation Data Interface
 */
export interface BackupData {
  type: BackupType;
  triggeredBy?: string;
}

/**
 * License Creation Data Interface
 */
export interface CreateLicenseData {
  licenseKey: string;
  type: string;
  maxUsers?: number;
  maxSchools?: number;
  features: string[];
  issuedTo?: string;
  expiresAt?: Date;
  districtId?: string;
  notes?: string;
}

/**
 * Training Module Creation Data Interface
 */
export interface CreateTrainingModuleData {
  title: string;
  description?: string;
  content: string;
  duration?: number;
  category: TrainingCategory;
  isRequired?: boolean;
  order?: number;
  attachments?: string[];
}

/**
 * User Creation Data Interface
 */
export interface UserData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
  schoolId?: string;
  districtId?: string;
}

/**
 * Pagination Parameters Interface
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
}

/**
 * Pagination Result Interface
 */
export interface PaginationResult {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/**
 * Audit Log Filters Interface
 */
export interface AuditLogFilters {
  userId?: string;
  entityType?: string;
  entityId?: string;
  action?: string;
  startDate?: Date;
  endDate?: Date;
}

/**
 * System Health Interface
 */
export interface SystemHealth {
  status: string;
  timestamp: Date;
  metrics: {
    cpu: number;
    memory: number;
    disk: number;
    database: string;
    apiResponseTime: number;
    uptime: string;
    connections: number;
    errorRate: number;
    queuedJobs: number;
    cacheHitRate: number;
  };
  statistics: {
    totalUsers: number;
    activeUsers: number;
    totalDistricts: number;
    totalSchools: number;
  };
  system: {
    platform: string;
    arch: string;
    nodeVersion: string;
    totalMemoryGB: string;
    freeMemoryGB: string;
    cpuCount: number;
    cpuModel: string;
    processHeapUsedMB: string;
    processHeapTotalMB: string;
  };
}
