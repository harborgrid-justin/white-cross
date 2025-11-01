/**
 * WF-COMP-315 | administration.ts - React component or utility module
 * Purpose: react component or utility module
 * Upstream: React, external libs | Dependencies: React ecosystem
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: functions, interfaces | Key Features: Standard module
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

/**
 * Administration Module Types
 *
 * Comprehensive type definitions for the Administration module including:
 * - District and School management
 * - System configuration with history tracking
 * - License management and feature control
 * - Backup operations and monitoring
 * - Performance metrics collection
 * - Training module management and completion tracking
 * - User management
 * - Audit logging
 */

// ==================== ENUMS ====================

/**
 * Configuration category types
 */
export enum ConfigCategory {
  GENERAL = 'GENERAL',
  SECURITY = 'SECURITY',
  NOTIFICATION = 'NOTIFICATION',
  INTEGRATION = 'INTEGRATION',
  BACKUP = 'BACKUP',
  PERFORMANCE = 'PERFORMANCE',
  HEALTHCARE = 'HEALTHCARE',
  MEDICATION = 'MEDICATION',
  APPOINTMENTS = 'APPOINTMENTS',
  UI = 'UI',
  QUERY = 'QUERY',
  FILE_UPLOAD = 'FILE_UPLOAD',
  RATE_LIMITING = 'RATE_LIMITING',
  SESSION = 'SESSION',
  EMAIL = 'EMAIL',
  SMS = 'SMS',
}

/**
 * Configuration value data types
 */
export enum ConfigValueType {
  STRING = 'STRING',
  NUMBER = 'NUMBER',
  BOOLEAN = 'BOOLEAN',
  JSON = 'JSON',
  ARRAY = 'ARRAY',
  DATE = 'DATE',
  TIME = 'TIME',
  DATETIME = 'DATETIME',
  EMAIL = 'EMAIL',
  URL = 'URL',
  COLOR = 'COLOR',
  ENUM = 'ENUM',
}

/**
 * Configuration scope levels
 */
export enum ConfigScope {
  SYSTEM = 'SYSTEM',
  DISTRICT = 'DISTRICT',
  SCHOOL = 'SCHOOL',
  USER = 'USER',
}

/**
 * Backup types
 */
export enum BackupType {
  AUTOMATIC = 'AUTOMATIC',
  MANUAL = 'MANUAL',
  SCHEDULED = 'SCHEDULED',
}

/**
 * Backup status
 */
export enum BackupStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

/**
 * Performance metric types
 */
export enum MetricType {
  CPU_USAGE = 'CPU_USAGE',
  MEMORY_USAGE = 'MEMORY_USAGE',
  DISK_USAGE = 'DISK_USAGE',
  API_RESPONSE_TIME = 'API_RESPONSE_TIME',
  DATABASE_QUERY_TIME = 'DATABASE_QUERY_TIME',
  ACTIVE_USERS = 'ACTIVE_USERS',
  ERROR_RATE = 'ERROR_RATE',
  REQUEST_COUNT = 'REQUEST_COUNT',
}

/**
 * License types
 */
export enum LicenseType {
  TRIAL = 'TRIAL',
  BASIC = 'BASIC',
  PROFESSIONAL = 'PROFESSIONAL',
  ENTERPRISE = 'ENTERPRISE',
}

/**
 * License status
 */
export enum LicenseStatus {
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  SUSPENDED = 'SUSPENDED',
  CANCELLED = 'CANCELLED',
}

/**
 * Training module categories
 */
export enum TrainingCategory {
  HIPAA_COMPLIANCE = 'HIPAA_COMPLIANCE',
  MEDICATION_MANAGEMENT = 'MEDICATION_MANAGEMENT',
  EMERGENCY_PROCEDURES = 'EMERGENCY_PROCEDURES',
  SYSTEM_TRAINING = 'SYSTEM_TRAINING',
  SAFETY_PROTOCOLS = 'SAFETY_PROTOCOLS',
  DATA_SECURITY = 'DATA_SECURITY',
}

/**
 * Audit log actions
 */
export enum AuditAction {
  CREATE = 'CREATE',
  READ = 'READ',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  EXPORT = 'EXPORT',
  IMPORT = 'IMPORT',
  BACKUP = 'BACKUP',
  RESTORE = 'RESTORE',
}

/**
 * User roles
 */
export enum UserRole {
  ADMIN = 'ADMIN',
  NURSE = 'NURSE',
  SCHOOL_ADMIN = 'SCHOOL_ADMIN',
  DISTRICT_ADMIN = 'DISTRICT_ADMIN',
  VIEWER = 'VIEWER',
  COUNSELOR = 'COUNSELOR',
}

// ==================== DISTRICT & SCHOOL TYPES ====================

/**
 * District entity
 *
 * @aligned_with backend/src/database/models/administration/District.ts
 */
export interface District {
  id: string;
  name: string;
  code: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  phone?: string;
  email?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;

  // Frontend-only relationship fields
  schools?: School[];
  licenses?: License[];
}

/**
 * School entity
 *
 * @aligned_with backend/src/database/models/administration/School.ts
 */
