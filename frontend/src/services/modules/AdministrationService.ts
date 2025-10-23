/**
 * WF-COMP-269 | administrationApi.ts - React component or utility module
 * Purpose: react component or utility module
 * Upstream: ../config/apiConfig, ../utils/apiUtils, ../../types/administration | Dependencies: ../config/apiConfig, ../utils/apiUtils, zod
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: constants, classes | Key Features: Standard module
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

import { apiInstance } from '../config/api.config';
import { API_ENDPOINTS } from '../../constants/api';
import { ApiResponse, PaginatedResponse, buildPaginationParams } from '../utils/apiUtils';
import { z } from 'zod';
import {
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
} from '../../types/administration.types';

// ==================== VALIDATION SCHEMAS ====================

// ==================== USER VALIDATION SCHEMAS ====================

const createUserSchema = z.object({
  email: z.string()
    .email('Invalid email address')
    .max(255, 'Email cannot exceed 255 characters'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password cannot exceed 100 characters'),
  firstName: z.string()
    .min(1, 'First name is required')
    .max(100, 'First name cannot exceed 100 characters'),
  lastName: z.string()
    .min(1, 'Last name is required')
    .max(100, 'Last name cannot exceed 100 characters'),
  role: z.enum(['ADMIN', 'NURSE', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN', 'COUNSELOR', 'VIEWER']),
  schoolId: z.string().uuid('Invalid school ID format').optional(),
  districtId: z.string().uuid('Invalid district ID format').optional(),
});

const updateUserSchema = createUserSchema.partial().omit({ password: true });

// ==================== DISTRICT VALIDATION SCHEMAS ====================

const createDistrictSchema = z.object({
  name: z.string()
    .min(2, 'District name must be at least 2 characters')
    .max(200, 'District name cannot exceed 200 characters'),
  code: z.string()
    .min(2, 'District code must be at least 2 characters')
    .max(50, 'District code cannot exceed 50 characters')
    .regex(/^[A-Z0-9_-]+$/, 'District code can only contain uppercase letters, numbers, hyphens, and underscores')
    .transform(val => val.toUpperCase()),
  address: z.string()
    .max(500, 'Address cannot exceed 500 characters')
    .optional(),
  city: z.string()
    .max(100, 'City cannot exceed 100 characters')
    .optional(),
  state: z.string()
    .length(2, 'State must be a 2-letter abbreviation')
    .regex(/^[A-Z]{2}$/, 'State must be uppercase')
    .optional(),
  zipCode: z.string()
    .regex(/^[0-9]{5}(-[0-9]{4})?$/, 'ZIP code must be in format 12345 or 12345-6789')
    .optional(),
  phone: z.string()
    .min(10, 'Phone number must be at least 10 characters')
    .max(20, 'Phone number cannot exceed 20 characters')
    .regex(/^[\d\s\-\(\)\+\.]+$/, 'Phone number contains invalid characters')
    .optional(),
  email: z.string()
    .email('Invalid email address')
    .max(255, 'Email cannot exceed 255 characters')
    .optional()
    .or(z.literal('')),
  website: z.string()
    .url('Invalid URL format')
    .optional()
    .or(z.literal('')),
}).refine(data => data.phone || data.email || data.address, {
  message: 'District must have at least one form of contact information (phone, email, or address)',
  path: ['phone']
});

const updateDistrictSchema = createDistrictSchema.partial();

// ==================== SCHOOL VALIDATION SCHEMAS ====================

const createSchoolSchema = z.object({
  name: z.string()
    .min(2, 'School name must be at least 2 characters')
    .max(200, 'School name cannot exceed 200 characters'),
  code: z.string()
    .min(2, 'School code must be at least 2 characters')
    .max(50, 'School code cannot exceed 50 characters')
    .regex(/^[A-Z0-9_-]+$/, 'School code can only contain uppercase letters, numbers, hyphens, and underscores')
    .transform(val => val.toUpperCase()),
  districtId: z.string()
    .uuid('Invalid district ID format')
    .min(1, 'District ID is required'),
  address: z.string()
    .max(500, 'Address cannot exceed 500 characters')
    .optional(),
  city: z.string()
    .max(100, 'City cannot exceed 100 characters')
    .optional(),
  state: z.string()
    .length(2, 'State must be a 2-letter abbreviation')
    .regex(/^[A-Z]{2}$/, 'State must be uppercase')
    .optional(),
  zipCode: z.string()
    .regex(/^[0-9]{5}(-[0-9]{4})?$/, 'ZIP code must be in format 12345 or 12345-6789')
    .optional(),
  phone: z.string()
    .min(10, 'Phone number must be at least 10 characters')
    .max(20, 'Phone number cannot exceed 20 characters')
    .regex(/^[\d\s\-\(\)\+\.]+$/, 'Phone number contains invalid characters')
    .optional(),
  email: z.string()
    .email('Invalid email address')
    .max(255, 'Email cannot exceed 255 characters')
    .optional()
    .or(z.literal('')),
  principal: z.string()
    .max(200, 'Principal name cannot exceed 200 characters')
    .optional(),
  totalEnrollment: z.number()
    .min(0, 'Total enrollment cannot be negative')
    .max(50000, 'Total enrollment cannot exceed 50,000')
    .optional(),
}).refine(data => data.phone || data.email || data.address, {
  message: 'School must have at least one form of contact information (phone, email, or address)',
  path: ['phone']
});

const updateSchoolSchema = createSchoolSchema.partial().omit({ districtId: true });

// ==================== LICENSE VALIDATION SCHEMAS ====================

const createLicenseSchema = z.object({
  licenseKey: z.string()
    .min(10, 'License key must be at least 10 characters')
    .max(100, 'License key cannot exceed 100 characters')
    .regex(/^[A-Z0-9-]+$/, 'License key can only contain uppercase letters, numbers, and hyphens')
    .transform(val => val.toUpperCase()),
  type: z.enum(['TRIAL', 'BASIC', 'PROFESSIONAL', 'ENTERPRISE']),
  maxUsers: z.number()
    .min(1, 'Maximum users must be at least 1')
    .max(100000, 'Maximum users cannot exceed 100,000')
    .optional(),
  maxSchools: z.number()
    .min(1, 'Maximum schools must be at least 1')
    .max(10000, 'Maximum schools cannot exceed 10,000')
    .optional(),
  features: z.array(z.string())
    .min(1, 'At least one feature must be specified'),
  issuedTo: z.string()
    .max(200, 'Issued to field cannot exceed 200 characters')
    .optional(),
  expiresAt: z.string().or(z.date()).optional(),
  districtId: z.string().uuid('Invalid district ID format').optional(),
  notes: z.string()
    .max(2000, 'Notes cannot exceed 2000 characters')
    .optional(),
}).refine(data => {
  if (data.type === 'TRIAL') {
    if (!data.maxUsers || data.maxUsers > 10) {
      return false;
    }
    if (!data.maxSchools || data.maxSchools > 2) {
      return false;
    }
    if (!data.expiresAt) {
      return false;
    }
  }
  return true;
}, {
  message: 'Trial license must have maxUsers (<=10), maxSchools (<=2), and expiration date',
  path: ['type']
}).refine(data => {
  if (data.type === 'BASIC') {
    if (data.maxUsers && data.maxUsers > 50) return false;
    if (data.maxSchools && data.maxSchools > 5) return false;
  }
  return true;
}, {
  message: 'Basic license cannot have more than 50 users or 5 schools',
  path: ['type']
}).refine(data => {
  if (data.type === 'PROFESSIONAL') {
    if (data.maxUsers && data.maxUsers > 500) return false;
    if (data.maxSchools && data.maxSchools > 50) return false;
  }
  return true;
}, {
  message: 'Professional license cannot have more than 500 users or 50 schools',
  path: ['type']
});

const updateLicenseSchema = createLicenseSchema.partial();

// ==================== TRAINING MODULE VALIDATION SCHEMAS ====================

const createTrainingModuleSchema = z.object({
  title: z.string()
    .min(3, 'Title must be at least 3 characters')
    .max(200, 'Title cannot exceed 200 characters'),
  description: z.string()
    .max(2000, 'Description cannot exceed 2000 characters')
    .optional(),
  content: z.string()
    .min(10, 'Content must be at least 10 characters')
    .max(50000, 'Content cannot exceed 50,000 characters'),
  duration: z.number()
    .min(1, 'Duration must be at least 1 minute')
    .max(600, 'Duration cannot exceed 600 minutes (10 hours)')
    .optional(),
  category: z.enum(['HIPAA_COMPLIANCE', 'MEDICATION_MANAGEMENT', 'EMERGENCY_PROCEDURES', 'SYSTEM_TRAINING', 'SAFETY_PROTOCOLS', 'DATA_SECURITY']),
  isRequired: z.boolean().optional(),
  order: z.number()
    .min(0, 'Order cannot be negative')
    .max(10000, 'Order cannot exceed 10,000')
    .optional(),
  attachments: z.array(z.string().max(500, 'Attachment URL cannot exceed 500 characters'))
    .max(20, 'Cannot have more than 20 attachments')
    .optional(),
});

const updateTrainingModuleSchema = createTrainingModuleSchema.partial();

// ==================== CONFIGURATION VALIDATION SCHEMAS ====================

const configurationSchema = z.object({
  key: z.string()
    .min(2, 'Configuration key must be at least 2 characters')
    .max(255, 'Configuration key cannot exceed 255 characters')
    .regex(/^[a-zA-Z][a-zA-Z0-9._-]*$/, 'Key must start with a letter and contain only letters, numbers, dots, hyphens, and underscores'),
  value: z.string()
    .min(1, 'Configuration value is required'),
  category: z.enum(['GENERAL', 'SECURITY', 'NOTIFICATION', 'INTEGRATION', 'BACKUP', 'PERFORMANCE', 'HEALTHCARE', 'MEDICATION', 'APPOINTMENTS', 'UI', 'QUERY', 'FILE_UPLOAD', 'RATE_LIMITING', 'SESSION', 'EMAIL', 'SMS']),
  valueType: z.enum(['STRING', 'NUMBER', 'BOOLEAN', 'JSON', 'ARRAY', 'DATE', 'TIME', 'DATETIME', 'EMAIL', 'URL', 'COLOR', 'ENUM']).optional(),
  subCategory: z.string()
    .max(100, 'Sub-category cannot exceed 100 characters')
    .optional(),
  description: z.string()
    .max(1000, 'Description cannot exceed 1000 characters')
    .optional(),
  isPublic: z.boolean().optional(),
  isEditable: z.boolean().optional(),
  requiresRestart: z.boolean().optional(),
  scope: z.enum(['SYSTEM', 'DISTRICT', 'SCHOOL', 'USER']).optional(),
  scopeId: z.string().uuid('Scope ID must be a valid UUID').optional(),
  tags: z.array(z.string()).optional(),
  sortOrder: z.number()
    .min(0, 'Sort order cannot be negative')
    .optional(),
});

// Administration API class
export class AdministrationApi {
  // ==================== System Settings ====================

  /**
   * Get system settings grouped by category
   */
  async getSettings(): Promise<SystemSettings> {
    try {
      const response = await apiInstance.get<ApiResponse<SystemSettings>>(
        API_ENDPOINTS.ADMIN.SETTINGS
      );

      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error?.message || 'Failed to fetch system settings');
    }
  }

  /**
   * Update system settings
   */
  async updateSettings(settings: any[]): Promise<any[]> {
    try {
      const response = await apiInstance.put<ApiResponse<any[]>>(
        API_ENDPOINTS.ADMIN.SETTINGS,
        { settings }
      );

      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error?.message || 'Failed to update system settings');
    }
  }

  // ==================== User Management ====================

  /**
   * Get users with filtering and pagination
   */
  async getUsers(filters: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    isActive?: boolean;
  } = {}): Promise<PaginatedResponse<User>> {
    try {
      const params = new URLSearchParams();
      if (filters.page) params.append('page', String(filters.page));
      if (filters.limit) params.append('limit', String(filters.limit));
      if (filters.search) params.append('search', filters.search);
      if (filters.role) params.append('role', filters.role);
      if (filters.isActive !== undefined) params.append('isActive', String(filters.isActive));

      const response = await apiInstance.get<ApiResponse<PaginatedResponse<User>>>(
        `${API_ENDPOINTS.ADMIN.USERS}?${params.toString()}`
      );

      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error?.message || 'Failed to fetch users');
    }
  }

  /**
   * Create new user
   */
  async createUser(userData: z.infer<typeof createUserSchema>): Promise<User> {
    try {
      createUserSchema.parse(userData);

      const response = await apiInstance.post<ApiResponse<{ user: User }>>(
        API_ENDPOINTS.ADMIN.USERS,
        userData
      );

      return response.data.data.user;
    } catch (error: any) {
      if (error.name === 'ZodError') {
        throw new Error(`Validation error: ${error.errors[0].message}`);
      }
      throw new Error(error.response?.data?.error?.message || 'Failed to create user');
    }
  }

  /**
   * Update user
   */
  async updateUser(id: string, userData: z.infer<typeof updateUserSchema>): Promise<User> {
    try {
      if (!id) throw new Error('User ID is required');

      updateUserSchema.parse(userData);

      const response = await apiInstance.put<ApiResponse<{ user: User }>>(
        API_ENDPOINTS.ADMIN.USER_BY_ID(id),
        userData
      );

      return response.data.data.user;
    } catch (error: any) {
      if (error.name === 'ZodError') {
        throw new Error(`Validation error: ${error.errors[0].message}`);
      }
      throw new Error(error.response?.data?.error?.message || 'Failed to update user');
    }
  }

  /**
   * Delete (deactivate) user
   */
  async deleteUser(id: string): Promise<{ message: string }> {
    try {
      if (!id) throw new Error('User ID is required');

      const response = await apiInstance.delete<ApiResponse<{ message: string }>>(
        API_ENDPOINTS.ADMIN.USER_BY_ID(id)
      );

      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error?.message || 'Failed to delete user');
    }
  }

  // ==================== Districts ====================

  /**
   * Get all districts with pagination
   */
  async getDistricts(page: number = 1, limit: number = 20): Promise<PaginatedResponse<District>> {
    try {
      const response = await apiInstance.get<ApiResponse<PaginatedResponse<District>>>(
        `${API_ENDPOINTS.ADMIN.DISTRICTS}?page=${page}&limit=${limit}`
      );

      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error?.message || 'Failed to fetch districts');
    }
  }

  /**
   * Get district by ID
   */
  async getDistrictById(id: string): Promise<District> {
    try {
      if (!id) throw new Error('District ID is required');

      const response = await apiInstance.get<ApiResponse<{ district: District }>>(
        API_ENDPOINTS.ADMIN.DISTRICT_BY_ID(id)
      );

      return response.data.data.district;
    } catch (error: any) {
      throw new Error(error.response?.data?.error?.message || 'Failed to fetch district');
    }
  }

  /**
   * Create district
   */
  async createDistrict(districtData: z.infer<typeof createDistrictSchema>): Promise<District> {
    try {
      createDistrictSchema.parse(districtData);

      const response = await apiInstance.post<ApiResponse<{ district: District }>>(
        API_ENDPOINTS.ADMIN.DISTRICTS,
        districtData
      );

      return response.data.data.district;
    } catch (error: any) {
      if (error.name === 'ZodError') {
        throw new Error(`Validation error: ${error.errors[0].message}`);
      }
      throw new Error(error.response?.data?.error?.message || 'Failed to create district');
    }
  }

  /**
   * Update district
   */
  async updateDistrict(id: string, districtData: Partial<District>): Promise<District> {
    try {
      if (!id) throw new Error('District ID is required');

      const response = await apiInstance.put<ApiResponse<{ district: District }>>(
        API_ENDPOINTS.ADMIN.DISTRICT_BY_ID(id),
        districtData
      );

      return response.data.data.district;
    } catch (error: any) {
      throw new Error(error.response?.data?.error?.message || 'Failed to update district');
    }
  }

  /**
   * Delete district
   */
  async deleteDistrict(id: string): Promise<{ message: string }> {
    try {
      if (!id) throw new Error('District ID is required');

      const response = await apiInstance.delete<ApiResponse<{ message: string }>>(
        API_ENDPOINTS.ADMIN.DISTRICT_BY_ID(id)
      );

      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error?.message || 'Failed to delete district');
    }
  }

  // ==================== Schools ====================

  /**
   * Get all schools with pagination
   */
  async getSchools(page: number = 1, limit: number = 20, districtId?: string): Promise<PaginatedResponse<School>> {
    try {
      const params = new URLSearchParams();
      params.append('page', String(page));
      params.append('limit', String(limit));
      if (districtId) params.append('districtId', districtId);

      const response = await apiInstance.get<ApiResponse<PaginatedResponse<School>>>(
        `${API_ENDPOINTS.ADMIN.SCHOOLS}?${params.toString()}`
      );

      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error?.message || 'Failed to fetch schools');
    }
  }

  /**
   * Get school by ID
   */
  async getSchoolById(id: string): Promise<School> {
    try {
      if (!id) throw new Error('School ID is required');

      const response = await apiInstance.get<ApiResponse<{ school: School }>>(
        API_ENDPOINTS.ADMIN.SCHOOL_BY_ID(id)
      );

      return response.data.data.school;
    } catch (error: any) {
      throw new Error(error.response?.data?.error?.message || 'Failed to fetch school');
    }
  }

  /**
   * Create school
   */
  async createSchool(schoolData: z.infer<typeof createSchoolSchema>): Promise<School> {
    try {
      createSchoolSchema.parse(schoolData);

      const response = await apiInstance.post<ApiResponse<{ school: School }>>(
        API_ENDPOINTS.ADMIN.SCHOOLS,
        schoolData
      );

      return response.data.data.school;
    } catch (error: any) {
      if (error.name === 'ZodError') {
        throw new Error(`Validation error: ${error.errors[0].message}`);
      }
      throw new Error(error.response?.data?.error?.message || 'Failed to create school');
    }
  }

  /**
   * Update school
   */
  async updateSchool(id: string, schoolData: Partial<School>): Promise<School> {
    try {
      if (!id) throw new Error('School ID is required');

      const response = await apiInstance.put<ApiResponse<{ school: School }>>(
        API_ENDPOINTS.ADMIN.SCHOOL_BY_ID(id),
        schoolData
      );

      return response.data.data.school;
    } catch (error: any) {
      throw new Error(error.response?.data?.error?.message || 'Failed to update school');
    }
  }

  /**
   * Delete school
   */
  async deleteSchool(id: string): Promise<{ message: string }> {
    try {
      if (!id) throw new Error('School ID is required');

      const response = await apiInstance.delete<ApiResponse<{ message: string }>>(
        API_ENDPOINTS.ADMIN.SCHOOL_BY_ID(id)
      );

      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error?.message || 'Failed to delete school');
    }
  }

  // ==================== System Health ====================

  /**
   * Get system health metrics
   */
  async getSystemHealth(): Promise<SystemHealth> {
    try {
      const response = await apiInstance.get<ApiResponse<SystemHealth>>(
        API_ENDPOINTS.ADMIN.SYSTEM_HEALTH
      );

      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error?.message || 'Failed to fetch system health');
    }
  }

  // ==================== Backups ====================

  /**
   * Get backup logs
   */
  async getBackupLogs(page: number = 1, limit: number = 20): Promise<PaginatedResponse<BackupLog>> {
    try {
      const response = await apiInstance.get<ApiResponse<PaginatedResponse<BackupLog>>>(
        `${API_ENDPOINTS.ADMIN.BACKUPS}?page=${page}&limit=${limit}`
      );

      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error?.message || 'Failed to fetch backup logs');
    }
  }

  /**
   * Create manual backup
   */
  async createBackup(): Promise<BackupLog> {
    try {
      const response = await apiInstance.post<ApiResponse<{ backup: BackupLog }>>(
        API_ENDPOINTS.ADMIN.BACKUPS
      );

      return response.data.data.backup;
    } catch (error: any) {
      throw new Error(error.response?.data?.error?.message || 'Failed to create backup');
    }
  }

  // ==================== Licenses ====================

  /**
   * Get licenses
   */
  async getLicenses(page: number = 1, limit: number = 20): Promise<PaginatedResponse<License>> {
    try {
      const response = await apiInstance.get<ApiResponse<PaginatedResponse<License>>>(
        `${API_ENDPOINTS.ADMIN.LICENSES}?page=${page}&limit=${limit}`
      );

      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error?.message || 'Failed to fetch licenses');
    }
  }

  /**
   * Get license by ID
   */
  async getLicenseById(id: string): Promise<License> {
    try {
      if (!id) throw new Error('License ID is required');

      const response = await apiInstance.get<ApiResponse<{ license: License }>>(
        API_ENDPOINTS.ADMIN.LICENSE_BY_ID(id)
      );

      return response.data.data.license;
    } catch (error: any) {
      throw new Error(error.response?.data?.error?.message || 'Failed to fetch license');
    }
  }

  /**
   * Create license
   */
  async createLicense(licenseData: CreateLicenseData): Promise<License> {
    try {
      createLicenseSchema.parse(licenseData);

      const response = await apiInstance.post<ApiResponse<{ license: License }>>(
        API_ENDPOINTS.ADMIN.LICENSES,
        licenseData
      );

      return response.data.data.license;
    } catch (error: any) {
      if (error.name === 'ZodError') {
        throw new Error(`Validation error: ${error.errors[0].message}`);
      }
      throw new Error(error.response?.data?.error?.message || 'Failed to create license');
    }
  }

  /**
   * Update license
   */
  async updateLicense(id: string, data: UpdateLicenseData): Promise<License> {
    try {
      if (!id) throw new Error('License ID is required');

      const response = await apiInstance.put<ApiResponse<{ license: License }>>(
        API_ENDPOINTS.ADMIN.LICENSE_BY_ID(id),
        data
      );

      return response.data.data.license;
    } catch (error: any) {
      throw new Error(error.response?.data?.error?.message || 'Failed to update license');
    }
  }

  /**
   * Deactivate license
   */
  async deactivateLicense(id: string): Promise<License> {
    try {
      if (!id) throw new Error('License ID is required');

      const response = await apiInstance.post<ApiResponse<{ license: License }>>(
        API_ENDPOINTS.ADMIN.LICENSE_DEACTIVATE(id)
      );

      return response.data.data.license;
    } catch (error: any) {
      throw new Error(error.response?.data?.error?.message || 'Failed to deactivate license');
    }
  }

  // ==================== System Configurations ====================

  /**
   * Get all system configurations
   */
  async getConfigurations(category?: ConfigCategory): Promise<SystemConfiguration[]> {
    try {
      const params = new URLSearchParams();
      if (category) params.append('category', category);

      const response = await apiInstance.get<ApiResponse<{ configurations: SystemConfiguration[] }>>(
        `${API_ENDPOINTS.ADMIN.CONFIGURATIONS}${params.toString() ? '?' + params.toString() : ''}`
      );

      return response.data.data.configurations;
    } catch (error: any) {
      throw new Error(error.response?.data?.error?.message || 'Failed to fetch configurations');
    }
  }

  /**
   * Get configuration by key
   */
  async getConfigurationByKey(key: string): Promise<SystemConfiguration> {
    try {
      if (!key) throw new Error('Configuration key is required');

      const response = await apiInstance.get<ApiResponse<{ config: SystemConfiguration }>>(
        API_ENDPOINTS.ADMIN.CONFIGURATION_BY_KEY(key)
      );

      return response.data.data.config;
    } catch (error: any) {
      throw new Error(error.response?.data?.error?.message || 'Failed to fetch configuration');
    }
  }

  /**
   * Set/update configuration
   */
  async setConfiguration(configData: ConfigurationData, changedBy?: string): Promise<SystemConfiguration> {
    try {
      const response = await apiInstance.post<ApiResponse<{ config: SystemConfiguration }>>(
        API_ENDPOINTS.ADMIN.CONFIGURATIONS,
        { ...configData, changedBy }
      );

      return response.data.data.config;
    } catch (error: any) {
      throw new Error(error.response?.data?.error?.message || 'Failed to set configuration');
    }
  }

  /**
   * Delete configuration
   */
  async deleteConfiguration(key: string): Promise<{ message: string }> {
    try {
      if (!key) throw new Error('Configuration key is required');

      const response = await apiInstance.delete<ApiResponse<{ message: string }>>(
        API_ENDPOINTS.ADMIN.CONFIGURATION_BY_KEY(key)
      );

      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error?.message || 'Failed to delete configuration');
    }
  }

  // ==================== Performance Metrics ====================

  /**
   * Get performance metrics
   */
  async getMetrics(filters: MetricFilters = {}): Promise<PerformanceMetric[]> {
    try {
      const params = new URLSearchParams();
      if (filters.metricType) params.append('metricType', filters.metricType);
      if (filters.startDate) params.append('startDate', typeof filters.startDate === 'string' ? filters.startDate : filters.startDate.toISOString());
      if (filters.endDate) params.append('endDate', typeof filters.endDate === 'string' ? filters.endDate : filters.endDate.toISOString());
      if (filters.limit) params.append('limit', String(filters.limit));

      const response = await apiInstance.get<ApiResponse<{ metrics: PerformanceMetric[] }>>(
        `${API_ENDPOINTS.ADMIN.METRICS}?${params.toString()}`
      );

      return response.data.data.metrics;
    } catch (error: any) {
      throw new Error(error.response?.data?.error?.message || 'Failed to fetch metrics');
    }
  }

  /**
   * Record a performance metric
   */
  async recordMetric(metricData: RecordMetricData): Promise<PerformanceMetric> {
    try {
      const response = await apiInstance.post<ApiResponse<{ metric: PerformanceMetric }>>(
        API_ENDPOINTS.ADMIN.METRICS,
        metricData
      );

      return response.data.data.metric;
    } catch (error: any) {
      throw new Error(error.response?.data?.error?.message || 'Failed to record metric');
    }
  }

  // ==================== Training Modules ====================

  /**
   * Get all training modules
   */
  async getTrainingModules(category?: TrainingCategory): Promise<TrainingModule[]> {
    try {
      const params = new URLSearchParams();
      if (category) params.append('category', category);

      const response = await apiInstance.get<ApiResponse<{ modules: TrainingModule[] }>>(
        `${API_ENDPOINTS.ADMIN.TRAINING}${params.toString() ? '?' + params.toString() : ''}`
      );

      return response.data.data.modules;
    } catch (error: any) {
      throw new Error(error.response?.data?.error?.message || 'Failed to fetch training modules');
    }
  }

  /**
   * Get training module by ID
   */
  async getTrainingModuleById(id: string): Promise<TrainingModule> {
    try {
      if (!id) throw new Error('Module ID is required');

      const response = await apiInstance.get<ApiResponse<{ module: TrainingModule }>>(
        API_ENDPOINTS.ADMIN.TRAINING_BY_ID(id)
      );

      return response.data.data.module;
    } catch (error: any) {
      throw new Error(error.response?.data?.error?.message || 'Failed to fetch training module');
    }
  }

  /**
   * Create training module
   */
  async createTrainingModule(moduleData: CreateTrainingModuleData): Promise<TrainingModule> {
    try {
      createTrainingModuleSchema.parse(moduleData);

      const response = await apiInstance.post<ApiResponse<{ module: TrainingModule }>>(
        API_ENDPOINTS.ADMIN.TRAINING,
        moduleData
      );

      return response.data.data.module;
    } catch (error: any) {
      if (error.name === 'ZodError') {
        throw new Error(`Validation error: ${error.errors[0].message}`);
      }
      throw new Error(error.response?.data?.error?.message || 'Failed to create training module');
    }
  }

  /**
   * Update training module
   */
  async updateTrainingModule(id: string, moduleData: UpdateTrainingModuleData): Promise<TrainingModule> {
    try {
      if (!id) throw new Error('Module ID is required');

      const response = await apiInstance.put<ApiResponse<{ module: TrainingModule }>>(
        API_ENDPOINTS.ADMIN.TRAINING_BY_ID(id),
        moduleData
      );

      return response.data.data.module;
    } catch (error: any) {
      throw new Error(error.response?.data?.error?.message || 'Failed to update training module');
    }
  }

  /**
   * Delete training module
   */
  async deleteTrainingModule(id: string): Promise<{ message: string }> {
    try {
      if (!id) throw new Error('Module ID is required');

      const response = await apiInstance.delete<ApiResponse<{ message: string }>>(
        API_ENDPOINTS.ADMIN.TRAINING_BY_ID(id)
      );

      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error?.message || 'Failed to delete training module');
    }
  }

  /**
   * Record training completion
   */
  async recordTrainingCompletion(
    moduleId: string,
    completionData: RecordTrainingCompletionData = {}
  ): Promise<TrainingCompletion> {
    try {
      if (!moduleId) throw new Error('Module ID is required');

      const response = await apiInstance.post<ApiResponse<{ completion: TrainingCompletion }>>(
        API_ENDPOINTS.ADMIN.TRAINING_COMPLETE(moduleId),
        completionData
      );

      return response.data.data.completion;
    } catch (error: any) {
      throw new Error(error.response?.data?.error?.message || 'Failed to record training completion');
    }
  }

  /**
   * Get user training progress
   */
  async getUserTrainingProgress(userId: string): Promise<UserTrainingProgress> {
    try {
      if (!userId) throw new Error('User ID is required');

      const response = await apiInstance.get<ApiResponse<UserTrainingProgress>>(
        API_ENDPOINTS.ADMIN.TRAINING_PROGRESS(userId)
      );

      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error?.message || 'Failed to fetch user training progress');
    }
  }

  // ==================== Audit Logs ====================

  /**
   * Get audit logs
   */
  async getAuditLogs(filters: {
    page?: number;
    limit?: number;
    userId?: string;
    entityType?: string;
    entityId?: string;
    action?: string;
    startDate?: string;
    endDate?: string;
  } = {}): Promise<PaginatedResponse<AuditLog>> {
    try {
      const params = new URLSearchParams();
      if (filters.page) params.append('page', String(filters.page));
      if (filters.limit) params.append('limit', String(filters.limit));
      if (filters.userId) params.append('userId', filters.userId);
      if (filters.entityType) params.append('entityType', filters.entityType);
      if (filters.entityId) params.append('entityId', filters.entityId);
      if (filters.action) params.append('action', filters.action);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);

      const response = await apiInstance.get<ApiResponse<PaginatedResponse<AuditLog>>>(
        `${API_ENDPOINTS.ADMIN.AUDIT_LOGS}?${params.toString()}`
      );

      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error?.message || 'Failed to fetch audit logs');
    }
  }
}

// Export singleton instance
export const administrationApi = new AdministrationApi();
