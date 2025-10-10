import { apiInstance } from '../config/apiConfig';
import { ApiResponse, PaginatedResponse, buildPaginationParams } from '../utils/apiUtils';
import { z } from 'zod';

// Types
export interface SystemHealth {
  status: string;
  timestamp: string;
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

export interface SystemSettings {
  [category: string]: Array<{
    key: string;
    value: string;
    description?: string;
    isPublic: boolean;
    category: string;
  }>;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
  schoolId?: string;
  districtId?: string;
  createdAt: string;
  updatedAt: string;
}

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
  website?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

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
  studentCount?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BackupLog {
  id: string;
  type: 'AUTOMATIC' | 'MANUAL' | 'SCHEDULED';
  status: 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  fileName?: string;
  fileSize?: number;
  location?: string;
  startedAt: string;
  completedAt?: string;
  error?: string;
  triggeredBy?: string;
  createdAt: string;
}

export interface License {
  id: string;
  licenseKey: string;
  type: 'TRIAL' | 'BASIC' | 'PROFESSIONAL' | 'ENTERPRISE';
  status: 'ACTIVE' | 'EXPIRED' | 'SUSPENDED' | 'CANCELLED';
  maxUsers?: number;
  maxSchools?: number;
  features: string[];
  issuedTo?: string;
  issuedAt: string;
  expiresAt?: string;
  activatedAt?: string;
  deactivatedAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuditLog {
  id: string;
  userId?: string;
  action: string;
  entityType: string;
  entityId?: string;
  changes?: any;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

// Validation schemas
const createUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  role: z.enum(['ADMIN', 'NURSE', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN', 'COUNSELOR', 'VIEWER']),
  schoolId: z.string().optional(),
  districtId: z.string().optional(),
});

const updateUserSchema = createUserSchema.partial().omit({ password: true });

const createDistrictSchema = z.object({
  name: z.string().min(1, 'District name is required'),
  code: z.string().min(1, 'District code is required'),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  website: z.string().url().optional().or(z.literal('')),
});

const createSchoolSchema = z.object({
  name: z.string().min(1, 'School name is required'),
  code: z.string().min(1, 'School code is required'),
  districtId: z.string().min(1, 'District ID is required'),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  principal: z.string().optional(),
  studentCount: z.number().optional(),
});

// Administration API class
export class AdministrationApi {
  private readonly BASE_URL = '/api/admin';

  // ==================== System Settings ====================

  /**
   * Get system settings grouped by category
   */
  async getSettings(): Promise<SystemSettings> {
    try {
      const response = await apiInstance.get<ApiResponse<SystemSettings>>(
        `${this.BASE_URL}/settings`
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
        `${this.BASE_URL}/settings`,
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
        `${this.BASE_URL}/users?${params.toString()}`
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
        `${this.BASE_URL}/users`,
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
        `${this.BASE_URL}/users/${id}`,
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
        `${this.BASE_URL}/users/${id}`
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
        `${this.BASE_URL}/districts?page=${page}&limit=${limit}`
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
        `${this.BASE_URL}/districts/${id}`
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
        `${this.BASE_URL}/districts`,
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
        `${this.BASE_URL}/districts/${id}`,
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
        `${this.BASE_URL}/districts/${id}`
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
        `${this.BASE_URL}/schools?${params.toString()}`
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
        `${this.BASE_URL}/schools/${id}`
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
        `${this.BASE_URL}/schools`,
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
        `${this.BASE_URL}/schools/${id}`,
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
        `${this.BASE_URL}/schools/${id}`
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
        `${this.BASE_URL}/system-health`
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
        `${this.BASE_URL}/backups?page=${page}&limit=${limit}`
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
        `${this.BASE_URL}/backups`
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
        `${this.BASE_URL}/licenses?page=${page}&limit=${limit}`
      );

      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error?.message || 'Failed to fetch licenses');
    }
  }

  /**
   * Update license
   */
  async updateLicense(id: string, data: Partial<License>): Promise<License> {
    try {
      if (!id) throw new Error('License ID is required');

      const response = await apiInstance.put<ApiResponse<{ license: License }>>(
        `${this.BASE_URL}/licenses/${id}`,
        data
      );

      return response.data.data.license;
    } catch (error: any) {
      throw new Error(error.response?.data?.error?.message || 'Failed to update license');
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
        `${this.BASE_URL}/audit-logs?${params.toString()}`
      );

      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error?.message || 'Failed to fetch audit logs');
    }
  }
}

// Export singleton instance
export const administrationApi = new AdministrationApi();