export interface School {
  id: string;
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
  isActive: boolean;
  createdAt: string;
  updatedAt: string;

  // Frontend-only relationship field
  district?: {
    id: string;
    name: string;
    code: string;
  };
}

/**
 * Create district request
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
  website?: string;
}

/**
 * Update district request
 */
export interface UpdateDistrictData {
  name?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  phone?: string;
  email?: string;
  website?: string;
  isActive?: boolean;
}

/**
 * Create school request
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
 * Update school request
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

// ==================== SYSTEM CONFIGURATION TYPES ====================

/**
 * System configuration entity
 *
 * @aligned_with backend/src/database/models/administration/SystemConfiguration.ts
 */
export interface SystemConfiguration {
  id: string;
  key: string;
  value: string;
  valueType: ConfigValueType;
  category: ConfigCategory;
  subCategory?: string;
  description?: string;
  defaultValue?: string;
  validValues: string[];
  minValue?: number;
  maxValue?: number;
  isPublic: boolean;
  isEditable: boolean;
  requiresRestart: boolean;
  scope: ConfigScope;
  scopeId?: string;
  tags: string[];
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Configuration history tracking
 *
 * @aligned_with backend/src/database/models/administration/ConfigurationHistory.ts
 */
export interface ConfigurationHistory {
  id: string;
  configurationId: string;
  configKey: string;
  oldValue?: string;
  newValue: string;
  changedBy: string;
  changedByName?: string;
  changeReason?: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

/**
 * Configuration data for create/update
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
 * System settings grouped by category
 */
export interface SystemSettings {
  [category: string]: SystemSettingItem[];
}

/**
 * Individual setting item
 */
export interface SystemSettingItem {
  key: string;
  value: string;
  valueType: ConfigValueType;
  description?: string;
  isPublic: boolean;
  isEditable: boolean;
  requiresRestart: boolean;
  category: ConfigCategory;
  subCategory?: string;
  scope?: ConfigScope;
  tags?: string[];
}

// ==================== LICENSE MANAGEMENT TYPES ====================

/**
 * License entity
 *
 * @aligned_with backend/src/database/models/administration/License.ts
 */
export interface License {
  id: string;
  licenseKey: string;
  type: LicenseType;
  status: LicenseStatus;
  maxUsers?: number;
  maxSchools?: number;
  features: string[];
  issuedTo?: string;
  issuedAt: string;
  expiresAt?: string;
  activatedAt?: string;
  deactivatedAt?: string;
  notes?: string;
  districtId?: string;
  createdAt: string;
  updatedAt: string;

