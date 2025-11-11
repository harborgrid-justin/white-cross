/**
 * Administration API - Type Definitions
 * 
 * Comprehensive type definitions for administration and system management
 * 
 * @module services/modules/administrationApi/types
 */

// ==========================================
// BASE TYPES
// ==========================================

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

// ==========================================
// USER MANAGEMENT TYPES
// ==========================================

export enum UserRole {
  ADMIN = 'ADMIN',
  NURSE = 'NURSE',
  SCHOOL_ADMIN = 'SCHOOL_ADMIN',
  DISTRICT_ADMIN = 'DISTRICT_ADMIN',
  COUNSELOR = 'COUNSELOR',
  VIEWER = 'VIEWER'
}

export interface User extends BaseEntity {
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  lastLogin?: string;
  schoolId?: string;
  districtId?: string;
  school?: School;
  district?: District;
}

export interface CreateUserData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  schoolId?: string;
  districtId?: string;
}

export interface UpdateUserData {
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: UserRole;
  schoolId?: string;
  districtId?: string;
  isActive?: boolean;
}

export interface UserFilters {
  page?: number;
  limit?: number;
  search?: string;
  role?: UserRole;
  isActive?: boolean;
  schoolId?: string;
  districtId?: string;
}

// ==========================================
// DISTRICT MANAGEMENT TYPES
// ==========================================

export interface District extends BaseEntity {
  name: string;
  code: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  phone?: string;
  email?: string;
  website?: string;
  schoolCount: number;
  userCount: number;
  isActive: boolean;
  superintendent?: string;
  settings?: Record<string, any>;
}

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
  superintendent?: string;
}

export interface UpdateDistrictData extends Partial<CreateDistrictData> {
  isActive?: boolean;
  settings?: Record<string, any>;
}

// ==========================================
// SCHOOL MANAGEMENT TYPES
// ==========================================

export interface School extends BaseEntity {
  name: string;
  code: string;
  districtId: string;
  district: District;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  phone?: string;
  email?: string;
  principal?: string;
  totalEnrollment?: number;
  userCount: number;
  isActive: boolean;
  gradeLevel?: string;
  schoolType?: 'ELEMENTARY' | 'MIDDLE' | 'HIGH' | 'K12' | 'OTHER';
  settings?: Record<string, any>;
}

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
  gradeLevel?: string;
  schoolType?: 'ELEMENTARY' | 'MIDDLE' | 'HIGH' | 'K12' | 'OTHER';
}

export interface UpdateSchoolData extends Partial<Omit<CreateSchoolData, 'districtId'>> {
  isActive?: boolean;
  settings?: Record<string, any>;
}

// ==========================================
// SYSTEM CONFIGURATION TYPES
// ==========================================

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
  SMS = 'SMS'
}

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
  ENUM = 'ENUM'
}

export enum ConfigScope {
  SYSTEM = 'SYSTEM',
  DISTRICT = 'DISTRICT',
  SCHOOL = 'SCHOOL',
  USER = 'USER'
}

export interface SystemConfiguration extends BaseEntity {
  key: string;
  value: string;
  category: ConfigCategory;
  valueType?: ConfigValueType;
  subCategory?: string;
  description?: string;
  isPublic: boolean;
  isEditable: boolean;
  requiresRestart: boolean;
  scope: ConfigScope;
  scopeId?: string;
  tags?: string[];
  sortOrder: number;
  changedBy?: string;
  previousValue?: string;
}

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

export interface SystemSettings {
  general: SystemSettingItem[];
  security: SystemSettingItem[];
  notifications: SystemSettingItem[];
  integrations: SystemSettingItem[];
  performance: SystemSettingItem[];
  healthcare: SystemSettingItem[];
}

export interface SystemSettingItem {
  key: string;
  value: string;
  type: ConfigValueType;
  label: string;
  description?: string;
  options?: Array<{ value: string; label: string }>;
  validation?: {
    required?: boolean;
    min?: number;
    max?: number;
    pattern?: string;
  };
  isEditable: boolean;
  requiresRestart: boolean;
}