  // Frontend-only relationship field
  district?: {
    id: string;
    name: string;
    code: string;
  };
}

/**
 * Create license request
 */
export interface CreateLicenseData {
  licenseKey: string;
  type: LicenseType;
  maxUsers?: number;
  maxSchools?: number;
  features: string[];
  issuedTo?: string;
  expiresAt?: Date | string;
  districtId?: string;
  notes?: string;
}

/**
 * Update license request
 */
export interface UpdateLicenseData {
  licenseKey?: string;
  type?: LicenseType;
  status?: LicenseStatus;
  maxUsers?: number;
  maxSchools?: number;
  features?: string[];
  issuedTo?: string;
  expiresAt?: Date | string;
  districtId?: string;
  notes?: string;
}

// ==================== BACKUP & RECOVERY TYPES ====================

/**
 * Backup log entity
 *
 * @aligned_with backend/src/database/models/administration/BackupLog.ts
 * @note Backend has timestamps: false, so no updatedAt field
 */
export interface BackupLog {
  id: string;
  type: BackupType;
  status: BackupStatus;
  fileName?: string;
  fileSize?: number;
  location?: string;
  startedAt: string;
  completedAt?: string;
  error?: string;
  triggeredBy?: string;
  createdAt: string;
}

/**
 * Create backup request
 */
export interface CreateBackupData {
  type: BackupType;
  triggeredBy?: string;
}

// ==================== PERFORMANCE MONITORING TYPES ====================

/**
 * Performance metric entity
 *
 * @aligned_with backend/src/database/models/administration/PerformanceMetric.ts
 * @note Backend has timestamps: false, so no createdAt field
 */
export interface PerformanceMetric {
  id: string;
  metricType: MetricType;
  value: number;
  unit?: string;
  context?: Record<string, any>;
  recordedAt: string;
}

/**
 * System health metrics
 */
export interface SystemHealth {
  status: string;
  timestamp: Date | string;
  overall?: {
    uptime: number;
    lastRestart: Date | string;
    version: string;
  };
  services?: Array<{
    name: string;
    status: 'operational' | 'degraded' | 'down';
    responseTime: number;
    uptime: number;
    lastCheck: Date | string;
    errorRate?: number;
  }>;
  alerts?: Array<{
    id: string;
    severity: 'info' | 'warning' | 'error' | 'critical';
    service: string;
    message: string;
    timestamp: Date | string;
    acknowledged: boolean;
  }>;
  metrics: {
    cpu?: number | {
      usage: number;
      cores: number;
      temperature?: number;
    };
    memory?: number | {
      used: number;
      total: number;
      percentage: number;
    };
    disk?: number | {
      used: number;
      total: number;
      percentage: number;
    };
    database?: string;
    apiResponseTime?: number;
    uptime?: string;
    connections?: number;
    errorRate?: number;
    queuedJobs?: number;
    cacheHitRate?: number;
  };
  statistics?: {
    totalUsers: number;
    activeUsers: number;
    totalDistricts: number;
    totalSchools: number;
  };
  system?: {
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

/**
 * Record metric request
 */
export interface RecordMetricData {
  metricType: MetricType;
  value: number;
  unit?: string;
  context?: Record<string, any>;
}

// ==================== TRAINING MODULE TYPES ====================

/**
 * Training module entity
 *
 * @aligned_with backend/src/database/models/administration/TrainingModule.ts
 */
export interface TrainingModule {
  id: string;
  title: string;
  description?: string;
  content: string;
  duration?: number;
  category: TrainingCategory;
  isRequired: boolean;
  order: number;
  attachments: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;

  // Frontend-only relationship field
  completions?: TrainingCompletion[];
}

/**
 * Training completion tracking
 *
 * @aligned_with backend/src/database/models/administration/TrainingCompletion.ts
 * @note Backend has timestamps: false, so no updatedAt field
 */
export interface TrainingCompletion {
  id: string;
  userId: string;
  moduleId: string;
  score?: number;
  completedAt: string;
  expiresAt?: string;
  certificateUrl?: string;
  notes?: string;
  createdAt: string;

  // Frontend-only relationship field
  module?: TrainingModule;
}

/**
 * Create training module request
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
 * Update training module request
 */
export interface UpdateTrainingModuleData {
  title?: string;
  description?: string;
  content?: string;
  duration?: number;
  category?: TrainingCategory;
  isRequired?: boolean;
  order?: number;
  attachments?: string[];
}

/**
 * Training completion request
 */
export interface RecordTrainingCompletionData {
  score?: number;
}

/**
 * User training progress
 */
export interface UserTrainingProgress {
  completions: TrainingCompletion[];
  totalModules: number;
  completedModules: number;
  requiredModules: number;
  completedRequired: number;
  completionPercentage: number;
}

// ==================== USER MANAGEMENT TYPES ====================

/**
 * User entity
 */
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  schoolId?: string;
  districtId?: string;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Create user request
 */
export interface CreateUserData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  schoolId?: string;
  districtId?: string;
}

/**
 * Update user request
 */
export interface UpdateUserData {
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: UserRole;
  isActive?: boolean;
  schoolId?: string;
  districtId?: string;
}

// ==================== AUDIT LOGGING TYPES ====================

/**
 * Audit log entity
 */
export interface AuditLog {
  id: string;
  action: AuditAction;
  entityType: string;
  entityId?: string;
  userId?: string;
  changes?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

/**
 * Create audit log request
 */
export interface CreateAuditLogData {
  action: AuditAction;
  entityType: string;
  entityId?: string;
  userId?: string;
  changes?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}

// ==================== PAGINATION & FILTER TYPES ====================

/**
 * Pagination parameters
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
}

/**
 * Pagination result metadata
 */
export interface PaginationResult {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/**
 * Paginated response wrapper
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationResult;
}

/**
 * User filter parameters
 */
export interface UserFilters extends PaginationParams {
  search?: string;
  role?: UserRole;
  isActive?: boolean;
}

/**
 * Audit log filter parameters
 */
export interface AuditLogFilters extends PaginationParams {
  userId?: string;
  entityType?: string;
  entityId?: string;
  action?: AuditAction;
  startDate?: Date | string;
  endDate?: Date | string;
}

/**
 * Metric filter parameters
 */
export interface MetricFilters {
  metricType?: MetricType;
  startDate?: Date | string;
  endDate?: Date | string;
  limit?: number;
}

// ==================== API RESPONSE TYPES ====================

/**
 * Generic API response
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
  };
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

/**
 * Success response with message
 */
export interface SuccessResponse {
  success: boolean;
  message: string;
}

// ==================== TYPE GUARDS ====================

/**
 * Check if value is a valid ConfigCategory
 */
export function isConfigCategory(value: any): value is ConfigCategory {
  return Object.values(ConfigCategory).includes(value);
}

/**
 * Check if value is a valid LicenseType
 */
export function isLicenseType(value: any): value is LicenseType {
  return Object.values(LicenseType).includes(value);
}

/**
 * Check if value is a valid TrainingCategory
 */
export function isTrainingCategory(value: any): value is TrainingCategory {
  return Object.values(TrainingCategory).includes(value);
}

/**
 * Check if value is a valid UserRole
 */
export function isUserRole(value: any): value is UserRole {
  return Object.values(UserRole).includes(value);
}

/**
 * Check if value is a valid MetricType
 */
export function isMetricType(value: any): value is MetricType {
  return Object.values(MetricType).includes(value);
}

/**
 * Check if value is a valid AuditAction
 */
export function isAuditAction(value: any): value is AuditAction {
  return Object.values(AuditAction).includes(value);
}