// ==========================================
// LICENSE MANAGEMENT TYPES
// ==========================================

export enum LicenseType {
  TRIAL = 'TRIAL',
  BASIC = 'BASIC',
  PROFESSIONAL = 'PROFESSIONAL',
  ENTERPRISE = 'ENTERPRISE'
}

export enum LicenseStatus {
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  SUSPENDED = 'SUSPENDED',
  REVOKED = 'REVOKED'
}

export interface License extends BaseEntity {
  licenseKey: string;
  type: LicenseType;
  status: LicenseStatus;
  maxUsers?: number;
  maxSchools?: number;
  features: string[];
  issuedTo?: string;
  issuedAt: string;
  expiresAt?: string;
  districtId?: string;
  district?: District;
  notes?: string;
  currentUsers: number;
  currentSchools: number;
  usageMetrics?: {
    apiCalls: number;
    storage: number;
    bandwidth: number;
  };
}

export interface CreateLicenseData {
  licenseKey: string;
  type: LicenseType;
  maxUsers?: number;
  maxSchools?: number;
  features: string[];
  issuedTo?: string;
  expiresAt?: string;
  districtId?: string;
  notes?: string;
}

export interface UpdateLicenseData extends Partial<Omit<CreateLicenseData, 'licenseKey'>> {
  status?: LicenseStatus;
}

// ==========================================
// SYSTEM HEALTH TYPES
// ==========================================

export interface SystemHealth {
  status: 'healthy' | 'degraded' | 'down';
  uptime: number;
  version: string;
  environment: 'development' | 'staging' | 'production';
  services: ServiceHealth[];
  metrics: {
    cpu: number;
    memory: number;
    disk: number;
    database: {
      connections: number;
      responseTime: number;
    };
    cache: {
      hitRate: number;
      size: number;
    };
  };
  lastCheck: string;
}

export interface ServiceHealth {
  name: string;
  status: 'healthy' | 'degraded' | 'down';
  responseTime: number;
  lastCheck: string;
  error?: string;
}

// ==========================================
// BACKUP TYPES
// ==========================================

export enum BackupStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

export enum BackupType {
  MANUAL = 'MANUAL',
  SCHEDULED = 'SCHEDULED',
  INCREMENTAL = 'INCREMENTAL',
  FULL = 'FULL'
}

export interface BackupLog extends BaseEntity {
  type: BackupType;
  status: BackupStatus;
  startedAt: string;
  completedAt?: string;
  duration?: number;
  fileSize?: number;
  filePath?: string;
  error?: string;
  triggeredBy?: string;
  metadata?: {
    tables: number;
    records: number;
    compressed: boolean;
  };
}

export interface CreateBackupData {
  type?: BackupType;
  includeFiles?: boolean;
  compressed?: boolean;
  description?: string;
}

// ==========================================
// PERFORMANCE METRICS TYPES
// ==========================================

export enum MetricType {
  API_RESPONSE_TIME = 'API_RESPONSE_TIME',
  DATABASE_QUERY_TIME = 'DATABASE_QUERY_TIME',
  MEMORY_USAGE = 'MEMORY_USAGE',
  CPU_USAGE = 'CPU_USAGE',
  DISK_USAGE = 'DISK_USAGE',
  ACTIVE_USERS = 'ACTIVE_USERS',
  ERROR_RATE = 'ERROR_RATE',
  THROUGHPUT = 'THROUGHPUT'
}

export interface PerformanceMetric extends BaseEntity {
  metricType: MetricType;
  value: number;
  unit: string;
  timestamp: string;
  metadata?: Record<string, any>;
  threshold?: {
    warning: number;
    critical: number;
  };
  tags?: string[];
}

export interface RecordMetricData {
  metricType: MetricType;
  value: number;
  unit: string;
  timestamp?: string;
  metadata?: Record<string, any>;
  tags?: string[];
}

export interface MetricFilters {
  metricType?: MetricType;
  startDate?: string | Date;
  endDate?: string | Date;
  limit?: number;
  tags?: string[];
}

// ==========================================
// TRAINING MODULE TYPES
// ==========================================

export enum TrainingCategory {
  HIPAA_COMPLIANCE = 'HIPAA_COMPLIANCE',
  MEDICATION_MANAGEMENT = 'MEDICATION_MANAGEMENT',
  EMERGENCY_PROCEDURES = 'EMERGENCY_PROCEDURES',
  SYSTEM_TRAINING = 'SYSTEM_TRAINING',
  SAFETY_PROTOCOLS = 'SAFETY_PROTOCOLS',
  DATA_SECURITY = 'DATA_SECURITY'
}

export enum TrainingStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  OVERDUE = 'OVERDUE'
}

export interface TrainingModule extends BaseEntity {
  title: string;
  description?: string;
  content: string;
  duration?: number;
  category: TrainingCategory;
  isRequired: boolean;
  order: number;
  attachments?: string[];
  isActive: boolean;
  completionCount: number;
  averageScore?: number;
  version: number;
  tags?: string[];
}

export interface CreateTrainingModuleData {
  title: string;
  description?: string;
  content: string;
  duration?: number;
  category: TrainingCategory;
  isRequired?: boolean;
  order?: number;
  attachments?: string[];
  tags?: string[];
}

export interface UpdateTrainingModuleData extends Partial<CreateTrainingModuleData> {
  isActive?: boolean;
}

export interface TrainingCompletion extends BaseEntity {
  userId: string;
  moduleId: string;
  user: User;
  module: TrainingModule;
  completedAt: string;
  score?: number;
  timeSpent?: number;
  certificateUrl?: string;
  notes?: string;
  isValid: boolean;
  expiresAt?: string;
}

export interface RecordTrainingCompletionData {
  score?: number;
  timeSpent?: number;
  notes?: string;
}

export interface UserTrainingProgress {
  userId: string;
  user: User;
  totalModules: number;
  completedModules: number;
  requiredModules: number;
  completedRequired: number;
  overdue: number;
  inProgress: number;
  completionRate: number;
  lastActivity?: string;
  modules: Array<{
    module: TrainingModule;
    completion?: TrainingCompletion;
    status: TrainingStatus;
    dueDate?: string;
  }>;
}

// ==========================================
// AUDIT LOG TYPES
// ==========================================

export enum AuditAction {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  VIEW = 'VIEW',
  EXPORT = 'EXPORT',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  BACKUP = 'BACKUP',
  RESTORE = 'RESTORE',
  CONFIG_CHANGE = 'CONFIG_CHANGE'
}

export interface AuditLog extends BaseEntity {
  userId: string;
  user: User;
  action: AuditAction;
  entityType: string;
  entityId?: string;
  description: string;
  ipAddress: string;
  userAgent?: string;
  metadata?: Record<string, any>;
  success: boolean;
  error?: string;
  timestamp: string;
}

export interface AuditLogFilters {
  page?: number;
  limit?: number;
  userId?: string;
  entityType?: string;
  entityId?: string;
  action?: AuditAction;
  startDate?: string;
  endDate?: string;
  success?: boolean;
}

// ==========================================
// API RESPONSE TYPES
// ==========================================

export interface UsersResponse {
  users: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface DistrictsResponse {
  districts: District[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface SchoolsResponse {
  schools: School[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ConfigurationsResponse {
  configurations: SystemConfiguration[];
}

export interface LicensesResponse {
  licenses: License[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface BackupLogsResponse {
  backups: BackupLog[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface MetricsResponse {
  metrics: PerformanceMetric[];
}

export interface TrainingModulesResponse {
  modules: TrainingModule[];
}

export interface AuditLogsResponse {
  logs: AuditLog[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ==========================================
// LEGACY TYPE ALIASES
// ==========================================

export type SystemConfig = SystemConfiguration;
export type CreateUserRequest = CreateUserData;
export type CreateDistrictRequest = CreateDistrictData;
export type CreateSchoolRequest = CreateSchoolData;
